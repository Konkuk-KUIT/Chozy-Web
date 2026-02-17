export type Reaction = "LIKE" | "DISLIKE" | "NONE";

export type FeedUser = {
  profileImg: string;
  userName: string;
  userId: string;
};

export type FeedCounts = {
  comments: number;
  likes: number;
  dislikes: number;
  quotes: number;
};

export type FeedMyState = {
  reaction: Reaction;
  isbookmarked: boolean;
  isreposted: boolean;
};

export type PostContent = {
  text: string;
  contentImgs: string[];
};

export type ReviewContentBase = {
  vendor: string;
  title: string;
  rating: number;
  text: string;
  contentImgs: string[];
};

export type QuotedReviewContent = ReviewContentBase & {
  user: FeedUser;
};

export type ReviewContent = ReviewContentBase & {
  quoteContent?: QuotedReviewContent;
};

export type FeedItemBase = {
  feedId: number;
  user: FeedUser;
  counts: FeedCounts;
  myState: FeedMyState;
};

export type FeedItem =
  | (FeedItemBase & { type: "POST"; content: PostContent })
  | (FeedItemBase & { type: "REVIEW"; content: ReviewContent });
