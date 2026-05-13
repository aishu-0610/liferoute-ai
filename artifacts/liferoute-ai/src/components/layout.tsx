import { Link } from "wouter";
import { ThemeProvider } from "./theme-provider";
import { Moon, Sun, Activity, Menu, Phone } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "./ui/sheet";

function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="text-muted-foreground hover:text-foreground"
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}

function NavLinks({ isMobile = false, close = () => {} }: { isMobile?: boolean; close?: () => void }) {
  const linkClass = isMobile 
    ? "block px-4 py-2 text-lg font-medium text-foreground hover:bg-accent/10 rounded-md" 
    : "text-sm font-medium text-muted-foreground hover:text-foreground transition-colors";

  return (
    <>
      <Link href="/dashboard" className={linkClass} onClick={close}>
        Dashboard
      </Link>
      <Link href="/update" className={linkClass} onClick={close}>
        Update Panel
      </Link>
    </>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="min-h-screen flex flex-col font-sans">
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link href="/" className="flex items-center gap-2 text-primary hover:opacity-90 transition-opacity">
                <div className="bg-primary text-primary-foreground p-1.5 rounded-md">
                  <Activity className="h-5 w-5" />
                </div>
                <span className="font-bold text-xl tracking-tight text-foreground">LifeRoute<span className="text-primary">AI</span></span>
              </Link>
            </div>
            
            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-6">
              <nav className="flex items-center gap-6">
                <NavLinks />
              </nav>
              <div className="flex items-center gap-2 border-l pl-6">
                <ThemeToggle />
              </div>
            </div>

            {/* Mobile Nav */}
            <div className="md:hidden flex items-center gap-2">
              <ThemeToggle />
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                  <SheetHeader>
                    <SheetTitle className="text-left flex items-center gap-2">
                       <Activity className="h-5 w-5 text-primary" />
                       LifeRoute AI
                    </SheetTitle>
                  </SheetHeader>
                  <nav className="flex flex-col gap-2 mt-8">
                    <Link href="/" className="block px-4 py-2 text-lg font-medium text-foreground hover:bg-accent/10 rounded-md" onClick={() => setIsOpen(false)}>
                      Home
                    </Link>
                    <NavLinks isMobile close={() => setIsOpen(false)} />
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </header>

        <main className="flex-1">
          {children}
        </main>

        <footer className="border-t bg-muted/40 py-8 md:py-12 mt-12">
          <div className="container mx-auto px-4 text-center md:text-left">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                  <Activity className="h-5 w-5 text-primary" />
                  <span className="font-bold text-lg">LifeRoute<span className="text-primary">AI</span></span>
                </div>
                <p className="text-sm text-muted-foreground">
                  A centralized emergency hospital availability dashboard.
                  Find the right hospital faster when every minute matters.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-4">Quick Links</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><Link href="/dashboard" className="hover:text-foreground">Dashboard</Link></li>
                  <li><Link href="/update" className="hover:text-foreground">Update Availability</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-4">National Emergency Contacts</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center justify-center md:justify-start gap-2">
                    <Phone className="h-4 w-4 text-red-500" />
                    <span>Emergency Response: <strong className="text-foreground">112</strong></span>
                  </li>
                  <li className="flex items-center justify-center md:justify-start gap-2">
                    <Phone className="h-4 w-4" />
                    <span>Ambulance: <strong className="text-foreground">108</strong></span>
                  </li>
                  <li className="flex items-center justify-center md:justify-start gap-2">
                    <Phone className="h-4 w-4" />
                    <span>Police: <strong className="text-foreground">100</strong></span>
                  </li>
                  <li className="flex items-center justify-center md:justify-start gap-2">
                    <Phone className="h-4 w-4" />
                    <span>Fire: <strong className="text-foreground">101</strong></span>
                  </li>
                  <li className="flex items-center justify-center md:justify-start gap-2">
                    <Phone className="h-4 w-4" />
                    <span>Women Helpline: <strong className="text-foreground">1091</strong></span>
                  </li>
                  <li className="flex items-center justify-center md:justify-start gap-2">
                    <Phone className="h-4 w-4" />
                    <span>Child Helpline: <strong className="text-foreground">1098</strong></span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t text-sm text-muted-foreground text-center">
              © {new Date().getFullYear()} LifeRoute AI Command Center. Hackathon Project.
            </div>
          </div>
        </footer>
      </div>
    </ThemeProvider>
  );
}