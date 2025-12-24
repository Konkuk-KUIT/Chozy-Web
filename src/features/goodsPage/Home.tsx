// 상품페이지의 메인페이지
import { useNavigate } from "react-router-dom";
import Header from "./components/Header";
import Nav from "../../components/Nav";
import Category from "./components/Category";
import SearchBar from "../../components/SearchBar";

import cloth from "../../assets/goodsPage/category/cloth.svg";
import beauty from "../../assets/goodsPage/category/beauty.svg";
import diy from "../../assets/goodsPage/category/diy.svg";
import game from "../../assets/goodsPage/category/game.svg";
import cooking from "../../assets/goodsPage/category/cooking.svg";
import pet from "../../assets/goodsPage/category/pet.svg";
import electronics from "../../assets/goodsPage/category/electronics.svg";
import car from "../../assets/goodsPage/category/car.svg";

const categories = [
  { imgSrc: cloth, label: "의류/잡화" },
  { imgSrc: beauty, label: "뷰티/건강" },
  { imgSrc: diy, label: "취미/DIY" },
  { imgSrc: game, label: "완구/게임" },
  { imgSrc: cooking, label: "홈데코/주방" },
  { imgSrc: pet, label: "반려동물" },
  { imgSrc: electronics, label: "전자제품" },
  { imgSrc: car, label: "자동차용품" },
];

function Home() {
  const navigate = useNavigate();

  // 서버에서 데이터 받아오기전 "인기검색어" 더미데이터
  const searchKey = [
    "여성가을옷",
    "헤어밴드",
    "폰케이스",
    "두바이쫀득쿠키",
    "남성겨울옷", // 화면 넘어갈 시 스크롤 여부 테스트 위함
  ];

  return (
    <>
      <Header />
      <main className="pt-[43px] flex flex-col gap-3">
        {/* 검색창 && 인기검색어 */}
        <div className="flex flex-col px-4 pt-2 pb-3 gap-3 shadow-[0_4px_10px_0_rgba(0,0,0,0.04)]">
          <SearchBar />
          <div className="flex items-center gap-3">
            <span className="font-semibold text-[14px] whitespace-nowrap">
              인기 검색어
            </span>
            <div className="flex flex-1 min-w-0 gap-3 overflow-x-auto whitespace-nowrap scrollbar-hide">
              {searchKey.map((keyword) => (
                <button
                  key={keyword}
                  onClick={() => {
                    navigate(
                      `/goods/search?keyword=${encodeURIComponent(keyword)}&source=popular`
                    );
                  }}
                  className="flex-shrink-0 text-[#787878] text-[14px]"
                >
                  {keyword}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 카테고리 선택 */}
        <div className="w-full bg-white grid grid-cols-4 grid-rows-2 px-4 gap-2">
          {categories.map((category) => (
            <Category
              imgSrc={category.imgSrc}
              label={category.label}
              onClick={() => {
                navigate(
                  `/goods/search?keyword=${encodeURIComponent(category.label)}&source=category`
                );
              }}
            />
          ))}
        </div>

        {/* 상품 추천 */}
        <div className="pt-4 px-4 flex flex-column bg-white gap-4">
          <p className="font-semibold text-[16px]">이런 상품은 어떠세요?</p>
        </div>
      </main>
      <Nav />
    </>
  );
}

export default Home;
