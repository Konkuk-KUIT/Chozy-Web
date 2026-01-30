import { useState } from "react";
import { useNavigate } from "react-router-dom";
import HashtagInput from "./components/HashtagInput";
import ImageUpload from "./components/ImageUpload";

import backIcon from "../../assets/all/back.svg";

export default function PostWrite() {
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);

  const handleBack = () => {
    navigate(-1);
  };

  const handleSubmit = async () => {
    try {
      // 이미지를 base64로 변환하거나 필요한 형식으로 변환
      const imgData = images.map((file) => ({
        fileName: file.name,
        contentType: file.type,
      }));

      const response = await fetch("/community/posts/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
          hashtags,
          img: imgData,
        }),
      });

      if (!response.ok) {
        throw new Error("포스트 작성에 실패했습니다.");
      }

      const data = await response.json();
      console.log("포스트 작성 성공:", data);

      // 성공 후 이전 페이지로 이동
      navigate(-1);
    } catch (error) {
      console.error("포스트 작성 중 오류:", error);
      alert("포스트 작성에 실패했습니다.");
    }
  };

  return (
    <div className="w-full min-h-screen bg-white pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-white z-10">
        <div className="h-12 flex items-center justify-center px-4 pt-[14px] pb-[13px] relative">
          <button
            onClick={handleBack}
            className="w-6 h-6 flex items-center justify-center flex-shrink-0 absolute left-4"
          >
            <img src={backIcon} className="w-6 h-6" />
          </button>
          <span className="text-center justify-start text-zinc-900 text-lg font-semibold font-['Pretendard']">
            사담 작성
          </span>
        </div>
      </div>

      {/* 본문 */}
      <main className="flex-1 px-4 py-6 flex flex-col gap-6">
        {/* 글 작성 영역 */}
        <div className="flex flex-col gap-2">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="어쩌고 저쩌고..."
            className="w-full h-40 p-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="text-right text-sm text-gray-500">
            {content.length}/500
          </div>
        </div>

        {/* 해시태그 */}
        <div>
          <HashtagInput
            hashtags={hashtags}
            onHashtagsChange={setHashtags}
            onToast={(message) => console.log(message)}
          />
        </div>

        {/* 사진 */}
        <div>
          <ImageUpload images={images} onImagesChange={setImages} />
        </div>
      </main>

      {/* 제출 버튼 */}
      <footer className="border-t border-gray-200 px-4 py-4">
        <button
          onClick={handleSubmit}
          className="w-full py-3 bg-red-700 text-white font-semibold rounded-lg hover:bg-red-800 transition"
        >
          게시하기
        </button>
      </footer>
    </div>
  );
}
