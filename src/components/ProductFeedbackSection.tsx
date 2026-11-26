"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  ThumbsUp,
  ThumbsDown,
  Users,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  ShieldCheck,
  RotateCcw,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { FeedbackVote, ProductReviewStatus } from "@/types";

interface ProductFeedbackSectionProps {
  productId: string;
  productName: string;
}

interface FeedbackState {
  thumbsUp: number;
  thumbsDown: number;
  totalVotes: number;
  communityApproval: number;
  notEnoughFeedback: boolean;
  userVote: FeedbackVote | null;
  reviewStatus: ProductReviewStatus;
}

export function ProductFeedbackSection({
  productId,
  productName,
}: ProductFeedbackSectionProps) {
  const { user, isAuthenticated, openLoginModal } = useAuth();

  const [state, setState] = useState<FeedbackState>({
    thumbsUp: 0,
    thumbsDown: 0,
    totalVotes: 0,
    communityApproval: 0,
    notEnoughFeedback: true,
    userVote: null,
    reviewStatus: "NOT_REVIEWED",
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fetch initial feedback counts and user's vote
  const fetchFeedback = useCallback(async () => {
    try {
      const res = await fetch(`/api/products/${encodeURIComponent(productId)}/feedback`, {
        cache: "no-store",
      });
      if (res.ok) {
        const data = await res.json();
        setState({
          thumbsUp: data.thumbsUp || 0,
          thumbsDown: data.thumbsDown || 0,
          totalVotes: data.totalVotes || 0,
          communityApproval: data.communityApproval || 0,
          notEnoughFeedback: data.notEnoughFeedback ?? data.totalVotes < 5,
          userVote: data.userVote || null,
          reviewStatus: data.reviewStatus || "NOT_REVIEWED",
        });
      }
    } catch {
      // Non-fatal fallback
    } finally {
      setIsLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchFeedback();
  }, [fetchFeedback]);

  // Handle vote click (Thumbs Up / Down)
  const handleVote = async (newVote: FeedbackVote) => {
    // 1. Guest protection: trigger Google authentication if not logged in
    if (!isAuthenticated) {
      if (typeof window !== "undefined") {
        openLoginModal(window.location.pathname);
      } else {
        openLoginModal();
      }
      return;
    }

    // If user already clicked the same vote, do nothing
    if (state.userVote === newVote || isSubmitting) {
      return;
    }

    setErrorMessage(null);

    // 2. Snapshot previous state for rollback
    const previousState = { ...state };

    // 3. Optimistic UI update (0ms perceived latency)
    let newThumbsUp = state.thumbsUp;
    let newThumbsDown = state.thumbsDown;

    if (state.userVote === null) {
      // Brand new vote
      if (newVote === "UP") newThumbsUp += 1;
      if (newVote === "DOWN") newThumbsDown += 1;
    } else if (state.userVote === "UP" && newVote === "DOWN") {
      // Vote switched from UP to DOWN
      newThumbsUp = Math.max(0, newThumbsUp - 1);
      newThumbsDown += 1;
    } else if (state.userVote === "DOWN" && newVote === "UP") {
      // Vote switched from DOWN to UP
      newThumbsDown = Math.max(0, newThumbsDown - 1);
      newThumbsUp += 1;
    }

    const newTotal = newThumbsUp + newThumbsDown;
    const newApproval = newTotal > 0 ? Math.round((newThumbsUp / newTotal) * 1000) / 10 : 0;

    setState((prev) => ({
      ...prev,
      thumbsUp: newThumbsUp,
      thumbsDown: newThumbsDown,
      totalVotes: newTotal,
      communityApproval: newApproval,
      notEnoughFeedback: newTotal < 5,
      userVote: newVote,
    }));

    // 4. Background submission
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/products/${encodeURIComponent(productId)}/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vote: newVote }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to record vote");
      }

      const freshData = await res.json();
      setState((prev) => ({
        ...prev,
        thumbsUp: freshData.thumbsUp,
        thumbsDown: freshData.thumbsDown,
        totalVotes: freshData.totalVotes,
        communityApproval: freshData.communityApproval,
        notEnoughFeedback: freshData.notEnoughFeedback,
        userVote: freshData.userVote,
      }));
    } catch (err) {
      // Rollback to previous state on server error
      setState(previousState);
      setErrorMessage((err as Error).message || "Voting failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      aria-labelledby="community-feedback-title"
      className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs space-y-6 transition-all"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100 dark:border-stone-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
            <Users className="w-3.5 h-3.5" />
            <span>Community Verification</span>
          </div>
          <h2
            id="community-feedback-title"
            className="text-lg sm:text-2xl font-black text-stone-900 dark:text-stone-50 tracking-tight"
          >
            Was this product information correct?
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Help FoodDecode verify ingredient accuracy, nutritional labels, and processing transparency.
          </p>
        </div>

        {/* Administrative Review Status Badge (if set) */}
        {state.reviewStatus !== "NOT_REVIEWED" && (
          <div className="self-start sm:self-auto shrink-0">
            {state.reviewStatus === "VERIFIED" && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300/80 dark:border-emerald-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Factual Label Verified
              </span>
            )}
            {state.reviewStatus === "UNDER_REVIEW" && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300/80 dark:border-amber-800">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Label Under Review
              </span>
            )}
            {state.reviewStatus === "CORRECTION_REQUIRED" && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border border-rose-300/80 dark:border-rose-800">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600" /> Correction Required
              </span>
            )}
            {state.reviewStatus === "CORRECTED" && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-teal-50 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border border-teal-300/80 dark:border-teal-800">
                <ShieldCheck className="w-3.5 h-3.5 text-teal-600" /> Correction Applied
              </span>
            )}
          </div>
        )}
      </div>

      {errorMessage && (
        <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300">
          {errorMessage}
        </div>
      )}

      {/* Voting Controls & Statistics */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        {/* Buttons */}
        <div className="flex items-center gap-3">
          {/* Thumbs Up Button */}
          <button
            type="button"
            onClick={() => handleVote("UP")}
            disabled={isSubmitting}
            className={cn(
              "group flex items-center gap-2.5 px-5 py-3 rounded-2xl text-sm font-bold border transition-all cursor-pointer shadow-2xs active:scale-95 focus:outline-none focus:ring-2 focus:ring-emerald-500",
              state.userVote === "UP"
                ? "bg-emerald-500 text-stone-950 border-emerald-500 shadow-sm ring-2 ring-emerald-500/30"
                : "bg-white dark:bg-stone-850 border-stone-200 dark:border-stone-750 text-stone-700 dark:text-stone-200 hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20"
            )}
            aria-pressed={state.userVote === "UP"}
            title="Vote: Information appears correct"
          >
            <ThumbsUp
              className={cn(
                "w-4 h-4 transition-transform group-hover:scale-110",
                state.userVote === "UP" ? "fill-stone-950" : "text-emerald-600 dark:text-emerald-400"
              )}
            />
            <span>Thumbs Up</span>
            <span
              className={cn(
                "px-2 py-0.5 rounded-full text-xs font-black",
                state.userVote === "UP"
                  ? "bg-stone-950 text-white"
                  : "bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200"
              )}
            >
              {state.thumbsUp}
            </span>
          </button>

          {/* Thumbs Down Button */}
          <button
            type="button"
            onClick={() => handleVote("DOWN")}
            disabled={isSubmitting}
            className={cn(
              "group flex items-center gap-2.5 px-5 py-3 rounded-2xl text-sm font-bold border transition-all cursor-pointer shadow-2xs active:scale-95 focus:outline-none focus:ring-2 focus:ring-rose-500",
              state.userVote === "DOWN"
                ? "bg-rose-500 text-white border-rose-500 shadow-sm ring-2 ring-rose-500/30"
                : "bg-white dark:bg-stone-850 border-stone-200 dark:border-stone-750 text-stone-700 dark:text-stone-200 hover:border-rose-500 hover:bg-rose-50/50 dark:hover:bg-rose-950/20"
            )}
            aria-pressed={state.userVote === "DOWN"}
            title="Vote: Information appears incorrect or requires correction"
          >
            <ThumbsDown
              className={cn(
                "w-4 h-4 transition-transform group-hover:scale-110",
                state.userVote === "DOWN" ? "fill-white" : "text-rose-600 dark:text-rose-400"
              )}
            />
            <span>Thumbs Down</span>
            <span
              className={cn(
                "px-2 py-0.5 rounded-full text-xs font-black",
                state.userVote === "DOWN"
                  ? "bg-stone-950 text-white"
                  : "bg-stone-100 dark:bg-stone-800 text-stone-800 dark:text-stone-200"
              )}
            >
              {state.thumbsDown}
            </span>
          </button>
        </div>

        {/* Community Approval & Total Counts */}
        <div className="flex flex-col sm:items-end">
          {state.notEnoughFeedback ? (
            <div className="text-right">
              <span className="text-xs font-bold text-stone-400 dark:text-stone-500 block">
                Not enough feedback yet
              </span>
              <span className="text-[11px] text-stone-500">
                {state.totalVotes} {state.totalVotes === 1 ? "user" : "users"} participated (5 needed for approval score)
              </span>
            </div>
          ) : (
            <div className="text-left sm:text-right">
              <div className="flex items-center sm:justify-end gap-1.5">
                <span className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400">
                  {state.communityApproval}%
                </span>
                <span className="text-sm font-bold text-stone-800 dark:text-stone-200">
                  Community Approval
                </span>
              </div>
              <span className="text-xs text-stone-500 block mt-0.5">
                {state.totalVotes.toLocaleString()} registered {state.totalVotes === 1 ? "user" : "users"} participated.
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Guest Callout Note */}
      {!isAuthenticated && (
        <div className="pt-2 text-xs text-stone-400 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
          <span>
            Clicking Thumbs Up or Down will prompt you to connect securely via Google.
          </span>
        </div>
      )}
    </section>
  );
}
