import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AniosService } from '../service/tables.service';
import { SnackbarService } from '../shared/snackbar/snackbar.service';
import { Anios } from '../interface/anios.interface';
@Component({
  selector: 'app-cabecero',
  templateUrl: './cabecero.component.html',
  styleUrls: ['./cabecero.component.css'],
})
export class CabeceroComponent implements OnInit {
  @Input() presupuestoTotal: number;
  @Input() ingresoTotal: number;
  @Input() egresoTotal: number;
  @Input() porcentajeTotal: number;
  @Input() aniosList: Anios[];

  @Output() loadCabecero = new EventEmitter<boolean>();

  imagenesFondo: string[] = [
    'assets/2.jpg',
    'assets/3.jpg',
    'assets/4.jpg',
    'assets/5.jpg',
    'assets/6.jpg',
    'assets/7.jpg',
    'assets/8.jpg',
    'assets/9.jpg',
    'assets/10.jpg',
    'assets/11.jpg',
    'assets/12.jpg',
    'assets/13.jpg',
    'assets/14.jpg',
    'assets/15.jpg',
    'assets/16.jpg',
    'assets/17.jpg',
    'assets/18.jpg',
    'assets/19.jpg',
    'assets/20.jpg',
  ];

  fondoActualIndex: number = 0;

  get fondoActual(): string {
    return this.imagenesFondo[this.fondoActualIndex];
  }
  private cambioAutomaticoInterval: any;

  constructor(
    private aniosService: AniosService,
    private snackbarService: SnackbarService
  ) {}

  ngOnInit() {
    this.iniciarCambioAutomatico();
  }

  ngOnDestroy() {
    this.detenerCambioAutomatico();
  }

  cambiarFondo(delta: number) {
    this.fondoActualIndex += delta;

    if (this.fondoActualIndex < 0) {
      this.fondoActualIndex = this.imagenesFondo.length - 1;
    } else if (this.fondoActualIndex >= this.imagenesFondo.length) {
      this.fondoActualIndex = 0;
    }
  }

  iniciarCambioAutomatico() {
    this.detenerCambioAutomatico();
    this.cambioAutomaticoInterval = setInterval(() => {
      this.cambiarFondo(1);
    }, 10000);
  }

  detenerCambioAutomatico() {
    if (this.cambioAutomaticoInterval) {
      clearInterval(this.cambioAutomaticoInterval);
    }
  }

  async agregarNuevoDato() {
    const tabla = 'anios';
    const ultimoObjeto = this.aniosList[this.aniosList.length - 1];
    const nuevoDato = ultimoObjeto.anio + 1;
    this.loadCabecero.emit(true);
    const { error } = await this.aniosService.agregarDato(tabla, {
      anio: nuevoDato,
    });

    if (error) {
      this.loadCabecero.emit(false);
      this.snackbarService.mostrarMensaje(`Error al agregar el dato: ${error}`);
    } else {
      this.loadCabecero.emit(false);
      this.snackbarService.mostrarMensaje(
        `Año ${nuevoDato} agregado con éxito`
      );
    }
  }

  async eliminarDato() {
    const tabla = 'anios';
    const ultimoObjeto = this.aniosList[this.aniosList.length - 1];
    this.loadCabecero.emit(true);
    const { error } = await this.aniosService.eliminarDato(
      tabla,
      ultimoObjeto.id
    );

    if (error) {
      this.loadCabecero.emit(false);
      this.snackbarService.mostrarMensaje(
        `Error al eliminar el dato: ${error}`
      );
    } else {
      this.loadCabecero.emit(false);
      this.snackbarService.mostrarMensaje(
        `Año ${ultimoObjeto.anio} eliminado con éxito`
      );
    }
  }
}
