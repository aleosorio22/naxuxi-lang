const TIPO_COLORS = {
  entero:      { bg: '#1e3322', text: '#b5cea8' },
  decimal:     { bg: '#1e3322', text: '#b5cea8' },
  cadena:      { bg: '#3b2318', text: '#ce9178' },
  booleano:    { bg: '#2d2466', text: '#9cdcfe' },
  entrada:     { bg: '#1a2d3b', text: '#4ec9b0' },
  referencia:  { bg: '#2d2d2d', text: '#858585' },
  desconocido: { bg: '#2d2d2d', text: '#858585' },
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
