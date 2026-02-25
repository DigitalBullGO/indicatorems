

## Plan: Update Pre-Engineered Report Previews to Match Report Content

### Problem
The 12 report previews in `src/pages/Reports.tsx` all show simple generic bar/pie charts with placeholder data. They don't reflect the actual content, structure, or KPIs that each report title implies. For example, "Commodity-wise Spend Analysis" should show spend breakdowns by type, top categories, and AI-identified opportunities — as demonstrated in the uploaded PDF template.

### Solution
Replace the current simple chart previews with rich, executive-style preview panels that include:
- **KPI summary cards** at the top (e.g., Total Spend, Supplier Count, Savings Identified)
- **Data tables** with contextual columns matching the report topic
- **A relevant chart** (pie, bar, or horizontal bar) where appropriate
- **Actionable insights** or alerts section

### Report-by-Report Content Updates

| Report ID | Title | Preview Content |
|-----------|-------|----------------|
| `spend-analysis` | Commodity-wise Spend Analysis | KPIs: Total Spend $142.5M, 1,420 Suppliers, 73% Direct. Table: Spend by Type (Direct Materials, Mfg Opex, Indirect). Pie chart by commodity. AI alerts (Maverick Spend, Consolidation). |
| `bom-breakdown` | BOM & Component-Level Breakdown | KPIs: Total BOM Cost, Unique MPNs, Avg Lead Time. Table: Top components by cost contribution. Horizontal bar by commodity %. |
| `supplier-scorecard` | Supplier Scorecard | KPIs: Avg OTD, Avg Quality, Suppliers Evaluated. Table: Supplier name, OTD%, Quality%, Lead Time, Rating. Grouped bar (OTD vs Quality). |
| `lead-time-120` | MPNs Exceeding 120-Day Lead Time | KPIs: Parts >120d, Longest Lead Time, Avg Excess Days. Table: MPN, Description, Supplier, Lead Time, Risk Level. Bar chart by part. |
| `inventory` | Inventory Status Report | KPIs: Total Units, Total Value, Low Stock Items. Table: Commodity, Units, Value, Turnover Rate. Bar chart by commodity value. |
| `grn-pos` | GRN & PO Tracking | KPIs: Total POs, Received, Pending. Table: Month, Received, Pending, Variance. Stacked bar by month. |
| `quality-yield` | Quality Yield Report | KPIs: Avg Yield, Best Line, Lines Below Target. Table: Line, Yield%, Defect Rate, Status. Bar chart by line. |
| `aging-customer` | Aging Analysis — Customer | KPIs: Total Outstanding, >90d Amount, Collection Rate. Table: Aging bucket, Count, Amount, % of Total. Bar by aging bucket. |
| `aging-supplier` | Aging Analysis — Supplier | KPIs: Total Payables, Overdue Amount, On-Time Payment %. Table: Aging bucket, Count, Amount. Bar by bucket. |
| `customer-sales` | Customer-wise Sales | KPIs: Total Revenue, Top Region, Active Customers. Table: Region, Revenue, Orders, Avg Order Value. Bar by region. |
| `org-drilldown` | Org/Dept/BOM-wise Drilldown | KPIs: Departments, Total Spend, Largest Dept. Table: Department, Budget, Actual, Variance. Horizontal bar. |
| `iqc-report` | IQC Inspection Report | KPIs: Total Lots, Pass Rate, Rejections. Table: Line, Pass Rate%, Lots Inspected, Defects Found. Bar chart. |

### Implementation Approach

1. **Expand `getReportPreview()`** — Each case returns a structured JSX block with:
   - A row of 3 compact KPI cards (icon, value, label)
   - A small data table (3-5 rows) with topic-specific columns
   - The existing chart (kept but resized to ~140px height)
   - For `spend-analysis`: add the AI alerts section matching the PDF format

2. **Increase preview panel height** — Change from `h-fit` to allow scrollable content with `max-h-[600px] overflow-y-auto`

3. **Add helper components inline** — Small `KpiCard` and `DataRow` render helpers within the file for the structured layout

4. **Update mock datasets** — Enrich existing datasets (e.g., `supplierScorecardData` add `leadTime` and `rating` fields, `inventoryData` add `turnover` field) to support the table views

### Files to Modify
- `src/pages/Reports.tsx` — Main changes: expand `getReportPreview()` with executive-style content for all 12 reports, add KPI cards and data tables, update preview panel sizing

### No changes needed to:
- `src/data/mockData.ts` — All additional data will be defined inline in Reports.tsx alongside existing preview datasets
- Other files remain untouched

