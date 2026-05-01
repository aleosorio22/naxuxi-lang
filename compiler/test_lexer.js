'use strict';
const { analizar } = require('./lexer');

const CASOS = [
  {
    nombre: 'Prueba 1 — Declaración',
    codigo: `milpa {
    naxuxi edad = 25;
}`
  },
  {
    nombre: 'Prueba 2 — Condicional kunu/suma',
    codigo: `milpa {
    kunu (edad >= 18) {
        uray("Mayor");
    } suma {
        uray("Menor");
    }
}`
  },
  {
    nombre: 'Prueba 3 — Ciclo while huxiuy',
    codigo: `milpa {
    huxiuy (i < 5) {
        uray(i);
    }
}`
  },
  {
    nombre: 'Prueba 4 — Función pula/nuka',
    codigo: `milpa {
    pula sumar(a, b) {
        nuka a + b;
    }
}`
  },
  {
    nombre: 'Prueba 5 — Ciclo for tahma',
    codigo: `milpa {
    tahma (naxuxi i = 0; i < 3; i += 1) {
        uray(i);
    }
}`
  },
  {
    nombre: 'Prueba 6 — Errores léxicos',
    codigo: `milpa {
    naxuxi @precio = 25;
    naxuxi nombre = "Maria;
    naxuxi 1edad = 10;
    naxuxi valor = 3.;
    naxuxi milpa = 5;
}`
  },
  {
    nombre: 'Prueba 7 — Comentarios',
    codigo: `#*
  Programa con comentarios
*#
milpa {
    ## Declaro edad
    naxuxi edad = 30;
}`
  },
  {
    nombre: 'Prueba 8 — Comentario bloque no cerrado',
    codigo: `milpa {
    #* sin cerrar
    naxuxi x = 1;
}`
  }
];

for (const caso of CASOS) {
  console.log(`\n${'═'.repeat(60)}`);
  console.log(`  ${caso.nombre}`);
  console.log('═'.repeat(60));

  const { tokens, simbolos, errores } = analizar(caso.codigo);

  console.log(`\nTOKENS (${tokens.length}):`);
  tokens.forEach((t, i) =>
    console.log(`  ${String(i + 1).padStart(3)}  [${t.tipo.padEnd(14)}]  ${t.lexema.padEnd(20)}  L${t.linea}:C${t.columna}`)
  );

  if (simbolos.length > 0) {
    console.log(`\nSÍMBOLOS (${simbolos.length}):`);
    simbolos.forEach(s =>
      console.log(`  ${s.identificador.padEnd(15)} | ${s.tipo.padEnd(10)} | ${s.valor.padEnd(15)} | L${s.linea}:C${s.columna}`)
    );
  }

  if (errores.length > 0) {
    console.log(`\nERRORES (${errores.length}):`);
    errores.forEach(e =>
      console.log(`  [${e.codigo}]  ${e.tipo.padEnd(35)}  '${e.lexema}'  L${e.linea}:C${e.columna}`)
    );
  } else {
    console.log('\n  ✓ Sin errores léxicos');
  }
}
