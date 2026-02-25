import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Plug, RefreshCw, AlertTriangle, CheckCircle2, Clock, Database, ArrowRight } from "lucide-react";
import { sapTables } from "@/data/mockData";

const alerts = [
  { level: "critical", message: "Shortage risk for TUSB320IRWBR in 14 days", action: "View Component" },
  { level: "warning", message: "VBAP (Sales Orders) table sync is 10h stale", action: "Force Sync" },
  { level: "info", message: "New quality gate QG-042 detected in SAP", action: "Review" },
];

export default function SapBridge() {
  const [connected, setConnected] = useState(true);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2 text-indigo"><Plug className="h-6 w-6 text-primary" /> AI Bridge for SAP</h1>
        <p className="text-muted-foreground">Integrate and sync data from SAP ERP systems.</p>
      </div>

      {/* Connection Status */}
      <Card className="shadow-sm">
        <CardContent className="p-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${connected ? "bg-primary/10" : "bg-destructive/10"}`}>
              <Database className={`h-6 w-6 ${connected ? "text-primary" : "text-destructive"}`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="font-semibold">SAP ECC 6.0 — Production</p>
                <Badge className={connected ? "bg-primary/10 text-primary hover:bg-primary/20" : ""}>{connected ? "Connected" : "Disconnected"}</Badge>
              </div>
              <p className="text-xs text-muted-foreground">Last sync: Feb 24, 2026 08:30 AM • Delta changes: 1,247</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Connection</span>
              <Switch checked={connected} onCheckedChange={setConnected} />
            </div>
            <Button variant="outline" size="sm" className="gap-1"><RefreshCw className="h-3.5 w-3.5" />Sync Now</Button>
          </div>
        </CardContent>
      </Card>

      {/* Predictive Alerts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {alerts.map((a, i) => (
          <Card key={i} className={`shadow-sm ${a.level === "critical" ? "border-destructive/30" : a.level === "warning" ? "border-amber/30" : ""}`}>
            <CardContent className="p-4 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                {a.level === "critical" && <AlertTriangle className="h-4 w-4 text-destructive" />}
                {a.level === "warning" && <Clock className="h-4 w-4 text-amber" />}
                {a.level === "info" && <CheckCircle2 className="h-4 w-4 text-primary" />}
                <Badge variant={a.level === "critical" ? "destructive" : "outline"} className={a.level === "warning" ? "border-amber/40 text-amber" : ""}>{a.level}</Badge>
              </div>
              <p className="text-sm">{a.message}</p>
              <Button variant="ghost" size="sm" className="w-fit text-xs gap-1">{a.action} <ArrowRight className="h-3 w-3" /></Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table Browser */}
      <Card className="shadow-sm">
        <CardHeader className="pb-2"><CardTitle className="text-base text-indigo">SAP Table Browser</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Table</TableHead><TableHead>Description</TableHead><TableHead>Records</TableHead>
                <TableHead>Last Sync</TableHead><TableHead>Status</TableHead><TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sapTables.map((t) => (
                <TableRow key={t.name} className="hover:bg-primary/5">
                  <TableCell className="font-mono font-medium">{t.name}</TableCell>
                  <TableCell>{t.description}</TableCell>
                  <TableCell>{t.records.toLocaleString()}</TableCell>
                  <TableCell className="text-xs">{t.lastSync}</TableCell>
                  <TableCell>
                    <Badge variant={t.status === "synced" ? "outline" : "destructive"} className={t.status === "synced" ? "text-primary border-primary/30" : ""}>
                      {t.status}
                    </Badge>
                  </TableCell>
                  <TableCell><Button variant="ghost" size="sm" className="text-xs">Export to Insights</Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
