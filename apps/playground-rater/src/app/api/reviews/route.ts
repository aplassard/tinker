import { NextRequest, NextResponse } from "next/server";
import { getReviewsByPlaceId, createReview } from "@/lib/db";

export async function GET(request: NextRequest) {
  const placeId = request.nextUrl.searchParams.get("placeId");

  if (!placeId) {
    return NextResponse.json(
      { error: "placeId query parameter is required" },
      { status: 400 }
    );
  }

  const reviews = await getReviewsByPlaceId(placeId);
  return NextResponse.json(reviews);
}

export async function POST(request: NextRequest) {
  const body = await request.json();

  const required = [
    "placeId",
    "overall",
    "equipment",
    "cleanliness",
    "shade",
    "safety",
    "restrooms",
    "parking",
  ] as const;

  for (const field of required) {
    if (body[field] === undefined || body[field] === null) {
      return NextResponse.json(
        { error: `${field} is required` },
        { status: 400 }
      );
    }
  }

  const review = await createReview({
    placeId: body.placeId,
    overall: body.overall,
    equipment: body.equipment,
    cleanliness: body.cleanliness,
    shade: body.shade,
    safety: body.safety,
    restrooms: body.restrooms,
    parking: body.parking,
    ageTags: body.ageTags ?? [],
    reviewText: body.reviewText ?? "",
    reviewerName: body.reviewerName ?? "Anonymous",
  });

  return NextResponse.json(review, { status: 201 });
}
