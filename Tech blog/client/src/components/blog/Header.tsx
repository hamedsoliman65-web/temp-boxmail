import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Search, Menu, X, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface HeaderProps {
  onSearch?: (query: string) => void;
}

export default function Header({ onSearch }: HeaderProps) {
  const [location] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
    console.log("Search triggered:", searchQuery);
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/category/ai", label: "AI" },
    { href: "/category/cybersecurity", label: "Cybersecurity" },
    { href: "/category/technology", label: "Technology" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-16">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-1">
              <Mail className="w-6 h-6 text-primary" />
              <span className="font-bold text-xl text-foreground">Temp Box</span>
              <span className="font-bold text-xl text-primary">Blog</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <Button
                  variant={location === link.href ? "secondary" : "ghost"}
                  size="sm"
                  data-testid={`nav-${link.label.toLowerCase()}`}
                >
                  {link.label}
                </Button>
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {searchOpen ? (
              <form onSubmit={handleSearch} className="flex items-center gap-2">
                <Input
                  type="search"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-48 sm:w-64"
                  data-testid="input-search"
                  autoFocus
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setSearchOpen(false)}
                  data-testid="button-close-search"
                >
                  <X className="w-4 h-4" />
                </Button>
              </form>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSearchOpen(true)}
                data-testid="button-open-search"
              >
                <Search className="w-4 h-4" />
              </Button>
            )}

            <a
              href="https://temp-boxmail.org"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:block"
            >
              <Button variant="default" size="sm" data-testid="button-main-site">
                <Mail className="w-4 h-4 mr-2" />
                Get Temp Mail
              </Button>
            </a>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {mobileMenuOpen && (
          <nav className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <Button
                    variant={location === link.href ? "secondary" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setMobileMenuOpen(false)}
                    data-testid={`nav-mobile-${link.label.toLowerCase()}`}
                  >
                    {link.label}
                  </Button>
                </Link>
              ))}
              <a
                href="https://temp-boxmail.org"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2"
              >
                <Button variant="default" className="w-full" data-testid="button-mobile-main-site">
                  <Mail className="w-4 h-4 mr-2" />
                  Get Temp Mail
                </Button>
              </a>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
