import { useState, useMemo } from 'react'

// Dot color + etiqueta por categoría (paleta VS Code)
const TIPO_META = {
  RESERVADA:      { color: '#9cdcfe', label: 'Reservada'    },
  IDENTIFICADOR:  { color: '#4ec9b0', label: 'Identificador'},
  ENTERO:         { color: '#b5cea8', label: 'Entero'        },
  DECIMAL:        { color: '#b5cea8', label: 'Decimal'       },
  CADENA:         { color: '#ce9178', label: 'Cadena'        },
  OP_ARITMETICO:  { color: '#d4d4d4', label: 'Aritmético'    },
  OP_COMPARACION: { color: '#d4d4d4', label: 'Comparación'   },
  OP_ASIGNACION:  { color: '#d4d4d4', label: 'Asignación'    },
  DELIMITADOR:    { color: '#c586c0', label: 'Delimitador'   },
}

export default function TokenTable({ tokens }) {
  const [filtro, setFiltro] = useState('Todos')

  const counts = useMemo(() => {
    if (!tokens) return {}
    return tokens.reduce((acc, t) => { acc[t.tipo] = (acc[t.tipo] || 0) + 1; return acc }, {})
  }, [tokens])

  const tipos = useMemo(() => Object.keys(counts), [counts])

  const tokensVisibles = useMemo(
    () => (!tokens ? [] : filtro === 'Todos' ? tokens : tokens.filter(t => t.tipo === filtro)),
    [tokens, filtro]
  )

  if (!tokens || tokens.length === 0) {
    return (
      <div className="flex items-center justify-center h-full"
           style={{ color: 'var(--text-muted)', fontSize: 13 }}>
        Sin tokens. Presiona Compilar.
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>

      {/* ── Chips de filtro ── */}
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: 5, padding: '8px 12px',
        background: 'var(--bg-surface)', borderBottom: '1px solid var(--border)',
        flexShrink: 0,
      }}>
        <Chip
          label="Todos"
          count={tokens.length}
          active={filtro === 'Todos'}
          color="var(--text-muted)"
          dot="#858585"
          onClick={() => setFiltro('Todos')}
        />
        {tipos.map(tipo => {
          const meta = TIPO_META[tipo] ?? { color: '#858585', label: tipo }
          return (
            <Chip
              key={tipo}
              label={meta.label}
              count={counts[tipo]}
              active={filtro === tipo}
              color={meta.color}
              dot={meta.color}
              onClick={() => setFiltro(tipo)}
            />
          )
        })}
      </div>

      {/* ── Tabla filtrada ── */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        <table className="nax-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Lexema</th>
              <th>Categoría</th>
              <th>Línea</th>
              <th>Columna</th>
            </tr>
          </thead>
          <tbody>
            {tokensVisibles.map((tok, i) => (
              <tr key={i}>
                <td style={{ color: 'var(--text-muted)' }}>{i + 1}</td>
                <td>{tok.lexema}</td>
                <td>
                  <span className={`badge badge-${tok.tipo}`}>
                    {TIPO_META[tok.tipo]?.label ?? tok.tipo}
                  </span>
                </td>
                <td style={{ color: 'var(--text-muted)' }}>{tok.linea}</td>
                <td style={{ color: 'var(--text-muted)' }}>{tok.columna}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function Chip({ label, count, active, color, dot, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 5,
        padding: '3px 10px', borderRadius: 20, cursor: 'pointer',
        border: `1px solid ${active ? color : 'var(--border)'}`,
        background: active ? `color-mix(in srgb, ${dot} 12%, transparent)` : 'transparent',
        color: active ? color : 'var(--text-muted)',
        fontSize: 11, fontWeight: active ? 600 : 400,
        transition: 'all .12s', whiteSpace: 'nowrap',
      }}
    >
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: dot, flexShrink: 0 }} />
      {label}
      <span style={{ opacity: .65, fontVariantNumeric: 'tabular-nums' }}>({count})</span>
    </button>
  )
}
