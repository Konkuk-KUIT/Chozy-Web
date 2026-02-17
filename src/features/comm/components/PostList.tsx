import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import StarRating from "./StarRating";
import ShareBottomSheet from "./ShareBottomSheet";

import comment from "../../../assets/community/comment.svg";
import quotation from "../../../assets/community/quotation.svg";
import goodOn from "../../../assets/community/good-on.svg";
import goodOff from "../../../assets/community/good-off.svg";
import badOn from "../../../assets/community/bad-on.svg";
import badOff from "../../../assets/community/bad-off.svg";
import bookmarkOn from "../../../assets/community/bookmark-on.svg";
import bookmarkOff from "../../../assets/community/bookmark-off.svg";
import share from "../../../assets/community/repost.svg";
import load from "../../../assets/community/loading.svg";

import { toUiFeedItem } from "../../../api/domains/mypage/mapper";

type ContentType = "ALL" | "POST" | "REVIEW";
type Reaction = "LIKE" | "DISLIKE" | "NONE";
type EmptyVariant = "community" | "mypage";

type PostListProps = {
  contentType: ContentType;
  fetchFeeds: () => Promise<{ code: number; result: { feeds: any[] } }>;
  emptyVariant?: EmptyVariant;
  emptyText?: string;
};

type ApiResponse<T> = {
  isSuccess: boolean;
  code: number;
  message: string;
  timestamp: string;
  result: T;
};

/**
 * ===== UI(기존 컴포넌트가 기대하는) 타입들 =====
 * - 서버 응답을 그대로 쓰지 않고, 아래 UI 타입으로 매핑해서 기존 렌더 코드를 최대한 유지함
 */
type FeedUser = {
  profileImg: string;
  userName: string;
  userId: string;
};

type FeedCounts = {
  comments: number;
  likes: number;
  dislikes: number;
  quotes: number;
};

type FeedMyState = {
  reaction: Reaction;
  isbookmarked: boolean;
  isreposted: boolean;
};

type PostContent = {
  text: string;
  contentImgs: string[];
};

type ReviewContentBase = {
  vendor: string;
  title: string;
  rating: number;
  text: string;
  contentImgs: string[];
};

type QuotedReviewContent = ReviewContentBase & {
  user: FeedUser;
};

type ReviewContent = ReviewContentBase & {
  quoteContent?: QuotedReviewContent;
};

type FeedItemBase = {
  feedId: number;
  user: FeedUser;
  counts: FeedCounts;
  myState: FeedMyState;
};

type LikeToggleResult = {
  feedId: number;
  reaction: Reaction;
  counts: { likes: number; dislikes: number };
};

type BookmarkToggleResult = {
  feedId: number;
  isBookmarked: boolean;
};

export type FeedItem =
  | (FeedItemBase & { type: "POST"; content: PostContent })
  | (FeedItemBase & { type: "REVIEW"; content: ReviewContent });

function hasQuoteContent(
  c: PostContent | ReviewContent,
): c is ReviewContent & { quoteContent: QuotedReviewContent } {
  return "quoteContent" in c && !!(c as any).quoteContent;
}

