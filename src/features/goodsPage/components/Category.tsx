// 상품페이지 메인화면 카테고리 컴포넌트
type CategoryProps = {
  imgSrc: string;
  label: string;
  onClick?: () => void;
};

export default function Category({ imgSrc, label, onClick }: CategoryProps) {
  return (
    <button
      type="button"
      className="flex flex-col items-center justify-center gap-1 pt-[6px]"
      onClick={onClick}
    >
      <div className="h-12 w-12 flex items-center justify-center">
        <img src={imgSrc} alt={label} />
      </div>
      <div className="text-[13px] font-Pretendard font-medium">{label}</div>
    </button>
  );
}
