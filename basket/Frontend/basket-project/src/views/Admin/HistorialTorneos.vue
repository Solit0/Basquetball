<template>
    <div class="space-y-6 relative animate-fade-in">
        
        <div class="flex justify-between items-center mb-6">
            <div>
                <h2 class="text-3xl font-bold text-gray-900 flex items-center">
                    <button v-if="torneoSeleccionado" @click="volver" class="mr-3 text-indigo-600 hover:text-indigo-800 transition-colors">&larr;</button>
                    Historial y Reportes
                </h2>
                <p class="text-gray-600 mt-1">Consulta los resultados finales y exporta las actas de los torneos concluidos.</p>
            </div>
        </div>

        <div v-if="!torneoSeleccionado" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div v-if="torneosFinalizados.length === 0" class="col-span-full py-16 text-center text-gray-500 bg-white rounded-lg border border-dashed border-gray-300">
                <span class="text-4xl block mb-3">📁</span>
                <p class="font-bold text-lg">El archivo está vacío</p>
                <p class="text-sm">Aún no has finalizado oficialmente ningún torneo.</p>
            </div>
            
            <div v-for="t in torneosFinalizados" :key="t.id_torneo" @click="seleccionarTorneo(t)"
                 class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:border-red-400 hover:shadow-md cursor-pointer transition-all transform hover:-translate-y-1">
                <div class="flex justify-between items-start mb-4">
                    <h3 class="text-xl font-bold text-gray-900 leading-tight">{{ t.nombre_torneo }}</h3>
                    <span class="bg-red-100 text-red-800 px-2 py-1 text-[10px] font-bold rounded uppercase">
                        ARCHIVADO
                    </span>
                </div>
                <p class="text-sm text-gray-500 mb-4">
                    Categoría: <strong>{{ t.categoria }}</strong>
                </p>
                <button class="w-full py-2 bg-gray-50 text-gray-700 font-bold rounded border border-gray-200 hover:bg-gray-100 transition-colors flex items-center justify-center">
                    <svg class="w-4 h-4 mr-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                    Ver Actas y Resultados
                </button>
            </div>
        </div>

        <div v-else class="space-y-6">
            
            <div class="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                <div class="bg-slate-900 px-8 py-6 text-white flex flex-col md:flex-row md:justify-between md:items-center">
                    <div>
                        <span class="text-yellow-400 font-black uppercase tracking-widest text-xs">Torneo Oficialmente Concluido</span>
                        <h3 class="text-3xl font-black mt-1">{{ torneoSeleccionado.nombre_torneo }}</h3>
                    </div>
                </div>
                
                <div class="p-8 bg-linear-to-b from-gray-50 to-white text-center">
                    <span class="text-7xl block mb-4">🏆</span>
                    <p class="text-gray-500 font-bold uppercase tracking-widest mb-1">Campeón de la Edición</p>
                    <p v-if="cargandoDatos" class="text-2xl font-black text-gray-400 animate-pulse">Cargando resultados...</p>
                    <p v-else class="text-4xl font-black text-indigo-900 mb-8">{{ datosReporte?.resultados?.campeon || 'Desconocido' }}</p>

                    <div class="flex flex-col sm:flex-row justify-center gap-4 border-t border-gray-200 pt-8">
                        <button @click="descargarReporte('pdf')" :disabled="procesandoReporte || cargandoDatos"
                                class="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-8 rounded-lg shadow-md transition-all flex items-center justify-center disabled:opacity-50">
                            <span class="mr-3 text-2xl">📄</span> Descargar Actas (PDF)
                        </button>
                        <button @click="descargarReporte('csv')" :disabled="procesandoReporte || cargandoDatos"
                                class="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg shadow-md transition-all flex items-center justify-center disabled:opacity-50">
                            <span class="mr-3 text-2xl">📊</span> Datos Crudos (CSV)
                        </button>
                    </div>
                </div>
            </div>

            <div v-if="!cargandoDatos && partidosOficiales.length > 0" class="space-y-6">
                <h4 class="text-xl font-black text-gray-800 uppercase px-2">Histórico de Encuentros</h4>
                
                <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    <div v-for="partido in partidosOficiales" :key="partido.id_partido" 
                         class="bg-white border border-gray-200 rounded-xl p-5 flex flex-col justify-between shadow-sm">
                        
                        <div class="flex justify-between items-center mb-3">
                            <span class="text-[10px] font-black text-gray-400 uppercase tracking-widest">{{ partido.ronda_torneo }}</span>
                            <span class="text-[10px] font-bold text-gray-500">{{ partido.fecha.split('T')[0] }}</span>
                        </div>

                        <div class="flex items-center justify-between mb-4">
                            <div class="w-2/5 text-right pr-2">
                                <p class="font-bold text-gray-900 text-lg" :class="{'text-indigo-600': partido.marcador_local > partido.marcador_visitante}">
                                    {{ partido.local_nombre }}
                                </p>
                            </div>
                            
                            <div class="w-1/5 text-center flex justify-center">
                                <div class="font-black text-xl text-gray-800 bg-gray-100 px-3 py-1 rounded border border-gray-200">
                                    {{ partido.marcador_local }} - {{ partido.marcador_visitante }}
                                </div>
                            </div>

                            <div class="w-2/5 text-left pl-2">
                                <p class="font-bold text-gray-900 text-lg" :class="{'text-indigo-600': partido.marcador_visitante > partido.marcador_local}">
                                    {{ partido.visitante_nombre }}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { obtenerTorneosActivosService, obtenerDatosReporteTorneoService } from '../../services/torneosService'
