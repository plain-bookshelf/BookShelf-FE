import React, { useEffect, useRef, useState } from 'react';
import CommentForm from './commentForm';
import CommentList from './commentList';
import * as S from '../bookDetail/style';
import { postCommentWrite, postCommentLike, deleteComment } from '../../api/commentApi';
import { getMyInfo } from '../../api/my';
import { useUser } from '../contexts/UserContext';
import type { Comment } from '../../types/bookTypes';
import userProfile from '../../assets/user.svg';

interface ReviewSectionProps {
  bookId: number | string;
}

const makeTempId = () => `temp-${Date.now()}-${Math.random().toString(16).slice(2)}`;
const isTempId = (id: string | number) => typeof id === 'string' && id.startsWith('temp-');

const extractCommentId = (res: any): string | number | undefined => {
  const candidates = [
    res?.data,
    res?.data?.data,
    res?.data?.commentId,
    res?.data?.data?.commentId,
    res?.data?.id,
    res?.data?.data?.id,
    res?.data?.reviewId,
    res?.data?.data?.reviewId,
    res?.data?.review_id,
    res?.data?.data?.review_id,
    // 혹시 result에 감싸서 주는 서버도 있어 추가
    res?.data?.result?.commentId,
    res?.data?.result?.id,
  ];

  for (const v of candidates) {
    if (typeof v === 'number' || typeof v === 'string') return v;
  }
  return undefined;
};

// postCommentLike/deleteComment가 boolean / AxiosResponse / false 를 반환하더라도 안전하게 처리
const isOkResponse = (res: unknown): boolean => {
  if (res === false || res == null) return false;
  if (typeof res === 'boolean') return res;

  if (typeof res === 'object') {
    const anyRes: any = res;
    // AxiosResponse 형태
    if ('data' in anyRes) {
      const d = anyRes.data;
      return d === true || d?.data === true || d?.status === 'OK';
    }
  }
  return false;
};

const ReviewSection: React.FC<ReviewSectionProps> = ({ bookId }) => {
  const { user, setUser } = useUser();
  const [comments, setComments] = useState<Comment[]>([]);
  // id 비교 꼬임 방지: string으로 통일
  const [likedCommentIds, setLikedCommentIds] = useState<string[]>([]);

  //getMyInfo 중복 호출 방지(탭 재진입/StrictMode)
  const didSyncRef = useRef(false);

  useEffect(() => {
    const syncMyInfo = async () => {
      if (!user?.id) return;

      // 중복 호출 방지
      if (didSyncRef.current) return;
      didSyncRef.current = true;

      // 이미 닉/프로필 있으면 굳이 호출 안 함(토큰 요청 줄이기)
      if (user.nickName && user.img) return;

      try {
        const res = await getMyInfo(user.id);
        const payload = res?.data?.data || res?.data || {};
        setUser({
          id: user.id,
          name: payload.name ?? user.name ?? '',
          nickName: payload.nick_name ?? user.nickName ?? '',
          img: payload.member_profile ?? user.img ?? '',
          email: payload.email ?? user.email ?? '',
        });
      } catch (e) {
        console.warn('getMyInfo 실패:', e);
        // 실패 시 다음에 다시 시도하고 싶으면:
        // didSyncRef.current = false;
      }
    };

    syncMyInfo();
  }, [user?.id, user?.nickName, user?.img, setUser]);

  const handleAddComment = async (newText: string) => {
    const trimmed = newText.trim();
    if (!trimmed) return;

    if (!user?.id) {
      alert('로그인 후 댓글 작성이 가능합니다.');
      return;
    }

    try {
      const res = await postCommentWrite(bookId, trimmed);

      // ✅ 서버가 id 안 주면 임시 id로라도 화면에 표시
      const serverId = extractCommentId(res);
      const id = serverId ?? makeTempId();

      const newComment: Comment = {
        id,
        userId: String(user.id),
        user: user.nickName || user.name || '사용자',
        text: trimmed,
        date: new Date().toISOString(),
        likes: 0,
        profileImg: user.img || userProfile,
      };

      setComments((prev) => [newComment, ...prev]);

      // 서버가 id를 안 준 케이스는 나중에 “재조회로 동기화”하는 게 정석
      if (!serverId) {
        console.warn('서버에서 commentId를 안 줘서 임시 ID로 표시 중:', res);
      }
    } catch (e: any) {
      console.error('댓글 작성 실패:', e);
      alert(e?.message || '댓글 작성 중 오류가 발생했습니다.');
    }
  };

  const handleToggleLike = async (commentId: string | number) => {
    if (commentId === undefined || commentId === null || commentId === '') {
      alert('댓글 ID가 없어 좋아요를 할 수 없습니다.');
      return;
    }

    if (!user?.id) {
      alert('로그인 후 좋아요가 가능합니다.');
      return;
    }

    // if (isTempId(commentId)) {
    //   alert('방금 작성한 댓글은 서버 동기화 후 좋아요가 가능합니다.');
    //   return;
    // }

    const id = String(commentId);
    const isCurrentlyLiked = likedCommentIds.includes(id);

    try {
      const res = await postCommentLike(commentId);

      if (!isOkResponse(res)) {
        throw new Error('좋아요 처리 결과를 확인할 수 없습니다.');
      }

      setLikedCommentIds((prev) =>
        isCurrentlyLiked ? prev.filter((x) => x !== id) : [...prev, id],
      );

      setComments((prev) =>
        prev.map((c) =>
          String(c.id) === id
            ? { ...c, likes: isCurrentlyLiked ? Math.max(0, c.likes - 1) : c.likes + 1 }
            : c,
        ),
      );
    } catch (e: any) {
      console.error('좋아요 처리 실패:', e);
      alert(e?.message || '좋아요 처리 중 오류가 발생했습니다.');
    }
  };

  const onDeleteComment = async (commentId: string | number) => {
    // if (commentId === undefined || commentId === null || commentId === '') {
    //   alert('댓글 ID가 없어 삭제할 수 없습니다.');
    //   return;
    // }

    if (!user?.id) {
      alert('로그인 후 삭제가 가능합니다.');
      return;
    }

    if (isTempId(commentId)) {
      alert('방금 작성한 댓글은 서버 동기화 후 삭제가 가능합니다.');
      return;
    }

    if (!window.confirm('정말로 이 댓글을 삭제하시겠습니까?')) return;

    const id = String(commentId);

    try {
      const res = await deleteComment(commentId);

      // deleteComment가 void를 리턴할 수도 있으니, void면 성공으로 간주
      if (res !== undefined && !isOkResponse(res)) {
        throw new Error('삭제 처리 결과를 확인할 수 없습니다.');
      }

      setComments((prev) => prev.filter((c) => String(c.id) !== id));
      setLikedCommentIds((prev) => prev.filter((x) => x !== id));
      alert('댓글이 성공적으로 삭제되었습니다.');
    } catch (e: any) {
      console.error('댓글 삭제 실패:', e);
      alert(e?.message || '댓글 삭제 중 오류가 발생했습니다.');
    }
  };

  return (
    <S.CollectionContainer>
      <div style={{ width: '1440px', padding: '20px 0' }}>
        <CommentForm onAddComment={handleAddComment} disabled={!user?.id} />
        <S.Divider />
        <CommentList
          comments={comments}
          onToggleLike={handleToggleLike}
          likedCommentIds={likedCommentIds}
          onDeleteComment={onDeleteComment}
          currentUserId={user?.id ? String(user.id) : ''}
        />
      </div>
    </S.CollectionContainer>
  );
};

export default ReviewSection;

