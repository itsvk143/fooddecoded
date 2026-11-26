import { NextRequest, NextResponse } from "next/server";
import { getCollection, isMongoConfigured } from "@/lib/mongodb";
import { validateSession } from "@/lib/session";
import { ProductFeedbackRecord, ProductReviewStatus, FeedbackVote } from "@/types";

export const dynamic = "force-dynamic";

// In-memory fallback for local mock / offline testing
const inMemoryFeedback: ProductFeedbackRecord[] = [];
const inMemoryProductReviewStatus = new Map<string, ProductReviewStatus>();

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    if (!id) {
      return NextResponse.json({ error: "Missing product identifier" }, { status: 400 });
    }

    // 1. Check if user is authenticated
    const sessionResult = await validateSession(request);
    const userId = sessionResult.authenticated && sessionResult.user ? sessionResult.user.id : null;

    let thumbsUp = 0;
    let thumbsDown = 0;
    let userVote: FeedbackVote | null = null;
    let reviewStatus: ProductReviewStatus = "NOT_REVIEWED";

    if (isMongoConfigured()) {
      const col = await getCollection<ProductFeedbackRecord>("product_feedback");
      const prodCol = await getCollection("products");

      if (col) {
        // Aggregate votes for product
        const aggregate = await col
          .aggregate([
            { $match: { productId: id } },
            { $group: { _id: "$vote", count: { $sum: 1 } } },
          ])
          .toArray();

        for (const item of aggregate) {
          if (item._id === "UP") thumbsUp = item.count;
          if (item._id === "DOWN") thumbsDown = item.count;
        }

        // Check user's current vote if authenticated
        if (userId) {
          const userRecord = await col.findOne({ productId: id, userId });
          if (userRecord) {
            userVote = userRecord.vote;
          }
        }
      }

      if (prodCol) {
        const prod = await prodCol.findOne(
          { $or: [{ id }, { _id: id as any }, { barcode: id }] },
          { projection: { reviewStatus: 1 } }
        );
        if (prod?.reviewStatus) {
          reviewStatus = prod.reviewStatus as ProductReviewStatus;
        }
      }
    } else {
      // In-memory fallback
      const matching = inMemoryFeedback.filter((f) => f.productId === id);
      thumbsUp = matching.filter((f) => f.vote === "UP").length;
      thumbsDown = matching.filter((f) => f.vote === "DOWN").length;

      if (userId) {
        const userRec = matching.find((f) => f.userId === userId);
        if (userRec) userVote = userRec.vote;
      }

      reviewStatus = inMemoryProductReviewStatus.get(id) || "NOT_REVIEWED";
    }

    const totalVotes = thumbsUp + thumbsDown;
    const communityApproval =
      totalVotes > 0 ? Math.round((thumbsUp / totalVotes) * 1000) / 10 : 0;
    const notEnoughFeedback = totalVotes < 5;

    return NextResponse.json({
      productId: id,
      thumbsUp,
      thumbsDown,
      totalVotes,
      communityApproval,
      notEnoughFeedback,
      userVote,
      reviewStatus,
    });
  } catch (error) {
    console.error("[API /api/products/[id]/feedback GET] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch product feedback", message: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    if (!id) {
      return NextResponse.json({ error: "Missing product identifier" }, { status: 400 });
    }

    // 1. Validate authentication (Server-side session check)
    const sessionResult = await validateSession(request);
    if (!sessionResult.authenticated || !sessionResult.user) {
      return NextResponse.json(
        { error: "Authentication required to submit feedback", code: "UNAUTHORIZED" },
        { status: 401 }
      );
    }

    const user = sessionResult.user;

    // 2. Validate vote input
    const body = await request.json();
    const vote = body.vote;
    if (vote !== "UP" && vote !== "DOWN") {
      return NextResponse.json(
        { error: "Invalid vote. Must be 'UP' or 'DOWN'." },
        { status: 400 }
      );
    }

    const now = new Date();

    if (isMongoConfigured()) {
      const col = await getCollection<ProductFeedbackRecord>("product_feedback");
      if (col) {
        // Upsert feedback record: one active vote per user per product
        const existing = await col.findOne({ productId: id, userId: user.id });

        if (!existing) {
          await col.insertOne({
            productId: id,
            userId: user.id,
            userName: user.name,
            userEmail: user.email,
            vote,
            createdAt: now,
            updatedAt: now,
          } as any);
        } else if (existing.vote !== vote) {
          // Vote switching
          await col.updateOne(
            { _id: existing._id },
            { $set: { vote, updatedAt: now } }
          );
        }

        // Recalculate aggregate stats
        const aggregate = await col
          .aggregate([
            { $match: { productId: id } },
            { $group: { _id: "$vote", count: { $sum: 1 } } },
          ])
          .toArray();

        let thumbsUp = 0;
        let thumbsDown = 0;
        for (const item of aggregate) {
          if (item._id === "UP") thumbsUp = item.count;
          if (item._id === "DOWN") thumbsDown = item.count;
        }

        const totalVotes = thumbsUp + thumbsDown;
        const communityApproval =
          totalVotes > 0 ? Math.round((thumbsUp / totalVotes) * 1000) / 10 : 0;
        const notEnoughFeedback = totalVotes < 5;

        return NextResponse.json({
          success: true,
          productId: id,
          thumbsUp,
          thumbsDown,
          totalVotes,
          communityApproval,
          notEnoughFeedback,
          userVote: vote,
        });
      }
    }

    // In-memory fallback
    const existingIndex = inMemoryFeedback.findIndex(
      (f) => f.productId === id && f.userId === user.id
    );

    if (existingIndex >= 0) {
      inMemoryFeedback[existingIndex].vote = vote;
      inMemoryFeedback[existingIndex].updatedAt = now;
    } else {
      inMemoryFeedback.push({
        productId: id,
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        vote,
        createdAt: now,
        updatedAt: now,
      });
    }

    const matching = inMemoryFeedback.filter((f) => f.productId === id);
    const thumbsUp = matching.filter((f) => f.vote === "UP").length;
    const thumbsDown = matching.filter((f) => f.vote === "DOWN").length;
    const totalVotes = thumbsUp + thumbsDown;
    const communityApproval =
      totalVotes > 0 ? Math.round((thumbsUp / totalVotes) * 1000) / 10 : 0;
    const notEnoughFeedback = totalVotes < 5;

    return NextResponse.json({
      success: true,
      productId: id,
      thumbsUp,
      thumbsDown,
      totalVotes,
      communityApproval,
      notEnoughFeedback,
      userVote: vote,
    });
  } catch (error) {
    console.error("[API /api/products/[id]/feedback POST] Error:", error);
    return NextResponse.json(
      { error: "Failed to record feedback", message: (error as Error).message },
      { status: 500 }
    );
  }
}
