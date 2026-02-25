

## Plan: AI Bridge for SAP — 4-Step Stepper Wizard Implementation

### Overview

Complete rewrite of `src/pages/SapBridge.tsx` as a 4-step stepper wizard with enriched mock data derived from the uploaded SAP S/4HANA Purchase Order export.

---

### Step 1: Authenticate & Establish Bridge

- Horizontal stepper bar at the top: numbered circles with labels, active state in Slate Teal (`#3da29d`), completed in Deep Indigo (`#515fbc`), locked in Cool Gray (`#6c757d`)
- Enhanced connection card with health stats: Latency `12ms`, Uptime `99.8%`, Protocol `RFC/BAPI`
- Licensing compliance banner: "Digital Access — Read-Only Analytics Mode"
- Connection toggle (existing) + Sync Now button
- Last sync timestamp and delta changes count

### Step 2: Discover (Table Browser)

- Search input to filter tables by name/description
- Category filter dropdown: All / Material / Procurement / Sales / Quality / Production
- Enhanced table rows showing column count and key fields
- "Export to Insights" button triggers a toast
- Stale tables highlighted with amber background

### Step 3: Sync & Map (The Engine)

- **Locked** when connection toggle is off (Step 1)
- Sync status table: each SAP table with sync mode (Delta/Full), last sync, records synced, animated progress bar
- "Force Sync" button per table — simulates progress animation with record count
- Data Standardization preview card: raw SAP field → normalized field mapping (using real column names from the Excel: `EKPO.EBELN` → `PO Number`, `EKPO.NETWR` → `Net Order Value`, etc.)
- "Off-Peak Deep Sync" toggle (cosmetic)

### Step 4: Alert Logic (The Observer)

- Scrollable alert tray with severity badges (critical/warning/info)
- Alert configuration toggles: Shortage Risk, Stale Data, Quality Gate, Price Variance
- Deep-link action buttons per alert
- HANA Performance section with Delta vs Deep sync scheduling controls

---

### Mock Data Updates (`src/data/mockData.ts`)

Enrich `sapTables` with `columns`, `keyFields`, `category`, and `syncMode` fields. Add:

```
sapTables enhanced:
  MARA → category: "Material", columns: 48, keyFields: ["MATNR", "MTART", "MATKL"]
  EKPO → category: "Procurement", columns: 53, keyFields: ["EBELN", "EBELP", "MATNR", "NETWR"]
  STPO → category: "Production", columns: 32, keyFields: ["STLNR", "STLKN", "IDNRK"]
  QALS → category: "Quality", columns: 28, keyFields: ["PRUEFLOS", "MATNR", "STAT"]
  VBAP → category: "Sales", columns: 41, keyFields: ["VBELN", "POSNR", "MATNR"]
  AFKO → category: "Production", columns: 35, keyFields: ["AUFNR", "PLNBEZ", "GAMNG"]
```

Add new arrays:
- `sapFieldMappings`: SAP raw fields → normalized dashboard fields (e.g., `EKPO.EBELN` → "PO Number", `EKPO.LIFNR` → "Supplier ID", `EKPO.NETWR` → "Net Order Value")
- `sapAlertConfig`: alert type toggles with thresholds
- `sapPurchaseOrders`: 8-10 representative rows from the Excel for the Step 3 preview table

Sample PO data derived from the Excel (realistic supplier names, material descriptions, values):

| PO | Supplier | Material | Qty | Net Value | Currency | Status |
|----|----------|----------|-----|-----------|----------|--------|
| 4500000001 | Pinnacle Mechanical Parts | PCB Standoff M3x5mm | 200 | ₹1,032 | INR | Completed |
| 4500000001 | Meridian Technologies | Op-Amp SOT23-5 | 500 | $174 | USD | Completed |
| 4500000016 | Meridian Technologies | MCU ARM Cortex-M4 | 1,000 | $3,484 | USD | Partial |
| 4500000010 | Pacific Trading | Wi-Fi Module 802.11 | 5,000 | $23,610 | USD | Completed |
| 4500000021 | Vertex Electronic | Zener Diode 3.3V | 2,000 | $72 | USD | Completed |
| 4500000034 | Solaris Cable & Wire | Ribbon Cable 10-Pin | 500 | ₹5,642 | INR | Partial |
| 4500000027 | Nexus Semiconductors | Zener Diode 3.3V | 5,000 | $159 | USD | Open |
| 4500000032 | Atlas Precision Eng. | PCB Prototype Service | 2 | ₹116,909 | INR | Partial |

---

### Files to Modify

1. **`src/data/mockData.ts`** — Enrich `sapTables` with new fields; add `sapFieldMappings`, `sapAlertConfig`, `sapPurchaseOrders` arrays
2. **`src/pages/SapBridge.tsx`** — Complete rewrite with stepper wizard, 4 conditional step panels, search/filter, sync simulation, alert configuration

### UI Component Usage
- Existing: `Card`, `Button`, `Badge`, `Switch`, `Table`, `Input`, `Progress`, `Tabs`
- Icons from lucide-react: `Plug`, `RefreshCw`, `AlertTriangle`, `CheckCircle2`, `Clock`, `Database`, `Search`, `Lock`, `Shield`, `Zap`, `ArrowRight`, `Settings`, `Bell`
- Toast notifications via `sonner` for "Export to Insights" and "Force Sync" actions
- All state managed with `useState` — no new dependencies needed

