import { Article } from "@/data/articles";
import { useLanguage } from "./LanguageContext";
import { Link } from "wouter";
import { motion } from "framer-motion";

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
  const { language } = useLanguage();
  const isRTL = language === "ar";

  return (
    <Link href={`/article/${article.id}`}>
      <motion.div 
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="group cursor-pointer bg-card border border-border hover:border-primary/50 overflow-hidden rounded-lg shadow-md transition-all duration-300 flex h-40"
        dir={isRTL ? "rtl" : "ltr"}
      >
        {/* External Link Style Image (Thumbnail) */}
        <div className="w-1/3 h-full shrink-0 relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/20 group-hover:bg-transparent transition-colors duration-300 z-10" />
          <img 
            src={article.thumbnail} 
            alt={article.title[language]} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 grayscale group-hover:grayscale-0"
          />
        </div>
        
        {/* Content */}
        <div className="flex-1 p-4 flex flex-col justify-center">
          <h3 className="text-lg font-bold text-primary mb-2 line-clamp-1 group-hover:text-white transition-colors">
            {article.title[language]}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
            {article.description[language]}
          </p>
        </div>
      </motion.div>
    </Link>
  );
}
