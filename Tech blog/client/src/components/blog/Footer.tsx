import { Mail, ExternalLink } from "lucide-react";
import { SiGithub, SiX } from "react-icons/si";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-border mt-16" data-testid="footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Mail className="w-6 h-6 text-primary" />
              <span className="font-bold text-lg text-foreground">Temp Box Mail Blog</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Your source for the latest insights on AI, cybersecurity, and technology trends.
              Protecting your privacy, one article at a time.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href="https://temp-boxmail.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                  data-testid="link-main-site"
                >
                  Temp Box Mail
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
              <li>
                <a
                  href="/category/ai"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  data-testid="link-ai"
                >
                  AI Articles
                </a>
              </li>
              <li>
                <a
                  href="/category/cybersecurity"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  data-testid="link-cybersecurity"
                >
                  Cybersecurity Articles
                </a>
              </li>
              <li>
                <a
                  href="/category/technology"
                  className="text-muted-foreground hover:text-primary transition-colors"
                  data-testid="link-technology"
                >
                  Technology Articles
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Connect</h3>
            <div className="flex gap-3">
              <a
                href="https://temp-boxmail.org"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                data-testid="link-social-mail"
              >
                <Mail className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                data-testid="link-social-x"
              >
                <SiX className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-primary-foreground transition-colors"
                data-testid="link-social-github"
              >
                <SiGithub className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p data-testid="text-copyright">
            &copy; {currentYear} Temp Box Mail. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
