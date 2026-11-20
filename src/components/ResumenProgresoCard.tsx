interface ResumenProgresoCardProps {
  total: number;
  completadas: number;
}

export function ResumenProgresoCard({ total, completadas }: ResumenProgresoCardProps) {
  const porcentaje = total === 0 ? 0 : Math.round((completadas / total) * 100);
  const radio = 24;
  const circunferencia = 2 * Math.PI * radio;
  const trazoOffset = circunferencia - (porcentaje / 100) * circunferencia;

  return (
    <section
      aria-label="Resumen de progreso"
      className="rounded-2xl border border-slate-200 bg-white p-4"
    >
      <div className="flex items-center gap-4">
        {/* Círculo de porcentaje */}
        <div className="relative flex h-16 w-16 shrink-0 items-center justify-center">
          <svg
            className="h-16 w-16 -rotate-90"
            viewBox="0 0 60 60"
            role="img"
            aria-label={`${porcentaje}% de actividades completadas`}
          >
            <circle
              cx="30"
              cy="30"
              r={radio}
              fill="none"
              stroke="#E2E8F0"
              strokeWidth="6"
            />
            <circle
              cx="30"
              cy="30"
              r={radio}
              fill="none"
              stroke={porcentaje === 100 && total > 0 ? '#059669' : '#1D4ED8'}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circunferencia}
              strokeDashoffset={trazoOffset}
              className="transition-[stroke-dashoffset] duration-300 ease-out"
            />
          </svg>
          <span className="absolute text-sm font-bold text-slate-900 tabular-nums">
            {porcentaje}%
          </span>
        </div>

        {/* Texto + Barra de progreso */}
        <div className="min-w-0 flex-1">
          <div className="flex items-baseline justify-between gap-2">
            <h2 className="text-sm font-semibold text-slate-900">
              Progreso de tus actividades
            </h2>
            <span className="text-xs font-medium text-slate-500 tabular-nums whitespace-nowrap shrink-0">
              {completadas} / {total}
            </span>
          </div>

          <p className="mt-0.5 text-xs text-slate-600">
            {total === 0
              ? 'Agrega una actividad para comenzar.'
              : completadas === total
                ? 'Has completado todas tus actividades.'
                : `${completadas} de ${total} actividades completadas`}
          </p>

          <div
            className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-slate-100"
            role="progressbar"
            aria-valuenow={porcentaje}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className={`h-full rounded-full transition-all duration-300 ease-out ${
                porcentaje === 100 && total > 0 ? 'bg-emerald-600' : 'bg-blue-700'
              }`}
              style={{ width: `${porcentaje}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
