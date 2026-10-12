# Plan y Bitácora — Manual y Guía de Ingeniería de Contexto (Context Engineering) en HTML5

## 📌 Resumen

SPA interactiva (HTML5 semántico + CSS3 Vanilla + JS ES6+, 100% sin dependencias, sin 
ode_modules, sin build step) que documenta las técnicas avanzadas de **Ingeniería de Contexto** (Context Engineering) para Modelos de Lenguaje (LLMs): ventanas de contexto, estrategias de compresión, priorización de tokens, atención needle-in-a-haystack, técnicas de *windowing*, *context priming* e *in-context learning*.

Todo el proyecto vive dentro de la carpeta INGENIERIA-DE-CONTEXTO/ cumpliendo con las directrices de AGENTS.md.

---

## 🎯 Objetivos

- [x] Proveer una SPA responsiva, accesible y de alto nivel visual sobre **Ingeniería de Contexto**.
- [x] Documentar técnicas de selección y priorización de tokens (*Needle in a Haystack*, *Context Compression*, *Windowing*).
- [x] Explicar la diferencia entre Prompt Engineering y Context Engineering.
- [x] Incluir demostraciones interactivas de consumo de tokens y calculadoras de ventana de contexto.
- [x] Tema claro/oscuro persistente, navegación por secciones SPA y buscador en tiempo real.

---

## 🏗️ Arquitectura de Archivos

- **Patrón**: SPA monolítica modular sin dependencias con simulador de ventana de contexto.

`	ext
INGENIERIA-DE-CONTEXTO/
├── index.html          # SPA principal con navegación por secciones y simuladores de contexto
├── css/
│   └── styles.css      # Sistema de diseño futurista (Dark/Light tokens, glassmorphism)
├── js/
│   └── app.js          # Lógica de navegación SPA, buscador, cálculo de ventana y lectura
├── README.md           # Guía de apertura y navegación del subproyecto
└── plan.md             # Este archivo (plan + bitácora)
`

---

## 🧠 Paradigma de Programación

- **Híbrido: Declarativo + Event-Driven**
- Vistas declarativas y reactividad por eventos DOM para la calculadora de tokens y simulador de ventanas.

---

## 🌐 Propósito de Visibilidad y Destino Remoto

- **Visibilidad**: Público (Open Source / Portafolio).
- **Plataforma Remota Asignada**: GitHub.
- **Plataforma de Despliegue CI/CD**: GitHub Pages / Cloudflare Pages.
- **Justificación**: Guía interactiva de optimización de ventanas de contexto e in-context learning para LLMs sin servidor; ideal para GitHub Pages.

---

## 📊 Estado Actual

🟢 **Completado** — Entregable interactivo verificado.
