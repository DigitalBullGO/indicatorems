import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { FileSpreadsheet, BarChart3, TrendingUp, AlertTriangle, Package, ClipboardList } from "lucide-react";
import type { ReportTemplate } from "@/data/templateData";

interface Props {
  template: ReportTemplate | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const reportPreviews: Record<string, { columns: string[]; sampleRows: string[][]; kpis: { label: string; value: string; icon: React.ReactNode }[] }> = {
  "rt-11": {
    columns: ["Part Number", "Description", "Supplier", "Stock Qty", "Monthly Usage", "Weeks of Supply", "Risk Level"],
    sampleRows: [
      ["CAP-100UF-16V", "100µF 16V MLCC", "Yageo", "2,400", "8,000", "1.2", "🔴 Critical"],
      ["RES-10K-0402", "10KΩ 0402 Resistor", "Samsung", "45,000", "12,000", "15.0", "🟢 Safe"],
      ["IC-STM32F4", "MCU ARM Cortex-M4", "ST Micro", "800", "2,500", "1.3", "🔴 Critical"],
      ["CON-USB-C", "USB Type-C Connector", "Molex", "5,200", "3,000", "6.9", "🟡 Watch"],
    ],
    kpis: [
      { label: "Total Parts Tracked", value: "1,247", icon: <Package className="h-4 w-4" /> },
      { label: "Critical Shortages", value: "23", icon: <AlertTriangle className="h-4 w-4 text-destructive" /> },
      { label: "Watch List", value: "58", icon: <TrendingUp className="h-4 w-4 text-amber-500" /> },
    ],
  },
  "rt-12": {
    columns: ["Supplier", "OTD %", "Quality PPM", "Cost Variance", "Lead Time (Days)", "Overall Score", "Rating"],
    sampleRows: [
      ["Yageo Corp", "94.2%", "320", "-2.1%", "21", "87/100", "⭐ A"],
      ["Samsung Electro", "98.5%", "85", "+1.4%", "14", "94/100", "⭐ A+"],
      ["Molex Inc", "88.1%", "520", "+3.8%", "28", "72/100", "🔶 B"],
      ["Amphenol", "91.7%", "210", "0.0%", "18", "83/100", "⭐ A"],
    ],
    kpis: [
      { label: "Suppliers Evaluated", value: "34", icon: <ClipboardList className="h-4 w-4" /> },
      { label: "Avg OTD", value: "93.1%", icon: <TrendingUp className="h-4 w-4" /> },
      { label: "Avg Quality PPM", value: "284", icon: <BarChart3 className="h-4 w-4" /> },
    ],
  },
  "rt-13": {
    columns: ["Commodity", "Total Spend", "% of Total", "# Suppliers", "Top Supplier", "YoY Change"],
    sampleRows: [
      ["Passive Components", "$2.4M", "28%", "8", "Yageo", "+5.2%"],
      ["Semiconductors/ICs", "$3.1M", "36%", "12", "ST Micro", "+12.8%"],
      ["Connectors", "$1.2M", "14%", "5", "Molex", "-1.3%"],
      ["PCB & Substrates", "$1.0M", "12%", "3", "AT&S", "+3.7%"],
    ],
    kpis: [
      { label: "Total Annual Spend", value: "$8.6M", icon: <BarChart3 className="h-4 w-4" /> },
      { label: "Commodity Groups", value: "9", icon: <Package className="h-4 w-4" /> },
      { label: "Active Suppliers", value: "42", icon: <ClipboardList className="h-4 w-4" /> },
    ],
  },
  "rt-14": {
    columns: ["PO Number", "Supplier", "Part", "PO Date", "Due Date", "Days Open", "Aging Bucket", "Status"],
    sampleRows: [
      ["PO-8842", "Yageo", "CAP-100UF", "2026-01-10", "2026-02-10", "46", "30-60 Days", "🟡 At Risk"],
      ["PO-8901", "ST Micro", "IC-STM32", "2026-01-25", "2026-03-25", "31", "30-60 Days", "🟢 On Track"],
      ["PO-8756", "Molex", "CON-USB-C", "2025-12-15", "2026-01-30", "72", "60-90 Days", "🔴 Overdue"],
      ["PO-9012", "Samsung", "RES-10K", "2026-02-01", "2026-02-28", "25", "0-30 Days", "🟢 On Track"],
    ],
    kpis: [
      { label: "Open POs", value: "187", icon: <ClipboardList className="h-4 w-4" /> },
      { label: "Overdue", value: "14", icon: <AlertTriangle className="h-4 w-4 text-destructive" /> },
      { label: "Avg Days Open", value: "38", icon: <TrendingUp className="h-4 w-4" /> },
    ],
  },
  "rt-15": {
    columns: ["Commodity", "Avg Inventory ($)", "COGS ($)", "Turnover Ratio", "Days of Inventory", "Target", "Status"],
    sampleRows: [
      ["Passives", "$420K", "$2.4M", "5.7x", "64", "8.0x", "🟡 Below Target"],
      ["Semiconductors", "$680K", "$3.1M", "4.6x", "79", "6.0x", "🔴 Below Target"],
      ["Connectors", "$180K", "$1.2M", "6.7x", "54", "6.0x", "🟢 On Target"],
      ["PCBs", "$150K", "$1.0M", "6.7x", "54", "7.0x", "🟡 Below Target"],
    ],
    kpis: [
      { label: "Overall Turnover", value: "5.4x", icon: <TrendingUp className="h-4 w-4" /> },
      { label: "Total Inventory", value: "$1.9M", icon: <Package className="h-4 w-4" /> },
      { label: "Days of Supply", value: "67", icon: <BarChart3 className="h-4 w-4" /> },
    ],
  },
};

export default function ReportPreviewModal({ template, open, onOpenChange }: Props) {
  if (!template) return null;

  const preview = reportPreviews[template.id];
  if (!preview) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-primary" />
            {template.title}
            <Badge variant="outline" className="ml-2 text-xs">Preview</Badge>
          </DialogTitle>
          <DialogDescription>{template.subtitle}</DialogDescription>
        </DialogHeader>

        {/* KPI Cards */}
        <div className="grid grid-cols-3 gap-3 mt-2">
          {preview.kpis.map((kpi) => (
            <div key={kpi.label} className="rounded-lg border bg-muted/30 p-3 text-center">
              <div className="flex items-center justify-center gap-1.5 text-muted-foreground mb-1">
                {kpi.icon}
                <span className="text-xs font-medium">{kpi.label}</span>
              </div>
              <p className="text-xl font-bold">{kpi.value}</p>
            </div>
          ))}
        </div>

        {/* Sample Table */}
        <div className="rounded-lg border overflow-hidden mt-2">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-muted/60">
                  {preview.columns.map((col) => (
                    <th key={col} className="px-3 py-2 text-left font-semibold whitespace-nowrap">{col}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {preview.sampleRows.map((row, i) => (
                  <tr key={i} className={i % 2 === 0 ? "bg-background" : "bg-muted/20"}>
                    {row.map((cell, j) => (
                      <td key={j} className="px-3 py-2 whitespace-nowrap">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <p className="text-xs text-muted-foreground text-center mt-1">
          Sample data shown above. Upload your data file to generate a full report.
        </p>
      </DialogContent>
    </Dialog>
  );
}
