import { Link } from "wouter";
import { Clock, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  category: "AI" | "Cybersecurity" | "Technology";
  imageUrl: string;
  publishedAt: string;
  readTime: number;
  slug: string;
}

interface ArticleCardProps {
  article: Article;
}

export default function ArticleCard({ article }: ArticleCardProps) {
  const categoryColors = {
    AI: "bg-primary/10 text-primary",
    Cybersecurity: "bg-accent-orange/10 text-accent-orange",
    Technology: "bg-chart-3/20 text-chart-3",
  };

  return (
    <Link href={`/article/${article.slug}`}>
      <Card
        className="overflow-hidden hover-elevate active-elevate-2 cursor-pointer transition-transform duration-200 h-full"
        data-testid={`card-article-${article.id}`}
      >
        <div className="aspect-video overflow-hidden">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            data-testid={`img-article-${article.id}`}
          />
        </div>
        <CardContent className="p-5">
          <Badge
            variant="secondary"
            className={`mb-3 ${categoryColors[article.category]}`}
            data-testid={`badge-category-${article.id}`}
          >
            {article.category}
          </Badge>
          <h3
            className="font-semibold text-lg leading-tight mb-2 line-clamp-2 text-foreground"
            data-testid={`text-title-${article.id}`}
          >
            {article.title}
          </h3>
          <p
            className="text-muted-foreground text-sm mb-4 line-clamp-2"
            data-testid={`text-excerpt-${article.id}`}
          >
            {article.excerpt}
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {new Date(article.publishedAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {article.readTime} min read
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
