import axios from "axios";
import axiosInstance from "./apiClient";

interface BaseResponse<T = string> {
  status: string;
  message: string;
  data: T;
}

/**
 * 비밀번호 찾기 - 이메일로 인증코드 전송
 * @throws Error("EMAIL_NOT_FOUND") - 가입되지 않은 이메일
 * @throws Error("SEND_FAILED") - 기타 전송 실패
 */
export const sendFindPasswordEmail = async (address: string): Promise<void> => {
  try {
    const res = await axiosInstance.post<BaseResponse>(
      "/api/auth/find-password/send",
      { address },
      { headers: { "Content-Type": "application/json" } }
    );

    if (res.status !== 200 || res.data.status !== "OK") {
      throw new Error("SEND_FAILED");
    }
  } catch (error: unknown) {                             
    if (axios.isAxiosError(error) && error.response) {
      if (error.response.status === 404) {
        throw new Error("EMAIL_NOT_FOUND");
      }
    }
    throw new Error("SEND_FAILED");
  }
};

/**
 * 비밀번호 찾기 - 이메일 인증코드 검증
 * @returns boolean - true면 인증 성공
 * @throws Error("VERIFY_FAILED") - 인증 실패 (코드 불일치 등)
 */
export const verifyFindPasswordCode = async (
  address: string,
  verificationCode: string
): Promise<boolean> => {
  try {
    const res = await axiosInstance.post<BaseResponse<boolean>>(
      "/api/auth/find-password/verify",
      { address, verification_code: verificationCode },
      { headers: { "Content-Type": "application/json" } }
    );

    if (res.status !== 200 || res.data.status !== "OK") {
      throw new Error("VERIFY_FAILED");
    }
    return res.data.data === true;
  } catch (error: unknown) {                               
    if (axios.isAxiosError(error) && error.response) {
      if (error.response.status === 404) {
        throw new Error("VERIFY_FAILED");
      }
    }
    throw new Error("VERIFY_FAILED");
  }
};

/**
 * 비밀번호 찾기 - 최종 비밀번호 재설정
 * @throws Error("MEMBER_NOT_FOUND") - 회원 정보 없음
 * @throws Error("RETOUCH_FAILED") - 기타 실패
 */
export const resetPasswordByFind = async (
  username: string,
  newPassword: string
): Promise<void> => {
  try {
    const res = await axiosInstance.patch<BaseResponse>(
      "/api/auth/find-password/retouch",
      { username: username, password: newPassword },
      { headers: { "Content-Type": "application/json" } }
    );

    if (res.status !== 201 || res.data.status !== "CREATED") {
      throw new Error("RETOUCH_FAILED");
    }
  } catch (error: unknown) {                            
    if (axios.isAxiosError(error) && error.response) {
      if (error.response.status === 404) {
        throw new Error("MEMBER_NOT_FOUND");
      }
    }
    throw new Error("RETOUCH_FAILED");
  }
};