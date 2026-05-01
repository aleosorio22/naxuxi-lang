export default function ErrorTable({ resultado }) {
  const erroresLex = resultado?.erroresLex ?? []
  const erroresSin = resultado?.erroresSin ?? []
  const total = erroresLex.length + erroresSin.length

  if (!resultado) {
    return (
      <div className="flex items-center justify-center h-full"
           style={{ color: 'var(--text-muted)', fontSize: 13 }}>
        Presiona Compilar para ver los errores.
      </div>
    )
  }

  if (total === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-2">
        <span style={{ fontSize: 32 }}>✅</span>
        <span style={{ color: 'var(--success)', fontWeight: 600 }}>
          Sin errores léxicos ni sintácticos
        </span>
      </div>
    )
  }

  return (
    <div className="overflow-auto h-full flex flex-col gap-4 p-1">

      {/* Errores léxicos */}
      {erroresLex.length > 0 && (
        <section>
          <h3 style={{ color: 'var(--warning)', fontSize: 12, fontWeight: 700,
                       textTransform: 'uppercase', letterSpacing: '.06em',
                       marginBottom: 8, padding: '0 4px' }}>
            Errores léxicos ({erroresLex.length})
          </h3>
          <table className="nax-table">
            <thead>
              <tr>
                <th>#</th><th>Código</th><th>Tipo</th>
                <th>Lexema</th><th>Línea</th><th>Columna</th><th>Descripción</th>
              </tr>
            </thead>
            <tbody>
              {erroresLex.map((e, i) => (
                <tr key={i} style={{ background: 'rgba(251,146,60,.04)' }}>
                  <td style={{ color: 'var(--text-muted)' }}>{i + 1}</td>
                  <td style={{ color: 'var(--warning)', fontWeight: 700 }}>{e.codigo}</td>
                  <td>{e.tipo}</td>
                  <td style={{ color: '#fb923c' }}>{e.lexema}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{e.linea}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{e.columna}</td>
                  <td style={{ color: 'var(--text-muted)', fontSize: 11 }}>{e.descripcion}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}

      {/* Errores sintácticos */}
      {erroresSin.length > 0 && (
        <section>
          <h3 style={{ color: 'var(--error)', fontSize: 12, fontWeight: 700,
                       textTransform: 'uppercase', letterSpacing: '.06em',
                       marginBottom: 8, padding: '0 4px' }}>
            Errores sintácticos ({erroresSin.length})
          </h3>
          <table className="nax-table">
            <thead>
              <tr>
                <th>#</th><th>Código</th><th>Tipo</th>
                <th>Línea</th><th>Columna</th><th>Descripción</th>
              </tr>
            </thead>
            <tbody>
              {erroresSin.map((e, i) => (
                <tr key={i} style={{ background: 'rgba(243,139,168,.04)' }}>
                  <td style={{ color: 'var(--text-muted)' }}>{i + 1}</td>
                  <td style={{ color: 'var(--error)', fontWeight: 700 }}>{e.codigo}</td>
                  <td>{e.tipo}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{e.linea}</td>
                  <td style={{ color: 'var(--text-muted)' }}>{e.columna}</td>
                  <td style={{ color: 'var(--text-muted)', fontSize: 11 }}>{e.descripcion}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </div>
  )
}
