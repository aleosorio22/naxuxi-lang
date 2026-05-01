#!/usr/bin/env node

import { readFileSync, existsSync } from 'fs';
import { resolve, basename, extname } from 'path';
import { analizar } from './compiler/lexer.js';
import { parsear }  from './compiler/parser.js';

// ── Colores ANSI ──────────────────────────────────────────────────────────
const C = {
  reset:   '\x1b[0m',
  bold:    '\x1b[1m',
  cyan:    '\x1b[36m',
  green:   '\x1b[32m',
  yellow:  '\x1b[33m',
  red:     '\x1b[31m',
  gray:    '\x1b[90m',
  white:   '\x1b[97m'
};

function titulo(texto) {
  console.log(`\n${C.bold}${C.cyan}=== ${texto} ===${C.reset}`);
}

function linea() {
  console.log(`${C.gray}${'─'.repeat(60)}${C.reset}`);
}

// ── Validar argumento ─────────────────────────────────────────────────────
const args = process.argv.slice(2);
if (args.length === 0) {
  console.error(`${C.red}Uso: node cli.js <archivo.nax>${C.reset}`);
  process.exit(1);
}

const rutaArchivo = resolve(args[0]);
if (!existsSync(rutaArchivo)) {
  console.error(`${C.red}Error: no se encontró el archivo '${rutaArchivo}'${C.reset}`);
  process.exit(1);
}
if (extname(rutaArchivo) !== '.nax') {
  console.warn(`${C.yellow}Advertencia: se esperaba un archivo .nax${C.reset}`);
}

// ── Leer y analizar ───────────────────────────────────────────────────────
const codigoFuente = readFileSync(rutaArchivo, 'utf8');

console.log(`\n${C.bold}${C.white}╔══════════════════════════════════════════╗`);
console.log(`║       NAXUXI COMPILER  v1.0.0            ║`);
console.log(`╚══════════════════════════════════════════╝${C.reset}`);
console.log(`${C.gray}Archivo: ${basename(rutaArchivo)}${C.reset}`);

const { tokens, simbolos, errores: erroresLex } = analizar(codigoFuente);
const { valido, errores: erroresSin }            = parsear(tokens);

// ── TOKENS ────────────────────────────────────────────────────────────────
titulo('TOKENS');
linea();
if (tokens.length === 0) {
  console.log(`  ${C.gray}(ninguno)${C.reset}`);
} else {
  const anchoTipo = 16;
  tokens.forEach((t, i) => {
    const n   = String(i + 1).padStart(4);
    const cat = `[${t.tipo}]`.padEnd(anchoTipo);
    const lex = t.lexema.padEnd(22);
    console.log(`  ${C.gray}${n}${C.reset}  ${C.yellow}${cat}${C.reset}  ${C.white}${lex}${C.reset}  ${C.gray}L${t.linea}:C${t.columna}${C.reset}`);
  });
}

// ── TABLA DE SÍMBOLOS ─────────────────────────────────────────────────────
titulo('TABLA DE SÍMBOLOS');
linea();
if (simbolos.length === 0) {
  console.log(`  ${C.gray}(ninguno)${C.reset}`);
} else {
  console.log(`  ${'Identificador'.padEnd(18)} ${'Tipo'.padEnd(12)} ${'Valor'.padEnd(20)} Línea`);
  linea();
  simbolos.forEach(s => {
    console.log(
      `  ${C.white}${s.identificador.padEnd(18)}${C.reset}` +
      `${C.cyan}${s.tipo.padEnd(12)}${C.reset}` +
      `${C.yellow}${s.valor.padEnd(20)}${C.reset}` +
      `${C.gray}L${s.linea}:C${s.columna}${C.reset}`
    );
  });
}

// ── ERRORES LÉXICOS ───────────────────────────────────────────────────────
titulo('ERRORES LÉXICOS');
linea();
if (erroresLex.length === 0) {
  console.log(`  ${C.green}✓ Sin errores léxicos${C.reset}`);
} else {
  erroresLex.forEach((e, i) => {
    console.log(
      `  ${C.yellow}${String(i + 1).padStart(3)}  [${e.codigo}]${C.reset}` +
      `  ${e.tipo.padEnd(38)}` +
      `  ${C.white}'${e.lexema}'${C.reset}` +
      `  ${C.gray}L${e.linea}:C${e.columna}${C.reset}`
    );
    console.log(`       ${C.gray}↳ ${e.descripcion}${C.reset}`);
  });
}

// ── ANÁLISIS SINTÁCTICO ───────────────────────────────────────────────────
titulo('ANÁLISIS SINTÁCTICO');
linea();
if (valido) {
  console.log(`  ${C.green}✓ Programa válido — estructura sintáctica correcta${C.reset}`);
} else {
  console.log(`  ${C.red}✗ Se encontraron ${erroresSin.length} error(es) sintáctico(s)${C.reset}`);
}

// ── ERRORES SINTÁCTICOS ───────────────────────────────────────────────────
titulo('ERRORES SINTÁCTICOS');
linea();
if (erroresSin.length === 0) {
  console.log(`  ${C.green}✓ Sin errores sintácticos${C.reset}`);
} else {
  erroresSin.forEach((e, i) => {
    console.log(
      `  ${C.red}${String(i + 1).padStart(3)}  [${e.codigo}]${C.reset}` +
      `  ${e.tipo.padEnd(30)}` +
      `  ${C.gray}L${e.linea}:C${e.columna}${C.reset}`
    );
    console.log(`       ${C.gray}↳ ${e.descripcion}${C.reset}`);
  });
}

// ── Resultado final ───────────────────────────────────────────────────────
const totalErrores = erroresLex.length + erroresSin.length;
console.log('');
linea();
if (totalErrores === 0) {
  console.log(`${C.bold}${C.green}  ✓ Compilación exitosa (${tokens.length} tokens, ${simbolos.length} símbolo(s))${C.reset}`);
} else {
  console.log(`${C.bold}${C.red}  ✗ Compilación con errores (${erroresLex.length} léxico(s), ${erroresSin.length} sintáctico(s))${C.reset}`);
}
console.log('');
