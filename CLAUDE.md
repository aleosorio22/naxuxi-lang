# CLAUDE.md — Instrucciones del Proyecto Naxuxi

Este archivo contiene todo el contexto necesario para implementar el compilador del lenguaje de programación **Naxuxi**. Lee este archivo completo antes de escribir cualquier línea de código.

---

## 1. Contexto del proyecto

Naxuxi es un lenguaje de programación creado como proyecto universitario para el curso de Compiladores de la Universidad Mariano Gálvez de Guatemala. Está basado en vocabulario de la lengua indígena **Xinca** de Jutiapa, Guatemala, y su metáfora central es el **ciclo del cultivo del maíz**.

El compilador debe:
- Analizar léxicamente código fuente escrito en Naxuxi
- Analizar sintácticamente la estructura del programa
- Reportar errores léxicos y sintácticos con línea y columna
- Construir una tabla de símbolos
- Funcionar tanto como interfaz web como desde terminal (CLI)

---

## 2. Stack tecnológico

| Componente | Tecnología |
|---|---|
| Compilador (lexer + parser) | JavaScript puro ES6+ sin librerías externas |
| Frontend | React + Vite |
| Estilos | Tailwind CSS |
| Editor de código | CodeMirror 6 con resaltado personalizado para Naxuxi |
| Runtime / CLI | Node.js |

### Estructura de carpetas

```
naxuxi/
├── compiler/
│   ├── lexer.js         ← Analizador léxico
│   └── parser.js        ← Analizador sintáctico
├── src/
│   ├── App.jsx
│   ├── components/
│   │   ├── Editor.jsx       ← Editor con CodeMirror
│   │   ├── TokenTable.jsx   ← Tabla de tokens
│   │   ├── SymbolTable.jsx  ← Tabla de símbolos
│   │   └── ErrorTable.jsx   ← Tabla de errores
│   └── main.jsx
├── cli.js               ← Entrada por terminal
├── CLAUDE.md
└── package.json
```

### Comandos

```bash
npm run dev          # Interfaz web en http://localhost:5173
node cli.js archivo.nax   # Compilar desde terminal
```

---

## 3. El lenguaje Naxuxi

### Reglas generales

- Todo en **minúsculas**
- **Case-sensitive**: `Edad` y `edad` son distintos
- Cada instrucción termina con **`;`**
- Bloques delimitados con **`{ }`**
- Comentarios de línea: **`##`**
- Comentarios de bloque: **`#* ... *#`**
- Tipos **inferidos** del valor — no se declaran explícitamente
- La extensión de los archivos es **`.nax`**

### Palabras reservadas (18)

```javascript
const PALABRAS_RESERVADAS = [
  "milpa",   // Bloque principal del programa
  "naxuxi",  // Declarar variable
  "pula",    // Definir función
  "nuka",    // Retornar valor
  "ixka",    // Leer entrada del usuario
  "uray",    // Mostrar salida en pantalla
  "kunu",    // Condicional if
  "suma",    // Condicional else
  "huxiuy",  // Ciclo while
  "tahma",   // Ciclo for
  "kiwi",    // Operador lógico AND
  "woona",   // Operador lógico OR
  "hixi",    // Valor booleano true
  "kahl",    // Valor booleano false
  "tiwix",   // Reservada (uso futuro)
  "naru",    // Reservada (uso futuro)
  "pari",    // Reservada (uso futuro)
  "ixmi"     // Reservada (uso futuro)
];
```

### Ejemplo de programa válido

```
#*
    Programa: Calculadora de área
    Lenguaje: Naxuxi
*#

pula calcularArea(largo, ancho) {
    nuka largo * ancho;
}

milpa {
    naxuxi largo = ixka("Ingresa el largo: ");
    naxuxi ancho = ixka("Ingresa el ancho: ");
    naxuxi area = calcularArea(largo, ancho);

    uray("El área es: " + area);

    kunu (area >= 500) {
        uray("Milpa apta para siembra.");
    } suma {
        uray("Milpa pequeña.");
    }
}
```

---

## 4. Análisis Léxico — lexer.js

### Categorías de tokens

```javascript
const TOKEN_TYPES = {
  RESERVADA: 'RESERVADA',
  IDENTIFICADOR: 'IDENTIFICADOR',
  ENTERO: 'ENTERO',
  DECIMAL: 'DECIMAL',
  CADENA: 'CADENA',
  OP_ARITMETICO: 'OP_ARITMETICO',
  OP_COMPARACION: 'OP_COMPARACION',
  OP_ASIGNACION: 'OP_ASIGNACION',
  DELIMITADOR: 'DELIMITADOR'
  // Los comentarios se reconocen y se descartan — no generan token
};
```

