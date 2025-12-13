import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageCircle, Send } from "lucide-react";

export interface Comment {
  id: string;
  name: string;
  email: string;
  content: string;
  createdAt: string;
}

interface CommentSectionProps {
  articleId: string;
  comments: Comment[];
  onAddComment?: (comment: Omit<Comment, "id" | "createdAt">) => void;
}

export default function CommentSection({
  articleId,
  comments,
  onAddComment,
}: CommentSectionProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !content.trim()) return;

    setSubmitting(true);
    console.log("Submitting comment:", { name, email, content, articleId });

    onAddComment?.({ name, email, content });

    setName("");
    setEmail("");
    setContent("");
    setSubmitting(false);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <section className="max-w-3xl mx-auto mt-12" data-testid="comment-section">
      <div className="flex items-center gap-2 mb-6">
        <MessageCircle className="w-5 h-5 text-primary" />
        <h2 className="text-xl font-semibold text-foreground">
          Comments ({comments.length})
        </h2>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-lg">Leave a Comment</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Input
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  data-testid="input-comment-name"
                />
              </div>
              <div>
                <Input
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  data-testid="input-comment-email"
                />
              </div>
            </div>
            <Textarea
              placeholder="Write your comment..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              required
              className="resize-none"
              data-testid="input-comment-content"
            />
            <Button type="submit" disabled={submitting} data-testid="button-submit-comment">
              <Send className="w-4 h-4 mr-2" />
              {submitting ? "Posting..." : "Post Comment"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            No comments yet. Be the first to share your thoughts!
          </p>
        ) : (
          comments.map((comment) => (
            <Card
              key={comment.id}
              className="border-l-4 border-l-primary"
              data-testid={`comment-${comment.id}`}
            >
              <CardContent className="pt-4">
                <div className="flex items-start gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarFallback className="bg-primary/10 text-primary text-sm">
                      {getInitials(comment.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-foreground" data-testid={`text-comment-name-${comment.id}`}>
                        {comment.name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(comment.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <p className="text-foreground text-sm" data-testid={`text-comment-content-${comment.id}`}>
                      {comment.content}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </section>
  );
}
