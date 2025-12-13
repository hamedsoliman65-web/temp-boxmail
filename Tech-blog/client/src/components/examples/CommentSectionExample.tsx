import { useState } from "react";
import CommentSection, { type Comment } from "../blog/CommentSection";

export default function CommentSectionExample() {
  const [comments, setComments] = useState<Comment[]>([
    {
      id: "1",
      name: "Alice Johnson",
      email: "alice@example.com",
      content: "Great article! Really helped me understand the basics of AI security.",
      createdAt: "2024-12-09T14:30:00Z",
    },
    {
      id: "2",
      name: "Bob Smith",
      email: "bob@example.com",
      content: "Very informative. Looking forward to more content like this!",
      createdAt: "2024-12-10T09:15:00Z",
    },
  ]);

  const handleAddComment = (comment: Omit<Comment, "id" | "createdAt">) => {
    setComments([
      ...comments,
      {
        ...comment,
        id: String(comments.length + 1),
        createdAt: new Date().toISOString(),
      },
    ]);
  };

  return (
    <div className="p-4">
      <CommentSection
        articleId="example-article"
        comments={comments}
        onAddComment={handleAddComment}
      />
    </div>
  );
}
