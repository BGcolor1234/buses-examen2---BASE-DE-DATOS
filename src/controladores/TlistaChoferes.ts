import { Chofer } from "../entidades/choferes";
import { db, ref, set, get, update, remove, } from "../conexion/conexionfirebase";

export class Tlistachoferes {

    constructor() {}

    async Insertar(op: Chofer) {
        const newRef = ref(db, 'choferes/' + op.codigo);
        await set(newRef, op);
    }

    async Modificar(codigo: string, op: Chofer) {
        const choferRef = ref(db, 'choferes/' + codigo);
        await update(choferRef, op);
    }

    async modificarChofer(codigo: string, choferActualizado: Chofer) {
        const choferRef = ref(db, 'choferes/' + codigo);
        await update(choferRef, choferActualizado);
    }

    async Eliminar(codigo: string) {
        const choferRef = ref(db, 'choferes/' + codigo);
        await remove(choferRef);
    }

    async listarChoferes(): Promise<Chofer[]> {
        const choferesRef = ref(db, 'choferes');
        const snapshot = await get(choferesRef);
        if (snapshot.exists()) {
            return Object.values(snapshot.val());
        } else {
            return [];
        }
    }

    async Listar(): Promise<void> {
        const choferes = await this.listarChoferes();
        choferes.forEach(chofer => {
            console.log(chofer);
        });
    }

    async contarChoferes(): Promise<number> {
        const choferes = await this.listarChoferes();
        return choferes.length;
    }

    
}
