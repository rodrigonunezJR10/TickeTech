# TickeTech Events 

**TickeTech** es una ticketera y productora modular enfocada en conectar a los mejores exponentes de la escena internacional del Techno underground y subgéneros (Melodic Techno, Tech House) con los clubes más importantes de Santiago de Chile. 

Este proyecto fue desarrollado por **Rodrigo Núñez Canning** como examen final para **Programación Web** en la **Instituto Santo Tomás**.

---

## Características Principales (SPA)

El sitio funciona bajo la arquitectura de una **Single Page Application (SPA)** nativa, lo que permite navegar de forma fluida y sin recargas de página entre las siguientes secciones:

* **Inicio:** Banner principal y bienvenida a la experiencia.
* **Concepto:** La propuesta de valor e identidad de la marca.
* **Eventos:** Cartelera de próximas fechas (ej. Boris Brejcha, Tale Of Us) cargada dinámicamente con sistema de reserva de entradas y cálculo de total en tiempo real.
* **Contacto & Booking:** Formulario integrado con validaciones nativas.
* **Desarrollador:** Sección dedicada al autor del proyecto con una tarjeta de perfil interactiva (efecto hover).

### 🎵 Características Especiales:
* **Diseño Responsivo:** Adaptabilidad garantizada en dispositivos móviles mediante Media Queries avanzadas.
* **Música de Fondo Integrada:** Un reproductor musical flotante interactivo (Play/Pause) para ambientar la navegación con ritmos electrónicos.
* **Interactividad Avanzada:** Efectos visuales de desenfoque (`blurIn`) al cambiar de pestaña y transformaciones CSS dinámicas en las tarjetas.

---

## 📂 Estructura del Proyecto

```text
TickeTech/
│
├── css/
│   └── style.css          # Estilos generales, paleta Techno y Media Queries
├── js/
│   └── app.js             # Lógica del sistema SPA, carrito de tickets y reproductor
├── data/
│   ├── djs.json           # Estructura de datos de los eventos
│   └── track.mp3          # Archivo de audio para la música de fondo
├── Imagen/
│   └── mifot.jpg.jpeg     # Fotografía del desarrollador
└── index.html             # Estructura HTML5 base del sitio web