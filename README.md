# 🌿 Beniet Perfumería — Luxe Digital Experience

![Version](https://img.shields.io/badge/version-1.1.0-emerald)
![Tech](https://img.shields.io/badge/tech-React%20%2B%20Vite-blue)
![Design](https://img.shields.io/badge/design-Premium%20Editorial-gold)

**Beniet Perfumería** es una plataforma digital de alta gama diseñada para ofrecer una experiencia inmersiva y sensorial, centrada exclusivamente en la colección de la sede **Plaza Barcelona (Sogamoso)**. Este proyecto captura la esencia de la perfumería artesanal a través de una interfaz sofisticada y una narrativa visual de lujo.

---

## ✨ Características Principales

### 🏺 Colección Plaza Barcelona
*   **Catálogo Refinado**: Acceso directo a la colección exclusiva de Barcelona, eliminando redundancias nacionales.
*   **Filtros Inteligentes**: Búsqueda avanzada por género, categoría y rango de precios (Desde - Hasta).
*   **Detalle Premium**: Paneles deslizantes con información técnica, notas olfativas y fotografías reales de los frascos (PNG isolated).

### 🧪 Viaje Sensorial (Kiosco Digital)
*   **Experiencia Inmersiva**: Diseñado para funcionar en pantallas táctiles en el local físico.
*   **Quiz Inteligente**: Sistema de recomendación que analiza ocasiones, estados de ánimo e intensidad para encontrar el aroma perfecto.
*   **UI de Alto Contraste**: Optimizado para legibilidad bajo cualquier condición de luz.

### 📰 Magazine & Blog
*   **Noticias Curadas**: Integración con NewsAPI filtrada específicamente para el mundo de la perfumería y cosmética de lujo.
*   **Recomendaciones**: Artículos actualizados sobre tendencias y notas olfativas.

### 📱 Optimización Mobile-First & PWA
*   **Totalmente Responsivo**: Refinado para mantener la elegancia en móviles, tablets y monitores de kiosco.
*   **Service Worker**: Soporte básico offline y carga ultrarrápida de recursos críticos.

---

## 🛠️ Stack Tecnológico

*   **Core**: [React.js](https://reactjs.org/) + [Vite](https://vitejs.dev/)
*   **Animaciones**: [Framer Motion](https://www.framer.com/motion/)
*   **Estilos**: [Tailwind CSS](https://tailwindcss.com/)
*   **Iconografía**: [Lucide React](https://lucide.dev/)

---

## 📂 Estructura del Proyecto

```text
public/
├── Images/           # Imágenes de frascos, logos y recursos visuales
├── Fragances/        # Catálogos en PDF (Hombres, Mujeres, Nicho, Barcelona)
├── manifest.json     # Configuración PWA
└── sw.js             # Service Worker
src/
├── components/       # Componentes (Navbar, Catalog, ExperienceCenter, Locations, etc.)
├── data/             # Dataset principal (dupes.js) y configuraciones
└── App.jsx           # Orquestador principal
```

---

## ✒️ Créditos

Proyecto desarrollado para **Beniet Perfumería** — *Un Mundo de Fragancias*.
Sogamoso, Boyacá.

© 2026 Beniet Perfumería. Todos los derechos reservados.
