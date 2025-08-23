import { Injectable } from '@nestjs/common';

@Injectable()
export class RestaurantesService {
  private restaurantes = [
    { id: 1, nombre: 'Pizza Loca', tipo: 'Italiana' },
    { id: 2, nombre: 'Sushi Zen', tipo: 'Japonesa' },
    { id: 3, nombre: 'Taco Rico', tipo: 'Mexicana' },
    { id: 4, nombre: 'Burger Town', tipo: 'Americana' },
  ];

  buscar(nombre?: string, tipo?: string) {
    return this.restaurantes.filter((r) => {
      const coincideNombre = nombre ? r.nombre.toLowerCase().includes(nombre.toLowerCase()) : true;
      const coincideTipo = tipo ? r.tipo.toLowerCase().includes(tipo.toLowerCase()) : true;
      return coincideNombre && coincideTipo;
    });
  }
}
