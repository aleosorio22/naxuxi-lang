const PALABRAS_RESERVADAS = [
  'milpa', 'naxuxi', 'pula', 'nuka', 'ixka', 'uray',
  'kunu', 'suma', 'huxiuy', 'tahma', 'kiwi', 'woona',
  'hixi', 'kahl', 'tiwix', 'naru', 'pari', 'ixmi'
];

const TOKEN_TYPES = {
  RESERVADA:      'RESERVADA',
  IDENTIFICADOR:  'IDENTIFICADOR',
  ENTERO:         'ENTERO',
  DECIMAL:        'DECIMAL',
  CADENA:         'CADENA',
  OP_ARITMETICO:  'OP_ARITMETICO',
  OP_COMPARACION: 'OP_COMPARACION',
  OP_ASIGNACION:  'OP_ASIGNACION',
  DELIMITADOR:    'DELIMITADOR'
};

// Inferir tipo de dato desde el lexema del valor
function inferirTipo(lexema) {
  if (/^[0-9]+$/.test(lexema))           return 'entero';
  if (/^[0-9]+\.[0-9]+$/.test(lexema))   return 'decimal';
  if (lexema.startsWith('"') && lexema.endsWith('"')) return 'cadena';
  if (lexema === 'hixi' || lexema === 'kahl') return 'booleano';
  if (lexema === 'ixka')                  return 'entrada';
  if (/^[a-zA-Z_]/.test(lexema))         return 'referencia';
  return 'desconocido';
}

