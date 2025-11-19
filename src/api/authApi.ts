import axios from "axios";
import axiosInstance from "./apiClient";
import {
  getAccessToken,
  getRefreshToken,
} from "../utils/tokenService";
import type {
  LoginRequest,
  LoginTokenData,
  TokenReissueRequest,
  TokenReissueResponseData,
} from "../types/authTypes";

interface ApiSuccessResponse<T> {
  status: string; // "CREATED"
  message: string;
  data: T;
}

interface ApiErrorResponse {
  status?: string;
  code?: string; // "A004", "M001" 등 서버에서 내려주는 경우
  message?: string;
}

const AUTH_BASE = "/api/auth";

/**
 * 로그인: POST /api/auth/login
 */
export const postLogin = async (
  loginData: LoginRequest
): Promise<LoginTokenData> => {
  const res = await axiosInstance.post<ApiSuccessResponse<LoginTokenData>>(
    `${AUTH_BASE}/login`,
    loginData
  );

  // 명세상 201 CREATED 이지만, 혹시 200 쓸 수도 있으니 둘 다 허용
  if (res.status !== 200 && res.status !== 201) {
    throw new Error("LOGIN_FAILED");
  }

  return res.data.data;
};

//토큰 재발급: POST /api/auth/reissue
export const postTokenReissue = async (): Promise<TokenReissueResponseData> => {
  const Server_IP = import.meta.env.VITE_APP_Server_IP;
  const accessToken = getAccessToken();
  const refreshToken = getRefreshToken();

  if (!accessToken || !refreshToken) {
    throw new Error("NO_TOKENS");
  }

  const body: TokenReissueRequest = {
    access_token: accessToken,
    refresh_token: refreshToken,
  };

  const res = await axios.post<
    ApiSuccessResponse<TokenReissueResponseData> | ApiErrorResponse
  >(`${Server_IP}/api/auth/reissue`, body, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    // 여기서 직접 status 보고 판단할 거라서 모두 허용
    validateStatus: () => true,
  });

  // 성공: 201 CREATED
  if (res.status === 201 || res.status === 200) {
    const data = (res.data as ApiSuccessResponse<TokenReissueResponseData>).data;
    if (!data?.access_token || !data?.refresh_token) {
      throw new Error("REISSUE_INVALID_RESPONSE");
    }
    return data;
  }

  // 에러 응답 파싱
  const err = res.data as ApiErrorResponse;

  if (res.status === 401) {
    // *REFRESH_TOKEN_NOT_MATCH*
    // code: "A004"
    throw new Error("REFRESH_TOKEN_INVALID");
  }

  if (res.status === 404) {
    // MEMBER_NOT_FOUND
    // code: "M001"
    throw new Error("MEMBER_NOT_FOUND");
  }

  // 그 외는 전부 재발급 실패로 처리
  throw new Error(
    `REISSUE_FAILED:${err.code || res.status}:${err.message || ""}`.trim()
  );
};