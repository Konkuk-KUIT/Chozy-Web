// 커뮤니티 검색용 타입 정의

export interface ApiResponse<T> {
  isSuccess: boolean;
  code: number;
  message: string;
  timestamp: string;
  result: T;
}

// 자동완성 관련
export interface SearchKeyword {
  keywordId: number;
  keyword: string;
}

export interface RecommendUser {
  userId?: string; 
  loginId?: string; 
  nickname?: string;
  profileImageUrl?: string | null;
}

export interface RecommendUsersResult {
  users: RecommendUser[];
}

export interface SearchKeywordsResult {
  keywords: SearchKeyword[];
}

// 프로필 관련
export interface SearchProfile {
  profileId: number;
  nickname: string;
  profileImageUrl: string;
}

// 최근 검색어 결과
export interface RecentKeywordsResult {
  keywords: SearchKeyword[];
}

// /users/{targetUserId}/profile 응답
export interface UserProfileResult {
  nickname: string;
  profileImageUrl: string;
  backgroundImageUrl: string;
  statusMessage: string;
  isAccountPublic: boolean;
  birthDate?: string;
  heightCm?: number;
  weightKg?: number;
  isBirthPublic: boolean;
  isHeightPublic: boolean;
  isWeightPublic: boolean;
  followerCount: number;
  followingCount: number;
  reviewCount: number;
  bookmarkCount: number;
}

// /community/feeds 응답 result
export interface FeedItem {
  feedId: number;
  contentType: "POST" | "REVIEW";
  user: { name: string; userId: string; profileImageUrl: string };
  contents: { text: string };
  createdAt: string;
}

export interface FeedsResult {
  feeds: FeedItem[];
  hasNext: boolean;
  nextCursor: string | null;
}