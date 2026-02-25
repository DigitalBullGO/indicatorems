import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, TrendingUp, Search, BarChart3, Download, Eye } from "lucide-react";
import { reportTypes, spendByCommodity } from "@/data/mockData";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const COLORS = [
  "hsl(177, 55%, 39%)",   // Slate Teal
  "hsl(232, 48%, 48%)",   // Deep Indigo
  "hsl(45, 100%, 50%)",   // Amber Gold
  "hsl(353, 33%, 58%)",   // Dusty Rose
  "hsl(210, 7%, 46%)",    // Cool Gray
];

// Report-specific preview datasets
const bomBreakdownData = [
  { name: "ICs", value: 42 },
  { name: "Passives", value: 28 },
  { name: "Connectors", value: 15 },
  { name: "PCBs", value: 10 },
  { name: "Power", value: 5 },
];

const supplierScorecardData = [
  { name: "Mouser", otd: 96, quality: 99.2 },
  { name: "Digi-Key", otd: 98, quality: 99.5 },
  { name: "Arrow", otd: 91, quality: 98.8 },
  { name: "Würth", otd: 88, quality: 99.0 },
];

const leadTimeData = [
  { name: "TUSB320", days: 130 },
  { name: "STM32F4", days: 56 },
  { name: "744771", days: 35 },
  { name: "SN74LVC", days: 28 },
  { name: "GRM155", days: 21 },
];

const inventoryData = [
  { name: "Passives", value: 520000 },
  { name: "ICs", value: 48400 },
  { name: "Power", value: 20500 },
  { name: "Connectors", value: 12000 },
];

const grnData = [
  { name: "Jan", received: 45, pending: 12 },
  { name: "Feb", received: 52, pending: 8 },
  { name: "Mar", received: 61, pending: 15 },
  { name: "Apr", received: 48, pending: 6 },
];

const qualityData = [
  { name: "Line A", yield: 99.2 },
  { name: "Line B", yield: 98.7 },
  { name: "Line C", yield: 99.5 },
  { name: "Line D", yield: 97.8 },
];

const agingData = [
  { name: "0-30d", value: 45 },
  { name: "31-60d", value: 28 },
  { name: "61-90d", value: 15 },
  { name: "90+d", value: 8 },
];

const salesData = [
  { name: "EMEA", value: 7840 },
  { name: "Americas", value: 5070 },
  { name: "APAC", value: 1870 },
];

