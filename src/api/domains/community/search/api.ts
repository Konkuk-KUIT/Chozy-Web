import axiosInstance from "../../../axiosInstance";
import type {
  ApiResponse,
  SearchKeywordsResult,
  SearchProfile,
  RecentKeywordsResult,
  RecommendUsersResult,
  UserProfileResult,
  FeedsResult,
} from "./types";

// 자동완성: 검색어 추천
export const getSearchRecommendations = async (
  keyword: string,
): Promise<ApiResponse<SearchKeywordsResult>> => {
  const response = await axiosInstance.get("/community/searches/recommend", {
    params: { keyword },
  });
  return response.data;
};

// 프로필 검색 결과 조회
export const getProfileSearchResults = async (): Promise<
  ApiResponse<SearchProfile[]>
> => {
  const response = await axiosInstance.get("/community/searches/profile");
  return response.data;
};

// 프로필 방문 기록 저장
export const saveProfileVisit = async (
  profileId: number,
): Promise<ApiResponse<null>> => {
  const response = await axiosInstance.post("/community/searches/profile", {
    profileId,
  });
  return response.data;
};

// 최근 검색어 조회
export const getRecentSearchKeywords = async (): Promise<
  ApiResponse<RecentKeywordsResult>
> => {
  const response = await axiosInstance.get("/community/searches/recent");
  return response.data;
};

// 최근 검색어 개별 삭제
export const deleteRecentKeyword = async (
  keywordId: number,
): Promise<ApiResponse<null>> => {
  const response = await axiosInstance.delete(
    `/community/searches/recent/${keywordId}`,
  );
  return response.data;
};

// 최근 검색어 전체 삭제
export const deleteAllRecentKeywords = async (): Promise<ApiResponse<null>> => {
  const response = await axiosInstance.delete("/community/searches/recent");
  return response.data;
};

// 검색어 저장
export const saveSearchKeyword = async (
  keyword: string,
): Promise<ApiResponse<null>> => {
  const response = await axiosInstance.post("/community/searches", { keyword });
  return response.data;
};

// 게시글 검색 결과 조회
export const searchCommunityFeeds = async (params: {
  tab: "RECOMMEND" | "FOLLOWING";
  contentType: "ALL" | "POST" | "REVIEW";
  search: string;
}): Promise<ApiResponse<FeedsResult>> => {
  const response = await axiosInstance.get("/community/feeds", { params });
  return response.data;
};

// 아이디 자동완성: /community/searches/recommend/users?loginId=...
export const getRecommendUsers = async (
  loginId: string,
): Promise<ApiResponse<RecommendUsersResult>> => {
  const response = await axiosInstance.get(
    "/community/searches/recommend/users",
    { params: { loginId } },
  );
  return response.data;
};

//프로필 상세: /users/{targetUserId}/profile
export const getUserProfile = async (
  targetUserId: string,
): Promise<ApiResponse<UserProfileResult>> => {
  const response = await axiosInstance.get(`/users/${targetUserId}/profile`);
  return response.data;
};

// 최근 방문 프로필 개별 삭제 (API 명세 없음)
// export const deleteRecentProfile = async (profileId: number) => {
//   // TODO: 삭제 API 엔드포인트 확정 후 구현
// };

// 최근 방문 프로필 전체 삭제 (API 명세 없음)
// export const deleteAllRecentProfiles = async () => {
//   // TODO: 삭제 API 엔드포인트 확정 후 구현
// };
