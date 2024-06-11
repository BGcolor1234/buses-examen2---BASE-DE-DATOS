import { Viaje } from "../entidades/viajes";
import { db, ref, set, get, update, remove } from "../conexion/conexionfirebase";

export class Tlistaviajes {
    obtenerViajePorBus(busCodigo: string) {
        throw new Error('Method not implemented.');
    }

    constructor() {}

    async Insertar(op: Viaje) {
        const newRef = ref(db, 'viajes/' + op.codigo);
        await set(newRef, op);
    }

    async ModificarViaje(codigo: string, viajeActualizado: Viaje) {
        const viajeRef = ref(db, 'viajes/' + codigo);
        await update(viajeRef, viajeActualizado);
    }

    async modificarChofer(codigo: string, choferActualizado: Viaje) {
        const viajeRef = ref(db, 'viajes/' + codigo);
        await update(viajeRef, choferActualizado);
    }

    async Eliminar(codigo: string) {
        const viajeRef = ref(db, 'viajes/' + codigo);
        await remove(viajeRef);
    }

    async listarViajes(): Promise<Viaje[]> {
        const viajesRef = ref(db, 'viajes');
        const snapshot = await get(viajesRef);
        if (snapshot.exists()) {
            return Object.values(snapshot.val());
        } else {
            return [];
        }
    }

    async cambiarEstadoViaje(codigoViaje: string) {
        const viajeRef = ref(db, 'viajes/' + codigoViaje);
        const snapshot = await get(viajeRef);
        if (snapshot.exists()) {
            const viaje = snapshot.val() as Viaje;
            if (viaje.estado === 'en curso') {
                viaje.estado = 'completado';
                await update(viajeRef, { estado: 'completado' });
            }
        }
    }

    async cantidadViajesPorBus(codigoBus: string): Promise<number> {
        const viajes = await this.listarViajes();
        return viajes.filter(v => v.bus.some(b => b.codigobuses === codigoBus) && v.estado === 'completado').length;
    }

    async promedioViajesPorBus(): Promise<number> {
        const viajes = await this.listarViajes();
        const busesCompletados = viajes.filter(v => v.estado === 'completado').flatMap(v => v.bus.map(b => b.codigobuses));
        const uniqueBuses = Array.from(new Set(busesCompletados));
        const totalViajes = busesCompletados.length;
        return uniqueBuses.length > 0 ? totalViajes / uniqueBuses.length : 0;
    }

    async EliminarPorCodigo(codigo: string): Promise<void> {
        const viajeRef = ref(db, 'viajes/' + codigo);
        await remove(viajeRef);
    }

    async busEnViaje(codigoBus: string, codigoViajeEditado?: string): Promise<boolean> {
        const viajes = await this.listarViajes();
        return viajes.some(viaje => {
            // Verificar si el viaje es distinto al que estás editando, si se proporciona el código del viaje editado
            if (codigoViajeEditado && viaje.codigo === codigoViajeEditado) {
                return false; // Ignorar el viaje editado
            }
            return viaje.estado === 'en curso' && viaje.bus.some(bus => bus.codigobuses === codigoBus);
        });
    }

    async contarViajes(): Promise<number> {
        const viajes = await this.listarViajes();
        return viajes.length;
    }
    
}
