import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "react-router-dom";

import SearchBar2 from "../../components/SearchBar2";
import Product from "../goodsPage/components/Product";
import { getLikes, setLike } from "../../api/domains/favorite/api";

import type { LikeItem } from "../../api/domains/favorite/types";

export default function FavoriteSearchResult() {
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("keyword") ?? "";

  const [likes, setLikesState] = useState<LikeItem[]>([]);
  const likesRef = useRef<LikeItem[]>([]);
  useEffect(() => {
    likesRef.current = likes;
  }, [likes]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      try {
        const list = await getLikes({ search: keyword });
        // 찜 검색 결과는 모두 찜된 상품이므로 status를 true로 명시
        const withStatus = list.map((item) => ({ ...item, status: true }));
        setLikesState(withStatus);
      } catch {
        setLikesState([]);
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [keyword]);

  const onToggleLike = async (productId: number) => {
    const current = likesRef.current.find((p) => p.productId === productId);
    if (!current) return;

    const next = !current.status;

    // optimistic UI
    setLikesState((prev) =>
      prev.map((p) => (p.productId === productId ? { ...p, status: next } : p)),
    );

    try {
      await setLike(productId, next);
    } catch {
      // rollback
      setLikesState((prev) =>
        prev.map((p) =>
          p.productId === productId ? { ...p, status: !next } : p,
        ),
      );
    }
  };

  return (
    <div className="relative h-full bg-white flex flex-col">
      <SearchBar2
        backBehavior="BACK"
        focusNavigateTo="/heart/search"
        value={keyword}
        onChange={() => {}}
      />

      <div className="flex-1 overflow-y-auto scrollbar-hide pt-20">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-[#787878]">로딩 중...</p>
          </div>
        ) : likes.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-[#B9B9B9] text-center">검색 결과가 없습니다.</p>
          </div>
        ) : (
          <div className="px-4 py-4">
            <div className="grid grid-cols-2 gap-3">
              {likes.map((product) => (
                <Product
                  key={product.productId}
                  size="md"
                  productId={product.productId}
                  name={product.name}
                  originalPrice={product.originalPrice}
                  discountRate={product.discountRate}
                  imageUrl={product.imageUrl}
                  productUrl={product.productUrl}
                  status={product.status}
                  onToggleLike={onToggleLike}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
