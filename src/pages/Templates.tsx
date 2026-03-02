import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Library, Download, Copy, Eye, Search, FileSpreadsheet, Star,
  Sparkles, FileText, ShoppingCart, Microscope, Factory,
  HelpCircle, Beef, Lock, ChevronLeft, ChevronRight,
  Brain, Award, TrendingUp, Filter,
  AlertTriangle, DollarSign, Clock, Settings, BarChart3,
  Table, CreditCard, Calculator, GitBranch, PieChart,
  RefreshCw, Columns, ClipboardCheck, Gauge, UserPlus,
  ClipboardList, AlertOctagon,
} from "lucide-react";
import {
  aiPromptTemplates,
  businessCommTemplates,
  reportTemplates,
  type AIPromptTemplate,
  type BusinessCommTemplate,
  type ReportTemplate,
  type TemplatePrice,
  type TemplateFormat,
  type TemplateDepartment,
  type TemplateCategory,
} from "@/data/templateData";
import AIPromptModal from "@/components/templates/AIPromptModal";
import BusinessCommModal from "@/components/templates/BusinessCommModal";
import ReportModal from "@/components/templates/ReportModal";
import ReportPreviewModal from "@/components/templates/ReportPreviewModal";

const ITEMS_PER_PAGE = 8;

// Icon mapping for template thumbnails
const iconMap: Record<string, React.ElementType> = {
  ShoppingCart, Search, DollarSign, AlertTriangle, TrendingUp,
  Microscope, Factory, Gauge, ClipboardCheck, UserPlus,
  ClipboardList, FileText, Clock, Award, Settings,
  RefreshCw, AlertOctagon, BarChart3 /* BarChart alias */, 
  Table, CreditCard, Calculator, GitBranch, PieChart,
  Columns, Grid: Table, // alias
  Handshake: Award, // fallback
  FileWarning: AlertTriangle, // fallback
};

// Category accent colors
const categoryColors = {
  ai: { bg: "hsl(177, 55%, 39%)", bgLight: "hsl(177, 55%, 95%)", border: "hsl(177, 55%, 39%)", text: "hsl(177, 55%, 32%)" },
  comm: { bg: "hsl(45, 100%, 50%)", bgLight: "hsl(45, 100%, 95%)", border: "hsl(45, 100%, 50%)", text: "hsl(45, 100%, 35%)" },
  report: { bg: "hsl(232, 48%, 48%)", bgLight: "hsl(232, 48%, 95%)", border: "hsl(232, 48%, 48%)", text: "hsl(232, 48%, 40%)" },
};

