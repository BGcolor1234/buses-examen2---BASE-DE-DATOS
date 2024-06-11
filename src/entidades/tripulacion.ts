import { Chofer } from "./choferes";
export class Tripulacion {
     idcodigo: string;
     chofer: Chofer[];

    constructor(idcodigo: string) {
        this.idcodigo = idcodigo;
        this.chofer = [];
    }

}