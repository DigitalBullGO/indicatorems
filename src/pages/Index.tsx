import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BarChart3, FileSpreadsheet, Brain, Plug, LayoutGrid, FileText, Library,
  TrendingUp, TrendingDown, Package, Users, Clock, CheckCircle2, AlertTriangle, DollarSign
} from "lucide-react";
import { Link } from "react-router-dom";
import { kpiData, monthlyRevenue, spendByCommodity, departmentSpend, components } from "@/data/mockData";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend
} from "recharts";

const moduleCards = [
  { title: "Excel to Dashboard", icon: BarChart3, url: "/excel-dashboard", desc: "Upload & visualize spreadsheets" },
  { title: "Excel to Quote", icon: FileSpreadsheet, url: "/excel-quote", desc: "BOM to sales quote pipeline" },
  { title: "AI Insights Pro", icon: Brain, url: "/ai-insights", desc: "Conversational data analysis" },
  { title: "AI Bridge for SAP", icon: Plug, url: "/sap-bridge", desc: "SAP ERP data integration" },
  { title: "Drag & Drop Builder", icon: LayoutGrid, url: "/drag-drop", desc: "Visual report builder" },
  { title: "Pre-Engineered Reports", icon: FileText, url: "/reports", desc: "20+ standard reports" },
  { title: "Template Library", icon: Library, url: "/templates", desc: "Ready-to-use templates" },
];

const COLORS = ["hsl(153,100%,31%)", "hsl(200,80%,50%)", "hsl(45,100%,55%)", "hsl(280,60%,55%)", "hsl(10,80%,55%)"];

export default function Index() {
  const shortages = components.filter((c) => c.leadTime > 100);

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-bold">Welcome back, Rajesh 👋</h1>
        <p className="text-muted-foreground">Here's your manufacturing operations overview.</p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Revenue", value: `$${(kpiData.totalRevenue / 1e6).toFixed(1)}M`, icon: DollarSign, trend: "+12.3%", up: true },
          { label: "Active Projects", value: kpiData.activeProjects, icon: Package, trend: "+2", up: true },
          { label: "Open POs", value: kpiData.openPOs, icon: Clock, trend: "-8", up: false },
          { label: "On-Time Delivery", value: `${kpiData.onTimeDelivery}%`, icon: CheckCircle2, trend: "+1.2%", up: true },
        ].map((kpi) => (
          <Card key={kpi.label}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{kpi.label}</p>
                  <p className="text-2xl font-bold mt-1">{kpi.value}</p>
                  <div className="flex items-center gap-1 mt-1">
                    {kpi.up ? <TrendingUp className="h-3 w-3 text-primary" /> : <TrendingDown className="h-3 w-3 text-destructive" />}
                    <span className={`text-xs font-medium ${kpi.up ? "text-primary" : "text-destructive"}`}>{kpi.trend}</span>
                  </div>
                </div>
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <kpi.icon className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Revenue Trend */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Monthly Revenue & Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={monthlyRevenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(0,0%,90%)" />
                <XAxis dataKey="month" fontSize={12} />
                <YAxis yAxisId="left" fontSize={12} tickFormatter={(v) => `$${v / 1e6}M`} />
                <YAxis yAxisId="right" orientation="right" fontSize={12} />
                <Tooltip formatter={(value: number, name: string) => [name === "revenue" ? `$${(value / 1e6).toFixed(2)}M` : value, name === "revenue" ? "Revenue" : "Orders"]} />
                <Legend />
                <Bar yAxisId="left" dataKey="revenue" fill="hsl(153,100%,31%)" radius={[4, 4, 0, 0]} name="Revenue" />
                <Line yAxisId="right" type="monotone" dataKey="orders" stroke="hsl(200,80%,50%)" strokeWidth={2} name="Orders" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Spend by Commodity */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Spend by Commodity</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={spendByCommodity} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" nameKey="name" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={11}>
                  {spendByCommodity.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: number) => `$${(v / 1000).toFixed(0)}K`} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      {shortages.length > 0 && (
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="p-4 flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
            <div>
              <p className="font-medium text-sm">Component Lead Time Alerts</p>
              <p className="text-xs text-muted-foreground mt-1">
                {shortages.map((c) => c.mpn).join(", ")} — exceeding 120-day lead time threshold.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Module Quick Access */}
      <div>
        <h2 className="text-lg font-semibold mb-3">Feature Modules</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {moduleCards.map((m) => (
            <Link key={m.url} to={m.url}>
              <Card className="hover:border-primary/40 hover:shadow-md transition-all cursor-pointer h-full">
                <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <m.icon className="h-5 w-5 text-primary" />
                  </div>
                  <p className="text-xs font-medium leading-tight">{m.title}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Dept Budget vs Actual */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Department Budget vs Actual</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={departmentSpend} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(0,0%,90%)" />
              <XAxis type="number" fontSize={12} tickFormatter={(v) => `$${v / 1e6}M`} />
              <YAxis dataKey="department" type="category" fontSize={12} width={90} />
              <Tooltip formatter={(v: number) => `$${(v / 1e6).toFixed(2)}M`} />
              <Legend />
              <Bar dataKey="budget" fill="hsl(153,100%,31%)" radius={[0, 4, 4, 0]} name="Budget" />
              <Bar dataKey="actual" fill="hsl(200,80%,50%)" radius={[0, 4, 4, 0]} name="Actual" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
