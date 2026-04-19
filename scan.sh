#!/bin/bash
REPORT_FILE="new_scan_report.md"
ROOT_PATH=$(pwd)

echo "🔍 Scanning AJKMart System..."

{
  echo "# AJKMart System Deep Scan Report"
  echo "**Generated:** $(date)"
  echo "**Root:** $ROOT_PATH"
  echo ""
  echo "## 1. Project Overview"
  echo "- Monorepo with pnpm workspaces"
  echo "- Database: Neon PostgreSQL via Drizzle ORM"
  echo "- API Server: Node.js + Express + TypeScript (port 4000)"
  echo ""
  echo "**Applications found:**"
  for d in admin ajkmart api-server rider-app vendor-app; do
    if [ -d "$d" ]; then echo "  - $d"; fi
  done

  echo ""
  echo "## 2. Backend API Endpoints (detected)"
  echo "| Method | Endpoint |"
  echo "|--------|----------|"
  grep -rE "router\.(get|post|put|delete)" api-server/src 2>/dev/null | sed -E 's/.*router\.(get|post|put|delete)\(['\''"]([^'\''"]+).*/| \1 | \2 |/' | sort | uniq

  echo ""
  echo "## 3. Database Schema (detected tables)"
  grep -r "pgTable" . --include="*.ts" 2>/dev/null | sed -E 's/.*pgTable\(['\''"]([^'\''"]+).*/- `\1`/' | sort | uniq

  echo ""
  echo "## 4. Security & Risks"
  ENV_COUNT=$(find . -name ".env*" -not -path "*/node_modules/*" | wc -l)
  echo "- **.env files found:** $ENV_COUNT"
  echo "- **CORS:** ⚠️ Needs verification"
  echo "- **Authentication:** JWT/OTP logic check required"

  echo ""
  echo "## 5. Missing Critical Features"
  echo "- ❌ Real-time ride tracking (Socket.io)"
  echo "- ❌ Payment gateway integration"
  echo "- ❌ Push notifications"

} > "$REPORT_FILE"

chmod +x scan.sh
echo "✅ Scan complete! Type 'cat $REPORT_FILE' to see it."
