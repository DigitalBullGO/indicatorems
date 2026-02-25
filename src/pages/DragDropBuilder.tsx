import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LayoutGrid, BarChart3, PieChart, Table2, SlidersHorizontal, Hash, GripVertical, Plus, Save, Trash2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RPieChart, Pie, Cell } from "recharts";
import { monthlyRevenue, spendByCommodity } from "@/data/mockData";

interface Widget {
  id: string;
  type: "kpi" | "bar" | "pie" | "table";
  title: string;
}

const widgetPalette = [
  { type: "kpi" as const, label: "KPI Card", icon: Hash },
  { type: "bar" as const, label: "Bar Chart", icon: BarChart3 },
  { type: "pie" as const, label: "Pie Chart", icon: PieChart },
  { type: "table" as const, label: "Data Table", icon: Table2 },
];

const COLORS = [
  "hsl(153, 99%, 31%)",
  "hsl(232, 48%, 48%)",
  "hsl(45, 100%, 50%)",
  "hsl(353, 33%, 58%)",
  "hsl(210, 7%, 46%)",
];

let widgetCounter = 0;

export default function DragDropBuilder() {
  const [widgets, setWidgets] = useState<Widget[]>([
    { id: "w1", type: "kpi", title: "Total Revenue" },
    { id: "w2", type: "bar", title: "Monthly Revenue" },
  ]);

  const addWidget = (type: Widget["type"]) => {
    widgetCounter++;
    const labels = { kpi: "KPI Card", bar: "Bar Chart", pie: "Pie Chart", table: "Data Table" };
    setWidgets((w) => [...w, { id: `w-${widgetCounter}`, type, title: labels[type] }]);
  };

  const removeWidget = (id: string) => setWidgets((w) => w.filter((x) => x.id !== id));

  return (
    <div className="flex gap-6 h-[calc(100vh-10rem)]">
      {/* Palette */}
      <div className="w-56 shrink-0 space-y-3">
        <h2 className="text-sm font-semibold text-indigo uppercase tracking-wider">Widgets</h2>
        {widgetPalette.map((w) => (
          <Button key={w.type} variant="outline" className="w-full justify-start gap-2 hover:border-primary/40" onClick={() => addWidget(w.type)}>
            <w.icon className="h-4 w-4 text-primary" />
            {w.label}
            <Plus className="h-3 w-3 ml-auto text-muted-foreground" />
          </Button>
        ))}
        <div className="border-t pt-3 space-y-2">
          <Button className="w-full gap-2" size="sm"><Save className="h-3.5 w-3.5" />Save Layout</Button>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2 text-indigo"><LayoutGrid className="h-6 w-6 text-primary" />Drag & Drop Builder</h1>
            <p className="text-muted-foreground text-sm">Click widgets to add them to the canvas.</p>
          </div>
          <Badge variant="outline">{widgets.length} widgets</Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {widgets.map((w) => (
            <Card key={w.id} className="group relative shadow-sm hover:shadow-md transition-shadow hover:border-primary/30">
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeWidget(w.id)}>
                  <Trash2 className="h-3 w-3" />
                </Button>
                <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab mt-1" />
              </div>
              <CardHeader className="pb-2"><CardTitle className="text-sm text-indigo">{w.title}</CardTitle></CardHeader>
              <CardContent>
                {w.type === "kpi" && (
                  <div className="text-center py-4">
                    <p className="text-3xl font-bold text-foreground">$14.8M</p>
                    <p className="text-xs text-muted-foreground mt-1">Total Revenue YTD</p>
                  </div>
                )}
                {w.type === "bar" && (
                  <ResponsiveContainer width="100%" height={180}>
                    <BarChart data={monthlyRevenue.slice(0, 5)}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(210, 7%, 88%)" />
                      <XAxis dataKey="month" fontSize={11} stroke="hsl(210, 7%, 46%)" />
                      <YAxis fontSize={11} tickFormatter={(v) => `${v / 1e6}M`} stroke="hsl(210, 7%, 46%)" />
                      <Tooltip />
                      <Bar dataKey="revenue" fill="hsl(153, 99%, 31%)" radius={[3,3,0,0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
                {w.type === "pie" && (
                  <ResponsiveContainer width="100%" height={180}>
                    <RPieChart>
                      <Pie data={spendByCommodity} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value" nameKey="name">
                        {spendByCommodity.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                      </Pie>
                      <Tooltip />
                    </RPieChart>
                  </ResponsiveContainer>
                )}
                {w.type === "table" && (
                  <div className="text-xs space-y-1">
                    {["Mouser — $245K", "Digi-Key — $180K", "Arrow — $310K", "Würth — $95K"].map((r) => (
                      <div key={r} className="flex justify-between p-2 bg-muted/50 rounded hover:bg-primary/5 transition-colors">{r.split(" — ").map((p, i) => <span key={i} className={i === 1 ? "font-medium" : ""}>{p}</span>)}</div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          {widgets.length === 0 && (
            <div className="col-span-2 border-2 border-dashed border-primary/20 rounded-lg p-12 text-center text-muted-foreground">
              <LayoutGrid className="h-10 w-10 mx-auto mb-3 text-muted-foreground/40" />
              <p className="font-medium">Canvas is empty</p>
              <p className="text-sm">Click a widget from the left panel to add it.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
