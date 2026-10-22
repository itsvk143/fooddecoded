import { NextRequest, NextResponse } from "next/server";
import { getCollection } from "@/lib/mongodb";
import { ProductSubmission } from "@/types";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.barcode || !body.name) {
      return NextResponse.json(
        { error: "Barcode and product name are mandatory." },
        { status: 400 }
      );
    }

    const cleanBarcode = String(body.barcode).trim().replace(/[^0-9]/g, "");

    const submission: ProductSubmission = {
      barcode: cleanBarcode,
      name: body.name.trim(),
      brand: body.brand?.trim() || "Independent",
      category: body.category || "Packaged Foods",
      ingredientsText: body.ingredientsText?.trim() || "",
      nutritionFacts: {
        calories: Number(body.calories || 0),
        totalFat: Number(body.totalFat || 0),
        saturatedFat: Number(body.saturatedFat || 0),
        carbohydrates: Number(body.carbohydrates || 0),
        sugars: Number(body.sugars || 0),
        fiber: Number(body.fiber || 0),
        protein: Number(body.protein || 0),
        sodium: Number(body.sodium || 0),
        salt: Number(body.salt || 0),
      },
      submittedBy: body.submittedBy?.trim() || "Anonymous Contributor",
      submitterEmail: body.submitterEmail?.trim() || "",
      imageUrl: body.imageUrl?.trim() || "",
      status: "pending",
      reviewNotes: body.notes || "",
      createdAt: new Date().toISOString(),
    };

    const col = await getCollection<ProductSubmission>("productSubmissions");
    if (col) {
      const res = await col.insertOne(submission as any);
      submission._id = res.insertedId.toString();
    } else {
      submission._id = `sub_${Date.now()}`;
    }

    return NextResponse.json(
      {
        success: true,
        message: "Thank you! Your product submission has been queued for editorial review.",
        submission,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to submit product", message: (error as Error).message },
      { status: 500 }
    );
  }
}
