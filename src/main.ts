import { Chofer } from './entidades/choferes';
import { Tripulacion } from './entidades/tripulacion';
import { Bus } from './entidades/buses';
import { Viaje } from './entidades/viajes';
import { Tlistachoferes } from './controladores/TlistaChoferes';
import { Tlistatripulacion } from './controladores/TlistaTripulacion';
import { TlistaBus } from './controladores/TlistaBuses';
import { Tlistaviajes } from './controladores/TlistaViajes';
import { initializeApp } from 'firebase/app';

import Swal from 'sweetalert2';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDBwsYm9TUIwp5jOPv-QOIORV8QIdVEEgM",
    authDomain: "buses-74314.firebaseapp.com",
    databaseURL: "https://buses-74314-default-rtdb.firebaseio.com",
    projectId: "buses-74314",
    storageBucket: "buses-74314.appspot.com",
    messagingSenderId: "805082094385",
    appId: "1:805082094385:web:0802d5e105b7feddce6e10",
    measurementId: "G-G2L6M9JLRM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const db = getFirestore(app); // Eliminar si no se usa

const listaChoferes = new Tlistachoferes();
const listaTripulaciones = new Tlistatripulacion();
const listaBuses = new TlistaBus();
const listaViajes = new Tlistaviajes();

document.addEventListener('DOMContentLoaded', async function () {
    await mostrarEstadisticas();
});

document.addEventListener('DOMContentLoaded', function() {
    actualizarListaChoferes();
    actualizarListaTripulaciones();
    actualizarListaBuses();
    actualizarListaViajes();
    actualizarListaTripulacionesViaje();
});

document.getElementById('cerrar-modal-btn')?.addEventListener('click', cerrarModal);
document.getElementById('cerrar-modal')?.addEventListener('click', cerrarModal);

document.getElementById('form-chofer')?.addEventListener('submit', async function (event) {
    event.preventDefault();
    const codigo = (document.getElementById('codigo') as HTMLInputElement).value;
    const cedula = (document.getElementById('cedula') as HTMLInputElement).value;
    const nombres = (document.getElementById('nombres') as HTMLInputElement).value;
    const apellidos = (document.getElementById('apellidos') as HTMLInputElement).value;
    const fechanacimiento = (document.getElementById('fechanacimiento') as HTMLInputElement).value;
    const anosConduccion = (document.getElementById('anosConduccion') as HTMLInputElement).value;

    const nuevoChofer = new Chofer(codigo, cedula, nombres, apellidos, fechanacimiento, anosConduccion);

    try {
        await listaChoferes.Insertar(nuevoChofer);
        Swal.fire('Success', 'Chofer registrado exitosamente', 'success');
        actualizarListaChoferes();
        cerrarModal();
    } catch (error) {
        Swal.fire('Error', 'Hubo un error al registrar el chofer', 'error');
    }
});

async function actualizarListaChoferes() {
    const listaChoferesElement = document.getElementById('lista-choferes');
    if (listaChoferesElement) {
        listaChoferesElement.innerHTML = '';
        const choferes = await listaChoferes.listarChoferes();
        choferes.forEach(chofer => {
            const row = document.createElement('tr');
            row.className = 'border-b border-gray-300';

            const cellCodigo = document.createElement('td');
            cellCodigo.className = 'py-3 px-2';
            cellCodigo.textContent = chofer.codigo;
            row.appendChild(cellCodigo);

            const cellCedula = document.createElement('td');
            cellCedula.className = 'py-3 px-2';
            cellCedula.textContent = chofer.cedula;
            row.appendChild(cellCedula);

            const cellNombre = document.createElement('td');
            cellNombre.className = 'py-3 px-2';
            cellNombre.textContent = chofer.nombres;
            row.appendChild(cellNombre);

            const cellApellido = document.createElement('td');
            cellApellido.className = 'py-3 px-2';
            cellApellido.textContent = chofer.apellidos;
            row.appendChild(cellApellido);

            const cellFecha = document.createElement('td');
            cellFecha.className = 'py-3 px-2';
            cellFecha.textContent = chofer.fechanacimiento;
            row.appendChild(cellFecha);

            const cellCondu = document.createElement('td');
            cellCondu.className = 'py-3 px-2';
            cellCondu.textContent = chofer.anosConduccion;
            row.appendChild(cellCondu);

            listaChoferesElement.appendChild(row);

            limpiarModalChoferes();
        });
    }

    const choferesTripulacion = document.getElementById('choferesTripulacion') as HTMLSelectElement;
    choferesTripulacion.innerHTML = '';
    const choferesList = await listaChoferes.listarChoferes();
    choferesList.forEach(chofer => {
        const option = document.createElement('option');
        option.value = chofer.codigo;
        option.text = `${chofer.nombres} ${chofer.apellidos} ${chofer.cedula}` 
        option.classList.add('py-3', 'px-2');
        choferesTripulacion.appendChild(option);
    });
}

