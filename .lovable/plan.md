

# SOTA Custom Reporting Tool — Implementation Plan

## Overview
A comprehensive AI-powered reporting platform for Electronics Manufacturing (EMS) with 7 feature modules, a dynamic Admin panel, and a single-dashboard UX. Brand colors: **Green (#019e4e)** and **Black (#000000)**. Frontend-only with mock data; backend can be connected later.

---

## 1. App Shell & Navigation
- **Single Dashboard Layout** with a collapsible sidebar listing all 7 feature modules
- **Top header bar** with app logo ("SOTA Custom Reporting Tool"), user avatar, notifications bell, and a global search bar
- **Role-based greeting** (CEO / Manager / Employee persona selector in mock mode)
- Brand theming: green primary (#019e4e), black accents, clean white backgrounds
- Responsive design optimized for laptop (primary device)

---

## 2. Feature Module: Excel to Dashboard
- **File upload zone** (drag-and-drop or click) accepting .xlsx/.csv files
- **Data preview table** showing parsed rows with auto-detected columns
- **Auto-generated dashboard** with colorful charts (bar, pie, line, KPI cards) using Recharts
- Column mapping UI to assign fields (e.g., MPN, Supplier, Cost)
- Export dashboard as image or data summary

## 3. Feature Module: Excel to Quote
- **Multi-step workflow wizard**: BOM Upload → RFQ Generation → Feasibility Check → Costed BOM → Sales Quote
- Progress tracker bar showing current stage
- BOM file upload with data validation and cleansing preview
- Mock RFQ mailer preview and supplier tracking table
- Final quote summary card with margin analysis charts

## 4. Feature Module: AI Insights Pro
- **Chat interface** with conversational UI (message bubbles)
- Pre-built sample queries ("Which components from Mouser are delayed?", "Show spend by commodity")
- Mock AI responses with charts, tables, and narrative summaries
- "Action triggers" buttons on insights (e.g., "Draft RFQ", "Update Lead Time")
- Anomaly & trend detection cards in a sidebar panel

## 5. Feature Module: AI Bridge for SAP
- **Connection status panel** (mock connected/disconnected state)
- SAP data sync dashboard showing last sync time, delta changes count
- Table browser to explore mapped SAP tables (BOMs, Lead Times, Quality Gates)
- Predictive alert cards (e.g., "Shortage risk for MPN-X in 14 days")
- One-click export-to-insight button

## 6. Feature Module: Drag & Drop Builder
- **Visual canvas** with a grid layout where users drag data blocks (KPI card, chart, table, filter)
- Left panel with draggable widget palette (bar chart, pie chart, metric card, data table, filter dropdown)
- Live data preview as blocks are placed
- Save/load report layouts
- Pre-populated with sample manufacturing data

## 7. Feature Module: Pre-Engineered Reports
- **Report catalog** organized by department (Purchasing, Production, Finance, Sales, Quality)
- One-click generation for each report type:
  - Commodity-wise Spend Analysis
  - BOM & Component-Level breakdown
  - Customer-wise Sales (Day/Month/Year)
  - Inventory, IQC, GRN POs
  - Aging Analysis (Customer & Supplier)
  - MPNs exceeding 120-day lead time
  - Org/Dept/BOM-wise drilldown
- Colorful, print-ready report layouts with drill-down capability
- "Trending" section showing most-used reports across the org

## 8. Feature Module: Template Library
- **Template gallery** with cards showing preview thumbnails
- Categories: ISTVON, Commodity Mapping, BOM Input, RFQ Input, Line Card, Premium (Material Pricing, Surface Finish, Machine Hour Rate)
- Download, duplicate, or use as starting point
- Template detail view with field descriptions

---

## 9. Admin Panel
A dedicated `/admin` route with tabbed navigation for managing platform settings:

- **Agents Tab** — Toggle each of the 7 feature agents on/off, set priority, assign developer/expert, configure basic behavior (e.g., AI fallback to manual entry)
- **Master Data Tab** — CRUD forms (with mock data) for: Customers, Commodities, Manufacturers, Suppliers, Sub-Contractors, Line Cards, Departments, Assembly Stations, Equipment, Quality Gates
- **Schema Tab** — View/edit data schema mappings (column names, types, source mapping)
- **Users & Roles Tab** — Mock user list with role assignment (CEO, Manager, Employee)
- **Settings Tab** — Brand colors, notification preferences (email alerts on failure), data retention rules

---

## 10. Data & Mock Layer
- Realistic sample datasets for EMS/sourcing: MPNs, suppliers, BOMs, projects, costs
- All data stored in-memory/local state (React state + context)
- Structured to easily swap with Supabase backend later
- Data service layer with clean interfaces for each entity

---

## Pages & Routes
| Route | Page |
|---|---|
| `/` | Main Dashboard (overview KPIs + quick access to all modules) |
| `/excel-dashboard` | Excel to Dashboard |
| `/excel-quote` | Excel to Quote |
| `/ai-insights` | AI Insights Pro |
| `/sap-bridge` | AI Bridge for SAP |
| `/drag-drop` | Drag & Drop Builder |
| `/reports` | Pre-Engineered Reports |
| `/templates` | Template Library |
| `/admin` | Admin Panel |

