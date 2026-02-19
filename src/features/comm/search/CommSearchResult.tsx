import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import SearchBar2 from "../../../components/SearchBar2";
import FilterToggle, { type ToggleOption } from "../components/FilterToggle";
import type { FeedItem } from "../../../api/domains/community/search";

import {
  getRecommendUsers,
  getUserProfile,
  searchCommunityFeeds,
  saveSearchKeyword,
} from "../../../api/domains/community/search";

const OPTIONS: ToggleOption[] = [
  { key: "ALL", label: "전체" },
  { key: "POST", label: "본문" },
  { key: "GOODS", label: "제품명" },
];

type UiFilter = "ALL" | "POST" | "GOODS";
type ApiContentType = "ALL" | "POST" | "REVIEW";

type ProfileSearchItem = {
  targetUserId: string;
  nickname: string;
  profileImageUrl?: string | null;
};

export default function CommSearchResult() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("keyword") ?? "";

  const [query, setQuery] = useState(keyword);
  const [selected, setSelected] = useState<string[]>(["ALL", "POST", "GOODS"]);

  const contentType: ApiContentType = useMemo(() => {
    // 지금 필터 API 없다고 했으니 "단일 선택일 때만 반영", 아니면 ALL 처리
    const onlyOne = selected.length === 1 ? (selected[0] as UiFilter) : "ALL";
    if (onlyOne === "GOODS") return "REVIEW";
    return onlyOne; // ALL | POST
  }, [selected]);

  const [profileResults, setProfileResults] = useState<ProfileSearchItem[]>([]);
  const [postResults, setPostResults] = useState<FeedItem[]>([]);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPost, setLoadingPost] = useState(false);

  useEffect(() => {
    setQuery(keyword);
  }, [keyword]);

  const runSearch = (q: string) => {
    const trimmed = q.trim();
    if (!trimmed) return;

    // 검색어 저장(실패해도 검색 진행)
    void saveSearchKeyword(trimmed).catch(() => {});

    navigate(
      `/community/search/results?keyword=${encodeURIComponent(trimmed)}`,
    );
  };

  useEffect(() => {
    const k = keyword.trim();
    if (!k) {
      setProfileResults([]);
      setPostResults([]);
      return;
    }

    // 프로필 검색(현재 제공된 명세 중 "검색 리스트"가 없어서 아이디 자동완성(recommend/users) 결과를 "프로필 검색 결과"로 사용
    const loadProfiles = async () => {
      setLoadingProfile(true);
      try {
        const rec = await getRecommendUsers(k);
        const users = rec.code === 1000 ? (rec.result?.users ?? []) : [];

        // userId가 오면 그걸 targetUserId로 쓰고, 없으면 loginId를 fallback
        const ids = users
          .map((u) => (u.userId ?? u.loginId ?? "").trim())
          .filter(Boolean)
          .slice(0, 5); 

        // /users/{targetUserId}/profile 로 상세를 땡겨서 nickname/profileImageUrl 확보
        const details = await Promise.all(
          ids.map(async (id) => {
            try {
              const d = await getUserProfile(id);
              if (d.code !== 1000) return null;
              return {
                targetUserId: id,
                nickname: d.result.nickname,
                profileImageUrl: d.result.profileImageUrl,
              } as ProfileSearchItem;
            } catch {
              return null;
            }
          }),
        );

        setProfileResults(details.filter(Boolean) as ProfileSearchItem[]);
      } catch {
        setProfileResults([]);
      } finally {
        setLoadingProfile(false);
      }
    };

    //게시글 검색 결과
    const loadPosts = async () => {
      setLoadingPost(true);
      try {
        const res = await searchCommunityFeeds({
          tab: "RECOMMEND",
          contentType,
          search: k,
        });
        if (res.code === 1000) {
          setPostResults(res.result?.feeds ?? []);
        } else {
          setPostResults([]);
        }
      } catch {
        setPostResults([]);
      } finally {
        setLoadingPost(false);
      }
    };

    void loadProfiles();
    void loadPosts();
  }, [keyword, contentType]);

  return (
    <div className="h-full flex flex-col bg-white w-full overflow-x-hidden">
      <div className="relative pt-[72px]">
        <SearchBar2
          autoFocus={false}
          backBehavior="BACK"
          value={query}
          onChange={setQuery}
          onSubmitQuery={(q) => runSearch(q)}
        />
        <FilterToggle
          options={OPTIONS}
          value={selected}
          onChange={setSelected}
          className="px-4 py-[9px]"
        />
      </div>

      <main className="flex-1 overflow-y-auto scrollbar-hide">
        <>
          {/* 프로필 결과 */}
          <section className="bg-white border-b border-[#F0F0F0]">
            <div className="px-4 py-4">
              <h2 className="text-[16px] font-bold text-[#191919] mb-4">
                프로필
              </h2>

              {loadingProfile ? (
                <p className="text-[14px] text-[#B5B5B5]">로딩중...</p>
              ) : profileResults.length === 0 ? (
                <p className="text-[14px] text-[#B5B5B5]">
                  검색 결과가 없어요.
                </p>
              ) : (
                <ul className="flex flex-col gap-3">
                  {profileResults.map((p) => (
                    <li key={p.targetUserId}>
                      <button
                        type="button"
                        className="w-full flex items-center gap-3"
                        onClick={() =>
                          navigate(`/community/user/${p.targetUserId}`)
                        }
                      >
                        <div className="w-10 h-10 rounded-full bg-[#EDEDED] overflow-hidden flex-shrink-0">
                          {p.profileImageUrl ? (
                            <img
                              src={p.profileImageUrl}
                              alt={p.nickname}
                              className="w-full h-full object-cover"
                            />
                          ) : null}
                        </div>
                        <div className="text-[14px] text-[#191919] font-medium">
                          {p.nickname}
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>

          {/* 게시글 결과 */}
          <section className="bg-white">
            <div className="px-4 py-4">
              <h2 className="text-[16px] font-bold text-[#191919] mb-4">
                게시글
              </h2>

              {loadingPost ? (
                <p className="text-[14px] text-[#B5B5B5]">로딩중...</p>
              ) : postResults.length === 0 ? (
                <p className="text-[14px] text-[#B5B5B5]">
                  검색 결과가 없어요.
                </p>
              ) : (
                <ul className="flex flex-col gap-3">
                  {postResults.map((f) => (
                    <li
                      key={f.feedId}
                      className="py-3 border-b border-[#F0F0F0]"
                    >
                      <div className="text-[13px] text-[#191919] font-medium">
                        {f.user?.name ?? "사용자"}
                      </div>
                      <div className="mt-1 text-[14px] text-[#191919]">
                        {f.contents?.text ?? ""}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        </>
      </main>
    </div>
  );
}