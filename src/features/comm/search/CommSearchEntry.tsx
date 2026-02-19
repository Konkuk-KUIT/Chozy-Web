import { useEffect, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import SearchBar2 from "../../../components/SearchBar2";
import recentCancel from "../../../assets/goodsPage/search/recentsearch_cancel.svg";
import {
  getRecentSearchKeywords,
  getSearchRecommendations,
  deleteRecentKeyword,
  deleteAllRecentKeywords,
} from "../../../api/domains/community/search";
import type { SearchKeyword } from "../../../api/domains/community/search";
import RecentProfiles from "./components/RecentProfiles";

const SECTION_GAP_BG = "bg-[#F5F5F5]";

export default function CommSearchEntry() {
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [recentKeywords, setRecentKeywords] = useState<SearchKeyword[]>([]);
  const [recommendations, setRecommendations] = useState<SearchKeyword[]>([]);
  const [loadingKeywords, setLoadingKeywords] = useState(false);

  // 최근 검색어 조회
  const loadRecentKeywords = useCallback(async () => {
    try {
      const data = await getRecentSearchKeywords();
      if (data.code === 1000 && data.result?.keywords) {
        setRecentKeywords(data.result.keywords.slice(0, 10));
      } else {
        setRecentKeywords([]);
      }
    } catch {
      setRecentKeywords([]);
    }
  }, []);

  useEffect(() => {
    const id = window.setTimeout(() => {
      void loadRecentKeywords();
    }, 0);

    return () => window.clearTimeout(id);
  }, [loadRecentKeywords]);

  // 자동완성 검색어 조회
  useEffect(() => {
    if (!query.trim()) {
      setRecommendations([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoadingKeywords(true);
      try {
        const data = await getSearchRecommendations(query);
        if (data.code === 1000 && data.result?.keywords) {
          setRecommendations(data.result.keywords.slice(0, 6));
        } else {
          setRecommendations([]);
        }
      } catch {
        setRecommendations([]);
      } finally {
        setLoadingKeywords(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const runSearch = (keyword: string) => {
    const trimmed = keyword.trim();
    if (!trimmed) return;

    // TODO: 검색어 저장 API 연동 예정
    navigate(
      `/community/search/results?keyword=${encodeURIComponent(trimmed)}`,
    );
  };

  const onDeleteRecentKeyword = async (keywordId: number) => {
    const prev = recentKeywords;
    setRecentKeywords((curr) => curr.filter((k) => k.keywordId !== keywordId));

    try {
      await deleteRecentKeyword(keywordId);
    } catch {
      setRecentKeywords(prev);
    }
  };

  const onClearRecentKeywords = async () => {
    const prev = recentKeywords;
    setRecentKeywords([]);

    try {
      await deleteAllRecentKeywords();
    } catch {
      setRecentKeywords(prev);
    }
  };

  return (
    <div className="relative h-full flex flex-col bg-white w-full overflow-x-hidden">
      <SearchBar2
        autoFocus
        backBehavior="BACK"
        value={query}
        onChange={setQuery}
        onSubmitQuery={(q) => runSearch(q)}
      />

      <main className="flex-1 overflow-y-auto scrollbar-hide pt-[72px]">
        {/* 자동완성 추천 검색어 */}
        {query.trim() && recommendations.length > 0 && (
          <section className="bg-white px-4 py-3">
            <ul className="flex flex-col gap-2">
              {loadingKeywords ? (
                <li className="text-[14px] text-[#B9B9B9]">로딩중...</li>
              ) : (
                recommendations.map((k) => (
                  <li key={k.keywordId}>
                    <button
                      type="button"
                      onClick={() => runSearch(k.keyword)}
                      className="text-left text-[14px] text-[#191919] w-full py-1"
                    >
                      {k.keyword}
                    </button>
                  </li>
                ))
              )}
            </ul>
          </section>
        )}

        {/* 최근 방문 프로필 */}
        <RecentProfiles />

        {/* 최근 검색어 */}
        <section className="bg-white">
          <div className={`h-1 ${SECTION_GAP_BG}`} />
          <div className="px-4 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-[16px] font-bold text-[#191919]">
                최근 검색어
              </h2>
              {recentKeywords.length > 0 && (
                <button
                  type="button"
                  onClick={onClearRecentKeywords}
                  className="text-[12px] font-normal text-[#B5B5B5] underline"
                >
                  전체삭제
                </button>
              )}
            </div>
            <div className="mt-3">
              {recentKeywords.length === 0 ? (
                <p className="text-[14px] text-[#B5B5B5]">
                  검색 기록이 없어요.
                  <br />
                  다른 검색어를 입력해 볼까요?
                </p>
              ) : (
                <ul className="flex flex-col gap-3">
                  {recentKeywords.map((k) => (
                    <li
                      key={k.keywordId}
                      className="flex items-center justify-between"
                    >
                      <button
                        type="button"
                        className="text-left text-[14px] text-[#191919] flex-1"
                        onClick={() => runSearch(k.keyword)}
                      >
                        {k.keyword}
                      </button>
                      <button
                        type="button"
                        aria-label="최근 검색어 삭제"
                        onClick={() => onDeleteRecentKeyword(k.keywordId)}
                        className="w-6 h-6 flex items-center justify-center"
                      >
                        <img src={recentCancel} alt="삭제" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
