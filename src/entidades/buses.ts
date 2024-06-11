import { Tripulacion } from './tripulacion';

export class Bus {
    codigobuses: string;
    placa: string;
    tipo: string;
    mantenimiento: boolean ;
    Tripulacion: Tripulacion[];
    constructor(codigobuses: string, placa: string, tipo: string, mantenimiento: boolean){
        this.codigobuses = codigobuses;
        this.placa = placa;
        this.tipo = tipo;
        this.mantenimiento = mantenimiento;
        this.Tripulacion = [];
    }
}