document.getElementById('form-tripulacion')?.addEventListener('submit', async function (event) {
    event.preventDefault();
    const codigo = (document.getElementById('codigoTripulacion') as HTMLInputElement).value;
    const choferesSeleccionados = Array.from((document.getElementById('choferesTripulacion') as HTMLSelectElement).selectedOptions)
        .map(option => listaChoferes.listarChoferes().then(choferes => choferes.find((chofer: Chofer) => chofer.codigo === option.value)!));

    const nuevaTripulacion = new Tripulacion(codigo);
    nuevaTripulacion.chofer.push(...await Promise.all(choferesSeleccionados));
    await listaTripulaciones.Insertar(nuevaTripulacion);
    actualizarListaTripulaciones();
    Swal.fire('Tripulación registrada', 'La tripulación ha sido registrada exitosamente', 'success');
});

async function actualizarListaTripulaciones() {
    const listaTripulacionesElement = document.getElementById('lista-tripulaciones');
    if (listaTripulacionesElement) {
        listaTripulacionesElement.innerHTML = '';
        const tripulaciones = await listaTripulaciones.listarTripulaciones();
        tripulaciones.forEach(tripulacion => {
            const li = document.createElement('li');
            li.textContent = `Tripulación ${tripulacion.idcodigo}`;
            listaTripulacionesElement.appendChild(li);
        });
    }
    const tripulacionBus = document.getElementById('tripulacionBus') as HTMLSelectElement;
    tripulacionBus.innerHTML = '';
    const tripulacionesList = await listaTripulaciones.listarTripulaciones();
    tripulacionesList.forEach(tripulacion => {
        const option = document.createElement('option');
        option.value = tripulacion.idcodigo;
        option.text = `Tripulación ${tripulacion.idcodigo}`;
        tripulacionBus.appendChild(option);
    });
    actualizarListaTripulacionesViaje();
}

document.getElementById('form-bus')?.addEventListener('submit', async function (event) {
    event.preventDefault();
    const codigo = (document.getElementById('codigoBus') as HTMLInputElement).value;
    const placa = (document.getElementById('placa') as HTMLInputElement).value;
    const tipo = (document.getElementById('tipo') as HTMLInputElement).value;
    const mantenimiento = (document.getElementById('enMantenimiento') as HTMLInputElement).checked;
    const tripulacionCodigo = (document.getElementById('tripulacionBus') as HTMLSelectElement).value;
    const tripulacion = await listaTripulaciones.listarTripulaciones().then(ts => ts.find(t => t.idcodigo === tripulacionCodigo));

    const nuevoBus = new Bus(codigo, placa, tipo, mantenimiento);
    if (tripulacion) {
        nuevoBus.Tripulacion.push(tripulacion);
    }
    await listaBuses.Insertar(nuevoBus);
    try {
        await listaBuses.Insertar(nuevoBus);
        Swal.fire('Success', 'BUS registrado exitosamente', 'success');
        actualizarListaChoferes();
        cerrarModal();
    } catch (error) {
        Swal.fire('Error', 'Hubo un error al registrar el BUS', 'error');
    }
    actualizarListaBuses();
});

