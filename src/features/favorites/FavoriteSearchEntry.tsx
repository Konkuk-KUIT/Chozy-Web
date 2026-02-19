import { useEffect, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";

import SearchBar2 from "../../components/SearchBar2";

import clueIcon from "../../assets/goodsPage/search/clue.svg";
import recentCancel from "../../assets/goodsPage/search/recentsearch_cancel.svg";

import {
  deleteAllRecentKeywords,
  deleteRecentKeyword,
  getRecommendKeywords,
  getRecentKeywords,
  saveSearchKeyword,
} from "../../api/domains/favorite/search";

import type {
  RecentKeyword,
  RecommendKeyword,
} from "../../api/domains/favorite/search";

const SECTION_GAP_BG = "bg-[#F5F5F5]";

function renderHighlighted(text: string, keyword: string) {
  const q = keyword.trim();
  if (!q) return text;

  const lowerText = text.toLowerCase();
  const lowerQ = q.toLowerCase();

  const ranges: Array<{ s: number; e: number }> = [];
  let from = 0;

  while (true) {
    const idx = lowerText.indexOf(lowerQ, from);
    if (idx === -1) break;
    ranges.push({ s: idx, e: idx + lowerQ.length });
    from = idx + lowerQ.length;
  }

  if (ranges.length === 0) return text;

  const nodes: React.ReactNode[] = [];
  let cursor = 0;

  ranges.forEach((r, i) => {
    if (cursor < r.s) {
      nodes.push(<span key={`pre-${i}`}>{text.slice(cursor, r.s)}</span>);
    }
    nodes.push(
      <span key={`hit-${i}`} className="text-[#800020] font-semibold">
        {text.slice(r.s, r.e)}
      </span>,
    );
    cursor = r.e;
  });

  if (cursor < text.length) {
    nodes.push(<span key="tail">{text.slice(cursor)}</span>);
  }

  return nodes;
}

export default function FavoriteSearchEntry() {
  const navigate = useNavigate();

  const [query, setQuery] = useState("");

  const [recentKeywords, setRecentKeywords] = useState<RecentKeyword[]>([]);
  const [recommends, setRecommends] = useState<RecommendKeyword[]>([]);

  const trimmed = query.trim();
  const isBlankOnly = query.length > 0 && trimmed.length === 0;

  const shouldShowAutocomplete = query.length >= 1 && !isBlankOnly;

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

  useEffect(() => {
    if (!shouldShowAutocomplete) return;

    const ac = new AbortController();

    const timer = window.setTimeout(() => {
      void (async () => {
        try {
          const list = await getRecommendKeywords(trimmed, ac.signal);
          if (!ac.signal.aborted) setRecommends(list.slice(0, 10));
        } catch {
          if (!ac.signal.aborted) setRecommends([]);
        }
      })();
    }, 200);

    return () => {
      window.clearTimeout(timer);
      ac.abort();
      setRecommends([]);
    };
  }, [trimmed, shouldShowAutocomplete]);

  const runSearch = async (rawKeyword: string) => {
    const keyword = rawKeyword.trim();
    if (!keyword) return;

    try {
      await saveSearchKeyword(keyword);
    } catch {
      // 저장 실패해도 검색은 진행
    }

    navigate(`/heart/search/results?keyword=${encodeURIComponent(keyword)}`);
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
          {recentKeywords.length > 0 && (
            <>
              <div className={`h-1 ${SECTION_GAP_BG}`} />
              <div className="px-4 py-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-[16px] font-bold text-[#191919]">
                    찜 최근 검색어
                  </h2>
                  <button
                    type="button"
                    onClick={onClearRecentKeywords}
                    className="text-[12px] font-normal text-[#B5B5B5] underline"
                  >
                    전체삭제
                  </button>
                </div>
                <div className="mt-3">
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
                </div>
              </div>
            </>
          )}
        </section>

        {shouldShowAutocomplete && (
          <div
            className="absolute inset-0 bg-white pt-[72px] z-40"
            onMouseDown={(e) => e.preventDefault()}
          >
            <div className="px-4 py-2">
              {recommends.length > 0 ? (
                recommends.slice(0, 10).map((item) => (
                  <button
                    key={item.keywordId}
                    type="button"
                    className="w-full h-[44px] flex items-center text-left gap-3"
                    onClick={() => runSearch(item.keyword)}
                  >
                    <img src={clueIcon} alt="" className="w-4 h-4 shrink-0" />
                    <span className="text-[16px] text-[#191919]">
                      {renderHighlighted(item.keyword, trimmed)}
                    </span>
                  </button>
                ))
              ) : (
                <div className="py-4 text-center text-[14px] text-[#B9B9B9]">
                  추천 검색어가 없습니다.
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
