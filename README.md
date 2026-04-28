# faizmazlan.github.io

Personal portfolio website for Faiz Mazlan - Cloud Architect.

## Overview

A responsive, single-page portfolio showcasing professional experience, skills, projects, education, and certifications. Features light/dark theme toggle, scroll-driven animations, a certification carousel, and a downloadable CV.

## Tech Stack

- **HTML / CSS / JavaScript** — vanilla, no frameworks
- **esbuild** — JS bundling and CSS minification
- **Vitest** — unit testing
- **serve** — local development server

## Getting Started

```bash
# Install dependencies
npm install

# Run local dev server
npm run dev

# Run tests
npx vitest --run

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
├── index.html          # Main HTML page
├── css/                # Modular stylesheets (variables, base, components, etc.)
├── js/                 # JS modules (navigation, theme, animations, carousel, contact)
├── assets/             # Images and icons
├── build.mjs           # Production build script
├── dist/               # Built output (generated)
├── faizmazlan.cv.pdf   # Downloadable CV
└── vitest.config.js    # Test configuration
```

## Deployment

```bash
npm run deploy
```

Builds the site and publishes the `dist/` folder via GitHub Pages using `gh-pages`.

## License

© Faiz Mazlan. All rights reserved.
