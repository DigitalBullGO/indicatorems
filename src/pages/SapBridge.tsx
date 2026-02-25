import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Plug, RefreshCw, AlertTriangle, CheckCircle2, Clock, Database, Search, Lock, Shield, Zap, ArrowRight, ArrowLeft, Settings, Bell, Info } from "lucide-react";
import { sapTables, sapFieldMappings, sapAlertConfig, sapPurchaseOrders, sapAlerts } from "@/data/mockData";
import { toast } from "sonner";

const STEPS = [
  { num: 1, label: "Authenticate", icon: Plug },
  { num: 2, label: "Discover", icon: Search },
  { num: 3, label: "Sync & Map", icon: RefreshCw },
  { num: 4, label: "Alert Logic", icon: Bell },
];

const CATEGORIES = ["All", "Material", "Procurement", "Sales", "Quality", "Production"];

export default function SapBridge() {
  const [activeStep, setActiveStep] = useState(1);
  const [connected, setConnected] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [syncingTable, setSyncingTable] = useState<string | null>(null);
  const [syncProgress, setSyncProgress] = useState<Record<string, number>>({});
  const [deepSyncEnabled, setDeepSyncEnabled] = useState(false);
  const [alertToggles, setAlertToggles] = useState<Record<string, boolean>>(
    Object.fromEntries(sapAlertConfig.map(a => [a.id, a.enabled]))
  );

  const isStepLocked = (step: number) => step === 3 && !connected;

  const goToStep = (step: number) => {
    if (!isStepLocked(step)) setActiveStep(step);
  };

  const handleForceSync = useCallback((tableName: string) => {
    setSyncingTable(tableName);
    setSyncProgress(p => ({ ...p, [tableName]: 0 }));
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15 + 5;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setSyncingTable(null);
        toast.success(`${tableName} synced successfully`);
      }
      setSyncProgress(p => ({ ...p, [tableName]: Math.min(progress, 100) }));
    }, 200);
  }, []);

  const filteredTables = sapTables.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "All" || t.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2 text-indigo">
          <Plug className="h-6 w-6 text-primary" /> AI Bridge for SAP
        </h1>
        <p className="text-sm font-semibold text-muted-foreground">4-step wizard to authenticate, discover, sync, and monitor SAP data.</p>
      </div>

      {/* Stepper */}
      <div className="flex items-center justify-between px-4 py-3 bg-card rounded-xl border">
        {STEPS.map((step, i) => {
          const locked = isStepLocked(step.num);
          const isActive = activeStep === step.num;
          const isCompleted = activeStep > step.num;
          const Icon = step.icon;
          return (
            <div key={step.num} className="flex items-center gap-2 flex-1">
              <button
                onClick={() => goToStep(step.num)}
                disabled={locked}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-sm font-medium ${
                  locked ? "opacity-50 cursor-not-allowed text-muted-foreground" :
                  isActive ? "bg-teal/10 text-teal" :
                  isCompleted ? "bg-indigo/10 text-indigo" :
                  "text-muted-foreground hover:bg-muted"
                }`}
              >
                <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold border-2 ${
                  locked ? "border-muted-foreground bg-muted" :
                  isActive ? "border-teal bg-teal text-teal-foreground" :
                  isCompleted ? "border-indigo bg-indigo text-indigo-foreground" :
                  "border-muted-foreground"
                }`}>
                  {locked ? <Lock className="h-3.5 w-3.5" /> : isCompleted ? <CheckCircle2 className="h-4 w-4" /> : step.num}
                </div>
                <span className="hidden md:inline">{step.label}</span>
              </button>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 ${isCompleted ? "bg-indigo" : "bg-border"}`} />
              )}
            </div>
          );
        })}
      </div>

      {/* Step 1: Authenticate */}
      {activeStep === 1 && (
        <div className="space-y-4">
          <Card className="shadow-sm">
            <CardContent className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${connected ? "bg-primary/10" : "bg-destructive/10"}`}>
                  <Database className={`h-6 w-6 ${connected ? "text-primary" : "text-destructive"}`} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">SAP S/4HANA — Production</p>
                    <Badge className={connected ? "bg-primary/10 text-primary hover:bg-primary/20" : "bg-destructive/10 text-destructive"}>
                      {connected ? "Connected" : "Disconnected"}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">Last sync: Feb 24, 2026 08:30 AM • Delta changes: 1,247</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Connection</span>
                  <Switch checked={connected} onCheckedChange={setConnected} />
                </div>
                <Button variant="outline" size="sm" className="gap-1" onClick={() => toast.success("Sync initiated")}>
                  <RefreshCw className="h-3.5 w-3.5" />Sync Now
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Health Stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Latency", value: "12ms", icon: Zap, color: "text-primary" },
              { label: "Uptime", value: "99.8%", icon: Shield, color: "text-indigo" },
              { label: "Protocol", value: "RFC/BAPI", icon: Settings, color: "text-teal" },
            ].map(stat => (
              <Card key={stat.label} className="shadow-sm">
                <CardContent className="p-4 flex items-center gap-3">
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  <div>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                    <p className="font-semibold">{stat.value}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Licensing Banner */}
          <Card className="shadow-sm border-teal/30 bg-teal/5">
            <CardContent className="p-4 flex items-center gap-3">
              <Info className="h-5 w-5 text-teal shrink-0" />
              <div>
                <p className="text-sm font-medium">Digital Access — Read-Only Analytics Mode</p>
                <p className="text-xs text-muted-foreground">Licensed for indirect read access. Write operations require SAP Digital Access agreement.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Step 2: Discover */}
      {activeStep === 2 && (
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search tables by name or description..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={e => setCategoryFilter(e.target.value)}
              className="px-3 py-2 rounded-md border bg-background text-sm"
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-indigo">SAP Table Browser</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Table</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Columns</TableHead>
                    <TableHead>Key Fields</TableHead>
                    <TableHead>Records</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTables.map(t => (
                    <TableRow key={t.name} className={`hover:bg-primary/5 ${t.status === "stale" ? "bg-amber/5" : ""}`}>
                      <TableCell className="font-mono font-medium">{t.name}</TableCell>
                      <TableCell>{t.description}</TableCell>
                      <TableCell><Badge variant="outline" className="text-xs">{t.category}</Badge></TableCell>
                      <TableCell>{t.columns}</TableCell>
                      <TableCell className="font-mono text-xs">{t.keyFields.join(", ")}</TableCell>
                      <TableCell>{t.records.toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge variant={t.status === "synced" ? "outline" : "destructive"}
                          className={t.status === "synced" ? "text-primary border-primary/30" : "bg-amber/10 text-amber border-amber/30"}>
                          {t.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" className="text-xs"
                          onClick={() => toast.success(`${t.name} exported to AI Insights`)}>
                          Export to Insights
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Step 3: Sync & Map */}
      {activeStep === 3 && (
        <div className="space-y-4">
          {/* Sync Status */}
          <Card className="shadow-sm">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-base text-indigo">Sync Manager</CardTitle>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Off-Peak Deep Sync</span>
                <Switch checked={deepSyncEnabled} onCheckedChange={setDeepSyncEnabled} />
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Table</TableHead>
                    <TableHead>Mode</TableHead>
                    <TableHead>Last Sync</TableHead>
                    <TableHead>Records</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sapTables.map(t => (
                    <TableRow key={t.name}>
                      <TableCell className="font-mono font-medium">{t.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={t.syncMode === "Delta" ? "text-teal border-teal/30" : "text-indigo border-indigo/30"}>
                          {t.syncMode}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs">{t.lastSync}</TableCell>
                      <TableCell>{t.records.toLocaleString()}</TableCell>
                      <TableCell className="w-32">
                        <Progress value={syncProgress[t.name] || 0} className="h-2" />
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" className="text-xs gap-1"
                          disabled={syncingTable === t.name}
                          onClick={() => handleForceSync(t.name)}>
                          <RefreshCw className={`h-3 w-3 ${syncingTable === t.name ? "animate-spin" : ""}`} />
                          {syncingTable === t.name ? "Syncing..." : "Force Sync"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Data Standardization */}
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-indigo">Data Standardization Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>SAP Field</TableHead>
                    <TableHead><ArrowRight className="h-4 w-4" /></TableHead>
                    <TableHead>Normalized Field</TableHead>
                    <TableHead>Data Type</TableHead>
                    <TableHead>Example</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sapFieldMappings.map(m => (
                    <TableRow key={m.sapField}>
                      <TableCell className="font-mono text-sm">{m.sapField}</TableCell>
                      <TableCell><ArrowRight className="h-3.5 w-3.5 text-muted-foreground" /></TableCell>
                      <TableCell className="font-medium">{m.normalized}</TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">{m.dataType}</TableCell>
                      <TableCell className="text-xs">{m.example}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Purchase Orders Preview */}
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-indigo">Synced Purchase Orders (EKPO)</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>PO</TableHead>
                    <TableHead>Item</TableHead>
                    <TableHead>Supplier</TableHead>
                    <TableHead>Material</TableHead>
                    <TableHead className="text-right">Qty</TableHead>
                    <TableHead className="text-right">Net Value</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sapPurchaseOrders.map((po, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-mono">{po.po}</TableCell>
                      <TableCell className="font-mono text-xs">{po.item}</TableCell>
                      <TableCell>{po.supplier}</TableCell>
                      <TableCell>{po.material}</TableCell>
                      <TableCell className="text-right">{po.qty.toLocaleString()}</TableCell>
                      <TableCell className="text-right font-medium">
                        {po.currency === "INR" ? "₹" : "$"}{po.netValue.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={
                          po.status === "Completed" ? "text-primary border-primary/30" :
                          po.status === "Partial" ? "text-amber border-amber/30" :
                          "text-indigo border-indigo/30"
                        }>
                          {po.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Step 4: Alert Logic */}
      {activeStep === 4 && (
        <div className="space-y-4">
          {/* Alert Configuration */}
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-indigo flex items-center gap-2">
                <Settings className="h-4 w-4" /> Alert Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {sapAlertConfig.map(config => (
                <div key={config.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div>
                    <p className="text-sm font-medium">{config.label}</p>
                    <p className="text-xs text-muted-foreground">{config.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">Threshold: {config.threshold}</p>
                  </div>
                  <Switch
                    checked={alertToggles[config.id]}
                    onCheckedChange={v => setAlertToggles(prev => ({ ...prev, [config.id]: v }))}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Alert Tray */}
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-indigo flex items-center gap-2">
                <Bell className="h-4 w-4" /> Predictive Alerts
                <Badge className="bg-destructive/10 text-destructive ml-2">
                  {sapAlerts.filter(a => a.level === "critical").length} critical
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 max-h-80 overflow-y-auto">
              {sapAlerts.map(alert => (
                <div key={alert.id} className={`flex items-start gap-3 p-3 rounded-lg border ${
                  alert.level === "critical" ? "border-destructive/30 bg-destructive/5" :
                  alert.level === "warning" ? "border-amber/30 bg-amber/5" :
                  "border-border"
                }`}>
                  {alert.level === "critical" && <AlertTriangle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />}
                  {alert.level === "warning" && <Clock className="h-4 w-4 text-amber shrink-0 mt-0.5" />}
                  {alert.level === "info" && <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={alert.level === "critical" ? "destructive" : "outline"}
                        className={alert.level === "warning" ? "border-amber/40 text-amber" : ""}>
                        {alert.level}
                      </Badge>
                    </div>
                    <p className="text-sm">{alert.message}</p>
                  </div>
                  <Button variant="ghost" size="sm" className="text-xs gap-1 shrink-0">
                    {alert.action} <ArrowRight className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* HANA Performance */}
          <Card className="shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base text-indigo flex items-center gap-2">
                <Zap className="h-4 w-4" /> HANA Performance Controls
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg border">
                  <p className="text-sm font-medium mb-2">Delta Sync Schedule</p>
                  <p className="text-xs text-muted-foreground mb-3">Incremental changes every 30 minutes</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-teal border-teal/30">Active</Badge>
                    <span className="text-xs text-muted-foreground">Next run: 08:30 AM</span>
                  </div>
                </div>
                <div className="p-4 rounded-lg border">
                  <p className="text-sm font-medium mb-2">Deep Sync Schedule</p>
                  <p className="text-xs text-muted-foreground mb-3">Full table refresh — off-peak hours only</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-indigo border-indigo/30">Nightly 2:00 AM</Badge>
                    <span className="text-xs text-muted-foreground">~45 min duration</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between pt-2">
        <Button variant="outline" onClick={() => setActiveStep(s => Math.max(1, s - 1))} disabled={activeStep === 1} className="gap-1">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <Button onClick={() => setActiveStep(s => Math.min(4, s + 1))} disabled={activeStep === 4 || isStepLocked(activeStep + 1)} className="gap-1">
          Next <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
