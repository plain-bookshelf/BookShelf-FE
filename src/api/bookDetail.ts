import type { BookDetailData, CollectionItem } from "../types/bookTypes";
import axiosInstance from "./apiClient";
import { getAccessToken } from "../utils/tokenService";
import undefindImg from "../assets/undefindImg.png";
import axios from "axios";

interface CollectionInfoDto {
  affiliation: string;
  registration_number: string;
  call_number: string;
  rental_status: boolean;
}

interface BookDetailApiData {
  book_id: number;
  book_name: string;
  publisher: string | null;
  book_image_url: string | null;
  book_introduction: string | null;
  book_type: string | null;
  book_date: string | null;
  like_count: number;
  collection_information_response_dtos: CollectionInfoDto[];
  review_response_dtos: unknown[];
}

interface BookDetailApiResponse {
  status: string;
  message: string;
  data: BookDetailApiData;
}

const mapCollection = (dtos: CollectionInfoDto[]): CollectionItem[] =>
  dtos.map((item) => ({
    id: item.registration_number,
    library: item.affiliation,
    callNumber: item.call_number,
    status: item.rental_status,
    dueDate: undefined,
  }));

const mapToBookDetailData = (data: BookDetailApiData): BookDetailData => {
  const collection = mapCollection(data.collection_information_response_dtos);

  return {
    bookId: data.book_id,
    title: data.book_name,
    coverImage: data.book_image_url ?? undefindImg,
    author: "",
    publisher: data.publisher ?? "",
    pubYear: data.book_date ? Number(data.book_date.slice(0, 4)) : undefined,
    registrationId: collection[0]?.id ?? "",
    releaseDate: data.book_date ?? "",
    summary: data.book_introduction ?? "등록된 소개가 없습니다.",
    categories: data.book_type ? [data.book_type] : [],
    collection,
  };
};

/**
 * 서버 진실 기반 상세 조회
 * - 토큰이 없으면 즉시 NO_TOKEN 에러
 * - 성공 구조 검증 엄격
 * - UI는 이 반환값만으로 갱신됨 (호출부가 로컬 변형 금지)
 */
export const getBookDetail = async (
  bookId: number | string
): Promise<BookDetailData> => {
  console.log("[getBookDetail] 호출, bookId =", bookId);

  const token = getAccessToken();
  if (!token) {
    // 호출부에서 로그인 페이지로 안전하게 이동하도록 고의 에러
    throw new Error("NO_TOKEN");
  }

  try {
    const res = await axiosInstance.get<BookDetailApiResponse>(`/book/${bookId}`);
    console.log("[getBookDetail] 응답:", res.data);

    if (!res.data || res.data.status !== "OK" || !res.data.data) {
      console.error("[getBookDetail] INVALID_RESPONSE:", res.data);
      throw new Error("INVALID_RESPONSE");
    }

    return mapToBookDetailData(res.data.data);
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      const status = err.response?.status;
      console.error("[getBookDetail] 응답 에러:", status, err.response?.data);

      if (status === 401) throw new Error("UNAUTHORIZED");
      if (status === 404) throw new Error("NOT_FOUND");
    } else if (err instanceof Error) {
      console.error("[getBookDetail] 요청 보냈지만 응답 없음:", err.message);
    } else {
      console.error("[getBookDetail] 구성 에러:", err);
    }

    throw new Error("FETCH_FAILED");
  }
};

