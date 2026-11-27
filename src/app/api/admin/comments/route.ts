import { NextRequest, NextResponse } from "next/server";
import { getCollection, isMongoConfigured } from "@/lib/mongodb";
import { verifyAdminAccessAsync } from "@/lib/auth";
import { ProductCommentRecord, ProductCommentStatus } from "@/types";
import { ObjectId } from "mongodb";
import { inMemoryComments } from "@/lib/comments-store";

export const dynamic = "force-dynamic";

/**
 * GET /api/admin/comments
 * Admin endpoint to list, filter, search, and paginate comments.
 */
export async function GET(request: NextRequest) {
  const auth = await verifyAdminAccessAsync(request);
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId") || undefined;
    const status = (searchParams.get("status") as ProductCommentStatus) || undefined;
    const search = searchParams.get("search") || undefined;
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "25", 10)));
    const skip = (page - 1) * limit;

    if (isMongoConfigured()) {
      const col = await getCollection<ProductCommentRecord>("product_comments");
      const prodCol = await getCollection("products");

      if (col) {
        const query: any = {};
        if (productId) query.productId = productId;
        if (status && status !== ("ALL" as any)) query.status = status;
        if (search) {
          query.$or = [
            { comment: { $regex: search, $options: "i" } },
            { userName: { $regex: search, $options: "i" } },
            { userEmail: { $regex: search, $options: "i" } },
            { productId: { $regex: search, $options: "i" } },
          ];
        }

        const [comments, totalFiltered, countsAgg] = await Promise.all([
          col.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).toArray(),
          col.countDocuments(query),
          col
            .aggregate([
              {
                $group: {
                  _id: "$status",
                  count: { $sum: 1 },
                },
              },
            ])
            .toArray(),
        ]);

        let pendingCount = 0;
        let approvedCount = 0;
        let rejectedCount = 0;
        let flaggedCount = 0;

        for (const item of countsAgg) {
          if (item._id === "PENDING") pendingCount = item.count;
          if (item._id === "APPROVED") approvedCount = item.count;
          if (item._id === "REJECTED") rejectedCount = item.count;
          if (item._id === "FLAGGED") flaggedCount = item.count;
        }

        const totalComments = pendingCount + approvedCount + rejectedCount + flaggedCount;

        // Optionally enrich comments with product names
        const prodIds = Array.from(new Set(comments.map((c) => c.productId)));
        const prodMap = new Map<string, string>();
        if (prodCol && prodIds.length > 0) {
          const prods = await prodCol
            .find({ $or: [{ id: { $in: prodIds } }, { barcode: { $in: prodIds } }] }, { projection: { id: 1, barcode: 1, name: 1 } })
            .toArray();
          for (const p of prods) {
            if (p.id) prodMap.set(p.id, p.name);
            if (p.barcode) prodMap.set(p.barcode, p.name);
          }
        }

        return NextResponse.json({
          comments: comments.map((c) => ({
            ...c,
            _id: c._id?.toString(),
            productName: prodMap.get(c.productId) || c.productId,
          })),
          stats: {
            total: totalComments,
            pendingCount,
            approvedCount,
            rejectedCount,
            flaggedCount,
          },
          pagination: {
            page,
            limit,
            totalCount: totalFiltered,
            totalPages: Math.ceil(totalFiltered / limit) || 1,
          },
        });
      }
    }

    // In-memory fallback
    const filtered = inMemoryComments.filter((c) => {
      if (productId && c.productId !== productId) return false;
      if (status && status !== ("ALL" as any) && c.status !== status) return false;
      if (search) {
        const q = search.toLowerCase();
        const matches =
          c.comment.toLowerCase().includes(q) ||
          c.userName.toLowerCase().includes(q) ||
          (c.userEmail && c.userEmail.toLowerCase().includes(q)) ||
          c.productId.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });

    let pendingCount = 0;
    let approvedCount = 0;
    let rejectedCount = 0;
    let flaggedCount = 0;

    for (const c of inMemoryComments) {
      if (c.status === "PENDING") pendingCount++;
      if (c.status === "APPROVED") approvedCount++;
      if (c.status === "REJECTED") rejectedCount++;
      if (c.status === "FLAGGED") flaggedCount++;
    }

    const paginated = filtered.slice(skip, skip + limit);

    return NextResponse.json({
      comments: paginated.map((c) => ({
        ...c,
        productName: c.productId,
      })),
      stats: {
        total: inMemoryComments.length,
        pendingCount,
        approvedCount,
        rejectedCount,
        flaggedCount,
      },
      pagination: {
        page,
        limit,
        totalCount: filtered.length,
        totalPages: Math.ceil(filtered.length / limit) || 1,
      },
    });
  } catch (error) {
    console.error("[API /api/admin/comments GET] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch administrative comments", message: (error as Error).message },
      { status: 500 }
    );
  }
}
