import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/header/Header";
import AdminHeader from "../components/header/adminHeader"
import Footer from "../components/footer/Footer";
import styled from "styled-components";
import { useUser } from "../components/contexts/UserContext";
import { getMyPage } from "../api/my";
import { getUserId } from "../utils/tokenService"; // localStorage에서 user_id 읽어오기
import { getUserRoleFromToken , type UserRole } from "../utils/getUserFromToken";

const Layout = () => {
  const { user, setUser } = useUser();
    const [role, setRole] = useState<UserRole>(null);

  useEffect(() => {
    const userRole = getUserRoleFromToken();
    setRole(userRole);
    
    // Context에 있는 id가 우선, 없으면 localStorage에서 가져오기
    const id = user.id || getUserId();
    if (!id) {
      console.log("userId 없음, 프로필 호출 스킵");
      return;
    }

    const fetchProfile = async () => {
      try {
        console.log("Layout에서 유저 프로필 불러오는 중, id:", id);
        const res = await getMyPage(id); // /mypage/{id}
        const data = res.data.data;

        setUser(({...user, id, nickName: data.nick_name, img: data.profile, email: data.address ?? user.email,}));
      } catch (e) {
        console.log(e);
      }
    };

    fetchProfile();
  }, [user.id]); // id가 설정되면 한 번 호출됨

  const renderHeader = () => {
    // role 관리 있으면 여기서 role에 따라 Header/AdminHeader 나누고
    if (role === "MANAGER" || role === "ADMIN") {
      return <AdminHeader />;
    }
   
    return <Header />;
  };

  return (
    <Wrapper>
      {renderHeader()}
      <Outlet />
      <Footer />
    </Wrapper>
  );
};

export default Layout;

const Wrapper = styled.div`
  width: 100%;
  max-width: 1910px;
  margin: 0 auto;
  box-sizing: border-box;
`;