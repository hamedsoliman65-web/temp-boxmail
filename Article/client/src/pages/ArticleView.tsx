import { useRoute, Link } from "wouter";
import { articles } from "@/data/articles";
import { useLanguage } from "@/components/LanguageContext";
import { ArrowLeft, ArrowRight, Calendar, User } from "lucide-react";
import { motion } from "framer-motion";
import NotFound from "./not-found";

export default function ArticleView() {
  const [match, params] = useRoute("/article/:id");
  const { language } = useLanguage();
  const isRTL = language === "ar";

  if (!match) return <NotFound />;

  const article = articles.find((a) => a.id === params.id);

  if (!article) return <NotFound />;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-background text-foreground py-12 px-4 sm:px-6 lg:px-8" 
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="max-w-3xl mx-auto">
        {/* Back Button */}
        <Link href="/">
          <a className="inline-flex items-center gap-2 text-primary hover:text-white mb-8 transition-colors group">
            {isRTL ? <ArrowRight className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> : <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />}
            <span>{isRTL ? "العودة للرئيسية" : "Back to Home"}</span>
          </a>
        </Link>

        <article className="bg-card border border-border rounded-xl overflow-hidden shadow-2xl">
          {/* Hero Image */}
          <div className="relative h-64 md:h-96 w-full">
            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-10" />
            <img 
              src={article.thumbnail} 
              alt={article.title[language]} 
              className="w-full h-full object-cover"
            />
          </div>

          <div className="p-8 md:p-12 relative z-20 -mt-20">
            {/* Meta tags */}
            <div className="flex gap-4 text-sm text-primary font-medium mb-4">
              <span className="bg-primary/10 px-3 py-1 rounded-full backdrop-blur-md border border-primary/20">Technology</span>
              <span className="bg-primary/10 px-3 py-1 rounded-full backdrop-blur-md border border-primary/20">2025</span>
            </div>

            <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
              {article.title[language]}
            </h1>

            <div className="flex items-center gap-6 text-muted-foreground text-sm mb-8 border-b border-border pb-8">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>Admin</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Dec 09, 2025</span>
              </div>
            </div>

            <div className="prose prose-invert prose-lg max-w-none text-muted-foreground leading-loose">
              <p className="text-xl text-white mb-8 font-medium border-l-4 border-destructive pl-4 rtl:border-l-0 rtl:border-r-4 rtl:pr-4 rtl:pl-0">
                {article.description[language]}
              </p>
              <p>
                {article.content[language]}
              </p>
              
              {/* Fake extra content for visual length */}
              <p className="mt-6">
                {isRTL 
                  ? "لوريم إيبسوم دولار سيت أميت، كونسيكتيتور أديبايسينغ إيليت. سيد دو إيوسمود تيمبور إنكيديدونت أوت لابوري إت دولوري ماغنا أليكا. أوت إنيم أد مينيم فينيام، كويس نوسترود إكسيرسيتاسيون أولامكو لابوريس نيسي أوت أليكويب إكس إيا كومودو كونسيكوات."
                  : "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat."}
              </p>
            </div>
          </div>
        </article>
      </div>
    </motion.div>
  );
}
