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
  Globe,
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
import { useGlobalSectionLock } from "../hooks/useGlobalSectionLock";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useCreateBlogPost,
  useDeleteBlogPost,
  usePublishedPosts,
} from "../hooks/useQueries";

export default function DeveloperBlogPage() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const { data: posts = [], isLoading } = usePublishedPosts();
  const createPost = useCreateBlogPost();
  const deletePost = useDeleteBlogPost();

  // Global section lock — synced across all users
  const { isUnlocked: sectionUnlocked, setLock: setSectionLock } =
    useGlobalSectionLock("developerBlog");

  // Author panel UI state
  const [authorPasscode, setAuthorPasscode] = useState("");
  const [authorPasscodeError, setAuthorPasscodeError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [showPasscode, setShowPasscode] = useState(false);
  const [verifiedPasscode, setVerifiedPasscode] = useState("");
  const [showLockInput, setShowLockInput] = useState(false);
  const [lockPasscode, setLockPasscode] = useState("");
  const [lockError, setLockError] = useState("");
  const [isLocking, setIsLocking] = useState(false);

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
    setAuthorPasscodeError("");
    try {
      // Globally unlock the developer blog section for all users
      await setSectionLock(authorPasscode.trim(), true);
      setVerifiedPasscode(authorPasscode.trim());
      setAuthorPasscode("");
      toast.success("Developer Blog globally unlocked for all users");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Verification failed";
      if (
        msg.toLowerCase().includes("invalid") ||
        msg.toLowerCase().includes("passcode") ||
        msg.toLowerCase().includes("wrong")
      ) {
        setAuthorPasscodeError("Invalid passcode");
      } else {
        setAuthorPasscodeError("Verification failed");
      }
    } finally {
      setIsVerifying(false);
    }
  };

  const handleLockPanel = async () => {
    if (!lockPasscode.trim()) {
      setLockError("Enter passcode to lock");
      return;
    }
    setIsLocking(true);
    setLockError("");
    try {
      await setSectionLock(lockPasscode.trim(), false);
      setVerifiedPasscode("");
      setLockPasscode("");
      setShowLockInput(false);
      toast.success("Developer Blog globally locked for all users");
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Lock failed";
      if (
        msg.toLowerCase().includes("invalid") ||
        msg.toLowerCase().includes("passcode") ||
        msg.toLowerCase().includes("wrong")
      ) {
        setLockError("Invalid passcode");
      } else {
        setLockError("Lock failed");
      }
    } finally {
      setIsLocking(false);
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
      <div className="min-h-screen bg-white text-gray-900">
        {/* Hero */}
        <SmokySectionTransition>
          <div
            className="relative py-16 px-4 text-center border-b"
            style={{
              background:
                "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #f8faff 100%)",
              borderColor: "rgba(14, 165, 233, 0.15)",
            }}
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <BookOpen className="w-8 h-8 text-emerald-600" />
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
                Developer Blog
              </h1>
            </div>
            <p className="text-gray-500 max-w-xl mx-auto">
              Technical insights, platform updates, and ecosystem news from the
              RBS development team
            </p>
            {sectionUnlocked && (
              <div className="inline-flex items-center gap-2 mt-4 px-3 py-1.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                <Globe className="w-3.5 h-3.5" />
                Globally Accessible — All users can publish
              </div>
            )}
          </div>
        </SmokySectionTransition>

        <div className="max-w-6xl mx-auto px-4 py-10 space-y-10">
          {/* Author Panel Toggle */}
          {isAuthenticated && (
            <SmokySectionTransition>
              <div
                className="rounded-2xl p-6"
                style={{
                  background: "rgba(255, 255, 255, 0.9)",
                  border: "1px solid rgba(14, 165, 233, 0.2)",
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-gray-900 font-bold text-lg flex items-center gap-2">
                    <PenLine className="w-5 h-5 text-emerald-600" /> Author
                    Panel
                    {sectionUnlocked && (
                      <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs ml-1">
                        <Globe className="w-3 h-3 mr-1" />
                        Globally Active
                      </Badge>
                    )}
                  </h2>
                  {sectionUnlocked && !showLockInput && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowLockInput(true)}
                      className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 text-xs"
                    >
                      <Lock className="w-3 h-3 mr-1" /> Lock Panel
                    </Button>
                  )}
                </div>

                {/* Lock panel form */}
                {showLockInput && (
                  <div
                    className="mb-4 p-4 rounded-xl"
                    style={{
                      background: "rgba(255, 241, 242, 0.8)",
                      border: "1px solid rgba(239, 68, 68, 0.2)",
                    }}
                  >
                    <p className="text-gray-600 text-sm mb-3">
                      Enter passcode to globally lock the Developer Blog for all
                      users.
                    </p>
                    <div className="flex gap-2">
                      <Input
                        type="password"
                        value={lockPasscode}
                        onChange={(e) => {
                          setLockPasscode(e.target.value);
                          setLockError("");
                        }}
                        onKeyDown={(e) =>
                          e.key === "Enter" && handleLockPanel()
                        }
                        placeholder="Enter passcode"
                        className="bg-white border-gray-300 text-gray-900 font-mono flex-1"
                        disabled={isLocking}
                      />
                      <Button
                        data-ocid="blog.lock.confirm_button"
                        onClick={handleLockPanel}
                        disabled={isLocking || !lockPasscode.trim()}
                        className="bg-red-500 hover:bg-red-600 text-white"
                      >
                        {isLocking ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          "Lock"
                        )}
                      </Button>
                      <Button
                        data-ocid="blog.lock.cancel_button"
                        variant="outline"
                        onClick={() => {
                          setShowLockInput(false);
                          setLockPasscode("");
                          setLockError("");
                        }}
                        className="border-gray-300 text-gray-600"
                      >
                        Cancel
                      </Button>
                    </div>
                    {lockError && (
                      <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> {lockError}
                      </p>
                    )}
                  </div>
                )}

                {!sectionUnlocked ? (
                  <div className="max-w-sm">
                    <p className="text-gray-500 text-sm mb-3">
                      Enter the passcode to globally unlock the Author Panel for
                      all users.
                    </p>
                    <div className="relative mb-3">
                      <Input
                        data-ocid="blog.passcode.input"
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
                        className="bg-gray-50 border-gray-300 text-gray-900 pr-10 font-mono"
                        disabled={isVerifying}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasscode((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPasscode ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    {authorPasscodeError && (
                      <p
                        data-ocid="blog.passcode.error_state"
                        className="text-red-500 text-xs mb-3 flex items-center gap-1"
                      >
                        <AlertTriangle className="w-3 h-3" />{" "}
                        {authorPasscodeError}
                      </p>
                    )}
                    <Button
                      data-ocid="blog.unlock.button"
                      onClick={handleUnlockAuthor}
                      disabled={isVerifying || !authorPasscode.trim()}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                    >
                      {isVerifying ? (
                        <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                      ) : (
                        <Unlock className="w-4 h-4 mr-2" />
                      )}
                      {isVerifying
                        ? "Verifying..."
                        : "Unlock Author Panel Globally"}
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor="blog-title"
                          className="text-gray-600 text-sm mb-1 block"
                        >
                          Title *
                        </label>
                        <Input
                          id="blog-title"
                          data-ocid="blog.title.input"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="Post title"
                          className="bg-gray-50 border-gray-300 text-gray-900"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="blog-author"
                          className="text-gray-600 text-sm mb-1 block"
                        >
                          Author *
                        </label>
                        <Input
                          id="blog-author"
                          data-ocid="blog.author.input"
                          value={author}
                          onChange={(e) => setAuthor(e.target.value)}
                          placeholder="Your name"
                          className="bg-gray-50 border-gray-300 text-gray-900"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="blog-category"
                          className="text-gray-600 text-sm mb-1 block"
                        >
                          Category
                        </label>
                        <Input
                          id="blog-category"
                          data-ocid="blog.category.input"
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          placeholder="e.g. Technical, Update, News"
                          className="bg-gray-50 border-gray-300 text-gray-900"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="blog-tags"
                          className="text-gray-600 text-sm mb-1 block"
                        >
                          Tags (comma-separated)
                        </label>
                        <Input
                          id="blog-tags"
                          data-ocid="blog.tags.input"
                          value={tags}
                          onChange={(e) => setTags(e.target.value)}
                          placeholder="blockchain, defi, rbs"
                          className="bg-gray-50 border-gray-300 text-gray-900"
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        htmlFor="blog-content"
                        className="text-gray-600 text-sm mb-1 block"
                      >
                        Content *
                      </label>
                      <Textarea
                        id="blog-content"
                        data-ocid="blog.content.textarea"
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                        placeholder="Write your post content here..."
                        className="bg-gray-50 border-gray-300 text-gray-900 resize-none min-h-[200px]"
                        rows={8}
                      />
                    </div>
                    {formError && (
                      <p
                        data-ocid="blog.form.error_state"
                        className="text-red-500 text-sm flex items-center gap-1"
                      >
                        <AlertTriangle className="w-3 h-3" /> {formError}
                      </p>
                    )}
                    <Button
                      data-ocid="blog.publish.button"
                      onClick={handlePublish}
                      disabled={createPost.isPending}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
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
          <div
            className="h-px"
            style={{
              background:
                "linear-gradient(to right, transparent, rgba(14, 165, 233, 0.3), transparent)",
            }}
          />

          {/* Posts Grid */}
          <SmokySectionTransition>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Published Posts
            </h2>
          </SmokySectionTransition>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(["b1", "b2", "b3", "b4", "b5", "b6"] as const).map((sk) => (
                <div
                  key={sk}
                  className="h-56 bg-gray-100 rounded-xl animate-pulse"
                />
              ))}
            </div>
          ) : sortedPosts.length === 0 ? (
            <div
              data-ocid="blog.empty_state"
              className="text-center py-16 text-gray-400"
            >
              <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No posts published yet.</p>
              {isAuthenticated && (
                <p className="text-sm mt-1 text-gray-500">
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
                    authorUnlocked={sectionUnlocked}
                    isDeleting={deletePost.isPending}
                    onView={() => setSelectedPost(post)}
                    onDelete={() => handleDelete(post.id)}
                    animDelay={idx * 60}
                    index={idx + 1}
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
          <DialogContent
            data-ocid="blog.post.dialog"
            className="bg-white border-gray-200 max-w-2xl max-h-[80vh] overflow-y-auto"
          >
            {selectedPost && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-gray-900 text-xl leading-snug">
                    {selectedPost.title}
                  </DialogTitle>
                  <DialogDescription className="text-gray-500">
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
                          className="border-emerald-300 text-emerald-700 text-xs"
                        >
                          {selectedPost.category}
                        </Badge>
                      )}
                    </span>
                  </DialogDescription>
                </DialogHeader>
                <div className="mt-4 text-gray-700 leading-relaxed whitespace-pre-wrap text-sm">
                  {selectedPost.body}
                </div>
                {selectedPost.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
                    {selectedPost.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="bg-gray-100 text-gray-600 text-xs"
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
  index: number;
}

function BlogPostCard({
  post,
  authorUnlocked,
  isDeleting,
  onView,
  onDelete,
  animDelay = 0,
  index,
}: BlogPostCardProps) {
  const excerpt =
    post.body.length > 150 ? `${post.body.slice(0, 150)}…` : post.body;
  const date = new Date(Number(post.createdAt) / 1_000_000).toLocaleDateString(
    "en-US",
    { year: "numeric", month: "short", day: "numeric" },
  );

  return (
    <div
      data-ocid={`blog.item.${index}`}
      className="relative bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:border-emerald-300 hover:scale-[1.02] hover:shadow-md hover:shadow-emerald-100 transition-all duration-300 group flex flex-col"
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
          className="border-emerald-300 text-emerald-700 text-xs flex-shrink-0 bg-emerald-50"
        >
          {post.category || "General"}
        </Badge>
        {authorUnlocked && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                data-ocid={`blog.delete_button.${index}`}
                variant="ghost"
                size="icon"
                className="w-6 h-6 text-red-400/50 hover:text-red-500 hover:bg-red-50 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                disabled={isDeleting}
                onClick={(e) => e.stopPropagation()}
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent
              data-ocid="blog.delete.dialog"
              className="bg-white border-gray-200"
              onClick={(e) => e.stopPropagation()}
            >
              <AlertDialogHeader>
                <AlertDialogTitle className="text-gray-900">
                  Delete Post?
                </AlertDialogTitle>
                <AlertDialogDescription className="text-gray-500">
                  This will permanently delete "{post.title}". This action
                  cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel
                  data-ocid="blog.delete.cancel_button"
                  className="border-gray-300 text-gray-700"
                >
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  data-ocid="blog.delete.confirm_button"
                  onClick={onDelete}
                  className="bg-red-500 hover:bg-red-600 text-white"
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      <h3 className="text-gray-900 font-bold text-base leading-snug mb-2 group-hover:text-emerald-700 transition-colors">
        {post.title}
      </h3>
      <p className="text-gray-500 text-sm leading-relaxed flex-1 mb-4">
        {excerpt}
      </p>

      <div className="flex items-center justify-between text-xs text-gray-400 pt-3 border-t border-gray-100">
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
              className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
