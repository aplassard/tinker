# Meditation App

A calming meditation app built with Vite + React + TypeScript and styled with Tailwind CSS.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- npm (comes with Node.js)

### Installation

```bash
cd apps/meditation
npm install
```

### Development

Start the local dev server:

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

### Build

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Project Structure

```
apps/meditation/
├── public/              # Static assets served as-is
├── src/
│   ├── assets/          # Bundled assets (images, fonts, etc.)
│   ├── components/      # Reusable React components
│   ├── hooks/           # Custom React hooks
│   ├── App.tsx          # Root application component
│   ├── index.css        # Tailwind CSS entry point
│   └── main.tsx         # Application entry point
├── index.html           # HTML template
├── tailwind.config.js   # Tailwind CSS configuration
├── vite.config.ts       # Vite configuration (includes PWA plugin)
└── tsconfig.json        # TypeScript configuration
```

## PWA Support

This app includes PWA support via `vite-plugin-pwa`. The service worker is auto-generated during build and supports offline caching. The PWA manifest is configured in `vite.config.ts`.
