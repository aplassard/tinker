export interface Playground {
  placeId: string;
  name: string;
  address: string;
  location: {
    lat: number;
    lng: number;
  };
  photoReference?: string;
  rating?: number;
  userRatingsTotal?: number;
}

export interface ReviewAggregation {
  placeId: string;
  totalReviews: number;
  averageOverall: number;
  averageEquipment: number;
  averageCleanliness: number;
  averageShade: number;
  averageSafety: number;
  averageRestrooms: number;
  averageParking: number;
}

export interface Review {
  id: number;
  placeId: string;
  overall: number;
  equipment: number;
  cleanliness: number;
  shade: number;
  safety: number;
  restrooms: number;
  parking: number;
  ageTags: string[];
  reviewText: string;
  reviewerName: string;
  createdAt: Date;
}