### Expresiones regulares

```javascript
const PATTERNS = {
  COMENTARIO_BLOQUE: /^#\*[\s\S]*?\*#/,
  COMENTARIO_LINEA:  /^##[^\n]*/,
  CADENA:            /^"[^"\n]*"/,
  DECIMAL:           /^[0-9]+\.[0-9]+/,   // ANTES que ENTERO
  ENTERO:            /^[0-9]+/,
  IDENTIFICADOR:     /^[a-zA-Z_][a-zA-Z0-9_]*/,
  OP_COMPARACION:    /^(==|!=|>=|<=)/,    // ANTES que OP_ASIGNACION
  OP_ASIGNACION_COMP:/^(\+=|-=)/,         // ANTES que OP_ARITMETICO
  OP_COMPARACION_SIM:/^[><]/,
  OP_ARITMETICO:     /^[+\-*\/%]/,
  OP_ASIGNACION:     /^=/,                // AL FINAL de operadores
  DELIMITADOR:       /^[{}();,]/
};
```

### Orden de evaluación (CRÍTICO — no cambiar)

1. Espacios y saltos de línea (descartar)
2. Comentario de bloque `#* *#` (descartar)
3. Comentario de línea `##` (descartar)
4. Cadena `"..."`
5. Decimal `9.9` ← antes que entero
6. Entero `9`
7. Identificador / Reservada
8. Operador de comparación doble `==` `!=` `>=` `<=` ← antes que simple
9. Asignación compuesta `+=` `-=` ← antes que `=`
10. Operador de comparación simple `>` `<`
11. Operador aritmético `+` `-` `*` `/` `%`
12. Asignación simple `=` ← al final de operadores
13. Delimitador `{ } ( ) ; ,`
14. ❌ Error léxico — carácter no reconocido

### Estructura de un token

```javascript
{
  tipo: 'RESERVADA',       // categoría
  lexema: 'milpa',         // valor original
  linea: 1,                // línea en el código
  columna: 1               // columna en el código
}
```

### Tabla de símbolos

Se construye durante el análisis léxico. Solo registra variables declaradas con `naxuxi`.

```javascript
{
  identificador: 'edad',
  tipo: 'entero',          // inferido del valor
  valor: '25',
  linea: 2,
  columna: 13
}
```

**Reglas de inferencia de tipos:**
- Valor coincide con `/^[0-9]+$/` → `entero`
- Valor coincide con `/^[0-9]+\.[0-9]+$/` → `decimal`
- Valor comienza y termina con `"` → `cadena`
- Valor es `hixi` o `kahl` → `booleano`

### Errores léxicos

El lexer NO se detiene — acumula todos los errores y continúa.

```javascript
const ERRORES_LEXICOS = {
  'ERR-L01': 'Carácter no permitido',
  'ERR-L02': 'Cadena no cerrada',
  'ERR-L03': 'Comentario de bloque no cerrado',
  'ERR-L04': 'Número malformado',
  'ERR-L05': 'Identificador inválido',
  'ERR-L06': 'Palabra reservada usada como identificador'
};
```

Estructura de un error léxico:
```javascript
{
  codigo: 'ERR-L01',
  tipo: 'Carácter no permitido',
  lexema: '@',
  linea: 2,
  columna: 12,
  descripcion: 'El símbolo @ no pertenece al alfabeto de Naxuxi'
}
```

### Interfaz pública del lexer

```javascript
// lexer.js debe exportar esta función
function analizar(codigoFuente) {
  return {
    tokens: [],        // lista de tokens reconocidos
    simbolos: [],      // tabla de símbolos
    errores: []        // tabla de errores léxicos
  };
}

module.exports = { analizar };
```

---

## 5. Análisis Sintáctico — parser.js

El parser implementa **descenso recursivo**. Cada no terminal del BNF es una función.

### BNF resumido

