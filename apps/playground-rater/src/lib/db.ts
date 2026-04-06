import { sql } from "@vercel/postgres";
import type { Review, ReviewAggregation } from "@/types";

export async function getReviewsByPlaceId(
  placeId: string
): Promise<Review[]> {
  const { rows } = await sql`
    SELECT * FROM reviews
    WHERE place_id = ${placeId}
    ORDER BY created_at DESC
  `;

  return rows.map((row) => ({
    id: row.id,
    placeId: row.place_id,
    overall: row.overall,
    equipment: row.equipment,
    cleanliness: row.cleanliness,
    shade: row.shade,
    safety: row.safety,
    restrooms: row.restrooms,
    parking: row.parking,
    ageTags: row.age_tags ?? [],
    reviewText: row.review_text,
    reviewerName: row.reviewer_name,
    createdAt: new Date(row.created_at),
  }));
}

export async function getAggregationByPlaceId(
  placeId: string
): Promise<ReviewAggregation | null> {
  const { rows } = await sql`
    SELECT
      place_id,
      COUNT(*)::int AS total_reviews,
      ROUND(AVG(overall), 2) AS avg_overall,
      ROUND(AVG(equipment), 2) AS avg_equipment,
      ROUND(AVG(cleanliness), 2) AS avg_cleanliness,
      ROUND(AVG(shade), 2) AS avg_shade,
      ROUND(AVG(safety), 2) AS avg_safety,
      ROUND(AVG(restrooms), 2) AS avg_restrooms,
      ROUND(AVG(parking), 2) AS avg_parking
    FROM reviews
    WHERE place_id = ${placeId}
    GROUP BY place_id
  `;

  if (rows.length === 0) return null;

  const row = rows[0];
  return {
    placeId: row.place_id,
    totalReviews: row.total_reviews,
    averageOverall: parseFloat(row.avg_overall),
    averageEquipment: parseFloat(row.avg_equipment),
    averageCleanliness: parseFloat(row.avg_cleanliness),
    averageShade: parseFloat(row.avg_shade),
    averageSafety: parseFloat(row.avg_safety),
    averageRestrooms: parseFloat(row.avg_restrooms),
    averageParking: parseFloat(row.avg_parking),
  };
}

export async function getAggregationsForPlaceIds(
  placeIds: string[]
): Promise<ReviewAggregation[]> {
  if (placeIds.length === 0) return [];

  const { rows } = await sql`
    SELECT
      place_id,
      COUNT(*)::int AS total_reviews,
      ROUND(AVG(overall), 2) AS avg_overall,
      ROUND(AVG(equipment), 2) AS avg_equipment,
      ROUND(AVG(cleanliness), 2) AS avg_cleanliness,
      ROUND(AVG(shade), 2) AS avg_shade,
      ROUND(AVG(safety), 2) AS avg_safety,
      ROUND(AVG(restrooms), 2) AS avg_restrooms,
      ROUND(AVG(parking), 2) AS avg_parking
    FROM reviews
    WHERE place_id = ANY(${placeIds})
    GROUP BY place_id
  `;

  return rows.map((row) => ({
    placeId: row.place_id,
    totalReviews: row.total_reviews,
    averageOverall: parseFloat(row.avg_overall),
    averageEquipment: parseFloat(row.avg_equipment),
    averageCleanliness: parseFloat(row.avg_cleanliness),
    averageShade: parseFloat(row.avg_shade),
    averageSafety: parseFloat(row.avg_safety),
    averageRestrooms: parseFloat(row.avg_restrooms),
    averageParking: parseFloat(row.avg_parking),
  }));
}

export async function createReview(
  review: Omit<Review, "id" | "createdAt">
): Promise<Review> {
  const { rows } = await sql`
    INSERT INTO reviews (
      place_id, overall, equipment, cleanliness, shade,
      safety, restrooms, parking, age_tags, review_text, reviewer_name
    ) VALUES (
      ${review.placeId}, ${review.overall}, ${review.equipment},
      ${review.cleanliness}, ${review.shade}, ${review.safety},
      ${review.restrooms}, ${review.parking}, ${review.ageTags},
      ${review.reviewText}, ${review.reviewerName}
    )
    RETURNING *
  `;

  const row = rows[0];
  return {
    id: row.id,
    placeId: row.place_id,
    overall: row.overall,
    equipment: row.equipment,
    cleanliness: row.cleanliness,
    shade: row.shade,
    safety: row.safety,
    restrooms: row.restrooms,
    parking: row.parking,
    ageTags: row.age_tags ?? [],
    reviewText: row.review_text,
    reviewerName: row.reviewer_name,
    createdAt: new Date(row.created_at),
  };
}
