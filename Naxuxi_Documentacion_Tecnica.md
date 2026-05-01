# Naxuxi — Documentación Técnica
### Mini-Compilador · Lenguaje de Programación basado en la lengua Xinca
**Estudiante:** René  
**Carné:** 0905-23-10736  
**Curso:** Compiladores  
**Universidad:** Universidad Mariano Gálvez de Guatemala  

---

## Contenido

1. Fase 1 — Definición del Lenguaje
2. Fase 2 — Herramientas Utilizadas
3. Fase 3 — Análisis Léxico ✓
4. Fase 4 — Análisis Sintáctico ✓
5. Fase 5 — Interfaz Web ✓
6. Conclusiones *(próximamente)*

---

# Fase 1 — Definición del Lenguaje

## 1. Nombre del Lenguaje

**Naxuxi** *(pronunciado: na-xu-xi)*

El nombre proviene de la lengua **Xinca**, lengua indígena originaria de la región suroriental de Guatemala — específicamente de los departamentos de Santa Rosa, Jutiapa y Jalapa. En Xinca, *naxuxi* significa **semilla**, concepto que da nombre al lenguaje porque toda semilla contiene en potencia lo que será: de la misma manera, un programa Naxuxi es una semilla de instrucciones que, al ejecutarse, produce resultados.

---

## 2. Contexto de Uso

### 2.1 Propósito del lenguaje

Naxuxi es un lenguaje de programación orientado a **scripts de automatización**, diseñado con fines educativos y de preservación cultural. Su objetivo es demostrar que los conceptos fundamentales de la programación — declaración de variables, control de flujo, funciones, entrada y salida — pueden expresarse utilizando vocabulario de una lengua indígena guatemalteca en peligro de extinción.

El lenguaje está pensado para ser simple, legible y de fácil aprendizaje, siguiendo el paradigma imperativo similar a Python o Pascal básico, pero con una identidad cultural propia.

### 2.2 Base cultural — La lengua Xinca

El Xinca es una lengua indígena **no maya**, única en su tipo en toda Centroamérica, sin parentesco conocido con ninguna otra familia lingüística. Según estimaciones actuales, cuenta con menos de 500 hablantes activos. Es reconocida oficialmente por la Academia de Lenguas Mayas de Guatemala (ALMG) y por el Ministerio de Educación de Guatemala, aunque su supervivencia está en riesgo crítico.

Naxuxi utiliza raíces léxicas del Xinca como palabras reservadas, simplificando la ortografía donde fue necesario para facilitar el análisis léxico — específicamente eliminando apóstrofes fonéticos que complicarían la tokenización. Esta decisión se documenta de manera transparente y no pretende representar la ortografía académica oficial de la lengua.

### 2.3 Metáfora central — El ciclo del maíz

Las palabras reservadas del lenguaje están organizadas semánticamente alrededor del **ciclo del cultivo del maíz**, actividad central en la cosmovisión y economía del pueblo Xinca y de las comunidades rurales de Jutiapa. Las etapas del ciclo — preparar la tierra, sembrar, regar, cuidar, cosechar y almacenar — se corresponden con las fases de un programa: declarar, inicializar, iterar, condicionar, ejecutar y retornar.

---

## 3. Palabras Reservadas

El lenguaje Naxuxi cuenta con **18 palabras reservadas**, todas derivadas del vocabulario Xinca y organizadas por función:

| Palabra | Raíz Xinca | Significado original | Función en Naxuxi |
|---|---|---|---|
| `milpa` | Nahua/regional | Campo de maíz | Bloque principal del programa |
| `naxuxi` | Xinca | Semilla | Declarar una variable |
| `pula` | Xinca | Hacer | Definir una función |
| `nuka` | Xinca | Dar | Retornar un valor |
| `ixka` | Xinca | Beber / recibir | Leer entrada del usuario |
| `uray` | Xinca | Fuego | Mostrar salida en pantalla |
| `kunu` | Xinca | Nube | Condicional if |
| `suma` | Xinca | Noche | Condicional else |
| `huxiuy` | Xinca | Lluvia | Ciclo while |
| `tahma` | Xinca | Camino | Ciclo for |
| `kiwi` | Xinca | Todo | Operador lógico AND |
| `woona` | Xinca | Cerro / volcán | Operador lógico OR |
| `hixi` | Xinca | Piedra | Valor booleano true |
| `kahl` | Xinca | Humo | Valor booleano false |
| `tiwix` | Xinca | Cielo | Tipo booleano |
| `naru` | Xinca | Tierra | Reservada (uso futuro) |
| `pari` | Xinca | Sol | Reservada (uso futuro) |
| `ixmi` | Xinca | Decir | Reservada (uso futuro) |

> **Nota:** La palabra `milpa` proviene del náhuatl y fue adoptada regionalmente en Guatemala para referirse al campo de cultivo de maíz. Se incluye por su relevancia cultural directa con el contexto del lenguaje, aunque no es de origen Xinca puro.

> **Nota:** Los tipos de datos en Naxuxi son **inferidos** del valor asignado, no declarados explícitamente. Las palabras `naru`, `pari` e `ixmi` están reservadas para posibles extensiones futuras del lenguaje.

---

## 4. Sintaxis del Lenguaje

### 4.1 Reglas generales de escritura

- Todas las palabras reservadas se escriben en **minúsculas**.
- El lenguaje es **case-sensitive**: `Edad` y `edad` son identificadores distintos.
- Cada instrucción termina con punto y coma **`;`**.
- Los bloques de código se delimitan con llaves **`{ }`**.
- La indentación es opcional pero recomendada (4 espacios o 1 tabulación).
- Los comentarios de una línea comienzan con `##`.
- Los comentarios de múltiples líneas se encierran entre `#* ... *#`.
- Los identificadores pueden contener letras, dígitos y guión bajo, pero no pueden comenzar con un dígito.

---

### 4.2 Estructura general del programa

Todo programa Naxuxi debe comenzar con el bloque `milpa`, que representa el punto de entrada:

```
milpa {
    ## instrucciones aquí
}
```

Un programa mínimo válido:

```
milpa {
    uray("Ralh na pari");
}
```
> *"Ralh na pari" significa "Buenos días" en Xinca.*

---

### 4.3 Declaración de variables

Las variables se declaran con la palabra reservada `naxuxi`. El tipo es inferido del valor asignado.

**Sintaxis:**
```
naxuxi <identificador> = <valor>;
```

**Ejemplos:**
```
naxuxi edad = 25;          ## entero inferido
naxuxi precio = 12.50;     ## decimal inferido
naxuxi nombre = "Maria";   ## texto inferido
naxuxi activo = hixi;      ## booleano inferido (true)
naxuxi cerrado = kahl;     ## booleano inferido (false)
```

---

### 4.4 Operadores

#### Aritméticos
| Operador | Descripción | Ejemplo |
|---|---|---|
| `+` | Suma | `a + b` |
| `-` | Resta | `a - b` |
| `*` | Multiplicación | `a * b` |
| `/` | División | `a / b` |
| `%` | Módulo | `a % b` |

#### De comparación
| Operador | Descripción | Ejemplo |
|---|---|---|
| `==` | Igual a | `a == b` |
| `!=` | Diferente de | `a != b` |
| `>` | Mayor que | `a > b` |
| `<` | Menor que | `a < b` |
| `>=` | Mayor o igual | `a >= b` |
| `<=` | Menor o igual | `a <= b` |

#### De asignación
| Operador | Descripción | Ejemplo |
|---|---|---|
| `=` | Asignación simple | `naxuxi x = 10;` |
| `+=` | Suma y asigna | `x += 5;` |
| `-=` | Resta y asigna | `x -= 3;` |

#### Lógicos
| Operador | Descripción | Ejemplo |
|---|---|---|
| `kiwi` | AND lógico | `a > 0 kiwi b > 0` |
| `woona` | OR lógico | `a == 0 woona b == 0` |

---

### 4.5 Símbolos permitidos

| Símbolo | Nombre | Uso |
|---|---|---|
| `{ }` | Llaves | Delimitadores de bloque |
| `( )` | Paréntesis | Condiciones, argumentos de función |
| `;` | Punto y coma | Fin de instrucción |
| `=` | Igual | Asignación |
| `"..."` | Comillas dobles | Cadenas de texto |
| `##` | Doble numeral | Comentario de línea |
| `#* *#` | Numeral-asterisco | Comentario multilínea |
| `,` | Coma | Separador de argumentos |
| `+` `-` `*` `/` `%` | Operadores aritméticos | Expresiones matemáticas |
| `==` `!=` `>` `<` `>=` `<=` | Operadores de comparación | Condiciones |
| `+=` `-=` | Asignación compuesta | Modificar variables |

