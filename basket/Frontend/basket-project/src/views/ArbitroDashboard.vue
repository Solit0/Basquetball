<template>
    <div class="flex min-h-screen bg-gray-50">
        
        <SidebarArbitro />

        <main class="flex-1 flex flex-col h-screen overflow-hidden">
            
            <header class="bg-white shadow-sm border-b border-gray-200 shrink-0">
                <div class="px-6 py-4 flex justify-between items-center">
                    <h2 class="text-xl font-bold text-gray-800">Panel Principal</h2>
                    <div class="flex items-center space-x-3">
                        <div class="w-8 h-8 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center font-black">
                            {{ userName.charAt(0).toUpperCase() }}
                        </div>
                        <span class="text-gray-700 font-medium">Hola, {{ userName }}</span>
                    </div>
                </div>
            </header>

            <div class="flex-1 overflow-auto p-6 md:p-8">
                
                <div class="max-w-7xl mx-auto space-y-6 relative">
                    
                    <div class="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
                        <div>
                            <div class="flex items-center space-x-2 text-sm font-bold text-amber-600 mb-1">
                                <span @click="volverATorneos" class="cursor-pointer hover:underline">Mis Asignaciones</span>
                                <span v-if="viewMode === 'partidos' || viewMode === 'detalle'" class="text-gray-500">/ {{ torneoSeleccionado?.nombre_torneo }}</span>
                                <span v-if="viewMode === 'detalle'" class="text-gray-500">/ Partido #{{ partidoSeleccionado?.id_partido }}</span>
                            </div>
                            <h2 class="text-3xl font-black text-gray-900 flex items-center">
                                <button v-if="viewMode !== 'torneos'" @click="volverAtras" class="mr-3 text-amber-500 hover:text-amber-700 transition-colors" title="Regresar">
                                    &larr;
                                </button>
                                {{ tituloVista }}
                            </h2>
                        </div>
                    </div>

                    <div v-if="viewMode === 'torneos'" class="animate-fade-in">
                        <div v-if="torneos.length === 0" class="py-16 text-center text-gray-500 bg-white rounded-xl border-2 border-dashed border-gray-300 shadow-sm">
                            <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                            <p class="text-lg font-bold text-gray-700">No tienes partidos asignados</p>
                            <p class="text-sm mt-1">Actualmente no estás convocado como árbitro en ningún torneo.</p>
                        </div>

                        <div v-else class="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
                            <div v-for="t in torneos" :key="t.id_torneo" @click="seleccionarTorneo(t)"
                                 class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:border-amber-500 hover:shadow-md cursor-pointer transition-all transform hover:-translate-y-1 relative overflow-hidden group">
                                <div class="absolute left-0 top-0 bottom-0 w-1 bg-amber-500"></div>
                                <div class="flex justify-between items-start mb-4">
                                    <h3 class="text-xl font-bold text-gray-900 leading-tight pr-4 group-hover:text-amber-600 transition-colors">{{ t.nombre_torneo }}</h3>
                                </div>
                                <p class="text-xs font-black text-gray-500 uppercase tracking-widest mb-4">
                                    {{ t.categoria }} | {{ t.clasificacion }}
                                </p>
                                <div class="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                                    <span class="text-sm font-medium text-gray-600">Partidos por pitar:</span>
                                    <span class="px-3 py-1 bg-amber-100 text-amber-800 font-black rounded-full shadow-sm text-sm">
                                        {{ t.partidos_pendientes }} pendientes
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div v-else-if="viewMode === 'partidos'" class="animate-fade-in">
                        <div v-if="partidos.length === 0" class="text-center py-10 text-gray-500">No hay partidos pendientes en este torneo.</div>
                        <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div v-for="p in partidos" :key="p.id_partido" @click="seleccionarPartido(p)"
                                 class="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-amber-400 cursor-pointer transition-all">
                                <div class="flex justify-between items-center mb-3 border-b border-gray-100 pb-2">
                                    <span class="text-xs font-black text-amber-600 uppercase tracking-wider">{{ p.ronda_torneo }}</span>
                                    <span class="text-xs font-bold text-gray-500 flex items-center">
                                        <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                        {{ formatFecha(p.fecha) }} - {{ p.hora }}
                                    </span>
                                </div>
                                <div class="flex items-center justify-between mb-3 py-2">
                                    <div class="w-2/5 text-right">
                                        <p class="font-black text-gray-800 text-lg truncate" :title="p.local_nombre">{{ p.local_siglas || p.local_nombre }}</p>
                                        <p class="text-[10px] text-gray-400 uppercase font-bold mt-1">Local</p>
                                    </div>
                                    <div class="w-1/5 text-center">
                                        <span class="bg-gray-800 text-white font-black px-2 py-1 rounded text-sm shadow-sm">VS</span>
                                    </div>
                                    <div class="w-2/5 text-left">
                                        <p class="font-black text-gray-800 text-lg truncate" :title="p.visitante_nombre">{{ p.visitante_siglas || p.visitante_nombre }}</p>
                                        <p class="text-[10px] text-gray-400 uppercase font-bold mt-1">Visitante</p>
                                    </div>
                                </div>
                                <div class="text-center text-xs text-gray-500 mt-2 bg-gray-50 py-2 rounded flex justify-center items-center font-medium">
                                    <svg class="w-4 h-4 mr-1 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path></svg>
                                    Sede: {{ p.nombre_cancha }}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div v-else-if="viewMode === 'detalle'" class="animate-fade-in max-w-5xl mx-auto">
                        
                        <div class="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden mb-6">
                            <div class="bg-slate-900 px-6 py-4 flex justify-between items-center text-white">
                                <span class="font-bold text-amber-500 uppercase tracking-widest text-sm">{{ partidoDetalle?.ronda_torneo }}</span>
                                <span :class="partidoDetalle?.estado === 'En Juego' ? 'bg-green-500 text-white' : 'bg-amber-500 text-slate-900'" 
                                      class="px-3 py-1 rounded-full text-xs font-black tracking-wider shadow-sm transition-colors duration-300">
                                    ESTADO: {{ partidoDetalle?.estado ? partidoDetalle.estado.toUpperCase() : 'PROGRAMADO' }}
                                </span>
                            </div>
                            
                            <div class="p-8">
                                <div class="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12 mb-8">
                                    <div class="text-center w-full md:w-2/5">
                                        <div class="w-20 h-20 mx-auto bg-gray-100 rounded-full border-4 border-gray-200 mb-3 flex items-center justify-center text-gray-400">
                                            <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                                        </div>
                                        <h4 class="text-2xl font-black text-gray-900">{{ partidoDetalle?.local_nombre }}</h4>
                                        <p class="text-xs font-bold text-amber-600 uppercase mt-1">Equipo Local</p>
                                    </div>
                                    <div class="text-3xl font-black text-gray-300">VS</div>
                                    <div class="text-center w-full md:w-2/5">
                                        <div class="w-20 h-20 mx-auto bg-gray-100 rounded-full border-4 border-gray-200 mb-3 flex items-center justify-center text-gray-400">
                                            <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                                        </div>
                                        <h4 class="text-2xl font-black text-gray-900">{{ partidoDetalle?.visitante_nombre }}</h4>
                                        <p class="text-xs font-bold text-gray-500 uppercase mt-1">Equipo Visitante</p>
                                    </div>
                                </div>
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-5 rounded-xl border border-gray-200">
                                    <div class="flex items-center text-gray-700">
                                        <svg class="w-6 h-6 mr-3 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                        <div>
                                            <p class="text-[10px] font-black uppercase text-gray-400">Fecha y Hora Oficial</p>
                                            <p class="font-bold">{{ formatFecha(partidoDetalle?.fecha) }} a las {{ partidoDetalle?.hora }}</p>
                                        </div>
                                    </div>
                                    <div class="flex items-center text-gray-700">
                                        <svg class="w-6 h-6 mr-3 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path></svg>
                                        <div>
                                            <p class="text-[10px] font-black uppercase text-gray-400">Sede del Encuentro</p>
                                            <p class="font-bold">{{ partidoDetalle?.nombre_cancha }}</p>
                                            <p class="text-xs text-gray-500">{{ partidoDetalle?.cancha_direccion }}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                            <h4 class="text-sm font-black text-gray-800 uppercase tracking-widest border-b pb-2 mb-4">Cuerpos Técnicos</h4>
                            <div class="grid grid-cols-2 gap-8">
                                <div>
                                    <p class="text-xs text-amber-600 font-bold uppercase">{{ partidoDetalle?.local_nombre }}</p>
                                    <p class="font-medium text-gray-900 mt-1 flex items-center">
                                        <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"></path></svg>
                                        {{ partidoDetalle?.local_entrenador_nombre ? partidoDetalle.local_entrenador_nombre + ' ' + partidoDetalle.local_entrenador_apellido : 'Entrenador no registrado' }}
                                    </p>
                                </div>
                                <div>
                                    <p class="text-xs text-gray-500 font-bold uppercase">{{ partidoDetalle?.visitante_nombre }}</p>
                                    <p class="font-medium text-gray-900 mt-1 flex items-center">
                                        <svg class="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"></path></svg>
                                        {{ partidoDetalle?.visitante_entrenador_nombre ? partidoDetalle.visitante_entrenador_nombre + ' ' + partidoDetalle.visitante_entrenador_apellido : 'Entrenador no registrado' }}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                            <div class="flex justify-between items-center border-b pb-2 mb-4">
                                <h4 class="text-sm font-black text-gray-800 uppercase tracking-widest">Alineaciones Oficiales</h4>
                                <span class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded font-bold">P = Presente | A = Ausente | I = Inhabilitado</span>
                            </div>
                            
                            <div class="grid grid-cols-1 xl:grid-cols-2 gap-8">
                                <div>
                                    <h5 class="text-xs font-bold text-amber-700 uppercase mb-3 bg-amber-50 px-3 py-2 rounded-md border border-amber-100 flex justify-between items-center">
                                        <span>{{ partidoDetalle?.local_nombre }} (L)</span>
                                        <span class="bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full">{{ jugadoresLocal.length }} Jugadores</span>
                                    </h5>
                                    
                                    <div v-if="jugadoresLocal.length === 0" class="text-sm text-gray-500 italic py-4 text-center bg-gray-50 rounded-lg border border-dashed border-gray-200">
                                        Alineación no registrada aún.
                                    </div>
                                    
                                    <ul v-else class="space-y-2 pr-2">
                                        <li v-for="j in jugadoresLocal" :key="j.id_jugador" 
                                            class="flex flex-col sm:flex-row sm:items-center justify-between text-sm bg-white p-3 rounded-lg border border-gray-200 shadow-sm transition-colors"
                                            :class="{'border-l-4 border-l-green-500': j.estado_asistencia === 'Presente', 'border-l-4 border-l-red-500': j.estado_asistencia === 'Inhabilitado'}">
                                            
                                            <div class="flex items-center mb-2 sm:mb-0">
                                                <span class="w-7 h-7 flex items-center justify-center font-black text-amber-700 bg-amber-100 rounded-full text-xs mr-3 shrink-0">
                                                    {{ j.numero_camiseta || '-' }}
                                                </span>
                                                <span class="font-medium text-gray-900 truncate" :class="{'line-through text-gray-400': j.estado_asistencia === 'Inhabilitado'}">
                                                    {{ j.nombre }} {{ j.apellido }}
                                                </span>
                                                <span v-if="j.es_capitan === true || j.es_capitan === 'true' || j.rol === 'Capitán'" 
                                                      class="ml-2 px-1.5 py-0.5 bg-yellow-400 text-yellow-900 text-[9px] font-black rounded shadow-sm border border-yellow-500 shrink-0" 
                                                      title="Capitán">©</span>
                                            </div>
                                            
                                            <div class="flex bg-gray-100 p-1 rounded-md shrink-0">
                                                <button @click="cambiarAsistencia(j, 'Presente')" :disabled="cargandoAsistencia"
                                                        :class="j.estado_asistencia === 'Presente' ? 'bg-green-500 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-200'"
                                                        class="px-3 py-1 text-xs font-bold rounded transition-colors w-10">P</button>
                                                <button @click="cambiarAsistencia(j, 'Ausente')" :disabled="cargandoAsistencia"
                                                        :class="j.estado_asistencia === 'Ausente' ? 'bg-gray-500 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-200'"
                                                        class="px-3 py-1 text-xs font-bold rounded transition-colors mx-1 w-10">A</button>
                                                <button @click="cambiarAsistencia(j, 'Inhabilitado')" :disabled="cargandoAsistencia"
                                                        :class="j.estado_asistencia === 'Inhabilitado' ? 'bg-red-500 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-200'"
                                                        class="px-3 py-1 text-xs font-bold rounded transition-colors w-10" title="Sancionado/Inhabilitado">I</button>
                                            </div>
                                        </li>
                                    </ul>
                                </div>

                                <div>
                                    <h5 class="text-xs font-bold text-gray-700 uppercase mb-3 bg-gray-100 px-3 py-2 rounded-md border border-gray-200 flex justify-between items-center">
                                        <span>{{ partidoDetalle?.visitante_nombre }} (V)</span>
                                        <span class="bg-gray-300 text-gray-800 px-2 py-0.5 rounded-full">{{ jugadoresVisitante.length }} Jugadores</span>
                                    </h5>
                                    
                                    <div v-if="jugadoresVisitante.length === 0" class="text-sm text-gray-500 italic py-4 text-center bg-gray-50 rounded-lg border border-dashed border-gray-200">
                                        Alineación no registrada aún.
                                    </div>
                                    
                                    <ul v-else class="space-y-2 pr-2">
                                        <li v-for="j in jugadoresVisitante" :key="j.id_jugador" 
                                            class="flex flex-col sm:flex-row sm:items-center justify-between text-sm bg-white p-3 rounded-lg border border-gray-200 shadow-sm transition-colors"
                                            :class="{'border-l-4 border-l-green-500': j.estado_asistencia === 'Presente', 'border-l-4 border-l-red-500': j.estado_asistencia === 'Inhabilitado'}">
                                            
                                            <div class="flex items-center mb-2 sm:mb-0">
                                                <span class="w-7 h-7 flex items-center justify-center font-black text-gray-600 bg-gray-200 rounded-full text-xs mr-3 shrink-0">
                                                    {{ j.numero_camiseta || '-' }}
                                                </span>
                                                <span class="font-medium text-gray-900 truncate" :class="{'line-through text-gray-400': j.estado_asistencia === 'Inhabilitado'}">
                                                    {{ j.nombre }} {{ j.apellido }}
                                                </span>
                                                <span v-if="j.es_capitan === true || j.es_capitan === 'true' || j.rol === 'Capitán'" 
                                                      class="ml-2 px-1.5 py-0.5 bg-yellow-400 text-yellow-900 text-[9px] font-black rounded shadow-sm border border-yellow-500 shrink-0" 
                                                      title="Capitán">©</span>
                                            </div>
                                            
                                            <div class="flex bg-gray-100 p-1 rounded-md shrink-0">
                                                <button @click="cambiarAsistencia(j, 'Presente')" :disabled="cargandoAsistencia"
                                                        :class="j.estado_asistencia === 'Presente' ? 'bg-green-500 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-200'"
                                                        class="px-3 py-1 text-xs font-bold rounded transition-colors w-10">P</button>
                                                <button @click="cambiarAsistencia(j, 'Ausente')" :disabled="cargandoAsistencia"
                                                        :class="j.estado_asistencia === 'Ausente' ? 'bg-gray-500 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-200'"
                                                        class="px-3 py-1 text-xs font-bold rounded transition-colors mx-1 w-10">A</button>
                                                <button @click="cambiarAsistencia(j, 'Inhabilitado')" :disabled="cargandoAsistencia"
                                                        :class="j.estado_asistencia === 'Inhabilitado' ? 'bg-red-500 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-200'"
                                                        class="px-3 py-1 text-xs font-bold rounded transition-colors w-10" title="Sancionado/Inhabilitado">I</button>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div v-if="partidoDetalle?.estado !== 'En Juego' && partidoDetalle?.estado !== 'Finalizado'" 
                             class="mt-8 text-center bg-white p-8 rounded-2xl border-2 border-dashed border-gray-300 shadow-sm">
                            <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                            </div>
                            <h4 class="text-xl font-black text-gray-800 mb-2">¿Todo listo para el salto inicial?</h4>
                            <p class="text-sm text-gray-500 mb-6 max-w-md mx-auto">Asegúrate de haber marcado la asistencia de los jugadores oficiales. Al iniciar el partido, se habilitará la opción para que el Administrador registre el marcador final.</p>
                            
                            <button @click="marcarListoParaJugar" :disabled="procesandoInicio" 
                                    class="bg-indigo-600 hover:bg-indigo-700 text-white font-black py-4 px-10 rounded-full shadow-lg transition-all transform hover:scale-105 flex items-center justify-center mx-auto w-full sm:w-auto disabled:opacity-50 disabled:cursor-not-allowed">
                                <svg v-if="procesandoInicio" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <svg v-else class="w-6 h-6 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                                {{ procesandoInicio ? 'INICIANDO...' : 'LISTO PARA JUGAR' }}
                            </button>
                        </div>

                    </div>
                </div>
            </div>
        </main>
    </div>
