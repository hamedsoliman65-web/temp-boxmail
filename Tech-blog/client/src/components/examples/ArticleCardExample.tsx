import ArticleCard from "../blog/ArticleCard";
import mlImage from "@assets/generated_images/machine_learning_article_image.png";

export default function ArticleCardExample() {
  return (
    <div className="max-w-sm">
      <ArticleCard
        article={{
          id: "1",
          title: "The Future of Machine Learning in Enterprise Applications",
          excerpt: "Discover how machine learning is transforming business operations and creating new opportunities for growth and innovation.",
          category: "AI",
          imageUrl: mlImage,
          publishedAt: "2024-12-10T10:00:00Z",
          readTime: 8,
          slug: "future-of-machine-learning",
        }}
      />
    </div>
  );
}
