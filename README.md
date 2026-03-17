# Todo App

A reactive, real-time todo application built with Electric SQL + TanStack DB. All changes sync instantly across connected clients via Postgres.

![Screenshot placeholder](./screenshot.png)

## Features

- Add todos via the input field (press Enter or click Add)
- Mark todos complete/incomplete with a checkbox
- Delete todos with the trash icon
- Filter view: All / Active / Completed
- Real-time sync — changes appear instantly across all connected clients
- Optimistic mutations for snappy, instant UI feedback

## How to Run

```bash
pnpm install
pnpm dev:start
```

The app will be available at http://localhost:5173

## Tech Stack

- **Electric SQL** — Postgres-to-client sync via shapes
- **TanStack DB** — Reactive collections and live queries
- **Drizzle ORM** — Schema definitions and migrations
- **TanStack Start** — React meta-framework with SSR
- **Radix UI Themes** — Component library
- **Biome** — Linting and formatting