</template>
<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import SidebarArbitro from '../components/SidebarArbitro.vue'
import { 
    obtenerTorneosAsignadosService, 
    obtenerPartidosPorTorneoService, 
    obtenerDetallePartidoService,
    obtenerAlineacionPartidoService, 
    marcarAsistenciaJugadorService,
    iniciarPartidoService
} from '../services/arbitrosService.js'

const router = useRouter()

const usuarioGuardado = JSON.parse(localStorage.getItem('usuario') || '{}')
const userName = ref(usuarioGuardado.nombre || 'Árbitro')
const idArbitroActual = ref(usuarioGuardado.id_usuario || 1)
const procesandoInicio = ref(false)
const viewMode = ref('torneos') 
const torneos = ref([])
const partidos = ref([])
const partidoDetalle = ref(null)

const jugadoresLocal = ref([])
const jugadoresVisitante = ref([])

const torneoSeleccionado = ref(null)
const partidoSeleccionado = ref(null)

const cargandoAsistencia = ref(false)

const tituloVista = computed(() => {
    if (viewMode.value === 'torneos') return 'Torneos Asignados'
    if (viewMode.value === 'partidos') return `Partidos Programados`
    if (viewMode.value === 'detalle') return 'Ficha Técnica'
})

onMounted(() => {
    cargarTorneos()
})
const marcarListoParaJugar = async () => {
    const faltanLocal = jugadoresLocal.value.some(j => j.estado_asistencia === 'Pendiente');
    const faltanVisitante = jugadoresVisitante.value.some(j => j.estado_asistencia === 'Pendiente');

    if (faltanLocal || faltanVisitante) {
        return alert('PASE DE LISTA INCOMPLETO:\n\nDebes marcar la asistencia (Presente, Ausente o Inhabilitado) de absolutamente TODOS los jugadores en ambos equipos antes de iniciar el partido.');
    }
    const presentesLocal = jugadoresLocal.value.filter(j => j.estado_asistencia === 'Presente');
    const presentesVisitante = jugadoresVisitante.value.filter(j => j.estado_asistencia === 'Presente');

    if (presentesLocal.length < 5) {
        return alert(`EQUIPO INCOMPLETO:\n\nEl equipo Local (${partidoDetalle.value.local_nombre}) solo tiene ${presentesLocal.length} jugador(es) presente(s). Se requiere un mínimo de 5 para jugar.`);
    }

    if (presentesVisitante.length < 5) {
        return alert(`EQUIPO INCOMPLETO:\n\nEl equipo Visitante (${partidoDetalle.value.visitante_nombre}) solo tiene ${presentesVisitante.length} jugador(es) presente(s). Se requiere un mínimo de 5 para jugar.`);
    }

    const capitanLocalPresente = presentesLocal.some(j => j.es_capitan === true || j.es_capitan === 'true' || j.rol === 'Capitán');
    const capitanVisitantePresente = presentesVisitante.some(j => j.es_capitan === true || j.es_capitan === 'true' || j.rol === 'Capitán');

    if (!capitanLocalPresente) {
        return alert(`CAPITÁN AUSENTE:\n\nEl equipo Local (${partidoDetalle.value.local_nombre}) no tiene a su capitán en cancha (marcado como "Presente"). Es obligatorio que haya un capitán para iniciar el partido.`);
    }

    if (!capitanVisitantePresente) {
        return alert(`CAPITÁN AUSENTE:\n\nEl equipo Visitante (${partidoDetalle.value.visitante_nombre}) no tiene a su capitán en cancha (marcado como "Presente"). Es obligatorio que haya un capitán para iniciar el partido.`);
    }
    if (!confirm('¿Confirmas que ya pasaste lista a ambos equipos, cumplen con el mínimo de jugadores, los capitanes están presentes y el partido está por comenzar?')) {
        return;
    }

    procesandoInicio.value = true;
    try {
        await iniciarPartidoService(partidoDetalle.value.id_partido);
        partidoDetalle.value.estado = 'En Juego'; 
        alert('¡El partido ha comenzado oficialmente!');
    } catch (error) {
        console.error("Error al iniciar partido", error);
        alert('Ocurrió un error al intentar iniciar el partido.');
    } finally {
        procesandoInicio.value = false;
    }
}
const cargarTorneos = async () => {
    try {
        if (idArbitroActual.value) {
            torneos.value = await obtenerTorneosAsignadosService(idArbitroActual.value)
        }
    } catch (error) {
        console.error("Error cargando torneos", error)
    }
}

