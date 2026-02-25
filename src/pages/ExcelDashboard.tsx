import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Upload, FileSpreadsheet, BarChart3, PieChart as PieIcon, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";

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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-indigo">Excel to Dashboard</h1>
        <p className="text-sm font-semibold text-muted-foreground">Upload spreadsheets and auto-generate visual dashboards.</p>
      </div>

      {!uploaded ? (
        <Card className="border-dashed border-2 border-primary/40">
          <CardContent className="py-16 flex flex-col items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Upload className="h-8 w-8 text-primary" />
            </div>
            <div className="text-center">
              <p className="font-semibold">Drop your Excel or CSV file here</p>
              <p className="text-sm text-muted-foreground">Supports .xlsx, .xls, .csv up to 50MB</p>
            </div>
            <Button onClick={() => setUploaded(true)} className="gap-2">
              <FileSpreadsheet className="h-4 w-4" /> Upload Sample Data
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="gap-1"><FileSpreadsheet className="h-3 w-3" /> sample_bom_data.xlsx</Badge>
            <Badge className="bg-primary/10 text-primary hover:bg-primary/20">5 rows × 5 columns</Badge>
            <Button variant="ghost" size="sm" onClick={() => setUploaded(false)}>Clear</Button>
          </div>

          {/* Data Preview */}
          <Card className="shadow-sm">
            <CardHeader className="pb-2"><CardTitle className="text-base text-indigo">Data Preview</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>{Object.keys(mockParsedData[0]).map((k) => <TableHead key={k}>{k}</TableHead>)}</TableRow>
                </TableHeader>
                <TableBody>
                  {mockParsedData.map((row, i) => (
                    <TableRow key={i} className="hover:bg-primary/5">
                      {Object.values(row).map((v, j) => <TableCell key={j}>{typeof v === "number" ? v.toLocaleString() : v}</TableCell>)}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Auto Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="shadow-sm">
              <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2 text-indigo"><BarChart3 className="h-4 w-4 text-primary" />Cost by MPN</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={mockParsedData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(210, 7%, 88%)" />
                    <XAxis dataKey="MPN" fontSize={11} stroke="hsl(210, 7%, 46%)" />
                    <YAxis fontSize={11} stroke="hsl(210, 7%, 46%)" />
                    <Tooltip />
                    <Bar dataKey="Cost" fill="hsl(153, 99%, 31%)" radius={[4,4,0,0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card className="shadow-sm">
              <CardHeader className="pb-2"><CardTitle className="text-base flex items-center gap-2 text-indigo"><PieIcon className="h-4 w-4 text-primary" />Spend by Commodity</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" nameKey="name" label>
                      {pieData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Total Cost", value: `$${mockParsedData.reduce((a, r) => a + r.Cost, 0).toLocaleString()}` },
              { label: "Unique Suppliers", value: new Set(mockParsedData.map((r) => r.Supplier)).size },
              { label: "Components", value: mockParsedData.length },
              { label: "Top Commodity", value: "ICs" },
            ].map((k) => (
              <Card key={k.label} className="shadow-sm">
                <CardContent className="p-4 text-center">
                  <p className="text-xs font-semibold text-muted-foreground uppercase">{k.label}</p>
                  <p className="text-xl font-bold mt-1 text-foreground">{k.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
