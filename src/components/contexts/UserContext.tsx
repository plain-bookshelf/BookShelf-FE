import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { UserContextType, UserInfo } from "../../types/User";
import { getUserId } from "../../utils/tokenService";

export const UserContext = createContext<UserContextType>({ user: {id: "", name: "" ,nickName: "", img:"", email: ""}, setUser: () => {} });

/*{ children } 구조분해 할당 받고 { children: ReactNode } 구조분해 할당 받은 children이 ReactNode라고 명시 {} 로 둘다 감싼 건 둘다 객체임을 명시*/
export const Provider = ({ children }: { children: ReactNode }) => { 
  const [user, setUser] = useState<UserInfo>({ id: "", name: "abc100" ,nickName: "", img: "", email: "" });

  const updateUser = (newData: UserInfo) => setUser(newData);

    useEffect(() => {
    const storedId = getUserId();
    if (!storedId) return;

    setUser((prev) => ({ ...prev, id: storedId }));
  }, []);

  return(
    <>
      <UserContext.Provider value={{user, setUser: updateUser}}>{children}</UserContext.Provider>
    </>
  )
}

export const useUser = () => {
  const {user, setUser} = useContext(UserContext);

  /*나중에 유지보수 1순위  | style쪽 0순위*/
  /*
  나중에 필요시 함수 추가
  const editUser = (newData: UserInfo) => {
    setUser(newData);
  } 
  */

  return {user, setUser}
}