---

### 4.6 Condicionales

**Sintaxis `kunu` (if):**
```
kunu (<condición>) {
    ## instrucciones si verdadero
}
```

**Sintaxis `kunu / suma` (if / else):**
```
kunu (<condición>) {
    ## instrucciones si verdadero
} suma {
    ## instrucciones si falso
}
```

**Ejemplo:**
```
milpa {
    naxuxi edad = 20;
    kunu (edad >= 18) {
        uray("Eres mayor de edad");
    } suma {
        uray("Eres menor de edad");
    }
}
```

---

### 4.7 Ciclos

**Ciclo `huxiuy` (while):**
```
huxiuy (<condición>) {
    ## instrucciones
}
```

**Ejemplo:**
```
milpa {
    naxuxi i = 0;
    huxiuy (i < 5) {
        uray(i);
        i += 1;
    }
}
```

**Ciclo `tahma` (for):**
```
tahma (<inicio>; <condición>; <incremento>) {
    ## instrucciones
}
```

**Ejemplo:**
```
milpa {
    tahma (naxuxi i = 0; i < 10; i += 1) {
        uray(i);
    }
}
```

---

### 4.8 Funciones

Las funciones se definen con `pula` y retornan valores con `nuka`. Si no retornan nada, se omite `nuka`.

**Sintaxis:**
```
pula <nombre>(<parámetros>) {
    ## instrucciones
    nuka <valor>;
}
```

**Ejemplo con retorno:**
```
pula sumar(a, b) {
    nuka a + b;
}

milpa {
    naxuxi resultado = sumar(10, 5);
    uray(resultado);
}
```

**Ejemplo sin retorno:**
```
pula saludar(nombre) {
    uray("Buenos días, " + nombre);
}

milpa {
    saludar("Maria");
}
```

---

### 4.9 Entrada y salida

**Salida — `uray`:**
```
uray(<expresión>);
uray("Hola mundo");
uray(edad);
uray("Tu edad es: " + edad);
```

**Entrada — `ixka`:**
```
naxuxi nombre = ixka("¿Cuál es tu nombre? ");
naxuxi edad   = ixka("¿Cuántos años tienes? ");
```

---

### 4.10 Comentarios

```
## Esto es un comentario de una línea

#*
   Esto es un comentario
   de múltiples líneas
*#
```

---

## 5. Ejemplo completo de programa Naxuxi

El siguiente programa calcula el área de una milpa (campo rectangular) y determina si es suficiente para una siembra:

```
#*
    Programa: Calculadora de milpa
    Lenguaje: Naxuxi
    Descripción: Calcula el área de un terreno y evalúa
                 si es apto para siembra de maíz.
*#

pula calcularArea(largo, ancho) {
    nuka largo * ancho;
}

milpa {
    naxuxi largo = ixka("Ingresa el largo de tu milpa (metros): ");
    naxuxi ancho = ixka("Ingresa el ancho de tu milpa (metros): ");

    naxuxi area = calcularArea(largo, ancho);

    uray("El área de tu milpa es: " + area + " m²");

    kunu (area >= 500) {
        uray("Tu milpa es apta para siembra de maíz.");
    } suma {
        uray("Tu milpa es pequeña. Considera ampliarla.");
    }
}
```

---

## 6. Resumen de la sintaxis formal

| Estructura | Forma |
|---|---|
| Programa | `milpa { ... }` |
| Declaración | `naxuxi <id> = <valor>;` |
| Condicional | `kunu (<cond>) { ... } suma { ... }` |
| Ciclo while | `huxiuy (<cond>) { ... }` |
| Ciclo for | `tahma (<ini>; <cond>; <inc>) { ... }` |
| Función | `pula <nombre>(<params>) { ... }` |
| Retorno | `nuka <valor>;` |
| Salida | `uray(<expresión>);` |
| Entrada | `ixka(<mensaje>)` |
| Comentario línea | `## texto` |
| Comentario bloque | `#* texto *#` |

---

# Fase 2 — Herramientas Utilizadas

## 7. Lenguaje y herramientas del compilador

### 7.1 Lenguaje de implementación

El compilador de Naxuxi está implementado en **JavaScript puro (ES6+)**, sin librerías externas para el análisis léxico ni sintáctico. Esta decisión se tomó por las siguientes razones:

- **Portabilidad:** El mismo código del compilador funciona tanto en el navegador (interfaz web) como en Node.js (CLI), sin modificaciones.
- **Transparencia académica:** Al no usar generadores automáticos como PLY, ANTLR o Flex/Bison, cada componente del compilador fue diseñado e implementado manualmente, permitiendo comprender y explicar su funcionamiento en profundidad.
- **Sin dependencias:** El módulo `compiler/` no requiere instalación de paquetes adicionales.

### 7.2 Herramientas principales

| Herramienta | Versión | Rol en el proyecto |
|---|---|---|
| **Node.js** | 20+ | Runtime para ejecución CLI y servidor de desarrollo |
| **React** | 19 | Biblioteca para construir la interfaz web del compilador |
| **Vite** | 5 | Bundler y servidor de desarrollo para el frontend |
| **Tailwind CSS** | 4 | Framework de estilos utilitarios con variables CSS nativas |
| **CodeMirror** | 6 | Editor de código con resaltado de sintaxis personalizado para Naxuxi |

### 7.3 Herramientas de desarrollo

| Herramienta | Uso |
|---|---|
| **Visual Studio Code** | Editor principal de código fuente |
| **Claude Code** | Asistente de desarrollo con IA integrado al flujo de trabajo |
| **GitHub** | Control de versiones y respaldo del proyecto |

### 7.4 Modos de ejecución

El proyecto soporta dos modos de uso con el mismo compilador subyacente:

**Modo web — interfaz gráfica:**
```bash
npm run dev
# Disponible en http://localhost:5173
```

**Modo CLI — terminal:**
```bash
node cli.js programa.nax
```

### 7.5 Estructura del proyecto

```
naxuxi/
├── compiler/
│   ├── lexer.js         ← Analizador léxico (JavaScript puro)
│   └── parser.js        ← Analizador sintáctico (JavaScript puro)
├── src/
│   ├── App.jsx          ← Componente principal de la interfaz
│   ├── components/
│   │   ├── Editor.jsx       ← Editor de código .nax con CodeMirror
│   │   ├── TokenTable.jsx   ← Visualización de tokens reconocidos
│   │   ├── SymbolTable.jsx  ← Tabla de símbolos
│   │   └── ErrorTable.jsx   ← Tabla de errores léxicos y sintácticos
│   └── main.jsx
├── cli.js               ← Entrada por terminal
├── package.json
└── vite.config.js
```

---

# Fase 3 — Análisis Léxico

El análisis léxico es la primera etapa del compilador. Su función es leer el código fuente carácter por carácter y agruparlos en unidades significativas llamadas **tokens**. El lexer de Naxuxi reconoce 9 categorías de tokens, construye la tabla de símbolos e identifica y reporta errores léxicos. Los comentarios se reconocen y se descartan — no generan token.

---

## 7.5 Decisiones de implementación — `compiler/lexer.js`

### Compatibilidad de módulos

El proyecto Naxuxi usa `"type": "module"` en su `package.json` raíz (necesario para Vite/React). El directorio `compiler/` contiene su propio `compiler/package.json` con `"type": "commonjs"`, de modo que `lexer.js` y `parser.js` pueden usar `require` / `module.exports`. Vite transforma automáticamente estos módulos CJS a ESM en el bundle del navegador.

### Algoritmo de escaneo

El lexer implementa un **escaneo lineal de un solo paso** (`pos` avanza de 0 a `longitud-1`) sin retroceso (*backtracking*). En cada iteración se toma el substring restante `codigoFuente.slice(pos)` y se intenta aplicar cada patrón en orden de prioridad. El primer patrón que coincide consume los caracteres correspondientes.

### Seguimiento de posición

- `linea` y `columna` se actualizan carácter a carácter.
- Tabulaciones y espacios cuentan como **1 columna** cada uno.
- Los saltos de línea `\n` incrementan `linea` y reinician `columna = 1`.
- Dentro de comentarios de bloque (`#* ... *#`), los saltos de línea se contabilizan correctamente mediante la función auxiliar `avanzarTexto`.

