import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertTriangle,
  BookOpen,
  Calendar,
  Eye,
  EyeOff,
  Lock,
  PenLine,
  Plus,
  RefreshCw,
  Tag,
  Trash2,
  Unlock,
  User,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { BlogPost } from "../backend";
import { PageHead } from "../components/PageHead";
import { SmokySectionTransition } from "../components/SmokySectionTransition";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useCreateBlogPost,
  useDeleteBlogPost,
  usePublishedPosts,
} from "../hooks/useQueries";

export default function DeveloperBlogPage() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const { data: posts = [], isLoading } = usePublishedPosts();
  const createPost = useCreateBlogPost();
  const deletePost = useDeleteBlogPost();

  // Author panel state
  const [authorUnlocked, setAuthorUnlocked] = useState(false);
  const [authorPasscode, setAuthorPasscode] = useState("");
  const [authorPasscodeError, setAuthorPasscodeError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [showPasscode, setShowPasscode] = useState(false);
  const [verifiedPasscode, setVerifiedPasscode] = useState("");

  // New post form state
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [body, setBody] = useState("");
  const [author, setAuthor] = useState("");
  const [tags, setTags] = useState("");
  const [formError, setFormError] = useState("");

  // Post view state
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  const sortedPosts = [...posts].sort(
    (a, b) => Number(b.createdAt) - Number(a.createdAt),
  );

  const handleUnlockAuthor = async () => {
    if (!authorPasscode.trim()) {
      setAuthorPasscodeError("Enter the passcode");
      return;
    }
    if (!actor) {
      setAuthorPasscodeError("System not ready");
      return;
    }
    setIsVerifying(true);
    setAuthorPasscodeError("");
    try {
      const valid = await actor.verifyMarketIntelPasscode(
        authorPasscode.trim(),
      );
      if (valid) {
        setAuthorUnlocked(true);
        setVerifiedPasscode(authorPasscode.trim());
        setAuthorPasscode("");
        toast.success("Author panel unlocked");
      } else {
        setAuthorPasscodeError("Invalid passcode");
      }
    } catch {
      setAuthorPasscodeError("Verification failed");
    } finally {
      setIsVerifying(false);
    }
  };

  const handlePublish = async () => {
    setFormError("");
    if (!title.trim()) {
      setFormError("Title is required");
      return;
    }
    if (!body.trim()) {
      setFormError("Content is required");
      return;
    }
    if (!author.trim()) {
      setFormError("Author name is required");
      return;
    }

    const post: BlogPost = {
      id: BigInt(0),
      title: title.trim(),
      category: category.trim() || "General",
      body: body.trim(),
      author: author.trim(),
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      createdAt: BigInt(0),
      updatedAt: undefined,
      isPublished: true,
    };

    try {
      await createPost.mutateAsync({ post, passcode: verifiedPasscode });
      toast.success("Post published successfully!");
      setTitle("");
      setCategory("");
      setBody("");
      setAuthor("");
      setTags("");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Publish failed";
      setFormError(msg);
    }
  };

  const handleDelete = async (id: bigint) => {
    try {
      await deletePost.mutateAsync({ id, authorCode: verifiedPasscode });
      toast.success("Post deleted");
      if (selectedPost?.id === id) setSelectedPost(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Delete failed";
      toast.error(msg);
    }
  };

  return (
    <>
      <PageHead
        title="Developer Blog | RBS"
        description="Insights, updates, and technical articles from the RBS team"
      />
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-gray-900 to-black text-white">
        {/* Hero */}
        <SmokySectionTransition>
          <div className="relative py-16 px-4 text-center border-b border-amber-500/10">
            <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 to-transparent pointer-events-none" />
            <div className="flex items-center justify-center gap-3 mb-4">
              <BookOpen className="w-8 h-8 text-amber-400" />
              <h1 className="text-4xl md:text-5xl font-bold text-amber-400">
                Developer Blog
              </h1>
            </div>
            <p className="text-gray-400 max-w-xl mx-auto">
              Technical insights, platform updates, and ecosystem news from the
              RBS development team
            </p>
          </div>
        </SmokySectionTransition>

        <div className="max-w-6xl mx-auto px-4 py-10 space-y-10">
          {/* Author Panel Toggle */}
          {isAuthenticated && (
            <SmokySectionTransition>
              <div className="bg-gray-900/60 border border-amber-500/20 rounded-2xl p-6 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-amber-400 font-bold text-lg flex items-center gap-2">
                    <PenLine className="w-5 h-5" /> Author Panel
                  </h2>
                  {authorUnlocked && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setAuthorUnlocked(false);
                        setVerifiedPasscode("");
                      }}
                      className="text-gray-400 hover:text-white text-xs"
                    >
                      <Lock className="w-3 h-3 mr-1" /> Lock Panel
                    </Button>
                  )}
                </div>

                {!authorUnlocked ? (
                  <div className="max-w-sm">
                    <p className="text-gray-400 text-sm mb-3">
                      Enter your Market Intel passcode to access the author
                      panel.
                    </p>
                    <div className="relative mb-3">
                      <Input
                        type={showPasscode ? "text" : "password"}
                        value={authorPasscode}
                        onChange={(e) => {
                          setAuthorPasscode(e.target.value);
                          setAuthorPasscodeError("");
                        }}
                        onKeyDown={(e) =>
                          e.key === "Enter" && handleUnlockAuthor()
                        }
                        placeholder="Enter passcode"
                        className="bg-black/40 border-gray-700 text-white pr-10 font-mono"
                        disabled={isVerifying}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasscode((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                      >
                        {showPasscode ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    {authorPasscodeError && (
                      <p className="text-red-400 text-xs mb-3 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" />{" "}
                        {authorPasscodeError}
                      </p>
                    )}
                    <Button
                      onClick={handleUnlockAuthor}
                      disabled={isVerifying || !authorPasscode.trim()}
                      className="bg-amber-500 hover:bg-amber-400 text-black font-bold"
                    >
                      {isVerifying ? (
                        <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                      ) : (
                        <Unlock className="w-4 h-4 mr-2" />
                      )}
                      {isVerifying ? "Verifying..." : "Unlock Author Panel"}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="blog-title"
                          className="text-gray-400 text-sm mb-1 block"
                        >
                          Title *
                        </label>
                        <Input
                          id="blog-title"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="Post title"
                          className="bg-black/40 border-gray-700 text-white"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="blog-author"
                          className="text-gray-400 text-sm mb-1 block"
                        >
                          Author *
                        </label>
                        <Input
                          id="blog-author"
                          value={author}
                          onChange={(e) => setAuthor(e.target.value)}
                          placeholder="Your name"
                          className="bg-black/40 border-gray-700 text-white"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="blog-category"
                          className="text-gray-400 text-sm mb-1 block"
                        >
                          Category
                        </label>
                        <Input
                          id="blog-category"
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          placeholder="e.g. Technical, Update, News"
                          className="bg-black/40 border-gray-700 text-white"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="blog-tags"
                          className="text-gray-400 text-sm mb-1 block"
                        >
                          Tags (comma-separated)
                        </label>
                        <Input
                          id="blog-tags"
                          value={tags}
                          onChange={(e) => setTags(e.target.value)}
                          placeholder="blockchain, defi, rbs"
                          className="bg-black/40 border-gray-700 text-white"
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="blog-content"
                        className="text-gray-400 text-sm mb-1 block"
                      >
                        Content *
                      </label>
                      <Textarea
                        id="blog-content"
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        placeholder="Write your post content here..."
                        className="bg-black/40 border-gray-700 text-white resize-none min-h-[200px]"
                        rows={8}
                      />
                    </div>
                    {formError && (
                      <p className="text-red-400 text-sm flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> {formError}
                      </p>
                    )}
                    <Button
                      onClick={handlePublish}
                      disabled={createPost.isPending}
                      className="bg-amber-500 hover:bg-amber-400 text-black font-bold"
                    >
                      {createPost.isPending ? (
                        <span className="flex items-center gap-2">
                          <RefreshCw className="w-4 h-4 animate-spin" />{" "}
                          Publishing...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Plus className="w-4 h-4" /> Publish Post
                        </span>
                      )}
                    </Button>
                  </div>
                )}
              </div>
            </SmokySectionTransition>
          )}

          {/* Gradient Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />

          {/* Posts Grid */}
          <SmokySectionTransition>
            <h2 className="text-2xl font-bold text-amber-400 mb-6">
              Published Posts
            </h2>
          </SmokySectionTransition>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(["b1", "b2", "b3", "b4", "b5", "b6"] as const).map((sk) => (
                <div
                  key={sk}
                  className="h-56 bg-gray-800/50 rounded-xl animate-pulse"
                />
              ))}
            </div>
          ) : sortedPosts.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No posts published yet.</p>
              {isAuthenticated && (
                <p className="text-sm mt-1">
                  Use the Author Panel above to publish the first post.
                </p>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedPosts.map((post, idx) => (
                <SmokySectionTransition key={post.id.toString()}>
                  <BlogPostCard
                    post={post}
                    authorUnlocked={authorUnlocked}
                    isDeleting={deletePost.isPending}
                    onView={() => setSelectedPost(post)}
                    onDelete={() => handleDelete(post.id)}
                    animDelay={idx * 60}
                  />
                </SmokySectionTransition>
              ))}
            </div>
          )}
        </div>

        {/* Post View Dialog */}
        <Dialog
          open={!!selectedPost}
          onOpenChange={(open) => !open && setSelectedPost(null)}
        >
          <DialogContent className="bg-gray-900 border-gray-700 max-w-2xl max-h-[80vh] overflow-y-auto">
            {selectedPost && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-amber-400 text-xl leading-snug">
                    {selectedPost.title}
                  </DialogTitle>
                  <DialogDescription className="text-gray-400">
                    <span className="flex items-center gap-3 flex-wrap mt-1">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" /> {selectedPost.author}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />{" "}
                        {new Date(
                          Number(selectedPost.createdAt) / 1_000_000,
                        ).toLocaleDateString()}
                      </span>
                      {selectedPost.category && (
                        <Badge
                          variant="outline"
                          className="border-amber-500/30 text-amber-400 text-xs"
                        >
                          {selectedPost.category}
                        </Badge>
                      )}
                    </span>
                  </DialogDescription>
                </DialogHeader>
                <div className="mt-4 text-gray-300 leading-relaxed whitespace-pre-wrap text-sm">
                  {selectedPost.body}
                </div>
                {selectedPost.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-700">
                    {selectedPost.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="bg-gray-800 text-gray-400 text-xs"
                      >
                        <Tag className="w-2.5 h-2.5 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}

// ── Blog Post Card ────────────────────────────────────────────────────────────

interface BlogPostCardProps {
  post: BlogPost;
  authorUnlocked: boolean;
  isDeleting: boolean;
  onView: () => void;
  onDelete: () => void;
  animDelay?: number;
}

function BlogPostCard({
  post,
  authorUnlocked,
  isDeleting,
  onView,
  onDelete,
  animDelay = 0,
}: BlogPostCardProps) {
  const excerpt =
    post.body.length > 150 ? `${post.body.slice(0, 150)}…` : post.body;
  const date = new Date(Number(post.createdAt) / 1_000_000).toLocaleDateString(
    "en-US",
    { year: "numeric", month: "short", day: "numeric" },
  );

  return (
    <div
      className="relative bg-gray-900/60 border border-amber-500/20 rounded-2xl p-5 backdrop-blur-sm hover:border-amber-500/40 hover:scale-[1.02] hover:shadow-lg hover:shadow-amber-500/10 transition-all duration-300 group flex flex-col"
      style={{ animationDelay: `${animDelay}ms` }}
    >
      <button
        type="button"
        className="absolute inset-0 w-full h-full rounded-2xl cursor-pointer opacity-0"
        onClick={onView}
        aria-label={`Read ${post.title}`}
      />
      <div className="flex items-start justify-between gap-2 mb-3">
        <Badge
          variant="outline"
          className="border-amber-500/30 text-amber-400 text-xs flex-shrink-0"
        >
          {post.category || "General"}
        </Badge>
        {authorUnlocked && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="w-6 h-6 text-red-400/50 hover:text-red-400 hover:bg-red-500/10 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                disabled={isDeleting}
                onClick={(e) => e.stopPropagation()}
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent
              className="bg-gray-900 border-gray-700"
              onClick={(e) => e.stopPropagation()}
            >
              <AlertDialogHeader>
                <AlertDialogTitle className="text-white">
                  Delete Post?
                </AlertDialogTitle>
                <AlertDialogDescription className="text-gray-400">
                  This will permanently delete "{post.title}". This action
                  cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="border-gray-600 text-gray-300">
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={onDelete}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      <h3 className="text-white font-bold text-base leading-snug mb-2 group-hover:text-amber-300 transition-colors">
        {post.title}
      </h3>
      <p className="text-gray-400 text-sm leading-relaxed flex-1 mb-4">
        {excerpt}
      </p>

      <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-700/50">
        <span className="flex items-center gap-1">
          <User className="w-3 h-3" /> {post.author}
        </span>
        <span className="flex items-center gap-1">
          <Calendar className="w-3 h-3" /> {date}
        </span>
      </div>

      {post.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-2">
          {post.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="text-xs text-gray-600 bg-gray-800/50 px-1.5 py-0.5 rounded"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
