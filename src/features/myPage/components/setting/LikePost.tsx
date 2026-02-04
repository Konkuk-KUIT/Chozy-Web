import DetailHeader from "../../../../components/DetailHeader";

export default function LikePost() {
  return (
    <>
      <DetailHeader title="좋아요한 게시글" />
      <div className="flex flex-col items-center justify-center h-[calc(100vh-48px)] bg-white gap-10">
        <div className="w-25 h-25 bg-[#D9D9D9]" />
        <p className="text-[#787878] text-[16px]">좋아요한 게시글이 없어요.</p>
      </div>
    </>
  );
}
