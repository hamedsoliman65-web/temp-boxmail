import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import ShareButtons from "./ShareButtons";

interface ArticleContentProps {
  title: string;
  category: "AI" | "Cybersecurity" | "Technology";
  publishedAt: string;
  readTime: number;
  heroImage: string;
  content: string;
  slug: string;
}

export default function ArticleContent({
  title,
  category,
  publishedAt,
  readTime,
  heroImage,
  content,
  slug,
}: ArticleContentProps) {
  const categoryColors = {
    AI: "bg-primary/10 text-primary",
    Cybersecurity: "bg-accent-orange/10 text-accent-orange",
    Technology: "bg-chart-3/20 text-chart-3",
  };

  const articleUrl = typeof window !== "undefined" 
    ? `${window.location.origin}/article/${slug}`
    : `/article/${slug}`;

  return (
    <article className="max-w-4xl mx-auto" data-testid="article-content">
      <div className="mb-6">
        <Link href="/">
          <Button variant="ghost" size="sm" className="mb-4" data-testid="button-back">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Articles
          </Button>
        </Link>
      </div>

      <div className="relative aspect-video mb-8 rounded-lg overflow-hidden">
        <img
          src={heroImage}
          alt={title}
          className="w-full h-full object-cover"
          data-testid="img-article-hero"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </div>

      <header className="mb-8">
        <Badge
          variant="secondary"
          className={`mb-4 ${categoryColors[category]}`}
          data-testid="badge-article-category"
        >
          {category}
        </Badge>
        <h1
          className="text-3xl sm:text-4xl font-bold text-foreground mb-4 leading-tight"
          data-testid="text-article-title"
        >
          {title}
        </h1>
        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            {new Date(publishedAt).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            {readTime} min read
          </span>
        </div>
        <ShareButtons title={title} url={articleUrl} />
      </header>

      <div
        className="prose prose-lg max-w-none dark:prose-invert prose-headings:text-foreground prose-p:text-foreground prose-a:text-primary prose-a:underline hover:prose-a:text-primary/80 prose-strong:text-foreground prose-img:rounded-lg"
        dangerouslySetInnerHTML={{ __html: content }}
        data-testid="article-body"
      />

      <footer className="mt-12 pt-8 border-t border-border">
        <h3 className="text-lg font-semibold mb-4 text-foreground">Share this article</h3>
        <ShareButtons title={title} url={articleUrl} />
      </footer>
    </article>
  );
}
