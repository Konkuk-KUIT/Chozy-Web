import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import SearchBar2 from "../../components/SearchBar2";
import Sort, { type SortKey } from "./components/Sort";
import Product from "./components/Product";

type ApiCategory =
  | "FASHION"
  | "BEAUTY"
  | "HOBBY"
  | "TOYS"
  | "HOME"
  | "PET"
  | "ELECTRONICS"
  | "AUTOMOTIVE";

type ApiProduct = {
  productId: number;
  name: string;
  originalPrice: number;
  discountRate: number;
  imageUrl: string;
  productUrl: string;
  rating: number;
  reviewCount: number;
  deliveryFee: number;
  status: boolean;
};

type ApiResponse<T> = {
  isSuccess: boolean;
  code: number;
  message: string;
  timestamp: string;
  result: T;
};

const isCategory = (v: string | null): v is ApiCategory =>
  v === "FASHION" ||
  v === "BEAUTY" ||
  v === "HOBBY" ||
  v === "TOYS" ||
  v === "HOME" ||
  v === "PET" ||
  v === "ELECTRONICS" ||
  v === "AUTOMOTIVE";

import FilterSheet from "./components/filter/FIlterSheet";
import type { FilterTab } from "./components/filter/types";

export default function SearchResult() {
  const [searchParams, setSearchParams] = useSearchParams();

  const categoryParam = searchParams.get("category");
  const searchParam = (searchParams.get("search") ?? "")
    .replace(/^"|"$/g, "")
    .trim();

  const category = isCategory(categoryParam) ? categoryParam : null;
  const search = category ? "" : searchParam;
  const sort = (searchParams.get("sort") ?? "RELEVANCE") as SortKey;

  const [productList, setProductList] = useState<ApiProduct[]>([]);
  const [loading, setLoading] = useState(false);

  // API 요청 URL 생성
  const requestUrl = useMemo(() => {
    const params = new URLSearchParams();

    if (category) params.set("category", category);
    else if (search) params.set("search", search);
    if (sort) params.set("sort", sort);

    return `/home/products?${params.toString()}`;
  }, [category, search, sort]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(requestUrl);
        const data: ApiResponse<ApiProduct[]> = await res.json();
        setProductList(data.result ?? []);
      } catch (e) {
        console.error("상품 목록 로딩 실패:", e);
        setProductList([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [requestUrl]);

  const handleSortChange = (nextSort: SortKey) => {
    const nextParams = new URLSearchParams(searchParams);

    nextParams.set("sort", nextSort); // sort만 교체
    setSearchParams(nextParams);
  };
  const [sort, setSort] = useState<SortKey>("relevance");

  const [filterOpen, setFilterOpen] = useState(false);
  const [filterDefaultTab, setFilterDefaultTab] = useState<FilterTab>("price");

  // 서버에서 데이터 받아오기전 상품 더미데이터
  // 검색 키워드 && 필터 && 정렬을 넘기고 한번에 배열로 데이터 받아오기..?
  const products = [
    {
      source: "알리익스프레스",
      imgUrl: examProd,
      productUrl:
        "https://ko.aliexpress.com/item/1005008374109171.html?spm=a2g0o.home.pcJustForYou.24.40b552d1YYWO1o&gps-id=pcJustForYou&scm=1007.13562.416251.0&scm_id=1007.13562.416251.0&scm-url=1007.13562.416251.0&pvid=bcd88dc6-a9a5-473e-affe-4d3540245617&_t=gps-id:pcJustForYou,scm-url:1007.13562.416251.0,pvid:bcd88dc6-a9a5-473e-affe-4d3540245617,tpp_buckets:668%232846%238110%231995&pdp_ext_f=%7B%22order%22%3A%224681%22%2C%22eval%22%3A%221%22%2C%22sceneId%22%3A%223562%22%2C%22fromPage%22%3A%22recommend%22%7D&pdp_npi=6%40dis%21KRW%2122990%2117013%21%21%2122990%2117013%21%40212e509017665926696094494eac90%2112000044763980188%21rec%21KR%21%21ABX%211%210%21n_tag%3A-29910%3Bd%3Ae461f37a%3Bm03_new_user%3A-29895&utparam-url=scene%3ApcJustForYou%7Cquery_from%3A%7Cx_object_id%3A1005008374109171%7C_p_origin_prod%3A",
      name: "약국용 센소다인 후레쉬 120g",
      price: 15500,
      discountRate: 12,
      discountPrice: 13500,
      rating: 4.5,
      reviewCnt: 10320,
      deliveryFee: 0,
      liked: true,
    },
    {
      source: "알리익스프레스",
      imgUrl: examProd,
      productUrl:
        "https://ko.aliexpress.com/item/1005008374109171.html?spm=a2g0o.home.pcJustForYou.24.40b552d1YYWO1o&gps-id=pcJustForYou&scm=1007.13562.416251.0&scm_id=1007.13562.416251.0&scm-url=1007.13562.416251.0&pvid=bcd88dc6-a9a5-473e-affe-4d3540245617&_t=gps-id:pcJustForYou,scm-url:1007.13562.416251.0,pvid:bcd88dc6-a9a5-473e-affe-4d3540245617,tpp_buckets:668%232846%238110%231995&pdp_ext_f=%7B%22order%22%3A%224681%22%2C%22eval%22%3A%221%22%2C%22sceneId%22%3A%223562%22%2C%22fromPage%22%3A%22recommend%22%7D&pdp_npi=6%40dis%21KRW%2122990%2117013%21%21%2122990%2117013%21%40212e509017665926696094494eac90%2112000044763980188%21rec%21KR%21%21ABX%211%210%21n_tag%3A-29910%3Bd%3Ae461f37a%3Bm03_new_user%3A-29895&utparam-url=scene%3ApcJustForYou%7Cquery_from%3A%7Cx_object_id%3A1005008374109171%7C_p_origin_prod%3A",
      name: "제품명제품명길어지면제품명제품명제품명제품명",
      price: 49400000000000,
      discountRate: 42,
      discountPrice: 610000000,
      rating: 4.5,
      reviewCnt: 360,
      deliveryFee: 3000,
      liked: false,
    },
    {
      source: "알리익스프레스",
      imgUrl: examProd,
      productUrl:
        "https://ko.aliexpress.com/item/1005008374109171.html?spm=a2g0o.home.pcJustForYou.24.40b552d1YYWO1o&gps-id=pcJustForYou&scm=1007.13562.416251.0&scm_id=1007.13562.416251.0&scm-url=1007.13562.416251.0&pvid=bcd88dc6-a9a5-473e-affe-4d3540245617&_t=gps-id:pcJustForYou,scm-url:1007.13562.416251.0,pvid:bcd88dc6-a9a5-473e-affe-4d3540245617,tpp_buckets:668%232846%238110%231995&pdp_ext_f=%7B%22order%22%3A%224681%22%2C%22eval%22%3A%221%22%2C%22sceneId%22%3A%223562%22%2C%22fromPage%22%3A%22recommend%22%7D&pdp_npi=6%40dis%21KRW%2122990%2117013%21%21%2122990%2117013%21%40212e509017665926696094494eac90%2112000044763980188%21rec%21KR%21%21ABX%211%210%21n_tag%3A-29910%3Bd%3Ae461f37a%3Bm03_new_user%3A-29895&utparam-url=scene%3ApcJustForYou%7Cquery_from%3A%7Cx_object_id%3A1005008374109171%7C_p_origin_prod%3A",
      name: "약국용 센소다인 후레쉬 120g",
      price: 15500,
      discountRate: 12,
      discountPrice: 13500,
      rating: 4.5,
      reviewCnt: 10320,
      deliveryFee: 0,
      liked: true,
    },
  ];

  // 좋아요 토글(서버 연동 전): status 토글
  const handleToggleLike = (productId: number) => {
    setProductList((prev) =>
      prev.map((p) =>
        p.productId === productId ? { ...p, status: !p.status } : p
      )
    );
  };

  const isEmpty = !loading && productList.length === 0;

  return (
    <div className="h-full bg-white">
      <SearchBar2 />
      {/* 상품 검색 화면 완성 시 검색창 누르면 상품 검색 화면으로 이동 추가 */}
      <div className="h-full overflow-y-auto scrollbar-hide pt-[68px]">
        {/* 추후 필터 컴포넌트 삽입 */}
        {/* DEV ONLY: 필터 바텀시트 테스트용 */}
        <div className="bg-white px-4 pt-4 flex gap-2">
          <button
            type="button"
            onClick={() => {
              setFilterDefaultTab("price");
              setFilterOpen(true);
            }}
            className="px-3 py-2 text-[14px] font-medium bg-[#F2F2F2] rounded"
          >
            필터 테스트(가격)
          </button>

          <button
            type="button"
            onClick={() => {
              setFilterDefaultTab("rating");
              setFilterOpen(true);
            }}
            className="px-3 py-2 text-[14px] font-medium bg-[#F2F2F2] rounded"
          >
            필터 테스트(별점)
          </button>
        </div>

        <FilterSheet
          open={filterOpen}
          onOpenChange={setFilterOpen}
          defaultTab={filterDefaultTab}
          onConfirm={(state) => {
            console.log("필터 확인:", state);
          }}
        />

        <div className="h-1" />
        <div className="bg-white pt-4 px-4 flex flex-col gap-5">
          <div className="flex flex-row items-center justify-between">
            <span className="text-[#B5B5B5] font-medium text-[14px]">
              전체 310개
            </span>
            {/*추후 서버 연동 시 전체 상품 개수 받아와서 위 코드 수정 */}
            <Sort value={sort} onChange={setSort} />
          </div>
          <p className="text-[#B5B5B5] text-[14px] font-medium">
            상품을 클릭하면 해당 상품 사이트로 이동합니다.
          </p>
          <div
            className="grid gap-x-1 gap-y-4 
                  [grid-template-columns:repeat(auto-fill,minmax(177px,1fr))]
                  justify-items-start"
          >
            {productList.map((product, index) => (
              <Product
                key={product.name}
                source={product.source}
                imgUrl={product.imgUrl}
                productUrl={product.productUrl}
                name={product.name}
                price={product.price}
                discountRate={product.discountRate}
                discountPrice={product.discountPrice}
                rating={product.rating}
                reviewCnt={product.reviewCnt}
                deliveryFee={product.deliveryFee}
                liked={product.liked}
                onToggleLike={() => handleToggleLike(index)}
              />
            ))}
          </div>
        </div>
        <div className="h-1 bg-[#f9f9f9]" />

        {isEmpty ? (
          <div className="bg-white px-4">
            <div className="pt-[225px] flex flex-col items-center justify-center gap-10">
              <div className="w-[100px] h-[100px] bg-[#D9D9D9]" />
              <p className="text-[16px] font-medium text-[#575757]">
                검색 결과가 없어요.
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-white pt-4 px-4 flex flex-col gap-5">
            <div className="flex flex-row items-center justify-between">
              <span className="text-[#B5B5B5] font-medium text-[14px]">
                {loading ? "불러오는 중..." : `전체 ${productList.length}개`}
              </span>
              <Sort value={sort} onChange={handleSortChange} />
            </div>

            <p className="text-[#B5B5B5] text-[14px] font-medium">
              상품을 클릭하면 해당 상품 사이트로 이동합니다.
            </p>

            <div
              className="grid gap-x-1 gap-y-4 
              [grid-template-columns:repeat(auto-fill,minmax(177px,1fr))]
              justify-items-start"
            >
              {productList.map((p) => (
                <Product
                  key={p.productId}
                  productId={p.productId}
                  name={p.name}
                  originalPrice={p.originalPrice}
                  discountRate={p.discountRate}
                  imageUrl={p.imageUrl}
                  productUrl={p.productUrl}
                  rating={p.rating}
                  reviewCount={p.reviewCount}
                  deliveryFee={p.deliveryFee}
                  status={p.status}
                  onToggleLike={handleToggleLike}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
