export class Egreso {
  constructor(
    public id: number,
    public descripcion: String,
    public valor: number | string,
    public fecha: Date
  ) {}
}
