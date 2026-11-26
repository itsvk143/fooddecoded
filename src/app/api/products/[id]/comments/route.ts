import { NextRequest, NextResponse } from "next/server";
import { getCollection, isMongoConfigured } from "@/lib/mongodb";
import { validateSession } from "@/lib/session";
import { ProductCommentRecord, ProductCommentAuditRecord } from "@/types";
import { ObjectId } from "mongodb";
import { inMemoryComments, inMemoryCommentAudit, inMemoryRateLimits } from "@/lib/comments-store";

interface RouteContext {
  params: Promise<{ id: string }>;
}

/**
 * GET /api/products/[id]/comments
 * Public endpoint. Returns approved comments for this product.
 * If authenticated, also returns the caller's own pending/moderated comments.
 */
export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { id: productId } = await context.params;
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "5", 10)));
    const skip = (page - 1) * limit;

    // Check optional authentication
    const session = await validateSession(request);
    const currentUserId = session.authenticated && session.user ? session.user.id : null;

    if (isMongoConfigured()) {
      const col = await getCollection<ProductCommentRecord>("product_comments");
      if (col) {
        // Query filter: All APPROVED comments for this product, PLUS any comments authored by current user
        const queryFilter: any = {
          productId,
          $or: [{ status: "APPROVED" }],
        };

        if (currentUserId) {
          queryFilter.$or.push({ userId: currentUserId });
        }

        const [comments, totalApproved, totalQuery] = await Promise.all([
          col
            .find(queryFilter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .toArray(),
          col.countDocuments({ productId, status: "APPROVED" }),
          col.countDocuments(queryFilter),
        ]);

        return NextResponse.json({
          comments: comments.map((c) => ({
            ...c,
            _id: c._id?.toString(),
            isOwn: currentUserId ? c.userId === currentUserId : false,
          })),
          totalApproved,
          totalCount: totalQuery,
          page,
          limit,
          hasMore: totalQuery > skip + comments.length,
        });
      }
    }

    // In-memory fallback
    const filtered = inMemoryComments.filter((c) => {
      if (c.productId !== productId) return false;
      if (c.status === "APPROVED") return true;
      if (currentUserId && c.userId === currentUserId) return true;
      return false;
    });

    // Sort newest first
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    const totalApproved = inMemoryComments.filter(
      (c) => c.productId === productId && c.status === "APPROVED"
    ).length;
    const paginated = filtered.slice(skip, skip + limit);

    return NextResponse.json({
      comments: paginated.map((c) => ({
        ...c,
        isOwn: currentUserId ? c.userId === currentUserId : false,
      })),
      totalApproved,
      totalCount: filtered.length,
      page,
      limit,
      hasMore: filtered.length > skip + paginated.length,
    });
  } catch (error) {
    console.error("[API /api/products/[id]/comments GET] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch comments", message: (error as Error).message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/products/[id]/comments
 * Authenticated endpoint. Creates a new comment under PENDING status.
 */
export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const { id: productId } = await context.params;

    // 1. Authentication Check
    const session = await validateSession(request);
    if (!session.authenticated || !session.user) {
      return NextResponse.json(
        { error: "Authentication required. Please sign in to submit a comment." },
        { status: 401 }
      );
    }

    const { user } = session;

    // 2. Body parsing and validation
    const body = await request.json().catch(() => ({}));
    const rawComment = body.comment;

    if (typeof rawComment !== "string") {
      return NextResponse.json(
        { error: "Invalid comment format. Text string required." },
        { status: 400 }
      );
    }

    const trimmedComment = rawComment.trim();

    if (trimmedComment.length < 3) {
      return NextResponse.json(
        { error: "Comment must be at least 3 characters long." },
        { status: 400 }
      );
    }

    if (trimmedComment.length > 1000) {
      return NextResponse.json(
        { error: "Comment cannot exceed 1,000 characters." },
        { status: 400 }
      );
    }

    // 3. Abuse prevention & Rate limiting (1 submission per 5 seconds per user)
    const nowMs = Date.now();
    const lastPostMs = inMemoryRateLimits.get(user.id) || 0;
    if (nowMs - lastPostMs < 5000) {
      return NextResponse.json(
        { error: "Please wait a few seconds before submitting another comment." },
        { status: 429 }
      );
    }
    inMemoryRateLimits.set(user.id, nowMs);

    // 4. Create record
    const now = new Date();
    const commentRecord: ProductCommentRecord = {
      productId,
      userId: user.id,
      userName: user.name || "Community Member",
      userEmail: user.email,
      userAvatar: user.profilePicture,
      comment: trimmedComment,
      status: "PENDING",
      createdAt: now,
      updatedAt: now,
    };

    if (isMongoConfigured()) {
      const col = await getCollection<ProductCommentRecord>("product_comments");
      const auditCol = await getCollection<ProductCommentAuditRecord>("product_comment_audit");

      if (col) {
        const insertResult = await col.insertOne(commentRecord as any);
        const commentId = insertResult.insertedId.toString();
        commentRecord._id = commentId;

        if (auditCol) {
          await auditCol.insertOne({
            commentId,
            productId,
            performedBy: user.id,
            role: "USER",
            action: "CREATE",
            newContent: trimmedComment,
            newStatus: "PENDING",
            reason: "User initial comment submission",
            timestamp: now,
          } as any);
        }

        return NextResponse.json(
          {
            success: true,
            message: "Your comment has been submitted and is awaiting community moderation.",
            comment: {
              ...commentRecord,
              _id: commentId,
              isOwn: true,
            },
          },
          { status: 201 }
        );
      }
    }

    // In-memory fallback
    const memoryId = `cm_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    commentRecord._id = memoryId;
    inMemoryComments.unshift(commentRecord);

    inMemoryCommentAudit.unshift({
      commentId: memoryId,
      productId,
      performedBy: user.id,
      role: "USER",
      action: "CREATE",
      newContent: trimmedComment,
      newStatus: "PENDING",
      reason: "User initial comment submission (in-memory)",
      timestamp: now,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Your comment has been submitted and is awaiting community moderation.",
        comment: {
          ...commentRecord,
          _id: memoryId,
          isOwn: true,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[API /api/products/[id]/comments POST] Error:", error);
    return NextResponse.json(
      { error: "Failed to submit comment", message: (error as Error).message },
      { status: 500 }
    );
  }
}
