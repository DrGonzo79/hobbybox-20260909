# HobbyBox

A runnable prototype for a beginner-first hobby rental service: choose a complete project kit, save it, configure a 2–21 day trial, and receive an inventory-aware transparent quote.

**Demo:** https://drgonzo79.github.io/hobbybox-20260909/

## What works

- Responsive Next.js App Router interface with category/search filters and saved kits.
- Rental builder with duration, pickup/shipping and optional beginner protection.
- Named unavailable-inventory, empty, loading and quote states.
- FastAPI domain operation for price, discount, hold and inventory-window validation.
- Shared fictional fixtures in `data/kits.json`.
- Python integration tests and Playwright desktop/mobile interaction tests.

All inventory, prices, availability and checkout state are fictional. GitHub Pages hosts the static frontend only; the Python API is source code tested locally and in CI, not a live service.

## Run

```bash
npm ci
npm run dev
```

Open http://localhost:3000.

```bash
cd api
uv sync --frozen
uv run uvicorn main:app --reload
```

The API runs at http://localhost:8000. The static demo intentionally mirrors the domain calculation client-side because Pages cannot host Python.

## Verify

```bash
npm run typecheck
npm run test:e2e
npm run build
cd api && uv sync --frozen && uv run pytest -q
```

## Documentation

- [Source notes](research/notes.md)
- [Office Hours diagnostic](docs/OFFICE_HOURS.md)
- [Product plan](docs/PRODUCT.md)
- [Architecture](docs/ARCHITECTURE.md)
- [CEO review](docs/CEO_REVIEW.md)
- [Phased build prompts](docs/BUILD_PROMPTS.md)
