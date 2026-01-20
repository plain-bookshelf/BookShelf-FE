import axios from "axios";
import axiosInstance from "./apiClient";
import type { signupRequest, signupResponse, apiResponse } from "../types/signupTypes";

const SIGNUP_ENDPOINT = "/api/auth/signup";

export async function signup(data: signupRequest): Promise<signupResponse> {
  try {
    const res = await axiosInstance.post<apiResponse<signupResponse>>(SIGNUP_ENDPOINT, data);
    return res.data.data;
  } catch (error: unknown) { // ✅ any 제거
    if (axios.isAxiosError(error) && error.response) {
      const status = error.response.status;
      const serverError = error.response.data as { code?: string; message?: string };

      let msg = serverError.message || "회원가입 중 오류가 발생했습니다.";

      if (status === 409) {
        if (serverError.code === "M003") msg = "아이디가 이미 존재합니다.";
        else if (serverError.code === "M004") msg = "닉네임이 이미 사용 중입니다.";
      }
      if (status === 400 && serverError.code === "C001") {
        msg = "인증 코드가 일치하지 않습니다.";
      }
      throw new Error(msg);
    }
    throw new Error("네트워크 연결에 문제가 발생했습니다.");
  }
}

export default signup;