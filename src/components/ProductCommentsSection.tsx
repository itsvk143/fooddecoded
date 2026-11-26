"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  MessageSquare,
  Send,
  User,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Edit2,
  Trash2,
  X,
  Check,
  ChevronDown,
  ShieldCheck,
  HelpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { ProductCommentRecord } from "@/types";

interface ProductCommentsSectionProps {
  productId: string;
  productName: string;
}

interface CommentItem extends ProductCommentRecord {
  isOwn?: boolean;
}

function formatRelativeTime(dateString: string | Date): string {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffSeconds < 60) return "Just now";
    const diffMinutes = Math.floor(diffSeconds / 60);
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return "Recently";
  }
}

export function ProductCommentsSection({
  productId,
  productName,
}: ProductCommentsSectionProps) {
  const { user, isAuthenticated, openLoginModal } = useAuth();

  // State
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [totalApproved, setTotalApproved] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Form State
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Inline Editing State
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [isSavingEdit, setIsSavingEdit] = useState(false);

  // Single Deletion State
  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch comments
  const fetchComments = useCallback(
    async (pageToLoad = 1, append = false) => {
      if (append) {
        setIsLoadingMore(true);
      } else {
        setIsLoading(true);
      }
      setErrorMessage(null);

      try {
        const res = await fetch(
          `/api/products/${encodeURIComponent(productId)}/comments?page=${pageToLoad}&limit=5`,
          { cache: "no-store" }
        );

        if (res.ok) {
          const data = await res.json();
          const fetchedComments: CommentItem[] = data.comments || [];
          setTotalApproved(data.totalApproved || 0);
          setTotalCount(data.totalCount || 0);
          setHasMore(data.hasMore || false);
          setPage(pageToLoad);

          if (append) {
            setComments((prev) => {
              // Deduplicate by _id
              const existingIds = new Set(prev.map((c) => c._id));
              const fresh = fetchedComments.filter((c) => !existingIds.has(c._id));
              return [...prev, ...fresh];
            });
          } else {
            setComments(fetchedComments);
          }
        }
      } catch (err: any) {
        console.warn("Failed to fetch product comments:", err);
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [productId]
  );

  useEffect(() => {
    fetchComments(1, false);
  }, [fetchComments]);

  // Handle click on comment input for unauthenticated guests
  const handleInputClick = () => {
    if (!isAuthenticated) {
      openLoginModal(
        typeof window !== "undefined" ? window.location.pathname : undefined,
        "Join FoodDecode to share your experience and help others make informed food choices."
      );
    }
  };

  // Submit new comment
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      openLoginModal(
        typeof window !== "undefined" ? window.location.pathname : undefined,
        "Join FoodDecode to share your experience and help others make informed food choices."
      );
      return;
    }

    const trimmed = commentText.trim();
    if (trimmed.length < 3) {
      setErrorMessage("Comment must be at least 3 characters long.");
      return;
    }
    if (trimmed.length > 1000) {
      setErrorMessage("Comment cannot exceed 1,000 characters.");
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessBanner(null);

    try {
      const res = await fetch(`/api/products/${encodeURIComponent(productId)}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ comment: trimmed }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit comment");
      }

      setCommentText("");
      setSuccessBanner(
        data.message ||
          "Your comment has been submitted and is awaiting community moderation."
      );

      // Prepend newly created comment immediately into author's local view
      if (data.comment) {
        setComments((prev) => [data.comment, ...prev]);
        setTotalCount((c) => c + 1);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to submit comment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Save inline edited comment
  const handleSaveEdit = async (commentId: string) => {
    const trimmed = editText.trim();
    if (trimmed.length < 3) {
      alert("Comment must be at least 3 characters long.");
      return;
    }
    if (trimmed.length > 1000) {
      alert("Comment cannot exceed 1,000 characters.");
      return;
    }

    setIsSavingEdit(true);
    try {
      const res = await fetch(
        `/api/products/${encodeURIComponent(productId)}/comments/${commentId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ comment: trimmed }),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update comment");
      }

      // Update locally
      setComments((prev) =>
        prev.map((c) =>
          c._id === commentId
            ? { ...c, comment: trimmed, status: "PENDING", updatedAt: new Date() }
            : c
        )
      );

      setEditingCommentId(null);
      setEditText("");
      setSuccessBanner("Your comment has been updated and re-submitted for moderation review.");
    } catch (err: any) {
      alert(err.message || "Failed to update comment.");
    } finally {
      setIsSavingEdit(false);
    }
  };

  // Delete comment
  const handleDeleteComment = async (commentId: string) => {
    setIsDeleting(true);
    try {
      const res = await fetch(
        `/api/products/${encodeURIComponent(productId)}/comments/${commentId}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete comment");
      }

      // Remove locally
      setComments((prev) => prev.filter((c) => c._id !== commentId));
      setTotalCount((c) => Math.max(0, c - 1));
      setDeletingCommentId(null);
      setSuccessBanner("Your comment was deleted successfully.");
    } catch (err: any) {
      alert(err.message || "Failed to delete comment.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="pt-6 border-t border-stone-100 dark:border-stone-800 space-y-6">
      {/* 1. Comment Form Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Community Comments & Reviews</span>
        </div>
        <h3 className="text-base sm:text-xl font-black text-stone-900 dark:text-stone-50 tracking-tight">
          What do you think about this product?
        </h3>
        <p className="text-xs text-stone-500 mt-0.5">
          Share your experience or report incorrect information. Commenting is optional.
        </p>
      </div>

      {/* Success Notification Banner */}
      {successBanner && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-start justify-between gap-2 shadow-2xs animate-in fade-in">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <span className="font-semibold">{successBanner}</span>
          </div>
          <button
            type="button"
            onClick={() => setSuccessBanner(null)}
            className="text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 p-0.5"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2 font-medium">
          <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* 2. Comment Input Box */}
      <form onSubmit={handleSubmitComment} className="space-y-3">
        <div className="relative">
          <textarea
            value={commentText}
            onChange={(e) => {
              setCommentText(e.target.value);
              if (errorMessage) setErrorMessage(null);
            }}
            onClick={handleInputClick}
            placeholder={
              isAuthenticated
                ? "Write your comment here... (e.g. ingredient formulation, packaging verification, taste profile)"
                : "Sign in with Google to share your experience and write a comment..."
            }
            maxLength={1000}
            rows={3}
            className="w-full p-4 rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-900/80 text-xs text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white dark:focus:bg-stone-900 transition-all resize-y min-h-[90px]"
          />
        </div>

        {/* Action Controls & Counter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3 text-[11px] text-stone-400">
            <span
              className={cn(
                "font-mono font-medium",
                commentText.length > 950 ? "text-amber-500 font-bold" : ""
              )}
            >
              {commentText.length.toLocaleString()} / 1,000 characters
            </span>
            <span>·</span>
            {isAuthenticated ? (
              <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Signed in as {user?.name?.split(" ")[0] || "User"}
              </span>
            ) : (
              <button
                type="button"
                onClick={handleInputClick}
                className="text-emerald-600 dark:text-emerald-400 hover:underline font-semibold cursor-pointer"
              >
                Registered users only
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting || (isAuthenticated && commentText.trim().length < 3)}
            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs flex items-center justify-center gap-2 shadow-xs cursor-pointer transition-all active:scale-95 disabled:opacity-40 disabled:pointer-events-none self-end sm:self-auto"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isSubmitting ? "Submitting..." : "Submit Comment"}</span>
          </button>
        </div>
      </form>

      {/* Divider */}
      <hr className="border-stone-100 dark:border-stone-800" />

      {/* 3. Recent Comments Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-xs uppercase tracking-wider text-stone-500">
            Recent Comments ({totalApproved > 0 ? totalApproved : comments.length})
          </h4>
          {totalApproved > 0 && (
            <span className="text-[11px] text-stone-400">Chronological · Newest first</span>
          )}
        </div>

        {/* Loading Skeleton */}
        {isLoading ? (
          <div className="space-y-3 py-4">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-850 animate-pulse space-y-2 border border-stone-100 dark:border-stone-800"
              >
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-stone-200 dark:bg-stone-700" />
                  <div className="h-3 w-28 bg-stone-200 dark:bg-stone-700 rounded" />
                </div>
                <div className="h-3 w-full bg-stone-200 dark:bg-stone-700 rounded" />
              </div>
            ))}
          </div>
        ) : comments.length === 0 ? (
          /* Empty State */
          <div className="py-8 px-4 rounded-2xl bg-stone-50/50 dark:bg-stone-850/40 border border-dashed border-stone-200 dark:border-stone-800 text-center space-y-1.5">
            <MessageSquare className="w-6 h-6 text-stone-300 dark:text-stone-700 mx-auto" />
            <p className="text-xs font-bold text-stone-600 dark:text-stone-400">
              No comments yet on this product.
            </p>
            <p className="text-[11px] text-stone-400 max-w-sm mx-auto">
              Be the first to share your thoughts, verify packaging claims, or report ingredient updates.
            </p>
          </div>
        ) : (
          /* Comments List */
          <div className="space-y-3">
            {comments.map((item) => {
              const isAuthor = item.isOwn || (user && user.id === item.userId);
              const isEditing = editingCommentId === item._id;

              return (
                <div
                  key={item._id}
                  className={cn(
                    "p-4 rounded-2xl border transition-all text-xs space-y-2.5",
                    item.status === "PENDING"
                      ? "bg-amber-50/30 dark:bg-amber-950/15 border-amber-200/80 dark:border-amber-900/40"
                      : "bg-stone-50/60 dark:bg-stone-850/60 border-stone-200/70 dark:border-stone-800"
                  )}
                >
                  {/* Top Bar: Author, Date & Status Badges */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      {item.userAvatar ? (
                        <img
                          src={item.userAvatar}
                          alt={item.userName}
                          className="w-7 h-7 rounded-full object-cover shrink-0 ring-1 ring-stone-200 dark:ring-stone-700"
                        />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-white font-bold text-[11px] flex items-center justify-center shrink-0">
                          {item.userName ? item.userName.charAt(0).toUpperCase() : "U"}
                        </div>
                      )}
                      <div className="min-w-0">
                        <span className="font-bold text-stone-900 dark:text-stone-100 truncate block">
                          {item.userName || "Community Member"}
                        </span>
                        <span className="text-[10px] text-stone-400 flex items-center gap-1 font-mono">
                          <Clock className="w-3 h-3" />
                          {formatRelativeTime(item.createdAt)}
                          {item.updatedAt &&
                            new Date(item.updatedAt).getTime() >
                              new Date(item.createdAt).getTime() + 60000 && (
                              <span className="text-stone-400 italic">· edited</span>
                            )}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {/* Status Badges for Author */}
                      {isAuthor && item.status === "PENDING" && (
                        <span
                          className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300/60"
                          title="Visible to you. Awaiting review by community moderation."
                        >
                          Pending Moderation
                        </span>
                      )}
                      {isAuthor && item.status === "REJECTED" && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                          Needs Revision
                        </span>
                      )}

                      {/* Author Edit/Delete Controls */}
                      {isAuthor && !isEditing && (
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingCommentId(item._id);
                              setEditText(item.comment);
                            }}
                            className="p-1 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg transition-colors cursor-pointer"
                            title="Edit your comment"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeletingCommentId(item._id)}
                            className="p-1 text-stone-400 hover:text-rose-500 rounded-lg transition-colors cursor-pointer"
                            title="Delete your comment"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Comment Body */}
                  {isEditing ? (
                    <div className="space-y-2 pt-1">
                      <textarea
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        maxLength={1000}
                        rows={3}
                        className="w-full p-3 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-xs text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-stone-400 font-mono">
                          {editText.length} / 1,000 characters
                        </span>
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingCommentId(null);
                              setEditText("");
                            }}
                            disabled={isSavingEdit}
                            className="px-3 py-1 rounded-lg text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800 font-semibold cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSaveEdit(item._id)}
                            disabled={isSavingEdit || editText.trim().length < 3}
                            className="px-3 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold cursor-pointer disabled:opacity-40"
                          >
                            {isSavingEdit ? "Saving..." : "Save Changes"}
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-stone-800 dark:text-stone-200 leading-relaxed font-normal whitespace-pre-wrap">
                      &ldquo;{item.comment}&rdquo;
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* 4. Pagination: "View More Comments" */}
        {hasMore && !isLoading && (
          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={() => fetchComments(page + 1, true)}
              disabled={isLoadingMore}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 transition-colors cursor-pointer disabled:opacity-50"
            >
              <span>{isLoadingMore ? "Loading comments..." : "View More Comments →"}</span>
            </button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal for Author */}
      {deletingCommentId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-6 max-w-sm w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 dark:bg-rose-950/70 text-rose-600 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-base text-stone-900 dark:text-stone-100">
                  Delete Comment?
                </h4>
                <p className="text-xs text-stone-500">
                  Are you sure you want to delete your comment? This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeletingCommentId(null)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl text-xs font-bold text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDeleteComment(deletingCommentId)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white transition-colors cursor-pointer"
              >
                {isDeleting ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
