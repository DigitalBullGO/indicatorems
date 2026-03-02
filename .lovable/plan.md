

## Plan: Add "BOM to Quote" as 6th Sidebar Module

### Current vs Target

```text
Current (5 items)                  Target (6 items)
─────────────────                  ─────────────────
Dashboard                          Dashboard
Excel & SAP Hub                    Excel & SAP Hub
  (tabs: Excel Dashboard | SAP)      (tabs: Excel Dashboard | SAP Bridge)
AI Insights Pro                    AI Insights Pro
Drag & Drop Builder                Drag & Drop Builder
Reports & Templates                BOM to Quote  ← re-added, renamed
  (tabs: Reports | Templates)      Reports & Templates
                                     (tabs: Reports | Templates)
```

Everything requested is already implemented **except** the "BOM to Quote" module. The `ExcelQuote.tsx` page component still exists in the codebase and just needs to be re-wired.

### Implementation (3 files, ~10 lines changed)

**1. `src/App.tsx`** — Add route: `/bom-quote` → `ExcelQuote`

**2. `src/components/layout/AppLayout.tsx`** — Add nav item "BOM to Quote" with `FileSpreadsheet` icon at `/bom-quote`, positioned after "Drag & Drop Builder"

**3. `src/pages/ExcelQuote.tsx`** — Update the page heading from "Excel to Quote" to "BOM to Quote"

### Impact
- Minimal effort (~5 minutes)
- No architectural changes — reuses the existing `ExcelQuote` component as-is
- All other modules remain completely unchanged

