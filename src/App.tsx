import { useMemo, useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  BatteryFull,
  Calendar,
  Code2,
  Plus,
  Search,
  Signal,
  Wifi,
  X,
} from 'lucide-react';
import { ActividadItem } from './components/ActividadItem';
import { KotlinCodePanel } from './components/KotlinCodePanel';
import { ResumenProgresoCard } from './components/ResumenProgresoCard';
import { Actividad, Prioridad, getTodayIsoDate } from './types/agenda';

const ACTIVIDADES_INICIALES: Actividad[] = [
  {
    id: 1,
    nombre: 'Repasar Jetpack Compose y estados',
    fecha: getTodayIsoDate(),
    prioridad: Prioridad.Alta,
    completada: true,
  },
  {
    id: 2,
    nombre: 'Practicar listas con LazyColumn',
    fecha: getTodayIsoDate(),
    prioridad: Prioridad.Media,
    completada: false,
  },
  {
    id: 3,
    nombre: 'Revisar apuntes de Kotlin básico',
    fecha: getTodayIsoDate(),
    prioridad: Prioridad.Baja,
    completada: false,
  },
];

const PRIORIDADES: Prioridad[] = [Prioridad.Baja, Prioridad.Media, Prioridad.Alta];

function getPrioridadButtonStyle(prioridad: Prioridad, selected: boolean): string {
  if (!selected) {
    return 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900';
  }
  switch (prioridad) {
    case Prioridad.Alta:
      return 'border-red-300 bg-red-50 text-red-800 font-semibold';
    case Prioridad.Media:
      return 'border-amber-300 bg-amber-50 text-amber-800 font-semibold';
    case Prioridad.Baja:
      return 'border-emerald-300 bg-emerald-50 text-emerald-800 font-semibold';
  }
}

function getPrioridadDotClass(prioridad: Prioridad): string {
  switch (prioridad) {
    case Prioridad.Alta:
      return 'bg-red-600';
    case Prioridad.Media:
      return 'bg-amber-600';
    case Prioridad.Baja:
      return 'bg-emerald-600';
  }
}

