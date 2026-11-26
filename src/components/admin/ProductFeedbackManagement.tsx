"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  ThumbsUp,
  ThumbsDown,
  Users,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  RotateCcw,
  RefreshCw,
  Search,
  Filter,
  ShieldCheck,
  ShieldAlert,
  ArrowUpDown,
  ExternalLink,
  MessageSquare,
  AlertCircle,
  HelpCircle,
  Clock,
  ListFilter,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ProductReviewStatus, FeedbackVote } from "@/types";

interface ProductFeedbackManagementProps {
  adminKey: string;
  onNotify?: (msg: string) => void;
}

interface FeedbackStats {
  totalSubmissions: number;
  totalThumbsUp: number;
  totalThumbsDown: number;
  totalProductsReceivingFeedback: number;
  averageCommunityApproval: number;
  flaggedForReviewCount: number;
}

interface ProductSummaryItem {
  productId: string;
  productName: string;
  brand: string;
  thumbsUp: number;
  thumbsDown: number;
  totalVotes: number;
  communityApproval: number;
  negativePercentage: number;
  reviewStatus: ProductReviewStatus;
  isFlaggedForReview: boolean;
  lastFeedbackAt?: string;
}

interface IndividualFeedbackItem {
  _id: string;
  productId: string;
  userId: string;
  userName: string;
  userEmail: string;
  vote: FeedbackVote;
  createdAt: string;
  updatedAt?: string;
}

