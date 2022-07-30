import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';

@Injectable()
export class PokemonService {

  constructor(
    // Inyección de dependencias
    @InjectModel( Pokemon.name ) // Inyectarlo como modelo
    private readonly pokemonModel: Model<Pokemon> // Entity
  ){}

  async create(createPokemonDto: CreatePokemonDto) {
    
    createPokemonDto.name = createPokemonDto.name.toLowerCase();
    
    try {
      const pokemon = await this.pokemonModel.create( createPokemonDto ); 
      return pokemon;
    } catch ( error ) {
      this.handleExceptions( error );
    }
    

  }

  findAll() {
    return `This action returns all pokemon`;
  }

  async findOne( term: string ) {
    
    let pokemon: Pokemon;

    if( !isNaN( +term ) ) {
      pokemon = await this.pokemonModel.findOne({
        no: term
      });
    }

    // MongoID
    if( !pokemon && isValidObjectId( term ) ) {
      pokemon = await this.pokemonModel.findById( term );
    }

    // Name
    if( !pokemon ) {
      pokemon = await this.pokemonModel.findOne({
        name: term.toLowerCase().trim()
      });
    }

    if( !pokemon ) {
      throw new NotFoundException(`Pokemon with id, name or no "${ term }" not found`);
    }
    
    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    
    const pokemon = await this.findOne( term );

    if( updatePokemonDto.name ) 
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase();

    // Manejar errores en caso de que ya exista el pokemon o el número en la base de datos.
    try {
      await pokemon.updateOne( updatePokemonDto ); // , { new: true } // new: true = devolver el objeto modificado | new: false = devolver el objeto anterior
      
      return { ...pokemon.toJSON(), ...updatePokemonDto };
    } catch (error) {
      this.handleExceptions( error );
    }
  }

  async remove( id: string ) {
    
    // const pokemon = await this.findOne( id );
    // await pokemon.deleteOne();
    // const result = await this.pokemonModel.findByIdAndDelete( id );

    const { deletedCount } = await this.pokemonModel.deleteOne({ _id: id });

    if( deletedCount === 0 )
      throw new BadRequestException(`Pokemon with id "${ id }" not found`);

    return;

  }

  private handleExceptions( error: any ) {
    if( error.code === 11000 ) {
      throw new BadRequestException(`Pokemon exists in db ${ JSON.stringify( error.keyValue ) }`);
    }

    console.log( error );
    throw new InternalServerErrorException(`Can't create pokemon - Check server logs`);
  }
}
