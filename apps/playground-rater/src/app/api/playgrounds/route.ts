import { NextRequest, NextResponse } from "next/server";
import { searchNearbyPlaygrounds } from "@/lib/google-places";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const lat = parseFloat(searchParams.get("lat") ?? "");
  const lng = parseFloat(searchParams.get("lng") ?? "");

  if (isNaN(lat) || isNaN(lng)) {
    return NextResponse.json(
      { error: "lat and lng query parameters are required" },
      { status: 400 }
    );
  }

  const radius = parseFloat(searchParams.get("radius") ?? "5000");
  const playgrounds = await searchNearbyPlaygrounds(lat, lng, radius);

  return NextResponse.json(playgrounds);
}
