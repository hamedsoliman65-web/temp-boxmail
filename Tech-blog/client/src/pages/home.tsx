import { useState, useMemo } from "react";
import Header from "@/components/blog/Header";
import HeroBanner from "@/components/blog/HeroBanner";
import CategoryFilter from "@/components/blog/CategoryFilter";
import ArticleCard, { type Article } from "@/components/blog/ArticleCard";
import Footer from "@/components/blog/Footer";

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
    excerpt:
      "Discover how machine learning is transforming business operations and creating new opportunities for growth and innovation across industries.",
    category: "AI",
    imageUrl: mlImage,
    publishedAt: "2024-12-10T10:00:00Z",
    readTime: 8,
    slug: "future-of-machine-learning",
  },
  {
    id: "2",
    title: "Essential Cybersecurity Practices for Remote Workers",
    excerpt:
      "Protect your data and privacy while working remotely with these crucial security measures and best practices.",
    category: "Cybersecurity",
    imageUrl: cyberImage,
    publishedAt: "2024-12-09T14:30:00Z",
    readTime: 6,
    slug: "cybersecurity-remote-workers",
  },
  {
    id: "3",
    title: "Cloud Computing Trends Shaping 2025",
    excerpt:
      "Explore the emerging cloud technologies and architectural patterns that will define the next generation of digital infrastructure.",
    category: "Technology",
    imageUrl: cloudImage,
    publishedAt: "2024-12-08T09:15:00Z",
    readTime: 10,
    slug: "cloud-computing-trends-2025",
  },
  {
    id: "4",
    title: "Privacy-First Email Solutions: Why They Matter",
    excerpt:
      "Understanding the importance of temporary email services and privacy-focused communication in the modern digital age.",
    category: "Cybersecurity",
    imageUrl: privacyImage,
    publishedAt: "2024-12-07T16:45:00Z",
    readTime: 5,
    slug: "privacy-first-email-solutions",
  },
  {
    id: "5",
    title: "AI and Human Collaboration: Finding the Balance",
    excerpt:
      "How artificial intelligence is augmenting human capabilities rather than replacing them in creative and analytical workflows.",
    category: "AI",
    imageUrl: aiCollab,
    publishedAt: "2024-12-06T11:20:00Z",
    readTime: 7,
    slug: "ai-human-collaboration",
  },
  {
    id: "6",
    title: "Zero Trust Architecture: A Complete Guide",
    excerpt:
      "Learn how to implement zero trust security principles to protect your organization from modern cyber threats.",
    category: "Cybersecurity",
    imageUrl: heroImage,
    publishedAt: "2024-12-05T13:00:00Z",
    readTime: 12,
    slug: "zero-trust-architecture-guide",
  },
];

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredArticles = useMemo(() => {
    let articles = mockArticles;

    if (selectedCategory) {
      articles = articles.filter((a) => a.category === selectedCategory);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      articles = articles.filter(
        (a) =>
          a.title.toLowerCase().includes(query) ||
          a.excerpt.toLowerCase().includes(query)
      );
    }

    return articles;
  }, [selectedCategory, searchQuery]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header onSearch={setSearchQuery} />
      <HeroBanner />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-foreground" data-testid="text-section-title">
              Latest Articles
            </h2>
            <p className="text-muted-foreground">
              {filteredArticles.length} article{filteredArticles.length !== 1 ? "s" : ""} found
            </p>
          </div>
          <CategoryFilter
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>

        {filteredArticles.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg">
              No articles found matching your criteria.
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
