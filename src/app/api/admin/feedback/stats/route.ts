import { NextRequest, NextResponse } from "next/server";
import { getCollection, isMongoConfigured } from "@/lib/mongodb";
import { verifyAdminAccess } from "@/lib/auth";
import { ProductFeedbackRecord } from "@/types";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const auth = verifyAdminAccess(request);
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  try {
    if (isMongoConfigured()) {
      const col = await getCollection<ProductFeedbackRecord>("product_feedback");
      if (col) {
        const [countsAgg, productAgg, recentRecords] = await Promise.all([
          col
            .aggregate([
              {
                $group: {
                  _id: "$vote",
                  count: { $sum: 1 },
                },
              },
            ])
            .toArray(),
          col
            .aggregate([
              {
                $group: {
                  _id: "$productId",
                  thumbsUp: { $sum: { $cond: [{ $eq: ["$vote", "UP"] }, 1, 0] } },
                  thumbsDown: { $sum: { $cond: [{ $eq: ["$vote", "DOWN"] }, 1, 0] } },
                  total: { $sum: 1 },
                },
              },
            ])
            .toArray(),
          col.find({}).sort({ createdAt: -1 }).limit(10).toArray(),
        ]);

        let totalThumbsUp = 0;
        let totalThumbsDown = 0;
        for (const item of countsAgg) {
          if (item._id === "UP") totalThumbsUp = item.count;
          if (item._id === "DOWN") totalThumbsDown = item.count;
        }

        const totalSubmissions = totalThumbsUp + totalThumbsDown;
        const totalProductsReceivingFeedback = productAgg.length;

        let totalApprovalSum = 0;
        let flaggedForReviewCount = 0;

        for (const pa of productAgg) {
          const approval = pa.total > 0 ? (pa.thumbsUp / pa.total) * 100 : 0;
          totalApprovalSum += approval;

          // Flag threshold: >= 5 negative votes OR (>= 5 total and >= 30% negative)
          if (pa.thumbsDown >= 5 || (pa.total >= 5 && pa.thumbsDown / pa.total >= 0.3)) {
            flaggedForReviewCount++;
          }
        }

        const averageCommunityApproval =
          totalProductsReceivingFeedback > 0
            ? Math.round((totalApprovalSum / totalProductsReceivingFeedback) * 10) / 10
            : 0;

        return NextResponse.json({
          totalSubmissions,
          totalThumbsUp,
          totalThumbsDown,
          totalProductsReceivingFeedback,
          averageCommunityApproval,
          flaggedForReviewCount,
          recentActivity: recentRecords.map((r) => ({
            id: r._id?.toString(),
            productId: r.productId,
            userName: r.userName,
            vote: r.vote,
            createdAt: r.createdAt,
          })),
        });
      }
    }

    // Default zero state for offline / mock dev mode
    return NextResponse.json({
      totalSubmissions: 0,
      totalThumbsUp: 0,
      totalThumbsDown: 0,
      totalProductsReceivingFeedback: 0,
      averageCommunityApproval: 0,
      flaggedForReviewCount: 0,
      recentActivity: [],
    });
  } catch (error) {
    console.error("[API /api/admin/feedback/stats GET] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch feedback statistics", message: (error as Error).message },
      { status: 500 }
    );
  }
}
