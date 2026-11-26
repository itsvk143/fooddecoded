import { NextRequest, NextResponse } from "next/server";
import { getCollection, isMongoConfigured } from "@/lib/mongodb";
import { verifyAdminAccess } from "@/lib/auth";
import { ProductFeedbackRecord } from "@/types";
import { ObjectId } from "mongodb";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const auth = verifyAdminAccess(request);
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId") || undefined;
    const vote = searchParams.get("vote") || undefined;
    const search = searchParams.get("search") || undefined;
    const sortBy = searchParams.get("sortBy") || "recent"; // "recent" | "approval-asc" | "negative-desc" | "total-desc"
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "25", 10)));
    const skip = (page - 1) * limit;

    if (isMongoConfigured()) {
      const col = await getCollection<ProductFeedbackRecord>("product_feedback");
      const prodCol = await getCollection("products");

      if (col) {
        const query: any = {};
        if (productId) query.productId = productId;
        if (vote) query.vote = vote;
        if (search) {
          query.$or = [
            { userName: { $regex: search, $options: "i" } },
            { userEmail: { $regex: search, $options: "i" } },
            { productId: { $regex: search, $options: "i" } },
          ];
        }

        const [individualRecords, totalCount, productAggregates] = await Promise.all([
          col.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).toArray(),
          col.countDocuments(query),
          col
            .aggregate([
              {
                $group: {
                  _id: "$productId",
                  thumbsUp: { $sum: { $cond: [{ $eq: ["$vote", "UP"] }, 1, 0] } },
                  thumbsDown: { $sum: { $cond: [{ $eq: ["$vote", "DOWN"] }, 1, 0] } },
                  totalVotes: { $sum: 1 },
                  lastFeedbackAt: { $max: "$updatedAt" },
                },
              },
            ])
            .toArray(),
        ]);

        // Enrich product summary with names from products collection
        const prodIds = productAggregates.map((p) => p._id);
        const prodObjIds: ObjectId[] = [];
        for (const pid of prodIds) {
          try {
            prodObjIds.push(new ObjectId(pid));
          } catch {}
        }

        const prods = prodCol
          ? await prodCol
              .find(
                {
                  $or: [
                    { id: { $in: prodIds } },
                    { _id: { $in: prodObjIds } },
                    { barcode: { $in: prodIds } },
                  ],
                },
                { projection: { name: 1, brand: 1, barcode: 1, id: 1, _id: 1, reviewStatus: 1 } }
              )
              .toArray()
          : [];

        const prodMap = new Map();
        for (const p of prods) {
          const key = p.id || p._id?.toString() || p.barcode;
          prodMap.set(key, p);
        }

        const productSummaries = productAggregates.map((pa) => {
          const matchedProd = prodMap.get(pa._id);
          const total = pa.totalVotes;
          const approval = total > 0 ? Math.round((pa.thumbsUp / total) * 1000) / 10 : 0;
          const negativePercent = total > 0 ? Math.round((pa.thumbsDown / total) * 1000) / 10 : 0;
          const isFlagged = pa.thumbsDown >= 5 || (total >= 5 && pa.thumbsDown / total >= 0.3);

          return {
            productId: pa._id,
            productName: matchedProd?.name || `Product (${pa._id})`,
            brand: matchedProd?.brand || "Unknown Brand",
            thumbsUp: pa.thumbsUp,
            thumbsDown: pa.thumbsDown,
            totalVotes: total,
            communityApproval: approval,
            negativePercentage: negativePercent,
            reviewStatus: matchedProd?.reviewStatus || "NOT_REVIEWED",
            isFlaggedForReview: isFlagged,
            lastFeedbackAt: pa.lastFeedbackAt,
          };
        });

        // Apply sorting to product summaries
        if (sortBy === "approval-asc") {
          productSummaries.sort((a, b) => a.communityApproval - b.communityApproval);
        } else if (sortBy === "negative-desc") {
          productSummaries.sort((a, b) => b.thumbsDown - a.thumbsDown);
        } else if (sortBy === "total-desc") {
          productSummaries.sort((a, b) => b.totalVotes - a.totalVotes);
        } else {
          productSummaries.sort(
            (a, b) =>
              new Date(b.lastFeedbackAt || 0).getTime() - new Date(a.lastFeedbackAt || 0).getTime()
          );
        }

        return NextResponse.json({
          productSummaries,
          individualRecords: individualRecords.map((r) => ({
            ...r,
            _id: r._id?.toString(),
          })),
          pagination: {
            page,
            limit,
            totalCount,
            totalPages: Math.ceil(totalCount / limit),
          },
        });
      }
    }

    // Mock fallback response for offline testing
    return NextResponse.json({
      productSummaries: [],
      individualRecords: [],
      pagination: { page: 1, limit: 25, totalCount: 0, totalPages: 1 },
    });
  } catch (error) {
    console.error("[API /api/admin/feedback GET] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch administrative feedback records", message: (error as Error).message },
      { status: 500 }
    );
  }
}
