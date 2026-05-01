import { useEffect, useRef } from 'react'
import { EditorView, basicSetup }        from 'codemirror'
import { EditorState, RangeSetBuilder }  from '@codemirror/state'
import { ViewPlugin, Decoration }        from '@codemirror/view'
import { oneDark }                       from '@codemirror/theme-one-dark'

// ── Palabras reservadas ───────────────────────────────────────────────────────
const KEYWORDS = new Set([
  'milpa','naxuxi','pula','nuka','ixka','uray',
  'kunu','suma','huxiuy','tahma','kiwi','woona',
  'hixi','kahl','tiwix','naru','pari','ixmi',
])

// ── Tokenizador (mismo orden de prioridad que el lexer) ───────────────────────
function tokenizarTexto(text) {
  const tokens = []
  let pos = 0
  const len = text.length

  while (pos < len) {
    const ch = text[pos]

    if (ch === '#' && pos + 1 < len && text[pos + 1] === '*') {
      const end = text.indexOf('*#', pos + 2)
      const to = end === -1 ? len : end + 2
      tokens.push({ from: pos, to, cls: 'cm-nax-comment' })
      pos = to; continue
    }
    if (ch === '#' && pos + 1 < len && text[pos + 1] === '#') {
      let to = text.indexOf('\n', pos)
      if (to === -1) to = len
      tokens.push({ from: pos, to, cls: 'cm-nax-comment' })
      pos = to; continue
    }
    if (ch === '"') {
      let to = pos + 1
      while (to < len && text[to] !== '"' && text[to] !== '\n') to++
      if (to < len && text[to] === '"') to++
      tokens.push({ from: pos, to, cls: 'cm-nax-string' })
      pos = to; continue
    }
    if (ch >= '0' && ch <= '9') {
      let to = pos + 1
      while (to < len && text[to] >= '0' && text[to] <= '9') to++
      if (to < len && text[to] === '.' &&
          to + 1 < len && text[to + 1] >= '0' && text[to + 1] <= '9') {
        to++
        while (to < len && text[to] >= '0' && text[to] <= '9') to++
      }
      tokens.push({ from: pos, to, cls: 'cm-nax-number' })
      pos = to; continue
    }
    if ((ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z') || ch === '_') {
      let to = pos + 1
      while (to < len && (
        (text[to] >= 'a' && text[to] <= 'z') ||
        (text[to] >= 'A' && text[to] <= 'Z') ||
        (text[to] >= '0' && text[to] <= '9') ||
        text[to] === '_'
      )) to++
      if (KEYWORDS.has(text.slice(pos, to)))
        tokens.push({ from: pos, to, cls: 'cm-nax-keyword' })
      pos = to; continue
    }
    if (pos + 1 < len) {
      const two = ch + text[pos + 1]
      if (two === '==' || two === '!=' || two === '>=' || two === '<=' ||
          two === '+=' || two === '-=') {
        tokens.push({ from: pos, to: pos + 2, cls: 'cm-nax-operator' })
        pos += 2; continue
      }
    }
    if (ch==='+' || ch==='-' || ch==='*' || ch==='/' || ch==='%' ||
        ch==='<' || ch==='>' || ch==='=') {
      tokens.push({ from: pos, to: pos + 1, cls: 'cm-nax-operator' })
      pos++; continue
    }
    if (ch==='{' || ch==='}' || ch==='(' || ch===')' || ch===';' || ch===',') {
      tokens.push({ from: pos, to: pos + 1, cls: 'cm-nax-delimiter' })
      pos++; continue
    }
    pos++
  }
  return tokens
}

// ── ViewPlugin de resaltado ───────────────────────────────────────────────────
const naxPlugin = ViewPlugin.fromClass(
  class {
    constructor(view) { this.decorations = this._build(view) }
    update(u) {
      if (u.docChanged || u.viewportChanged) this.decorations = this._build(u.view)
    }
    _build(view) {
      const builder = new RangeSetBuilder()
      for (const { from, to, cls } of tokenizarTexto(view.state.doc.toString()))
        builder.add(from, to, Decoration.mark({ class: cls }))
      return builder.finish()
    }
  },
  { decorations: v => v.decorations }
)

// ── Temas base ────────────────────────────────────────────────────────────────
const temaOscuroBase = EditorView.theme({
  '&':                    { height: '100%', background: '#1e1e1e' },
  '.cm-content':          { paddingBlock: '8px' },
  '.cm-scroller':         { overflow: 'auto' },
  '.cm-gutters':          { background: '#1e1e1e', borderRight: '1px solid #3c3c3c', color: '#4d4d4d' },
  '.cm-activeLineGutter': { background: '#252526', color: '#858585' },
  '.cm-activeLine':       { background: '#ffffff08' },
  '.cm-cursor':           { borderLeftColor: '#aeafad' },
  '.cm-selectionBackground, ::selection': { background: '#264f78 !important' },
  '.cm-line':             { paddingLeft: '4px' },
})

const temaClaroBase = EditorView.theme({
  '&':                    { height: '100%', background: '#ffffff' },
  '.cm-content':          { paddingBlock: '8px', color: '#1f1f1f' },
  '.cm-scroller':         { overflow: 'auto' },
  '.cm-gutters':          { background: '#f3f3f3', borderRight: '1px solid #e5e5e5', color: '#aaa' },
  '.cm-activeLineGutter': { background: '#e8e8e8', color: '#666' },
  '.cm-activeLine':       { background: '#f5f5f5' },
  '.cm-cursor':           { borderLeftColor: '#333' },
  '.cm-selectionBackground, ::selection': { background: '#add6ff !important' },
  '.cm-line':             { paddingLeft: '4px' },
})

// ── Componente ────────────────────────────────────────────────────────────────
export default function Editor({ codigo, onChange, temaOscuro = true }) {
  const containerRef = useRef(null)
  const viewRef      = useRef(null)
  const onChangeRef  = useRef(onChange)
  onChangeRef.current = onChange

  // Recrea el editor cuando cambia el tema
  useEffect(() => {
    if (!containerRef.current) return

    // Destruir instancia anterior si existe
    viewRef.current?.destroy()

    const extensions = [
      basicSetup,
      temaOscuro ? oneDark : [],
      temaOscuro ? temaOscuroBase : temaClaroBase,
      naxPlugin,
      EditorView.updateListener.of(upd => {
        if (upd.docChanged) onChangeRef.current(upd.state.doc.toString())
      }),
    ]

    const view = new EditorView({
      state: EditorState.create({ doc: codigo, extensions }),
      parent: containerRef.current,
    })
    viewRef.current = view

    return () => view.destroy()
  }, [temaOscuro]) // eslint-disable-line react-hooks/exhaustive-deps

  // Sincronizar código externo (carga de archivo)
  useEffect(() => {
    const view = viewRef.current
    if (!view) return
    const actual = view.state.doc.toString()
    if (actual !== codigo)
      view.dispatch({ changes: { from: 0, to: actual.length, insert: codigo } })
  }, [codigo])

  return <div ref={containerRef} className="editor-container h-full" />
}
