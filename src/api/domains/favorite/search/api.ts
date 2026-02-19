import axiosInstance from "../../../axiosInstance";
import type {
  ApiResponse,
  RecentKeyword,
  RecentKeywordsResult,
  RecommendKeyword,
} from "./types";

export const getRecentKeywords = async (): Promise<RecentKeyword[]> => {
  const { data } = await axiosInstance.get<ApiResponse<RecentKeywordsResult>>(
    "/likes/search/recent",
  );

  if (!data.success) throw new Error(data.message);
  return data.result.keywords ?? [];
};

export const getRecommendKeywords = async (
  keyword: string,
  signal?: AbortSignal,
): Promise<RecommendKeyword[]> => {
  const { data } = await axiosInstance.get<ApiResponse<RecentKeywordsResult>>(
    "/likes/search/recommend",
    { params: { keyword }, signal },
  );

  if (!data.success) throw new Error(data.message);
  return data.result.keywords ?? [];
};

export const saveSearchKeyword = async (keyword: string) => {
  const { data } = await axiosInstance.post<ApiResponse<unknown>>(
    "/likes/search",
    { keyword },
  );

  if (!data.success) throw new Error(data.message);
};

export const deleteAllRecentKeywords = async () => {
  const { data } = await axiosInstance.delete<ApiResponse<unknown>>(
    "/likes/search/recent",
  );

  if (!data.success) throw new Error(data.message);
};

export const deleteRecentKeyword = async (keywordId: number) => {
  const { data } = await axiosInstance.delete<ApiResponse<unknown>>(
    `/likes/search/recent/${keywordId}`,
  );

  if (!data.success) throw new Error(data.message);
};
