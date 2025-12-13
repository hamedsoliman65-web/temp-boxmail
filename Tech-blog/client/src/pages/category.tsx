import { useMemo } from "react";
import { useParams } from "wouter";
import Header from "@/components/blog/Header";
import ArticleCard, { type Article } from "@/components/blog/ArticleCard";
import Footer from "@/components/blog/Footer";
import { Badge } from "@/components/ui/badge";
import { Cpu, Shield, Laptop } from "lucide-react";

import mlImage from "@assets/generated_images/machine_learning_article_image.png";
import cyberImage from "@assets/generated_images/cybersecurity_article_image.png";
import cloudImage from "@assets/generated_images/cloud_technology_article_image.png";
import privacyImage from "@assets/generated_images/privacy_protection_article_image.png";
import aiCollab from "@assets/generated_images/ai_collaboration_article_image.png";
import heroImage from "@assets/generated_images/ai_cybersecurity_hero_banner.png";

// todo: remove mock functionality - replace with API data
const mockArticles: Article[] = [
  {
    id: "1",
    title: "The Future of Machine Learning in Enterprise Applications",
    excerpt: "Discover how machine learning is transforming business operations.",
    category: "AI",
    imageUrl: mlImage,
    publishedAt: "2024-12-10T10:00:00Z",
    readTime: 8,
    slug: "future-of-machine-learning",
  },
  {
    id: "2",
    title: "Essential Cybersecurity Practices for Remote Workers",
    excerpt: "Protect your data and privacy while working remotely.",
    category: "Cybersecurity",
    imageUrl: cyberImage,
    publishedAt: "2024-12-09T14:30:00Z",
    readTime: 6,
    slug: "cybersecurity-remote-workers",
  },
  {
    id: "3",
    title: "Cloud Computing Trends Shaping 2025",
    excerpt: "Explore the emerging cloud technologies and architectural patterns.",
    category: "Technology",
    imageUrl: cloudImage,
    publishedAt: "2024-12-08T09:15:00Z",
    readTime: 10,
    slug: "cloud-computing-trends-2025",
  },
  {
    id: "4",
    title: "Privacy-First Email Solutions: Why They Matter",
    excerpt: "Understanding the importance of temporary email services.",
    category: "Cybersecurity",
    imageUrl: privacyImage,
    publishedAt: "2024-12-07T16:45:00Z",
    readTime: 5,
    slug: "privacy-first-email-solutions",
  },
  {
    id: "5",
    title: "AI and Human Collaboration: Finding the Balance",
    excerpt: "How AI is augmenting human capabilities in workflows.",
    category: "AI",
    imageUrl: aiCollab,
    publishedAt: "2024-12-06T11:20:00Z",
    readTime: 7,
    slug: "ai-human-collaboration",
  },
  {
    id: "6",
    title: "Zero Trust Architecture: A Complete Guide",
    excerpt: "Learn how to implement zero trust security principles.",
    category: "Cybersecurity",
    imageUrl: heroImage,
    publishedAt: "2024-12-05T13:00:00Z",
    readTime: 12,
    slug: "zero-trust-architecture-guide",
  },
];

const categoryInfo = {
  ai: {
    name: "AI",
    label: "Artificial Intelligence",
    description: "Explore the latest developments in artificial intelligence, machine learning, and their applications in technology and business.",
    icon: Cpu,
    color: "bg-primary/10 text-primary",
  },
  cybersecurity: {
    name: "Cybersecurity",
    label: "Cybersecurity",
    description: "Stay informed about security best practices, threat prevention, and protecting your digital assets.",
    icon: Shield,
    color: "bg-accent-orange/10 text-accent-orange",
  },
  technology: {
    name: "Technology",
    label: "Technology",
    description: "Discover the latest trends in cloud computing, software development, and digital transformation.",
    icon: Laptop,
    color: "bg-chart-3/20 text-chart-3",
  },
};

export default function CategoryPage() {
  const { category } = useParams<{ category: string }>();
  const categoryKey = category?.toLowerCase() as keyof typeof categoryInfo;
  const info = categoryKey ? categoryInfo[categoryKey] : null;

  const filteredArticles = useMemo(() => {
    if (!info) return [];
    return mockArticles.filter(
      (a) => a.category.toLowerCase() === categoryKey
    );
  }, [categoryKey, info]);

  if (!info) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-2">Category Not Found</h1>
            <p className="text-muted-foreground">The category you're looking for doesn't exist.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const Icon = info.icon;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <section className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-3 mb-4">
            <div className={`p-3 rounded-lg ${info.color}`}>
              <Icon className="w-6 h-6" />
            </div>
            <Badge variant="secondary" className={info.color}>
              {filteredArticles.length} articles
            </Badge>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-3" data-testid="text-category-title">
            {info.label}
          </h1>
          <p className="text-muted-foreground max-w-2xl" data-testid="text-category-description">
            {info.description}
          </p>
        </div>
      </section>

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {filteredArticles.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">
              No articles found in this category.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
