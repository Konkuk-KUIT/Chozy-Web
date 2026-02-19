import { useEffect, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";

import SearchBar2 from "../../components/SearchBar2";
import recentCancel from "../../assets/goodsPage/search/recentsearch_cancel.svg";

import {
  deleteAllRecentKeywords,
  deleteRecentKeyword,
  getRecentKeywords,
  saveSearchKeyword,
} from "../../api/domains/mypage/search";

import type { RecentKeyword } from "../../api/domains/mypage/search";

const SECTION_GAP_BG = "bg-[#F5F5F5]";

export default function MyPageSearchEntry() {
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [recentKeywords, setRecentKeywords] = useState<RecentKeyword[]>([]);

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

  const loadRecentKeywords = useCallback(async () => {
    try {
      const keywords = await getRecentKeywords();
      setRecentKeywords(keywords.slice(0, 10));
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

  const runSearch = async (rawKeyword: string) => {
    const keyword = rawKeyword.trim();
    if (!keyword) return;

    try {
      await saveSearchKeyword(keyword);
    } catch {
      // 저장 실패해도 검색은 진행
    }

    navigate(`/mypage/search/results?keyword=${encodeURIComponent(keyword)}`);
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
                <p className="text-[14px] text-[#B9B9B9]">
                  검색 내역이 없어요.
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
