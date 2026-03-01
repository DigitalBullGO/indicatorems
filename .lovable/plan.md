

## Plan: Restructure Sidebar Navigation (7 → 5 modules)

### New Sidebar Structure

```text
Before (8 sidebar items)           After (5 sidebar items)
─────────────────────              ─────────────────────
Dashboard                          Dashboard
Excel to Dashboard            →    Excel & SAP Hub
Excel to Quote                →      (tabs: Excel Dashboard | SAP Bridge)
AI Insights Pro               →    AI Insights Pro  (unchanged)
AI Bridge for SAP             →    Drag & Drop Builder (unchanged)
Drag & Drop Builder           →    Reports & Templates
Pre-Engineered Reports        →      (tabs: Reports | Templates)
Template Library              →
```

**Excel to Quote is removed entirely.**

### Feasibility

Fully feasible. All pages are self-contained components. The `Tabs` pattern from Radix UI is already used in Templates.tsx. Existing page components embed directly inside tab panels with zero refactoring.

### Implementation Steps

**1. Create `src/pages/ExcelSapHub.tsx`** — Wrapper with 2 tabs ("Excel Dashboard" | "SAP Bridge"), rendering existing `ExcelDashboard` and `SapBridge` content inline.

**2. Create `src/pages/ReportsAndTemplates.tsx`** — Wrapper with 2 tabs ("Pre-Engineered Reports" | "Template Library"), rendering existing `Reports` and `Templates` content.

**3. Update `src/App.tsx`**
- Remove routes: `/excel-dashboard`, `/excel-quote`, `/ai-insights` (path reuse), `/sap-bridge`, `/reports`, `/templates`
- Add: `/excel-sap` → `ExcelSapHub`, `/reports-templates` → `ReportsAndTemplates`
- Keep: `/`, `/ai-insights`, `/drag-drop`, `/admin`

**4. Update `src/components/layout/AppLayout.tsx`**
- Reduce `navItems` to 5: Dashboard, Excel & SAP Hub (`/excel-sap`), AI Insights Pro (`/ai-insights`), Drag & Drop Builder (`/drag-drop`), Reports & Templates (`/reports-templates`)

**5. Update `src/pages/Index.tsx`** — Update any dashboard cards linking to old routes.

**6. Fix `src/pages/ExcelDashboard.tsx`** — Remove all "Skip to Quote" / "Switch to BOM Agent" buttons and `navigate("/excel-quote")` calls (4 occurrences), since Excel to Quote is removed.

### Files Changed

| File | Action |
|------|--------|
| `src/pages/ExcelSapHub.tsx` | New — tabs wrapper |
| `src/pages/ReportsAndTemplates.tsx` | New — tabs wrapper |
| `src/App.tsx` | Update routes |
| `src/components/layout/AppLayout.tsx` | Reduce navItems 8→5 |
| `src/pages/Index.tsx` | Update dashboard links |
| `src/pages/ExcelDashboard.tsx` | Remove Excel-to-Quote navigation references |

### Impact
- No data/state loss — existing components reused as-is inside tab wrappers
- Excel to Quote module fully removed (page file can be kept or deleted)
- Sidebar becomes cleaner (5 items instead of 8)
- Estimated effort: moderate (mostly routing, wrapper creation, and link cleanup)

