import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosError,
  type AxiosRequestHeaders,
  type InternalAxiosRequestConfig,
} from "axios";
import {
  getAccessToken,
  getRefreshToken,
  removeTokens,
  setTokens,
} from "../utils/tokenService";
import { postTokenReissue } from "./authApi";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: "http://43.200.3.102:8080",
});

/** url 정규화 (/api 유무 상관없이 동일 비교) */
const extractPurePath = (url?: string): string => {
  if (!url) return "";
  try {
    if (url.startsWith("http://") || url.startsWith("https://")) {
      const u = new URL(url);
      // 백엔드가 /api 프리픽스를 쓰는 경우를 대비해 동일하게 처리
      return u.pathname.startsWith("/api") ? u.pathname.slice(4) : u.pathname;
    }
  } catch { /* ignore */ }
  return url.startsWith("/api") ? url.slice(4) : url;
};

// 공개 엔드포인트: 토큰 자동 부착/재발급 제외
const isPublicUrl = (url?: string): boolean => {
  const pure = extractPurePath(url);
  return (
    pure.startsWith("/auth/login") ||
    pure.startsWith("/auth/reissue") ||
    pure.startsWith("/public")
  );
};

let isTokenRefreshing = false;

type FailedRequest = {
  resolve: (value: unknown) => void;
  reject: (reason?: unknown) => void;
  config: AxiosRequestConfig & { _retry?: boolean };
};

let failedQueue: FailedRequest[] = [];

const processQueue = (error: unknown, token?: string) => {
  failedQueue.forEach((p) => {
    if (error) {
      p.reject(error);
    } else {
      if (token) {
        if (!p.config.headers) p.config.headers = {} as AxiosRequestHeaders;
        (p.config.headers as AxiosRequestHeaders).Authorization = `Bearer ${token}`;
      }
      p.resolve(axiosInstance(p.config));
    }
  });
  failedQueue = [];
};

/**
 * 요청 인터셉터
 * - public URL 아니고 access token 있으면 Authorization 항상 최신값으로 세팅
 */
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (!config.headers) config.headers = {} as AxiosRequestHeaders;
    const headers = config.headers as AxiosRequestHeaders;

    // 기본 헤더
    if (!(config.data instanceof FormData)) {
      headers["Content-Type"] = "application/json";
    }
    if (!headers.Accept) headers.Accept = "application/json";

    // 토큰 부착
    const token = getAccessToken();
    if (token && !isPublicUrl(config.url)) {
      headers.Authorization = `Bearer ${token}`;
    }

    // 디버그 로그
    if (import.meta.env.DEV) {
      const pure = extractPurePath(config.url);
      console.debug(
        "[REQ]",
        config.method?.toUpperCase(),
        pure || config.url,
        "token:",
        token ? token.slice(0, 12) + "..." + token.slice(-12) : "(none)"
      );
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

/**
 * 응답 인터셉터
 * - 401 → /auth/reissue 1회 시도
 */
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalConfig = (error.config || {}) as AxiosRequestConfig & {
      _retry?: boolean;
    };
    const status = error.response?.status;

    if (!originalConfig || originalConfig._retry || isPublicUrl(originalConfig.url) || status !== 401) {
      return Promise.reject(error);
    }

    // 리프레시 없으면 로그아웃
    if (!getRefreshToken()) {
      removeTokens();
      return Promise.reject(error);
    }

    originalConfig._retry = true;

    if (isTokenRefreshing) {
      const pure = extractPurePath(originalConfig.url);
      console.debug("[REFRESH] queueing request:", pure || originalConfig.url);
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject, config: originalConfig });
      });
    }

    isTokenRefreshing = true;

    try {
      console.debug("[REFRESH] start: calling /auth/reissue");
      const reissueData = await postTokenReissue();

      // 새 토큰 저장
      setTokens({
        access_token: reissueData.access_token,
        refresh_token: reissueData.refresh_token,
        expires_in: reissueData.expires_in,
      });

      console.debug(
        "[REFRESH] success: new token",
        reissueData.access_token.slice(0, 12),
        "...",
        reissueData.access_token.slice(-12)
      );

      // 대기중인 요청 처리
      processQueue(null, reissueData.access_token);

      // 원요청 재시도
      if (!originalConfig.headers) originalConfig.headers = {} as AxiosRequestHeaders;
      (originalConfig.headers as AxiosRequestHeaders).Authorization = `Bearer ${reissueData.access_token}`;

      console.debug("[RETRY]", extractPurePath(originalConfig.url) || originalConfig.url);
      return axiosInstance(originalConfig);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      console.debug("[REFRESH] failed:", msg);

      // 명세상 에러는 모두 재로그인 유도
      if (
        msg.startsWith("REFRESH_TOKEN_INVALID") ||
        msg.startsWith("MEMBER_NOT_FOUND") ||
        msg.startsWith("NO_TOKENS") ||
        msg.startsWith("REISSUE_FAILED") ||
        msg.startsWith("REISSUE_INVALID_RESPONSE")
      ) {
        removeTokens();
      }

      processQueue(e, undefined);
      return Promise.reject(e);
    } finally {
      isTokenRefreshing = false;
    }
  }
);

if (typeof window !== "undefined") {
  // 디버그: 콘솔에서 dbgGetToken(), dbgGetRefresh()로 확인
  (window as any).dbgGetToken = () => getAccessToken();
  (window as any).dbgGetRefresh = () => getRefreshToken();
}

export default axiosInstance;