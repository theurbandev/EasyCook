export interface GarminWatch {
  id: string
  name: string
  series: string
  price: number
  priceRange: 'budget' | 'mid' | 'premium' | 'luxury'
  displayType: 'MIP' | 'AMOLED' | 'Transflective MIP'
  batteryLife: {
    smartwatch: number // days
    gpsMode: number   // hours
  }
  weight: number // grams
  bestFor: string[]
  keyFeatures: string[]
  sports: string[]
  waterRating: string
  affiliateUrl: string
}

export interface WatchRecommendation {
  watchId: string
  score: number
  reasoning: string
}

export interface RecommendationResult {
  recommendations: WatchRecommendation[]
  summary: string
  cached?: boolean
}
