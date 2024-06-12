import { Egreso } from './egreso.model';

export class EgresoServicio {
  egresos: Egreso[] = [];

  eliminar(egreso: Egreso) {
    const indice = this.egresos.indexOf(egreso);
    this.egresos.splice(indice, 1);
  }

  clearList() {
    this.egresos.length = 0;
  }
}
