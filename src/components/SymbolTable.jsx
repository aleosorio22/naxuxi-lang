const TIPO_COLORS = {
  entero:      { bg: '#1e3322', text: '#b5cea8' },
  decimal:     { bg: '#1e3322', text: '#b5cea8' },
  cadena:      { bg: '#3b2318', text: '#ce9178' },
  booleano:    { bg: '#2d2466', text: '#9cdcfe' },
  entrada:     { bg: '#1a2d3b', text: '#4ec9b0' },
  funcion:     { bg: '#2a2310', text: '#dcdcaa' },
  parametro:   { bg: '#1e2535', text: '#9cdcfe' },
  referencia:  { bg: '#2d2d2d', text: '#858585' },
  desconocido: { bg: '#2d2d2d', text: '#858585' },
}

// Agrupa los símbolos: primero funciones+parámetros, luego variables
function agrupar(simbolos) {
  const fns  = simbolos.filter(s => s.tipo === 'funcion' || s.tipo === 'parametro')
  const vars = simbolos.filter(s => s.tipo !== 'funcion' && s.tipo !== 'parametro')
  return { fns, vars }
}

export default function SymbolTable({ simbolos }) {
  if (!simbolos || simbolos.length === 0) {
    return (
      <div className="flex items-center justify-center h-full"
           style={{ color: 'var(--text-muted)', fontSize: 13 }}>
        Sin símbolos declarados.
      </div>
    )
  }

  const { fns, vars } = agrupar(simbolos)

  return (
    <div className="overflow-auto h-full">
      <table className="nax-table">
        <thead>
          <tr>
            <th>Identificador</th>
            <th>Tipo</th>
            <th>Valor / Asignación</th>
            <th>Línea</th>
            <th>Columna</th>
          </tr>
        </thead>
        <tbody>
          {/* Funciones y parámetros */}
          {fns.length > 0 && (
            <>
              <SectionRow label="Funciones y parámetros" />
              {fns.map((s, i) => <SimboloRow key={`fn-${i}`} s={s} />)}
            </>
          )}
          {/* Variables */}
          {vars.length > 0 && (
            <>
              <SectionRow label="Variables" />
              {vars.map((s, i) => <SimboloRow key={`var-${i}`} s={s} />)}
            </>
          )}
        </tbody>
      </table>
    </div>
  )
}

function SectionRow({ label }) {
  return (
    <tr>
      <td colSpan={5} style={{
        fontSize: 10, fontWeight: 700, letterSpacing: '.07em',
        textTransform: 'uppercase', color: 'var(--text-muted)',
        padding: '10px 12px 4px', background: 'var(--bg-surface)',
        fontFamily: 'system-ui, sans-serif',
      }}>
        {label}
      </td>
    </tr>
  )
}

function SimboloRow({ s }) {
  const colores = TIPO_COLORS[s.tipo] ?? TIPO_COLORS.desconocido
  const esParametro = s.tipo === 'parametro'
  return (
    <tr>
      <td style={{
        color: s.tipo === 'funcion' ? '#dcdcaa' : s.tipo === 'parametro' ? '#9cdcfe' : '#a5b4fc',
        fontWeight: 600,
        paddingLeft: esParametro ? 28 : undefined,
      }}>
        {esParametro && <span style={{ color: 'var(--border)', marginRight: 6 }}>└</span>}
        {s.identificador}
      </td>
      <td>
        <span className="badge" style={{ background: colores.bg, color: colores.text }}>
          {s.tipo}
        </span>
      </td>
      <td style={{ color: s.valor === '—' ? 'var(--text-muted)' : 'var(--text)', fontStyle: s.valor === '—' ? 'italic' : 'normal' }}>
        {s.valor}
      </td>
      <td style={{ color: 'var(--text-muted)' }}>{s.linea}</td>
      <td style={{ color: 'var(--text-muted)' }}>{s.columna}</td>
    </tr>
  )
}
