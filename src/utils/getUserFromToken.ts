import { getAccessToken } from "./tokenService";

export type UserRole = "USER" | "MANAGER" | "ADMIN" | null;

export function getUserRoleFromToken(): UserRole {
  const token = getAccessToken();
  if (!token) return null;

  try {
    const [, payloadBase64] = token.split(".");
    if (!payloadBase64) return null;

    // JWT payload 디코딩 (URL-safe 보정)
    const decoded = atob(
      payloadBase64.replace(/-/g, "+").replace(/_/g, "/")
    );
    const payload = JSON.parse(decoded);

    // 백엔드에서 어떤 키를 쓰든 최대한 대응
    const candidates = [
      payload.role,
      payload.auth,
      payload.authority,
      payload.roleType,
      payload.roles,
      payload.authorities,
    ];

    let roleString = "";

    for (const raw of candidates) {
      if (!raw) continue;

      if (typeof raw === "string") {
        roleString = raw;
        break;
      }

      if (Array.isArray(raw)) {
        if (raw.length === 0) continue;
        const first = raw[0];

        if (typeof first === "string") {
          roleString = first;
          break;
        }

        if (first && typeof first === "object") {
          if ("authority" in first) {
            roleString = String(first.authority);
            break;
          }
          if ("role" in first) {
            roleString = String(first.role);
            break;
          }
        }
      }

      if (typeof raw === "object") {
        if ("authority" in raw) {
          roleString = String(raw.authority);
          break;
        }
        if ("role" in raw) {
          roleString = String(raw.role);
          break;
        }
      }
    }

    roleString = roleString.toUpperCase();

    if (roleString.includes("ADMIN")) return "ADMIN";
    if (roleString.includes("MANAGER")) return "MANAGER";
    if (roleString.includes("USER")) return "USER";

    return null;
  } catch (e) {
    console.error("Failed to parse access_token role", e);
    return null;
  }
}