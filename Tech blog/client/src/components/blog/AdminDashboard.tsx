import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, LogOut, FileText, Eye } from "lucide-react";
import type { Article } from "./ArticleCard";

interface AdminDashboardProps {
  articles: Article[];
  onAddArticle: (article: Omit<Article, "id" | "slug">) => void;
  onEditArticle: (id: string, article: Partial<Article>) => void;
  onDeleteArticle: (id: string) => void;
  onLogout: () => void;
}

export default function AdminDashboard({
  articles,
  onAddArticle,
  onEditArticle,
  onDeleteArticle,
  onLogout,
}: AdminDashboardProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    category: "AI" as "AI" | "Cybersecurity" | "Technology",
    imageUrl: "",
    content: "",
    readTime: 5,
  });

  const resetForm = () => {
    setFormData({
      title: "",
      excerpt: "",
      category: "AI",
      imageUrl: "",
      content: "",
      readTime: 5,
    });
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.excerpt || !formData.content) {
      console.log("Form validation failed");
      return;
    }

    if (editingArticle) {
      onEditArticle(editingArticle.id, formData);
      console.log("Article updated:", editingArticle.id);
      setEditingArticle(null);
    } else {
      onAddArticle({
        ...formData,
        publishedAt: new Date().toISOString(),
      });
      console.log("New article created:", formData.title);
      setIsAddDialogOpen(false);
    }
    resetForm();
  };

  const handleEdit = (article: Article) => {
    setFormData({
      title: article.title,
      excerpt: article.excerpt,
      category: article.category,
      imageUrl: article.imageUrl,
      content: "",
      readTime: article.readTime,
    });
    setEditingArticle(article);
  };

  const handleDelete = (id: string) => {
    onDeleteArticle(id);
    setDeleteConfirmId(null);
    console.log("Article deleted:", id);
  };

  const ArticleForm = () => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          placeholder="Article title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          data-testid="input-article-title"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="excerpt">Excerpt</Label>
        <Textarea
          id="excerpt"
          placeholder="Brief description of the article"
          value={formData.excerpt}
          onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
          rows={2}
          className="resize-none"
          data-testid="input-article-excerpt"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Category</Label>
          <Select
            value={formData.category}
            onValueChange={(value: "AI" | "Cybersecurity" | "Technology") =>
              setFormData({ ...formData, category: value })
            }
          >
            <SelectTrigger data-testid="select-article-category">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="AI">AI</SelectItem>
              <SelectItem value="Cybersecurity">Cybersecurity</SelectItem>
              <SelectItem value="Technology">Technology</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="readTime">Read Time (min)</Label>
          <Input
            id="readTime"
            type="number"
            min={1}
            value={formData.readTime}
            onChange={(e) =>
              setFormData({ ...formData, readTime: parseInt(e.target.value) || 5 })
            }
            data-testid="input-article-readtime"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="imageUrl">Featured Image URL</Label>
        <Input
          id="imageUrl"
          placeholder="https://example.com/image.jpg"
          value={formData.imageUrl}
          onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
          data-testid="input-article-image"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Content (HTML)</Label>
        <Textarea
          id="content"
          placeholder="<p>Your article content here...</p>"
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          rows={10}
          className="font-mono text-sm"
          data-testid="input-article-content"
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background" data-testid="admin-dashboard">
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4 h-16">
            <div className="flex items-center gap-2">
              <FileText className="w-6 h-6 text-primary" />
              <span className="font-bold text-xl text-foreground">Blog Admin</span>
            </div>

            <div className="flex items-center gap-2">
              <a href="/" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm" data-testid="button-view-blog">
                  <Eye className="w-4 h-4 mr-2" />
                  View Blog
                </Button>
              </a>
              <Button
                variant="ghost"
                size="sm"
                onClick={onLogout}
                data-testid="button-logout"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Articles</h1>
            <p className="text-muted-foreground">Manage your blog posts</p>
          </div>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button data-testid="button-add-article">
                <Plus className="w-4 h-4 mr-2" />
                New Article
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Article</DialogTitle>
                <DialogDescription>
                  Add a new article to your blog
                </DialogDescription>
              </DialogHeader>
              <ArticleForm />
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSubmit} data-testid="button-save-article">
                  Create Article
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Published</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {articles.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      No articles yet. Create your first article!
                    </TableCell>
                  </TableRow>
                ) : (
                  articles.map((article) => (
                    <TableRow key={article.id} data-testid={`row-article-${article.id}`}>
                      <TableCell className="font-medium max-w-xs truncate">
                        {article.title}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{article.category}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(article.publishedAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Dialog
                            open={editingArticle?.id === article.id}
                            onOpenChange={(open) => {
                              if (!open) {
                                setEditingArticle(null);
                                resetForm();
                              }
                            }}
                          >
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEdit(article)}
                                data-testid={`button-edit-${article.id}`}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle>Edit Article</DialogTitle>
                                <DialogDescription>
                                  Make changes to your article
                                </DialogDescription>
                              </DialogHeader>
                              <ArticleForm />
                              <DialogFooter>
                                <Button
                                  variant="outline"
                                  onClick={() => {
                                    setEditingArticle(null);
                                    resetForm();
                                  }}
                                >
                                  Cancel
                                </Button>
                                <Button onClick={handleSubmit} data-testid="button-update-article">
                                  Update Article
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>

                          <Dialog
                            open={deleteConfirmId === article.id}
                            onOpenChange={(open) => !open && setDeleteConfirmId(null)}
                          >
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setDeleteConfirmId(article.id)}
                                data-testid={`button-delete-${article.id}`}
                              >
                                <Trash2 className="w-4 h-4 text-destructive" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Delete Article</DialogTitle>
                                <DialogDescription>
                                  Are you sure you want to delete "{article.title}"? This action
                                  cannot be undone.
                                </DialogDescription>
                              </DialogHeader>
                              <DialogFooter>
                                <Button
                                  variant="outline"
                                  onClick={() => setDeleteConfirmId(null)}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  variant="destructive"
                                  onClick={() => handleDelete(article.id)}
                                  data-testid="button-confirm-delete"
                                >
                                  Delete
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
