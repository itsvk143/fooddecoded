import { NextRequest, NextResponse } from "next/server";
import { checkDatabaseConnection, getCollection } from "@/lib/mongodb";
import { ProductItem, ProductSubmission, ImportJob } from "@/types";
import { verifyAdminAccess } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const auth = verifyAdminAccess(request);
  if (!auth.authorized) {
    return NextResponse.json({ error: auth.error }, { status: 401 });
  }

  try {
    const dbStatus = await checkDatabaseConnection();
    const prodCol = await getCollection<ProductItem>("products");
    const subCol = await getCollection<ProductSubmission>("productSubmissions");
    const jobCol = await getCollection<ImportJob>("importJobs");

    let totalProducts = 0;
    let verifiedProducts = 0;
    let pendingSubmissions = 0;
    let totalImportJobs = 0;
    let avgScore = 0;

    if (prodCol) {
      totalProducts = await prodCol.countDocuments();
      verifiedProducts = await prodCol.countDocuments({ verified: true });
      const scoreAgg = await prodCol
        .aggregate([{ $group: { _id: null, avg: { $avg: "$overallScore" } } }])
        .toArray();
      avgScore = scoreAgg[0]?.avg ? Math.round(scoreAgg[0].avg) : 0;
    } else {
      // In-memory demo numbers
      totalProducts = 11;
      verifiedProducts = 11;
      avgScore = 68;
    }

    if (subCol) {
      pendingSubmissions = await subCol.countDocuments({ status: "pending" });
    } else {
      pendingSubmissions = 1;
    }

    if (jobCol) {
      totalImportJobs = await jobCol.countDocuments();
    }

    return NextResponse.json({
      dbStatus,
      stats: {
        totalProducts,
        verifiedProducts,
        unverifiedProducts: Math.max(0, totalProducts - verifiedProducts),
        pendingSubmissions,
        totalImportJobs,
        averageOverallScore: avgScore,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to gather statistics", message: (error as Error).message },
      { status: 500 }
    );
  }
}
