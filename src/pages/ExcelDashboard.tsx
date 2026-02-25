import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Upload, FileSpreadsheet, BarChart3, PieChart as PieIcon, TrendingUp, Sparkles } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const mockParsedData = [
  { MPN: "RC0402FR-07", Supplier: "Yageo", Commodity: "Passives", Cost: 1200, Qty: 100000 },
  { MPN: "STM32F407", Supplier: "Arrow", Commodity: "ICs", Cost: 8450, Qty: 1000 },
  { MPN: "TPS54302", Supplier: "Digi-Key", Commodity: "Power", Cost: 525, Qty: 250 },
  { MPN: "GRM155R71", Supplier: "Murata", Commodity: "Passives", Cost: 800, Qty: 100000 },
  { MPN: "744771133", Supplier: "Würth", Commodity: "Passives", Cost: 425, Qty: 500 },
];

const pieData = [
  { name: "Passives", value: 2425 }, { name: "ICs", value: 8450 }, { name: "Power", value: 525 },
];
const COLORS = ["hsl(153, 99%, 31%)", "hsl(232, 48%, 48%)", "hsl(45, 100%, 50%)"];

export default function ExcelDashboard() {
  const [uploaded, setUploaded] = useState(false);

  return (
    <div className="space-y-7">
      <div>
        <h1 className="text-2xl font-bold text-indigo">Excel to Dashboard</h1>
        <p className="text-sm font-semibold text-muted-foreground">Upload spreadsheets and auto-generate visual dashboards.</p>
      </div>

      {!uploaded ? (
        <Card className="border-dashed border-2 border-primary/30 gradient-card-warm card-premium">
          <CardContent className="py-20 flex flex-col items-center gap-5">
            <div className="h-20 w-20 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Upload className="h-10 w-10 text-primary" />
            </div>
            <div className="text-center">
              <p className="font-bold text-lg text-foreground">Drop your Excel or CSV file here</p>
              <p className="text-sm font-semibold text-muted-foreground mt-1">Supports .xlsx, .xls, .csv up to 50MB</p>
            </div>
            <Button onClick={() => setUploaded(true)} className="gap-2 btn-glow px-6 h-11 text-sm font-bold">
              <FileSpreadsheet className="h-4 w-4" /> Upload Sample Data
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="gap-1.5 px-3 py-1"><FileSpreadsheet className="h-3.5 w-3.5" /> sample_bom_data.xlsx</Badge>
            <Badge className="bg-primary/10 text-primary hover:bg-primary/20 font-bold">5 rows × 5 columns</Badge>
            <Button variant="ghost" size="sm" onClick={() => setUploaded(false)} className="font-semibold">Clear</Button>
          </div>

          {/* Data Preview - Elegant Table */}
          <Card className="card-premium border-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-bold text-indigo flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" /> Data Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg overflow-hidden border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-indigo/5 hover:bg-indigo/5">
                      {Object.keys(mockParsedData[0]).map((k) => (
                        <TableHead key={k} className="font-bold text-indigo text-xs uppercase tracking-wider">{k}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockParsedData.map((row, i) => (
                      <TableRow key={i} className={`transition-colors hover:bg-primary/5 ${i % 2 === 0 ? "bg-background" : "bg-muted/30"}`}>
                        {Object.values(row).map((v, j) => (
                          <TableCell key={j} className={`${typeof v === "number" ? "font-bold text-foreground tabular-nums" : "font-medium"}`}>
                            {typeof v === "number" ? v.toLocaleString() : v}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Auto Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <Card className="card-premium border-0">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-bold flex items-center gap-2 text-indigo">
                  <BarChart3 className="h-4 w-4 text-primary" />Cost by MPN
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={mockParsedData} barCategoryGap="20%">
                    <defs>
                      <linearGradient id="excelBarGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="hsl(153, 99%, 38%)" stopOpacity={1} />
                        <stop offset="100%" stopColor="hsl(153, 99%, 25%)" stopOpacity={0.85} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(210, 7%, 90%)" vertical={false} />
                    <XAxis dataKey="MPN" fontSize={11} stroke="hsl(210, 7%, 56%)" tickLine={false} axisLine={false} />
                    <YAxis fontSize={11} stroke="hsl(210, 7%, 56%)" tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ borderRadius: "10px", border: "none", boxShadow: "0 8px 24px -4px rgba(0,0,0,0.12)" }} />
                    <Bar dataKey="Cost" fill="url(#excelBarGrad)" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card className="card-premium border-0">
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-bold flex items-center gap-2 text-indigo">
                  <PieIcon className="h-4 w-4 text-primary" />Spend by Commodity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <defs>
                      {COLORS.map((c, i) => (
                        <linearGradient key={i} id={`excelPie${i}`} x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor={c} stopOpacity={1} />
                          <stop offset="100%" stopColor={c} stopOpacity={0.7} />
                        </linearGradient>
                      ))}
                    </defs>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" nameKey="name" label strokeWidth={2} stroke="hsl(0, 0%, 100%)">
                      {pieData.map((_, i) => <Cell key={i} fill={`url(#excelPie${i})`} />)}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: "10px", border: "none", boxShadow: "0 8px 24px -4px rgba(0,0,0,0.12)" }} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Total Cost", value: `$${mockParsedData.reduce((a, r) => a + r.Cost, 0).toLocaleString()}`, gradient: "gradient-card-warm" },
              { label: "Unique Suppliers", value: new Set(mockParsedData.map((r) => r.Supplier)).size, gradient: "gradient-card-indigo" },
              { label: "Components", value: mockParsedData.length, gradient: "gradient-card-teal" },
              { label: "Top Commodity", value: "ICs", gradient: "gradient-card-amber" },
            ].map((k) => (
              <Card key={k.label} className={`card-premium border-0 ${k.gradient}`}>
                <CardContent className="p-5 text-center">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{k.label}</p>
                  <p className="text-2xl font-extrabold mt-1.5 text-foreground tracking-tight">{k.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
