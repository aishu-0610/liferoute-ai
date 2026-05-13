import { useState, useMemo } from "react";
import { Link } from "wouter";
import {
  useGetHospitals,
  useGetHospitalStats,
  useGetEmergencyContacts,
  useGetCities,
} from "@workspace/api-client-react";
import type { Hospital } from "@workspace/api-client-react";
import {
  Search, Activity, Bed, Wind, Droplets, MapPin,
  Phone, Clock, Star, AlertTriangle, CheckCircle2,
  Building2, PhoneCall, Flame, ShieldAlert, HeartPulse,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useCity } from "@/context/city-context";

const CITY_LIST = [
  "Madurai", "Chennai", "Bengaluru", "Mumbai", "Delhi",
  "Hyderabad", "Kochi", "Coimbatore", "Pune", "Kolkata",
];

/** Strip **bold** markdown so names render cleanly in JSX */
function stripMd(text: string): string {
  return text.replace(/\*\*(.*?)\*\*/g, "$1");
}

function StatusBadge({ status }: { status: string }) {
  const variants: Record<string, string> = {
    Available: "bg-green-500/15 text-green-700 dark:text-green-400 border-green-500/30",
    Limited: "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30",
    Full: "bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/30",
  };
  return (
    <Badge variant="outline" className={variants[status] || "bg-muted text-muted-foreground"}>
      {status}
    </Badge>
  );
}

function EmergencyLevelBadge({ level }: { level?: string | null }) {
  if (!level) return null;
  const variants: Record<string, string> = {
    Low: "bg-blue-500/15 text-blue-700 dark:text-blue-400",
    Medium: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
    High: "bg-orange-500/15 text-orange-700 dark:text-orange-400",
    Critical: "bg-red-500/15 text-red-700 dark:text-red-400 font-bold animate-pulse",
  };
  return (
    <Badge variant="secondary" className={variants[level] || ""}>
      Level: {level}
    </Badge>
  );
}

