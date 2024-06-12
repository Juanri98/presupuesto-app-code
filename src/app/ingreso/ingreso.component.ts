import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Ingreso } from './ingreso.model';
import { IngresoServicio } from './ingreso.service';
import { MovimientosService } from '../service/movimientos.service';
import { AniosService } from '../service/tables.service';
import { SnackbarService } from '../shared/snackbar/snackbar.service';

@Component({
  selector: 'app-ingreso',
  templateUrl: './ingreso.component.html',
  styleUrls: ['./ingreso.component.css'],
})
export class IngresoComponent implements OnInit {
  tabla = 'movimientos';
  ingresos: Ingreso[] = [];
  datosDeTabla: any[] = [];
  constructor(
    private ingresoServicio: IngresoServicio,
    private tablesService: AniosService,
    private snackbarService: SnackbarService
  ) {}

  ngOnInit(): void {
    this.ingresos = this.ingresoServicio.ingresos;
  }

  eliminarRegistro(ingreso: Ingreso) {
    if (ingreso) {
      this.ingresoServicio.eliminar(ingreso);
      this.eliminarDato(ingreso.id);
    }
  }

  async eliminarDato(id: number) {
    const { error } = await this.tablesService.eliminarDato(this.tabla, id);

    if (error) {
      this.snackbarService.mostrarMensaje(
        `Error al eliminar el Ingreso: ${error}`
      );
    } else {
      this.snackbarService.mostrarMensaje(`Ingreso eliminado con éxito`);
    }
  }
}