export default function PostList({
  contentType,
  fetchFeeds,
  emptyVariant,
  emptyText,
}: PostListProps) {
  const navigate = useNavigate();

  const [items, setItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(false);

  // 공유
  const [shareOpen, setShareOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  // const hasToken = useMemo(
  //   () => !!localStorage.getItem("accessToken"),
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  //   [],
  // );

  const isMobile = () => /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  const buildShareUrl = (feedId: number) => {
    // 배포 링크 고정(원하면 window.location.origin로 변경 가능)
    return `https://chozy.net/community/feeds/${feedId}`;
  };

  const handleShare = async (feedId: number) => {
    const url = buildShareUrl(feedId);

    // ✅ 폰 + Web Share 지원이면 -> OS 공유 시트
    if (isMobile() && navigator.share) {
      try {
        await navigator.share({
          title: "Chozy",
          text: "게시글 공유",
          url,
        });
        return;
      } catch (e) {
        // 취소해도 정상 흐름
        console.log("share cancelled/failed:", e);
        return;
      }
    }

    // ✅ PC(또는 미지원) -> 바텀시트(링크복사)
    setShareUrl(url);
    setShareOpen(true);
  };

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);

        const data = await fetchFeeds();

        if (data.code !== 1000) {
          setItems([]);
          return;
        }

        const result = data.result;
        const nextItems = (result.feeds ?? []).map(toUiFeedItem);
        setItems(nextItems);
      } catch (e) {
        console.error(e);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [fetchFeeds]);

  // 게시글 좋아요/싫어요 토글
  const handleToggleReaction = async (feedId: number, like: boolean) => {
    // 비로그인이라면 로그인 유도
    if (!localStorage.getItem("accessToken")) {
      navigate("/login");
      return;
    }

    try {
      const res = await fetch(`/community/feeds/${feedId}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ like }),
      });

      if (res.status === 401) {
        navigate("/login");
        return;
      }
      if (!res.ok) throw new Error("toggle reaction failed");

      const data: ApiResponse<LikeToggleResult> = await res.json();
      if (data.code !== 1000) throw new Error(data.message);

      setItems((prev) =>
        prev.map((it) =>
          it.feedId !== feedId
            ? it
            : {
                ...it,
                counts: {
                  ...it.counts,
                  likes: data.result.counts.likes,
                  dislikes: data.result.counts.dislikes,
                },
                myState: {
                  ...it.myState,
                  reaction: data.result.reaction,
                },
              },
        ),
      );
    } catch (e) {
      console.error(e);
    }
  };

  // 게시글 북마크 토글
  const handleToggleBookmark = async (feedId: number, current: boolean) => {
    // 비로그인이라면 로그인 유도
    if (!localStorage.getItem("accessToken")) {
      navigate("/login");
      return;
    }

    const nextValue = !current;

    try {
      const res = await fetch(`/community/feeds/${feedId}/bookmark`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookmark: nextValue }),
      });

      if (res.status === 401) {
        navigate("/login");
        return;
      }
      if (!res.ok) throw new Error("toggle bookmark failed");

      const data: ApiResponse<BookmarkToggleResult> = await res.json();
      if (data.code !== 1000) throw new Error(data.message);

      setItems((prev) =>
        prev.map((it) =>
          it.feedId !== feedId
            ? it
            : {
                ...it,
                myState: {
                  ...it.myState,
                  isbookmarked: data.result.isBookmarked,
                },
              },
        ),
      );
    } catch (e) {
      console.error(e);
    }
  };

  // NOTE: 서버가 contentType 필터링을 이미 해줄 수 있지만,
  // UI에서 한 번 더 안전하게 필터링
  const filteredItems = items.filter((item) => {
    if (contentType === "ALL") return true;
    return item.type === contentType;
  });

  if (loading) return <div className="px-4 py-3">로딩중...</div>;

  if (!loading && filteredItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-40">
        {emptyVariant === "community" && <img src={load} alt="empty" />}

        <p
          className={
            emptyVariant === "community"
              ? "mt-6 text-[#787878] text-[16px] font-medium text-center leading-normal whitespace-pre-line"
              : "mt-10 text-[#B5B5B5] text-[16px] font-medium text-center leading-normal whitespace-pre-line"
          }
        >
          {emptyText ?? "목록이 없어요."}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-1">
        {filteredItems.map((item) => (
          <div
            key={item.feedId}
            role="button"
            onClick={() => navigate(`/community/feeds/${item.feedId}`)}
            className="px-[8px] py-3 bg-white"
          >
            {/* 프로필 */}
            <div className="flex flex-row gap-[8px] mb-[8px]">
              <img
                src={item.user.profileImg}
                alt="프로필"
                className="w-10 h-10 rounded-[40px] border border-[#F9F9F9]"
              />
              <div className="flex flex-col gap-[2px]">
                <span className="text-[#191919] text-[14px] font-medium">
                  {item.user.userName}
                </span>
                <span className="text-[#B5B5B5] text-[12px]">
                  @{item.user.userId}
                </span>
              </div>
            </div>

            {/* 리뷰일 때만 */}
            {item.type === "REVIEW" && (
              <div className="mb-3">
                <div className="flex flex-row gap-1 mb-1">
                  <span className="text-[#800025] text-[16px] font-semibold">
                    {item.content.vendor}
                  </span>
                  <span className="text-[#191919] text-[16px] font-medium">
                    {item.content.title}
                  </span>
                </div>
                <div className="flex flex-row gap-1">
                  <StarRating rating={item.content.rating} />
                  <span className="text-[#B5B5B5] text-[13px]">
                    {item.content.rating.toFixed(1)}
                  </span>
                </div>
              </div>
            )}

            {/* 본문 */}
            <div className="flex flex-col gap-3">
              <div className="text-[14px] line-clamp-3 whitespace-pre-line">
                {item.content.text}
              </div>
              {!!(item.content.contentImgs ?? []).filter(Boolean).length && (
                <div className="mt-3 flex gap-[2px] overflow-x-auto scrollbar-hide">
                  {(item.content.contentImgs ?? [])
                    .filter(Boolean)
                    .map((imgString, index) => (
                      <img key={index} src={imgString} alt="게시글이미지" />
                    ))}
                </div>
              )}
            </div>

            {/* 인용 글일 경우 */}
            {hasQuoteContent(item.content) && (
              <div className="mt-5 rounded-[4px] border border-[#DADADA] px-[8px] py-3">
                <div className="flex flex-row gap-[8px] mb-[8px]">
                  <img
                    src={item.content.quoteContent.user.profileImg}
                    alt="인용 프로필"
                    className="w-8 h-8 rounded-full border border-[#F9F9F9]"
                  />
                  <div className="flex flex-col gap-[2px]">
                    <span className="text-[#191919] text-[13px] font-medium">
                      {item.content.quoteContent.user.userName}
                    </span>
                    <span className="text-[#B5B5B5] text-[11px]">
                      @{item.content.quoteContent.user.userId}
                    </span>
                  </div>
                </div>

                <div className="flex flex-row gap-1 mb-1">
                  <span className="text-[#800025] text-[16px] font-semibold">
                    {item.content.quoteContent.vendor}
                  </span>
                  <span className="text-[#191919] text-[16px] font-medium">
                    {item.content.quoteContent.title}
                  </span>
                </div>

                <div className="flex flex-row gap-1">
                  <StarRating rating={item.content.quoteContent.rating} />
                  <span className="text-[#B5B5B5] text-[13px]">
                    {item.content.quoteContent.rating.toFixed(1)}
                  </span>
                </div>

                <p className="text-[14px] line-clamp-4 whitespace-pre-line mt-2">
                  {item.content.quoteContent.text}
                </p>

                {!!item.content.quoteContent.contentImgs?.filter(Boolean)
                  .length && (
                  <div className="mt-3 flex gap-[2px] overflow-x-auto scrollbar-hide">
                    {item.content.quoteContent.contentImgs
                      .filter(Boolean)
                      .map((src, idx) => (
                        <img
                          key={idx}
                          src={src}
                          alt="인용 이미지"
                          className="w-full aspect-square rounded-[4px] object-cover"
                        />
                      ))}
                  </div>
                )}
              </div>
            )}

            {/* 포스트 상태바 */}
            <div className="pl-1 flex items-center justify-between mt-5">
              <div className="flex gap-3">
                {/* 댓글 */}
                <button
                  type="button"
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-[3px] leading-none"
                >
                  <span className="w-6 h-6 flex items-center justify-center shrink-0">
                    <img src={comment} alt="댓글수" className="w-6 h-6 block" />
                  </span>
                  <span className="text-[13px] leading-none">
                    {item.counts.comments}
                  </span>
                </button>

                {/* 인용 */}
                <button
                  type="button"
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-[3px] leading-none"
                >
                  <span className="w-6 h-6 flex items-center justify-center shrink-0">
                    <img
                      src={quotation}
                      alt="인용수"
                      className="w-6 h-6 block"
                    />
                  </span>
                  <span className="text-[13px] leading-none">
                    {item.counts.quotes}
                  </span>
                </button>

                {/* 좋아요 */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleReaction(item.feedId, true);
                  }}
                  className="flex items-center gap-[3px] leading-none"
                >
                  <span className="w-6 h-6 flex items-center justify-center shrink-0 pb-[5px] pl-1 pr-[3px]">
                    <img
                      src={item.myState.reaction === "LIKE" ? goodOn : goodOff}
                      alt="좋아요수"
                      className="w-6 h-6 block"
                    />
                  </span>
                  <span className="text-[13px] leading-none">
                    {item.counts.likes}
                  </span>
                </button>

                {/* 싫어요 */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleReaction(item.feedId, false);
                  }}
                  className="flex items-center gap-[3px] leading-none"
                >
                  <span className="w-6 h-6 flex items-center justify-center shrink-0 pt-[5px] pl-1 pr-[3px]">
                    <img
                      src={item.myState.reaction === "DISLIKE" ? badOn : badOff}
                      alt="싫어요수"
                      className="w-6 h-6 block"
                    />
                  </span>
                  <span className="text-[13px] leading-none">
                    {item.counts.dislikes}
                  </span>
                </button>
              </div>

              {/* 북마크 + 공유 */}
              <div className="flex gap-[8px]">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleBookmark(
                      item.feedId,
                      item.myState.isbookmarked,
                    );
                  }}
                  className="w-6 h-6 flex items-center justify-center shrink-0"
                >
                  <img
                    src={item.myState.isbookmarked ? bookmarkOn : bookmarkOff}
                    alt="북마크"
                    className="w-6 h-6 block"
                  />
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleShare(item.feedId);
                  }}
                  className="w-6 h-6 flex items-center justify-center shrink-0"
                >
                  <img src={share} alt="공유" className="w-6 h-6 block" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ShareBottomSheet
        open={shareOpen}
        onOpenChange={setShareOpen}
        shareUrl={shareUrl}
      />
    </>
  );
}
