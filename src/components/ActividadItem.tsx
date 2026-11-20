import { useState } from 'react';
import { AlertCircle, Calendar, Check, Pencil, Trash2 } from 'lucide-react';
import { Actividad, Prioridad, formatFechaDisplay, getTodayIsoDate } from '../types/agenda';

interface ActividadItemProps {
  actividad: Actividad;
  onToggleCompletada: (id: number) => void;
  onEliminar: (id: number) => void;
  onEditar: (id: number, nuevoNombre: string, nuevaFecha: string) => void;
}

const PRIORIDAD_VISUAL: Record<
  Prioridad,
  { dotClass: string; textClass: string; label: string }
> = {
  [Prioridad.Alta]: {
    dotClass: 'bg-red-600',
    textClass: 'text-red-700',
    label: 'Prioridad Alta',
  },
  [Prioridad.Media]: {
    dotClass: 'bg-amber-600',
    textClass: 'text-amber-700',
    label: 'Prioridad Media',
  },
  [Prioridad.Baja]: {
    dotClass: 'bg-emerald-600',
    textClass: 'text-emerald-700',
    label: 'Prioridad Baja',
  },
};

export function ActividadItem({
  actividad,
  onToggleCompletada,
  onEliminar,
  onEditar,
}: ActividadItemProps) {
  const [editando, setEditando] = useState(false);
  const [nombreEditado, setNombreEditado] = useState(actividad.nombre);
  const [fechaEditada, setFechaEditada] = useState(actividad.fecha);
  const [errorEdicion, setErrorEdicion] = useState('');

  const visual = PRIORIDAD_VISUAL[actividad.prioridad];

  const abrirEdicion = () => {
    setNombreEditado(actividad.nombre);
    setFechaEditada(actividad.fecha);
    setErrorEdicion('');
    setEditando(true);
  };

  const cancelarEdicion = () => {
    setErrorEdicion('');
    setEditando(false);
  };

  const guardarEdicion = (e: React.FormEvent) => {
    e.preventDefault();
    const limpio = nombreEditado.trim();
    if (!limpio) {
      setErrorEdicion('Debes escribir un nombre para la actividad.');
      return;
    }
    const fechaFinal = fechaEditada.trim() || getTodayIsoDate();
    onEditar(actividad.id, limpio, fechaFinal);
    setEditando(false);
    setErrorEdicion('');
  };

  if (editando) {
    return (
      <li className="rounded-2xl border border-blue-200 bg-blue-50/40 p-3.5">
        <form onSubmit={guardarEdicion} className="space-y-3" noValidate>
          <div>
            <label
              htmlFor={`edit-nombre-${actividad.id}`}
              className="block text-xs font-medium text-slate-700"
            >
              Editar nombre de la actividad
            </label>
            <input
              id={`edit-nombre-${actividad.id}`}
              type="text"
              value={nombreEditado}
              onChange={(e) => {
                setNombreEditado(e.target.value);
                if (e.target.value.trim()) setErrorEdicion('');
              }}
              className={`mt-1 min-h-[44px] w-full rounded-xl border bg-white px-3 text-sm text-slate-900 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-blue-600 ${
                errorEdicion ? 'border-red-500' : 'border-slate-300'
              }`}
              placeholder="Escribe la actividad..."
              autoFocus
            />
            {errorEdicion && (
              <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-700">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span>{errorEdicion}</span>
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor={`edit-fecha-${actividad.id}`}
              className="block text-xs font-medium text-slate-700"
            >
              Editar fecha
            </label>
            <input
              id={`edit-fecha-${actividad.id}`}
              type="date"
              value={fechaEditada}
              onChange={(e) => setFechaEditada(e.target.value)}
              className="mt-1 min-h-[44px] w-full rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-900 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-blue-600"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={cancelarEdicion}
              className="min-h-[44px] rounded-xl border border-slate-300 bg-white px-4 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 active:scale-[0.98] whitespace-nowrap shrink-0"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="min-h-[44px] rounded-xl bg-blue-700 px-4 text-sm font-medium text-white transition-colors hover:bg-blue-800 active:scale-[0.98] whitespace-nowrap shrink-0"
            >
              Guardar
            </button>
          </div>
        </form>
      </li>
    );
  }

  return (
    <li className="rounded-2xl border border-slate-200 bg-white px-2.5 py-2 transition-colors hover:border-slate-300">
      <div className="flex items-center gap-1.5">
        {/* Control para marcar como completada (touch target >= 44x44px) */}
        <button
          type="button"
          role="checkbox"
          aria-checked={actividad.completada}
          aria-label={
            actividad.completada
              ? `Desmarcar "${actividad.nombre}" como completada`
              : `Marcar "${actividad.nombre}" como completada`
          }
          onClick={() => onToggleCompletada(actividad.id)}
          className="flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-xl transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
        >
          <span
            className={`flex h-5 w-5 items-center justify-center rounded-md border transition-colors ${
              actividad.completada
                ? 'border-blue-700 bg-blue-700 text-white'
                : 'border-slate-400 bg-white'
            }`}
          >
            {actividad.completada && <Check className="h-3.5 w-3.5 stroke-[2.5]" />}
          </span>
        </button>

        {/* Nombre, fecha y prioridad */}
        <div className="min-w-0 flex-1 py-1">
          <p
            className={`text-[15px] leading-snug font-medium break-words transition-colors ${
              actividad.completada
                ? 'text-slate-400 line-through'
                : 'text-slate-900'
            }`}
          >
            {actividad.nombre}
          </p>

          <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-slate-600">
            <span className="inline-flex items-center gap-1 tabular-nums">
              <Calendar className="h-3.5 w-3.5 text-slate-400" aria-hidden="true" />
              <span>{formatFechaDisplay(actividad.fecha)}</span>
            </span>

            <span aria-hidden="true" className="text-slate-300">
              ·
            </span>

            <span className={`inline-flex items-center gap-1.5 font-medium ${visual.textClass}`}>
              <span
                className={`h-2 w-2 rounded-xs ${visual.dotClass}`}
                aria-hidden="true"
              />
              <span>{visual.label}</span>
            </span>
          </div>
        </div>

        {/* Acciones: Editar y Eliminar (touch target >= 44x44px) */}
        <div className="flex shrink-0 items-center">
          <button
            type="button"
            onClick={abrirEdicion}
            aria-label={`Editar "${actividad.nombre}"`}
            title="Editar actividad"
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-slate-100 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          >
            <Pencil className="h-[18px] w-[18px]" />
          </button>

          <button
            type="button"
            onClick={() => onEliminar(actividad.id)}
            aria-label={`Eliminar "${actividad.nombre}"`}
            title="Eliminar actividad"
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-xl text-slate-500 transition-colors hover:bg-red-50 hover:text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
          >
            <Trash2 className="h-[18px] w-[18px]" />
          </button>
        </div>
      </div>
    </li>
  );
}