async function actualizarListaBuses() {
    const tablaBusesElement = document.getElementById('lista-buses');
    if (tablaBusesElement) {
        tablaBusesElement.innerHTML = '';
        const buses = await listaBuses.listarBuses();
        buses.forEach(bus => {
            const row = document.createElement('tr');
            row.className = 'border-b border-gray-300';

            const cellCodigo = document.createElement('td');
            cellCodigo.className = 'py-3 px-2';
            cellCodigo.textContent = bus.codigobuses;
            row.appendChild(cellCodigo);

            const cellPlaca = document.createElement('td');
            cellPlaca.className = 'py-3 px-2';
            cellPlaca.textContent = bus.placa;
            row.appendChild(cellPlaca);

            const cellTipo = document.createElement('td');
            cellTipo.className = 'py-3 px-2';
            cellTipo.textContent = bus.tipo;
            row.appendChild(cellTipo);

            const cellMantenimiento = document.createElement('td');
            cellMantenimiento.className = 'py-3 px-2';
            cellMantenimiento.textContent = bus.mantenimiento ? 'Sí' : 'No';
            row.appendChild(cellMantenimiento);

            const cellTripulacion = document.createElement('td');
            cellTripulacion.className = 'py-3 px-2';
            cellTripulacion.textContent = bus.Tripulacion.length > 0 ? `Tripulación ${bus.Tripulacion[0].idcodigo}` : '-';
            row.appendChild(cellTripulacion);

            tablaBusesElement.appendChild(row);
        });
    }

    actualizarListaBusesViaje();
    limpiarModalbus();
}



async function mostrarEstadisticas() {
    const cantidadChoferes = await listaChoferes.contarChoferes();
    const cantidadBuses = await listaBuses.contarBuses();
    const cantidadViajes = await listaViajes.contarViajes();

    document.getElementById('cantidad-choferes')!.textContent = `Cantidad de Choferes: ${cantidadChoferes}`;
    document.getElementById('cantidad-buses')!.textContent = `Cantidad de Buses: ${cantidadBuses}`;
    document.getElementById('cantidad-viajes')!.textContent = `Cantidad de Viajes: ${cantidadViajes}`;
}

document.getElementById('form-viaje')?.addEventListener('submit', async function (event) {
    event.preventDefault();
    const codigo = (document.getElementById('codigoViaje') as HTMLInputElement).value;
    const origen = (document.getElementById('origen') as HTMLInputElement).value;
    const destino = (document.getElementById('destino') as HTMLInputElement).value;
    const fecha_salida = (document.getElementById('fecha') as HTMLInputElement).value;
    const fecha_llegada = (document.getElementById('fecha2') as HTMLInputElement).value;
    const busCodigo = (document.getElementById('busViaje') as HTMLSelectElement).value;
    const tripulacionId = (document.getElementById('tripulacionViaje') as HTMLSelectElement).value; // Obtener el ID de la tripulación seleccionada
    
    // Verificar si el bus está ocupado
    const busOcupado = await listaViajes.busEnViaje(busCodigo);

    if (busOcupado) {
        // Mostrar una alerta con SweetAlert2 indicando que el bus está ocupado
        Swal.fire({
            icon: 'error',
            title: 'Bus ocupado',
            text: 'El bus seleccionado ya está en uso en otro viaje. Por favor, selecciona otro bus.'
        });
        return; // Evitar el registro del nuevo viaje
    }

    // Verificar si el bus está en mantenimiento
    const busEnMantenimiento = await listaBuses.listarBuses().then(bs => {
        const bus = bs.find(b => b.codigobuses === busCodigo);
        return bus ? bus.mantenimiento : false;
    });

    if (busEnMantenimiento) {
        // Mostrar una alerta con SweetAlert2 indicando que el bus está en mantenimiento
        Swal.fire({
            icon: 'error',
            title: 'Bus en mantenimiento',
            text: 'El bus seleccionado está actualmente en mantenimiento. Por favor, selecciona otro bus.'
        });
        return; // Evitar el registro del nuevo viaje
    }

    // Si el bus no está ocupado ni en mantenimiento, procedemos con el registro del nuevo viaje
    const bus = await listaBuses.listarBuses().then(bs => bs.find(b => b.codigobuses === busCodigo));
    const nuevoViaje = new Viaje(codigo, origen, destino, fecha_salida, fecha_llegada, 'en curso', tripulacionId); // Pasa el ID de la tripulación al constructor
    if (bus) {
        nuevoViaje.bus.push(bus);
    }
    await listaViajes.Insertar(nuevoViaje);

    try {
        await listaViajes.Insertar(nuevoViaje);
        Swal.fire('Success', 'Viaje registrado exitosamente', 'success');
        actualizarListaChoferes();
        cerrarModal();
    } catch (error) {
        Swal.fire('Error', 'Hubo un error al registrar el Viaje', 'error');
    }

    actualizarListaViajes();
    cerrarModal();
});



