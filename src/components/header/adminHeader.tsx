import * as S from "./adminHeaderStyle";
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
  }, [location.pathname]);

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
        <S.PageText onClick={() => handleProtectedNav("/temp")}>대여 승인</S.PageText>
        <S.PageText onClick={() => handleProtectedNav("/recommand")}>
          대여 목록
        </S.PageText>
      </S.PageContent>

      {isLoggedIn ? (
        <S.ProfileWrapper onClick={() => navigate("/My")}>
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