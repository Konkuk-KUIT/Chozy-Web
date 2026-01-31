// 커뮤니티 홈화면 탭바
type TabKey = "reviews" | "bookmarks";

interface TabBarProps {
  value: TabKey;
  onChange: (value: TabKey) => void;
}

export default function TabBar({ value, onChange }: TabBarProps) {
  return (
    <div className="pt-4 w-full bg-white">
      <div className="grid grid-cols-2">
        <button
          type="button"
          onClick={() => onChange("reviews")}
          className={`h-[42px] text-[16px] border-b-1 p-[10px]
            ${
              value === "reviews"
                ? "text-[#800025] font-semibold border-[#800025]"
                : "text-[#B5B5B5] border-transparent"
            }`}
        >
          내 후기
        </button>
        <button
          type="button"
          onClick={() => onChange("bookmarks")}
          className={`h-[42px] text-[16px] border-b-1 p-[10px]
            ${
              value === "bookmarks"
                ? "text-[#800025] font-semibold border-[#800025]"
                : "text-[#B5B5B5] border-transparent"
            }`}
        >
          북마크
        </button>
      </div>
    </div>
  );
}
