// /api/commentApi.ts — 댓글 작성/좋아요/삭제 API
import axios from "axios";
import axiosInstance from "./apiClient";

/** 댓글 작성 응답 (201 CREATED)
 *  data에 commentId(long)가 온다고 가정 (number로 사용)
 */
export interface CommentWriteResponse {
  status: "CREATED";
  message: string;
  data: number | { commentId: number }; // ✅ 수정
}

/** 댓글 좋아요 응답 (201 CREATED) */
export interface CommentLikeResponse {
  status: "CREATED";
  message: string;
  data: boolean;
}

/** 댓글 삭제 응답 (204 NO_CONTENT) */
export interface CommentDeleteResponse {
  status: "NO_CONTENT";
  message: string;
  data: string;
}

const COMMENT_BASE = "/api/book/comment";

/** 댓글 작성: POST /api/book/comment/write?bookId= */
export const postCommentWrite = async (
  bookId: number | string,
  chat: string
): Promise<CommentWriteResponse> => {
  if (!bookId && bookId !== 0) throw new Error("bookId가 필요합니다.");
  if (!chat || !chat.trim()) throw new Error("댓글 내용을 입력해주세요.");

  try {
    const res = await axiosInstance.post<CommentWriteResponse>(
      `${COMMENT_BASE}/write`,
      { chat },
      { params: { bookId }, headers: { "Content-Type": "application/json" } }
    );

    if (res.status === 201 && res.data?.status === "CREATED") {
      // ✅ 여기서 commentId가 진짜 있는지 한 번 더 방어
      const d = res.data.data as any;
      const commentId =
        typeof d === "number" ? d :
        d && typeof d === "object" && typeof d.commentId === "number" ? d.commentId :
        undefined;

      if (typeof commentId !== "number") {
        throw new Error("서버에서 commentId를 받지 못했습니다.");
      }

      return res.data;
    }

    throw new Error(res.data?.message || "댓글 작성 중 알 수 없는 오류가 발생했습니다.");
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const message = (error.response?.data as { message?: string } | undefined)?.message;

      if (status === 404) throw new Error(message || "대상 도서를 찾을 수 없습니다.");
      if (message) throw new Error(message);
    }
    throw new Error("댓글 작성 요청 중 오류가 발생했습니다.");
  }
};

/** 댓글 좋아요: POST /api/book/comment/like?commentId=
 *  ✅ commentId는 number로 통일
 */
export const postCommentLike = async (commentId: number): Promise<CommentLikeResponse> => {
  if (!commentId && commentId !== 0) throw new Error("commentId가 필요합니다.");

  try {
    const res = await axiosInstance.post<CommentLikeResponse>(
      `${COMMENT_BASE}/like`,
      {},
      { params: { commentId }, headers: { "Content-Type": "application/json" } }
    );

    if (res.status === 201 && res.data?.status === "CREATED" && res.data?.data === true) {
      return res.data;
    }

    throw new Error(res.data?.message || "댓글 좋아요 처리 중 알 수 없는 오류가 발생했습니다.");
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const apiMessage = (error.response?.data as { message?: string } | undefined)?.message;

      if (status === 400) throw new Error("회원정보가 일치하지 않습니다. (NOT_VALID_MEMBER_INFO)");
      if (status === 404) throw new Error("댓글이 존재하지 않습니다. (BOOK_COMMENT_NOT_FOUND)");
      if (apiMessage) throw new Error(apiMessage);
    }
    throw new Error("댓글 좋아요 요청 중 오류가 발생했습니다.");
  }
};

/** 댓글 삭제: PATCH /api/book/comment/delete?commentId=
 *  ✅ commentId는 number로 통일
 */
export const deleteComment = async (commentId: number): Promise<CommentDeleteResponse> => {
  if (!commentId && commentId !== 0) throw new Error("commentId가 필요합니다.");

  try {
    const res = await axiosInstance.patch<CommentDeleteResponse>(
      `${COMMENT_BASE}/delete`,
      {},
      { params: { commentId }, headers: { "Content-Type": "application/json" } }
    );

    if (res.status === 204) {
      return (
        res.data || {
          status: "NO_CONTENT",
          message: "successfully comment retouched",
          data: "",
        }
      );
    }

    if (res.data?.status === "NO_CONTENT") return res.data;

    throw new Error(res.data?.message || "댓글 삭제 처리 중 알 수 없는 오류가 발생했습니다.");
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const apiMessage = (error.response?.data as { message?: string } | undefined)?.message;

      if (status === 400) throw new Error("회원정보가 일치하지 않습니다. (NOT_VALID_MEMBER_INFO)");
      if (status === 404) throw new Error("댓글이 존재하지 않습니다. (BOOK_COMMENT_NOT_FOUND)");
      if (apiMessage) throw new Error(apiMessage);
    }
    throw new Error("댓글 삭제 요청 중 오류가 발생했습니다.");
  }
};