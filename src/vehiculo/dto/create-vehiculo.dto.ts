import { IsNumber, IsPositive, IsString, MinLength } from "class-validator";


export class CreateVehiculoDto {

    @IsString()
    @MinLength(1)
    marca: string;

    @IsString()
    @MinLength(1)
    modelo: string;

    @IsString()
    @MinLength(1)
    color: string;

    @IsNumber()
    @IsPositive()
    año: number;

}
