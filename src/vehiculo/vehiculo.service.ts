import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateVehiculoDto } from './dto/create-vehiculo.dto';
import { UpdateVehiculoDto } from './dto/update-vehiculo.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';

import { Vehiculo } from './entities/vehiculo.entity';

import { validate as isUUID } from 'uuid';

@Injectable()
export class VehiculoService {

  private readonly logger = new Logger('VehiculoService')

   constructor(
    @InjectRepository(Vehiculo)
    private readonly vehiculoRepository: Repository<Vehiculo>,
   ){}

  async create(createVehiculoDto: CreateVehiculoDto) {

    try {
      const vehiculo = this.vehiculoRepository.create(createVehiculoDto);
      await this.vehiculoRepository.save(vehiculo);

      return vehiculo;

    } catch (error) {
      this.handleDBExceptions(error);
    }

  }

  //Paginar
  findAll( paginationDto: PaginationDto) {

    const { limit = 10, offset = 0 } = paginationDto;

    return this.vehiculoRepository.find({
      take: limit,
      skip: offset,
      //Relaciones pendiente
    })
  }

  async findOne(term: string) {
    let vehiculo: Vehiculo ;

    if(isUUID(term)){
      vehiculo = await this.vehiculoRepository.findOneBy({id:term});
    } else{
      const queryBuilder = this.vehiculoRepository.createQueryBuilder();
      vehiculo = await queryBuilder
      .where(' UPPER(marca) =:marca or LOWER(modelo)=:modelo',{
        marca: term.toUpperCase(),
        modelo: term.toLowerCase(),
      }).getOne();
    }

     if ( !vehiculo )
       throw new NotFoundException(`El producto con el id ${ term } no fue encontrado`);
     return vehiculo;
  }

  async update(id: string, updateVehiculoDto: UpdateVehiculoDto) {
      const vehiculo = await this.vehiculoRepository.preload({
        id: id,
        ...updateVehiculoDto
      })

      if (!vehiculo) throw new NotFoundException(`Product with id: ${ id } not found`)
      await this.vehiculoRepository.save(vehiculo);

    // return `This action updates a #${id} vehiculo`;
    return vehiculo;
  }

  async remove(id: string) {

   const vehiculo = await this.findOne(id)
   await this.vehiculoRepository.remove(vehiculo)
  }


  private handleDBExceptions( error: any){
    if ( error.code === '23505')
      throw new BadRequestException(error.detail);

      this.logger.error(error)
      throw new InternalServerErrorException('Unexpected error, check server logs');

  }

}
