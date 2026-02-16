export type MyProfile = {
  loginId: string;
  nickname: string;
  profileImageUrl: string | null;
  backgroundImageUrl: string | null;
  statusMessage: string;
  isAccountPublic: boolean;
  birthDate: string;
  heightCm: number;
  weightKg: number;
  isBirthPublic: boolean;
  isHeightPublic: boolean;
  isWeightPublic: boolean;
  followerCount: number;
  followingCount: number;
  reviewCount: number;
  bookmarkCount: number;
};
