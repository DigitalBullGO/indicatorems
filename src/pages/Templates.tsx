import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Library, Download, Copy, Eye, Search, FileSpreadsheet, Star } from "lucide-react";
import { templateCategories } from "@/data/mockData";

const templates = [
  { id: "t1", name: "ISTVON Vendor Onboarding", category: "istvon", downloads: 234, premium: false },
  { id: "t2", name: "Commodity Group Mapping", category: "commodity", downloads: 189, premium: false },
  { id: "t3", name: "Standard BOM Input Sheet", category: "bom-input", downloads: 312, premium: false },
  { id: "t4", name: "RFQ Request Form", category: "rfq-input", downloads: 156, premium: false },
  { id: "t5", name: "Supplier Line Card", category: "line-card", downloads: 98, premium: false },
  { id: "t6", name: "Material Pricing Model", category: "premium", downloads: 67, premium: true },
  { id: "t7", name: "Surface Finish Calculator", category: "premium", downloads: 45, premium: true },
  { id: "t8", name: "Machine Hour Rate Sheet", category: "premium", downloads: 89, premium: true },
  { id: "t9", name: "Multi-level BOM Template", category: "bom-input", downloads: 278, premium: false },
  { id: "t10", name: "Commodity Spend Tracker", category: "commodity", downloads: 205, premium: false },
  { id: "t11", name: "Vendor Scorecard Template", category: "istvon", downloads: 167, premium: false },
  { id: "t12", name: "Quote Comparison Matrix", category: "rfq-input", downloads: 143, premium: false },
];

export default function Templates() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = templates.filter(
    (t) => (selectedCategory === "all" || t.category === selectedCategory) && t.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2 text-indigo"><Library className="h-6 w-6 text-primary" />Template Library</h1>
        <p className="text-sm font-semibold text-muted-foreground">Browse and use pre-built report templates.</p>
      </div>

      {/* Category Chips */}
      <div className="flex gap-2 flex-wrap">
        <Button variant={selectedCategory === "all" ? "default" : "outline"} size="sm" onClick={() => setSelectedCategory("all")}>All ({templates.length})</Button>
        {templateCategories.map((c) => (
          <Button key={c.id} variant={selectedCategory === c.id ? "default" : "outline"} size="sm" onClick={() => setSelectedCategory(c.id)}>
            {c.name} ({c.count})
          </Button>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search templates…" className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {/* Gallery */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((t) => (
          <Card key={t.id} className="hover:border-primary/40 hover:shadow-md transition-all shadow-sm">
            <CardContent className="p-0">
              {/* Preview Thumbnail */}
              <div className="h-32 bg-muted/50 rounded-t-lg flex items-center justify-center relative">
                <FileSpreadsheet className="h-10 w-10 text-muted-foreground/30" />
                {t.premium && (
                  <Badge className="absolute top-2 right-2 bg-amber text-amber-foreground gap-1"><Star className="h-3 w-3" />Premium</Badge>
                )}
              </div>
              <div className="p-4">
                <p className="font-medium text-sm">{t.name}</p>
                <p className="text-xs text-muted-foreground mt-1">{t.downloads} downloads</p>
                <div className="flex gap-2 mt-3">
                  <Button variant="outline" size="sm" className="text-xs gap-1 flex-1"><Download className="h-3 w-3" />Download</Button>
                  <Button variant="ghost" size="sm" className="text-xs gap-1"><Copy className="h-3 w-3" /></Button>
                  <Button variant="ghost" size="sm" className="text-xs gap-1"><Eye className="h-3 w-3" /></Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
