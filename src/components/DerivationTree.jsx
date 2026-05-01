import { useMemo } from 'react'

// ── Dimensiones ────────────────────────────────────────────────────────────
const NODE_W  = 134
const NODE_H  = 26
const H_GAP   = 12   // espacio horizontal entre nodos hoja
const V_GAP   = 52   // espacio vertical entre niveles

// ── Algoritmo de layout ────────────────────────────────────────────────────
// Asigna coordenadas (x, y) a cada nodo.
// Los nodos hoja se posicionan de izquierda a derecha en orden DFS.
// Los nodos internos se centran sobre sus hijos.
function calcularLayout(raiz) {
  const nodos  = []   // { id, nodo, x, y }
  const aristas = []  // { fromId, toId }
  const cursor  = { col: 0 }  // columna del siguiente nodo hoja

  function visitar(nodo, profundidad, padreId) {
    if (!nodo) return
    const id  = nodos.length
    const y   = profundidad * (NODE_H + V_GAP)
    const entrada = { id, nodo, x: 0, y }
    nodos.push(entrada)

    if (padreId !== null) aristas.push({ fromId: padreId, toId: id })

    const hijos = (nodo.hijos || []).filter(Boolean)

    if (hijos.length === 0) {
      // Nodo hoja: ocupa su propia columna
      entrada.x = cursor.col * (NODE_W + H_GAP)
      cursor.col++
    } else {
      const colInicio = cursor.col
      hijos.forEach(h => visitar(h, profundidad + 1, id))
      const colFin = cursor.col - 1
      // Centrar sobre el rango de columnas de sus hijos
      entrada.x = ((colInicio + colFin) / 2) * (NODE_W + H_GAP)
    }
  }

  visitar(raiz, 0, null)

  const svgW = cursor.col * (NODE_W + H_GAP) - H_GAP + 20
  const maxDepth = nodos.length > 0 ? Math.max(...nodos.map(n => n.y)) : 0
  const svgH = maxDepth + NODE_H + 20

  return { nodos, aristas, svgW, svgH }
}

// ── Truncar texto largo ────────────────────────────────────────────────────
function truncar(texto, max = 17) {
  return texto.length > max ? texto.slice(0, max - 1) + '…' : texto
}

// ── Componente principal ───────────────────────────────────────────────────
export default function DerivationTree({ resultado }) {
  if (!resultado) {
    return <MsgCentrado>Presiona Compilar para ver el árbol de derivación.</MsgCentrado>
  }
  if (!resultado.valido) {
    return (
      <MsgCentrado error>
        El árbol de derivación solo se genera para programas válidos.
        <br />
        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
          Corrige los errores sintácticos e intenta de nuevo.
        </span>
      </MsgCentrado>
    )
  }

  return <ArbolSVG arbol={resultado.arbol} />
}

function ArbolSVG({ arbol }) {
  const layout = useMemo(() => calcularLayout(arbol), [arbol])
  const { nodos, aristas, svgW, svgH } = layout

  if (nodos.length === 0) return null

  const OFFSET = 10  // margen interior del SVG

  return (
    <div className="overflow-auto h-full" style={{ padding: 8 }}>
      <p style={{ color: 'var(--text-muted)', fontSize: 11, marginBottom: 8, fontStyle: 'italic' }}>
        Nodos <span style={{ color: '#93c5fd' }}>azules</span> = no terminales &nbsp;·&nbsp;
        Nodos <span style={{ color: '#fbbf24' }}>amarillos</span> = terminales (hojas)
      </p>
      <svg
        width={svgW + OFFSET * 2}
        height={svgH + OFFSET * 2}
        style={{ display: 'block', minWidth: svgW + OFFSET * 2 }}
      >
        {/* Aristas */}
        {aristas.map((a, i) => {
          const src = nodos[a.fromId]
          const dst = nodos[a.toId]
          const x1 = src.x + NODE_W / 2 + OFFSET
          const y1 = src.y + NODE_H + OFFSET
          const x2 = dst.x + NODE_W / 2 + OFFSET
          const y2 = dst.y + OFFSET

          // Línea con quiebre a mitad de la distancia vertical
          const my = (y1 + y2) / 2
          return (
            <path
              key={i}
              d={`M${x1},${y1} C${x1},${my} ${x2},${my} ${x2},${y2}`}
              fill="none"
              stroke="#374151"
              strokeWidth={1.2}
            />
          )
        })}

        {/* Nodos */}
        {nodos.map((n, i) => {
          const esTerminal = n.nodo.tipo === 'terminal'
          const nx = n.x + OFFSET
          const ny = n.y + OFFSET

          const fill   = esTerminal ? '#1c1407' : '#0f172a'
          const stroke = esTerminal ? '#92400e'  : '#1d4ed8'
          const color  = esTerminal ? '#fbbf24'  : '#93c5fd'
          const label  = truncar(n.nodo.nombre)

          return (
            <g key={i}>
              <rect
                x={nx} y={ny}
                width={NODE_W} height={NODE_H}
                rx={5}
                fill={fill}
                stroke={stroke}
                strokeWidth={1}
              />
              <text
                x={nx + NODE_W / 2}
                y={ny + NODE_H / 2 + 4}
                textAnchor="middle"
                fill={color}
                fontSize={10.5}
                fontFamily="'JetBrains Mono', Consolas, monospace"
              >
                {label}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}

function MsgCentrado({ children, error }) {
  return (
    <div
      className="flex flex-col items-center justify-center h-full gap-2 text-center"
      style={{ color: error ? 'var(--error)' : 'var(--text-muted)', fontSize: 13, padding: 24 }}
    >
      {error && <span style={{ fontSize: 28 }}>🌵</span>}
      {children}
    </div>
  )
}
