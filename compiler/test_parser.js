'use strict';
const { analizar } = require('./lexer');
const { parsear }  = require('./parser');

function imprimirArbol(nodo, prefijo = '', esUltimo = true) {
  if (!nodo) return;
  const conector = esUltimo ? '└─ ' : '├─ ';
  const label = nodo.tipo === 'terminal'
    ? `\x1b[33m${nodo.nombre}\x1b[0m`
    : `\x1b[36m${nodo.nombre}\x1b[0m`;
  console.log(prefijo + conector + label);
  const nuevoPrefijo = prefijo + (esUltimo ? '   ' : '│  ');
  const hijos = nodo.hijos || [];
  hijos.forEach((hijo, i) =>
    imprimirArbol(hijo, nuevoPrefijo, i === hijos.length - 1)
  );
}

const CASOS = [
  {
    nombre: 'Válido 1 — Declaración',
    codigo: `milpa {\n    naxuxi edad = 25;\n}`
  },
  {
    nombre: 'Válido 2 — Condicional kunu/suma',
    codigo: `milpa {\n    kunu (edad >= 18) {\n        uray("Mayor");\n    } suma {\n        uray("Menor");\n    }\n}`
  },
  {
    nombre: 'Válido 3 — Ciclo while huxiuy',
    codigo: `milpa {\n    huxiuy (i < 5) {\n        uray(i);\n    }\n}`
  },
  {
    nombre: 'Válido 4 — Función pula/nuka',
    codigo: `milpa {\n    pula sumar(a, b) {\n        nuka a + b;\n    }\n}`
  },
  {
    nombre: 'Válido 5 — Ciclo for tahma',
    codigo: `milpa {\n    tahma (naxuxi i = 0; i < 3; i += 1) {\n        uray(i);\n    }\n}`
  },
  {
    nombre: 'Error S01 — Falta punto y coma',
    codigo: `milpa {\n    naxuxi edad = 25\n    uray(edad);\n}`
  },
  {
    nombre: 'Error S02 — Paréntesis sin cerrar',
    codigo: `milpa {\n    kunu (edad >= 18 {\n        uray("Mayor");\n    }\n}`
  },
  {
    nombre: 'Error S03 — Llave sin cerrar',
    codigo: `milpa {\n    naxuxi x = 10;\n    uray(x);`
  },
  {
    nombre: 'Error S04 — Estructura incompleta (kunu sin condición)',
    codigo: `milpa {\n    kunu {\n        uray("sin condicion");\n    }\n}`
  },
  {
    nombre: 'Error S05 — Bloque milpa ausente',
    codigo: `naxuxi edad = 25;\nuray(edad);`
  }
];

for (const caso of CASOS) {
  console.log(`\n${'═'.repeat(60)}`);
  console.log(`  ${caso.nombre}`);
  console.log('═'.repeat(60));

  const { tokens } = analizar(caso.codigo);
  const resultado  = parsear(tokens);

  const estado = resultado.valido
    ? '\x1b[32m✓ Programa válido\x1b[0m'
    : `\x1b[31m✗ ${resultado.errores.length} error(es) sintáctico(s)\x1b[0m`;
  console.log(`\nEstado: ${estado}`);

  if (resultado.errores.length > 0) {
    console.log('\nERRORES SINTÁCTICOS:');
    resultado.errores.forEach(e =>
      console.log(`  [${e.codigo}] ${e.tipo.padEnd(30)}  L${e.linea}:C${e.columna}  → ${e.descripcion}`)
    );
  }

  if (resultado.valido) {
    console.log('\nÁRBOL DE DERIVACIÓN:');
    imprimirArbol(resultado.arbol, '', true);
  }
}
