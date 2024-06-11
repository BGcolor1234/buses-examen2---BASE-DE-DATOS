import { Tripulacion } from "../entidades/tripulacion";
import { db, ref, set, get, update, remove,  } from "../conexion/conexionfirebase"

export class Tlistatripulacion {

    constructor() {}

    async Insertar(op: Tripulacion) {
        const newRef = ref(db, 'tripulaciones/' + op.idcodigo);
        await set(newRef, op);
    }

    async listarTripulaciones(): Promise<Tripulacion[]> {
        const tripulacionesRef = ref(db, 'tripulaciones');
        const snapshot = await get(tripulacionesRef);
        if (snapshot.exists()) {
            return Object.values(snapshot.val());
        } else {
            return [];
        }
    }

    async Modificar(codigo: string, op: Tripulacion) {
        const tripulacionRef = ref(db, 'tripulaciones/' + codigo);
        await update(tripulacionRef, op);
    }

    async modificarTripulacion(codigo: string, tripulacionActualizada: Tripulacion): Promise<void> {
        const tripulacionRef = ref(db, 'tripulaciones/' + codigo);
        await update(tripulacionRef, tripulacionActualizada);
    }

    async Eliminar(codigo: string) {
        const tripulacionRef = ref(db, 'tripulaciones/' + codigo);
        await remove(tripulacionRef);
    }

    async eliminarTripulacion(codigo: string): Promise<void> {
        const tripulacionRef = ref(db, 'tripulaciones/' + codigo);7
        await remove(tripulacionRef);
    }

    async Listar(): Promise<void> {
        const tripulaciones = await this.listarTripulaciones();
        tripulaciones.forEach(tripulacion => {
            console.log(tripulacion);
        });
    }
}
