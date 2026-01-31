import search from "../../../assets/mypage/search.svg";
import setting from "../../../assets/mypage/setting.svg";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();

  return (
    <header className="w-full h-[48px] bg-[#F9F9F9] absolute top-0 z-50 bg-transparent">
      <div className="w-full flex flex-row justify-end px-[16px] py-[9px] gap-[10px]">
        <button
          type="button"
          className="w-10 h-10 flex items-center justify-center rounded-[20px] bg-[rgba(25,25,25,0.4)]"
        >
          <img src={search} alt="검색" />
        </button>
        <button
          type="button"
          className="w-10 h-10 flex items-center justify-center rounded-[20px] bg-[rgba(25,25,25,0.4)]"
          onClick={() => navigate("/mypage/setting")}
        >
          <img src={setting} alt="설정" />
        </button>
      </div>
    </header>
  );
}
