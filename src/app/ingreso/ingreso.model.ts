export class Ingreso {
  constructor(
    public id: number,
    public descripcion: String,
    public valor: number | string,
    public fecha: Date
  ) {}
}