async function actualizarListaViajes() {
    const listaViajesElement = document.getElementById('lista-viajes');
    if (listaViajesElement) {
        listaViajesElement.innerHTML = '';
        const viajes = await listaViajes.listarViajes();
        viajes.forEach(viaje => {
            const row = document.createElement('tr');
            row.className = 'border-b border-gray-300';

            const cellCodigo = document.createElement('td');
            cellCodigo.className = 'py-3 px-2';
            cellCodigo.textContent = viaje.codigo;
            row.appendChild(cellCodigo);

            const cellBus = document.createElement('td');
            cellBus.className = 'py-3 px-2';
            cellBus.textContent = viaje.bus.length > 0 ? viaje.bus.map(bus => bus.codigobuses).join(', ') : '-';
            row.appendChild(cellBus);

            const cellOrigen = document.createElement('td');
            cellOrigen.className = 'py-3 px-2';
            cellOrigen.textContent = viaje.origen;
            row.appendChild(cellOrigen);

            const cellDestino = document.createElement('td');
            cellDestino.className = 'py-3 px-2';
            cellDestino.textContent = viaje.destino;
            row.appendChild(cellDestino);

            const cellFechaSalida = document.createElement('td');
            cellFechaSalida.className = 'py-3 px-2';
            cellFechaSalida.textContent = viaje.fechahorasalida;
            row.appendChild(cellFechaSalida);

            const cellFechaLlegada = document.createElement('td');
            cellFechaLlegada.className = 'py-3 px-2';
            cellFechaLlegada.textContent = viaje.fechahorallegada;
            row.appendChild(cellFechaLlegada);

            const cellEstado = document.createElement('td');
            cellEstado.className = 'py-3 px-2';
            cellEstado.textContent = viaje.estado;
            row.appendChild(cellEstado);

            const cellTripulacion = document.createElement('td');
            cellTripulacion.className = 'py-3 px-2';
            cellTripulacion.textContent = viaje.tripulacion.length > 0 ? `Tripulación ${viaje.tripulacion[0].idcodigo}` : '-';
            row.appendChild(cellTripulacion);

            const cellAcciones = document.createElement('td');
            cellAcciones.className = 'py-3 px-2';

            const botonCambiarEstado = document.createElement('button');
            botonCambiarEstado.textContent = 'Cambiar Estado';
            botonCambiarEstado.classList.add('bg-blue-500', 'hover:bg-blue-700', 'text-white', 'font-bold', 'py-2', 'px-4', 'rounded', 'mr-2');
            botonCambiarEstado.addEventListener('click', async () => {
                await cambiarEstadoViaje(viaje.codigo);
            });
            cellAcciones.appendChild(botonCambiarEstado);

            const botonEditar = document.createElement('button');
            botonEditar.textContent = 'Editar';
            botonEditar.classList.add('bg-yellow-500', 'hover:bg-yellow-700', 'text-white', 'font-bold', 'py-2', 'px-4', 'rounded', 'mr-2');
            botonEditar.addEventListener('click', () => {
                editarViaje(viaje, viaje.estado);
            });
            cellAcciones.appendChild(botonEditar);

            const botonEliminar = document.createElement('button');
            botonEliminar.textContent = 'Eliminar';
            botonEliminar.classList.add('bg-red-500', 'hover:bg-red-700', 'text-white', 'font-bold', 'py-2', 'px-4', 'rounded');
            botonEliminar.addEventListener('click', async () => {
                const confirmacion = await Swal.fire({
                    icon: 'warning',
                    title: '¿Estás seguro?',
                    text: 'Esta acción eliminará el viaje permanentemente.',
                    showCancelButton: true,
                    confirmButtonText: 'Sí, eliminar',
                    cancelButtonText: 'Cancelar'
                });

                if (confirmacion.isConfirmed) {
                    await listaViajes.Eliminar(viaje.codigo);
                    actualizarListaViajes();
                }
            });
            cellAcciones.appendChild(botonEliminar);

            row.appendChild(cellAcciones);
            listaViajesElement.appendChild(row);

            limpiarModalViajes();
        });
    }
}

