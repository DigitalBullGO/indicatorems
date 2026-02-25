

## Plan: Dashboard, Pre-Engineered Reports & Template Library Updates

### 1. Dashboard (`src/pages/Index.tsx`)

**Remove Feature Modules** (lines 187-204): Delete the entire "Feature Modules" section including the `moduleCards` array (lines 15-23) since it's no longer needed.

**Update chart color palette** to use the attached reference colors throughout:
- Primary data: **Slate Teal** `rgb(45, 156, 150)` — bar fills, primary pie slices
- Secondary/warning: **Amber Gold** `rgb(255, 191, 0)` — trend indicators, alerts
- Labels/headings: **Deep Indigo** `rgb(63, 81, 181)` — already partially used
- Comparisons: **Dusty Rose** `rgb(188, 110, 120)` — "Actual" bars, secondary series
- Baseline/axes: **Cool Gray** `rgb(108, 117, 125)` — axis labels, grid lines

Specific changes:
- `COLORS` array → replace with Slate Teal, Deep Indigo, Amber Gold, Dusty Rose, Cool Gray
- Revenue bar gradient → Slate Teal gradient instead of green
- Orders line → Deep Indigo
- Pie chart cells → new 5-color palette
- Budget vs Actual bars → Slate Teal for Budget, Dusty Rose for Actual
- KPI trend arrows → keep logic but use Slate Teal for up, Amber Gold for down

---

### 2. Pre-Engineered Reports (`src/pages/Reports.tsx`)

Update the report preview panel and report card content to be more meaningful and aligned with report titles. Currently all non-spend reports show a generic bar chart.

**Enhancements:**
- Update chart colors to use the new palette (Slate Teal, Amber Gold, Deep Indigo, Dusty Rose, Cool Gray)
- Add report-specific preview data so each report shows contextually relevant sample data:
  - `spend-analysis` → Pie chart (already exists, update colors)
  - `bom-breakdown` → Horizontal bar by component type
  - `supplier-scorecard` → Bar chart with OTD/Quality metrics
  - `lead-time-120` → Bar chart showing lead time days
  - Other reports → contextual bar charts with relevant mock data
- Apply `card-premium` styling and the new color palette to the preview panel and report cards
- Use Slate Teal as primary bar fill, Dusty Rose for comparison, Cool Gray for axes

---

### 3. Template Library (`src/pages/Templates.tsx`)

Assign a **distinct accent color** to each of the three tab categories, replacing the current uniform green/indigo:

| Tab | Color | Hex | Usage |
|-----|-------|-----|-------|
| AI Prompts | Slate Teal | `rgb(45, 156, 150)` | Section icons, action buttons, card thumbnail bg tint |
| Business Communication | Amber Gold | `rgb(255, 191, 0)` | Section icons, action buttons, card thumbnail bg tint |
| Report Templates | Deep Indigo | `rgb(63, 81, 181)` | Section icons, action buttons, card thumbnail bg tint |

**Implementation:**
- Pass an `accentColor` prop to `TemplateCard` to style the thumbnail background tint, the action button, and the card's hover border color
- Update section heading icon colors per category
- The `FileSpreadsheet` icon in thumbnails gets tinted with the category color
- Action buttons use the category color as background

---

### Technical Details

**Files to modify:**
1. `src/pages/Index.tsx` — Remove Feature Modules block (lines 15-23, 187-204), update `COLORS` array and all gradient definitions to new palette
2. `src/pages/Reports.tsx` — Update `COLORS`, add report-specific preview datasets, apply new palette to charts
3. `src/pages/Templates.tsx` — Add color config per tab, pass accent color to `TemplateCard`, update section icon colors
4. `src/data/mockData.ts` — Update `spendByCommodity` fill values to new palette colors (optional, if fills are hardcoded there)

