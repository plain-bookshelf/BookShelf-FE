import axios from "axios";

// 응답 타입
export interface FindIdSendResponse {
  status: string;          // "OK"
  message: string;         // "successfully find-username send."
  data: string;            // 서버 명세상 "" (빈 문자열)
}

export interface FindIdVerifyResponse {
  status: string;          // "OK"
  message: string;         // "successfully find-verified verified."
  data: string;            // 아이디 값 (ex: "kim")
}

// 비회원용 전용 axios 인스턴스
// 공용 axiosInstance(토큰/인터셉터) 안 타게 분리
const Server_IP = import.meta.env.VITE_APP_Server_IP;

const publicAxios = axios.create({
  baseURL: Server_IP,
  withCredentials: true,
});

// 아이디 찾기 - 인증코드 이메일 발송
export async function requestFindIdCode(
  address: string
): Promise<FindIdSendResponse> {
  const res = await publicAxios.post("/api/auth/find-id/send", { address });
  return res.data;
}

// (옵션) 이름만 다른 wrapper, 필요 없으면 안 써도 됨
export const sendFindIdEmail = requestFindIdCode;

//  아이디 찾기 - 인증코드 검증 + 아이디 조회
export async function verifyFindIdCode(
  address: string,
  verificationCode: string
): Promise<FindIdVerifyResponse> {
  const res = await publicAxios.post("/api/auth/find-id/verify", {
    address,
    // 서버 스펙이 ver**f**ication_code 오타이므로 그대로 맞춰서 보냄
    verification_code: verificationCode,
  });
  return res.data;
}