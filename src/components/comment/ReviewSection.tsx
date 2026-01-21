import React, { useEffect, useState } from 'react';
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

const isTempId = (id: string | number) => typeof id === 'string' && id.startsWith('temp-');

const extractCommentId = (res: any): string | number | undefined => {
  const candidates = [
    res?.data,
    res?.data?.data,
    res?.data?.commentId,
    res?.data?.data?.commentId,
    res?.data?.id,
    res?.data?.data?.id,
    res?.commentId,
    res?.id,
  ];

  for (const v of candidates) {
    if (typeof v === 'number' || typeof v === 'string') return v;
  }
  return undefined;
};

const ReviewSection: React.FC<ReviewSectionProps> = ({ bookId }) => {
  const { user, setUser } = useUser();
  const [comments, setComments] = useState<Comment[]>([]);
  const [likedCommentIds, setLikedCommentIds] = useState<(number | string)[]>([]);

  const currentUserId = user?.id != null ? String(user.id) : '';

  useEffect(() => {
    const syncMyInfo = async () => {
      try {
        if (!user?.id) return;
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
      }
    };
    syncMyInfo();
  }, [user?.id, setUser]);

  // 댓글 작성 (서버 성공 후에만 UI 반영)
  const handleAddComment = async (newText: string) => {
    const trimmed = newText.trim();
    if (!trimmed) return;

    if (!user?.id) {
      alert('로그인 후 댓글 작성이 가능합니다.');
      return;
    }

    try {
      const res = await postCommentWrite(bookId, trimmed);
      const commentIdFromServer = extractCommentId(res);

      if (!commentIdFromServer) {
        alert('댓글은 작성되었지만 ID를 받지 못해 목록 반영이 어렵습니다. 새로고침 후 확인해 주세요.');
        return;
      }

      const newComment: Comment = {
        id: commentIdFromServer,
        userId: String(user.id),
        user: user.nickName || user.name || '사용자',
        text: trimmed,
        date: new Date().toISOString(),
        likes: 0,
        profileImg: user.img || userProfile,
      };

      setComments((prev) => [newComment, ...prev]);
    } catch (e: any) {
      console.error('댓글 작성 실패:', e);
      alert(e?.message || '댓글 작성 중 오류가 발생했습니다.');
    }
  };

  // 좋아요 (낙관적 업데이트 제거: 서버 성공 후 UI 반영)
  const handleToggleLike = async (commentId: string | number) => {
    if (!user?.id) {
      alert('로그인 후 좋아요가 가능합니다.');
      return;
    }
    if (isTempId(commentId)) {
      alert('방금 작성한 댓글은 서버 동기화 후 좋아요가 가능합니다. 새로고침 후 이용해주세요.');
      return;
    }

    const isCurrentlyLiked = likedCommentIds.includes(commentId);

    try {
      const res = await postCommentLike(commentId);
      if (res?.data !== true) throw new Error('좋아요 처리 결과를 확인할 수 없습니다.');

      // ✅ 성공 후에만 반영
      setLikedCommentIds((prev) =>
        isCurrentlyLiked ? prev.filter((id) => id !== commentId) : [...prev, commentId],
      );

      setComments((prev) =>
        prev.map((c) =>
          c.id === commentId
            ? { ...c, likes: isCurrentlyLiked ? Math.max(0, c.likes - 1) : c.likes + 1 }
            : c,
        ),
      );
    } catch (e: any) {
      console.error('좋아요 처리 실패:', e);
      alert(e?.message || '좋아요 처리 중 오류가 발생했습니다.');
    }
  };

  // 댓글 삭제 (서버 성공 후 UI 반영)
  const onDeleteComment = async (commentId: string | number) => {
    if (!user?.id) {
      alert('로그인 후 삭제가 가능합니다.');
      return;
    }
    if (isTempId(commentId)) {
      alert('방금 작성한 댓글은 서버 동기화 후 삭제가 가능합니다. 새로고침 후 이용해주세요.');
      return;
    }

    if (!window.confirm('정말로 이 댓글을 삭제하시겠습니까?')) return;

    try {
      await deleteComment(commentId);

      // ✅ 성공 후에만 반영
      setComments((prev) => prev.filter((c) => c.id !== commentId));
      setLikedCommentIds((prev) => prev.filter((id) => id !== commentId));

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
          currentUserId={currentUserId}
        />
      </div>
    </S.CollectionContainer>
  );
};

export default ReviewSection;
