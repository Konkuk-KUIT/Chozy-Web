import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DetailHeader from "../../components/DetailHeader";
import SubmitButton from "../../components/SubmitButton";
import Toast from "../../components/Toast";
import SuccessModal from "../../components/SuccessModal";
import HashtagInput from "./components/HashtagInput";
import ImageUpload from "./components/ImageUpload";

export default function PostWrite() {
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleResizeHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  useEffect(() => {
    handleResizeHeight();
  }, [content]);

  const isFormValid = (): boolean => {
    return content.trim().length > 0;
  };

  const handleSubmit = async () => {
    if (!isFormValid() || isLoading) return;

    setIsLoading(true);
    try {
      // 이미지 데이터 변환
      const imgData = images.map((file) => ({
        imageUrl: file.name,
        contentType: file.type,
      }));

      // 해시태그를 공백으로 구분된 문자열로 변환
      const hashTagsString = hashtags.join(" ");

      const response = await fetch("/community/posts/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
          hashTags: hashTagsString,
          img: imgData,
        }),
      });

      const data = await response.json();

      if (data.isSuccess) {
        setShowSuccess(true);
        // 2초 후 게시글 상세 페이지로 이동
        setTimeout(() => {
          navigate(`/community/feeds/${data.result.postId}/detail`);
        }, 2000);
      } else {
        setToast({
          message: data.message || "사담 게시에 실패했습니다.",
          type: "error",
        });
        setTimeout(() => setToast(null), 3000);
      }
    } catch (error) {
      console.error("사담 작성 중 오류:", error);
      setToast({
        message: "네트워크 오류가 발생했습니다. 다시 시도해주세요.",
        type: "error",
      });
      setTimeout(() => setToast(null), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-white pb-20">
      <DetailHeader title="사담 작성" />

      {/* 본문 */}
      <main className="flex-1 px-4 py-6 flex flex-col gap-3.5 ">
        {/* 글 작성 영역 */}
        <div className="w-full p-3 bg-white rounded outline outline-1 outline-offset-[-1px] outline-zinc-300 focus-within:outline-rose-900 inline-flex flex-col justify-start items-start gap-2.5">
          {/* 프로필 영역 */}
          <div className="w-full inline-flex justify-start items-center gap-2">
            <img
              className="w-9 h-9 rounded-full border border-stone-50"
              src="https://placehold.co/36x36"
              alt="profile"
            />
            <div className="inline-flex flex-col justify-center items-start gap-0.5">
              <div className="text-center justify-start text-zinc-900 text-sm font-medium font-['Pretendard'] leading-5">
                KUIT
              </div>
              <div className="text-center justify-start text-zinc-400 text-[10px] font-normal font-['Pretendard']">
                @KUIT PM
              </div>
            </div>
          </div>

          {/* 입력 영역 */}
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value.slice(0, 500))}
            maxLength={500}
            placeholder="내용을 작성해 주세요."
            className="w-full min-h-32 bg-white text-zinc-900 text-sm font-normal font-['Pretendard'] leading-6 placeholder-zinc-400 resize-none overflow-hidden border-none outline-none focus:outline-none focus:placeholder-transparent caret-rose-900"
          />
        </div>

        {/* 글자 수 */}
        <div className="w-full text-right text-zinc-400 text-xs font-normal font-['Pretendard']">
          {content.length}/500
        </div>

        {/* 해시 태그 */}
        <div className="flex flex-col">
          <HashtagInput
            hashtags={hashtags}
            onHashtagsChange={setHashtags}
            onToast={(message) => {
              setToast({ message, type: "error" });
              setTimeout(() => setToast(null), 3000);
            }}
          />
        </div>

        {/* 사진 */}
        <div>
          <ImageUpload images={images} onImagesChange={setImages} />
        </div>
      </main>

      {/* 제출 버튼 */}
      <div className="fixed bottom-5 w-[min(100vw,calc(100dvh*9/16))] mx-auto left-1/2 -translate-x-1/2 px-4 z-40">
        <SubmitButton
          label="게시하기"
          isValid={isFormValid()}
          isLoading={isLoading}
          onSubmit={handleSubmit}
          className="relative w-full"
        />
      </div>

      {/* 성공 모달 */}
      <SuccessModal
        isOpen={showSuccess}
        message="사담을 성공적으로 게시했어요."
      />

      {/* 토스트 메시지 */}
      <Toast toast={toast} />
    </div>
  );
}
