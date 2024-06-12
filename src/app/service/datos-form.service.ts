import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DatosFormService {
  private anoSeleccionado = new BehaviorSubject<number>(0);
  private mesSeleccionado = new BehaviorSubject<number>(0);
  private anoIdSeleccionado = new BehaviorSubject<number>(0);
  private mesIdSeleccionado = new BehaviorSubject<number>(0);

  anoSeleccionado$ = this.anoSeleccionado.asObservable();
  mesSeleccionado$ = this.mesSeleccionado.asObservable();
  anoIdSeleccionado$ = this.mesSeleccionado.asObservable();
  mesIdSeleccionado$ = this.mesSeleccionado.asObservable();

  actualizarAnoSeleccionado(ano: number) {
    this.anoSeleccionado.next(ano);
  }

  actualizarMesSeleccionado(mes: number) {
    this.mesSeleccionado.next(mes);
  }

  actualizarAnoIdSeleccionado(mes: number) {
    this.anoIdSeleccionado.next(mes);
  }

  actualizarMesIdSeleccionado(mes: number) {
    this.mesIdSeleccionado.next(mes);
  }
}