```
<programa>          ::= "milpa" <bloque>
<bloque>            ::= "{" <lista_sentencias> "}"
<lista_sentencias>  ::= { <sentencia> }
<sentencia>         ::= <declaracion> | <asignacion> | <condicional>
                      | <ciclo_while> | <ciclo_for> | <definicion_funcion>
                      | <retorno> | <salida> | <llamada_funcion> ";"
<declaracion>       ::= "naxuxi" <id> "=" <expresion> ";"
<asignacion>        ::= <id> ("=" | "+=" | "-=") <expresion> ";"
<condicional>       ::= "kunu" "(" <expresion> ")" <bloque> [ "suma" <bloque> ]
<ciclo_while>       ::= "huxiuy" "(" <expresion> ")" <bloque>
<ciclo_for>         ::= "tahma" "(" <inicio_for> ";" <expresion> ";" <actualizacion> ")" <bloque>
<definicion_funcion>::= "pula" <id> "(" [ <lista_params> ] ")" <bloque>
<retorno>           ::= "nuka" <expresion> ";"
<salida>            ::= "uray" "(" <expresion> ")" ";"
<expresion>         ::= <exp_logica>
<exp_logica>        ::= <exp_comp> { ("kiwi"|"woona") <exp_comp> }
<exp_comp>          ::= <exp_arit> { ("=="|"!="|">"|"<"|">="|"<=") <exp_arit> }
<exp_arit>          ::= <termino> { ("+"|"-") <termino> }
<termino>           ::= <factor> { ("*"|"/"|"%") <factor> }
<factor>            ::= "(" <expresion> ")" | <valor> | <llamada_funcion>
<valor>             ::= <id> | <entero> | <decimal> | <cadena> | <booleano> | <entrada>
```

### Errores sintácticos

El parser NO se detiene — intenta recuperarse y acumula todos los errores.

```javascript
const ERRORES_SINTACTICOS = {
  'ERR-S01': 'Falta de punto y coma',
  'ERR-S02': 'Paréntesis sin cerrar',
  'ERR-S03': 'Llave sin cerrar',
  'ERR-S04': 'Estructura incompleta',
  'ERR-S05': 'Bloque milpa ausente'
};
```

### Interfaz pública del parser

```javascript
// parser.js debe exportar esta función
function parsear(tokens) {
  return {
    valido: true,          // true si no hay errores sintácticos
    errores: []            // tabla de errores sintácticos
  };
}

module.exports = { parsear };
```

---

## 6. Interfaz web

### Comportamiento esperado

1. El usuario escribe código Naxuxi en el editor (CodeMirror) **o** carga un archivo `.nax`
2. Presiona el botón **"Compilar"**
3. La interfaz muestra:
   - ✅ Lista de tokens reconocidos
   - ✅ Tabla de símbolos
   - ✅ Tabla de errores léxicos (si hay)
   - ✅ Resultado del análisis sintáctico
   - ✅ Tabla de errores sintácticos (si hay)

### Componentes React

**Editor.jsx**
- Usa CodeMirror 6
- Resalta las 18 palabras reservadas de Naxuxi con color distinto
- Acepta carga de archivos `.nax` con botón "Cargar archivo"
- Botón "Compilar" que llama al lexer y parser

**TokenTable.jsx**
- Tabla con columnas: `#`, `Lexema`, `Categoría`, `Línea`, `Columna`
- Muestra todos los tokens reconocidos

**SymbolTable.jsx**
- Tabla con columnas: `Identificador`, `Tipo`, `Valor`, `Línea`, `Columna`
- Muestra la tabla de símbolos

**ErrorTable.jsx**
- Tabla con columnas: `#`, `Código`, `Tipo`, `Lexema`, `Línea`, `Columna`, `Descripción`
- Muestra errores léxicos y sintácticos con colores diferenciados
- Errores léxicos en color amarillo/naranja
- Errores sintácticos en color rojo

**DerivationTree.jsx**
- Visualiza el árbol de derivación sintáctico del programa compilado
- Solo se muestra cuando el programa es válido (sin errores sintácticos)
- Cada nodo del árbol muestra el no terminal o terminal correspondiente
- Nodos no terminales: fondo claro, borde visible (ej. `<programa>`, `<bloque>`)
- Nodos terminales (hojas): fondo diferente (ej. `"milpa"`, `"25"`, `"edad"`)
- El árbol debe ser scrolleable si es muy grande
- Usar SVG o una librería ligera de visualización de árboles (ej. `react-d3-tree` o SVG puro)
- Si el programa tiene errores sintácticos, mostrar mensaje: "El árbol de derivación solo se genera para programas válidos"

### Árbol de derivación — estructura de datos del parser

El parser debe retornar un árbol de nodos con esta estructura:

```javascript
// Nodo del árbol de derivación
{
  tipo: 'no-terminal',        // 'no-terminal' o 'terminal'
  nombre: '<programa>',       // nombre del nodo
  hijos: [                    // hijos directos según la regla BNF
    {
      tipo: 'terminal',
      nombre: '"milpa"',
      hijos: []
    },
    {
      tipo: 'no-terminal',
      nombre: '<bloque>',
      hijos: [ ... ]
    }
  ]
}
```

El parser debe construir este árbol durante el análisis y retornarlo junto con los errores.

### Interfaz pública del parser actualizada

