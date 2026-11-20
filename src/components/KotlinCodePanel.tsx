import { useState } from 'react';
import { Check, Copy, FileCode2 } from 'lucide-react';
import { KOTLIN_FILES } from '../data/kotlinFiles';

export function KotlinCodePanel() {
  const [selectedId, setSelectedId] = useState<string>(KOTLIN_FILES[0].id);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const activeFile = KOTLIN_FILES.find((f) => f.id === selectedId) ?? KOTLIN_FILES[0];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(activeFile.code);
      setCopiedId(activeFile.id);
      window.setTimeout(() => setCopiedId(null), 1800);
    } catch {
      setCopiedId(null);
    }
  };

  const lines = activeFile.code.split('\n');

  return (
    <section
      aria-label="Código fuente Android en Kotlin y Jetpack Compose"
      className="flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white"
    >
      {/* Cabecera del visor de código */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-5 py-4">
        <div className="flex items-center gap-2.5 min-w-0">
          <FileCode2 className="h-5 w-5 shrink-0 text-blue-700" aria-hidden="true" />
          <div className="min-w-0">
            <h2 className="text-base font-semibold text-slate-900">
              Código Kotlin y Jetpack Compose
            </h2>
            <p className="text-xs text-slate-600 truncate">
              {activeFile.packagePath}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex min-h-[40px] items-center gap-2 rounded-xl border border-slate-300 bg-white px-3.5 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-50 active:scale-[0.98] whitespace-nowrap shrink-0"
        >
          {copiedId === activeFile.id ? (
            <>
              <Check className="h-4 w-4 text-emerald-600" aria-hidden="true" />
              <span>Copiado</span>
            </>
          ) : (
            <>
              <Copy className="h-4 w-4 text-slate-500" aria-hidden="true" />
              <span>Copiar archivo</span>
            </>
          )}
        </button>
      </div>

      {/* Pestañas de archivos */}
      <div
        role="tablist"
        aria-label="Archivos del proyecto Android"
        className="flex items-center gap-1.5 overflow-x-auto border-b border-slate-200 bg-slate-50 px-4 py-2"
      >
        {KOTLIN_FILES.map((file) => {
          const isActive = file.id === activeFile.id;
          return (
            <button
              key={file.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setSelectedId(file.id)}
              className={`min-h-[36px] rounded-lg px-3 text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                isActive
                  ? 'bg-white text-blue-700 shadow-xs border border-slate-200'
                  : 'text-slate-600 hover:bg-white/70 hover:text-slate-900'
              }`}
            >
              {file.fileName}
            </button>
          );
        })}
      </div>

      {/* Descripción breve del archivo */}
      <div className="border-b border-slate-200 bg-slate-50/50 px-5 py-2.5 text-xs text-slate-600">
        {activeFile.summary}
      </div>

      {/* Contenido del código */}
      <div className="flex-1 overflow-auto bg-slate-950 p-4 text-slate-100">
        <pre className="font-mono text-[12.5px] leading-relaxed">
          <code>
            {lines.map((line, idx) => (
              <div key={idx} className="table-row">
                <span className="table-cell select-none pr-4 text-right text-slate-500 tabular-nums">
                  {idx + 1}
                </span>
                <span className="table-cell whitespace-pre">{line}</span>
              </div>
            ))}
          </code>
        </pre>
      </div>
    </section>
  );
}
