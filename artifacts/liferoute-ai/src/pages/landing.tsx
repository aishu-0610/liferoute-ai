import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Activity, Clock, ShieldCheck, ArrowRight, HeartPulse, Zap, MapPin, Search } from "lucide-react";
import { motion } from "framer-motion";
import { useGetCities } from "@workspace/api-client-react";
import { useCity } from "@/context/city-context";

const FEATURED_CITIES = [
  "Madurai", "Chennai", "Bengaluru", "Mumbai", "Delhi",
  "Hyderabad", "Kochi", "Coimbatore", "Pune", "Kolkata",
];

export default function Landing() {
  const [, setLocation] = useLocation();
  const { setSelectedCity } = useCity();
  const [input, setInput] = useState("");
  const { data: cities } = useGetCities();

  const handleCityGo = (city: string) => {
    const trimmed = city.trim();
    if (!trimmed) return;
    setSelectedCity(trimmed);
    setLocation("/dashboard");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleCityGo(input);
  };

  const cityHasData = (name: string) => {
    return cities?.find((c) => c.name.toLowerCase() === name.toLowerCase())?.hasData ?? false;
  };

  return (
    <div className="flex flex-col w-full">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 via-background to-background pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="container px-4 md:px-6 mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-medium text-primary mb-8"
          >
            <Activity className="mr-2 h-4 w-4" />
            Multi-City Emergency Command Center
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-4xl mx-auto text-foreground mb-6"
          >
            Find the right hospital faster when{" "}
            <span className="text-primary">every minute matters.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
          >
            LifeRoute AI shows live hospital availability, emergency contacts, and smart recommendations for any city — all in one centralized dashboard. Stop guessing. Start saving lives.
          </motion.p>

          {/* City Input */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="max-w-xl mx-auto mb-6"
          >
            <div className="flex gap-2 bg-card border rounded-2xl p-2 shadow-lg">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Enter your city (e.g. Chennai, Mumbai...)"
                  className="pl-9 border-0 bg-transparent focus-visible:ring-0 text-base"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </div>
              <Button
                size="lg"
                className="rounded-xl px-6 shrink-0"
                onClick={() => handleCityGo(input)}
                disabled={!input.trim()}
              >
                Open City Dashboard <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </motion.div>

          {/* Quick City Chips */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="flex flex-wrap justify-center gap-2 max-w-2xl mx-auto mb-10"
          >
            {FEATURED_CITIES.map((city) => {
              const hasData = cityHasData(city);
              return (
                <button
                  key={city}
                  onClick={() => handleCityGo(city)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-all hover:border-primary/50 hover:bg-primary/5 bg-card"
                >
                  <MapPin className="h-3 w-3 text-muted-foreground" />
                  {city}
                  {hasData && (
                    <span className="h-1.5 w-1.5 rounded-full bg-green-500 inline-block" />
                  )}
                </button>
              );
            })}
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.55 }}
            className="text-xs text-muted-foreground flex items-center justify-center gap-2"
          >
            <span className="h-2 w-2 rounded-full bg-green-500 inline-block" />
            Green dot indicates live sample data available
          </motion.div>
        </div>
      </section>

      {/* Problem/Solution Cards */}
      <section className="py-16 bg-muted/30">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card p-6 rounded-2xl border shadow-sm">
              <Clock className="h-10 w-10 text-primary mb-4" />
              <h3 className="text-xl font-bold mb-2">The Golden Hour</h3>
              <p className="text-muted-foreground">
                In critical trauma, survival drops significantly if definitive care is delayed beyond 60 minutes. Routing to full hospitals wastes precious time.
              </p>
            </div>
            <div className="bg-card p-6 rounded-2xl border shadow-sm">
              <HeartPulse className="h-10 w-10 text-destructive mb-4" />
              <h3 className="text-xl font-bold mb-2">Resource Uncertainty</h3>
              <p className="text-muted-foreground">
                Ambulances often arrive at ERs only to find no ICU beds or ventilators available, forcing dangerous secondary transfers across the city.
              </p>
            </div>
            <div className="bg-card p-6 rounded-2xl border shadow-sm">
              <ShieldCheck className="h-10 w-10 text-green-500 mb-4" />
              <h3 className="text-xl font-bold mb-2">Our Solution</h3>
              <p className="text-muted-foreground">
                A city-based unified availability grid with AI recommendations, ensuring patients are routed to the right facility — in any city, instantly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-24">
        <div className="container px-4 md:px-6 mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">How LifeRoute Works</h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-12">A simple three-step process designed for high-pressure situations.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto relative">
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-border -z-10" />
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-primary/10 text-primary flex items-center justify-center text-3xl font-bold mb-6 border-4 border-background shadow-sm">1</div>
              <h3 className="text-xl font-semibold mb-3">Select Your City</h3>
              <p className="text-muted-foreground">Enter your city and instantly see all hospitals with live resource availability in that area.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-primary/10 text-primary flex items-center justify-center text-3xl font-bold mb-6 border-4 border-background shadow-sm">2</div>
              <h3 className="text-xl font-semibold mb-3">Filter by Need</h3>
              <p className="text-muted-foreground">Filter by area, facility type (ICU, ventilator, trauma), and emergency level to narrow down options fast.</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-primary/10 text-primary flex items-center justify-center text-3xl font-bold mb-6 border-4 border-background shadow-sm">3</div>
              <h3 className="text-xl font-semibold mb-3">Get Routed Instantly</h3>
              <p className="text-muted-foreground">The AI engine recommends the best hospital in your city with city-specific emergency contacts for immediate action.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-16 bg-muted/30">
        <div className="container px-4 md:px-6 mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">Built for Every Emergency Scenario</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "City-Based Dashboard", desc: "Switch between cities instantly" },
              { label: "AI Recommendation", desc: "Scoring-based best hospital match" },
              { label: "Emergency Contacts", desc: "State & city-specific helplines" },
              { label: "Live Status Badges", desc: "Available / Limited / Full" },
              { label: "ICU & Ventilator Tracking", desc: "Critical resource visibility" },
              { label: "Hospital Update Panel", desc: "Staff can update in real time" },
              { label: "Dark Mode Support", desc: "Optimized for night shifts" },
              { label: "Mobile Responsive", desc: "Works on any device" },
            ].map((f) => (
              <div key={f.label} className="bg-card border rounded-xl p-4 shadow-sm">
                <p className="font-semibold text-sm mb-1">{f.label}</p>
                <p className="text-xs text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Future Scope */}
      <section className="py-16">
        <div className="container px-4 md:px-6 mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">Future Scope</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { label: "GPS-Based Auto Detection", desc: "Automatically detect city from user's location." },
              { label: "Real-Time Hospital API", desc: "Live feeds from hospital management systems." },
              { label: "Ambulance Dispatch Integration", desc: "Direct dispatch from the recommendation engine." },
            ].map((f) => (
              <div key={f.label} className="bg-card border rounded-xl p-5 shadow-sm">
                <Badge variant="outline" className="mb-3 text-primary border-primary/30">Planned</Badge>
                <h3 className="font-semibold mb-2">{f.label}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-primary text-primary-foreground text-center">
        <div className="container px-4 md:px-6 mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to see it in action?</h2>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto mb-10">
            Select any city and access live hospital stats, filters, AI recommendations, and emergency contacts — all in one place.
          </p>
          <Button size="lg" variant="secondary" className="text-primary text-lg px-10 h-14 rounded-full shadow-lg" asChild>
            <Link href="/dashboard">
              Launch Dashboard <Zap className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
