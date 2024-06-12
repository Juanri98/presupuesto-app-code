import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  constructor(private snackBar: MatSnackBar) {}

  mostrarMensaje(mensaje: string, duracion: number = 3000) {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: duracion,
    });
  }
}
