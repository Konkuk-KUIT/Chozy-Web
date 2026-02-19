import { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { loginWithKakao } from "../../api/auth"; // 아까 만든 auth.ts 가져오기

export default function KakaoCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const hasRequested = useRef(false); // 중복 요청 방지
  const code = searchParams.get("code");

  useEffect(() => {
    if (code && !hasRequested.current) {
      hasRequested.current = true;

      loginWithKakao(code)
        .then((data) => {
          if (data.success && data.result) {
            localStorage.setItem("accessToken", data.result.accessToken);
            localStorage.setItem("refreshToken", data.result.refreshToken);

            // 성공 후 홈으로 이동 시 replace: true를 써서 뒤로가기 방지
            navigate("/", { replace: true });
          }
        })
        .catch(() => {
          navigate("/login");
        });
    }
  }, [code, navigate]);
  return (
    <div className="flex items-center justify-center min-h-screen">
      {/* 로그인 처리 중임을 알려주는 간단한 UI */}
      <div className="text-center">
        <p className="text-lg font-medium font-['Pretendard']">
          카카오 로그인 처리 중...
        </p>
      </div>
    </div>
  );
}
