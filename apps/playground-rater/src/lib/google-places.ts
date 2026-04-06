import type { Playground } from "@/types";

const API_KEY = process.env.GOOGLE_MAPS_API_KEY!;

export async function searchNearbyPlaygrounds(
  lat: number,
  lng: number,
  radiusMeters = 5000
): Promise<Playground[]> {
  const url = "https://places.googleapis.com/v1/places:searchNearby";

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": API_KEY,
      "X-Goog-FieldMask":
        "places.id,places.displayName,places.formattedAddress,places.location,places.photos,places.rating,places.userRatingCount",
    },
    body: JSON.stringify({
      includedTypes: ["playground"],
      maxResultCount: 20,
      locationRestriction: {
        circle: {
          center: { latitude: lat, longitude: lng },
          radius: radiusMeters,
        },
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`Google Places API error: ${response.status}`);
  }

  const data = await response.json();

  return (data.places ?? []).map(
    (place: Record<string, unknown>): Playground => ({
      placeId: place.id as string,
      name: (place.displayName as Record<string, string>)?.text ?? "",
      address: (place.formattedAddress as string) ?? "",
      location: {
        lat: (place.location as Record<string, number>)?.latitude ?? 0,
        lng: (place.location as Record<string, number>)?.longitude ?? 0,
      },
      photoReference: (
        place.photos as Array<Record<string, string>> | undefined
      )?.[0]?.name,
      rating: place.rating as number | undefined,
      userRatingsTotal: place.userRatingCount as number | undefined,
    })
  );
}

export async function getPlaygroundDetails(
  placeId: string
): Promise<Playground> {
  const url = `https://places.googleapis.com/v1/places/${placeId}`;

  const response = await fetch(url, {
    method: "GET",
    headers: {
      "X-Goog-Api-Key": API_KEY,
      "X-Goog-FieldMask":
        "id,displayName,formattedAddress,location,photos,rating,userRatingCount",
    },
  });

  if (!response.ok) {
    throw new Error(`Google Places API error: ${response.status}`);
  }

  const place = await response.json();

  return {
    placeId: place.id,
    name: place.displayName?.text ?? "",
    address: place.formattedAddress ?? "",
    location: {
      lat: place.location?.latitude ?? 0,
      lng: place.location?.longitude ?? 0,
    },
    photoReference: place.photos?.[0]?.name,
    rating: place.rating,
    userRatingsTotal: place.userRatingCount,
  };
}

export function getPhotoUrl(
  photoReference: string,
  maxWidthPx = 400
): string {
  return `https://places.googleapis.com/v1/${photoReference}/media?maxWidthPx=${maxWidthPx}&key=${API_KEY}`;
}
