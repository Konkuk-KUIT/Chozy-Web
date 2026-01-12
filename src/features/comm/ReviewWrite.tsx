import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import starOffIcon from "../../assets/community/star-off.svg";
import starOnIcon from "../../assets/community/star-on.svg";
import backIcon from "../../assets/all/back.svg";
import removeTextIcon from "../../assets/community/remove-text.svg";
import cameraIcon from "../../assets/community/camera.svg";
import closeImgIcon from "../../assets/community/close-img.svg";
import checkIcon from "../../assets/community/check.svg";

export default function ReviewWrite() {
  const navigate = useNavigate();
  const [productLink, setProductLink] = useState("");
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleBack = () => {
    navigate(-1);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files) {
      const newImages = Array.from(files).slice(0, 4 - images.length);
      setImages([...images, ...newImages]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    setShowSuccess(true);
    setTimeout(() => {
      navigate(-1);
    }, 2000);
  };

  const isValidProductLink = (link: string): boolean => {
    if (!link) return false;
    try {
      new URL(link);
      return true;
    } catch {
      return false;
    }
  };

  const handleResizeHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  // review 내용이 바뀔 때마다 실행
  useEffect(() => {
    handleResizeHeight();
  }, [review]);

  return (
    <div className="w-full min-h-screen bg-white pb-20">
      {/* Header */}
      <div className="sticky top-0 bg-white z-10">
        <div className="h-12 flex items-center justify-center px-4 relative">
          <button
            onClick={handleBack}
            className="w-6 h-6 flex items-center justify-center flex-shrink-0 absolute left-4"
          >
            <img src={backIcon} className="w-6 h-6" />
          </button>
          <span className="font-pretendard font-semibold text-[18px] leading-none tracking-normal text-center">
            리뷰 작성
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col px-4 py-4 space-y-6">
        {/* 상품 링크 */}
        <div className="flex flex-col">
          <label className="flex text-sm font-medium mb-3 gap-1">
            상품 링크 <span className="text-[#800025]">*</span>
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder="상품 링크를 입력해 주세요."
              value={productLink}
              onChange={(e) => setProductLink(e.target.value)}
              className="font-medium h-12 w-full px-3 pr-12 border border-[#DADADA] rounded placeholder-[#B5B5B5] text-sm focus:outline-none focus:border-[#800025] focus:text-[#191919]"
            />
            {productLink && (
              <button
                onClick={() => setProductLink("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center justify-center"
              >
                <img src={removeTextIcon} alt="Clear" className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* 제대로 된 링크 검증 */}
          {productLink && !isValidProductLink(productLink) && (
            <p className="text-red-500 text-xs mt-2">
              url 형식에 맞지 않습니다.
            </p>
          )}
        </div>

        {/* 별점 */}
        <div className="flex flex-col">
          <label className="flex text-sm font-medium mb-3 gap-1">
            별점 <span className="text-[#800025]">*</span>
          </label>
          <div className="flex gap-2 justify-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <div
                key={star}
                className="relative w-10 h-10 cursor-pointer"
                onClick={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = e.clientX - rect.left;
                  setRating(x < rect.width / 2 ? star - 0.5 : star);
                }}
              >
                {/* 기본 빈 별 배경 */}
                <img src={starOffIcon} alt="빈 별" className="w-full h-full" />
                {/* 꽉 찬 별 */}
                {rating >= star && (
                  <img
                    src={starOnIcon}
                    alt="채워진 별"
                    className="absolute w-full h-full  top-0 left-0"
                  />
                )}
                {/* 반 별 - 별의 점수가 0.5일 때만 노출 */}
                {rating === star - 0.5 && (
                  <div className="absolute top-0 left-0 h-full w-1/2 overflow-hidden">
                    <img
                      src={starOnIcon}
                      alt="반 별"
                      className="w-10 h-10 max-w-none"
                    />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 후기 */}
        <div className="flex flex-col">
          <label className="flex text-sm font-medium mb-3 gap-1">
            후기 <span className="text-[#800025]">*</span>
          </label>
          <textarea
            ref={textareaRef}
            placeholder="내용을 작성해 주세요."
            value={review}
            onChange={(e) => setReview(e.target.value.slice(0, 500))}
            maxLength={500}
            className="w-full min-h-[150px] px-3 py-3 border border-[#DADADA] rounded placeholder-[#B5B5B5] text-sm focus:outline-none focus:border-[#800025] focus:text-[#191919] resize-none overflow-hidden"
          />
          <div className="font-pretendard font-normal text-right text-[13px] text-[#B5B5B5]">
            {review.length} / 500
          </div>
        </div>

        {/* 사진 */}
        <div className="flex flex-col">
          <label className="flex text-sm font-medium mb-3 gap-1">사진</label>
          <div className="flex gap-1">
            {images.length < 4 && (
              <label className="relative w-15 h-15 aspect-square border-2 border-[#DADADA] rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-50">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <img src={cameraIcon} className="w-8 h-8" />
              </label>
            )}
            {images.map((image, index) => (
              <div
                key={index}
                className="relative w-15 h-15 aspect-square rounded flex items-center justify-center overflow-hidden"
              >
                <img
                  src={URL.createObjectURL(image)}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-[2px] right-[2px] flex items-center justify-center z-10"
                >
                  <img src={closeImgIcon} alt="Remove" className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
          <div className="font-pretendard font-normal text-right text-[13px] text-[#B5B5B5] mt-2">
            {images.length} / 4
          </div>
        </div>
      </div>

      {/* 게시하기 버튼 */}
      <div className="fixed bottom-0 w-[390px] bg-white p-4 flex justify-center">
        <button
          onClick={handleSubmit}
          className="w-full max-w-sm py-3 bg-[#800025] text-white rounded-lg font-medium"
        >
          게시하기
        </button>
      </div>

      {/* 성공 모달 */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="w-full h-[153px] bg-white rounded-2xl flex flex-col items-center gap-6 max-w-sm mx-4 pt-9">
            <div className="w-10 h-10 bg-[#800025] rounded-full flex items-center justify-center">
              <img src={checkIcon} alt="Check" className="w-4 h-[11px]" />
            </div>
            <p className="text-center text-[#191919] font-medium text-base">
              리뷰를 성공적으로 게시했어요.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