function cambiarEstadoViaje(codigoViaje: string): void {
    listaViajes.cambiarEstadoViaje(codigoViaje).then(() => {
        console.log(listaViajes)
        actualizarListaViajes(); // Actualiza la lista de viajes después de cambiar el estado
    });
}

function editarViaje(viaje: Viaje, estadoOriginal: string): void {
    // Rellenar el formulario con los datos del viaje seleccionado
    (document.getElementById('codigoViaje') as HTMLInputElement).value = viaje.codigo;
    (document.getElementById('origen') as HTMLInputElement).value = viaje.origen;
    (document.getElementById('destino') as HTMLInputElement).value = viaje.destino;
    (document.getElementById('fecha') as HTMLInputElement).value = viaje.fechahorasalida;
    (document.getElementById('fecha2') as HTMLInputElement).value = viaje.fechahorallegada;
    

    // Establecer el valor del campo de bus en el formulario
    const busSeleccionado = viaje.bus.length > 0 ? viaje.bus[0].codigobuses : ''; // Obtener el código del bus seleccionado
    (document.getElementById('busViaje') as HTMLSelectElement).value = busSeleccionado;

    const modal = document.getElementById('crud-modal');
    if (modal) {
        modal.classList.remove('hidden'); // Mostrar el modal
    }

    // Cambiar el texto del botón de enviar del formulario a "Guardar Cambios"
    const botonEnviar = document.getElementById('enviarViaje') as HTMLButtonElement;
    botonEnviar.textContent = 'Guardar Cambios';

    // Agregar un controlador de eventos al botón de enviar para manejar la actualización del viaje
    botonEnviar.addEventListener('click', async (event) => {
        event.preventDefault();

        const codigo = (document.getElementById('codigoViaje') as HTMLInputElement).value;
        const origen = (document.getElementById('origen') as HTMLInputElement).value;
        const destino = (document.getElementById('destino') as HTMLInputElement).value;
        const fecha_salida = (document.getElementById('fecha') as HTMLInputElement).value;
        const fecha_llegada = (document.getElementById('fecha2') as HTMLInputElement).value;
        const busCodigo = (document.getElementById('busViaje') as HTMLSelectElement).value; // Obtener el código del bus seleccionado
        const tripulacionId = (document.getElementById('tripulacionViaje') as HTMLSelectElement).value;

        // Obtener el objeto Bus correspondiente al código seleccionado
        const busSeleccionado = await listaBuses.obtenerBusPorCodigo(busCodigo);

        // Crear el objeto Viaje actualizado incluyendo el bus seleccionado
        const viajeActualizado = new Viaje(codigo, origen, destino, fecha_salida, fecha_llegada, estadoOriginal, tripulacionId);
        if (busSeleccionado) {
            viajeActualizado.bus.push(busSeleccionado);
        }

        // Actualizar el viaje en la base de datos
        await listaViajes.ModificarViaje(viaje.codigo, viajeActualizado);

        // Actualizar la lista de viajes
        actualizarListaViajes();

        cerrarModal(); // Cerrar el modal después de actualizar el viaje

        // Restaurar el texto del botón de enviar
        botonEnviar.textContent = 'Registrar Viaje';
    }, { once: true });
}


