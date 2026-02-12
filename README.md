# stadt-land-fluss

React-Frontend-Skeleton mit **Vite**, **Tailwind CSS v4**, **ESLint v10 (Flat Config)** und **Prettier**.

## Warum Vite?

Für eine reine SPA / Frontend-App ist Vite aktuell die pragmatische Standardwahl: schnell beim Dev-Server (HMR), einfache Konfiguration, super Ökosystem.
Alternativen wären z.B. Next.js (wenn du SSR/SSG brauchst) oder React Router v7 / Remix-artige Setups – für „Stadt-Land-Fluss“ meistens Overkill.

## Lokales Dev (ohne Docker)

```bash
npm install
npm run dev
```

Dann im Browser: http://localhost:5174

## Dev via Docker (Watch-Modus)

```bash
npm run docker:dev
```

Stoppen:

```bash
npm run docker:down
```

Logs:

```bash
npm run docker:logs
```

## Linting / Formatting

```bash
npm run lint
npm run lint:fix

npm run format
npm run format:write
```

## Build

```bash
npm run build
npm run preview
```