function analizar(codigoFuente) {
  const tokens  = [];
  const simbolos = [];
  const errores = [];

  let pos     = 0;
  let linea   = 1;
  let columna = 1;

  // Estado para construir la tabla de símbolos
  // 0=ninguno
  // 1=tras_naxuxi  2=tras_naxuxi_id  3=tras_naxuxi_id_eq
  // 10=tras_pula   11=tras_pula_id   12=dentro_parametros
  let estado     = 0;
  let varNombre  = '';
  let varLinea   = 0;
  let varColumna = 0;

  // Avanza pos+columna por n caracteres sin saltos de línea
  function avanzar(n) {
    pos     += n;
    columna += n;
  }

  // Avanza carácter a carácter actualizando linea/columna (para contenido multilínea)
  function avanzarTexto(texto) {
    for (const ch of texto) {
      if (ch === '\n') { linea++; columna = 1; }
      else              { columna++; }
      pos++;
    }
  }

  function emitirToken(tipo, lexema, lin, col) {
    tokens.push({ tipo, lexema, linea: lin, columna: col });

    // ── Máquina de estados para tabla de símbolos ────────────────────
    if (tipo === TOKEN_TYPES.RESERVADA && lexema === 'naxuxi') {
      estado = 1;

    } else if (tipo === TOKEN_TYPES.RESERVADA && lexema === 'pula') {
      estado = 10;

    // ── Rama naxuxi (estados 1-3) ──────────────────────────────────
    } else if (estado === 1 && tipo === TOKEN_TYPES.IDENTIFICADOR) {
      varNombre = lexema; varLinea = lin; varColumna = col;
      estado = 2;
    } else if (estado === 2 && tipo === TOKEN_TYPES.OP_ASIGNACION && lexema === '=') {
      estado = 3;
    } else if (estado === 3) {
      simbolos.push({
        identificador: varNombre,
        tipo:          inferirTipo(lexema),
        valor:         lexema,
        linea:         varLinea,
        columna:       varColumna
      });
      estado = 0;

    // ── Rama pula (estados 10-12) ──────────────────────────────────
    } else if (estado === 10 && tipo === TOKEN_TYPES.IDENTIFICADOR) {
      // Nombre de la función
      simbolos.push({
        identificador: lexema,
        tipo:          'funcion',
        valor:         'pula',
        linea:         lin,
        columna:       col
      });
      estado = 11;
    } else if (estado === 11 && lexema === '(') {
      estado = 12;
    } else if (estado === 12 && tipo === TOKEN_TYPES.IDENTIFICADOR) {
      // Parámetro de la función
      simbolos.push({
        identificador: lexema,
        tipo:          'parametro',
        valor:         '—',
        linea:         lin,
        columna:       col
      });
      // permanecer en estado 12 para más parámetros
    } else if (estado === 12 && lexema === ')') {
      estado = 0;

    // ── Reinicio por token relevante fuera de contexto ─────────────
    } else if (tipo === TOKEN_TYPES.RESERVADA || tipo === TOKEN_TYPES.IDENTIFICADOR ||
               tipo === TOKEN_TYPES.ENTERO    || tipo === TOKEN_TYPES.DECIMAL       ||
               tipo === TOKEN_TYPES.CADENA) {
      if (estado !== 2) estado = 0;
    }
  }

  function registrarError(codigo, tipo, lexema, lin, col, descripcion) {
    errores.push({ codigo, tipo, lexema, linea: lin, columna: col, descripcion });
    estado = 0;
  }

  while (pos < codigoFuente.length) {
    const resto     = codigoFuente.slice(pos);
    const linActual = linea;
    const colActual = columna;

    // ── 1. Espacios y tabulaciones ──────────────────────────────────────────
    const mEspacio = resto.match(/^[ \t\r]+/);
    if (mEspacio) { avanzar(mEspacio[0].length); continue; }

    // ── 2. Salto de línea ───────────────────────────────────────────────────
    if (codigoFuente[pos] === '\n') {
      linea++; columna = 1; pos++;
      continue;
    }

    // ── 3. Comentario de bloque #* ... *# ──────────────────────────────────
    if (resto.startsWith('#*')) {
      const mBloque = resto.match(/^#\*[\s\S]*?\*#/);
      if (mBloque) {
        avanzarTexto(mBloque[0]);
      } else {
        // No cerrado — consumir hasta fin de archivo
        registrarError(
          'ERR-L03', 'Comentario de bloque no cerrado', '#*',
          linActual, colActual,
          'Comentario de bloque abierto con #* pero sin cierre *#'
        );
        avanzarTexto(resto); // consume todo lo que queda
      }
      continue;
    }

    // ── 4. Comentario de línea ## ───────────────────────────────────────────
    const mLinea = resto.match(/^##[^\n]*/);
    if (mLinea) { avanzar(mLinea[0].length); continue; }

    // ── 5. Cadena "..." ─────────────────────────────────────────────────────
    if (codigoFuente[pos] === '"') {
      const mCadena = resto.match(/^"[^"\n]*"/);
      if (mCadena) {
        emitirToken(TOKEN_TYPES.CADENA, mCadena[0], linActual, colActual);
        avanzar(mCadena[0].length);
      } else {
        const mSinCerrar = resto.match(/^"[^\n]*/);
        const lexema = mSinCerrar ? mSinCerrar[0] : '"';
        registrarError(
          'ERR-L02', 'Cadena no cerrada', lexema,
          linActual, colActual,
          `La cadena abre con " pero no tiene cierre en la línea ${linActual}`
        );
        avanzar(lexema.length);
      }
      continue;
    }

    // ── 6. Número malformado: dígitos seguidos de punto sin dígitos ─────────
    //      Ej.: 3.  → ERR-L04   (debe procesarse ANTES de decimal/entero)
    const mMalformado = resto.match(/^[0-9]+\.(?![0-9])/);
    if (mMalformado) {
      registrarError(
        'ERR-L04', 'Número malformado', mMalformado[0],
        linActual, colActual,
        `Un decimal requiere dígitos después del punto (encontrado: '${mMalformado[0]}')`
      );
      avanzar(mMalformado[0].length);
      continue;
    }

    // ── 7. Decimal ──────────────────────────────────────────────────────────
    const mDecimal = resto.match(/^[0-9]+\.[0-9]+/);
    if (mDecimal) {
      emitirToken(TOKEN_TYPES.DECIMAL, mDecimal[0], linActual, colActual);
      avanzar(mDecimal[0].length);
      continue;
    }

    // ── 8. Identificador inválido: empieza con dígito seguido de letras ─────
    //      Ej.: 1edad → ERR-L05   (antes que entero puro)
    const mIdentInvalido = resto.match(/^[0-9]+[a-zA-Z_][a-zA-Z0-9_]*/);
    if (mIdentInvalido) {
      registrarError(
        'ERR-L05', 'Identificador inválido', mIdentInvalido[0],
        linActual, colActual,
        `Un identificador no puede comenzar con un dígito (encontrado: '${mIdentInvalido[0]}')`
      );
      avanzar(mIdentInvalido[0].length);
      continue;
    }

    // ── 9. Entero ───────────────────────────────────────────────────────────
    const mEntero = resto.match(/^[0-9]+/);
    if (mEntero) {
      emitirToken(TOKEN_TYPES.ENTERO, mEntero[0], linActual, colActual);
      avanzar(mEntero[0].length);
      continue;
    }

    // ── 10. Identificador / Reservada ───────────────────────────────────────
    const mIdent = resto.match(/^[a-zA-Z_][a-zA-Z0-9_]*/);
    if (mIdent) {
      const lexema = mIdent[0];
      const esReservada = PALABRAS_RESERVADAS.includes(lexema);

      if (esReservada) {
        // ERR-L06: palabra reservada donde se esperaba un identificador (tras naxuxi)
        if (estado === 1) {
          registrarError(
            'ERR-L06', 'Palabra reservada usada como identificador', lexema,
            linActual, colActual,
            `'${lexema}' es una palabra reservada y no puede usarse como nombre de variable`
          );
          avanzar(lexema.length);
          continue;
        }
        emitirToken(TOKEN_TYPES.RESERVADA, lexema, linActual, colActual);
      } else {
        emitirToken(TOKEN_TYPES.IDENTIFICADOR, lexema, linActual, colActual);
      }
      avanzar(lexema.length);
      continue;
    }

    // ── 11. Operador de comparación doble == != >= <= ───────────────────────
    const mCompDoble = resto.match(/^(==|!=|>=|<=)/);
    if (mCompDoble) {
      emitirToken(TOKEN_TYPES.OP_COMPARACION, mCompDoble[0], linActual, colActual);
      avanzar(2);
      continue;
    }

    // ── 12. Asignación compuesta += -= ──────────────────────────────────────
    const mAsignComp = resto.match(/^(\+=|-=)/);
    if (mAsignComp) {
      emitirToken(TOKEN_TYPES.OP_ASIGNACION, mAsignComp[0], linActual, colActual);
      avanzar(2);
      continue;
    }

    // ── 13. Operador de comparación simple > < ──────────────────────────────
    if (codigoFuente[pos] === '>' || codigoFuente[pos] === '<') {
      emitirToken(TOKEN_TYPES.OP_COMPARACION, codigoFuente[pos], linActual, colActual);
      avanzar(1);
      continue;
    }

    // ── 14. Operador aritmético + - * / % ────────────────────────────────────
    const mAritm = resto.match(/^[+\-*\/%]/);
    if (mAritm) {
      emitirToken(TOKEN_TYPES.OP_ARITMETICO, mAritm[0], linActual, colActual);
      avanzar(1);
      continue;
    }

    // ── 15. Asignación simple = ─────────────────────────────────────────────
    if (codigoFuente[pos] === '=') {
      emitirToken(TOKEN_TYPES.OP_ASIGNACION, '=', linActual, colActual);
      avanzar(1);
      continue;
    }

    // ── 16. Delimitador { } ( ) ; , ──────────────────────────────────────────
    const mDelim = resto.match(/^[{}();,]/);
    if (mDelim) {
      emitirToken(TOKEN_TYPES.DELIMITADOR, mDelim[0], linActual, colActual);
      avanzar(1);
      continue;
    }

    // ── 17. Error léxico — carácter no reconocido ───────────────────────────
    registrarError(
      'ERR-L01', 'Carácter no permitido', codigoFuente[pos],
      linActual, colActual,
      `El símbolo '${codigoFuente[pos]}' no pertenece al alfabeto de Naxuxi`
    );
    avanzar(1);
  }

  return { tokens, simbolos, errores };
}

export { analizar, TOKEN_TYPES, PALABRAS_RESERVADAS };
