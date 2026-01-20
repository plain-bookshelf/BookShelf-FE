export const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";
const EXPIRES_AT_KEY = "access_token_expires_at"; // number (ms)
const USER_ID_KEY = "user_id";

// const storage = window.sessionStorage; //바꾸면 sessionStorage 사용
 export const storage = window.localStorage; 

export interface TokenPayload {
  access_token: string;
  refresh_token: string;
  expires_in?: number; // 서버 응답: 절대 만료시간(ms) 또는 남은 초(second) 둘 다 대응
}

export function setTokens(payload: TokenPayload) {
  const { access_token, refresh_token, expires_in } = payload;

  if (access_token) {
    storage.setItem(ACCESS_TOKEN_KEY, access_token);
  }
  if (refresh_token) {
    storage.setItem(REFRESH_TOKEN_KEY, refresh_token);
  }

  if (expires_in) {
    let expiresAt: number;

    // 1. 값이 13자리 이상이면: 이미 epoch(ms)라고 가정
    if (expires_in > 1_000_000_000_000) {
      expiresAt = expires_in;
    } else {
      // 2. 아니면: seconds 로 보고 현재 시간 기준 계산
      expiresAt = Date.now() + expires_in * 1000;
    }

    storage.setItem(EXPIRES_AT_KEY, String(expiresAt));
  }
}

export function getAccessToken(): string | null {
  return storage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | null {
  return storage.getItem(REFRESH_TOKEN_KEY);
}

export function getAccessTokenExpiresAt(): number | null {
  const raw = storage.getItem(EXPIRES_AT_KEY);
  return raw ? Number(raw) : null;
}

export function setUserId(id: string){
  storage.setItem(USER_ID_KEY, id);
}

export function getUserId(): string{
  return storage.getItem(USER_ID_KEY) ??  "";
}

export function isAccessTokenExpired(): boolean {
  const exp = getAccessTokenExpiresAt();
  if (!exp) return false;
  return Date.now() > exp;
}

export function removeTokens() {
  storage.removeItem(ACCESS_TOKEN_KEY);
  storage.removeItem(REFRESH_TOKEN_KEY);
  storage.removeItem(EXPIRES_AT_KEY);
  storage.removeItem(USER_ID_KEY);
}