// Thumbnail background patterns per icon to make each card visually unique
const thumbnailPatterns: Record<string, { bg: string; accent: string }> = {
  ShoppingCart: { bg: "hsl(177, 40%, 94%)", accent: "hsl(177, 55%, 45%)" },
  Search: { bg: "hsl(210, 40%, 94%)", accent: "hsl(210, 55%, 50%)" },
  DollarSign: { bg: "hsl(140, 35%, 93%)", accent: "hsl(140, 50%, 40%)" },
  AlertTriangle: { bg: "hsl(35, 60%, 93%)", accent: "hsl(35, 80%, 50%)" },
  TrendingUp: { bg: "hsl(160, 40%, 93%)", accent: "hsl(160, 55%, 40%)" },
  Microscope: { bg: "hsl(270, 35%, 94%)", accent: "hsl(270, 50%, 55%)" },
  Factory: { bg: "hsl(200, 30%, 93%)", accent: "hsl(200, 50%, 45%)" },
  Gauge: { bg: "hsl(15, 50%, 94%)", accent: "hsl(15, 65%, 50%)" },
  ClipboardCheck: { bg: "hsl(150, 35%, 93%)", accent: "hsl(150, 50%, 40%)" },
  UserPlus: { bg: "hsl(220, 40%, 94%)", accent: "hsl(220, 55%, 50%)" },
  ClipboardList: { bg: "hsl(190, 35%, 93%)", accent: "hsl(190, 50%, 45%)" },
  FileText: { bg: "hsl(230, 35%, 94%)", accent: "hsl(230, 50%, 50%)" },
  Clock: { bg: "hsl(40, 40%, 94%)", accent: "hsl(40, 60%, 45%)" },
  Award: { bg: "hsl(280, 35%, 94%)", accent: "hsl(280, 50%, 50%)" },
  Settings: { bg: "hsl(200, 20%, 93%)", accent: "hsl(200, 30%, 50%)" },
  RefreshCw: { bg: "hsl(170, 35%, 93%)", accent: "hsl(170, 50%, 40%)" },
  AlertOctagon: { bg: "hsl(0, 40%, 94%)", accent: "hsl(0, 55%, 50%)" },
  BarChart3: { bg: "hsl(250, 35%, 94%)", accent: "hsl(250, 50%, 50%)" },
  Table: { bg: "hsl(180, 30%, 93%)", accent: "hsl(180, 45%, 42%)" },
  CreditCard: { bg: "hsl(210, 35%, 94%)", accent: "hsl(210, 50%, 50%)" },
  Calculator: { bg: "hsl(300, 25%, 94%)", accent: "hsl(300, 40%, 50%)" },
  GitBranch: { bg: "hsl(130, 30%, 93%)", accent: "hsl(130, 45%, 40%)" },
  PieChart: { bg: "hsl(260, 35%, 94%)", accent: "hsl(260, 50%, 50%)" },
  Columns: { bg: "hsl(190, 30%, 93%)", accent: "hsl(190, 45%, 45%)" },
  Handshake: { bg: "hsl(30, 40%, 94%)", accent: "hsl(30, 55%, 45%)" },
  FileWarning: { bg: "hsl(20, 50%, 94%)", accent: "hsl(20, 60%, 50%)" },
  Grid: { bg: "hsl(180, 30%, 93%)", accent: "hsl(180, 45%, 42%)" },
};

const formatBadgeColors: Record<TemplateFormat, string> = {
  excel: "bg-emerald-100 text-emerald-700 border-emerald-200",
  doc: "bg-blue-100 text-blue-700 border-blue-200",
  pdf: "bg-red-100 text-red-700 border-red-200",
  text: "bg-gray-100 text-gray-700 border-gray-200",
};

const formatLabels: Record<TemplateFormat, string> = {
  excel: "Excel",
  doc: "Doc",
  pdf: "PDF",
  text: "Text",
};

// ISTVON explanation
const istvonSteps = [
  { letter: "I", label: "Identify", desc: "Define the problem or objective" },
  { letter: "S", label: "Source", desc: "Gather relevant data and inputs" },
  { letter: "T", label: "Transform", desc: "Clean, normalize, and structure data" },
  { letter: "V", label: "Validate", desc: "Verify accuracy and completeness" },
  { letter: "O", label: "Optimize", desc: "Apply AI analysis for best outcomes" },
  { letter: "N", label: "Notify", desc: "Deliver insights and recommendations" },
];

// Compute summary stats
function getTemplateStats() {
  const allTemplates = [
    ...aiPromptTemplates,
    ...businessCommTemplates,
    ...reportTemplates,
  ];
  const totalTemplates = allTemplates.length;
  const totalDownloads = allTemplates.reduce((sum, t) => sum + t.downloads, 0);
  const mostPopular = [...allTemplates].sort((a, b) => b.downloads - a.downloads)[0];
  return { totalTemplates, totalDownloads, mostPopularName: mostPopular?.title || "N/A" };
}

// Get featured templates (top 3 by downloads)
function getFeaturedTemplates() {
  const all = [
    ...aiPromptTemplates.map(t => ({ ...t, _type: "ai" as const })),
    ...businessCommTemplates.map(t => ({ ...t, _type: "comm" as const })),
    ...reportTemplates.map(t => ({ ...t, _type: "report" as const })),
  ];
  return all.sort((a, b) => b.downloads - a.downloads).slice(0, 3);
}

