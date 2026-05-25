#!/usr/bin/env bash
set -e

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  my-app — setup"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# 1. Check Node >= 20
NODE_VER=$(node -v | sed 's/v//' | cut -d. -f1)
if [ "$NODE_VER" -lt 20 ]; then
  echo "❌ Node 20+ required (found $(node -v))"
  exit 1
fi

# 2. Install deps
echo "→ Installing dependencies…"
npm install

# 3. Copy .env if missing
if [ ! -f .env ]; then
  cp .env.example .env
  echo "→ .env created from .env.example — fill in secrets before running"
fi

# 4. Start Docker services
if command -v docker &> /dev/null; then
  echo "→ Starting Docker services…"
  docker compose up -d
  echo "→ Waiting for Postgres…"
  sleep 3
else
  echo "⚠️  Docker not found — start Postgres manually and set DATABASE_URL in .env"
fi

# 5. Run SQL migrations
echo "→ Running database migrations…"
npm run db:migrate --workspace=apps/api

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "  ✅ Setup complete!"
echo ""
echo "  Start dev:  npm run dev"
echo "  API:        http://localhost:3000"
echo "  Swagger:    http://localhost:3000/docs"
echo "  Web:        http://localhost:5173"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
