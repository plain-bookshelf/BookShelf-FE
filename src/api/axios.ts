import axios from "axios";
import { storage, ACCESS_TOKEN_KEY } from "../utils/tokenService";

//백엔드 서버쪽 용 / ai 쪽 통신은 그냥 인스턴스 없이 깡으로 박음
const Server_IP = import.meta.env.VITE_APP_Server_IP;

export const instance = axios.create({
  baseURL: Server_IP,
  timeout: 3000,
  headers: { 
    'Content-Type': 'application/json',
  },
})

//요청 인터셉터
//액세스 토큰 넣는 것만 구현
instance.interceptors.request.use(
  (config) => {
    const accessToken =storage.getItem(ACCESS_TOKEN_KEY);

    if(accessToken){
      config.headers.Authorization = `Bearer ${accessToken}`
    }

    return config;
  },

  (error) => Promise.reject(error) //에러가 발생했을 때 api 요청을 보낸 곳으로 에러 전달
)

//반응 인터셉터 반들어서 예외처리 해야함