const departments: TemplateDepartment[] = ["Purchasing", "Production", "Sales", "Quality", "Finance"];
const categories: TemplateCategory[] = ["Reports", "Prompts", "Business Communication"];
const prices: TemplatePrice[] = ["Included", "Premium"];

export default function Templates() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState<string>("all");
  const [catFilter, setCatFilter] = useState<string>("all");
  const [priceFilter, setPriceFilter] = useState<string>("all");
  const [selectedAI, setSelectedAI] = useState<AIPromptTemplate | null>(null);
  const [selectedComm, setSelectedComm] = useState<BusinessCommTemplate | null>(null);
  const [selectedReport, setSelectedReport] = useState<ReportTemplate | null>(null);
  const [previewReport, setPreviewReport] = useState<ReportTemplate | null>(null);
  const [aiPage, setAiPage] = useState(1);
  const [commPage, setCommPage] = useState(1);
  const [reportPage, setReportPage] = useState(1);

  const handleUseTemplate = (template: ReportTemplate) => {
    setSelectedReport(template);
  };

  const q = search.toLowerCase();

  // Apply global filters
  const applyFilters = <T extends { title: string; subtitle: string; department: TemplateDepartment; category: TemplateCategory; price: TemplatePrice }>(items: T[]) => {
    return items.filter((t) => {
      if (q && !t.title.toLowerCase().includes(q) && !t.subtitle.toLowerCase().includes(q)) return false;
      if (deptFilter !== "all" && t.department !== deptFilter) return false;
      if (catFilter !== "all" && t.category !== catFilter) return false;
      if (priceFilter !== "all" && t.price !== priceFilter) return false;
      return true;
    });
  };

  const filteredAI = useMemo(() => applyFilters(aiPromptTemplates), [q, deptFilter, catFilter, priceFilter]);
  const filteredComm = useMemo(() => applyFilters(businessCommTemplates), [q, deptFilter, catFilter, priceFilter]);
  const filteredReports = useMemo(() => applyFilters(reportTemplates), [q, deptFilter, catFilter, priceFilter]);

  const totalFiltered = filteredAI.length + filteredComm.length + filteredReports.length;

  const stats = getTemplateStats();
  const featured = getFeaturedTemplates();

  const resetFilters = () => {
    setSearch("");
    setDeptFilter("all");
    setCatFilter("all");
    setPriceFilter("all");
    setAiPage(1);
    setCommPage(1);
    setReportPage(1);
  };

  const resetPages = () => {
    setAiPage(1);
    setCommPage(1);
    setReportPage(1);
  };

  const hasActiveFilters = search !== "" || deptFilter !== "all" || catFilter !== "all" || priceFilter !== "all";

  // Paginate helper
  const paginate = <T,>(items: T[], page: number) => {
    const totalPages = Math.ceil(items.length / ITEMS_PER_PAGE);
    const paged = items.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
    return { paged, totalPages };
  };

  const PaginationControls = ({ page, totalPages, setPage }: { page: number; totalPages: number; setPage: (p: number) => void }) => {
    if (totalPages <= 1) return null;
    return (
      <div className="flex items-center justify-center gap-2 pt-4">
        <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage(page - 1)} className="gap-1">
          <ChevronLeft className="h-4 w-4" /> Previous
        </Button>
        <span className="text-sm text-muted-foreground font-semibold">Page {page} of {totalPages}</span>
        <Button variant="outline" size="sm" disabled={page === totalPages} onClick={() => setPage(page + 1)} className="gap-1">
          Next <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Library className="h-6 w-6 text-primary" />
          Template Library
        </h1>
        <p className="text-sm font-semibold text-muted-foreground">Browse and use pre-built report templates.</p>
      </div>

      {/* Summary Stats */}
      <div className="flex flex-wrap gap-4 text-sm">
        <Badge variant="secondary" className="px-3 py-1.5 font-semibold gap-1.5">
          Total Templates: <span className="font-bold">{stats.totalTemplates}</span>
        </Badge>
        <Badge variant="secondary" className="px-3 py-1.5 font-semibold gap-1.5">
          <Download className="h-3 w-3" /> Total Downloads: <span className="font-bold">{stats.totalDownloads}</span>
        </Badge>
        <Badge variant="secondary" className="px-3 py-1.5 font-semibold gap-1.5">
          <Award className="h-3 w-3" /> Most Popular: <span className="font-bold">{stats.mostPopularName}</span>
        </Badge>
      </div>

      {/* Featured */}
      <div>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1">
          <TrendingUp className="h-4 w-4 text-primary" /> Featured Templates
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {featured.map((t) => (
            <Card key={t.id} className="hover:shadow-md transition-all shadow-sm border-primary/20">
              <CardContent className="p-4">
                <p className="font-semibold text-sm">{t.title}</p>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{t.subtitle}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline" className="text-[10px]">{t.downloads} downloads</Badge>
                  <Badge variant="outline" className={`text-[10px] ${formatBadgeColors[t.format]}`}>{formatLabels[t.format]}</Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* ── Canva-style Filter Bar ── */}
      <div className="bg-muted/40 rounded-xl p-4 space-y-3 border">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search templates…"
              className="pl-9 bg-background"
              value={search}
              onChange={(e) => { setSearch(e.target.value); resetPages(); }}
            />
          </div>

          {/* Department Filter */}
          <Select value={deptFilter} onValueChange={(v) => { setDeptFilter(v); resetPages(); }}>
            <SelectTrigger className="w-[160px] bg-background">
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
            </SelectContent>
          </Select>

          {/* Category Filter */}
          <Select value={catFilter} onValueChange={(v) => { setCatFilter(v); resetPages(); }}>
            <SelectTrigger className="w-[180px] bg-background">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>

          {/* Price Filter */}
          <Select value={priceFilter} onValueChange={(v) => { setPriceFilter(v); resetPages(); }}>
            <SelectTrigger className="w-[140px] bg-background">
              <SelectValue placeholder="Price" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Prices</SelectItem>
              {prices.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
            </SelectContent>
          </Select>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={resetFilters} className="text-xs text-muted-foreground">
              Clear
            </Button>
          )}
        </div>

        {/* Result count */}
        <p className="text-xs text-muted-foreground font-medium">
          {totalFiltered} template{totalFiltered !== 1 ? "s" : ""} found
        </p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="ai-prompts" className="space-y-6">
        <TabsList className="h-11">
         <TabsTrigger value="ai-prompts" className="gap-1.5 text-sm">
            <Sparkles className="h-4 w-4" /> AI Prompts
            {filteredAI.length > 0 && <Badge variant="secondary" className="text-[10px] px-1.5 py-0 ml-1">{filteredAI.length}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="business-comm" className="gap-1.5 text-sm">
            <FileText className="h-4 w-4" /> Business Communication
            {filteredComm.length > 0 && <Badge variant="secondary" className="text-[10px] px-1.5 py-0 ml-1">{filteredComm.length}</Badge>}
          </TabsTrigger>
          <TabsTrigger value="reports" className="gap-1.5 text-sm">
            <FileSpreadsheet className="h-4 w-4" /> Report Templates
            {filteredReports.length > 0 && <Badge variant="secondary" className="text-[10px] px-1.5 py-0 ml-1">{filteredReports.length}</Badge>}
          </TabsTrigger>
        </TabsList>

        {/* ── TAB 1: AI Prompts ── */}
        <TabsContent value="ai-prompts" className="space-y-8">
          <div className="flex items-center gap-2 text-base font-bold text-muted-foreground">
            <Sparkles className="h-5 w-5" style={{ color: categoryColors.ai.bg }} />
            AI Templates powered by DigiBull's ISTVON Framework
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="inline-flex">
                    <HelpCircle className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-xs p-3">
                  <p className="font-bold text-sm mb-2">ISTVON Framework</p>
                  <div className="space-y-1">
                    {istvonSteps.map((step) => (
                      <div key={step.letter} className="flex items-start gap-2 text-xs">
                        <span className="font-bold text-primary w-4">{step.letter}</span>
                        <span><strong>{step.label}</strong> — {step.desc}</span>
                      </div>
                    ))}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          {(() => {
            const { paged, totalPages } = paginate(filteredAI, aiPage);
            return (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {paged.map((t) => (
                    <TemplateCard
                      key={t.id}
                      title={t.title}
                      subtitle={t.subtitle}
                      downloads={t.downloads}
                      format={t.format}
                      department={t.department}
                      price={t.price}
                      icon={t.icon}
                      actionLabel="Use This Template"
                      actionIcon={<Sparkles className="h-3 w-3" />}
                      onAction={() => setSelectedAI(t)}
                      onCopy={() => {
                        navigator.clipboard.writeText(t.prompt);
                        toast.success("Prompt copied to clipboard");
                      }}
                      onEye={() => setSelectedAI(t)}
                      accentColor={categoryColors.ai}
                      onOpenInAI={() => navigate("/ai-insights")}
                    />
                  ))}
                </div>
                <PaginationControls page={aiPage} totalPages={totalPages} setPage={setAiPage} />
              </>
            );
          })()}
          {filteredAI.length === 0 && <EmptyState onClear={hasActiveFilters ? resetFilters : undefined} />}
        </TabsContent>

        {/* ── TAB 2: Business Communication ── */}
        <TabsContent value="business-comm" className="space-y-8">
          {(() => {
            const { paged, totalPages } = paginate(filteredComm, commPage);
            return (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {paged.map((t) => (
                    <TemplateCard
                      key={t.id}
                      title={t.title}
                      subtitle={t.subtitle}
                      downloads={t.downloads}
                      format={t.format}
                      department={t.department}
                      price={t.price}
                      icon={t.icon}
                      actionLabel="Use This Template"
                      actionIcon={<FileText className="h-3 w-3" />}
                      onAction={t.price === "Premium" ? undefined : () => setSelectedComm(t)}
                      accentColor={categoryColors.comm}
                    />
                  ))}
                </div>
                <PaginationControls page={commPage} totalPages={totalPages} setPage={setCommPage} />
              </>
            );
          })()}
          {filteredComm.length === 0 && <EmptyState onClear={hasActiveFilters ? resetFilters : undefined} />}
        </TabsContent>

        {/* ── TAB 3: Report Templates ── */}
        <TabsContent value="reports" className="space-y-8">
          {(() => {
            const { paged, totalPages } = paginate(filteredReports, reportPage);
            return (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {paged.map((t) => (
                    <TemplateCard
                      key={t.id}
                      title={t.title}
                      subtitle={t.subtitle}
                      downloads={t.downloads}
                      premium={t.premium}
                      isNew={t.isNew}
                      format={t.format}
                      department={t.department}
                      price={t.price}
                      icon={t.icon}
                      actionLabel="Use This Template"
                      actionIcon={t.section === "dynamic" ? <Eye className="h-3 w-3" /> : <Download className="h-3 w-3" />}
                      onAction={t.price === "Premium" ? undefined : () => t.section === "dynamic" ? setPreviewReport(t) : setSelectedReport(t)}
                      showPreview={t.section === "dynamic" && t.price !== "Premium"}
                      onPreview={t.price === "Premium" ? undefined : () => setPreviewReport(t)}
                      accentColor={categoryColors.report}
                    />
                  ))}
                </div>
                <PaginationControls page={reportPage} totalPages={totalPages} setPage={setReportPage} />
              </>
            );
          })()}
          {filteredReports.length === 0 && <EmptyState onClear={hasActiveFilters ? resetFilters : undefined} />}
        </TabsContent>
      </Tabs>

      {/* Modals */}
      <AIPromptModal template={selectedAI} open={!!selectedAI} onOpenChange={(o) => !o && setSelectedAI(null)} />
      <BusinessCommModal template={selectedComm} open={!!selectedComm} onOpenChange={(o) => !o && setSelectedComm(null)} />
      <ReportModal template={selectedReport} open={!!selectedReport} onOpenChange={(o) => !o && setSelectedReport(null)} />
      <ReportPreviewModal template={previewReport} open={!!previewReport} onOpenChange={(o) => !o && setPreviewReport(null)} onUseTemplate={handleUseTemplate} />
    </div>
  );
}

// ─── Shared Card Component ───
function TemplateCard({
  title,
  subtitle,
  downloads,
  premium,
  isNew,
  format,
  department,
  price,
  icon,
  actionLabel,
  actionIcon,
  onAction,
  showPreview,
  onPreview,
  onCopy,
  onEye,
  accentColor,
  onOpenInAI,
}: {
  title: string;
  subtitle: string;
  downloads: number;
  premium?: boolean;
  isNew?: boolean;
  format?: TemplateFormat;
  department?: string;
  price?: TemplatePrice;
  icon?: string;
  actionLabel: string;
  actionIcon: React.ReactNode;
  onAction?: () => void;
  showPreview?: boolean;
  onPreview?: () => void;
  onCopy?: () => void;
  onEye?: () => void;
  accentColor?: { bg: string; bgLight: string; border: string; text: string };
  onOpenInAI?: () => void;
}) {
  const accent = accentColor || { bg: "hsl(var(--primary))", bgLight: "hsl(var(--accent))", border: "hsl(var(--primary))", text: "hsl(var(--primary))" };
  const isPremium = price === "Premium";

  // Get the specific icon component
  const IconComponent = icon ? (iconMap[icon] || FileSpreadsheet) : FileSpreadsheet;
  const pattern = icon ? (thumbnailPatterns[icon] || { bg: accent.bgLight, accent: accent.bg }) : { bg: accent.bgLight, accent: accent.bg };

  return (
    <Card
      className={`hover:shadow-md transition-all shadow-sm h-[280px] flex flex-col ${isPremium ? "border-amber-300/60 bg-amber-50/30 dark:bg-amber-950/10" : ""}`}
      style={{ borderColor: isPremium ? undefined : "transparent" }}
      onMouseEnter={(e) => !isPremium && (e.currentTarget.style.borderColor = accent.border + "66")}
      onMouseLeave={(e) => !isPremium && (e.currentTarget.style.borderColor = "transparent")}
    >
      <CardContent className="p-0 flex flex-col flex-1">
        {/* Unique Thumbnail */}
        <div
          className="h-28 rounded-t-lg flex items-center justify-center relative overflow-hidden"
          style={{ backgroundColor: isPremium ? "hsl(45, 100%, 96%)" : pattern.bg }}
        >
          {/* Decorative elements */}
          <div className="absolute top-2 left-3 w-8 h-1 rounded-full opacity-30" style={{ backgroundColor: isPremium ? "hsl(45, 100%, 50%)" : pattern.accent }} />
          <div className="absolute top-5 left-3 w-12 h-1 rounded-full opacity-20" style={{ backgroundColor: isPremium ? "hsl(45, 100%, 50%)" : pattern.accent }} />
          <div className="absolute bottom-3 right-3 w-6 h-6 rounded-full opacity-10" style={{ backgroundColor: isPremium ? "hsl(45, 100%, 50%)" : pattern.accent }} />
          <div className="absolute top-3 right-10 w-4 h-4 rounded opacity-15" style={{ backgroundColor: isPremium ? "hsl(45, 100%, 50%)" : pattern.accent }} />

          <div className="flex flex-col items-center gap-1 z-10">
            <IconComponent
              className="h-8 w-8"
              style={{ color: isPremium ? "hsl(45, 100%, 50%)" : pattern.accent }}
            />
            {format && (
              <span
                className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded"
                style={{
                  backgroundColor: isPremium ? "hsl(45, 80%, 90%)" : pattern.accent + "18",
                  color: isPremium ? "hsl(45, 100%, 40%)" : pattern.accent,
                }}
              >
                {formatLabels[format]}
              </span>
            )}
          </div>

          {isPremium && (
            <Badge className="absolute top-2 right-2 bg-amber-500 text-white gap-1 border-0">
              <Beef className="h-3 w-3" />Premium
            </Badge>
          )}
          {isNew && !isPremium && (
            <Badge className="absolute top-2 right-2 border-0" style={{ backgroundColor: accent.bg, color: "#fff" }}>New</Badge>
          )}
          {isPremium && (
            <div className="absolute inset-0 bg-amber-900/5 rounded-t-lg flex items-center justify-center">
              <Lock className="h-6 w-6 text-amber-500/40" />
            </div>
          )}
        </div>

        <div className="p-4 space-y-2 flex-1 flex flex-col">
          <p className="font-semibold text-sm leading-tight line-clamp-1">{title}</p>
          <p className="text-xs text-muted-foreground line-clamp-2">{subtitle}</p>

          {/* Meta badges */}
          <div className="flex flex-wrap gap-1.5">
            {department && (
              <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                {department}
              </Badge>
            )}
            {price && (
              <Badge
                variant="outline"
                className={`text-[10px] px-1.5 py-0 ${
                  isPremium ? "border-amber-300 text-amber-600 bg-amber-50" : "border-teal-300 text-teal-600 bg-teal-50"
                }`}
              >
                {price}
              </Badge>
            )}
          </div>

          <p className="text-xs text-muted-foreground">{downloads} downloads</p>

          {/* Actions */}
          <div className="mt-auto">
            {isPremium ? (
              <p className="text-xs text-amber-600 font-semibold flex items-center gap-1">
                <Beef className="h-3 w-3" />
                Contact your BuLLMind representative to access this template.
              </p>
            ) : (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="text-xs gap-1 flex-1 text-white"
                  style={{ backgroundColor: accent.bg }}
                  onClick={onAction}
                >
                  {actionIcon}
                  {actionLabel}
                </Button>
                {onCopy && (
                  <Button variant="ghost" size="sm" className="text-xs gap-1" onClick={onCopy}>
                    <Copy className="h-3 w-3" />
                  </Button>
                )}
                {onOpenInAI && (
                  <Button variant="ghost" size="sm" className="text-xs gap-1" onClick={onOpenInAI} title="Open in AI Insights">
                    <Brain className="h-3 w-3" />
                  </Button>
                )}
                {showPreview && onPreview ? (
                  <Button variant="ghost" size="sm" className="text-xs gap-1" onClick={onPreview}>
                    <Eye className="h-3 w-3" />
                  </Button>
                ) : onEye ? (
                  <Button variant="ghost" size="sm" className="text-xs gap-1" onClick={onEye}>
                    <Eye className="h-3 w-3" />
                  </Button>
                ) : null}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function EmptyState({ onClear }: { onClear?: () => void }) {
  return (
    <div className="text-center py-12 text-muted-foreground">
      <Search className="h-10 w-10 mx-auto mb-3 opacity-30" />
      <p className="text-sm">No templates match your filters.</p>
      {onClear && (
        <Button variant="link" size="sm" onClick={onClear} className="mt-2 text-xs">
          Clear all filters
        </Button>
      )}
    </div>
  );
}
