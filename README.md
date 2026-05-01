# 🌽 Naxuxi Lang

> *Naxuxi* significa **semilla** en la lengua indígena **Xinca** de Guatemala — porque todo programa es una semilla que, al ejecutarse, produce resultados.

**Naxuxi** es un lenguaje de programación orientado a scripts, creado como homenaje a la lengua Xinca de los departamentos de Jutiapa y Santa Rosa, Guatemala. El Xinca es una lengua indígena única en Centroamérica, sin parentesco con ninguna otra familia lingüística conocida, y con menos de 500 hablantes activos. Este proyecto utiliza su vocabulario como palabras reservadas, buscando visibilizar y preservar esta lengua en peligro de extinción.

El lenguaje incluye un compilador completo con **analizador léxico**, **analizador sintáctico**, **visualización del árbol de derivación** e interfaz web interactiva.

---

## ✨ Demo

> *Screenshot o GIF de la interfaz aquí*

---

## 🌱 El ciclo del maíz como metáfora

Las palabras reservadas de Naxuxi están organizadas alrededor del ciclo del cultivo del maíz — actividad central en la cosmovisión Xinca — que se mapea naturalmente a las estructuras de programación:

| Etapa del maíz | Concepto de programación | Palabra Xinca |
|---|---|---|
| Semilla | Declarar variable | `naxuxi` |
| Campo de maíz | Inicio del programa | `milpa` |
| Hacer la labor | Definir función | `pula` |
| Dar el fruto | Retornar valor | `nuka` |
| Recibir el agua | Leer entrada | `ixka` |
| El fuego | Mostrar salida | `uray` |
| La nube | Condicional if | `kunu` |
| La noche | Condicional else | `suma` |
| La lluvia | Ciclo while | `huxiuy` |
| El camino | Ciclo for | `tahma` |

---

## 📋 Ejemplo de código

```naxuxi
#*
    Programa: Calculadora de milpa
    Calcula el área de un terreno y evalúa
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

## 🔤 Palabras reservadas

Naxuxi cuenta con **18 palabras reservadas**, todas derivadas del vocabulario Xinca:

| Palabra | Origen Xinca | Función |
|---|---|---|
| `milpa` | Campo de maíz | Bloque principal del programa |
| `naxuxi` | Semilla | Declarar variable |
| `pula` | Hacer | Definir función |
| `nuka` | Dar | Retornar valor |
| `ixka` | Beber / recibir | Leer entrada del usuario |
| `uray` | Fuego | Mostrar salida en pantalla |
| `kunu` | Nube | Condicional if |
| `suma` | Noche | Condicional else |
| `huxiuy` | Lluvia | Ciclo while |
| `tahma` | Camino | Ciclo for |
| `kiwi` | Todo | Operador lógico AND |
| `woona` | Cerro / volcán | Operador lógico OR |
| `hixi` | Piedra | Valor booleano true |
| `kahl` | Humo | Valor booleano false |
| `tiwix` | Cielo | Reservada (uso futuro) |
| `naru` | Tierra | Reservada (uso futuro) |
| `pari` | Sol | Reservada (uso futuro) |
| `ixmi` | Decir | Reservada (uso futuro) |

---

## ⚙️ Características del lenguaje

- **Tipado dinámico** — los tipos se infieren del valor asignado (`entero`, `decimal`, `cadena`, `booleano`)
- **Case-sensitive** — todo en minúsculas
- **Punto y coma obligatorio** al final de cada instrucción
- **Bloques con llaves** `{ }`
- **Comentarios de línea** con `##` y de bloque con `#* ... *#`
- **Funciones de primera clase** con `pula` y `nuka`
- **Entrada interactiva** con `ixka`

---

## 🛠️ Tecnologías

| Componente | Tecnología |
|---|---|
| Compilador | JavaScript puro (ES6+) |
| Interfaz web | React + Vite |
| Estilos | Tailwind CSS |
| Editor de código | CodeMirror 6 |
| CLI | Node.js |

---

## 🚀 Instalación y uso

### Requisitos

- Node.js 18+
- npm

### Instalación

```bash
git clone https://github.com/tu-usuario/naxuxi-lang.git
cd naxuxi-lang
npm install
```

### Interfaz web

