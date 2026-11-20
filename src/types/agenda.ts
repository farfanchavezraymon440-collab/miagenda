export enum Prioridad {
  Baja = 'Baja',
  Media = 'Media',
  Alta = 'Alta',
}

export interface Actividad {
  id: number;
  nombre: string;
  fecha: string; // Formato ISO local YYYY-MM-DD
  prioridad: Prioridad;
  completada: boolean;
}

export function getTodayIsoDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatFechaDisplay(isoDate: string): string {
  const effectiveDate = isoDate.trim() || getTodayIsoDate();
  const parts = effectiveDate.split('-');
  if (parts.length !== 3) return effectiveDate;

  const year = Number(parts[0]);
  const month = Number(parts[1]) - 1;
  const day = Number(parts[2]);
  const dateObj = new Date(year, month, day);

  if (Number.isNaN(dateObj.getTime())) return effectiveDate;

  const todayStr = getTodayIsoDate();
  const formatted = dateObj.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return effectiveDate === todayStr ? `Hoy (${formatted})` : formatted;
}
