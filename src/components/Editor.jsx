import { useEffect, useRef } from 'react'
import { EditorView, basicSetup }         from 'codemirror'
import { EditorState }                    from '@codemirror/state'
import { ViewPlugin, Decoration, MatchDecorator } from '@codemirror/view'
import { oneDark }                        from '@codemirror/theme-one-dark'

// ── Resaltado de palabras reservadas Naxuxi ───────────────────────────────
const PALABRAS_RESERVADAS = [
  'milpa','naxuxi','pula','nuka','ixka','uray',
  'kunu','suma','huxiuy','tahma','kiwi','woona',
  'hixi','kahl','tiwix','naru','pari','ixmi'
]

const kwDeco = Decoration.mark({ class: 'cm-naxuxi-kw' })
const kwMatcher = new MatchDecorator({
  regexp: new RegExp(`\\b(${PALABRAS_RESERVADAS.join('|')})\\b`, 'g'),
  decoration: () => kwDeco,
})
const naxuxiPlugin = ViewPlugin.fromClass(
  class {
    constructor(view) { this.deco = kwMatcher.createDeco(view) }
    update(u)         { this.deco = kwMatcher.updateDeco(u, this.deco) }
  },
  { decorations: v => v.deco }
)

const temaBase = EditorView.theme({
  '&':              { height: '100%', background: 'transparent' },
  '.cm-content':    { paddingBlock: '8px' },
  '.cm-scroller':   { overflow: 'auto' },
  '.cm-gutters':    { background: '#12121c', borderRight: '1px solid #2e3050' },
  '.cm-activeLineGutter': { background: '#1a1b2e' },
  '.cm-activeLine': { background: '#1a1b2e55' },
})

export default function Editor({ codigo, onChange }) {
  const containerRef = useRef(null)
  const viewRef      = useRef(null)
  const onChangeRef  = useRef(onChange)
  onChangeRef.current = onChange

  // Montar editor una sola vez
  useEffect(() => {
    if (!containerRef.current) return
    const view = new EditorView({
      state: EditorState.create({
        doc: codigo,
        extensions: [
          basicSetup,
          oneDark,
          temaBase,
          naxuxiPlugin,
          EditorView.updateListener.of(upd => {
            if (upd.docChanged) onChangeRef.current(upd.state.doc.toString())
          }),
        ],
      }),
      parent: containerRef.current,
    })
    viewRef.current = view
    return () => view.destroy()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Sincronizar cuando el código cambia externamente (carga de archivo)
  useEffect(() => {
    const view = viewRef.current
    if (!view) return
    const actual = view.state.doc.toString()
    if (actual !== codigo) {
      view.dispatch({ changes: { from: 0, to: actual.length, insert: codigo } })
    }
  }, [codigo])

  return <div ref={containerRef} className="editor-container h-full" />
}