async function actualizarListaBusesViaje(codigoViajeEditado?: string) {
    const busViaje = document.getElementById('busViaje') as HTMLSelectElement;
    busViaje.innerHTML = '';
    const buses = await listaBuses.listarBuses();
    buses.forEach(bus => {
        const option = document.createElement('option');
        option.value = bus.codigobuses;
        option.textContent = `Bus ${bus.codigobuses}`;
        busViaje.appendChild(option);
    });

    const busSeleccionado = busViaje.value;
    if (busSeleccionado && codigoViajeEditado) {
        const busOcupado = await listaViajes.busEnViaje(busSeleccionado, codigoViajeEditado);
        if (busOcupado) {
            Swal.fire({
                icon: 'error',
                title: 'Bus ocupado',
                text: 'El bus seleccionado ya está en uso en otro viaje. Por favor, selecciona otro bus.'
            });
        }
    }
}

async function actualizarListaTripulacionesViaje() {
    const tripulacionViaje = document.getElementById('tripulacionViaje') as HTMLSelectElement;
    tripulacionViaje.innerHTML = '';
    const tripulaciones = await listaTripulaciones.listarTripulaciones();
    tripulaciones.forEach(tripulacion => {
        const option = document.createElement('option');
        option.value = tripulacion.idcodigo;
        option.textContent = `Tripulación ${tripulacion.idcodigo}`;
        tripulacionViaje.appendChild(option);
    });
}

async function abrirModalTripulaciones() {
    const modal = document.getElementById('tripulacionesModal');
    const listaTripulacionesElement = document.getElementById('lista-tripulaciones-modal');

    if (modal && listaTripulacionesElement) {
        listaTripulacionesElement.innerHTML = '';
        const tripulaciones = await listaTripulaciones.listarTripulaciones();
        tripulaciones.forEach(tripulacion => {
            const li = document.createElement('li');
            li.textContent = `Tripulación ${tripulacion.idcodigo}`;
            listaTripulacionesElement.appendChild(li);
        });
        modal.style.display = 'block';
    }
}

document.getElementById('btn-ver-tripulaciones')?.addEventListener('click', abrirModalTripulaciones);

document.addEventListener('click', function(event) {
    const modal = document.getElementById('tripulacionesModal');
    const closeModalButton = document.getElementById('closeModalButton');

    if (modal && (event.target === modal || event.target === closeModalButton)) {
        modal.style.display = 'none';
    }
});

document.getElementById('consultarViajesPorBus')?.addEventListener('click', async function () {
    const codigoBus = (document.getElementById('codigoBusConsultar') as HTMLInputElement).value;
    const cantidadViajes = await listaViajes.cantidadViajesPorBus(codigoBus);
    const resultadoViajesPorBus = document.getElementById('resultadoViajesPorBus');
    if (resultadoViajesPorBus) {
        resultadoViajesPorBus.textContent = `Cantidad de viajes realizados por el bus ${codigoBus}: ${cantidadViajes}`;
    }
});

document.getElementById('consultarPromedioViajes')?.addEventListener('click', async function () {
    const promedioViajes = await listaViajes.promedioViajesPorBus();
    const resultadoPromedioViajes = document.getElementById('resultadoPromedioViajes');
    if (resultadoPromedioViajes) {
        resultadoPromedioViajes.textContent = `Promedio de viajes realizados por cada bus: ${promedioViajes}`;
    }
});

