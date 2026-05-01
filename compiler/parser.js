'use strict';

const ERRORES_SINTACTICOS = {
  'ERR-S01': 'Falta de punto y coma',
  'ERR-S02': 'Paréntesis sin cerrar',
  'ERR-S03': 'Llave sin cerrar',
  'ERR-S04': 'Estructura incompleta',
  'ERR-S05': 'Bloque milpa ausente'
};

const OPS_COMPARACION = new Set(['==', '!=', '>', '<', '>=', '<=']);

function parsear(tokens) {
  let pos = 0;
  const errores = [];

  // ── Utilidades de acceso ──────────────────────────────────────────────────

  function actual()    { return tokens[pos]     || null; }
  function siguiente() { return tokens[pos + 1] || null; }
  function fin()       { return pos >= tokens.length; }

  function esLexema(lex) {
    const t = actual();
    return t !== null && t.lexema === lex;
  }

  // ── Constructores de nodos del árbol de derivación ───────────────────────

  function nt(nombre, hijos) {
    return { tipo: 'no-terminal', nombre, hijos: hijos.filter(Boolean) };
  }

  function term(lexema) {
    return { tipo: 'terminal', nombre: `"${lexema}"`, hijos: [] };
  }

  // ── Gestión de errores ────────────────────────────────────────────────────

  function registrarError(codigo, linea, columna, descripcion) {
    errores.push({ codigo, tipo: ERRORES_SINTACTICOS[codigo], linea, columna, descripcion });
  }

  /**
   * Consume el token actual si su lexema coincide con el esperado.
   * Si no coincide, registra un error y devuelve null SIN avanzar.
   */
  function consumir(lexEsperado, codigoError, descripcion) {
    const tok = actual();
    if (tok && tok.lexema === lexEsperado) {
      pos++;
      return term(tok.lexema);
    }
    const encontrado = tok ? `'${tok.lexema}'` : 'fin de archivo';
    const lin = tok ? tok.linea   : (tokens.length ? tokens[tokens.length - 1].linea   : 1);
    const col = tok ? tok.columna : (tokens.length ? tokens[tokens.length - 1].columna : 1);
    registrarError(codigoError, lin, col,
      descripcion || `Se esperaba '${lexEsperado}', se encontró ${encontrado}`);
    return null;
  }

  /**
   * Avanza pos hasta encontrar uno de los tokens de sincronización.
   * Usado para recuperación de errores (modo pánico).
   */
  function sincronizar(...sync) {
    while (!fin() && !sync.includes(actual().lexema)) {
      pos++;
    }
  }

  // ────────────────────────────────────────────────────────────────────────
  //  Programa y bloque
  // ────────────────────────────────────────────────────────────────────────

  function parsePrograma() {
    const hijos = [];

    // Funciones globales opcionales antes del bloque milpa
    // Ej.: pula calcularArea(...) { ... }   milpa { ... }
    while (!fin() && esLexema('pula')) {
      hijos.push(parseDefinicionFuncion());
    }

    if (!esLexema('milpa')) {
      const tok = actual();
      registrarError('ERR-S05',
        tok ? tok.linea   : 1,
        tok ? tok.columna : 1,
        `El programa debe contener el bloque 'milpa', se encontró ${tok ? `'${tok.lexema}'` : 'fin de archivo'}`
      );
      return nt('<programa>', hijos);
    }
    hijos.push(term('milpa')); pos++;
    hijos.push(parseBloque());
    return nt('<programa>', hijos);
  }

  function parseBloque() {
    const tok = actual();
    if (!esLexema('{')) {
      registrarError('ERR-S03',
        tok ? tok.linea   : -1,
        tok ? tok.columna : -1,
        `Se esperaba '{' para abrir el bloque, se encontró ${tok ? `'${tok.lexema}'` : 'fin de archivo'}`
      );
      return nt('<bloque>', []);
    }
    const nAbre = term('{'); pos++;
    const lista  = parseListaSentencias();
    const nCierra = consumir('}', 'ERR-S03',
      `Se esperaba '}' para cerrar el bloque, se encontró ${actual() ? `'${actual().lexema}'` : 'fin de archivo'}`
    );
    return nt('<bloque>', [nAbre, lista, nCierra]);
  }

  function parseListaSentencias() {
    const hijos = [];
    while (!fin() && !esLexema('}')) {
      const posAntes = pos;
      const sent = parseSentencia();
      if (sent) {
        hijos.push(sent);
      } else {
        // Si parseSentencia no avanzó, forzar avance para evitar bucle infinito
        if (pos === posAntes) {
          sincronizar(';', '}');
          if (esLexema(';')) pos++;
        }
      }
    }
    return nt('<lista_sentencias>', hijos);
  }

  // ────────────────────────────────────────────────────────────────────────
  //  Sentencias
  // ────────────────────────────────────────────────────────────────────────

  function parseSentencia() {
    const tok = actual();
    if (!tok) return null;

    switch (tok.lexema) {
      case 'naxuxi':  return parseDeclaracion();
      case 'kunu':    return parseCondicional();
      case 'huxiuy':  return parseCicloWhile();
      case 'tahma':   return parseCicloFor();
      case 'pula':    return parseDefinicionFuncion();
      case 'nuka':    return parseRetorno();
      case 'uray':    return parseSalida();
    }

    if (tok.tipo === 'IDENTIFICADOR') {
      const sig = siguiente();
      if (sig && (sig.lexema === '=' || sig.lexema === '+=' || sig.lexema === '-=')) {
        return parseAsignacion();
      }
      if (sig && sig.lexema === '(') {
        // llamada_funcion como sentencia independiente
        const llamada = parseLlamadaFuncion();
        const nSemi   = consumir(';', 'ERR-S01');
        return nt('<sentencia>', [llamada, nSemi]);
      }
    }

    registrarError('ERR-S04', tok.linea, tok.columna,
      `Token inesperado '${tok.lexema}' — no corresponde al inicio de ninguna instrucción válida`
    );
    return null;
  }

  function parseDeclaracion() {
    const nKw = term('naxuxi'); pos++;

    const tok = actual();
    if (!tok || tok.tipo !== 'IDENTIFICADOR') {
      registrarError('ERR-S04',
        tok ? tok.linea   : -1,
        tok ? tok.columna : -1,
        `Se esperaba un identificador después de 'naxuxi', se encontró ${tok ? `'${tok.lexema}'` : 'fin de archivo'}`
      );
      sincronizar(';', '}');
      if (esLexema(';')) pos++;
      return nt('<declaracion>', [nKw]);
    }
    const nId   = term(tok.lexema); pos++;
    const nEq   = consumir('=',  'ERR-S04');
    const expr  = parseExpresion();
    const nSemi = consumir(';',  'ERR-S01');
    return nt('<declaracion>', [nKw, nId, nEq, expr, nSemi]);
  }

  function parseAsignacion() {
    const nId  = term(actual().lexema); pos++;
    const nOp  = term(actual().lexema); pos++;
    const expr  = parseExpresion();
    const nSemi = consumir(';', 'ERR-S01');
    return nt('<asignacion>', [nId, nOp, expr, nSemi]);
  }

  function parseCondicional() {
    const nKw  = term('kunu'); pos++;
    const nLp  = consumir('(', 'ERR-S02');
    const expr  = parseExpresion();
    const nRp  = consumir(')', 'ERR-S02');
    const bloq  = parseBloque();
    const hijos = [nKw, nLp, expr, nRp, bloq];

    if (esLexema('suma')) {
      const nSuma  = term('suma'); pos++;
      const bloqEl = parseBloque();
      hijos.push(nSuma, bloqEl);
    }
    return nt('<condicional>', hijos);
  }

  function parseCicloWhile() {
    const nKw  = term('huxiuy'); pos++;
    const nLp  = consumir('(', 'ERR-S02');
    const expr  = parseExpresion();
    const nRp  = consumir(')', 'ERR-S02');
    const bloq  = parseBloque();
    return nt('<ciclo_while>', [nKw, nLp, expr, nRp, bloq]);
  }

  function parseCicloFor() {
    const nKw    = term('tahma'); pos++;
    const nLp    = consumir('(', 'ERR-S02');
    const inicio = parseInicioFor();
    const nS1    = consumir(';', 'ERR-S01');
    const cond   = parseExpresion();
    const nS2    = consumir(';', 'ERR-S01');
    const actua  = parseActualizacionFor();
    const nRp    = consumir(')', 'ERR-S02');
    const bloq   = parseBloque();
    return nt('<ciclo_for>', [nKw, nLp, inicio, nS1, cond, nS2, actua, nRp, bloq]);
  }

  function parseInicioFor() {
    const hijos = [];
    if (esLexema('naxuxi')) { hijos.push(term('naxuxi')); pos++; }
    const tok = actual();
    if (tok && tok.tipo === 'IDENTIFICADOR') { hijos.push(term(tok.lexema)); pos++; }
    hijos.push(consumir('=', 'ERR-S04'));
    hijos.push(parseExpresion());
    return nt('<inicio_for>', hijos);
  }

  function parseActualizacionFor() {
    const hijos = [];
    const tok = actual();
    if (tok && tok.tipo === 'IDENTIFICADOR') { hijos.push(term(tok.lexema)); pos++; }
    const op = actual();
    if (op && (op.lexema === '+=' || op.lexema === '-=' || op.lexema === '=')) {
      hijos.push(term(op.lexema)); pos++;
    }
    hijos.push(parseExpresion());
    return nt('<actualizacion_for>', hijos);
  }

  function parseDefinicionFuncion() {
    const nKw  = term('pula'); pos++;
    const tok  = actual();
    const nNom = (tok && tok.tipo === 'IDENTIFICADOR')
      ? (pos++, term(tok.lexema))
      : (registrarError('ERR-S04', tok ? tok.linea : -1, tok ? tok.columna : -1,
          `Se esperaba el nombre de la función después de 'pula'`), null);
    const nLp    = consumir('(', 'ERR-S02');
    const params  = esLexema(')') ? null : parseListaParametros();
    const nRp    = consumir(')', 'ERR-S02');
    const bloq   = parseBloque();
    return nt('<definicion_funcion>', [nKw, nNom, nLp, params, nRp, bloq]);
  }

  function parseListaParametros() {
    const hijos = [];
    const tok = actual();
    if (tok && tok.tipo === 'IDENTIFICADOR') { hijos.push(term(tok.lexema)); pos++; }
    while (esLexema(',')) {
      hijos.push(term(',')); pos++;
      const p = actual();
      if (p && p.tipo === 'IDENTIFICADOR') { hijos.push(term(p.lexema)); pos++; }
    }
    return nt('<lista_parametros>', hijos);
  }

  function parseRetorno() {
    const nKw   = term('nuka'); pos++;
    const expr  = parseExpresion();
    const nSemi = consumir(';', 'ERR-S01');
    return nt('<retorno>', [nKw, expr, nSemi]);
  }

  function parseSalida() {
    const nKw  = term('uray'); pos++;
    const nLp  = consumir('(', 'ERR-S02');
    const expr  = parseExpresion();
    const nRp  = consumir(')', 'ERR-S02');
    const nSemi = consumir(';', 'ERR-S01');
    return nt('<salida>', [nKw, nLp, expr, nRp, nSemi]);
  }

  function parseLlamadaFuncion() {
    const nNom = term(actual().lexema); pos++;
    const nLp  = consumir('(', 'ERR-S02');
    const args  = esLexema(')') ? null : parseListaArgumentos();
    const nRp  = consumir(')', 'ERR-S02');
    return nt('<llamada_funcion>', [nNom, nLp, args, nRp]);
  }

  function parseListaArgumentos() {
    const hijos = [];
    const e = parseExpresion();
    if (e) hijos.push(e);
    while (esLexema(',')) {
      hijos.push(term(',')); pos++;
      const en = parseExpresion();
      if (en) hijos.push(en);
    }
    return nt('<lista_argumentos>', hijos);
  }

  // ────────────────────────────────────────────────────────────────────────
  //  Expresiones (eliminación iterativa de la recursión izquierda)
  // ────────────────────────────────────────────────────────────────────────

  function parseExpresion() {
    const exp = parseExpLogica();
    return exp ? nt('<expresion>', [exp]) : null;
  }

  function parseExpLogica() {
    const izq = parseExpComparacion();
    if (!izq) return null;
    const hijos = [izq];
    while (esLexema('kiwi') || esLexema('woona')) {
      hijos.push(term(actual().lexema)); pos++;
      const der = parseExpComparacion();
      if (der) hijos.push(der);
    }
    return nt('<exp_logica>', hijos);
  }

  function parseExpComparacion() {
    const izq = parseExpAritmetica();
    if (!izq) return null;
    const hijos = [izq];
    while (!fin() && OPS_COMPARACION.has(actual().lexema)) {
      hijos.push(term(actual().lexema)); pos++;
      const der = parseExpAritmetica();
      if (der) hijos.push(der);
    }
    return nt('<exp_comparacion>', hijos);
  }

  function parseExpAritmetica() {
    const izq = parseTermino();
    if (!izq) return null;
    const hijos = [izq];
    while (esLexema('+') || esLexema('-')) {
      hijos.push(term(actual().lexema)); pos++;
      const der = parseTermino();
      if (der) hijos.push(der);
    }
    return nt('<exp_aritmetica>', hijos);
  }

  function parseTermino() {
    const fac = parseFactor();
    if (!fac) return null;
    const hijos = [fac];
    while (esLexema('*') || esLexema('/') || esLexema('%')) {
      hijos.push(term(actual().lexema)); pos++;
      const der = parseFactor();
      if (der) hijos.push(der);
    }
    return nt('<termino>', hijos);
  }

  function parseFactor() {
    const tok = actual();
    if (!tok) return null;

    // Expresión entre paréntesis
    if (tok.lexema === '(') {
      const nLp  = term('('); pos++;
      const expr  = parseExpresion();
      const nRp  = consumir(')', 'ERR-S02');
      return nt('<factor>', [nLp, expr, nRp]);
    }

    // ixka(...)  — entrada del usuario
    if (tok.lexema === 'ixka') {
      return nt('<factor>', [parseEntrada()]);
    }

    // llamada_funcion: identificador seguido de (
    if (tok.tipo === 'IDENTIFICADOR' && siguiente() && siguiente().lexema === '(') {
      return nt('<factor>', [parseLlamadaFuncion()]);
    }

    // Valor atómico
    const val = parseValor();
    return val ? nt('<factor>', [val]) : null;
  }

  function parseValor() {
    const tok = actual();
    if (!tok) return null;

    const esValido =
      tok.tipo === 'IDENTIFICADOR' ||
      tok.tipo === 'ENTERO'        ||
      tok.tipo === 'DECIMAL'       ||
      tok.tipo === 'CADENA'        ||
      (tok.tipo === 'RESERVADA' && (tok.lexema === 'hixi' || tok.lexema === 'kahl'));

    if (esValido) {
      pos++;
      return nt('<valor>', [term(tok.lexema)]);
    }

    registrarError('ERR-S04', tok.linea, tok.columna,
      `Se esperaba un valor (identificador, número, cadena o booleano), se encontró '${tok.lexema}'`
    );
    return null;
  }

  function parseEntrada() {
    const nKw  = term('ixka'); pos++;
    const nLp  = consumir('(', 'ERR-S02');
    const tok  = actual();
    const nArg = (tok && tok.tipo === 'CADENA') ? (pos++, term(tok.lexema)) : null;
    const nRp  = consumir(')', 'ERR-S02');
    return nt('<entrada>', [nKw, nLp, nArg, nRp]);
  }

  // ────────────────────────────────────────────────────────────────────────
  //  Punto de entrada
  // ────────────────────────────────────────────────────────────────────────

  const arbol = parsePrograma();

  return {
    valido: errores.length === 0,
    arbol,
    errores
  };
}

module.exports = { parsear, ERRORES_SINTACTICOS };