### Máquina de estados para la tabla de símbolos

El lexer procesa tokens uno por uno, de izquierda a derecha, sin leer hacia adelante. Para poder registrar una variable en la tabla de símbolos necesita reconocer el patrón completo:

```
naxuxi  edad  =  25  ;
```

Como no puede "leer la frase completa" de una sola vez, usa una variable `estado` que recuerda en qué parte del patrón se encuentra en cada momento:

```
Estado 0  →  ve 'naxuxi'  →  Estado 1   ("acabo de ver naxuxi")
Estado 1  →  ve 'edad'    →  Estado 2   ("acabo de ver el nombre de la variable")
Estado 2  →  ve '='       →  Estado 3   ("ya sé el nombre, ahora viene el valor")
Estado 3  →  ve '25'      →  agrega a tabla de símbolos, vuelve a Estado 0
```

Esto se traduce directamente al código dentro de la función `emitirToken`:

```javascript
if (tipo === TOKEN_TYPES.RESERVADA && lexema === 'naxuxi') {
    estado = 1;
} else if (estado === 1 && tipo === TOKEN_TYPES.IDENTIFICADOR) {
    varNombre = lexema;   // guarda el nombre de la variable
    estado = 2;
} else if (estado === 2 && tipo === TOKEN_TYPES.OP_ASIGNACION && lexema === '=') {
    estado = 3;
} else if (estado === 3) {
    simbolos.push({ identificador: varNombre, tipo: inferirTipo(lexema), valor: lexema, ... });
    estado = 0;
}
```

El nombre formal de esta técnica es **autómata finito determinista (AFD)** o **máquina de estados finitos**: un sistema con un conjunto de estados posibles y reglas de transición que determinan cómo pasar de un estado al siguiente según el símbolo de entrada. Es el mismo concepto que se usa en teoría de autómatas, aplicado aquí para rastrear contexto durante el escaneo.

La tabla de transiciones completa es:

| Estado | Condición de transición | Acción |
|---|---|---|
| `0` — ninguno | Al emitir `RESERVADA 'naxuxi'` | → Estado 1 |
| `1` — tras `naxuxi` | Al emitir `IDENTIFICADOR` | Guarda nombre/línea/col → Estado 2 |
| `1` — tras `naxuxi` | Al ver una `RESERVADA` | Registra `ERR-L06` → Estado 0 |
| `2` — tras `naxuxi <id>` | Al emitir `OP_ASIGNACION '='` | → Estado 3 |
| `3` — tras `naxuxi <id> =` | Al emitir cualquier token de valor | Agrega a tabla de símbolos → Estado 0 |

Cualquier error léxico reinicia el estado a `0` para evitar registros parciales en la tabla de símbolos.

### Detección de `ERR-L04` (número malformado)

El patrón `/^[0-9]+\.(?![0-9])/` (lookahead negativo) se evalúa **antes** que los patrones de decimal y entero. Captura casos como `3.` seguido de cualquier carácter que no sea dígito (espacio, punto y coma, fin de archivo, etc.).

### Detección de `ERR-L05` (identificador inválido)

El patrón `/^[0-9]+[a-zA-Z_][a-zA-Z0-9_]*/` se evalúa **antes** que el entero puro, para que `1edad` se reporte completo como identificador inválido en lugar de tokenizarse como `1` + `edad`.

### Interfaz pública

```javascript
const { analizar, TOKEN_TYPES, PALABRAS_RESERVADAS } = require('./compiler/lexer');

const resultado = analizar(codigoFuente);
// resultado.tokens   → Array de tokens
// resultado.simbolos → Tabla de símbolos
// resultado.errores  → Errores léxicos
```

---

## 8. Categorías de Tokens

| Categoría | Descripción | Ejemplos |
|---|---|---|
| `RESERVADA` | Palabra reservada del lenguaje | `milpa`, `naxuxi`, `pula`, `kunu` |
| `IDENTIFICADOR` | Nombre de variable o función definido por el usuario | `edad`, `precio`, `calcularArea` |
| `ENTERO` | Número entero sin punto decimal | `0`, `25`, `100` |
| `DECIMAL` | Número con punto decimal | `3.14`, `12.50`, `0.5` |
| `CADENA` | Texto entre comillas dobles | `"Hola"`, `"Ralh na pari"` |
| `OP_ARITMETICO` | Operador aritmético | `+`, `-`, `*`, `/`, `%` |
| `OP_COMPARACION` | Operador de comparación | `==`, `!=`, `>`, `<`, `>=`, `<=` |
| `OP_ASIGNACION` | Asignación simple o compuesta | `=`, `+=`, `-=` |
| `DELIMITADOR` | Símbolo estructural | `{`, `}`, `(`, `)`, `;`, `,` |

> Los valores booleanos `hixi` y `kahl` forman parte de las palabras reservadas y se clasifican como `RESERVADA`, no como una categoría separada.

---

## 9. Expresiones Regulares

Las siguientes expresiones regulares definen cada token. Están escritas en notación compatible con el motor de JavaScript (`RegExp`). El orden de evaluación es crítico y se detalla en la sección 11.

### 9.1 Comentarios — descartados

Se reconocen y se descartan sin generar token. Se procesan primero para evitar que `#` se interprete como carácter inválido.

```
COMENTARIO_BLOQUE = /^#\*[\s\S]*?\*#/
COMENTARIO_LINEA  = /^##[^\n]*/
```

### 9.2 Espacios en blanco — descartados

Se descartan pero se usan para actualizar el contador de línea y columna.

```
ESPACIOS    = /^[ \t\r]+/
NUEVA_LINEA = /^\n/
```

### 9.3 Cadenas de texto

Cualquier secuencia de caracteres entre comillas dobles. No se permiten saltos de línea dentro de la cadena.

```
CADENA = /^"[^"\n]*"/
```

Válidos: `"Hola"`, `"Ralh na pari"`, `""`  
Inválidos: `"sin cerrar`, `'comilla simple'`

### 9.4 Números

El decimal se evalúa **antes** que el entero para evitar que `3.14` se tokenice como `3` + `.` + `14`.

```
DECIMAL = /^[0-9]+\.[0-9]+/
ENTERO  = /^[0-9]+/
```

Válidos: `25`, `0`, `3.14`, `100.0`  
Inválidos: `3.`, `.5`, `3.4.5`

### 9.5 Identificadores y palabras reservadas

El lexer lee el lexema completo con esta regex y luego verifica si está en la lista de palabras reservadas. Si coincide → `RESERVADA`. Si no → `IDENTIFICADOR`.

```
IDENTIFICADOR = /^[a-zA-Z_][a-zA-Z0-9_]*/

PALABRAS_RESERVADAS = [
  "milpa", "naxuxi", "pula", "nuka", "ixka", "uray",
  "kunu", "suma", "huxiuy", "tahma", "kiwi", "woona",
  "hixi", "kahl", "tiwix", "naru", "pari", "ixmi"
]
```

Válidos: `edad`, `_contador`, `calcularArea`, `precio_total`  
Inválidos: `1edad`, `precio-total`, `@nombre`

### 9.6 Operadores

Los operadores dobles se evalúan **antes** que los simples para evitar que `==` se tokenice como dos `=`.

```
OP_COMPARACION_DOBLE = /^(==|!=|>=|<=)/
OP_ASIGNACION_COMP   = /^(\+=|-=)/
OP_COMPARACION_SIMPLE = /^[><]/
OP_ARITMETICO        = /^[+\-*\/%]/
OP_ASIGNACION        = /^=/
```

### 9.7 Delimitadores

```
DELIMITADOR = /^[{}();,]/
```

---

## 10. Orden de Evaluación del Lexer

El lexer intenta reconocer cada token en este orden exacto. Si ningún patrón coincide, se registra un error léxico y se avanza un carácter.

| Prioridad | Token | Justificación del orden |
|---|---|---|
| 1 | Espacios y saltos de línea | Descartar antes de analizar |
| 2 | Comentario de bloque `#* *#` | Antes que comentario de línea |
| 3 | Comentario de línea `##` | Ambos se descartan |
| 4 | Cadena `"..."` | Independiente, sin conflicto |
| 5 | Decimal `9.9` | Antes que entero |
| 6 | Entero `9` | Después de decimal |
| 7 | Identificador / Reservada | Se clasifica después de leer |
| 8 | Operador de comparación doble `==` `!=` `>=` `<=` | Antes que simple |
| 9 | Asignación compuesta `+=` `-=` | Antes que `=` simple |
| 10 | Operador de comparación simple `>` `<` | Después de dobles |
| 11 | Operador aritmético `+` `-` `*` `/` `%` | Después de `+=` `-=` |
| 12 | Asignación simple `=` | Al final de operadores |
| 13 | Delimitador `{ } ( ) ; ,` | Al final |
| ❌ | Error léxico | Carácter no reconocido |

