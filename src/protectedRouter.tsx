import { ACCESS_TOKEN_KEY } from "./utils/tokenService";
import { Navigate, Outlet } from "react-router-dom";


function ProtectedRouter() {
  const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY)
  if(!accessToken){
    alert("해당 서비스는 로그인을 한 후 사용가능합니다.");
    return <Navigate to ="/login" replace/>
  }
  return <Outlet/>
}

export default ProtectedRouter