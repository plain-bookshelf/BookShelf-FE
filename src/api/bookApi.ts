import axiosInstance from "./apiClient";
import axios, { AxiosError } from "axios";

/** 서버 공통 응답 Envelope */
export interface ApiEnvelope<T = unknown> {
  status: string;   // e.g., "CREATED"
  message: string;  // e.g., "successfully rental book"
  data: T;          // e.g., ""
}

/** 명세서 기반 에러 메시지 맵핑 */
const pickMessage = (err: AxiosError) => {
  const apiMsg =
    (err.response?.data as { message?: string } | undefined)?.message;
  const status = err.response?.status;

  if (status === 400) return apiMsg || "연체 상태라 대여/예약을 할 수 없습니다. (400)";
  if (status === 403 || status === 409) return apiMsg || "해당 도서를 대여할 수 없습니다. (CONFLICT)";
  if (status === 404) return apiMsg || "해당 도서를 찾을 수 없습니다. (404)";
  if (status === 401) return apiMsg || "로그인 후 이용 가능한 서비스입니다. (401)";
  return apiMsg || "도서 대여 요청 중 오류가 발생했습니다.";
};

/**도서 대여
 * PATCH /api/book/rental?registrationNumber=...
 * 본 함수는 로컬 상태를 절대 변경하지 않음. (UI 갱신은 호출부에서 refetch)
 */ 
export async function requestBookRental(
  registrationNumber: string
): Promise<ApiEnvelope<string>> {
  if (!registrationNumber?.trim()) {
    throw new Error("registrationNumber가 필요합니다.");
  }

  try {
    const res = await axiosInstance.patch<ApiEnvelope<string>>(
      "/api/book/rental",
      {},
      { params: { registrationNumber } }
    );

    if (!res.data || res.data.status !== "CREATED") {
      // 서버를 진실로 삼으므로, 성공 형식 불일치도 실패로 간주
      throw new Error(res.data?.message || "도서 대여에 실패했습니다.");
    }
    return res.data;
  } catch (e: unknown) {
    if (axios.isAxiosError(e)) {
      throw new Error(pickMessage(e));
    }
    throw new Error("도서 대여 중 알 수 없는 오류가 발생했습니다.");
  }
}

/** 명세·상황 기반 에러 메시지 매핑 */
const pickReservationErrorMessage = (err: AxiosError) => {
  const apiMsg = (err.response?.data as { message?: string } | undefined)?.message;
  const status = err.response?.status;

  // 명세의 오류들: 400, 403(CONFLICT로 표기했지만 실서버는 409일 수도 있음), 404, 401
  if (status === 400) return apiMsg || "연체 상태라 대여 및 예약을 할 수 없습니다. (400)";
  if (status === 403 || status === 409) {
    // 가능한 서버 메시지:
    // MEMBER_ALREADY_RESERVATION_OR_RENTAL / ALREADY_RESERVATION_BOOK
    return apiMsg || "이미 대여/예약했거나 예약된 도서입니다. (CONFLICT)";
  }
  if (status === 404) return apiMsg || "해당 도서를 찾을 수 없습니다. (404)";
  if (status === 401) return apiMsg || "로그인이 필요합니다. (401)";
  return apiMsg || "도서 예약 중 알 수 없는 오류가 발생했습니다.";
};



/**
 * 도서 예약 (명세 준수)
 * PATCH /api/book/reservation?reservationNumber=...
 * 본 함수는 로컬 상태를 변경하지 않음. (UI 갱신은 호출부에서 refetch)
 */
export async function reserveBook(
  registrationNumber: string
): Promise<ApiEnvelope<string>> {
  if (!registrationNumber?.trim()) {
    throw new Error("reservationNumber가 필요합니다.");
  }

  try {
    const res = await axiosInstance.patch<ApiEnvelope<string>>(
      "/api/book/reservation",
      {},                                     // 빈 JSON 바디 (명세상 본문 없음)
      { params: { registrationNumber } }       // 쿼리 파라미터
    );

    if (!res.data || res.data.status !== "CREATED") {
      // 서버 형식이 어긋나면 실패로 간주 (서버 메시지 우선)
      throw new Error(res.data?.message || "도서 예약에 실패했습니다.");
    }
    return res.data;
  } catch (e: unknown) {
    if (axios.isAxiosError(e)) {
      throw new Error(pickReservationErrorMessage(e));
    }
    throw new Error("도서 예약 처리 중 오류가 발생했습니다.");
  }
}