```bash
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173) en tu navegador.

### Terminal (CLI)

```bash
node cli.js mi_programa.nax
```

---

## 🖥️ Interfaz web

La interfaz cuenta con:

- **Editor de código** con resaltado de sintaxis personalizado para Naxuxi
- **Carga de archivos** `.nax` directamente desde el navegador
- **Panel de resultados** con 4 tabs:
  - `Tokens` — lista de tokens reconocidos con línea y columna
  - `Símbolos` — tabla de símbolos con tipos inferidos
  - `Árbol` — visualización interactiva del árbol de derivación sintáctico
  - `Errores` — errores léxicos y sintácticos con descripción detallada

---

## 📐 Sintaxis del lenguaje

### Declaración de variables

```naxuxi
naxuxi edad = 25;
naxuxi precio = 12.50;
naxuxi nombre = "Maria";
naxuxi activo = hixi;
```

### Condicionales

```naxuxi
kunu (edad >= 18) {
    uray("Eres mayor de edad");
} suma {
    uray("Eres menor de edad");
}
```

### Ciclo while

```naxuxi
huxiuy (i < 10) {
    uray(i);
    i += 1;
}
```

### Ciclo for

```naxuxi
tahma (naxuxi i = 0; i < 5; i += 1) {
    uray(i);
}
```

### Funciones

```naxuxi
pula saludar(nombre) {
    uray("Buenos días, " + nombre);
}

milpa {
    saludar("Maria");
}
```

### Operadores lógicos

```naxuxi
kunu (edad >= 18 kiwi activo == hixi) {
    uray("Acceso permitido");
}

kunu (rol == "admin" woona rol == "editor") {
    uray("Puede editar");
}
```

---

## 🔍 Análisis léxico

El lexer identifica **9 categorías de tokens**:

| Token | Descripción |
|---|---|
| `RESERVADA` | Palabras reservadas del lenguaje |
| `IDENTIFICADOR` | Nombres de variables y funciones |
| `ENTERO` | Números enteros |
| `DECIMAL` | Números decimales |
| `CADENA` | Texto entre comillas dobles |
| `OP_ARITMETICO` | `+` `-` `*` `/` `%` |
| `OP_COMPARACION` | `==` `!=` `>` `<` `>=` `<=` |
| `OP_ASIGNACION` | `=` `+=` `-=` |
| `DELIMITADOR` | `{` `}` `(` `)` `;` `,` |

### Errores léxicos detectados

| Código | Tipo |
|---|---|
| `ERR-L01` | Carácter no permitido |
| `ERR-L02` | Cadena no cerrada |
| `ERR-L03` | Comentario de bloque no cerrado |
| `ERR-L04` | Número malformado |
| `ERR-L05` | Identificador inválido |
| `ERR-L06` | Palabra reservada usada como identificador |

---

## 🌳 Análisis sintáctico

El parser implementa **descenso recursivo** basado en la gramática BNF del lenguaje. Genera un árbol de derivación sintáctico visualizable en la interfaz web.

### Errores sintácticos detectados

| Código | Tipo |
|---|---|
| `ERR-S01` | Falta de punto y coma |
| `ERR-S02` | Paréntesis sin cerrar |
| `ERR-S03` | Llave sin cerrar |
| `ERR-S04` | Estructura incompleta |
| `ERR-S05` | Bloque `milpa` ausente |

---

## 📁 Estructura del proyecto

```
naxuxi-lang/
├── compiler/
│   ├── lexer.js         ← Analizador léxico
│   └── parser.js        ← Analizador sintáctico
├── src/
│   ├── App.jsx
│   ├── components/
│   │   ├── Editor.jsx         ← Editor con CodeMirror
│   │   ├── TokenTable.jsx     ← Tabla de tokens
│   │   ├── SymbolTable.jsx    ← Tabla de símbolos
│   │   ├── ErrorTable.jsx     ← Tabla de errores
│   │   └── DerivationTree.jsx ← Árbol de derivación
│   └── main.jsx
├── cli.js               ← Entrada por terminal
├── CLAUDE.md            ← Instrucciones para Claude Code
└── package.json
```

---

## 🌎 Sobre la lengua Xinca

El **Xinca** es una lengua indígena guatemalteca hablada en los departamentos de Santa Rosa, Jutiapa y Jalapa. Es la única lengua indígena de Guatemala que no pertenece a la familia lingüística Maya, y se considera un **aislado lingüístico** — sin parentesco conocido con ninguna otra lengua del mundo.

Según estimaciones actuales, quedan menos de 500 hablantes activos. Este proyecto no pretende ser una representación académica oficial del Xinca, sino un homenaje a esta lengua y al pueblo que la habla, buscando llevar su vocabulario a un contexto moderno y tecnológico.

Si deseas aprender más sobre el Xinca: [Academia de Lenguas Mayas de Guatemala](https://www.almg.org.gt)

---

## 👨‍💻 Autor

**René Osorio**  
Estudiante de Ingeniería en Sistemas  
Universidad Mariano Gálvez de Guatemala — Campus Jutiapa  

---

## 📄 Licencia

MIT License — libre para usar, modificar y distribuir.

---

<div align="center">
  <sub>Hecho con 🌽 en Jutiapa, Guatemala</sub>
</div>
