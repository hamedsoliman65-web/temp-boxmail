import { articles } from "@/data/articles";
import { ArticleCard } from "@/components/ArticleCard";
import { useLanguage } from "@/components/LanguageContext";
import { Moon, Sun, Globe } from "lucide-react";

export default function Home() {
  const { language, toggleLanguage } = useLanguage();
  const isRTL = language === "ar";

  return (
    <div className="min-h-screen bg-background text-foreground py-12 px-4 sm:px-6 lg:px-8" dir={isRTL ? "rtl" : "ltr"}>
      
      {/* Header with langToggle simulation */}
      <header className="max-w-6xl mx-auto mb-12 flex justify-between items-center border-b border-border pb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            <span className="text-primary">Tech</span>Blog
          </h1>
          <p className="text-muted-foreground">
            {language === 'ar' ? 'أحدث المقالات التقنية' : 'Latest Tech Articles'}
          </p>
        </div>
        
        <button 
          onClick={toggleLanguage}
          className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary hover:bg-primary/20 border border-border hover:border-primary transition-all text-sm font-medium"
          id="langToggle" // ID as requested
        >
          <Globe className="w-4 h-4 text-primary" />
          <span>{language === 'ar' ? 'English' : 'عربي'}</span>
        </button>
      </header>

      {/* Grid Layout: 2 Columns, 3 Rows (total 6 items) */}
      <main className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </main>

      <footer className="max-w-6xl mx-auto mt-12 pt-6 border-t border-border text-center text-muted-foreground text-sm">
        <p>&copy; 2025 TechBlog. {language === 'ar' ? 'جميع الحقوق محفوظة' : 'All rights reserved'}.</p>
      </footer>
    </div>
  );
}
