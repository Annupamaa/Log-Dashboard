# Log Dashboard UI (React)

React + Vite frontend for the logging service.

```bash
npm install
npm run dev          # http://localhost:5173, proxies /logs and /ai to http://localhost:3070
```

Backend elsewhere (e.g. the mock server on port 4000)?

```bash
API_URL=http://localhost:4000 npm run dev      # Windows PowerShell: $env:API_URL="http://localhost:4000"; npm run dev
```

Production build: `npm run build` (output in `dist/`).
