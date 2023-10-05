import { UUID } from 'crypto';
import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Vehiculo {
    
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    marca: string

    @Column()
    modelo: string

    @Column()
    color: string

    @Column('int')
    año: number
}