export default function Dashboard() {
  const { selectedCity, setSelectedCity } = useCity();
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    area: "all",
    facility: "all",
    status: "all",
    emergencyLevel: "all",
  });

  const { data: cities } = useGetCities();
  const cityParam = selectedCity || undefined;

  const { data: stats, isLoading: statsLoading } = useGetHospitalStats(
    cityParam ? { city: cityParam } : undefined
  );

  const queryParams = useMemo(() => {
    const params: Record<string, string> = {};
    if (cityParam) params.city = cityParam;
    if (searchTerm) params.search = searchTerm;
    if (filters.area !== "all") params.area = filters.area;
    if (filters.facility !== "all") params.facility = filters.facility;
    if (filters.status !== "all") params.status = filters.status;
    return params;
  }, [cityParam, searchTerm, filters]);

  const { data: hospitals, isLoading: hospitalsLoading } = useGetHospitals(queryParams);

  const { data: emergencyContacts } = useGetEmergencyContacts(
    cityParam ? { city: cityParam } : undefined
  );

  const areas = useMemo(() => {
    if (!hospitals) return [];
    return Array.from(new Set(hospitals.map((h) => h.area))).sort();
  }, [hospitals]);

  type AiResult =
    | { found: false }
    | { found: true; hospital: Hospital; score: number; reasons: string[]; reason: string };

  const aiRecommendation = useMemo((): AiResult | null => {
    if (!selectedCity) return null;
    if (!hospitals || hospitals.length === 0) return { found: false };

    const isCritical = filters.emergencyLevel === "Critical";
    const selectedFacility = filters.facility !== "all" ? filters.facility : null;

    const hasAvailableOrLimited = hospitals.some(
      (h) => h.status === "Available" || h.status === "Limited",
    );
    const pool = hasAvailableOrLimited
      ? hospitals.filter((h) => h.status !== "Full")
      : hospitals;

    if (pool.length === 0) return { found: false };

    const scored = pool.map((h) => {
      let score = 0;
      const reasons: string[] = [];

      if (h.status === "Available") { score += 40; reasons.push("available status"); }
      else if (h.status === "Limited") { score += 20; reasons.push("limited capacity"); }
      else if (h.status === "Full") { score -= 100; }

      const bedBonus = Math.min(h.bedsAvailable, 30);
      score += bedBonus;
      if (h.bedsAvailable > 0) reasons.push(`${h.bedsAvailable} beds available`);

      score += h.icuAvailable * 5;
      if (h.icuAvailable > 0) reasons.push(`${h.icuAvailable} ICU beds`);

      score += h.ventilatorsAvailable * 7;
      if (h.ventilatorsAvailable > 0) reasons.push(`${h.ventilatorsAvailable} ventilators`);

      if (selectedFacility) {
        if (selectedFacility === "ICU") {
          if (h.icuAvailable > 0) { score += 30; reasons.push("ICU beds available"); }
        } else if (selectedFacility === "Ventilator") {
          if (h.ventilatorsAvailable > 0) { score += 30; reasons.push("ventilator support available"); }
        } else if (selectedFacility === "Blood Bank") {
          if (h.bloodUnitsAvailable && h.bloodUnitsAvailable !== "None") {
            score += 30;
            reasons.push("blood bank available");
          }
        } else {
          const matched = h.specialties.some((s) =>
            s.toLowerCase().includes(selectedFacility.toLowerCase()),
          );
          if (matched) { score += 30; reasons.push(`specializes in ${selectedFacility}`); }
        }
      }

      if (isCritical) {
        if (h.bedsAvailable > 0 && h.icuAvailable > 0 && h.ventilatorsAvailable > 0) {
          score += 50;
          reasons.push("full critical care (beds + ICU + ventilators)");
        } else if (h.icuAvailable > 0 && h.ventilatorsAvailable > 0) {
          score += 30;
        }
      }

      if (filters.area !== "all" && h.area === filters.area) {
        score += 15;
        reasons.push(`in preferred area ${h.area}`);
      }

      return { hospital: h, score, reasons };
    });

    scored.sort((a, b) => b.score - a.score);
    const best = scored[0];
    if (!best || best.score <= -50) return { found: false };

    const facilityText = selectedFacility ? ` with ${selectedFacility} support` : "";
    const emergencyText =
      filters.emergencyLevel !== "all"
        ? `${filters.emergencyLevel.toLowerCase()} emergency`
        : "emergency routing";
    const topReasons = best.reasons.slice(0, 4).join(", ");
    const reason = `For ${emergencyText}${facilityText} in ${selectedCity}, ${best.hospital.name} is recommended because it has ${topReasons}.`;

    return { found: true, hospital: best.hospital, score: best.score, reasons: best.reasons, reason };
  }, [hospitals, selectedCity, filters]);

  const cityHasData = cities?.find(
    (c) => c.name.toLowerCase() === (selectedCity || "").toLowerCase()
  )?.hasData;
  const cityNoData = selectedCity && cityHasData === false;

  const resetFilters = () => {
    setSearchTerm("");
    setFilters({ area: "all", facility: "all", status: "all", emergencyLevel: "all" });
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl space-y-6">

      {/* ── Header ─────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Emergency Hospital Dashboard
            {selectedCity && <span className="text-primary"> — {selectedCity}</span>}
          </h1>
          <p className="text-muted-foreground mt-1">
            {selectedCity
              ? `Live hospital availability for ${selectedCity}. Select filters to narrow your search.`
              : "Select a city below to view hospital availability and emergency resources."}
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full shrink-0">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
          </span>
          Live Data Active
        </div>
      </div>

      {/* ── City Selector ──────────────────────────────────── */}
      <div className="bg-card border rounded-xl p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center gap-2 shrink-0">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="text-sm font-semibold">Selected City:</span>
          </div>
          <div className="flex flex-wrap gap-2 flex-1">
            <Select
              value={selectedCity || "none"}
              onValueChange={(v) => {
                setSelectedCity(v === "none" ? "" : v);
                resetFilters();
              }}
            >
              <SelectTrigger className="w-[200px] bg-background">
                <SelectValue placeholder="Choose a city..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">All Cities</SelectItem>
                {CITY_LIST.map((c) => {
                  const info = cities?.find((ci) => ci.name === c);
                  return (
                    <SelectItem key={c} value={c}>
                      <span className="flex items-center gap-2">
                        {c}
                        {info?.hasData && (
                          <span className="h-1.5 w-1.5 rounded-full bg-green-500 inline-block" />
                        )}
                      </span>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
            {selectedCity && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => { setSelectedCity(""); resetFilters(); }}
                className="text-muted-foreground"
              >
                Clear city
              </Button>
            )}
          </div>
          {selectedCity && (
            <Badge variant="outline" className="shrink-0">
              {emergencyContacts?.state || "India"}
            </Badge>
          )}
        </div>
      </div>

      {/* ── No Data Banner ─────────────────────────────────── */}
      {cityNoData && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-400 rounded-xl p-4 flex items-start gap-3"
        >
          <AlertTriangle className="h-5 w-5 mt-0.5 shrink-0" />
          <div>
            <p className="font-semibold">No live sample data for {selectedCity}</p>
            <p className="text-sm mt-1">
              We do not have live sample hospital data for this city yet. Please try another city or add hospital data through the{" "}
              <Link href="/update" className="underline font-medium">Update Panel</Link>.
            </p>
          </div>
        </motion.div>
      )}

      {/* ── Stats Row ──────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Facilities", value: stats?.totalHospitals, sub: selectedCity || "All cities", icon: Building2, color: "text-blue-500" },
          { label: "Available Centers", value: stats?.availableHospitals, sub: "Ready for intake", icon: CheckCircle2, color: "text-green-500" },
          { label: "Total ICU Beds", value: stats?.totalIcuBeds, sub: "Available now", icon: Bed, color: "text-purple-500" },
          { label: "Ventilators Ready", value: stats?.totalVentilators, sub: "Available now", icon: Wind, color: "text-cyan-500" },
        ].map((stat, i) => (
          <Card key={i} className="shadow-sm border-muted/60">
            <CardContent className="p-5">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">{stat.label}</p>
                  <p className="text-[10px] text-muted-foreground/70 mt-0.5">{stat.sub}</p>
                  {statsLoading ? (
                    <Skeleton className="h-8 w-14 mt-2" />
                  ) : (
                    <p className="text-3xl font-bold mt-1">{stat.value ?? 0}</p>
                  )}
                </div>
                <div className={`p-2 rounded-lg bg-muted ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── AI Recommendation ──────────────────────────────── */}
      <Card className="border-primary/20 shadow-sm bg-gradient-to-br from-card via-card to-primary/5">
        <CardHeader className="pb-3 border-b border-primary/10">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="bg-primary/15 p-2 rounded-lg shrink-0">
                <Sparkles className="h-4 w-4 text-primary" />
              </div>
              <div>
                <CardTitle className="text-base">AI Recommendation</CardTitle>
                <CardDescription className="text-xs">
                  Smart routing based on current filters
                  {selectedCity && ` · ${selectedCity}`}
                </CardDescription>
              </div>
            </div>
            {filters.emergencyLevel !== "all" && (
              <Badge variant="secondary" className={({
                Low: "bg-blue-500/15 text-blue-700 dark:text-blue-400",
                Medium: "bg-amber-500/15 text-amber-700 dark:text-amber-400",
                High: "bg-orange-500/15 text-orange-700 dark:text-orange-400",
                Critical: "bg-red-500/15 text-red-700 dark:text-red-400 font-bold animate-pulse",
              } as Record<string, string>)[filters.emergencyLevel] || ""}>
                Emergency Level: {filters.emergencyLevel}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          {!selectedCity ? (
            <div className="flex items-center gap-3 py-2">
              <div className="bg-muted h-9 w-9 rounded-full flex items-center justify-center shrink-0">
                <MapPin className="h-4 w-4 text-muted-foreground" />
              </div>
              <div>
                <p className="font-semibold text-sm">Select a city to activate</p>
                <p className="text-xs text-muted-foreground">
                  Choose a city above to get an AI-powered hospital recommendation.
                </p>
              </div>
            </div>
          ) : hospitalsLoading ? (
            <div className="flex gap-4">
              <Skeleton className="h-20 flex-1" />
              <Skeleton className="h-20 w-52" />
            </div>
          ) : aiRecommendation?.found ? (
            <div className="flex flex-col md:flex-row gap-4">
              {/* Left: reason text + bullet points */}
              <div className="flex-1 min-w-0 space-y-3">
                <div className="bg-green-500/10 border border-green-500/20 text-green-700 dark:text-green-400 px-3 py-2.5 rounded-lg flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 mt-0.5 shrink-0" />
                  <p className="text-sm font-medium leading-snug">{aiRecommendation.reason}</p>
                </div>
                {aiRecommendation.reasons.length > 0 && (
                  <ul className="space-y-1">
                    {aiRecommendation.reasons.slice(0, 5).map((r, i) => (
                      <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                        <span className="leading-snug capitalize">{r}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Right: hospital detail card + call button */}
              <div className="md:w-60 shrink-0 flex flex-col gap-2">
                <div className="border rounded-lg bg-background p-3 space-y-2">
                  <div>
                    <p className="font-bold text-sm leading-tight">{aiRecommendation.hospital.name}</p>
                    <p className="text-xs text-muted-foreground flex items-center mt-0.5">
                      <MapPin className="h-3 w-3 mr-1 shrink-0" />
                      {aiRecommendation.hospital.area}, {aiRecommendation.hospital.city}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <StatusBadge status={aiRecommendation.hospital.status} />
                    {aiRecommendation.hospital.emergencyLevel && (
                      <Badge variant="outline" className="text-[10px] py-0 h-5 font-normal text-muted-foreground border-muted-foreground/30">
                        Hospital Load: {aiRecommendation.hospital.emergencyLevel}
                      </Badge>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-1 bg-muted/40 rounded-md p-2 text-center">
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase">Beds</p>
                      <p className="font-bold text-sm">{aiRecommendation.hospital.bedsAvailable}</p>
                    </div>
                    <div className="border-x border-border/60">
                      <p className="text-[10px] text-muted-foreground uppercase">ICU</p>
                      <p className="font-bold text-sm text-purple-600 dark:text-purple-400">{aiRecommendation.hospital.icuAvailable}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground uppercase">Vent</p>
                      <p className="font-bold text-sm text-cyan-600 dark:text-cyan-400">{aiRecommendation.hospital.ventilatorsAvailable}</p>
                    </div>
                  </div>
                  {aiRecommendation.hospital.contactNumber && (
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Phone className="h-3 w-3 shrink-0" />
                      {aiRecommendation.hospital.contactNumber}
                    </p>
                  )}
                </div>
                <Button size="sm" className="w-full" asChild>
                  <a href={`tel:${aiRecommendation.hospital.contactNumber}`}>
                    <Phone className="h-4 w-4 mr-2" />
                    Call Hospital
                  </a>
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 py-1">
              <div className="flex items-center gap-3 flex-1">
                <div className="bg-muted h-9 w-9 rounded-full flex items-center justify-center shrink-0">
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-semibold text-sm">No suitable hospital found</p>
                  <p className="text-xs text-muted-foreground">
                    No suitable hospital found for the selected filters. Try expanding the area/facility or contact the emergency helpline.
                  </p>
                </div>
              </div>
              {(searchTerm || Object.values(filters).some((v) => v !== "all")) && (
                <Button variant="outline" size="sm" onClick={resetFilters} className="shrink-0">
                  Expand Search
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Filters ────────────────────────────────────────── */}
      <div className="bg-card border rounded-xl p-4 shadow-sm">
        <div className="flex flex-col gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search hospitals by name or area..."
              className="pl-9 w-full bg-background"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <Select value={filters.area} onValueChange={(v) => setFilters((p) => ({ ...p, area: v }))}>
              <SelectTrigger className="w-[140px] bg-background">
                <SelectValue placeholder="Area" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Areas</SelectItem>
                {areas.map((a) => <SelectItem key={a} value={a}>{a}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select value={filters.facility} onValueChange={(v) => setFilters((p) => ({ ...p, facility: v }))}>
              <SelectTrigger className="w-[160px] bg-background">
                <SelectValue placeholder="Facility" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Facilities</SelectItem>
                {[
                  "General Beds", "ICU", "Ventilator", "Blood Bank",
                  "Trauma Care", "Kidney Care", "Liver Care", "Cardiology",
                  "Neurology", "Emergency Ward", "Operation Theatre",
                ].map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select value={filters.status} onValueChange={(v) => setFilters((p) => ({ ...p, status: v }))}>
              <SelectTrigger className="w-[135px] bg-background">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Available">Available</SelectItem>
                <SelectItem value="Limited">Limited</SelectItem>
                <SelectItem value="Full">Full</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.emergencyLevel} onValueChange={(v) => setFilters((p) => ({ ...p, emergencyLevel: v }))}>
              <SelectTrigger className="w-[140px] bg-background">
                <SelectValue placeholder="Emergency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Critical">Critical</SelectItem>
              </SelectContent>
            </Select>

            {(searchTerm || Object.values(filters).some((v) => v !== "all")) && (
              <Button variant="ghost" size="sm" onClick={resetFilters} className="text-muted-foreground">
                Clear filters
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* ── Hospital Grid ──────────────────────────────────── */}
      <div>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          Hospital Grid
          {!hospitalsLoading && hospitals && (
            <Badge variant="secondary" className="ml-1 font-normal text-xs">
              {hospitals.length} Results
            </Badge>
          )}
        </h2>

        {hospitalsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2 mt-1" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-20 w-full mb-2" />
                  <Skeleton className="h-8 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : hospitals && hospitals.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence>
              {hospitals.map((hospital, i) => (
                <motion.div
                  key={hospital.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: i * 0.04 }}
                  layout
                >
                  <Card className="h-full flex flex-col hover:border-primary/40 transition-all shadow-sm group hover:shadow-md">
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start gap-2">
                        <div className="min-w-0">
                          <CardTitle className="text-base line-clamp-1 group-hover:text-primary transition-colors">
                            {hospital.name}
                          </CardTitle>
                          <CardDescription className="flex items-center mt-0.5 text-xs">
                            <MapPin className="h-3 w-3 mr-1 shrink-0" />
                            {hospital.area}
                            {!selectedCity && (
                              <span className="ml-1 text-muted-foreground/60">· {hospital.city}</span>
                            )}
                          </CardDescription>
                        </div>
                        <div className="flex flex-col items-end gap-1 shrink-0">
                          <StatusBadge status={hospital.status} />
                          <EmergencyLevelBadge level={hospital.emergencyLevel} />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-1 pb-4">
                      <div className="grid grid-cols-3 gap-2 mb-4 bg-muted/30 p-3 rounded-lg border border-border/50">
                        <div className="text-center">
                          <div className="flex items-center justify-center text-muted-foreground mb-1">
                            <Bed className="h-4 w-4 mr-1" />
                            <span className="text-[10px] font-medium uppercase">Beds</span>
                          </div>
                          <span className="text-lg font-bold">{hospital.bedsAvailable}</span>
                        </div>
                        <div className="text-center border-x border-border/50">
                          <div className="flex items-center justify-center text-muted-foreground mb-1">
                            <Activity className="h-4 w-4 mr-1 text-purple-500" />
                            <span className="text-[10px] font-medium uppercase">ICU</span>
                          </div>
                          <span className="text-lg font-bold text-purple-600 dark:text-purple-400">{hospital.icuAvailable}</span>
                        </div>
                        <div className="text-center">
                          <div className="flex items-center justify-center text-muted-foreground mb-1">
                            <Wind className="h-4 w-4 mr-1 text-cyan-500" />
                            <span className="text-[10px] font-medium uppercase">Vent</span>
                          </div>
                          <span className="text-lg font-bold text-cyan-600 dark:text-cyan-400">{hospital.ventilatorsAvailable}</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {hospital.bloodUnitsAvailable && (
                          <div className="flex items-center text-sm">
                            <Droplets className="h-4 w-4 text-red-500 mr-2 shrink-0" />
                            <span className="text-muted-foreground mr-1 text-xs">Blood:</span>
                            <span className="font-medium text-xs">{hospital.bloodUnitsAvailable}</span>
                          </div>
                        )}
                        <div className="flex items-start text-sm">
                          <Star className="h-4 w-4 text-amber-500 mr-2 shrink-0 mt-0.5" />
                          <div className="flex flex-wrap gap-1">
                            {hospital.specialties.slice(0, 3).map((spec, idx) => (
                              <Badge key={idx} variant="outline" className="text-[10px] py-0 h-5 font-normal bg-background">
                                {spec}
                              </Badge>
                            ))}
                            {hospital.specialties.length > 3 && (
                              <Badge variant="outline" className="text-[10px] py-0 h-5 font-normal bg-background">
                                +{hospital.specialties.length - 3}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center text-xs text-muted-foreground mt-3 pt-3 border-t">
                          <Clock className="h-3 w-3 mr-1" />
                          Updated {formatDistanceToNow(new Date(hospital.lastUpdated), { addSuffix: true })}
                        </div>
                      </div>
                    </CardContent>
                    <div className="px-4 pb-4 pt-3 flex gap-2 border-t bg-muted/10 mt-auto">
                      <Button variant="outline" size="sm" className="flex-1 bg-background" asChild>
                        <a href={`tel:${hospital.contactNumber}`}>
                          <Phone className="h-4 w-4 mr-1.5" />
                          Call
                        </a>
                      </Button>
                      <Button variant="default" size="sm" className="flex-1" asChild>
                        <Link href={`/update?hospital=${hospital.id}&city=${hospital.city}`}>
                          Update
                        </Link>
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="bg-card border border-dashed rounded-xl p-12 text-center shadow-sm">
            <div className="bg-muted h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-bold mb-2">No hospitals found</h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              {selectedCity
                ? `No facilities in ${selectedCity} match your current filters.`
                : "Select a city or adjust your filters to see hospitals."}
            </p>
            <Button variant="outline" onClick={resetFilters}>Clear all filters</Button>
          </div>
        )}
      </div>

      {/* ── Emergency Contacts ─────────────────────────────── */}
      {emergencyContacts ? (
        <Card className="border-red-500/20 shadow-sm">
          <CardHeader className="pb-3 border-b border-red-500/10 bg-red-500/5 rounded-t-lg">
            <div className="flex items-center gap-2">
              <div className="bg-red-500/20 p-2 rounded-lg">
                <PhoneCall className="h-4 w-4 text-red-500" />
              </div>
              <div>
                <CardTitle className="text-base">Emergency Contacts</CardTitle>
                <CardDescription className="text-xs">
                  {emergencyContacts.city} · {emergencyContacts.state}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
              <Button size="sm" variant="destructive" className="w-full justify-start gap-2 h-9" asChild>
                <a href="tel:112">
                  <ShieldAlert className="h-4 w-4" />
                  <div className="text-left">
                    <div className="text-[10px] opacity-80 leading-none">National</div>
                    <div className="font-bold text-xs">112</div>
                  </div>
                </a>
              </Button>
              <Button size="sm" variant="outline" className="w-full justify-start gap-2 h-9 border-red-500/30 text-red-600 dark:text-red-400 hover:bg-red-500/10" asChild>
                <a href={`tel:${emergencyContacts.ambulance}`}>
                  <HeartPulse className="h-4 w-4" />
                  <div className="text-left">
                    <div className="text-[10px] opacity-70 leading-none">Ambulance</div>
                    <div className="font-bold text-xs">{emergencyContacts.ambulance}</div>
                  </div>
                </a>
              </Button>
              <Button size="sm" variant="outline" className="w-full justify-start gap-2 h-9 border-blue-500/30 text-blue-600 dark:text-blue-400 hover:bg-blue-500/10" asChild>
                <a href={`tel:${emergencyContacts.police}`}>
                  <ShieldAlert className="h-4 w-4" />
                  <div className="text-left">
                    <div className="text-[10px] opacity-70 leading-none">Police</div>
                    <div className="font-bold text-xs">{emergencyContacts.police}</div>
                  </div>
                </a>
              </Button>
              <Button size="sm" variant="outline" className="w-full justify-start gap-2 h-9 border-orange-500/30 text-orange-600 dark:text-orange-400 hover:bg-orange-500/10" asChild>
                <a href={`tel:${emergencyContacts.fire}`}>
                  <Flame className="h-4 w-4" />
                  <div className="text-left">
                    <div className="text-[10px] opacity-70 leading-none">Fire</div>
                    <div className="font-bold text-xs">{emergencyContacts.fire}</div>
                  </div>
                </a>
              </Button>
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-muted-foreground border-t pt-3">
              <div className="flex gap-2">
                <span>Health Helpline</span>
                <a href={`tel:${emergencyContacts.healthHelpline}`} className="font-semibold text-foreground">
                  {emergencyContacts.healthHelpline}
                </a>
              </div>
              <div className="flex gap-2">
                <span>Disaster Mgmt</span>
                <a href={`tel:${emergencyContacts.disaster}`} className="font-semibold text-foreground">
                  {emergencyContacts.disaster}
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-red-500/20 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <PhoneCall className="h-5 w-5 text-red-500" />
              National Emergency Contacts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-8 gap-y-1 text-sm">
              {[
                { label: "Emergency Response", number: "112" },
                { label: "Ambulance", number: "108" },
                { label: "Police", number: "100" },
                { label: "Fire", number: "101" },
                { label: "Women Helpline", number: "1091" },
                { label: "Child Helpline", number: "1098" },
              ].map((c) => (
                <div key={c.label} className="flex justify-between items-center py-1">
                  <span className="text-muted-foreground">{c.label}</span>
                  <a href={`tel:${c.number}`} className="font-bold text-foreground hover:text-primary">
                    {c.number}
                  </a>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

    </div>
  );
}
