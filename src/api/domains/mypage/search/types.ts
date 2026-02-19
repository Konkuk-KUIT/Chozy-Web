export type ApiResponse<T> = {
  success: boolean;
  message: string;
  result: T;
};

export type RecentKeyword = {
  keywordId: number;
  keyword: string;
};

export type RecentKeywordsResult = {
  keywords: RecentKeyword[];
};
