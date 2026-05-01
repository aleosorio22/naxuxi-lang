const TIPO_COLORS = {
  entero:      { bg: '#7c2d12', text: '#fed7aa' },
  decimal:     { bg: '#713f12', text: '#fef08a' },
  cadena:      { bg: '#064e3b', text: '#6ee7b7' },
  booleano:    { bg: '#4c1d95', text: '#ddd6fe' },
  desconocido: { bg: '#27272a', text: '#a1a1aa' },
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

  return (
    <div className="overflow-auto h-full">
      <table className="nax-table">
        <thead>
          <tr>
            <th>Identificador</th>
            <th>Tipo</th>
            <th>Valor</th>
            <th>Línea</th>
            <th>Columna</th>
          </tr>
        </thead>
        <tbody>
          {simbolos.map((s, i) => {
            const colores = TIPO_COLORS[s.tipo] ?? TIPO_COLORS.desconocido
            return (
              <tr key={i}>
                <td style={{ color: '#a5b4fc', fontWeight: 600 }}>{s.identificador}</td>
                <td>
                  <span className="badge"
                    style={{ background: colores.bg, color: colores.text }}>
                    {s.tipo}
                  </span>
                </td>
                <td>{s.valor}</td>
                <td style={{ color: 'var(--text-muted)' }}>{s.linea}</td>
                <td style={{ color: 'var(--text-muted)' }}>{s.columna}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