---

## 11. Tabla de Tokens — Ejemplo de análisis

Programa de entrada:

```
milpa {
    naxuxi edad = 25;
    kunu (edad >= 18) {
        uray("Mayor de edad");
    }
}
```

Tokens generados:

| # | Lexema | Categoría | Línea | Columna |
|---|---|---|---|---|
| 1 | `milpa` | RESERVADA | 1 | 1 |
| 2 | `{` | DELIMITADOR | 1 | 7 |
| 3 | `naxuxi` | RESERVADA | 2 | 5 |
| 4 | `edad` | IDENTIFICADOR | 2 | 13 |
| 5 | `=` | OP_ASIGNACION | 2 | 18 |
| 6 | `25` | ENTERO | 2 | 20 |
| 7 | `;` | DELIMITADOR | 2 | 22 |
| 8 | `kunu` | RESERVADA | 3 | 5 |
| 9 | `(` | DELIMITADOR | 3 | 10 |
| 10 | `edad` | IDENTIFICADOR | 3 | 11 |
| 11 | `>=` | OP_COMPARACION | 3 | 16 |
| 12 | `18` | ENTERO | 3 | 19 |
| 13 | `)` | DELIMITADOR | 3 | 21 |
| 14 | `{` | DELIMITADOR | 3 | 23 |
| 15 | `uray` | RESERVADA | 4 | 9 |
| 16 | `(` | DELIMITADOR | 4 | 13 |
| 17 | `"Mayor de edad"` | CADENA | 4 | 14 |
| 18 | `)` | DELIMITADOR | 4 | 29 |
| 19 | `;` | DELIMITADOR | 4 | 30 |
| 20 | `}` | DELIMITADOR | 5 | 5 |
| 21 | `}` | DELIMITADOR | 6 | 1 |

---

## 12. Tabla de Símbolos

La tabla de símbolos registra todos los identificadores declarados con `naxuxi`. Se construye de forma incremental durante el análisis léxico. El tipo se infiere del valor asignado.

### Estructura

| Campo | Tipo | Descripción |
|---|---|---|
| `identificador` | string | Nombre de la variable |
| `tipo` | string | Tipo inferido: `entero`, `decimal`, `cadena`, `booleano` |
| `valor` | any | Valor asignado en la declaración |
| `linea` | number | Línea donde fue declarada |
| `columna` | number | Columna donde fue declarada |

### Reglas de inferencia de tipos

| Patrón del valor | Tipo inferido |
|---|---|
| Coincide con `/^[0-9]+$/` | `entero` |
| Coincide con `/^[0-9]+\.[0-9]+$/` | `decimal` |
| Comienza y termina con `"` | `cadena` |
| Es `hixi` o `kahl` | `booleano` |

### Ejemplo

Programa de entrada:
```
milpa {
    naxuxi edad = 25;
    naxuxi precio = 12.50;
    naxuxi nombre = "Maria";
    naxuxi activo = hixi;
}
```

Tabla de símbolos resultante:

| Identificador | Tipo | Valor | Línea | Columna |
|---|---|---|---|---|
| `edad` | entero | `25` | 2 | 13 |
| `precio` | decimal | `12.50` | 3 | 13 |
| `nombre` | cadena | `"Maria"` | 4 | 13 |
| `activo` | booleano | `hixi` | 5 | 13 |

---

## 13. Errores Léxicos

El lexer **no se detiene** al encontrar un error — continúa el análisis y acumula todos los errores para reportarlos al final junto con los tokens válidos.

### Tipos de errores

| Código | Tipo | Descripción | Ejemplo |
|---|---|---|---|
| `ERR-L01` | Carácter no permitido | Símbolo fuera del alfabeto de Naxuxi | `naxuxi precio = 25@;` |
| `ERR-L02` | Cadena no cerrada | Comilla de apertura sin cierre en la misma línea | `naxuxi x = "hola;` |
| `ERR-L03` | Comentario de bloque no cerrado | `#*` sin su `*#` de cierre | `#* sin cerrar` |
| `ERR-L04` | Número malformado | Número con formato inválido | `naxuxi x = 3.;` |
| `ERR-L05` | Identificador inválido | Identificador que comienza con dígito | `naxuxi 1edad = 10;` |
| `ERR-L06` | Palabra reservada como identificador | Se usa una reservada como nombre de variable | `naxuxi milpa = 10;` |

### Estructura de cada error

| Campo | Tipo | Descripción |
|---|---|---|
| `codigo` | string | Código del error (`ERR-L01` ... `ERR-L06`) |
| `tipo` | string | Nombre descriptivo del error |
| `lexema` | string | El carácter o texto que causó el error |
| `linea` | number | Línea donde ocurrió |
| `columna` | number | Columna donde ocurrió |
| `descripcion` | string | Mensaje legible explicando la causa |

### Ejemplo — tabla de errores

Programa con errores intencionales:
```
milpa {
    naxuxi @precio = 25;
    naxuxi nombre = "Maria;
    naxuxi 1edad = 10;
    naxuxi valor = 3.;
    naxuxi milpa = 5;
}
```

| # | Código | Tipo | Lexema | Línea | Columna | Descripción |
|---|---|---|---|---|---|---|
| 1 | `ERR-L01` | Carácter no permitido | `@` | 2 | 12 | El símbolo `@` no pertenece al alfabeto de Naxuxi |
| 2 | `ERR-L02` | Cadena no cerrada | `"Maria;` | 3 | 20 | La cadena abre con `"` pero no tiene cierre en la línea |
| 3 | `ERR-L05` | Identificador inválido | `1edad` | 4 | 12 | Un identificador no puede comenzar con un dígito |
| 4 | `ERR-L04` | Número malformado | `3.` | 5 | 20 | Un decimal requiere dígitos después del punto |
| 5 | `ERR-L06` | Palabra reservada como identificador | `milpa` | 6 | 12 | `milpa` es una palabra reservada y no puede usarse como variable |

---

## 14. Flujo del Análisis Léxico

```
INICIO
  │
  ▼
Recibir código fuente como string
Inicializar: posición=0, línea=1, columna=1
tokens=[], símbolos=[], errores=[]
  │
  ▼
┌─────────────────────────────────┐
│  ¿posición < longitud código?   │──No──▶ FIN → retornar tokens, símbolos, errores
└─────────────────────────────────┘
  │ Sí
  ▼
¿Es espacio/tab/retorno?  ──Sí──▶ Actualizar columna → continuar
  │ No
  ▼
¿Es salto de línea?  ──Sí──▶ línea++, columna=1 → continuar
  │ No
  ▼
¿Coincide comentario bloque o línea?  ──Sí──▶ Descartar → continuar
  │ No
  ▼
¿Coincide cadena?  ──Sí──▶ Agregar token CADENA → continuar
  │ No                ──No cerrada──▶ Registrar ERR-L02
  ▼
¿Coincide decimal?  ──Sí──▶ Agregar token DECIMAL → continuar
  │ No
  ▼
¿Coincide entero?  ──Sí──▶ Agregar token ENTERO → continuar
  │ No
  ▼
¿Coincide identificador?
  │ Sí
  ├──▶ ¿Está en palabras reservadas?
  │       │ Sí → Agregar token RESERVADA
  │       │ No → Agregar token IDENTIFICADOR
  │              Si viene después de naxuxi → agregar a tabla de símbolos
  │ No
  ▼
¿Coincide operador doble?  ──Sí──▶ Agregar token OP_COMPARACION / OP_ASIGNACION → continuar
  │ No
  ▼
¿Coincide operador simple?  ──Sí──▶ Agregar token OP_ARITMETICO / OP_COMPARACION → continuar
  │ No
  ▼
¿Coincide asignación =?  ──Sí──▶ Agregar token OP_ASIGNACION → continuar
  │ No
  ▼
¿Coincide delimitador?  ──Sí──▶ Agregar token DELIMITADOR → continuar
  │ No
  ▼
Ningún patrón coincide → Registrar ERR-L01 → avanzar un carácter → continuar
```

---

---

# Fase 4 — Análisis Sintáctico

