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
  CheckCircle,
  ExternalLink,
  Eye,
  EyeOff,
  Globe,
  Lock,
  PenLine,
  Plus,
  RefreshCw,
  Share2,
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
import {
  BINANCE_SQUARE_HANDLE,
  getMaskedApiKey,
  sharePostToBinanceSquare,
} from "../lib/binanceSquare";

export default function DeveloperBlogPage() {
  const { identity } = useInternetIdentity();
  const isAuthenticated = !!identity;

  const { data: posts = [], isLoading } = usePublishedPosts();
  const createPost = useCreateBlogPost();
  const deletePost = useDeleteBlogPost();

  // Global section lock — synced across all users (for global banner only)
  const { isUnlocked: sectionUnlocked, setLock: setSectionLock } =
    useGlobalSectionLock("developerBlog");

  // Local author panel state — independent of global lock
  const [authorPanelOpen, setAuthorPanelOpen] = useState(false);

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

  // Post view & share state
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [lastPublishedPost, setLastPublishedPost] = useState<BlogPost | null>(
    null,
  );
  const [showShareBanner, setShowShareBanner] = useState(false);
  const [binancePostStatus, setBinancePostStatus] = useState<
    "idle" | "posting" | "success" | "manual"
  >("idle");

  const sortedPosts = [...posts].sort(
    (a, b) => Number(b.createdAt) - Number(a.createdAt),
  );

  const BLOG_PASSCODE = "BP2420075112009BP";

  const handleUnlockAuthor = async () => {
    if (!authorPasscode.trim()) {
      setAuthorPasscodeError(
        "Enter the developer passcode to access author panel",
      );
      return;
    }
    setAuthorPasscodeError("");
    setIsVerifying(true);
    // Local check — blogs are always visible, only author panel requires passcode
    await new Promise((r) => setTimeout(r, 400));
    if (authorPasscode.trim() === BLOG_PASSCODE) {
      setVerifiedPasscode(authorPasscode.trim());
      setAuthorPanelOpen(true);
      setAuthorPasscode("");
      toast.success("Author panel unlocked");
      // Also update global lock so other users see the banner
      try {
        await setSectionLock(authorPasscode.trim(), true);
      } catch {
        /* ignore */
      }
    } else {
      setAuthorPasscodeError("Invalid passcode");
    }
    setIsVerifying(false);
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
      setAuthorPanelOpen(false);
      setLockPasscode("");
      setShowLockInput(false);
      toast.success("Author panel locked");
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
      toast.success("Post published! Visible to all users globally.");
      const publishedPost = { ...post, createdAt: BigInt(Date.now()) };
      setLastPublishedPost(publishedPost);
      setShowShareBanner(true);
      setBinancePostStatus("manual");

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

  const handleDelete = async (id: bigint, passcode: string) => {
    try {
      await deletePost.mutateAsync({ id, authorCode: passcode });
      toast.success("Post deleted");
      if (selectedPost?.id === id) setSelectedPost(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Delete failed";
      toast.error(msg);
    }
  };

  const handleShareToBinanceSquare = (post: BlogPost) => {
    sharePostToBinanceSquare(post.title, post.body, post.author);
    toast.success(
      `Opening Binance Square composer for ${BINANCE_SQUARE_HANDLE}`,
    );
  };

  return (
    <>
      <PageHead
        title="Developer Blog | RBS"
        description="Insights, updates, and technical articles from the RBS team"
      />
      <div className="min-h-screen bg-white text-gray-900">
        {/* Global unlock banner — shown prominently at top of page */}
        {sectionUnlocked && (
          <div
            className="w-full px-3 sm:px-4 py-3 flex items-center justify-center gap-2 text-sm font-medium"
            style={{
              background:
                "linear-gradient(90deg, rgba(16, 185, 129, 0.08) 0%, rgba(6, 182, 212, 0.1) 50%, rgba(16, 185, 129, 0.08) 100%)",
              borderBottom: "1px solid rgba(16, 185, 129, 0.25)",
            }}
          >
            <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span className="text-emerald-700 text-center">
              Developer Blog is globally unlocked — all users can publish posts
            </span>
            <Badge className="bg-emerald-100 text-emerald-700 border-emerald-300 text-xs hidden sm:inline-flex">
              <Globe className="w-3 h-3 mr-1" />
              Live for Everyone
            </Badge>
          </div>
        )}

        {/* Hero */}
        <SmokySectionTransition>
          <div
            className="relative py-10 sm:py-14 md:py-16 px-3 sm:px-4 text-center border-b"
            style={{
              background:
                "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #f8faff 100%)",
              borderColor: "rgba(14, 165, 233, 0.15)",
            }}
          >
            <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
              <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-600" />
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-gray-900">
                Developer Blog
              </h1>
            </div>
            <p className="text-gray-500 text-sm sm:text-base max-w-xl mx-auto px-2">
              Technical insights, platform updates, and ecosystem news from the
              RBS development team
            </p>
            {sectionUnlocked && (
              <div className="inline-flex items-center gap-2 mt-3 sm:mt-4 px-3 py-1.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                <Globe className="w-3.5 h-3.5" />
                Globally Accessible — All users can publish
              </div>
            )}

            {/* Binance Square integration badge */}
            <div className="flex items-center justify-center gap-2 mt-3">
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
                style={{
                  background: "rgba(240, 185, 11, 0.08)",
                  border: "1px solid rgba(240, 185, 11, 0.25)",
                  color: "#92680a",
                }}
              >
                <span className="font-bold text-yellow-600">◈</span>
                Binance Square Integration Active
                <span className="font-mono text-yellow-700/70">
                  {getMaskedApiKey()}
                </span>
              </div>
            </div>
          </div>
        </SmokySectionTransition>

        <div className="max-w-6xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-8 sm:py-10 space-y-8 sm:space-y-10">
          {/* Share to Binance Square Banner (after publish) */}
          {showShareBanner && lastPublishedPost && (
            <SmokySectionTransition>
              <div
                className="rounded-xl sm:rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between"
                style={{
                  background:
                    binancePostStatus === "success"
                      ? "linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(16, 185, 129, 0.03) 100%)"
                      : "linear-gradient(135deg, rgba(240, 185, 11, 0.07) 0%, rgba(240, 185, 11, 0.03) 100%)",
                  border:
                    binancePostStatus === "success"
                      ? "1px solid rgba(16, 185, 129, 0.3)"
                      : "1px solid rgba(240, 185, 11, 0.3)",
                }}
              >
                <div className="flex items-start gap-3">
                  <CheckCircle
                    className={`w-5 h-5 flex-shrink-0 mt-0.5 ${binancePostStatus === "success" ? "text-emerald-600" : "text-green-600"}`}
                  />
                  <div>
                    <p className="text-gray-900 font-semibold text-sm sm:text-base">
                      {binancePostStatus === "success"
                        ? "Auto-posted to Binance Square!"
                        : binancePostStatus === "posting"
                          ? "Publishing to Binance Square..."
                          : "Post published successfully!"}
                    </p>
                    <p className="text-gray-500 text-xs sm:text-sm mt-0.5">
                      {binancePostStatus === "success" ? (
                        <span className="text-emerald-700 font-medium">
                          ✓ Published to {BINANCE_SQUARE_HANDLE} automatically
                        </span>
                      ) : binancePostStatus === "manual" ? (
                        <>
                          Auto-post blocked by browser CORS — share manually to{" "}
                          <span className="text-yellow-700 font-medium">
                            {BINANCE_SQUARE_HANDLE}
                          </span>
                        </>
                      ) : (
                        /* Author panel — local unlock, blogs always visible */
                        <>
                          Attempting to post to{" "}
                          <span className="text-yellow-700 font-medium">
                            {BINANCE_SQUARE_HANDLE}
                          </span>
                          ...
                        </>
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  {binancePostStatus !== "success" && (
                    <Button
                      data-ocid="blog.share_binance.button"
                      onClick={() =>
                        handleShareToBinanceSquare(lastPublishedPost)
                      }
                      className="flex-1 sm:flex-none text-xs sm:text-sm font-bold"
                      style={{
                        background:
                          "linear-gradient(135deg, #F0B90B 0%, #e8a800 100%)",
                        color: "#1a0a00",
                      }}
                    >
                      <Share2 className="w-3.5 h-3.5 mr-1.5" />
                      Share Manually
                      <ExternalLink className="w-3 h-3 ml-1.5" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setShowShareBanner(false);
                      setBinancePostStatus("idle");
                    }}
                    className="text-gray-400 hover:text-gray-600 flex-shrink-0"
                  >
                    ✕
                  </Button>
                </div>
              </div>
            </SmokySectionTransition>
          )}

          {/* Author Panel Toggle */}
          {isAuthenticated && (
            <SmokySectionTransition>
              <div
                className="rounded-xl sm:rounded-2xl p-4 sm:p-6"
                style={{
                  background: "rgba(255, 255, 255, 0.9)",
                  border: "1px solid rgba(14, 165, 233, 0.2)",
                  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
                }}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                  <h2 className="text-gray-900 font-bold text-base sm:text-lg flex items-center gap-2">
                    <PenLine className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" />{" "}
                    Author Panel
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
                    className="mb-4 p-3 sm:p-4 rounded-xl"
                    style={{
                      background: "rgba(255, 241, 242, 0.8)",
                      border: "1px solid rgba(239, 68, 68, 0.2)",
                    }}
                  >
                    <p className="text-gray-600 text-xs sm:text-sm mb-3">
                      Enter passcode to globally lock the Developer Blog for all
                      users.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-2">
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
                        className="bg-white border-gray-300 text-gray-900 font-mono flex-1 w-full sm:w-auto"
                        disabled={isLocking}
                      />
                      <div className="flex gap-2">
                        <Button
                          data-ocid="blog.lock.confirm_button"
                          onClick={handleLockPanel}
                          disabled={isLocking || !lockPasscode.trim()}
                          className="bg-red-500 hover:bg-red-600 text-white flex-1 sm:flex-none"
                        >
                          {isLocking ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            /* Author panel — local unlock, blogs always visible */
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
                          className="border-gray-300 text-gray-600 flex-1 sm:flex-none"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                    {lockError && (
                      <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> {lockError}
                      </p>
                    )}
                  </div>
                )}

                {!authorPanelOpen ? (
                  <div className="max-w-sm">
                    <p className="text-gray-500 text-xs sm:text-sm mb-3">
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
                        className="bg-gray-50 border-gray-300 text-gray-900 pr-10 font-mono w-full"
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
                          /* Author panel — local unlock, blogs always visible */
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
                      className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold w-full sm:w-auto"
                    >
                      {isVerifying ? (
                        <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                      ) : (
                        /* Author panel — local unlock, blogs always visible */
                        <Unlock className="w-4 h-4 mr-2" />
                      )}
                      {isVerifying
                        ? "Verifying..."
                        : "Unlock Author Panel Globally"}
                    </Button>

                    {/* Binance Square integration indicator */}
                    <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2">
                      <div
                        className="flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full"
                        style={{
                          background: "rgba(240, 185, 11, 0.08)",
                          border: "1px solid rgba(240, 185, 11, 0.2)",
                          color: "#92680a",
                        }}
                      >
                        <span className="text-yellow-600 font-bold">◈</span>
                        Binance Square Integration Active
                        <span className="font-mono text-yellow-700/60">
                          {getMaskedApiKey()}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Author panel — local unlock, blogs always visible */
                  <div className="space-y-4">
                    {/* Binance Square integration note when unlocked */}
                    <div
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs"
                      style={{
                        background: "rgba(240, 185, 11, 0.06)",
                        border: "1px solid rgba(240, 185, 11, 0.2)",
                      }}
                    >
                      <span className="text-yellow-600 font-bold">◈</span>
                      <span className="text-yellow-800">
                        After publishing, you can share directly to Binance
                        Square ({BINANCE_SQUARE_HANDLE})
                      </span>
                      <span className="text-yellow-700/50 font-mono ml-auto hidden sm:block">
                        {getMaskedApiKey()}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
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
                          className="bg-gray-50 border-gray-300 text-gray-900 w-full"
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
                          className="bg-gray-50 border-gray-300 text-gray-900 w-full"
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
                          className="bg-gray-50 border-gray-300 text-gray-900 w-full"
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
                          className="bg-gray-50 border-gray-300 text-gray-900 w-full"
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
                        className="bg-gray-50 border-gray-300 text-gray-900 resize-none min-h-[160px] sm:min-h-[200px] w-full"
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
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Button
                        data-ocid="blog.publish.button"
                        onClick={handlePublish}
                        disabled={createPost.isPending}
                        className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex-1 sm:flex-none"
                      >
                        {createPost.isPending ? (
                          <span className="flex items-center gap-2">
                            <RefreshCw className="w-4 h-4 animate-spin" />{" "}
                            Publishing...
                          </span>
                        ) : (
                          /* Author panel — local unlock, blogs always visible */
                          <span className="flex items-center gap-2">
                            <Plus className="w-4 h-4" /> Publish Post
                          </span>
                        )}
                      </Button>
                    </div>
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

          {/* Posts Grid — visible to ALL users (no auth required) */}
          <SmokySectionTransition>
            <div className="flex items-center justify-between gap-2 mb-4 sm:mb-6 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                Published Posts
              </h2>
              <div className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                <Globe className="w-3 h-3" />
                Visible to all users
              </div>
            </div>
          </SmokySectionTransition>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {(["b1", "b2", "b3", "b4", "b5", "b6"] as const).map((sk) => (
                <div
                  key={sk}
                  className="h-48 sm:h-56 bg-gray-100 rounded-xl animate-pulse"
                />
              ))}
            </div>
          ) : sortedPosts.length === 0 ? (
            <div
              data-ocid="blog.empty_state"
              className="text-center py-12 sm:py-16 text-gray-400"
            >
              <BookOpen className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 opacity-30" />
              <p className="text-sm sm:text-base">No posts published yet.</p>
              {isAuthenticated && (
                <p className="text-xs sm:text-sm mt-1 text-gray-500">
                  Use the Author Panel above to publish the first post.
                </p>
              )}
              {!isAuthenticated && (
                <p className="text-xs sm:text-sm mt-1 text-gray-500">
                  Posts will appear here once published by authorized authors.
                </p>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {sortedPosts.map((post, idx) => (
                <SmokySectionTransition key={post.id.toString()}>
                  <BlogPostCard
                    post={post}
                    isAuthenticated={isAuthenticated}
                    isDeleting={deletePost.isPending}
                    onView={() => setSelectedPost(post)}
                    onDelete={(passcode: string) =>
                      handleDelete(post.id, passcode)
                    }
                    onShare={() => handleShareToBinanceSquare(post)}
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
            className="bg-white border-gray-200 w-[calc(100vw-2rem)] sm:max-w-2xl max-h-[85vh] sm:max-h-[80vh] overflow-y-auto mx-auto"
          >
            {selectedPost && (
              <>
                <DialogHeader>
                  <DialogTitle className="text-gray-900 text-lg sm:text-xl leading-snug pr-4">
                    {selectedPost.title}
                  </DialogTitle>
                  <DialogDescription className="text-gray-500">
                    <span className="flex items-center gap-2 sm:gap-3 flex-wrap mt-1">
                      <span className="flex items-center gap-1 text-xs sm:text-sm">
                        <User className="w-3 h-3" /> {selectedPost.author}
                      </span>
                      <span className="flex items-center gap-1 text-xs sm:text-sm">
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
                {/* Share to Binance Square in dialog footer */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <Button
                    data-ocid="blog.post.share_binance.button"
                    size="sm"
                    onClick={() => handleShareToBinanceSquare(selectedPost)}
                    className="w-full sm:w-auto text-xs font-semibold"
                    style={{
                      background:
                        "linear-gradient(135deg, #F0B90B 0%, #e8a800 100%)",
                      color: "#1a0a00",
                    }}
                  >
                    <Share2 className="w-3.5 h-3.5 mr-1.5" />
                    Share to Binance Square
                    <ExternalLink className="w-3 h-3 ml-1" />
                  </Button>
                  <p className="text-gray-400 text-xs mt-1.5">
                    Opens Binance Square composer for {BINANCE_SQUARE_HANDLE}
                  </p>
                </div>
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
  isAuthenticated: boolean;
  isDeleting: boolean;
  onView: () => void;
  onDelete: (passcode: string) => void;
  onShare: () => void;
  animDelay?: number;
  index: number;
}

function BlogPostCard({
  post,
  isAuthenticated,
  isDeleting,
  onView,
  onDelete,
  onShare,
  animDelay = 0,
  index,
}: BlogPostCardProps) {
  const excerpt =
    post.body.length > 150 ? `${post.body.slice(0, 150)}…` : post.body;
  const date = new Date(Number(post.createdAt) / 1_000_000).toLocaleDateString(
    "en-US",
    { year: "numeric", month: "short", day: "numeric" },
  );
  const [deletePasscode, setDeletePasscode] = useState("");
  const [showDeletePasscode, setShowDeletePasscode] = useState(false);
  const [deletePasscodeError, setDeletePasscodeError] = useState("");
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isSubmittingDelete, setIsSubmittingDelete] = useState(false);

  const handleDeleteConfirm = async () => {
    if (!deletePasscode.trim()) {
      setDeletePasscodeError("Passcode is required to delete a post");
      return;
    }
    setIsSubmittingDelete(true);
    setDeletePasscodeError("");
    try {
      await onDelete(deletePasscode.trim());
      setDeletePasscode("");
      setIsDeleteOpen(false);
    } catch {
      setDeletePasscodeError("Wrong passcode or delete failed. Try again.");
    } finally {
      setIsSubmittingDelete(false);
    }
  };

  return (
    <div
      data-ocid={`blog.item.${index}`}
      className="relative bg-white border border-gray-200 rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-sm hover:border-emerald-300 hover:scale-[1.02] hover:shadow-md hover:shadow-emerald-100 transition-all duration-300 group flex flex-col"
      style={{ animationDelay: `${animDelay}ms` }}
    >
      <button
        type="button"
        className="absolute inset-0 w-full h-full rounded-xl sm:rounded-2xl cursor-pointer opacity-0"
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
        {isAuthenticated && (
          <AlertDialog
            open={isDeleteOpen}
            onOpenChange={(open) => {
              setIsDeleteOpen(open);
              if (!open) {
                setDeletePasscode("");
                setDeletePasscodeError("");
                setShowDeletePasscode(false);
              }
            }}
          >
            <AlertDialogTrigger asChild>
              <Button
                data-ocid={`blog.delete_button.${index}`}
                variant="ghost"
                size="icon"
                className="w-6 h-6 text-red-400/50 hover:text-red-500 hover:bg-red-50 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                disabled={isDeleting || isSubmittingDelete}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsDeleteOpen(true);
                }}
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent
              data-ocid="blog.delete.dialog"
              className="bg-white border-gray-200 w-[calc(100vw-2rem)] sm:max-w-md mx-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <AlertDialogHeader>
                <AlertDialogTitle className="text-gray-900">
                  Delete Post?
                </AlertDialogTitle>
                <AlertDialogDescription className="text-gray-500">
                  This will permanently delete "{post.title}". Enter the admin
                  passcode to confirm deletion.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="px-0 py-2">
                <label
                  htmlFor={`delete-blog-passcode-${index}`}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Admin Passcode
                </label>
                <div className="relative">
                  <Input
                    id={`delete-blog-passcode-${index}`}
                    data-ocid={`blog.delete.passcode.input.${index}`}
                    type={showDeletePasscode ? "text" : "password"}
                    value={deletePasscode}
                    onChange={(e) => {
                      setDeletePasscode(e.target.value);
                      setDeletePasscodeError("");
                    }}
                    onKeyDown={(e) =>
                      e.key === "Enter" && handleDeleteConfirm()
                    }
                    placeholder="Enter admin passcode"
                    className="bg-gray-50 border-gray-300 text-gray-900 font-mono pr-10 w-full"
                    disabled={isSubmittingDelete}
                  />
                  <button
                    type="button"
                    onClick={() => setShowDeletePasscode((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showDeletePasscode ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      /* Author panel — local unlock, blogs always visible */
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {deletePasscodeError && (
                  <p
                    data-ocid={`blog.delete.error_state.${index}`}
                    className="text-red-500 text-xs mt-1.5 flex items-center gap-1"
                  >
                    <AlertTriangle className="w-3 h-3" /> {deletePasscodeError}
                  </p>
                )}
              </div>
              <AlertDialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
                <AlertDialogCancel
                  data-ocid="blog.delete.cancel_button"
                  className="border-gray-300 text-gray-700 w-full sm:w-auto"
                >
                  Cancel
                </AlertDialogCancel>
                <Button
                  data-ocid="blog.delete.confirm_button"
                  onClick={handleDeleteConfirm}
                  disabled={isSubmittingDelete || !deletePasscode.trim()}
                  className="bg-red-500 hover:bg-red-600 text-white w-full sm:w-auto"
                >
                  {isSubmittingDelete ? (
                    <span className="flex items-center gap-2">
                      <RefreshCw className="w-3 h-3 animate-spin" /> Deleting...
                    </span>
                  ) : (
                    /* Author panel — local unlock, blogs always visible */
                    "Delete Post"
                  )}
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      <h3 className="text-gray-900 font-bold text-sm sm:text-base leading-snug mb-2 group-hover:text-emerald-700 transition-colors">
        {post.title}
      </h3>
      <p className="text-gray-500 text-xs sm:text-sm leading-relaxed flex-1 mb-4">
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

      {/* Share button in card footer */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onShare();
        }}
        className="mt-3 flex items-center gap-1.5 text-xs text-yellow-700/70 hover:text-yellow-800 transition-colors opacity-0 group-hover:opacity-100"
        aria-label="Share to Binance Square"
      >
        <span className="font-bold">◈</span>
        Share to Binance Square
      </button>
    </div>
  );
}
