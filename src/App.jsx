import { useState, useCallback, useRef } from 'react'
import Editor        from './components/Editor'
import TokenTable    from './components/TokenTable'
import SymbolTable   from './components/SymbolTable'
import ErrorTable    from './components/ErrorTable'
import DerivationTree from './components/DerivationTree'
import './App.css'

import { analizar } from '../compiler/lexer.js'
import { parsear }  from '../compiler/parser.js'

// ── Código inicial de ejemplo ──────────────────────────────────────────────
const CODIGO_INICIAL = `#*
    Programa: Calculadora de milpa
    Lenguaje: Naxuxi
*#

pula calcularArea(largo, ancho) {
    nuka largo * ancho;
}

milpa {
    naxuxi largo = ixka("Ingresa el largo: ");
    naxuxi ancho  = ixka("Ingresa el ancho: ");
    naxuxi area   = calcularArea(largo, ancho);

    uray("El area es: " + area);

    kunu (area >= 500) {
        uray("Milpa apta para siembra.");
    } suma {
        uray("Milpa pequeña.");
    }
}
`

// ── Tabs ───────────────────────────────────────────────────────────────────
const TABS = [
  { id: 'tokens',   label: 'Tokens' },
  { id: 'simbolos', label: 'Símbolos' },
  { id: 'arbol',    label: 'Árbol' },
  { id: 'errores',  label: 'Errores' },
]

