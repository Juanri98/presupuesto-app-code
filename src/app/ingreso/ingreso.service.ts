import { Ingreso } from './ingreso.model';

export class IngresoServicio {
  ingresos: Ingreso[] = [];

  eliminar(ingreso: Ingreso) {
    const indice: number = this.ingresos.indexOf(ingreso);
    this.ingresos.splice(indice, 1);
  }

  clearList() {
    this.ingresos.length = 0;
  }
}
