import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import dummyProfile from "../../../../assets/all/dummyProfile.svg";
import recentCancel from "../../../../assets/goodsPage/search/recentsearch_cancel.svg";
import type { SearchProfile } from "../../../../api/domains/community/search";
import { getProfileSearchResults } from "../../../../api/domains/community/search";

export default function RecentProfiles() {
  const navigate = useNavigate();

  const [profiles, setProfiles] = useState<SearchProfile[]>([]);
  const [loading, setLoading] = useState(false);

  const loadProfiles = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getProfileSearchResults();
      if (data.code === 1000) {
        setProfiles(Array.isArray(data.result) ? data.result : []);
      } else {
        setProfiles([]);
      }
    } catch {
      setProfiles([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const id = window.setTimeout(() => {
      void loadProfiles();
    }, 0);

    return () => window.clearTimeout(id);
  }, [loadProfiles]);

  const handleProfileClick = async (profileId: number) => {
    // TODO: 프로필 방문 기록 저장 API 연동 예정
    // await saveProfileVisit(profileId);
    navigate(`/community/user/${profileId}`);
  };

  const handleDeleteProfile = (profileId: number) => {
    // TODO: 최근 방문 프로필 개별 삭제 API 연동 예정
    setProfiles((prev) => prev.filter((p) => p.profileId !== profileId));
  };

  const handleClearAll = () => {
    // TODO: 최근 방문 프로필 전체 삭제 API 연동 예정
    setProfiles([]);
  };

  return (
    <section className="bg-white">
      <div className="h-1 bg-[#F5F5F5]" />
      <div className="px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[16px] font-bold text-[#191919]">
            최근 방문 프로필
          </h2>
          {profiles.length > 0 && (
            <button
              type="button"
              onClick={handleClearAll}
              className="text-[12px] font-normal text-[#B5B5B5] underline"
            >
              전체삭제
            </button>
          )}
        </div>

        {loading ? (
          <p className="text-[14px] text-[#B9B9B9]">로딩중...</p>
        ) : profiles.length === 0 ? (
          <p className="text-[14px] text-[#B5B5B5]">
            최근 방문한 내역이 없어요.
            <br />
            주변 친구들을 검색해볼까요?
          </p>
        ) : (
          <div className="flex gap-3 overflow-x-auto scrollbar-hide">
            {profiles.map((profile) => (
              <div
                key={profile.profileId}
                className="flex flex-col items-center gap-2 flex-shrink-0"
              >
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => handleProfileClick(profile.profileId)}
                    className="w-14 h-14 rounded-full border border-[#F9F9F9] overflow-hidden flex-shrink-0"
                  >
                    <img
                      src={profile.profileImageUrl || dummyProfile}
                      alt={profile.nickname}
                      className="w-full h-full object-cover"
                    />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteProfile(profile.profileId)}
                    aria-label="최근 방문 프로필 삭제"
                    className="absolute top-0 right-0 w-5 h-5 flex items-center justify-center bg-white rounded-full"
                  >
                    <img src={recentCancel} alt="삭제" className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-[12px] text-[#191919] max-w-[56px] truncate text-center">
                  {profile.nickname}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