const insertarChoferBtn = document.getElementById('insertar-chofer') as HTMLButtonElement;
const crudModal = document.getElementById('crud-modal');
insertarChoferBtn.addEventListener('click', function() {
    if (crudModal) {
        crudModal.classList.remove('hidden');
    }
});

const fondoModal = document.getElementById('crud-modal') as HTMLElement;
function abrirModal() {
    if (crudModal) {
        crudModal.classList.remove('hidden');
    }
}

function cerrarModal() {
    const modal = document.getElementById('crud-modal');
    if (modal) {
        modal.classList.add('hidden');
    }
}



fondoModal.addEventListener('click', function(event) {
    if (event.target === fondoModal) {
        cerrarModal();
    }
});
insertarChoferBtn.addEventListener('click', abrirModal);

document.getElementById('joinLink')?.addEventListener('click', function (event) {
    event.preventDefault();
    Swal.fire({
        icon: 'success',
        title: '¡Bienvenido!',
        text: 'Gracias por unirte',
        showConfirmButton: false,
        timer: 1000
    });

    setTimeout(() => {
        window.location.href = './src/Pantallas/choferes.html';
    }, 1000);
});

function limpiarModalbus() {
    const codigoBusInput = document.getElementById('codigoBus') as HTMLInputElement | null;
    const placaInput = document.getElementById('placa') as HTMLInputElement | null;
    const tipoInput = document.getElementById('tipo') as HTMLInputElement | null;
    const enMantenimientoCheckbox = document.getElementById('enMantenimiento') as HTMLInputElement | null;

    if (codigoBusInput && placaInput && tipoInput && enMantenimientoCheckbox) {
        codigoBusInput.value = '';
        placaInput.value = '';
        tipoInput.value = '';
        enMantenimientoCheckbox.checked = false;
    } else {
       
    }
}

function limpiarModalChoferes() {
    const codigoInput = document.getElementById('codigo') as HTMLInputElement | null;
    const cedulaInput = document.getElementById('cedula') as HTMLInputElement | null;
    const nombresInput = document.getElementById('nombres') as HTMLInputElement | null;
    const apellidosInput = document.getElementById('apellidos') as HTMLInputElement | null;
    const fechaNacimientoInput = document.getElementById('fechanacimiento') as HTMLInputElement | null;
    const anosConduccionInput = document.getElementById('anosConduccion') as HTMLInputElement | null;

    if (codigoInput && cedulaInput && nombresInput && apellidosInput && fechaNacimientoInput && anosConduccionInput) {
        codigoInput.value = '';
        cedulaInput.value = '';
        nombresInput.value = '';
        apellidosInput.value = '';
        fechaNacimientoInput.value = '';
        anosConduccionInput.value = '';
    } else {
        console.error('Error: Al menos uno de los elementos del DOM no existe.');
    }
}

function limpiarModalViajes() {
    const codigo = document.getElementById('codigoViaje') as HTMLInputElement | null;
    const origen = document.getElementById('origen') as HTMLInputElement | null;
    const destino = document.getElementById('destino') as HTMLInputElement | null;
    const fecha_salida = document.getElementById('fecha') as HTMLInputElement | null;
    const fecha_llegada = document.getElementById('fecha2') as HTMLInputElement | null;
    const busCodigo = document.getElementById('busViaje') as HTMLInputElement | null;
    const tripulacionId = document.getElementById('tripulacionViaje') as HTMLInputElement | null;

    if (codigo && origen && destino && fecha_salida && fecha_llegada && busCodigo &&  tripulacionId ) {
        codigo.value = '';
        origen.value = '';
        destino.value = '';
        fecha_salida.value = '';
        fecha_llegada.value = '';
        busCodigo.value = '';
        tripulacionId.value = '';
    } else {
        console.error('Error: Al menos uno de los elementos del DOM no existe.');
    }
}






function mostrarModal() {
    const modal = document.getElementById('crud-modal');
    if (modal) {
        modal.classList.add('show');
        modal.style.display = 'block';
    }
}
