import { Bus } from "./buses";
import { Tripulacion } from "./tripulacion";

export class Viaje {
    codigo: string;
    origen: string;
    destino: string;
    fechahorasalida: string;
    fechahorallegada: string;
    bus: Bus[];
    tripulacion: Tripulacion[];
    estado: 'en curso' | 'completado' = 'en curso';

    constructor(codigo: string, origen: string, destino: string, fechahorasalida: string, fechahorallegada: string, estado: string, tripulacionId: string) {
        this.codigo = codigo;
        this.origen = origen;
        this.destino = destino;
        this.fechahorasalida = fechahorasalida;
        this.fechahorallegada = fechahorallegada;
        this.bus = [];
        this.tripulacion = []; // Inicializar el arreglo de tripulación
        this.estado = estado === 'en curso' || estado === 'completado' ? estado : 'en curso';
        if (tripulacionId) {
            const tripulacion = new Tripulacion(tripulacionId); // Crear un objeto Tripulacion usando el tripulacionId
            this.tripulacion.push(tripulacion); // Agregar el objeto Tripulacion al arreglo
        }
    }
}
