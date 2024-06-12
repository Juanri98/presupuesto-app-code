import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { supabase } from '../../config/supabase-config';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Ingreso } from '../ingreso/ingreso.model';
import { Egreso } from '../egreso/egreso.model';
import { IngresoServicio } from '../ingreso/ingreso.service';
import { EgresoServicio } from '../egreso/egreso.service';
import { MovimientosService } from '../service/movimientos.service';
import { DatosFormService } from '../service/datos-form.service';
@Component({
  selector: 'app-tabs-anios-meses',
  templateUrl: './tabs-anios-meses.component.html',
  styleUrls: ['./tabs-anios-meses.component.css'],
})
export class TabsAniosMesesComponent implements OnInit {
  @Output() aniosList = new EventEmitter<any>();
  @Input() presupuestoTotal: number;
  showContent = false;
  showDatos = true;
  datosPorAnio = [];
  ingresos: Ingreso[] = [];
  egresos: Egreso[] = [];
  anoForm: number;
  mesForm: number;

  constructor(
    private ingresoServicio: IngresoServicio,
    private egresoServicio: EgresoServicio,
    private movimientosService: MovimientosService,
    private datosFormService: DatosFormService
  ) {
    this.ingresos = this.ingresoServicio.ingresos;
    this.egresos = this.egresoServicio.egresos;
  }

  async ngOnInit() {
    const { data: aniosData, error: aniosError } = await supabase
      .from('anios')
      .select('*');

    const { data: mesesData, error: mesesError } = await supabase
      .from('meses')
      .select('*');

    if (aniosError || mesesError) {
      console.error('Error al obtener los datos:', aniosError || mesesError);
    } else {
      this.aniosList.emit(aniosData);
      const resultado = [];
      aniosData.forEach((anio) => {
        resultado.push({ idAno: anio.id, ano: anio.anio, meses: mesesData });
      });
      this.datosPorAnio = [...resultado];
      setTimeout(() => {
        const eventoSimulado: MatTabChangeEvent = {
          index: 0,
          tab: null,
        };
        this.onMesTabChange(eventoSimulado, 0);
        this.showContent = true;
      });
    }
  }

  onAnioTabChange(event: MatTabChangeEvent) {
    const eventoSimulado: MatTabChangeEvent = {
      index: 0,
      tab: null,
    };
    this.onMesTabChange(eventoSimulado, event.index);
  }

  onMesTabChange(event: MatTabChangeEvent, IndexAnio: number) {
    const anioSeleccionado = this.datosPorAnio[IndexAnio].ano;
    const mesSeleccionado = this.datosPorAnio[IndexAnio].meses[event.index].mes;
    this.datosFormService.actualizarAnoSeleccionado(anioSeleccionado);
    this.datosFormService.actualizarMesSeleccionado(event.index);
    this.getDatosEgresosIngresos(anioSeleccionado, mesSeleccionado);
  }

  getDatosEgresosIngresos(anioSeleccionado: number, mesSeleccionado: string) {
    this.obtenerDatosDeTransaccionesPorAnioYMes(
      anioSeleccionado,
      mesSeleccionado
    )
      .then((response) => {
        let itemsI: Ingreso[] = [];
        let itemsE: Egreso[] = [];
        this.ingresoServicio.clearList();
        this.egresoServicio.clearList();

        response.forEach((element) => {
          if (element.ingreso) {
            itemsI.push(
              new Ingreso(
                element.id,
                element.desc,
                element.ingreso,
                element.fecha
              )
            );
          } else {
            itemsE.push(
              new Egreso(
                element.id,
                element.desc,
                element.egreso,
                element.fecha
              )
            );
          }
        });

        this.ingresos.push(...itemsI);
        this.egresos.push(...itemsE);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  getIngresoTotal() {
    let ingresoTotal: number = 0;
    this.ingresos.forEach((ingreso) => {
      ingresoTotal += parseInt(ingreso.valor.toString());
    });
    return ingresoTotal;
  }

  async obtenerDatosDeTransaccionesPorAnioYMes(
    anio: number,
    mes: string
  ): Promise<any[]> {
    try {
      const anioId = await this.obtenerIdAnio(anio);
      const mesId = await this.obtenerIdMes(mes);

      if (anioId && mesId) {
        const transacciones = await this.obtenerTransaccionesPorAnioYMes(
          anioId,
          mesId
        );
        return transacciones;
      }
      return [];
    } catch (error) {
      console.error('Error al obtener datos de transacciones:', error);
      throw error;
    }
  }

  private async obtenerIdAnio(anio: number): Promise<number | null> {
    const aniosResponse = await this.movimientosService.obtenerAnioPorValor(
      anio
    );
    return aniosResponse ? aniosResponse.id : null;
  }

  private async obtenerIdMes(mes: string): Promise<number | null> {
    const mesesResponse = await this.movimientosService.obtenerMesPorValor(mes);
    return mesesResponse ? mesesResponse.id : null;
  }

  private async obtenerTransaccionesPorAnioYMes(
    anioId: number | null,
    mesId: number | null
  ): Promise<any[]> {
    if (anioId && mesId) {
      return this.movimientosService.obtenerTransaccionesPorAnioYMes(
        anioId,
        mesId
      );
    }
    return [];
  }

  showDatosOutput(event: boolean) {
    let anioSel;
    let mesSel;
    if (!event) {
      this.datosFormService.anoSeleccionado$.subscribe((ano) => {
        this.datosFormService.mesSeleccionado$.subscribe((mes) => {
          mesSel = this.datosPorAnio[0].meses[mes].mes;
          anioSel = ano;
        });
      });
      this.getDatosEgresosIngresos(anioSel, mesSel);
    }

    this.showDatos = !event;
  }
}
