import * as S from "./headerStyle";
import headerLogo from "../../assets/headerLogo.svg";
import defaultUserIcon from "../../assets/user.svg";
import home from "../../assets/home.png";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAccessToken } from "../../utils/tokenService";
import { useUser } from "../contexts/UserContext";

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useUser();

  const [isLoggedIn, setIsLoggedIn] = useState(!!getAccessToken());

  useEffect(() => {
    setIsLoggedIn(!!getAccessToken());
  
  },[location.pathname]);

  const handleProtectedNav = (path: string) => {
    if (!isLoggedIn) {
      alert("로그인 후 이용할 수 있는 메뉴입니다.");
      navigate("/login");
      return;
    }
    navigate(path);
  };

  return (
    <S.Container>
      <S.Logo
        src={headerLogo}
        alt="bookShlf-logo"
        onClick={() => handleProtectedNav("/")}
      />

      <S.PageContent>
        <S.FindFavoriteBooks onClick={() => handleProtectedNav("/recommand")}>
          내 취향 도서 찾기
        </S.FindFavoriteBooks>
        <S.MyPage onClick={() => handleProtectedNav("/my")}>
          마이페이지
        </S.MyPage>
        <S.AiPage onClick={() => handleProtectedNav("/ai")}>
          마루 Ai
        </S.AiPage>
      </S.PageContent>

      {isLoggedIn ? (
        <S.ProfileWrapper onClick={() => navigate("/my")}>
          <S.ProfileAvatar
            src={user.img || defaultUserIcon}
            alt={user.nickName || user.name || "user-profile"}
          />
        </S.ProfileWrapper>
      ) : (
        <S.TextContent>
          <S.SignUpContent onClick={() => navigate("/emailRegistration")}>
            <img src={home} alt="home-icon" />
            <S.SignUpText>회원가입</S.SignUpText>
          </S.SignUpContent>
          <S.LogInContent onClick={() => navigate("/login")}>
            <img src={defaultUserIcon} alt="user-icon" />
            <S.LogInText>로그인</S.LogInText>
          </S.LogInContent>
        </S.TextContent>
      )}
    </S.Container>
  );
}

export default Header;