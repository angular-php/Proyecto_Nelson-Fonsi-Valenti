export class alumnoRanking{
  constructor(
    public nick: string,
    public pass: string,
    public email: string,
    public fname: string,
    public lname: string,
    public nombreEquipo: string,
    public puntos: number,
    public img?: string,
    public idAlum?: number
  ){}
}