El análisis sintáctico es la segunda etapa del compilador. Recibe la lista de tokens producida por el lexer y verifica que estén organizados correctamente según las reglas gramaticales del lenguaje. El parser de Naxuxi implementa un **analizador de descenso recursivo**, donde cada no terminal del BNF corresponde a una función del código.

---

## 14.5 Decisiones de implementación — `compiler/parser.js`

### Técnica: Descenso Recursivo

El parser implementa un **analizador de descenso recursivo predictivo** (*recursive descent parser*). Cada regla BNF del lenguaje corresponde a una función de JavaScript con el mismo nombre. Para elegir qué regla aplicar, el parser examina el token actual (`tokens[pos]`) sin consumirlo — esta es la técnica de *lookahead de 1 token*.

```javascript
function parseSentencia() {
  if (esLexema('naxuxi'))   return parseDeclaracion()
  if (esLexema('kunu'))     return parseCondicional()
  if (esLexema('huxiuy'))   return parseCicloWhile()
  if (esLexema('tahma'))    return parseCicloFor()
  if (esLexema('pula'))     return parseDefinicionFuncion()
  if (esLexema('nuka'))     return parseRetorno()
  if (esLexema('uray'))     return parseSalida()
  if (esTipo('IDENTIFICADOR')) return parseAsignacion()
  // ... recuperación de error
}
```

### Extensión del BNF: funciones antes de `milpa`

El BNF original define `<programa> ::= "milpa" <bloque>`. Sin embargo, el lenguaje Naxuxi permite (y el ejemplo canónico usa) definir funciones con `pula` **antes** del bloque `milpa`. El parser extiende esta regla implícitamente:

```
<programa_real> ::= { <definicion_funcion> } "milpa" <bloque>
```

Esto se implementa con un ciclo antes de consumir `milpa`:

```javascript
function parsePrograma() {
  const hijos = []
  // Recolectar definiciones de funciones globales antes de milpa
  while (!fin() && esLexema('pula')) {
    hijos.push(parseDefinicionFuncion())
  }
  // Ahora exigir milpa
  hijos.push(consumir('milpa', 'ERR-S05'))
  hijos.push(parseBloque())
  return nodoNT('<programa>', hijos)
}
```

### Construcción del árbol de derivación

Cada función del parser retorna un **nodo** del árbol de derivación. Hay dos tipos de nodos:

```javascript
// Nodo no terminal (regla BNF)
function nodoNT(nombre, hijos) {
  return { tipo: 'no-terminal', nombre, hijos }
}

// Nodo terminal (token consumido)
function nodoT(lexema) {
  return { tipo: 'terminal', nombre: `"${lexema}"`, hijos: [] }
}
```

El árbol se construye de manera natural con la recursividad: cada llamada a una función de parse retorna un nodo, y ese nodo se agrega como hijo del nodo padre. El árbol completo queda disponible en `resultado.arbol` y es directamente consumido por el componente `DerivationTree.jsx`.

### Eliminación de recursión por la izquierda en expresiones

El BNF de expresiones usa recursión por la izquierda:
```
<expresion_aritmetica> ::= <expresion_aritmetica> "+" <termino>
```

Un parser de descenso recursivo no puede implementar esto directamente — causaría recursión infinita. La solución clásica es transformarla en iteración:

```javascript
function parseExpArit() {
  let nodo = parseTermino()               // primer factor
  while (esAritBinario()) {               // mientras haya + o -
    const op   = nodoT(actual().lexema)
    avanzar()
    const der  = parseTermino()
    nodo = nodoNT('<expresion_aritmetica>', [nodo, op, der])
  }
  return nodo
}
```

Este patrón `izquierda = izquierda OP derecha` se aplica en los tres niveles de precedencia: lógico (`kiwi`, `woona`), comparación (`==`, `!=`, `>`, etc.) y aritmético (`+`, `-`, `*`, `/`, `%`).

### Recuperación de errores (modo pánico)

Cuando el parser encuentra un error, no se detiene. Registra el error y llama a `sincronizar()`, que avanza los tokens hasta encontrar un punto de recuperación seguro (generalmente `;` o `}`):

```javascript
function sincronizar(...sincTokens) {
  while (!fin()) {
    if (sincTokens.includes(actual().lexema)) return
    avanzar()
  }
}
```

En `parseListaSentencias` se añade una salvaguarda adicional contra bucles infinitos: si después de intentar parsear una sentencia la posición no avanzó, se fuerza un `sincronizar` y un avance explícito:

```javascript
function parseListaSentencias() {
  const stmts = []
  while (!fin() && !esLexema('}')) {
    const posAntes = pos
    stmts.push(parseSentencia())
    if (pos === posAntes) {          // no avanzó → forzar avance
      sincronizar(';', '}')
      if (!fin() && esLexema(';')) avanzar()
    }
  }
  return stmts
}
```

### Interfaz pública

```javascript
const { parsear, ERRORES_SINTACTICOS } = require('./compiler/parser');

const resultado = parsear(tokens);
// resultado.valido   → boolean (true si errores.length === 0)
// resultado.arbol    → nodo raíz del árbol de derivación
// resultado.errores  → Array de errores sintácticos
```

---

## 15. BNF del Lenguaje Naxuxi

### 15.1 Símbolos básicos

```bnf
<letra> ::= "a"|"b"|"c"|"d"|"e"|"f"|"g"|"h"|"i"|"j"|"k"|"l"|"m"|
            "n"|"o"|"p"|"q"|"r"|"s"|"t"|"u"|"v"|"w"|"x"|"y"|"z"|
            "A"|"B"|"C"|"D"|"E"|"F"|"G"|"H"|"I"|"J"|"K"|"L"|"M"|
            "N"|"O"|"P"|"Q"|"R"|"S"|"T"|"U"|"V"|"W"|"X"|"Y"|"Z"

<digito> ::= "0"|"1"|"2"|"3"|"4"|"5"|"6"|"7"|"8"|"9"

<identificador> ::= ( <letra> | "_" ) { <letra> | <digito> | "_" }

<entero> ::= <digito> { <digito> }

<decimal> ::= <digito> { <digito> } "." <digito> { <digito> }

<cadena> ::= '"' { <letra> | <digito> | " " } '"'

<booleano> ::= "hixi" | "kahl"
```

### 15.2 Estructura del programa

```bnf
<programa> ::= "milpa" <bloque>

<bloque> ::= "{" <lista_sentencias> "}"

<lista_sentencias> ::= { <sentencia> }

<sentencia> ::= <declaracion>
              | <asignacion>
              | <condicional>
              | <ciclo_while>
              | <ciclo_for>
              | <definicion_funcion>
              | <retorno>
              | <salida>
              | <llamada_funcion> ";"
```

### 15.3 Declaraciones y asignaciones

```bnf
<declaracion> ::= "naxuxi" <identificador> "=" <expresion> ";"

<asignacion> ::= <identificador> "=" <expresion> ";"
               | <identificador> "+=" <expresion> ";"
               | <identificador> "-=" <expresion> ";"
```

### 15.4 Condicionales

```bnf
<condicional> ::= "kunu" "(" <expresion> ")" <bloque>
               | "kunu" "(" <expresion> ")" <bloque> "suma" <bloque>
```

### 15.5 Ciclos

```bnf
<ciclo_while> ::= "huxiuy" "(" <expresion> ")" <bloque>

<ciclo_for> ::= "tahma" "(" <inicio_for> ";" <expresion> ";" <actualizacion_for> ")" <bloque>

<inicio_for> ::= "naxuxi" <identificador> "=" <expresion>
               | <identificador> "=" <expresion>

<actualizacion_for> ::= <identificador> "+=" <expresion>
                      | <identificador> "-=" <expresion>
                      | <identificador> "=" <expresion>
```

### 15.6 Funciones

```bnf
<definicion_funcion> ::= "pula" <identificador> "(" [ <lista_parametros> ] ")" <bloque>

<lista_parametros> ::= <identificador> { "," <identificador> }

<llamada_funcion> ::= <identificador> "(" [ <lista_argumentos> ] ")"

<lista_argumentos> ::= <expresion> { "," <expresion> }

<retorno> ::= "nuka" <expresion> ";"
```

### 15.7 Entrada y salida

```bnf
<salida> ::= "uray" "(" <expresion> ")" ";"

<entrada> ::= "ixka" "(" <cadena> ")"
```

### 15.8 Expresiones

