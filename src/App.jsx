import { useState, useCallback, useRef } from 'react'
import Editor        from './components/Editor'
import TokenTable    from './components/TokenTable'
import SymbolTable   from './components/SymbolTable'
import ErrorTable    from './components/ErrorTable'
import DerivationTree from './components/DerivationTree'
import './App.css'

import { analizar } from '../compiler/lexer.js'
import { parsear }  from '../compiler/parser.js'

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

const TABS = [
  { id: 'tokens',   label: 'Tokens'   },
  { id: 'simbolos', label: 'Símbolos' },
  { id: 'arbol',    label: 'Árbol'    },
  { id: 'errores',  label: 'Errores'  },
]

export default function App() {
  const [codigo,     setCodigo]     = useState(CODIGO_INICIAL)
  const [resultado,  setResultado]  = useState(null)
  const [tabActiva,  setTabActiva]  = useState('tokens')
  const [temaOscuro, setTemaOscuro] = useState(true)
  const fileInputRef = useRef(null)

  const compilar = useCallback(() => {
    const { tokens, simbolos, errores: erroresLex } = analizar(codigo)
    const { valido, arbol, errores: erroresSin }    = parsear(tokens)
    setResultado({ tokens, simbolos, erroresLex, valido, arbol, erroresSin })
    if (erroresLex.length > 0 || erroresSin.length > 0) setTabActiva('errores')
    else if (valido) setTabActiva('arbol')
  }, [codigo])

  const cargarArchivo = () => fileInputRef.current?.click()
  const onFileChange  = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => { setCodigo(ev.target.result); setResultado(null) }
    reader.readAsText(file)
    e.target.value = ''
  }

  const totalErrores = (resultado?.erroresLex?.length ?? 0) + (resultado?.erroresSin?.length ?? 0)

  function badgeTab(id) {
    if (!resultado) return null
    const counts = { tokens: resultado.tokens.length, simbolos: resultado.simbolos.length, errores: totalErrores }
    const n = counts[id]
    if (n == null || n === 0) return null
    return (
      <span style={{
        fontSize: 10, fontWeight: 700, padding: '1px 5px', borderRadius: 8, marginLeft: 5,
        background: id === 'errores' ? 'rgba(244,135,113,.2)' : 'rgba(86,156,214,.2)',
        color:      id === 'errores' ? '#f48771'              : '#569cd6',
      }}>{n}</span>
    )
  }

  return (
    <div
      id="app-root"
      className={temaOscuro ? '' : 'light'}
      style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden',
               background: 'var(--bg)', color: 'var(--text)' }}
    >

      {/* ── Title bar (VS Code style) ── */}
      <div style={{
        height: 30, flexShrink: 0,
        background: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 12px', userSelect: 'none',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 16 }}>🌽</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-head)', letterSpacing: '.01em' }}>
            Naxuxi Compiler
          </span>
        </div>
        <button
          onClick={() => setTemaOscuro(t => !t)}
          title={temaOscuro ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: 'var(--text-muted)', fontSize: 14,
            padding: '3px 6px', borderRadius: 4,
            display: 'flex', alignItems: 'center',
            transition: 'color .15s',
          }}
        >
          {temaOscuro ? '☀' : '🌙'}
        </button>
      </div>

      {/* ── Editor + Results ── */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* ── Panel izquierdo: Editor ── */}
        <div style={{
          width: '48%', display: 'flex', flexDirection: 'column',
          borderRight: '1px solid var(--border)',
        }}>

          {/* Tab de archivo activo — estilo VS Code */}
          <div style={{
            display: 'flex', alignItems: 'stretch',
            background: 'var(--bg-surface)',
            borderBottom: '1px solid var(--border)',
            flexShrink: 0, height: 35,
          }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 7,
              padding: '0 16px',
              background: 'var(--bg)',
              borderRight: '1px solid var(--border)',
              borderTop: '1px solid var(--accent)',
              fontSize: 12.5, color: 'var(--text)',
              userSelect: 'none',
            }}>
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none"
                   style={{ opacity: .6 }}>
                <rect x="2" y="1" width="9" height="13" rx="1"
                      stroke="currentColor" strokeWidth="1.5" fill="none"/>
                <path d="M5 5h5M5 8h5M5 11h3" stroke="currentColor"
                      strokeWidth="1.2" strokeLinecap="round"/>
              </svg>
              <span>archivo.nax</span>
            </div>
          </div>

          {/* CodeMirror */}
          <div style={{ flex: 1, overflow: 'hidden', background: '#1e1e1e' }}>
            <Editor codigo={codigo} onChange={setCodigo} />
          </div>

          {/* Barra de acciones */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px',
            borderTop: '1px solid var(--border)', background: 'var(--bg-surface)',
            flexShrink: 0,
          }}>
            <input ref={fileInputRef} type="file" accept=".nax"
                   style={{ display: 'none' }} onChange={onFileChange} />
            <button className="btn-secondary" onClick={cargarArchivo}>
              📂 Cargar .nax
            </button>
            <button className="btn-primary" onClick={compilar}>
              ▶ Compilar
            </button>
          </div>
        </div>

        {/* ── Panel derecho: Resultados ── */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column',
                      background: 'var(--bg-panel)', overflow: 'hidden' }}>

          {/* Tab bar — estilo VS Code */}
          <div style={{
            display: 'flex', alignItems: 'stretch',
            background: 'var(--bg-surface)',
            borderBottom: '1px solid var(--border)',
            flexShrink: 0, height: 35, overflow: 'hidden',
          }}>
            {TABS.map(tab => {
              const active = tabActiva === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setTabActiva(tab.id)}
                  style={{
                    height: '100%', padding: '0 18px', border: 'none', cursor: 'pointer',
                    fontSize: 12.5, fontWeight: active ? 500 : 400,
                    background: active ? 'var(--bg)' : 'transparent',
                    color: active ? 'var(--text)' : 'var(--text-muted)',
                    borderRight: '1px solid var(--border)',
                    borderTop: active ? '1px solid var(--accent)' : '1px solid transparent',
                    display: 'flex', alignItems: 'center',
                    transition: 'background .1s, color .1s',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {tab.label}{badgeTab(tab.id)}
                </button>
              )
            })}
          </div>

          {/* Contenido del tab */}
          <div style={{ flex: 1, overflow: 'hidden' }}>
            {tabActiva === 'tokens'   && <TokenTable    tokens={resultado?.tokens}     />}
            {tabActiva === 'simbolos' && <SymbolTable   simbolos={resultado?.simbolos} />}
            {tabActiva === 'arbol'    && <DerivationTree resultado={resultado}          />}
            {tabActiva === 'errores'  && <ErrorTable    resultado={resultado}           />}
          </div>
        </div>
      </div>

      {/* ── Status bar (VS Code style) ── */}
      <div style={{
        height: 22, flexShrink: 0,
        background: '#007acc',
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 12px', userSelect: 'none',
        fontSize: 11, color: '#fff',
      }}>
        <span>
          {resultado
            ? totalErrores === 0
              ? `✓ Compilación exitosa · ${resultado.tokens.length} tokens · ${resultado.simbolos.length} símbolo${resultado.simbolos.length !== 1 ? 's' : ''}`
              : `✗ ${totalErrores} error${totalErrores > 1 ? 'es' : ''}`
            : 'Naxuxi Compiler · listo'}
        </span>
        <span style={{ opacity: .8 }}>Naxuxi · UTF-8</span>
      </div>

      {/* ── Estilos inline ── */}
      <style>{`
        #app-root { background: var(--bg); color: var(--text); }

        .btn-primary {
          background: var(--accent); color: #1e1e2e;
          border: none; padding: 5px 14px; border-radius: 3px;
          font-weight: 600; font-size: 12.5px; cursor: pointer;
          transition: filter .15s;
        }
        .btn-primary:hover { filter: brightness(1.1); }

        .btn-secondary {
          background: transparent; color: var(--text-muted);
          border: 1px solid var(--border);
          padding: 4px 12px; border-radius: 3px; font-size: 12.5px;
          cursor: pointer; transition: background .15s, color .15s;
        }
        .btn-secondary:hover { background: var(--bg-hover); color: var(--text); }
      `}</style>
    </div>
  )
}
