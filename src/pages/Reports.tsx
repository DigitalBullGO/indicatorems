import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FileText, TrendingUp, Search, BarChart3, Download, Eye } from "lucide-react";
import { reportTypes, spendByCommodity, monthlyRevenue } from "@/data/mockData";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const COLORS = ["hsl(153,100%,31%)", "hsl(200,80%,50%)", "hsl(45,100%,55%)", "hsl(280,60%,55%)", "hsl(10,80%,55%)"];

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
        <h1 className="text-2xl font-bold flex items-center gap-2"><FileText className="h-6 w-6 text-primary" />Pre-Engineered Reports</h1>
        <p className="text-muted-foreground">One-click access to 20+ standard manufacturing reports.</p>
      </div>

      {/* Trending */}
      <div>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1"><TrendingUp className="h-4 w-4" />Trending Reports</h2>
        <div className="flex gap-2 flex-wrap">
          {trending.map((r) => (
            <Button key={r.id} variant="outline" size="sm" className="gap-1 text-xs" onClick={() => setSelectedReport(r.id)}>
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
            <Card key={r.id} className={`cursor-pointer hover:border-primary/40 transition-all ${selectedReport === r.id ? "border-primary ring-1 ring-primary/20" : ""}`} onClick={() => setSelectedReport(r.id)}>
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
        <Card className="h-fit">
          <CardHeader className="pb-2"><CardTitle className="text-base">Report Preview</CardTitle></CardHeader>
          <CardContent>
            {selectedReport === "spend-analysis" ? (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={spendByCommodity} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value" nameKey="name">
                    {spendByCommodity.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                  </Pie>
                  <Tooltip formatter={(v: number) => `$${(v / 1000).toFixed(0)}K`} />
                </PieChart>
              </ResponsiveContainer>
            ) : selectedReport ? (
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={monthlyRevenue.slice(0, 4)}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(0,0%,90%)" />
                  <XAxis dataKey="month" fontSize={11} />
                  <YAxis fontSize={11} />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="hsl(153,100%,31%)" radius={[3,3,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">Select a report to preview</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
