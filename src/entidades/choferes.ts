export class Chofer {
    public codigo: string;
    public cedula: string;
    public nombres: string;
    public apellidos: string;
    public fechanacimiento: string;
    public anosConduccion: string;

    constructor(codigo: string, cedula: string, nombres: string, apellidos: string, fechanacimiento: string, anosConduccion: string) {
        this.codigo = codigo;
        this.cedula = cedula;
        this.nombres = nombres;
        this.apellidos = apellidos;
        this.fechanacimiento = fechanacimiento;
        this.anosConduccion = anosConduccion;
    }
}