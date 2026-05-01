export default function TokenTable({ tokens }) {
  if (!tokens || tokens.length === 0) {
    return <Vacio msg="Sin tokens. Presiona Compilar." />
  }

  return (
    <div className="overflow-auto h-full">
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
          {tokens.map((tok, i) => (
            <tr key={i}>
              <td style={{ color: 'var(--text-muted)' }}>{i + 1}</td>
              <td>{tok.lexema}</td>
              <td>
                <span className={`badge badge-${tok.tipo}`}>{tok.tipo}</span>
              </td>
              <td style={{ color: 'var(--text-muted)' }}>{tok.linea}</td>
              <td style={{ color: 'var(--text-muted)' }}>{tok.columna}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Vacio({ msg }) {
  return (
    <div className="flex items-center justify-center h-full"
         style={{ color: 'var(--text-muted)', fontSize: 13 }}>
      {msg}
    </div>
  )
}
