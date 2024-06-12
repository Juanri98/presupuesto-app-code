import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Egreso } from '../egreso/egreso.model';
import { EgresoServicio } from '../egreso/egreso.service';
import { Ingreso } from '../ingreso/ingreso.model';
import { Movimientos } from '../interface/movimientos.interface';
import { IngresoServicio } from '../ingreso/ingreso.service';
import { DatosFormService } from '../service/datos-form.service';
import { AniosService } from '../service/tables.service';
import { SnackbarService } from '../shared/snackbar/snackbar.service';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-formulario',
  templateUrl: './formulario.component.html',
  styleUrls: ['./formulario.component.css'],
})
export class FormularioComponent implements OnInit {
  @Input() ano: number;
  @Input() mes: number;
  @Input() presupuestoTotal: number;
  @Input() idAnio: number;
  @Input() idMes: number;
  tipo: string = 'ingresoOperacion';
  tabla = 'movimientos';
  minDate: string;
  maxDate: string;
  @Output() loadCabecero = new EventEmitter<boolean>();
  formEnvio: FormGroup;

  constructor(
    private datosFormService: DatosFormService,
    private tablesService: AniosService,
    private snackbarService: SnackbarService,
    private fb: FormBuilder
  ) {
    this.formEnvio = this.fb.group({
      descripcionInput: ['', Validators.required],
      valorInput: ['', Validators.required],
      FechaInput: [null, Validators.required],
    });
  }

  get descripcionInput(): AbstractControl<string> {
    return this.formEnvio.get('descripcionInput');
  }
  get valorInput(): AbstractControl<string> {
    return this.formEnvio.get('valorInput');
  }
  get FechaInput(): AbstractControl<Date> {
    return this.formEnvio.get('FechaInput');
  }

  ngOnInit(): void {
    this.datosFormService.anoSeleccionado$.subscribe((ano) => {
      this.ano = ano;
      this.datosFormService.mesSeleccionado$.subscribe((mes) => {
        this.mes = mes;
        this.setMinAndMaxDate();
      });
    });
  }

  tipoOperacion(evento) {
    this.tipo = evento.target.value;
  }

  agregarValor() {
    let dato: Movimientos;
    const textoSinPuntosYComas = this.valorInput.value.replace(/[,.]/g, '');
    const numero = parseFloat(textoSinPuntosYComas);
    console.log(this.idAnio, 'anio');
    console.log(this.idMes, 'mes');
    if (this.tipo === 'ingresoOperacion') {
      dato = {
        fecha: this.FechaInput.value,
        desc: this.descripcionInput.value,
        anio: this.idAnio,
        mes: this.idMes,
        egreso: null,
        ingreso: numero,
        total: this.presupuestoTotal,
      };
    } else {
      dato = {
        fecha: this.FechaInput.value,
        desc: this.descripcionInput.value,
        anio: this.idAnio,
        mes: this.idMes,
        egreso: numero,
        ingreso: null,
        total: this.presupuestoTotal,
      };
    }
    this.agregarNuevoDato(dato);
  }
  enviarFormulario(evento: Event) {
    evento.preventDefault();
    if (this.formEnvio.invalid) {
      this.snackbarService.mostrarMensaje('Formulario Incompleto');
    } else {
      this.agregarValor();
    }
  }

  setMinAndMaxDate() {
    const primerDia = new Date(this.ano, this.mes, 1);
    const ultimoDia = new Date(this.ano, this.mes + 1, 0);

    this.minDate = this.formatDate(primerDia);
    this.maxDate = this.formatDate(ultimoDia);
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  async agregarNuevoDato(mov: Movimientos) {
    this.loadCabecero.emit(true);
    const { error } = await this.tablesService.agregarDato(this.tabla, mov);

    if (error) {
      this.loadCabecero.emit(false);
      this.snackbarService.mostrarMensaje(`Error al agregar el dato: ${error}`);
    } else {
      this.loadCabecero.emit(false);
      this.descripcionInput.setValue('');
      this.valorInput.setValue('');
      this.FechaInput.setValue(null);
      this.snackbarService.mostrarMensaje('Movimiento agregado con éxito');
    }
  }
}
