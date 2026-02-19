export type ApiResponse<T> = {
  code: number;
  message: string;
  timestamp: string;
  result: T;
  success: boolean;
};

export type RecentKeyword = {
  keywordId: number;
  keyword: string;
};

export type RecentKeywordsResult = {
  keywords: RecentKeyword[];
};

export type RecommendKeyword = {
  keywordId: number;
  keyword: string;
};

export type LikeItem = {
  productId: number;
  name: string;
  originalPrice: number;
  discountRate: number;
  imageUrl: string;
  productUrl: string;
  rating: number;
  reviewCount: number;
  deliveryFee: number;
  status: boolean;
};
