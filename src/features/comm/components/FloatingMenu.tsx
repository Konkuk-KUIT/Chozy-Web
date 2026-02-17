// 커뮤니티 플로팅 버튼 작성 컴포넌트
import React from "react";
import { useNavigate } from "react-router-dom";
import reviewIcon from "../../../assets/community/review.svg";
import postIcon from "../../../assets/community/post.svg";

interface FloatingMenuProps {
  isOpen: boolean;
}

const FloatingMenu: React.FC<FloatingMenuProps> = ({ isOpen }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleWriteReview = () => navigate("/review-write");
  const handleWritePost = () => navigate("/community/post-write");

  const MenuItem = ({
    label,
    onClick,
    icon,
  }: {
    label: string;
    onClick: () => void;
    icon: string;
  }) => (
    <div className="flex items-center justify-end gap-2">
      <span className="text-white text-base font-medium font-['Pretendard'] leading-4">
        {label}
      </span>
      <button
        onClick={onClick}
        className="w-10 h-10 rounded-full bg-rose-900 flex items-center justify-center shadow-md transition-transform active:scale-95"
      >
        <img src={icon} alt={label} className="w-full h-full" />
      </button>
    </div>
  );

  return (
    <div className="fixed bottom-30 left-1/2 -translate-x-1/2 w-[min(100vw,calc(100dvh*9/16))] flex flex-col gap-2 z-50 items-end pr-4">
      <MenuItem
        label="사담 작성하기"
        onClick={handleWritePost}
        icon={postIcon}
      />
      <MenuItem
        label="리뷰 작성하기"
        onClick={handleWriteReview}
        icon={reviewIcon}
      />
    </div>
  );
};

export default FloatingMenu;
