import { useState } from "react";
import AdminLogin from "@/components/blog/AdminLogin";
import AdminDashboard from "@/components/blog/AdminDashboard";
import type { Article } from "@/components/blog/ArticleCard";

import mlImage from "@assets/generated_images/machine_learning_article_image.png";
import cyberImage from "@assets/generated_images/cybersecurity_article_image.png";
import cloudImage from "@assets/generated_images/cloud_technology_article_image.png";
import privacyImage from "@assets/generated_images/privacy_protection_article_image.png";
import aiCollab from "@assets/generated_images/ai_collaboration_article_image.png";
import heroImage from "@assets/generated_images/ai_cybersecurity_hero_banner.png";

// todo: remove mock functionality - replace with API authentication
const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "tempboxmail2024";

// todo: remove mock functionality - replace with API data
const initialArticles: Article[] = [
  {
    id: "1",
    title: "The Future of Machine Learning in Enterprise Applications",
    excerpt: "Discover how machine learning is transforming business operations and creating new opportunities for growth and innovation.",
    category: "AI",
    imageUrl: mlImage,
    publishedAt: "2024-12-10T10:00:00Z",
    readTime: 8,
    slug: "future-of-machine-learning",
  },
  {
    id: "2",
    title: "Essential Cybersecurity Practices for Remote Workers",
    excerpt: "Protect your data and privacy while working remotely with these crucial security measures and best practices.",
    category: "Cybersecurity",
    imageUrl: cyberImage,
    publishedAt: "2024-12-09T14:30:00Z",
    readTime: 6,
    slug: "cybersecurity-remote-workers",
  },
  {
    id: "3",
    title: "Cloud Computing Trends Shaping 2025",
    excerpt: "Explore the emerging cloud technologies and architectural patterns that will define the next generation of digital infrastructure.",
    category: "Technology",
    imageUrl: cloudImage,
    publishedAt: "2024-12-08T09:15:00Z",
    readTime: 10,
    slug: "cloud-computing-trends-2025",
  },
  {
    id: "4",
    title: "Privacy-First Email Solutions: Why They Matter",
    excerpt: "Understanding the importance of temporary email services and privacy-focused communication in the modern digital age.",
    category: "Cybersecurity",
    imageUrl: privacyImage,
    publishedAt: "2024-12-07T16:45:00Z",
    readTime: 5,
    slug: "privacy-first-email-solutions",
  },
  {
    id: "5",
    title: "AI and Human Collaboration: Finding the Balance",
    excerpt: "How artificial intelligence is augmenting human capabilities rather than replacing them in creative and analytical workflows.",
    category: "AI",
    imageUrl: aiCollab,
    publishedAt: "2024-12-06T11:20:00Z",
    readTime: 7,
    slug: "ai-human-collaboration",
  },
  {
    id: "6",
    title: "Zero Trust Architecture: A Complete Guide",
    excerpt: "Learn how to implement zero trust security principles to protect your organization from modern cyber threats.",
    category: "Cybersecurity",
    imageUrl: heroImage,
    publishedAt: "2024-12-05T13:00:00Z",
    readTime: 12,
    slug: "zero-trust-architecture-guide",
  },
];

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [articles, setArticles] = useState<Article[]>(initialArticles);

  const handleLogin = async (username: string, password: string): Promise<boolean> => {
    // todo: replace with API authentication
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      console.log("Admin authenticated successfully");
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    console.log("Admin logged out");
  };

  const handleAddArticle = (article: Omit<Article, "id" | "slug">) => {
    const id = String(articles.length + 1);
    const slug = article.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    
    setArticles([{ ...article, id, slug }, ...articles]);
    console.log("Article created:", article.title);
  };

  const handleEditArticle = (id: string, updates: Partial<Article>) => {
    setArticles(articles.map((a) => (a.id === id ? { ...a, ...updates } : a)));
    console.log("Article updated:", id);
  };

  const handleDeleteArticle = (id: string) => {
    setArticles(articles.filter((a) => a.id !== id));
    console.log("Article deleted:", id);
  };

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <AdminDashboard
      articles={articles}
      onAddArticle={handleAddArticle}
      onEditArticle={handleEditArticle}
      onDeleteArticle={handleDeleteArticle}
      onLogout={handleLogout}
    />
  );
}
