export class alumnoRanking{
  constructor(
    public nick: string,
    public pass: string,
    public email: string,
    public fname: string,
    public lname: string,
    public nombreEquipo: string,
    public puntos: number,
    public posicion?: number,
    public img?: string,
    public idAlum?: number,
    public actual?: boolean,
    public cooperacion?: any,
    public emociones?: any,
    public iniciativa?: any,
    public pensamiento?: any,
    public responsabilidad?: any,
    public lvlCooperacion?: number,
    public lvlEmociones?: number,
    public lvlIniciativa?: number,
    public lvlPensamiento?: number,
    public lvlResponsabilidad?: number,
    public idRank?: number,
    public idEj?: number,
  ){}
}
