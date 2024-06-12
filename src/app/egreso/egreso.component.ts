import { Component, Input, OnInit } from '@angular/core';
import { Egreso } from './egreso.model';
import { EgresoServicio } from './egreso.service';
import { AniosService } from '../service/tables.service';
import { SnackbarService } from '../shared/snackbar/snackbar.service';

@Component({
  selector: 'app-egreso',
  templateUrl: './egreso.component.html',
  styleUrls: ['./egreso.component.css'],
})
export class EgresoComponent implements OnInit {
  egresos: Egreso[] = [];
  tabla = 'movimientos';
  @Input() ingresoTotal: number;

  constructor(
    private egresoService: EgresoServicio,
    private tablesService: AniosService,
    private snackbarService: SnackbarService
  ) {}

  ngOnInit(): void {
    this.egresos = this.egresoService.egresos;
  }

  eliminarEgreso(egreso: Egreso) {
    if (egreso) {
      this.egresoService.eliminar(egreso);
      this.eliminarDato(egreso.id);
    }
  }

  calcularPorcentaje(egreso: Egreso) {
    return parseInt(egreso.valor.toString()) / this.ingresoTotal;
  }

  async eliminarDato(id: number) {
    const { error } = await this.tablesService.eliminarDato(this.tabla, id);

    if (error) {
      this.snackbarService.mostrarMensaje(
        `Error al eliminar el Egreso: ${error}`
      );
    } else {
      this.snackbarService.mostrarMensaje(`Egreso eliminado con éxito`);
    }
  }
}