import { obtenerPartidosPorTorneo } from '../../services/partidosService'
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const torneosFinalizados = ref([])
const torneoSeleccionado = ref(null)
const partidosOficiales = ref([])
const datosReporte = ref(null)

const cargandoDatos = ref(false)
const procesandoReporte = ref(false)

const cargarTorneos = async () => {
    try {
        const data = await obtenerTorneosActivosService()
        // AQUÍ EL FILTRO INVERSO: Solo los finalizados
        torneosFinalizados.value = data.filter(t => t.estado === 'Finalizado')
    } catch (error) {
        console.error("Error al cargar torneos:", error)
    }
}

const seleccionarTorneo = async (torneo) => {
    torneoSeleccionado.value = torneo
    cargandoDatos.value = true
    
    try {
        partidosOficiales.value = await obtenerPartidosPorTorneo(torneo.id_torneo)
        datosReporte.value = await obtenerDatosReporteTorneoService(torneo.id_torneo)
    } catch (e) {
        console.error(e)
        alert("Hubo un problema recuperando la información de este torneo.")
    } finally {
        cargandoDatos.value = false
    }
}

const volver = () => {
    torneoSeleccionado.value = null
    partidosOficiales.value = []
    datosReporte.value = null
    cargarTorneos() 
}

// 🔴 LÓGICA DE EXPORTACIÓN
const descargarReporte = async (tipo) => {
    if (!datosReporte.value) return;
    
    procesandoReporte.value = true;
    try {
        if (tipo === 'csv') {
            generarCSV(datosReporte.value);
        } else if (tipo === 'pdf') {
            generarPDF(datosReporte.value);
        }
    } catch (error) {
        console.error(error);
        alert("Error al generar el documento.");
    } finally {
        procesandoReporte.value = false;
    }
}

const generarCSV = (data) => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Torneo,Categoria,Campeon,Subcampeon\n";
    csvContent += `"${data.torneo.nombre}","${data.torneo.categoria}","${data.resultados.campeon}","${data.resultados.subcampeon}"\n\n`;
    
    csvContent += "Ronda,Fecha,Hora,Estado,Equipo Local,Marcador Local,Marcador Visitante,Equipo Visitante\n";

    data.historial_partidos.forEach(p => {
        const row = `"${p.ronda}",${p.fecha.split('T')[0]},${p.hora},${p.estado},"${p.local}",${p.marcador_local},${p.marcador_visitante},"${p.visitante}"`;
        csvContent += row + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Reporte_Torneo_${data.torneo.nombre.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

const generarPDF = (data) => {
    const doc = new jsPDF();
    
    doc.setFontSize(22);
    doc.setTextColor(55, 48, 163); 
    doc.text("REPORTE OFICIAL DEL TORNEO", 14, 22);

    doc.setFontSize(12);
    doc.setTextColor(50, 50, 50);
    doc.text(`Competición: ${data.torneo.nombre}`, 14, 32);
    doc.text(`Categoría: ${data.torneo.categoria}`, 14, 38);
    
    doc.setFontSize(14);
    doc.setTextColor(180, 83, 9); 
    doc.text(`1er Lugar (Campeón): ${data.resultados.campeon}`, 14, 50);
    doc.setTextColor(75, 85, 99); 
    doc.text(`2do Lugar (Subcampeón): ${data.resultados.subcampeon}`, 14, 57);

    const tableColumn = ["Ronda", "Fecha", "Hora", "Local", "Marcador", "Visitante"];
    const tableRows = [];

    data.historial_partidos.forEach(p => {
        const rowData = [
            p.ronda,
            p.fecha.split('T')[0],
            p.hora,
            p.local,
            `${p.marcador_local} - ${p.marcador_visitante}`,
            p.visitante
        ];
        tableRows.push(rowData);
    });

    autoTable(doc, {
        head: [tableColumn],
        body: tableRows,
        startY: 65,
        theme: 'striped',
        headStyles: { fillColor: [220, 38, 38] }, // Rojo oscuro para que parezca un acta finalizada
        styles: { fontSize: 10 }
    });

    doc.save(`Reporte_Torneo_${data.torneo.nombre.replace(/\s+/g, '_')}.pdf`);
}

onMounted(cargarTorneos)
</script>

<style scoped>
.animate-fade-in { animation: fadeIn 0.3s ease-in-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
</style>