```bnf
<expresion> ::= <expresion_logica>

<expresion_logica> ::= <expresion_comparacion>
                     | <expresion_logica> "kiwi" <expresion_comparacion>
                     | <expresion_logica> "woona" <expresion_comparacion>

<expresion_comparacion> ::= <expresion_aritmetica>
                          | <expresion_comparacion> "==" <expresion_aritmetica>
                          | <expresion_comparacion> "!=" <expresion_aritmetica>
                          | <expresion_comparacion> ">"  <expresion_aritmetica>
                          | <expresion_comparacion> "<"  <expresion_aritmetica>
                          | <expresion_comparacion> ">=" <expresion_aritmetica>
                          | <expresion_comparacion> "<=" <expresion_aritmetica>

<expresion_aritmetica> ::= <termino>
                         | <expresion_aritmetica> "+" <termino>
                         | <expresion_aritmetica> "-" <termino>

<termino> ::= <factor>
            | <termino> "*" <factor>
            | <termino> "/" <factor>
            | <termino> "%" <factor>

<factor> ::= "(" <expresion> ")"
           | <valor>
           | <llamada_funcion>

<valor> ::= <identificador>
          | <entero>
          | <decimal>
          | <cadena>
          | <booleano>
          | <entrada>
```

---

## 16. Cinco entradas válidas con tokens y árbol de derivación

### 16.1 Entrada 1 — Declaración de variable

**Programa:**
```
milpa {
    naxuxi edad = 25;
}
```

**Tokens:**

| # | Lexema | Categoría | Línea | Columna |
|---|---|---|---|---|
| 1 | `milpa` | RESERVADA | 1 | 1 |
| 2 | `{` | DELIMITADOR | 1 | 7 |
| 3 | `naxuxi` | RESERVADA | 2 | 5 |
| 4 | `edad` | IDENTIFICADOR | 2 | 13 |
| 5 | `=` | OP_ASIGNACION | 2 | 18 |
| 6 | `25` | ENTERO | 2 | 20 |
| 7 | `;` | DELIMITADOR | 2 | 22 |
| 8 | `}` | DELIMITADOR | 3 | 1 |

**Derivación:**
```
<programa>
→ "milpa" <bloque>
→ "milpa" "{" <lista_sentencias> "}"
→ "milpa" "{" <sentencia> "}"
→ "milpa" "{" <declaracion> "}"
→ "milpa" "{" "naxuxi" <identificador> "=" <expresion> ";" "}"
→ "milpa" "{" "naxuxi" "edad" "=" <expresion_logica> ";" "}"
→ "milpa" "{" "naxuxi" "edad" "=" <expresion_comparacion> ";" "}"
→ "milpa" "{" "naxuxi" "edad" "=" <expresion_aritmetica> ";" "}"
→ "milpa" "{" "naxuxi" "edad" "=" <termino> ";" "}"
→ "milpa" "{" "naxuxi" "edad" "=" <factor> ";" "}"
→ "milpa" "{" "naxuxi" "edad" "=" <valor> ";" "}"
→ "milpa" "{" "naxuxi" "edad" "=" <entero> ";" "}"
→ "milpa" "{" "naxuxi" "edad" "=" "25" ";" "}"
```

> *Árbol de derivación: ver diagrama Árbol 1 en el apartado de visualizaciones.*

---

### 16.2 Entrada 2 — Condicional kunu/suma

**Programa:**
```
milpa {
    kunu (edad >= 18) {
        uray("Mayor");
    } suma {
        uray("Menor");
    }
}
```

**Tokens:**

| # | Lexema | Categoría | Línea | Columna |
|---|---|---|---|---|
| 1 | `milpa` | RESERVADA | 1 | 1 |
| 2 | `{` | DELIMITADOR | 1 | 7 |
| 3 | `kunu` | RESERVADA | 2 | 5 |
| 4 | `(` | DELIMITADOR | 2 | 10 |
| 5 | `edad` | IDENTIFICADOR | 2 | 11 |
| 6 | `>=` | OP_COMPARACION | 2 | 16 |
| 7 | `18` | ENTERO | 2 | 19 |
| 8 | `)` | DELIMITADOR | 2 | 21 |
| 9 | `{` | DELIMITADOR | 2 | 23 |
| 10 | `uray` | RESERVADA | 3 | 9 |
| 11 | `(` | DELIMITADOR | 3 | 13 |
| 12 | `"Mayor"` | CADENA | 3 | 14 |
| 13 | `)` | DELIMITADOR | 3 | 21 |
| 14 | `;` | DELIMITADOR | 3 | 22 |
| 15 | `}` | DELIMITADOR | 4 | 5 |
| 16 | `suma` | RESERVADA | 4 | 7 |
| 17 | `{` | DELIMITADOR | 4 | 12 |
| 18 | `uray` | RESERVADA | 5 | 9 |
| 19 | `(` | DELIMITADOR | 5 | 13 |
| 20 | `"Menor"` | CADENA | 5 | 14 |
| 21 | `)` | DELIMITADOR | 5 | 21 |
| 22 | `;` | DELIMITADOR | 5 | 22 |
| 23 | `}` | DELIMITADOR | 6 | 5 |
| 24 | `}` | DELIMITADOR | 7 | 1 |

**Derivación:**
```
<programa>
→ "milpa" <bloque>
→ "milpa" "{" <lista_sentencias> "}"
→ "milpa" "{" <sentencia> "}"
→ "milpa" "{" <condicional> "}"
→ "milpa" "{" "kunu" "(" <expresion> ")" <bloque> "suma" <bloque> "}"
→ "milpa" "{" "kunu" "(" <expresion_comparacion> ")" <bloque> "suma" <bloque> "}"
→ "milpa" "{" "kunu" "(" <expresion_aritmetica> ">=" <expresion_aritmetica> ")" <bloque> "suma" <bloque> "}"
→ "milpa" "{" "kunu" "(" <valor> ">=" <valor> ")" <bloque> "suma" <bloque> "}"
→ "milpa" "{" "kunu" "(" "edad" ">=" "18" ")" "{" <salida> "}" "suma" "{" <salida> "}" "}"
→ "milpa" "{" "kunu" "(" "edad" ">=" "18" ")" "{" "uray" "(" "Mayor" ")" ";" "}" "suma" "{" "uray" "(" "Menor" ")" ";" "}" "}"
```

> *Árbol de derivación: ver diagrama Árbol 2 (Parte A y Parte B) en el apartado de visualizaciones.*

---

### 16.3 Entrada 3 — Ciclo while huxiuy

**Programa:**
```
milpa {
    huxiuy (i < 5) {
        uray(i);
    }
}
```

**Tokens:**

| # | Lexema | Categoría | Línea | Columna |
|---|---|---|---|---|
| 1 | `milpa` | RESERVADA | 1 | 1 |
| 2 | `{` | DELIMITADOR | 1 | 7 |
| 3 | `huxiuy` | RESERVADA | 2 | 5 |
| 4 | `(` | DELIMITADOR | 2 | 12 |
| 5 | `i` | IDENTIFICADOR | 2 | 13 |
| 6 | `<` | OP_COMPARACION | 2 | 15 |
| 7 | `5` | ENTERO | 2 | 17 |
| 8 | `)` | DELIMITADOR | 2 | 18 |
| 9 | `{` | DELIMITADOR | 2 | 20 |
| 10 | `uray` | RESERVADA | 3 | 9 |
| 11 | `(` | DELIMITADOR | 3 | 13 |
| 12 | `i` | IDENTIFICADOR | 3 | 14 |
| 13 | `)` | DELIMITADOR | 3 | 15 |
| 14 | `;` | DELIMITADOR | 3 | 16 |
| 15 | `}` | DELIMITADOR | 4 | 5 |
| 16 | `}` | DELIMITADOR | 5 | 1 |

**Derivación:**
```
<programa>
→ "milpa" <bloque>
→ "milpa" "{" <lista_sentencias> "}"
→ "milpa" "{" <sentencia> "}"
→ "milpa" "{" <ciclo_while> "}"
→ "milpa" "{" "huxiuy" "(" <expresion> ")" <bloque> "}"
→ "milpa" "{" "huxiuy" "(" <expresion_comparacion> ")" <bloque> "}"
→ "milpa" "{" "huxiuy" "(" <expresion_aritmetica> "<" <expresion_aritmetica> ")" <bloque> "}"
→ "milpa" "{" "huxiuy" "(" <valor> "<" <valor> ")" <bloque> "}"
→ "milpa" "{" "huxiuy" "(" "i" "<" "5" ")" "{" <salida> "}" "}"
→ "milpa" "{" "huxiuy" "(" "i" "<" "5" ")" "{" "uray" "(" "i" ")" ";" "}" "}"
```

