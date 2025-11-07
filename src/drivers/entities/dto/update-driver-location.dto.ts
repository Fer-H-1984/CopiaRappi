import { IsNumber, Min, Max } from 'class-validator';

/**
 *  Dto para actualizar la localizacion del driver
 * 
 * Este DTO se usará cuando el driver (desde su app móvil) envíe su ubicación.
 */
export class UpdateDriverLocationDto {
  
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude: number; // Latitud: -90 a 90

  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude: number; // Longitud: -180 a 180
}