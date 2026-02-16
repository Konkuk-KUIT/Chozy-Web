// 로그인 API 연동 전 다른 기능 테스트 위한 토큰 발급
const DEV_FALLBACK_TOKEN = import.meta.env.VITE_DEV_ACCESS_TOKEN as
  | string
  | undefined;

export function getAccessToken(): string | null {
  // 1) 최종: 로그인 연동 후 여기에 저장된 토큰
  const ls = localStorage.getItem("accessToken");
  if (ls) return ls;

  // 2) 임시: 개발용 env 토큰
  if (DEV_FALLBACK_TOKEN) return DEV_FALLBACK_TOKEN;

  return null;
}

export function getTokenType(): string {
  return localStorage.getItem("tokenType") ?? "Bearer";
}