> *Árbol de derivación: ver diagrama Árbol 3 (Parte A y Parte B) en el apartado de visualizaciones.*

---

### 16.4 Entrada 4 — Definición de función pula/nuka

**Programa:**
```
milpa {
    pula sumar(a, b) {
        nuka a + b;
    }
}
```

**Tokens:**

| # | Lexema | Categoría | Línea | Columna |
|---|---|---|---|---|
| 1 | `milpa` | RESERVADA | 1 | 1 |
| 2 | `{` | DELIMITADOR | 1 | 7 |
| 3 | `pula` | RESERVADA | 2 | 5 |
| 4 | `sumar` | IDENTIFICADOR | 2 | 10 |
| 5 | `(` | DELIMITADOR | 2 | 15 |
| 6 | `a` | IDENTIFICADOR | 2 | 16 |
| 7 | `,` | DELIMITADOR | 2 | 17 |
| 8 | `b` | IDENTIFICADOR | 2 | 19 |
| 9 | `)` | DELIMITADOR | 2 | 20 |
| 10 | `{` | DELIMITADOR | 2 | 22 |
| 11 | `nuka` | RESERVADA | 3 | 9 |
| 12 | `a` | IDENTIFICADOR | 3 | 14 |
| 13 | `+` | OP_ARITMETICO | 3 | 16 |
| 14 | `b` | IDENTIFICADOR | 3 | 18 |
| 15 | `;` | DELIMITADOR | 3 | 19 |
| 16 | `}` | DELIMITADOR | 4 | 5 |
| 17 | `}` | DELIMITADOR | 5 | 1 |

**Derivación:**
```
<programa>
→ "milpa" <bloque>
→ "milpa" "{" <lista_sentencias> "}"
→ "milpa" "{" <sentencia> "}"
→ "milpa" "{" <definicion_funcion> "}"
→ "milpa" "{" "pula" <identificador> "(" <lista_parametros> ")" <bloque> "}"
→ "milpa" "{" "pula" "sumar" "(" <lista_parametros> ")" <bloque> "}"
→ "milpa" "{" "pula" "sumar" "(" "a" "," "b" ")" <bloque> "}"
→ "milpa" "{" "pula" "sumar" "(" "a" "," "b" ")" "{" <retorno> "}" "}"
→ "milpa" "{" "pula" "sumar" "(" "a" "," "b" ")" "{" "nuka" <expresion> ";" "}" "}"
→ "milpa" "{" "pula" "sumar" "(" "a" "," "b" ")" "{" "nuka" <expresion_aritmetica> "+" <termino> ";" "}" "}"
→ "milpa" "{" "pula" "sumar" "(" "a" "," "b" ")" "{" "nuka" <valor> "+" <valor> ";" "}" "}"
→ "milpa" "{" "pula" "sumar" "(" "a" "," "b" ")" "{" "nuka" "a" "+" "b" ";" "}" "}"
```

> *Árbol de derivación: ver diagrama Árbol 4 (Parte A y Parte B) en el apartado de visualizaciones.*

---

### 16.5 Entrada 5 — Ciclo for tahma

**Programa:**
```
milpa {
    tahma (naxuxi i = 0; i < 3; i += 1) {
        uray(i);
    }
}
```

**Tokens:**

| # | Lexema | Categoría | Línea | Columna |
|---|---|---|---|---|
| 1 | `milpa` | RESERVADA | 1 | 1 |
| 2 | `{` | DELIMITADOR | 1 | 7 |
| 3 | `tahma` | RESERVADA | 2 | 5 |
| 4 | `(` | DELIMITADOR | 2 | 11 |
| 5 | `naxuxi` | RESERVADA | 2 | 12 |
| 6 | `i` | IDENTIFICADOR | 2 | 20 |
| 7 | `=` | OP_ASIGNACION | 2 | 22 |
| 8 | `0` | ENTERO | 2 | 24 |
| 9 | `;` | DELIMITADOR | 2 | 25 |
| 10 | `i` | IDENTIFICADOR | 2 | 27 |
| 11 | `<` | OP_COMPARACION | 2 | 29 |
| 12 | `3` | ENTERO | 2 | 31 |
| 13 | `;` | DELIMITADOR | 2 | 32 |
| 14 | `i` | IDENTIFICADOR | 2 | 34 |
| 15 | `+=` | OP_ASIGNACION | 2 | 36 |
| 16 | `1` | ENTERO | 2 | 39 |
| 17 | `)` | DELIMITADOR | 2 | 40 |
| 18 | `{` | DELIMITADOR | 2 | 42 |
| 19 | `uray` | RESERVADA | 3 | 9 |
| 20 | `(` | DELIMITADOR | 3 | 13 |
| 21 | `i` | IDENTIFICADOR | 3 | 14 |
| 22 | `)` | DELIMITADOR | 3 | 15 |
| 23 | `;` | DELIMITADOR | 3 | 16 |
| 24 | `}` | DELIMITADOR | 4 | 5 |
| 25 | `}` | DELIMITADOR | 5 | 1 |

**Derivación:**
```
<programa>
→ "milpa" <bloque>
→ "milpa" "{" <lista_sentencias> "}"
→ "milpa" "{" <sentencia> "}"
→ "milpa" "{" <ciclo_for> "}"
→ "milpa" "{" "tahma" "(" <inicio_for> ";" <expresion> ";" <actualizacion_for> ")" <bloque> "}"
→ "milpa" "{" "tahma" "(" "naxuxi" <id> "=" <expresion> ";" <expresion> ";" <actualizacion_for> ")" <bloque> "}"
→ "milpa" "{" "tahma" "(" "naxuxi" "i" "=" "0" ";" <exp_comp> ";" <actualizacion_for> ")" <bloque> "}"
→ "milpa" "{" "tahma" "(" "naxuxi" "i" "=" "0" ";" "i" "<" "3" ";" <actualizacion_for> ")" <bloque> "}"
→ "milpa" "{" "tahma" "(" "naxuxi" "i" "=" "0" ";" "i" "<" "3" ";" <id> "+=" <expresion> ")" <bloque> "}"
→ "milpa" "{" "tahma" "(" "naxuxi" "i" "=" "0" ";" "i" "<" "3" ";" "i" "+=" "1" ")" "{" "uray" "(" "i" ")" ";" "}" "}"
```

> *Árbol de derivación: ver diagrama Árbol 5 (Parte A y Parte B) en el apartado de visualizaciones.*

---

## 17. Errores Sintácticos

El parser de Naxuxi **no se detiene** al encontrar el primer error — intenta recuperarse y continuar el análisis para reportar todos los errores presentes en el programa.

### 17.1 Tipos de errores sintácticos

| Código | Tipo | Descripción | Ejemplo |
|---|---|---|---|
| `ERR-S01` | Falta de punto y coma | Una instrucción no termina con `;` | `naxuxi edad = 25` |
| `ERR-S02` | Paréntesis sin cerrar | Un `(` no tiene su `)` correspondiente | `kunu (edad >= 18 {` |
| `ERR-S03` | Llave sin cerrar | Un `{` no tiene su `}` correspondiente | `milpa { naxuxi x = 1;` |
| `ERR-S04` | Estructura incompleta | Una estructura no sigue su forma válida | `kunu { uray("hola"); }` |
| `ERR-S05` | Bloque `milpa` ausente | El programa no comienza con `milpa` | `naxuxi edad = 25;` |

### 17.2 Estructura de cada error sintáctico

| Campo | Tipo | Descripción |
|---|---|---|
| `codigo` | string | Código del error (`ERR-S01` ... `ERR-S05`) |
| `tipo` | string | Nombre descriptivo del error |
| `linea` | number | Línea donde se detectó el error |
| `columna` | number | Columna donde se detectó el error |
| `descripcion` | string | Mensaje explicando qué se esperaba y qué se encontró |

### 17.3 Tabla de errores sintácticos — Ejemplo

