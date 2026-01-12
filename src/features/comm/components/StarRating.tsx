import starOn from "../../../assets/community/star-on.svg";
import starOff from "../../../assets/community/star-off.svg";

type Props = {
  rating: number; // 1.0 ~ 5.0
};

export default function StarRating({ rating }: Props) {
  const filledCount = Math.floor(rating); // 3.0 -> 3
  const emptyCount = 5 - filledCount;

  return (
    <div className="flex items-center gap-[2px]">
      {Array.from({ length: filledCount }).map((_, i) => (
        <img
          key={`on-${i}`}
          src={starOn}
          alt="별점"
          className="w-[14px] h-[14px]"
        />
      ))}

      {Array.from({ length: emptyCount }).map((_, i) => (
        <img
          key={`off-${i}`}
          src={starOff}
          alt="빈 별"
          className="w-[14px] h-[14px]"
        />
      ))}
    </div>
  );
}
