import { Bus } from "../entidades/buses";
import { db, ref, set, get, update, remove } from "../conexion/conexionfirebase";

export class TlistaBus {

    constructor() {}

    async Insertar(op: Bus) {
        const newRef = ref(db, 'buses/' + op.codigobuses);
        await set(newRef, op);
    }

    async Modificar(codigo: string, op: Bus) {
        const busRef = ref(db, 'buses/' + codigo);
        await update(busRef, op);
    }

    async modificarBus(codigo: string, busActualizado: Bus): Promise<void> {
        const busRef = ref(db, 'buses/' + codigo);
        await update(busRef, busActualizado);
    }

    async Eliminar(codigo: string) {
        const busRef = ref(db, 'buses/' + codigo);
        await remove(busRef);
    }

    async listarBuses(): Promise<Bus[]> {
        const busesRef = ref(db, 'buses');
        const snapshot = await get(busesRef);
        if (snapshot.exists()) {
            return Object.values(snapshot.val());
        } else {
            return [];
        }
    }

    async Listar(): Promise<void> {
        const buses = await this.listarBuses();
        buses.forEach(bus => {
            console.log(bus);
        });
    }

    async contarBuses(): Promise<number> {
        const buses = await this.listarBuses();
        return buses.length;
    }

    // Método para obtener un bus por su código
    async obtenerBusPorCodigo(codigo: string): Promise<Bus | undefined> {
        const buses = await this.listarBuses();
        return buses.find(bus => bus.codigobuses === codigo);
    }
}
