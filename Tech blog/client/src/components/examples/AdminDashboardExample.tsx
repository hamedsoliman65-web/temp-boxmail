import { useState } from "react";
import AdminDashboard from "../blog/AdminDashboard";
import type { Article } from "../blog/ArticleCard";
import mlImage from "@assets/generated_images/machine_learning_article_image.png";
import cyberImage from "@assets/generated_images/cybersecurity_article_image.png";

export default function AdminDashboardExample() {
  const [articles, setArticles] = useState<Article[]>([
    {
      id: "1",
      title: "Understanding Machine Learning Algorithms",
      excerpt: "A deep dive into the most popular ML algorithms.",
      category: "AI",
      imageUrl: mlImage,
      publishedAt: "2024-12-08T10:00:00Z",
      readTime: 12,
      slug: "understanding-ml-algorithms",
    },
    {
      id: "2",
      title: "Cybersecurity Best Practices for 2025",
      excerpt: "Essential security measures for the modern digital landscape.",
      category: "Cybersecurity",
      imageUrl: cyberImage,
      publishedAt: "2024-12-10T14:00:00Z",
      readTime: 8,
      slug: "cybersecurity-best-practices-2025",
    },
  ]);

  const handleAddArticle = (article: Omit<Article, "id" | "slug">) => {
    const id = String(articles.length + 1);
    const slug = article.title.toLowerCase().replace(/\s+/g, "-");
    setArticles([...articles, { ...article, id, slug }]);
  };

  const handleEditArticle = (id: string, updates: Partial<Article>) => {
    setArticles(
      articles.map((a) => (a.id === id ? { ...a, ...updates } : a))
    );
  };

  const handleDeleteArticle = (id: string) => {
    setArticles(articles.filter((a) => a.id !== id));
  };

  return (
    <AdminDashboard
      articles={articles}
      onAddArticle={handleAddArticle}
      onEditArticle={handleEditArticle}
      onDeleteArticle={handleDeleteArticle}
      onLogout={() => console.log("Logout triggered")}
    />
  );
}
