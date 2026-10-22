import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getCollection } from "@/lib/mongodb";
import { ProductSubmission } from "@/types";
import { saveProduct } from "@/lib/product-service";
import { verifyAdminAccess } from "@/lib/auth";
import { logAuditEvent } from "@/lib/audit";
import { SEED_SUBMISSIONS } from "@/lib/seed-data";

export async function GET(request: NextRequest) {
  const auth = verifyAdminAccess(request);
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  try {
    const col = await getCollection<ProductSubmission>("productSubmissions");
    if (col) {
      const submissions = await col.find({}).sort({ createdAt: -1 }).toArray();
      return NextResponse.json(submissions.map((s) => ({ ...s, _id: s._id?.toString() })));
    }
    return NextResponse.json(SEED_SUBMISSIONS);
  } catch (error) {
    return NextResponse.json(SEED_SUBMISSIONS);
  }
}

export async function PUT(request: NextRequest) {
  const auth = verifyAdminAccess(request);
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { submissionId, status, reviewNotes } = body;

    if (!submissionId || !status) {
      return NextResponse.json({ error: "Missing submissionId or status" }, { status: 400 });
    }

    const col = await getCollection<ProductSubmission>("productSubmissions");
    let submission: any = null;

    if (col) {
      if (ObjectId.isValid(submissionId)) {
        submission = await col.findOne({ _id: new ObjectId(submissionId) as any });
      } else {
        submission = await col.findOne({ _id: submissionId as any });
      }
    }

    if (!submission) {
      submission = SEED_SUBMISSIONS.find((s) => s._id === submissionId);
    }

    if (!submission) {
      return NextResponse.json({ error: "Submission not found" }, { status: 404 });
    }

    const now = new Date().toISOString();

    // If approved, create verified product in catalogue!
    if (status === "approved") {
      await saveProduct({
        barcode: submission.barcode,
        name: submission.name,
        brand: submission.brand,
        category: submission.category,
        ingredientsText: submission.ingredientsText,
        imageUrl: submission.imageUrl,
        nutritionPer100g: {
          calories: submission.nutritionFacts?.calories || 0,
          totalFat: submission.nutritionFacts?.totalFat || 0,
          saturatedFat: submission.nutritionFacts?.saturatedFat || 0,
          carbohydrates: submission.nutritionFacts?.carbohydrates || 0,
          sugars: submission.nutritionFacts?.sugars || 0,
          fiber: submission.nutritionFacts?.fiber || 0,
          protein: submission.nutritionFacts?.protein || 0,
          sodium: submission.nutritionFacts?.sodium || 0,
          salt: submission.nutritionFacts?.salt || 0,
        },
        verified: true,
        verifiedBy: auth.adminIdentifier,
        source: "submission",
      });
    }

    if (col && ObjectId.isValid(submissionId)) {
      await col.updateOne(
        { _id: new ObjectId(submissionId) as any },
        {
          $set: {
            status,
            reviewNotes: reviewNotes || submission.reviewNotes,
            reviewedBy: auth.adminIdentifier,
            reviewedAt: now,
          },
        }
      );
    }

    await logAuditEvent({
      action: status === "approved" ? "APPROVE_SUBMISSION" : "REJECT_SUBMISSION",
      entityType: "submission",
      entityId: submission.barcode,
      performedBy: auth.adminIdentifier,
      details: `${status.toUpperCase()} submission for ${submission.name} (${submission.barcode})`,
    });

    return NextResponse.json({
      success: true,
      message: `Submission marked as ${status}.`,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Review update failed", message: (error as Error).message },
      { status: 500 }
    );
  }
}