| # | Código | Tipo | Línea | Columna | Descripción |
|---|---|---|---|---|---|
| 1 | `ERR-S01` | Falta de punto y coma | 2 | 22 | Se esperaba `;` al final de la declaración, se encontró `}` |
| 2 | `ERR-S02` | Paréntesis sin cerrar | 3 | 18 | Se esperaba `)` para cerrar la condición `kunu`, se encontró `{` |
| 3 | `ERR-S03` | Llave sin cerrar | 5 | 1 | Se esperaba `}` para cerrar el bloque `milpa`, se encontró fin de archivo |
| 4 | `ERR-S04` | Estructura incompleta | 4 | 5 | `kunu` requiere una condición entre paréntesis antes del bloque |
| 5 | `ERR-S05` | Bloque milpa ausente | 1 | 1 | El programa debe iniciar con `milpa`, se encontró `naxuxi` |

### 17.4 Programas con errores sintácticos

**Error ERR-S01 — Falta de punto y coma:**
```
milpa {
    naxuxi edad = 25
    uray(edad);
}
```

**Error ERR-S02 — Paréntesis sin cerrar:**
```
milpa {
    kunu (edad >= 18 {
        uray("Mayor");
    }
}
```

**Error ERR-S03 — Llave sin cerrar:**
```
milpa {
    naxuxi x = 10;
    uray(x);
```

**Error ERR-S04 — Estructura incompleta:**
```
milpa {
    kunu {
        uray("sin condicion");
    }
}
```

**Error ERR-S05 — Bloque milpa ausente:**
```
naxuxi edad = 25;
uray(edad);
```

---

## 18. Flujo del Análisis Sintáctico

```
INICIO
  │
  ▼
Recibir lista de tokens del lexer
Inicializar posición = 0
errores_sintácticos = []
  │
  ▼
Llamar a parse_programa()
  │
  ▼
¿Token actual es "milpa"?
  │ No → Registrar ERR-S05 → FIN con error
  │ Sí → Consumir "milpa"
  ▼
Llamar a parse_bloque()
  │
  ▼
¿Token actual es "{"?
  │ No → Registrar ERR-S03
  │ Sí → Consumir "{"
  ▼
Llamar a parse_lista_sentencias()
  │  (repetir hasta encontrar "}" o fin de tokens)
  ├── parse_declaracion()   si token es "naxuxi"
  ├── parse_condicional()   si token es "kunu"
  ├── parse_ciclo_while()   si token es "huxiuy"
  ├── parse_ciclo_for()     si token es "tahma"
  ├── parse_def_funcion()   si token es "pula"
  ├── parse_retorno()       si token es "nuka"
  ├── parse_salida()        si token es "uray"
  └── parse_asignacion()    si token es IDENTIFICADOR
  │
  ▼
¿Token actual es "}"?
  │ No → Registrar ERR-S03
  │ Sí → Consumir "}"
  ▼
¿Fin de tokens?
  │ No → Registrar error inesperado
  │ Sí → Análisis exitoso
  ▼
Retornar árbol sintáctico + tabla de errores
```

---

---

# Fase 5 — Interfaz Web

La interfaz web integra el compilador de Naxuxi en una aplicación React con diseño profesional de dos paneles.

---

## 19. Arquitectura de la interfaz

### 19.1 Diseño de dos paneles

```
┌──────────────────────────┬──────────────────────────────┐
│  Panel izquierdo (48%)   │   Panel derecho (52%)        │
│                          │                              │
│  [ Editor .nax ]         │  [ Tokens | Símbolos |       │
│    CodeMirror 6          │    Árbol  | Errores  ]       │
│    resaltado Naxuxi      │                              │
│                          │  Contenido del tab activo    │
│  ────────────────────    │                              │
│  [📂 Cargar] [▶ Compilar]│                              │
│  ✓ Compilación exitosa   │                              │
└──────────────────────────┴──────────────────────────────┘
```

### 19.2 Flujo de interacción

1. El usuario escribe código Naxuxi en el editor **o** carga un archivo `.nax`
2. Presiona **▶ Compilar** — se ejecutan `analizar()` y `parsear()` en el hilo principal
3. La app actualiza el estado React con `{ tokens, simbolos, erroresLex, valido, arbol, erroresSin }`
4. Si hay errores → cambia automáticamente al tab **Errores**
5. Si el programa es válido → cambia automáticamente al tab **Árbol**
6. El indicador de estado muestra ✓ o ✗ con el conteo de errores

---

## 20. Componentes React

### 20.1 Editor.jsx — CodeMirror 6

El editor usa la API de bajo nivel de CodeMirror 6 (sin wrapper de terceros). Utiliza `ViewPlugin` + `MatchDecorator` para resaltar las 18 palabras reservadas de Naxuxi con color púrpura (`#c678dd`):

```javascript
const kwMatcher = new MatchDecorator({
  regexp: new RegExp(`\\b(milpa|naxuxi|pula|nuka|ixka|uray|...)\\b`, 'g'),
  decoration: () => Decoration.mark({ class: 'cm-naxuxi-kw' }),
})
```

La sincronización con el estado de React se maneja en dos efectos separados:
- `useEffect([], [])` — monta el editor una sola vez
- `useEffect([codigo])` — detecta cambios externos (carga de archivo) y despacha un `view.dispatch`

### 20.2 TokenTable.jsx

Tabla con columnas `#`, `Lexema`, `Categoría`, `Línea`, `Columna`. Cada categoría se muestra con una clase badge coloreada (`.badge-RESERVADA`, `.badge-IDENTIFICADOR`, etc.) definida en `index.css`.

### 20.3 SymbolTable.jsx

Tabla con columnas `Identificador`, `Tipo`, `Valor`, `Línea`, `Columna`. Cada tipo de dato tiene un fondo de color distinto usando el mapa `TIPO_COLORS`:

| Tipo | Fondo | Texto |
|---|---|---|
| entero | marrón oscuro | melocotón |
| decimal | ámbar oscuro | amarillo |
| cadena | verde oscuro | esmeralda |
| booleano | índigo oscuro | lavanda |

### 20.4 ErrorTable.jsx

Muestra dos secciones separadas: errores léxicos (naranja) y errores sintácticos (rojo). Si no hay errores, muestra un estado de éxito con ✅.

### 20.5 DerivationTree.jsx — SVG puro

El árbol de derivación se renderiza con SVG puro, sin librerías externas. El algoritmo de layout trabaja en dos pasos:

**Paso 1 — Asignación de columnas (DFS):**
- Los nodos hoja reciben columnas consecutivas de izquierda a derecha
- Los nodos internos se centran sobre el rango de columnas de sus hijos

```javascript
function visitar(nodo, profundidad, padreId) {
  // Si es hoja: ocupa la siguiente columna libre
  if (hijos.length === 0) {
    entrada.x = cursor.col * (NODE_W + H_GAP)
    cursor.col++
  } else {
    const colInicio = cursor.col
    hijos.forEach(h => visitar(h, profundidad + 1, id))
    const colFin = cursor.col - 1
    entrada.x = ((colInicio + colFin) / 2) * (NODE_W + H_GAP)
  }
}
```

**Paso 2 — Renderizado SVG:**
- Aristas: curvas cúbicas de Bézier (`C`) para conexiones visualmente suaves
- Nodos no terminales: fondo azul oscuro (`#0f172a`), borde azul (`#1d4ed8`), texto azul claro (`#93c5fd`)
- Nodos terminales (hojas): fondo ámbar oscuro (`#1c1407`), borde ámbar (`#92400e`), texto ámbar (`#fbbf24`)
- Texto truncado a 17 caracteres para mantener proporciones

---

## 21. Sistema de estilos

### 21.1 Variables CSS (tema oscuro / claro)

El tema completo se controla con variables CSS en `:root`. El modo claro se activa añadiendo la clase `.light` al `#app-root`:

```css
:root {
  --bg:          #0f0f17;   /* fondo principal */
  --bg-panel:    #14141f;   /* panel derecho */
  --bg-surface:  #1a1b2e;   /* headers y barras */
  --accent:      #cba6f7;   /* color de acento (violeta) */
  --success:     #a6e3a1;   /* verde de compilación exitosa */
  --error:       #f38ba8;   /* rojo de errores */
  --warning:     #fab387;   /* naranja de errores léxicos */
}
```

### 21.2 Tailwind CSS v4

El proyecto usa Tailwind CSS v4, cuya configuración se hace directamente en CSS:

```css
@import "tailwindcss";   /* reemplaza el antiguo @tailwind base/components/utilities */
```

No se requiere `tailwind.config.js`. El plugin `@tailwindcss/vite` se encarga de la integración con Vite.

---

*Documento técnico — Curso de Compiladores*  
*Universidad Mariano Gálvez de Guatemala*  
*Lenguaje Naxuxi — Dedicado al pueblo Xinca de Jutiapa, Guatemala*