const seleccionarTorneo = async (torneo) => {
    torneoSeleccionado.value = torneo
    try {
        partidos.value = await obtenerPartidosPorTorneoService(idArbitroActual.value, torneo.id_torneo)
        viewMode.value = 'partidos'
    } catch (error) {
        console.error("Error cargando partidos", error)
    }
}

const seleccionarPartido = async (partido) => {
    partidoSeleccionado.value = partido
    try {
        const detalle = await obtenerDetallePartidoService(idArbitroActual.value, partido.id_partido)
        partidoDetalle.value = detalle
        jugadoresLocal.value = await obtenerAlineacionPartidoService(partido.id_partido, detalle.id_local)
        jugadoresVisitante.value = await obtenerAlineacionPartidoService(partido.id_partido, detalle.id_visitante)

        viewMode.value = 'detalle'
    } catch (error) {
        console.error("Error cargando detalle o alineaciones", error)
    }
}

const cambiarAsistencia = async (jugador, nuevoEstado) => {
    if (jugador.estado_asistencia === nuevoEstado) return; 
    
    cargandoAsistencia.value = true;
    const estadoAnterior = jugador.estado_asistencia; 
    
    jugador.estado_asistencia = nuevoEstado; 

    try {
        await marcarAsistenciaJugadorService(partidoDetalle.value.id_partido, jugador.id_jugador, nuevoEstado);
    } catch (error) {
        console.error("Fallo al guardar asistencia:", error);
        jugador.estado_asistencia = estadoAnterior; 
        alert("Ocurrió un error al guardar la asistencia en la nube.");
    } finally {
        cargandoAsistencia.value = false;
    }
}

const volverAtras = () => {
    if (viewMode.value === 'detalle') {
        viewMode.value = 'partidos'
        partidoDetalle.value = null
        partidoSeleccionado.value = null
        jugadoresLocal.value = []
        jugadoresVisitante.value = []
    } else if (viewMode.value === 'partidos') {
        volverATorneos()
    }
}

const volverATorneos = () => {
    viewMode.value = 'torneos'
    torneoSeleccionado.value = null
    partidoSeleccionado.value = null
    partidos.value = []
    partidoDetalle.value = null
    jugadoresLocal.value = []
    jugadoresVisitante.value = []
    cargarTorneos()
}

const formatFecha = (fechaString) => {
    if (!fechaString) return '';
    const date = new Date(fechaString);
    const offset = date.getTimezoneOffset()
    date.setMinutes(date.getMinutes() + offset)
    return date.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
}

const logout = () => {
    localStorage.removeItem('usuario')
    localStorage.removeItem('usuario_id')
    router.push('/login')
}
</script>

<style scoped>
.animate-fade-in {
    animation: fadeIn 0.3s ease-in-out;
}
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}
</style>