export default function App() {
  // Estado en memoria: se conserva únicamente mientras la aplicación esté abierta
  const [actividades, setActividades] = useState<Actividad[]>(ACTIVIDADES_INICIALES);
  const [siguienteId, setSiguienteId] = useState<number>(4);

  // Estado del formulario para agregar actividad
  const [textoActividad, setTextoActividad] = useState<string>('');
  const [fechaActividad, setFechaActividad] = useState<string>(getTodayIsoDate());
  const [prioridadActividad, setPrioridadActividad] = useState<Prioridad>(Prioridad.Media);
  const [errorNombre, setErrorNombre] = useState<string>('');

  // Estado de búsqueda en tiempo real
  const [busqueda, setBusqueda] = useState<string>('');

  // Alternar entre la app Mi Agenda y el visor de código Kotlin dentro del teléfono
  const [mostrarKotlin, setMostrarKotlin] = useState<boolean>(false);

  const horaActual = useMemo(() => {
    const ahora = new Date();
    return ahora.toLocaleTimeString('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  }, []);

  const actividadesFiltradas = useMemo(() => {
    const termino = busqueda.trim().toLowerCase();
    if (!termino) return actividades;
    return actividades.filter((item) => item.nombre.toLowerCase().includes(termino));
  }, [actividades, busqueda]);

  const totalActividades = actividades.length;
  const totalCompletadas = useMemo(
    () => actividades.filter((item) => item.completada).length,
    [actividades]
  );

  const manejarAgregarActividad = (e: React.FormEvent) => {
    e.preventDefault();
    const nombreLimpio = textoActividad.trim();

    if (!nombreLimpio) {
      setErrorNombre('Por favor, escribe una actividad antes de agregarla.');
      return;
    }

    const fechaFinal = fechaActividad.trim() || getTodayIsoDate();

    const nueva: Actividad = {
      id: siguienteId,
      nombre: nombreLimpio,
      fecha: fechaFinal,
      prioridad: prioridadActividad,
      completada: false,
    };

    setActividades((prev) => [nueva, ...prev]);
    setSiguienteId((prev) => prev + 1);
    setTextoActividad('');
    setFechaActividad(getTodayIsoDate());
    setPrioridadActividad(Prioridad.Media);
    setErrorNombre('');
  };

  const manejarToggleCompletada = (id: number) => {
    setActividades((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completada: !item.completada } : item
      )
    );
  };

  const manejarEliminar = (id: number) => {
    setActividades((prev) => prev.filter((item) => item.id !== id));
  };

  const manejarEditar = (id: number, nuevoNombre: string, nuevaFecha: string) => {
    setActividades((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, nombre: nuevoNombre, fecha: nuevaFecha }
          : item
      )
    );
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-slate-200 p-3 sm:p-6">
      {/* Dispositivo móvil siempre visible */}
      <div className="relative w-full max-w-[392px]">
        {/* Botones físicos laterales del dispositivo */}
        <div
          aria-hidden="true"
          className="absolute -right-[3px] top-28 h-14 w-[3px] rounded-r-sm bg-slate-700"
        />
        <div
          aria-hidden="true"
          className="absolute -right-[3px] top-46 h-10 w-[3px] rounded-r-sm bg-slate-700"
        />
        <div
          aria-hidden="true"
          className="absolute -left-[3px] top-32 h-16 w-[3px] rounded-l-sm bg-slate-700"
        />

        {/* Marco exterior del teléfono */}
        <div className="flex h-[min(800px,calc(100vh-1.5rem))] min-h-[600px] w-full flex-col rounded-[46px] bg-slate-900 p-[11px] shadow-2xl ring-1 ring-slate-800">
          {/* Pantalla interior del teléfono */}
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-[36px] bg-slate-50">
            {/* Barra de estado del teléfono (hora, cámara frontal, señal y batería) */}
            <div
              aria-hidden="true"
              className="flex h-8 shrink-0 items-center justify-between bg-white px-6 text-[11px] font-semibold text-slate-800 select-none"
            >
              <span className="tabular-nums">{horaActual}</span>
              <span className="h-3.5 w-3.5 rounded-full bg-slate-900 ring-2 ring-slate-200" />
              <div className="flex items-center gap-1.5 text-slate-700">
                <Signal className="h-3.5 w-3.5" />
                <Wifi className="h-3.5 w-3.5" />
                <BatteryFull className="h-4 w-4" />
              </div>
            </div>

            {/* Barra superior de la app "Mi Agenda" */}
            <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center justify-between gap-3 border-b border-slate-200 bg-white px-4">
              {mostrarKotlin ? (
                <>
                  <button
                    type="button"
                    onClick={() => setMostrarKotlin(false)}
                    className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl px-2 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-50 whitespace-nowrap shrink-0"
                  >
                    <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                    <span>Volver a Mi Agenda</span>
                  </button>
                  <span className="text-xs font-medium text-slate-500 whitespace-nowrap shrink-0">
                    Jetpack Compose
                  </span>
                </>
              ) : (
                <>
                  <h1 className="font-display text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0">
                    Mi Agenda
                  </h1>

                  <button
                    type="button"
                    onClick={() => setMostrarKotlin(true)}
                    className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 active:scale-[0.98] whitespace-nowrap shrink-0"
                  >
                    <Code2 className="h-4 w-4 text-blue-700" aria-hidden="true" />
                    <span>Código Kotlin</span>
                  </button>
                </>
              )}
            </header>

            {/* Contenido de la pantalla */}
            {mostrarKotlin ? (
              <div className="flex-1 overflow-hidden p-3">
                <KotlinCodePanel />
              </div>
            ) : (
              <main className="flex-1 overflow-y-auto px-4 py-4">
                <div className="space-y-4 pb-6">
                  {/* 1. Formulario para agregar nueva actividad */}
                  <section
                    aria-label="Nueva actividad"
                    className="rounded-2xl border border-slate-200 bg-white p-4"
                  >
                    <form onSubmit={manejarAgregarActividad} className="space-y-3" noValidate>
                      <div>
                        <label
                          htmlFor="nueva-actividad-input"
                          className="block text-xs font-semibold text-slate-700"
                        >
                          Actividad
                        </label>
                        <input
                          id="nueva-actividad-input"
                          type="text"
                          value={textoActividad}
                          onChange={(e) => {
                            setTextoActividad(e.target.value);
                            if (e.target.value.trim()) {
                              setErrorNombre('');
                            }
                          }}
                          placeholder="Escribe una actividad..."
                          aria-invalid={Boolean(errorNombre)}
                          aria-describedby={errorNombre ? 'error-actividad-vacia' : undefined}
                          className={`mt-1.5 min-h-[44px] w-full rounded-xl border bg-white px-3.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-blue-600 ${
                            errorNombre ? 'border-red-500' : 'border-slate-300'
                          }`}
                        />
                        {errorNombre && (
                          <p
                            id="error-actividad-vacia"
                            role="alert"
                            className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-700"
                          >
                            <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                            <span>{errorNombre}</span>
                          </p>
                        )}
                      </div>

                      {/* Fecha de la actividad (por defecto hoy) */}
                      <div>
                        <label
                          htmlFor="fecha-actividad-input"
                          className="block text-xs font-semibold text-slate-700"
                        >
                          Fecha (si no eliges una, se usará hoy)
                        </label>
                        <div className="relative mt-1.5">
                          <Calendar
                            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                            aria-hidden="true"
                          />
                          <input
                            id="fecha-actividad-input"
                            type="date"
                            value={fechaActividad}
                            onChange={(e) => setFechaActividad(e.target.value)}
                            className="min-h-[44px] w-full rounded-xl border border-slate-300 bg-white pl-9 pr-3 text-sm text-slate-900 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-blue-600"
                          />
                        </div>
                      </div>

                      {/* Nivel de prioridad (Baja, Media, Alta) */}
                      <div>
                        <span className="block text-xs font-semibold text-slate-700">
                          Prioridad
                        </span>
                        <div
                          role="group"
                          aria-label="Seleccionar nivel de prioridad"
                          className="mt-1.5 grid grid-cols-3 gap-2"
                        >
                          {PRIORIDADES.map((nivel) => {
                            const selected = prioridadActividad === nivel;
                            return (
                              <button
                                key={nivel}
                                type="button"
                                aria-pressed={selected}
                                onClick={() => setPrioridadActividad(nivel)}
                                className={`flex min-h-[44px] items-center justify-center gap-1.5 rounded-xl border px-2 text-xs transition-colors active:scale-[0.98] whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 ${getPrioridadButtonStyle(
                                  nivel,
                                  selected
                                )}`}
                              >
                                <span
                                  className={`h-2 w-2 rounded-xs ${getPrioridadDotClass(nivel)}`}
                                  aria-hidden="true"
                                />
                                <span>{nivel}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Botón principal */}
                      <button
                        type="submit"
                        className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-blue-700 px-4 text-sm font-semibold text-white transition-colors hover:bg-blue-800 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 whitespace-nowrap"
                      >
                        <Plus className="h-4 w-4 shrink-0" aria-hidden="true" />
                        <span>Agregar actividad</span>
                      </button>
                    </form>
                  </section>

                  {/* 2. Tarjeta de resumen encima de la lista de tareas */}
                  <ResumenProgresoCard
                    total={totalActividades}
                    completadas={totalCompletadas}
                  />

                  {/* 3. Barra de búsqueda en la parte superior de la lista */}
                  <section aria-label="Lista de actividades" className="space-y-3">
                    <div className="relative">
                      <Search
                        className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                        aria-hidden="true"
                      />
                      <input
                        type="search"
                        value={busqueda}
                        onChange={(e) => setBusqueda(e.target.value)}
                        placeholder="Buscar actividad por nombre..."
                        aria-label="Buscar actividad por nombre"
                        className="min-h-[44px] w-full rounded-xl border border-slate-300 bg-white pl-10 pr-11 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-blue-600"
                      />
                      {busqueda && (
                        <button
                          type="button"
                          onClick={() => setBusqueda('')}
                          aria-label="Limpiar búsqueda"
                          className="absolute right-0.5 top-1/2 flex min-h-[40px] min-w-[40px] -translate-y-1/2 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>

                    {/* 4. Lista de actividades */}
                    {actividadesFiltradas.length === 0 ? (
                      <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-4 py-8 text-center">
                        <p className="text-sm font-medium text-slate-700">
                          {actividades.length === 0
                            ? 'Aún no tienes actividades'
                            : 'No se encontraron actividades'}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {actividades.length === 0
                            ? 'Escribe tu primera actividad en el formulario de arriba.'
                            : `Ninguna actividad coincide con "${busqueda.trim()}".`}
                        </p>
                      </div>
                    ) : (
                      <ul className="space-y-2.5">
                        {actividadesFiltradas.map((actividad) => (
                          <ActividadItem
                            key={actividad.id}
                            actividad={actividad}
                            onToggleCompletada={manejarToggleCompletada}
                            onEliminar={manejarEliminar}
                            onEditar={manejarEditar}
                          />
                        ))}
                      </ul>
                    )}
                  </section>
                </div>
              </main>
            )}

            {/* Barra de gestos inferior del teléfono Android */}
            <div
              aria-hidden="true"
              className="flex h-5 shrink-0 items-center justify-center border-t border-slate-100 bg-white"
            >
              <span className="h-1 w-28 rounded-full bg-slate-300" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

