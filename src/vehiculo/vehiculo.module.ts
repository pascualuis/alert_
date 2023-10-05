import { Module } from '@nestjs/common';
import { VehiculoService } from './vehiculo.service';
import { VehiculoController } from './vehiculo.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Vehiculo } from './entities/vehiculo.entity';

@Module({
  controllers: [VehiculoController],
  providers: [VehiculoService],
  imports: [
    TypeOrmModule.forFeature([Vehiculo])
  ]
})
export class VehiculoModule {}