```javascript
// parser.js debe exportar esta función
function parsear(tokens) {
  return {
    valido: true,          // true si no hay errores sintácticos
    arbol: {},             // árbol de derivación (solo si valido === true)
    errores: []            // tabla de errores sintácticos
  };
}

module.exports = { parsear };
```

### Diseño

- Tema oscuro preferido
- Layout de dos paneles: izquierda editor, derecha resultados con tabs
- Los tabs del panel derecho: `Tokens` | `Símbolos` | `Árbol` | `Errores`
- Indicador visual: ✅ "Compilación exitosa" o ❌ "X errores encontrados"
- El tab `Árbol` muestra el árbol de derivación con nodos y conexiones visuales

---

## 7. CLI — cli.js

```bash
node cli.js programa.nax
```

Salida esperada en terminal:

```
=== NAXUXI COMPILER ===
Archivo: programa.nax

=== TOKENS ===
[RESERVADA]    milpa        línea 1  col 1
[DELIMITADOR]  {            línea 1  col 7
...

=== TABLA DE SÍMBOLOS ===
edad     | entero  | 25    | línea 2
precio   | decimal | 12.50 | línea 3

=== ERRORES LÉXICOS ===
(ninguno)

=== ANÁLISIS SINTÁCTICO ===
✓ Programa válido.

=== ERRORES SINTÁCTICOS ===
(ninguno)
```

---

## 8. Instrucciones de implementación

### Orden de implementación (respetar este orden)

1. **`compiler/lexer.js`** — implementar primero y probarlo con los 5 programas de prueba
2. **`compiler/parser.js`** — implementar después del lexer, debe retornar árbol de derivación
3. **`cli.js`** — conectar lexer y parser para pruebas rápidas en terminal
4. **`src/components/Editor.jsx`** — editor con CodeMirror y resaltado de palabras reservadas
5. **`src/components/TokenTable.jsx`** — tabla de tokens
6. **`src/components/SymbolTable.jsx`** — tabla de símbolos
7. **`src/components/ErrorTable.jsx`** — tabla de errores léxicos y sintácticos
8. **`src/components/DerivationTree.jsx`** — visualización del árbol de derivación en SVG
9. **`src/App.jsx`** — ensamblar todo con tabs: Tokens | Símbolos | Árbol | Errores

### Programas de prueba (usar para verificar el lexer)

**Prueba válida 1 — Declaración:**
```
milpa {
    naxuxi edad = 25;
}
```

**Prueba válida 2 — Condicional:**
```
milpa {
    kunu (edad >= 18) {
        uray("Mayor");
    } suma {
        uray("Menor");
    }
}
```

**Prueba válida 3 — Ciclo while:**
```
milpa {
    huxiuy (i < 5) {
        uray(i);
    }
}
```

**Prueba válida 4 — Función:**
```
milpa {
    pula sumar(a, b) {
        nuka a + b;
    }
}
```

**Prueba válida 5 — Ciclo for:**
```
milpa {
    tahma (naxuxi i = 0; i < 3; i += 1) {
        uray(i);
    }
}
```

**Prueba con errores léxicos:**
```
milpa {
    naxuxi @precio = 25;
    naxuxi nombre = "Maria;
    naxuxi 1edad = 10;
    naxuxi valor = 3.;
    naxuxi milpa = 5;
}
```

**Prueba con errores sintácticos:**
```
milpa {
    naxuxi edad = 25
    kunu (edad >= 18 {
        uray("Mayor");
    }
}
```

### Reglas importantes

- El **compilador** (`compiler/`) no debe importar React ni ninguna librería del frontend
- El **compilador** debe funcionar igual en Node.js (CLI) y en el navegador (web)
- Usar `module.exports` en los archivos del compilador para compatibilidad con Node.js y el frontend
- No usar `import/export` ES modules en `compiler/` — usar `require/module.exports`
- El lexer y el parser son **funciones puras** — reciben texto/tokens y retornan resultados, sin efectos secundarios
- Cada error debe incluir siempre: código, tipo, lexema, línea, columna, descripción

---

## 9. Preferencias del desarrollador

- Soluciones simples y funcionales — evitar complejidad innecesaria
- Completar un módulo completamente antes de avanzar al siguiente
- Pedir confirmación antes de ejecutar cada paso importante
- UI profesional con diseño limpio, tema oscuro, fácil de mantener
- Español en todos los mensajes de la interfaz

---

*Proyecto: Compilador Naxuxi — Curso de Compiladores*  
*Universidad Mariano Gálvez de Guatemala*  
*Basado en la lengua Xinca de Jutiapa, Guatemala*