export default function App() {
  const [codigo,     setCodigo]     = useState(CODIGO_INICIAL)
  const [resultado,  setResultado]  = useState(null)
  const [tabActiva,  setTabActiva]  = useState('tokens')
  const [temaOscuro, setTemaOscuro] = useState(true)
  const fileInputRef = useRef(null)

  // ── Compilar ─────────────────────────────────────────────────────────────
  const compilar = useCallback(() => {
    const { tokens, simbolos, errores: erroresLex } = analizar(codigo)
    const { valido, arbol, errores: erroresSin }    = parsear(tokens)
    setResultado({ tokens, simbolos, erroresLex, valido, arbol, erroresSin })

    // Cambiar tab automáticamente
    if (erroresLex.length > 0 || erroresSin.length > 0) setTabActiva('errores')
    else if (valido) setTabActiva('arbol')
  }, [codigo])

  // ── Cargar archivo .nax ──────────────────────────────────────────────────
  const cargarArchivo = () => fileInputRef.current?.click()
  const onFileChange  = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      setCodigo(ev.target.result)
      setResultado(null)
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  // ── Indicador de estado ──────────────────────────────────────────────────
  const totalErrores = (resultado?.erroresLex?.length ?? 0) + (resultado?.erroresSin?.length ?? 0)
  const statusNode = resultado
    ? totalErrores === 0
      ? <span className="status-ok">✓ Compilación exitosa</span>
      : <span className="status-err">✗ {totalErrores} error{totalErrores > 1 ? 'es' : ''}</span>
    : null

  // ── Contadores en tabs ───────────────────────────────────────────────────
  function badgeTab(id) {
    if (!resultado) return null
    const counts = {
      tokens:   resultado.tokens.length,
      simbolos: resultado.simbolos.length,
      errores:  totalErrores,
    }
    const n = counts[id]
    if (n == null || n === 0) return null
    const color = id === 'errores' ? 'var(--error)' : 'var(--accent)'
    return (
      <span style={{
        marginLeft: 5, fontSize: 10, fontWeight: 700,
        background: id === 'errores' ? 'rgba(243,139,168,.15)' : 'rgba(203,166,247,.15)',
        color, padding: '1px 5px', borderRadius: 8
      }}>{n}</span>
    )
  }

  return (
    <div
      id="app-root"
      className={temaOscuro ? '' : 'light'}
      style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}
    >
      {/* ── Header ── */}
      <header style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 16px', height: 48, flexShrink: 0,
        background: 'var(--bg-surface)', borderBottom: '1px solid var(--border)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 20 }}>🌽</span>
          <span style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-head)' }}>
            Naxuxi Compiler
          </span>
          <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 4 }}>
            v1.0 · Universidad Mariano Gálvez
          </span>
        </div>
        <button
          onClick={() => setTemaOscuro(t => !t)}
          title="Cambiar tema"
          style={{
            background: 'var(--bg-hover)', border: '1px solid var(--border)',
            color: 'var(--text)', borderRadius: 6, padding: '4px 10px',
            cursor: 'pointer', fontSize: 13
          }}
        >
          {temaOscuro ? '☀️ Claro' : '🌙 Oscuro'}
        </button>
      </header>

      {/* ── Main ── */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* ── Panel izquierdo: Editor ── */}
        <div style={{
          width: '48%', display: 'flex', flexDirection: 'column',
          borderRight: '1px solid var(--border)', background: '#12121c'
        }}>
          {/* Barra superior del editor */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px',
            borderBottom: '1px solid var(--border)', background: 'var(--bg-surface)',
            flexShrink: 0
          }}>
            <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600,
                           textTransform: 'uppercase', letterSpacing: '.06em' }}>
              Editor  ·  .nax
            </span>
          </div>

          {/* CodeMirror */}
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <Editor codigo={codigo} onChange={setCodigo} />
          </div>

          {/* Barra inferior: botones + estado */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px',
            borderTop: '1px solid var(--border)', background: 'var(--bg-surface)',
            flexShrink: 0
          }}>
            <input
              ref={fileInputRef}
              type="file" accept=".nax"
              style={{ display: 'none' }}
              onChange={onFileChange}
            />
            <button className="btn-secondary" onClick={cargarArchivo}>
              📂 Cargar .nax
            </button>
            <button className="btn-primary" onClick={compilar}>
              ▶ Compilar
            </button>
            <div style={{ flex: 1 }} />
            {statusNode}
          </div>
        </div>

        {/* ── Panel derecho: Resultados ── */}
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          background: 'var(--bg-panel)', overflow: 'hidden'
        }}>
          {/* Tabs */}
          <div style={{
            display: 'flex', borderBottom: '1px solid var(--border)',
            background: 'var(--bg-surface)', flexShrink: 0
          }}>
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setTabActiva(tab.id)}
                style={{
                  padding: '10px 16px', border: 'none', cursor: 'pointer',
                  fontSize: 13, fontWeight: tabActiva === tab.id ? 700 : 400,
                  background: 'transparent',
                  color: tabActiva === tab.id ? 'var(--accent)' : 'var(--text-muted)',
                  borderBottom: tabActiva === tab.id
                    ? '2px solid var(--accent)'
                    : '2px solid transparent',
                  marginBottom: -1,
                  transition: 'all .15s'
                }}
              >
                {tab.label}{badgeTab(tab.id)}
              </button>
            ))}
          </div>

          {/* Contenido del tab */}
          <div style={{ flex: 1, overflow: 'hidden' }}>
            {tabActiva === 'tokens'   && <TokenTable    tokens={resultado?.tokens}      />}
            {tabActiva === 'simbolos' && <SymbolTable   simbolos={resultado?.simbolos}  />}
            {tabActiva === 'arbol'    && <DerivationTree resultado={resultado}           />}
            {tabActiva === 'errores'  && <ErrorTable    resultado={resultado}            />}
          </div>
        </div>
      </div>

      {/* ── Estilos inline de botones y status ── */}
      <style>{`
        #app-root { background: var(--bg); color: var(--text); }
        .btn-primary {
          background: var(--accent); color: #1e1e2e; border: none;
          padding: 6px 14px; border-radius: 6px; font-weight: 700;
          font-size: 13px; cursor: pointer; transition: opacity .15s;
        }
        .btn-primary:hover  { opacity: .85; }
        .btn-secondary {
          background: var(--bg-hover); color: var(--text);
          border: 1px solid var(--border);
          padding: 5px 12px; border-radius: 6px; font-size: 13px;
          cursor: pointer; transition: background .15s;
        }
        .btn-secondary:hover { background: var(--bg-surface); }
        .status-ok  { font-size: 12px; font-weight: 700; color: var(--success); }
        .status-err { font-size: 12px; font-weight: 700; color: var(--error);   }
      `}</style>
    </div>
  )
}
