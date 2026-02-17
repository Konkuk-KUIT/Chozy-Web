import type { FeedItem as ServerFeedItem } from "../community/feedList";
import type { FeedItem as UiFeedItem } from "../community/feedList/feedUi"; // PostList UI 타입(아래 설명 참고)
import dummyProfile from "../../../assets/all/dummyProfile.svg";

const DEFAULT_MY_STATE = {
  reaction: "NONE" as const,
  isbookmarked: false,
  isreposted: false,
};

export function toUiFeedItem(s: ServerFeedItem): UiFeedItem {
  const contentImgs = (s.contents.images ?? [])
    .map((img) => img.imageUrl)
    .filter(Boolean);

  // 서버 myState -> UI myState
  const uiMyState = s.myState
    ? {
        reaction: s.myState.reactionType,
        isbookmarked: s.myState.bookmarked,
        isreposted: s.myState.reposted,
      }
    : DEFAULT_MY_STATE;

  // UI 공통 베이스
  const uiBase = {
    feedId: s.feedId,
    isMine: s.mine ?? false,
    user: {
      profileImg: s.user.profileImageUrl ?? dummyProfile,
      userName: s.user.name,
      userId: s.user.userId,
    },
    counts: {
      comments: s.counts.commentCount,
      likes: s.counts.likeCount,
      dislikes: s.counts.dislikeCount,
      quotes: s.counts.quoteCount,
    },
    myState: uiMyState,
  } as const;

  // POST
  if (s.contentType === "POST") {
    return {
      ...uiBase,
      type: "POST",
      content: {
        text: s.contents.text ?? "",
        contentImgs,
      },
    };
  }

  // REVIEW
  const review = s.contents.review ?? null;

  const quote = s.kind === "QUOTE" ? s.contents.quote : null;

  return {
    ...uiBase,
    type: "REVIEW",
    content: {
      vendor: review?.vendor ?? "",
      title: review?.title ?? "",
      rating: review?.rating ?? 0,
      text: s.contents.text ?? "",
      contentImgs,

      ...(quote
        ? {
            quoteContent: {
              vendor: review?.vendor ?? "",
              title: review?.title ?? "",
              rating: review?.rating ?? 0,
              text: quote.text ?? "",
              contentImgs: [],
              user: {
                profileImg: quote.user.profileImageUrl ?? "",
                userName: quote.user.name,
                userId: quote.user.userId,
              },
            },
          }
        : {}),
    },
  };
}