export function ProductFeedbackManagement({
  adminKey,
  onNotify,
}: ProductFeedbackManagementProps) {
  // Navigation sub-tab
  const [subTab, setSubTab] = useState<"products" | "records">("products");

  // Stats state
  const [stats, setStats] = useState<FeedbackStats>({
    totalSubmissions: 0,
    totalThumbsUp: 0,
    totalThumbsDown: 0,
    totalProductsReceivingFeedback: 0,
    averageCommunityApproval: 0,
    flaggedForReviewCount: 0,
  });

  // Data states
  const [productSummaries, setProductSummaries] = useState<ProductSummaryItem[]>([]);
  const [individualRecords, setIndividualRecords] = useState<IndividualFeedbackItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filters & Pagination for Product Summaries
  const [productSearch, setProductSearch] = useState("");
  const [productSortBy, setProductSortBy] = useState<
    "recent" | "approval-asc" | "negative-desc" | "total-desc"
  >("recent");
  const [filterFlaggedOnly, setFilterFlaggedOnly] = useState(false);

  // Filters & Pagination for Individual Records
  const [recordSearch, setRecordSearch] = useState("");
  const [recordVoteFilter, setRecordVoteFilter] = useState<string>("");
  const [recordPage, setRecordPage] = useState(1);
  const [recordTotalPages, setRecordTotalPages] = useState(1);
  const [recordTotalCount, setRecordTotalCount] = useState(0);

  // Bulk Selection
  const [selectedRecordIds, setSelectedRecordIds] = useState<string[]>([]);

  // Action Modals & Dialogs
  const [activeDeleteId, setActiveDeleteId] = useState<string | null>(null);
  const [activeClearProductId, setActiveClearProductId] = useState<string | null>(null);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);
  const [actionReason, setActionReason] = useState("");
  const [actionProcessing, setActionProcessing] = useState(false);

  const getHeaders = useCallback(() => {
    return {
      "Content-Type": "application/json",
      "x-admin-key": adminKey,
    };
  }, [adminKey]);

  // Load stats
  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/feedback/stats", {
        headers: getHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        setStats({
          totalSubmissions: data.totalSubmissions || 0,
          totalThumbsUp: data.totalThumbsUp || 0,
          totalThumbsDown: data.totalThumbsDown || 0,
          totalProductsReceivingFeedback: data.totalProductsReceivingFeedback || 0,
          averageCommunityApproval: data.averageCommunityApproval || 0,
          flaggedForReviewCount: data.flaggedForReviewCount || 0,
        });
      }
    } catch (e: any) {
      console.warn("Error fetching feedback stats:", e);
    }
  }, [getHeaders]);

  // Load product summaries & individual records
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.set("sortBy", productSortBy);
      if (recordSearch) params.set("search", recordSearch);
      if (recordVoteFilter) params.set("vote", recordVoteFilter);
      params.set("page", String(recordPage));
      params.set("limit", "25");

      const res = await fetch(`/api/admin/feedback?${params.toString()}`, {
        headers: getHeaders(),
      });

      if (res.ok) {
        const data = await res.json();
        setProductSummaries(data.productSummaries || []);
        setIndividualRecords(data.individualRecords || []);
        if (data.pagination) {
          setRecordTotalPages(data.pagination.totalPages || 1);
          setRecordTotalCount(data.pagination.totalCount || 0);
        }
      } else {
        const err = await res.json();
        setError(err.error || "Failed to fetch feedback data");
      }
    } catch (e: any) {
      setError(e.message || "Network error loading feedback data");
    } finally {
      setIsLoading(false);
    }
  }, [getHeaders, productSortBy, recordSearch, recordVoteFilter, recordPage]);

  useEffect(() => {
    fetchStats();
    fetchData();
  }, [fetchStats, fetchData]);

  // Switch individual vote (UP <-> DOWN)
  const handleSwitchVote = async (record: IndividualFeedbackItem) => {
    const newVote: FeedbackVote = record.vote === "UP" ? "DOWN" : "UP";
    setActionProcessing(true);
    try {
      const res = await fetch(`/api/admin/feedback/${record._id}`, {
        method: "PATCH",
        headers: getHeaders(),
        body: JSON.stringify({
          vote: newVote,
          reason: `Admin manual switch from ${record.vote} to ${newVote}`,
        }),
      });

      if (res.ok) {
        onNotify?.(`Vote switched to ${newVote} for user ${record.userName || record.userEmail}`);
        await Promise.all([fetchStats(), fetchData()]);
      } else {
        const err = await res.json();
        alert(err.error || "Failed to switch vote");
      }
    } catch (e: any) {
      alert(e.message || "Error switching vote");
    } finally {
      setActionProcessing(false);
    }
  };

  // Delete single vote
  const handleDeleteVote = async (id: string) => {
    setActionProcessing(true);
    try {
      const res = await fetch(`/api/admin/feedback/${id}`, {
        method: "DELETE",
        headers: getHeaders(),
        body: JSON.stringify({
          reason: actionReason || "Administrative single feedback deletion",
        }),
      });

      if (res.ok) {
        onNotify?.("Feedback record deleted permanently and logged to audit trail.");
        setActiveDeleteId(null);
        setActionReason("");
        setSelectedRecordIds((prev) => prev.filter((item) => item !== id));
        await Promise.all([fetchStats(), fetchData()]);
      } else {
        const err = await res.json();
        alert(err.error || "Failed to delete feedback");
      }
    } catch (e: any) {
      alert(e.message || "Error deleting feedback");
    } finally {
      setActionProcessing(false);
    }
  };

  // Bulk delete votes
  const handleBulkDelete = async () => {
    if (selectedRecordIds.length === 0) return;
    setActionProcessing(true);
    try {
      const res = await fetch("/api/admin/feedback/bulk-delete", {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
          feedbackIds: selectedRecordIds,
          reason: actionReason || `Admin bulk deletion of ${selectedRecordIds.length} feedback records`,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        onNotify?.(`Successfully deleted ${data.deletedCount} feedback records (logged to audit).`);
        setIsBulkDeleteModalOpen(false);
        setSelectedRecordIds([]);
        setActionReason("");
        await Promise.all([fetchStats(), fetchData()]);
      } else {
        const err = await res.json();
        alert(err.error || "Failed to perform bulk delete");
      }
    } catch (e: any) {
      alert(e.message || "Error in bulk deletion");
    } finally {
      setActionProcessing(false);
    }
  };

  // Clear all feedback for a product
  const handleClearProductFeedback = async (productId: string) => {
    setActionProcessing(true);
    try {
      const res = await fetch(`/api/admin/products/${encodeURIComponent(productId)}/feedback`, {
        method: "DELETE",
        headers: getHeaders(),
        body: JSON.stringify({
          reason: actionReason || `Admin cleared all feedback for product ${productId}`,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        onNotify?.(`Cleared ${data.deletedCount} feedback votes for product ${productId}.`);
        setActiveClearProductId(null);
        setActionReason("");
        await Promise.all([fetchStats(), fetchData()]);
      } else {
        const err = await res.json();
        alert(err.error || "Failed to clear product feedback");
      }
    } catch (e: any) {
      alert(e.message || "Error clearing product feedback");
    } finally {
      setActionProcessing(false);
    }
  };

  // Update product review status
  const handleUpdateReviewStatus = async (productId: string, newStatus: ProductReviewStatus) => {
    try {
      const res = await fetch(`/api/admin/products/${encodeURIComponent(productId)}/review-status`, {
        method: "PATCH",
        headers: getHeaders(),
        body: JSON.stringify({
          reviewStatus: newStatus,
          notes: `Updated from admin feedback dashboard to '${newStatus}'`,
        }),
      });

      if (res.ok) {
        onNotify?.(`Product ${productId} review status updated to ${newStatus}`);
        setProductSummaries((prev) =>
          prev.map((p) => (p.productId === productId ? { ...p, reviewStatus: newStatus } : p))
        );
      } else {
        const err = await res.json();
        alert(err.error || "Failed to update review status");
      }
    } catch (e: any) {
      alert(e.message || "Error updating review status");
    }
  };

  // Filtered product summaries
  const filteredProductSummaries = productSummaries.filter((p) => {
    if (filterFlaggedOnly && !p.isFlaggedForReview) return false;
    if (!productSearch.trim()) return true;
    const q = productSearch.toLowerCase();
    return (
      p.productName.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.productId.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* 1. METRICS OVERVIEW CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Submissions */}
        <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
              Total Feedback
            </span>
            <Users className="w-4 h-4 text-stone-400" />
          </div>
          <div className="mt-2">
            <div className="text-3xl font-black text-stone-900 dark:text-stone-50">
              {stats.totalSubmissions.toLocaleString()}
            </div>
            <p className="text-[11px] text-stone-500 mt-0.5">
              Across {stats.totalProductsReceivingFeedback} active products
            </p>
          </div>
        </div>

        {/* Thumbs Up Total */}
        <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Accurate Info (UP)
            </span>
            <ThumbsUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2">
            <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
              {stats.totalThumbsUp.toLocaleString()}
            </div>
            <p className="text-[11px] text-stone-500 mt-0.5">Positive community verification</p>
          </div>
        </div>

        {/* Thumbs Down Total */}
        <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
              Incorrect Info (DOWN)
            </span>
            <ThumbsDown className="w-4 h-4 text-rose-500" />
          </div>
          <div className="mt-2">
            <div className="text-3xl font-black text-rose-600 dark:text-rose-400">
              {stats.totalThumbsDown.toLocaleString()}
            </div>
            <p className="text-[11px] text-stone-500 mt-0.5">Data dispute or mismatch flags</p>
          </div>
        </div>

        {/* Average Approval Rate */}
        <div className="p-5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
              Average Approval
            </span>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2">
            <div className="text-3xl font-black text-stone-900 dark:text-stone-50">
              {stats.averageCommunityApproval}%
            </div>
            <p className="text-[11px] text-stone-500 mt-0.5">Catalog-wide approval consensus</p>
          </div>
        </div>

        {/* Flagged For Review */}
        <div
          className={cn(
            "p-5 rounded-2xl border shadow-xs flex flex-col justify-between transition-colors",
            stats.flaggedForReviewCount > 0
              ? "bg-rose-50/60 dark:bg-rose-950/30 border-rose-200 dark:border-rose-900/60"
              : "bg-white dark:bg-stone-900 border-stone-200 dark:border-stone-800"
          )}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">
              Flagged For Review
            </span>
            <ShieldAlert className="w-4 h-4 text-rose-500" />
          </div>
          <div className="mt-2">
            <div className="text-3xl font-black text-rose-600 dark:text-rose-400">
              {stats.flaggedForReviewCount}
            </div>
            <p className="text-[11px] text-stone-500 mt-0.5">≥5 downvotes or ≥30% negative</p>
          </div>
        </div>
      </div>

      {/* 2. SUB-TABS & ACTIONS HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
        <div className="inline-flex p-1 bg-stone-100 dark:bg-stone-800/80 rounded-2xl border border-stone-200/80 dark:border-stone-700/80">
          <button
            type="button"
            onClick={() => setSubTab("products")}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer",
              subTab === "products"
                ? "bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs"
                : "text-stone-500 hover:text-stone-900 dark:hover:text-stone-200"
            )}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Product Summaries ({productSummaries.length})</span>
          </button>
          <button
            type="button"
            onClick={() => setSubTab("records")}
            className={cn(
              "px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer",
              subTab === "records"
                ? "bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-xs"
                : "text-stone-500 hover:text-stone-900 dark:hover:text-stone-200"
            )}
          >
            <MessageSquare className="w-4 h-4 text-emerald-500" />
            <span>Individual Submissions ({recordTotalCount})</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {subTab === "records" && selectedRecordIds.length > 0 && (
            <button
              type="button"
              onClick={() => setIsBulkDeleteModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete Selected ({selectedRecordIds.length})</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              fetchStats();
              fetchData();
            }}
            disabled={isLoading}
            className="p-2 text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer transition-colors"
            title="Refresh Feedback Data"
          >
            <RefreshCw className={cn("w-4 h-4", isLoading && "animate-spin text-emerald-500")} />
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 rounded-2xl text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2 font-medium">
          <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 3. SUB-VIEW: PRODUCT SUMMARIES */}
      {subTab === "products" && (
        <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-xs">
          {/* Controls Bar */}
          <div className="p-4 border-b border-stone-200 dark:border-stone-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                placeholder="Filter by product name, brand, or barcode..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-stone-900 dark:text-stone-100 placeholder-stone-400"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setFilterFlaggedOnly(!filterFlaggedOnly)}
                className={cn(
                  "px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border",
                  filterFlaggedOnly
                    ? "bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-800"
                    : "bg-stone-50 dark:bg-stone-800 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-stone-700"
                )}
              >
                <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                <span>Flagged Only ({stats.flaggedForReviewCount})</span>
              </button>

              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-stone-400 font-medium">Sort:</span>
                <select
                  value={productSortBy}
                  onChange={(e) => setProductSortBy(e.target.value as any)}
                  className="px-2.5 py-1.5 rounded-xl bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-700 text-xs font-medium focus:outline-none cursor-pointer"
                >
                  <option value="recent">Recently Active</option>
                  <option value="approval-asc">Lowest Approval %</option>
                  <option value="negative-desc">Most Negative Votes</option>
                  <option value="total-desc">Most Total Votes</option>
                </select>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/40 text-stone-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-3 text-center">UP / DOWN</th>
                  <th className="py-3 px-4">Community Approval</th>
                  <th className="py-3 px-3 text-center">Review Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                {filteredProductSummaries.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-12 text-center text-stone-400">
                      {productSummaries.length === 0
                        ? "No community feedback has been recorded yet."
                        : "No products match the selected search or filter criteria."}
                    </td>
                  </tr>
                ) : (
                  filteredProductSummaries.map((p) => {
                    const isFlagged = p.isFlaggedForReview;
                    return (
                      <tr
                        key={p.productId}
                        className={cn(
                          "hover:bg-stone-50/60 dark:hover:bg-stone-800/50 transition-colors",
                          isFlagged && "bg-rose-50/30 dark:bg-rose-950/15"
                        )}
                      >
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            {isFlagged && (
                              <span
                                title="Flagged: ≥5 downvotes or ≥30% negative"
                                className="inline-flex shrink-0 p-1 rounded-md bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400"
                              >
                                <AlertTriangle className="w-3.5 h-3.5" />
                              </span>
                            )}
                            <div className="min-w-0">
                              <span className="font-bold text-stone-900 dark:text-stone-100 block truncate max-w-xs">
                                {p.productName}
                              </span>
                              <span className="text-[11px] text-stone-500 block truncate">
                                {p.brand} · ID: {p.productId}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-3 text-center">
                          <div className="inline-flex items-center gap-2 font-mono font-bold text-xs">
                            <span className="text-emerald-600 dark:text-emerald-400">
                              +{p.thumbsUp}
                            </span>
                            <span className="text-stone-300 dark:text-stone-700">/</span>
                            <span className="text-rose-600 dark:text-rose-400">
                              -{p.thumbsDown}
                            </span>
                            <span className="text-[10px] text-stone-400 font-normal">
                              ({p.totalVotes} total)
                            </span>
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="space-y-1 max-w-[140px]">
                            <div className="flex items-center justify-between text-xs font-bold">
                              <span
                                className={cn(
                                  p.communityApproval >= 75
                                    ? "text-emerald-600 dark:text-emerald-400"
                                    : p.communityApproval >= 50
                                    ? "text-amber-600 dark:text-amber-400"
                                    : "text-rose-600 dark:text-rose-400"
                                )}
                              >
                                {p.communityApproval}%
                              </span>
                              {p.totalVotes < 5 && (
                                <span className="text-[9px] font-semibold text-stone-400">
                                  (&lt;5 votes)
                                </span>
                              )}
                            </div>
                            <div className="w-full h-1.5 rounded-full bg-stone-100 dark:bg-stone-800 overflow-hidden">
                              <div
                                className={cn(
                                  "h-full rounded-full transition-all",
                                  p.communityApproval >= 75
                                    ? "bg-emerald-500"
                                    : p.communityApproval >= 50
                                    ? "bg-amber-500"
                                    : "bg-rose-500"
                                )}
                                style={{ width: `${Math.min(100, p.communityApproval)}%` }}
                              />
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-3 text-center">
                          <select
                            value={p.reviewStatus || "NOT_REVIEWED"}
                            onChange={(e) =>
                              handleUpdateReviewStatus(p.productId, e.target.value as ProductReviewStatus)
                            }
                            className={cn(
                              "px-2 py-1 rounded-lg text-[11px] font-bold border focus:outline-none cursor-pointer",
                              p.reviewStatus === "VERIFIED"
                                ? "bg-emerald-50 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 border-emerald-200"
                                : p.reviewStatus === "CORRECTION_REQUIRED"
                                ? "bg-rose-50 text-rose-800 dark:bg-rose-950/70 dark:text-rose-300 border-rose-200"
                                : p.reviewStatus === "UNDER_REVIEW"
                                ? "bg-amber-50 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border-amber-200"
                                : p.reviewStatus === "CORRECTED"
                                ? "bg-sky-50 text-sky-800 dark:bg-sky-950/70 dark:text-sky-300 border-sky-200"
                                : "bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400 border-stone-200 dark:border-stone-700"
                            )}
                          >
                            <option value="NOT_REVIEWED">NOT REVIEWED</option>
                            <option value="UNDER_REVIEW">UNDER REVIEW</option>
                            <option value="VERIFIED">VERIFIED</option>
                            <option value="CORRECTION_REQUIRED">CORRECTION REQUIRED</option>
                            <option value="CORRECTED">CORRECTED</option>
                          </select>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => {
                                setRecordSearch(p.productId);
                                setSubTab("records");
                              }}
                              className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 font-semibold text-[11px] transition-colors cursor-pointer"
                              title="View all individual votes for this product"
                            >
                              Votes
                            </button>
                            <a
                              href={`/products/${p.productId}`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1 text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 rounded-lg transition-colors"
                              title="Open product page in new tab"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                            <button
                              type="button"
                              onClick={() => setActiveClearProductId(p.productId)}
                              className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition-colors cursor-pointer"
                              title="Clear all feedback for this product (with audit log)"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. SUB-VIEW: INDIVIDUAL USER SUBMISSIONS */}
      {subTab === "records" && (
        <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-xs">
          {/* Controls Bar */}
          <div className="p-4 border-b border-stone-200 dark:border-stone-800 flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={recordSearch}
                onChange={(e) => {
                  setRecordSearch(e.target.value);
                  setRecordPage(1);
                }}
                placeholder="Search user name, email, or product ID..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-stone-900 dark:text-stone-100 placeholder-stone-400"
              />
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-stone-400 font-medium">Vote:</span>
                <select
                  value={recordVoteFilter}
                  onChange={(e) => {
                    setRecordVoteFilter(e.target.value);
                    setRecordPage(1);
                  }}
                  className="px-2.5 py-1.5 rounded-xl bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-700 text-xs font-medium focus:outline-none cursor-pointer"
                >
                  <option value="">All Votes</option>
                  <option value="UP">👍 Accurate (UP)</option>
                  <option value="DOWN">👎 Inaccurate (DOWN)</option>
                </select>
              </div>

              {recordSearch && (
                <button
                  type="button"
                  onClick={() => {
                    setRecordSearch("");
                    setRecordPage(1);
                  }}
                  className="text-xs text-rose-500 hover:underline px-2 py-1 font-semibold cursor-pointer"
                >
                  Clear search
                </button>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/40 text-stone-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4 w-10">
                    <input
                      type="checkbox"
                      checked={
                        individualRecords.length > 0 &&
                        selectedRecordIds.length === individualRecords.length
                      }
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedRecordIds(individualRecords.map((r) => r._id));
                        } else {
                          setSelectedRecordIds([]);
                        }
                      }}
                      className="rounded border-stone-300 dark:border-stone-700 text-emerald-600 focus:ring-emerald-500"
                    />
                  </th>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Product ID</th>
                  <th className="py-3 px-3 text-center">Vote</th>
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 dark:divide-stone-800">
                {individualRecords.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-stone-400">
                      No individual feedback submissions found.
                    </td>
                  </tr>
                ) : (
                  individualRecords.map((r) => {
                    const isSelected = selectedRecordIds.includes(r._id);
                    return (
                      <tr
                        key={r._id}
                        className={cn(
                          "hover:bg-stone-50/60 dark:hover:bg-stone-800/50 transition-colors",
                          isSelected && "bg-emerald-50/40 dark:bg-emerald-950/20"
                        )}
                      >
                        <td className="py-3.5 px-4">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedRecordIds((prev) => [...prev, r._id]);
                              } else {
                                setSelectedRecordIds((prev) => prev.filter((id) => id !== r._id));
                              }
                            }}
                            className="rounded border-stone-300 dark:border-stone-700 text-emerald-600 focus:ring-emerald-500"
                          />
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="font-bold text-stone-900 dark:text-stone-100 block">
                            {r.userName || "Anonymous Community User"}
                          </span>
                          <span className="text-[11px] text-stone-500 block">
                            {r.userEmail || `User ID: ${r.userId}`}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 font-mono font-medium text-stone-700 dark:text-stone-300">
                          <a
                            href={`/products/${r.productId}`}
                            target="_blank"
                            rel="noreferrer"
                            className="hover:underline hover:text-emerald-600 inline-flex items-center gap-1"
                          >
                            {r.productId} <ExternalLink className="w-3 h-3 text-stone-400" />
                          </a>
                        </td>

                        <td className="py-3.5 px-3 text-center">
                          <span
                            className={cn(
                              "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold",
                              r.vote === "UP"
                                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300"
                                : "bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300"
                            )}
                          >
                            {r.vote === "UP" ? (
                              <>
                                <ThumbsUp className="w-3 h-3" /> Accurate
                              </>
                            ) : (
                              <>
                                <ThumbsDown className="w-3 h-3" /> Inaccurate
                              </>
                            )}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-stone-500 text-[11px] font-mono">
                          {new Date(r.createdAt).toLocaleString()}
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleSwitchVote(r)}
                              disabled={actionProcessing}
                              className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 font-semibold text-[11px] transition-colors cursor-pointer"
                              title={`Switch vote to ${r.vote === "UP" ? "DOWN" : "UP"}`}
                            >
                              Switch to {r.vote === "UP" ? "👎" : "👍"}
                            </button>
                            <button
                              type="button"
                              onClick={() => setActiveDeleteId(r._id)}
                              disabled={actionProcessing}
                              className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg transition-colors cursor-pointer"
                              title="Delete this vote"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {recordTotalPages > 1 && (
            <div className="p-4 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between text-xs">
              <span className="text-stone-500">
                Page {recordPage} of {recordTotalPages} ({recordTotalCount} records)
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={recordPage <= 1}
                  onClick={() => setRecordPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 font-semibold disabled:opacity-40 cursor-pointer"
                >
                  Previous
                </button>
                <button
                  type="button"
                  disabled={recordPage >= recordTotalPages}
                  onClick={() => setRecordPage((p) => Math.min(recordTotalPages, p + 1))}
                  className="px-3 py-1.5 rounded-lg border border-stone-200 dark:border-stone-700 font-semibold disabled:opacity-40 cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 5. AUDIT TRAIL NOTIFICATION BOX */}
      <div className="p-4 rounded-2xl bg-stone-100/80 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-xs space-y-1">
        <div className="flex items-center gap-2 font-bold text-stone-800 dark:text-stone-200">
          <ShieldAlert className="w-4 h-4 text-emerald-500" />
          <span>Immutable Audit Logging Enforced</span>
        </div>
        <p className="text-stone-600 dark:text-stone-400">
          Every administrative action (modifying votes, manual deletion, bulk deletion, or product feedback wipes)
          is permanently recorded in the MongoDB <code className="font-mono text-emerald-600 dark:text-emerald-400">product_feedback_audit</code> collection
          with the executing administrator&apos;s credentials, previous values, new values, timestamps, and stated reasons.
        </p>
      </div>

      {/* MODAL 1: SINGLE DELETE CONFIRMATION */}
      {activeDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 dark:bg-rose-950/70 text-rose-600 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-base text-stone-900 dark:text-stone-100">
                  Delete Feedback Vote?
                </h4>
                <p className="text-xs text-stone-500">
                  This record will be permanently deleted and recorded in the audit trail.
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                Reason for audit log (optional):
              </label>
              <input
                type="text"
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
                placeholder="e.g. Spam submission, invalid data report"
                className="w-full px-3 py-2 text-xs rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setActiveDeleteId(null);
                  setActionReason("");
                }}
                disabled={actionProcessing}
                className="px-4 py-2 rounded-xl text-xs font-bold text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDeleteVote(activeDeleteId)}
                disabled={actionProcessing}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white transition-colors cursor-pointer"
              >
                {actionProcessing ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: BULK DELETE CONFIRMATION */}
      {isBulkDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 dark:bg-rose-950/70 text-rose-600 flex items-center justify-center shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-base text-stone-900 dark:text-stone-100">
                  Bulk Delete {selectedRecordIds.length} Votes?
                </h4>
                <p className="text-xs text-stone-500">
                  All selected records will be removed and individually logged into the audit ledger.
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                Reason for bulk deletion:
              </label>
              <input
                type="text"
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
                placeholder="e.g. Batch cleanup of outdated dispute tickets"
                className="w-full px-3 py-2 text-xs rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsBulkDeleteModalOpen(false);
                  setActionReason("");
                }}
                disabled={actionProcessing}
                className="px-4 py-2 rounded-xl text-xs font-bold text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleBulkDelete}
                disabled={actionProcessing}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white transition-colors cursor-pointer"
              >
                {actionProcessing ? "Deleting..." : `Delete ${selectedRecordIds.length} Records`}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: CLEAR PRODUCT FEEDBACK CONFIRMATION */}
      {activeClearProductId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-rose-100 dark:bg-rose-950/70 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-base text-stone-900 dark:text-stone-100">
                  Clear All Product Feedback?
                </h4>
                <p className="text-xs text-stone-500">
                  This will wipe all thumbs-up and thumbs-down votes for product{" "}
                  <span className="font-mono font-bold text-stone-800 dark:text-stone-200">
                    {activeClearProductId}
                  </span>
                  .
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                Reason for clearing product votes:
              </label>
              <input
                type="text"
                value={actionReason}
                onChange={(e) => setActionReason(e.target.value)}
                placeholder="e.g. Major reformulation / product repackaging update"
                className="w-full px-3 py-2 text-xs rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setActiveClearProductId(null);
                  setActionReason("");
                }}
                disabled={actionProcessing}
                className="px-4 py-2 rounded-xl text-xs font-bold text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleClearProductFeedback(activeClearProductId)}
                disabled={actionProcessing}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white transition-colors cursor-pointer"
              >
                {actionProcessing ? "Clearing..." : "Confirm Wipe All"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
