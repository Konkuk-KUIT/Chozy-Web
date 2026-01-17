// 커뮤니티 홈화면 탭바
type TabKey = "RECOMMEND" | "FOLLOWING";

interface TabBarProps {
  value: TabKey;
  onChange: (value: TabKey) => void;
}

export default function TabBar({ value, onChange }: TabBarProps) {
  return (
    <div className="pt-12 w-full bg-white">
      <div className="grid grid-cols-2">
        <button
          type="button"
          onClick={() => onChange("RECOMMEND")}
          className={`h-[42px] text-[16px] border-b-1 p-[10px]
            ${
              value === "RECOMMEND"
                ? "text-[#66021F] font-semibold border-[#66021F]"
                : "text-[#B5B5B5] border-transparent"
            }`}
        >
          추천
        </button>
        <button
          type="button"
          onClick={() => onChange("FOLLOWING")}
          className={`h-[42px] text-[16px] border-b-1 p-[10px]
            ${
              value === "FOLLOWING"
                ? "text-[#66021F] font-semibold border-[#66021F]"
                : "text-[#B5B5B5] border-transparent"
            }`}
        >
          팔로우 중
        </button>
      </div>
    </div>
  );
}