function getReportPreview(reportId: string) {
  switch (reportId) {
    case "spend-analysis":
      return (
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie data={spendByCommodity} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value" nameKey="name">
              {spendByCommodity.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
            </Pie>
            <Tooltip formatter={(v: number) => `$${(v / 1000).toFixed(0)}K`} />
          </PieChart>
        </ResponsiveContainer>
      );
    case "bom-breakdown":
      return (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={bomBreakdownData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(210, 7%, 88%)" horizontal={false} />
            <XAxis type="number" fontSize={11} stroke="hsl(210, 7%, 46%)" />
            <YAxis dataKey="name" type="category" fontSize={11} stroke="hsl(210, 7%, 46%)" width={70} />
            <Tooltip formatter={(v: number) => `${v}%`} />
            <Bar dataKey="value" fill="hsl(177, 55%, 39%)" radius={[0, 3, 3, 0]} />
          </BarChart>
        </ResponsiveContainer>
      );
    case "supplier-scorecard":
      return (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={supplierScorecardData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(210, 7%, 88%)" />
            <XAxis dataKey="name" fontSize={11} stroke="hsl(210, 7%, 46%)" />
            <YAxis fontSize={11} stroke="hsl(210, 7%, 46%)" domain={[80, 100]} />
            <Tooltip />
            <Bar dataKey="otd" fill="hsl(177, 55%, 39%)" radius={[3, 3, 0, 0]} name="OTD %" />
            <Bar dataKey="quality" fill="hsl(353, 33%, 58%)" radius={[3, 3, 0, 0]} name="Quality %" />
          </BarChart>
        </ResponsiveContainer>
      );
    case "lead-time-120":
      return (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={leadTimeData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(210, 7%, 88%)" />
            <XAxis dataKey="name" fontSize={10} stroke="hsl(210, 7%, 46%)" />
            <YAxis fontSize={11} stroke="hsl(210, 7%, 46%)" />
            <Tooltip formatter={(v: number) => `${v} days`} />
            <Bar dataKey="days" fill="hsl(45, 100%, 50%)" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      );
    case "inventory":
      return (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={inventoryData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(210, 7%, 88%)" />
            <XAxis dataKey="name" fontSize={11} stroke="hsl(210, 7%, 46%)" />
            <YAxis fontSize={11} stroke="hsl(210, 7%, 46%)" tickFormatter={(v) => `${(v/1000).toFixed(0)}K`} />
            <Tooltip formatter={(v: number) => v.toLocaleString()} />
            <Bar dataKey="value" fill="hsl(232, 48%, 48%)" radius={[3, 3, 0, 0]} name="Units" />
          </BarChart>
        </ResponsiveContainer>
      );
    case "grn-pos":
      return (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={grnData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(210, 7%, 88%)" />
            <XAxis dataKey="name" fontSize={11} stroke="hsl(210, 7%, 46%)" />
            <YAxis fontSize={11} stroke="hsl(210, 7%, 46%)" />
            <Tooltip />
            <Bar dataKey="received" fill="hsl(177, 55%, 39%)" radius={[3, 3, 0, 0]} name="Received" />
            <Bar dataKey="pending" fill="hsl(45, 100%, 50%)" radius={[3, 3, 0, 0]} name="Pending" />
          </BarChart>
        </ResponsiveContainer>
      );
    case "quality-yield":
      return (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={qualityData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(210, 7%, 88%)" />
            <XAxis dataKey="name" fontSize={11} stroke="hsl(210, 7%, 46%)" />
            <YAxis fontSize={11} stroke="hsl(210, 7%, 46%)" domain={[96, 100]} />
            <Tooltip formatter={(v: number) => `${v}%`} />
            <Bar dataKey="yield" fill="hsl(177, 55%, 39%)" radius={[3, 3, 0, 0]} name="Yield %" />
          </BarChart>
        </ResponsiveContainer>
      );
    case "aging-customer":
    case "aging-supplier":
      return (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={agingData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(210, 7%, 88%)" />
            <XAxis dataKey="name" fontSize={11} stroke="hsl(210, 7%, 46%)" />
            <YAxis fontSize={11} stroke="hsl(210, 7%, 46%)" />
            <Tooltip />
            <Bar dataKey="value" fill="hsl(353, 33%, 58%)" radius={[3, 3, 0, 0]} name="Count" />
          </BarChart>
        </ResponsiveContainer>
      );
    case "customer-sales":
      return (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(210, 7%, 88%)" />
            <XAxis dataKey="name" fontSize={11} stroke="hsl(210, 7%, 46%)" />
            <YAxis fontSize={11} stroke="hsl(210, 7%, 46%)" tickFormatter={(v) => `$${(v/1000).toFixed(0)}K`} />
            <Tooltip formatter={(v: number) => `$${(v/1000).toFixed(0)}K`} />
            <Bar dataKey="value" fill="hsl(232, 48%, 48%)" radius={[3, 3, 0, 0]} name="Revenue" />
          </BarChart>
        </ResponsiveContainer>
      );
    case "org-drilldown":
      return (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={bomBreakdownData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(210, 7%, 88%)" horizontal={false} />
            <XAxis type="number" fontSize={11} stroke="hsl(210, 7%, 46%)" />
            <YAxis dataKey="name" type="category" fontSize={11} stroke="hsl(210, 7%, 46%)" width={70} />
            <Tooltip />
            <Bar dataKey="value" fill="hsl(177, 55%, 39%)" radius={[0, 3, 3, 0]} />
          </BarChart>
        </ResponsiveContainer>
      );
    case "iqc-report":
      return (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={qualityData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(210, 7%, 88%)" />
            <XAxis dataKey="name" fontSize={11} stroke="hsl(210, 7%, 46%)" />
            <YAxis fontSize={11} stroke="hsl(210, 7%, 46%)" domain={[96, 100]} />
            <Tooltip formatter={(v: number) => `${v}%`} />
            <Bar dataKey="yield" fill="hsl(45, 100%, 50%)" radius={[3, 3, 0, 0]} name="Pass Rate %" />
          </BarChart>
        </ResponsiveContainer>
      );
    default:
      return <p className="text-sm text-muted-foreground text-center py-8">Select a report to preview</p>;
  }
}

export default function Reports() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedReport, setSelectedReport] = useState<string | null>(null);

  const departments = ["all", ...new Set(reportTypes.map((r) => r.department))];
  const filtered = reportTypes.filter((r) => (filter === "all" || r.department === filter) && r.name.toLowerCase().includes(search.toLowerCase()));
  const trending = reportTypes.filter((r) => r.trending);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2 text-indigo"><FileText className="h-6 w-6 text-primary" />Pre-Engineered Reports</h1>
        <p className="text-sm font-semibold text-muted-foreground">One-click access to 20+ standard manufacturing reports.</p>
      </div>

      {/* Trending */}
      <div>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1"><TrendingUp className="h-4 w-4 text-primary" />Trending Reports</h2>
        <div className="flex gap-2 flex-wrap">
          {trending.map((r) => (
            <Button key={r.id} variant="outline" size="sm" className="gap-1 text-xs hover:border-primary/40" onClick={() => setSelectedReport(r.id)}>
              <BarChart3 className="h-3 w-3 text-primary" />{r.name}
              <Badge variant="secondary" className="ml-1 text-[10px]">{r.usageCount}</Badge>
            </Button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search reports…" className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
          <SelectContent>
            {departments.map((d) => <SelectItem key={d} value={d}>{d === "all" ? "All Departments" : d}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Report Grid + Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filtered.map((r) => (
            <Card key={r.id} className={`cursor-pointer hover:border-primary/40 hover:shadow-md transition-all shadow-sm ${selectedReport === r.id ? "border-primary ring-1 ring-primary/20" : ""}`} onClick={() => setSelectedReport(r.id)}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-sm">{r.name}</p>
                    <Badge variant="outline" className="text-[10px] mt-1">{r.department}</Badge>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">{r.usageCount} uses</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <Button variant="ghost" size="sm" className="text-xs gap-1 h-7"><Eye className="h-3 w-3" />Preview</Button>
                  <Button variant="ghost" size="sm" className="text-xs gap-1 h-7"><Download className="h-3 w-3" />Export</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Preview Panel */}
        <Card className="h-fit card-premium shadow-sm">
          <CardHeader className="pb-2"><CardTitle className="text-base text-indigo">Report Preview</CardTitle></CardHeader>
          <CardContent>
            {selectedReport ? getReportPreview(selectedReport) : (
              <p className="text-sm text-muted-foreground text-center py-8">Select a report to preview</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
