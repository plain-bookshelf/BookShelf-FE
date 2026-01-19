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

/** 임시 댓글 여부 판정 (서버 ID 동기화 전 보호용) */
const isTempId = (id: string | number) => typeof id === 'string' && id.startsWith('temp-');

const ReviewSection: React.FC<ReviewSectionProps> = ({ bookId }) => {
  const { user, setUser } = useUser();            // 전역 유저 정보(Context)
  const [comments, setComments] = useState<Comment[]>([]);
  const [likedCommentIds, setLikedCommentIds] = useState<(number | string)[]>([]);

  /** 마운트/로그인 후 내 정보 최신화 (닉네임/이미지 등) */
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
        console.warn('getMyInfo 실패:', e); // 실패해도 치명적이지 않으니 경고만
      }
    };
    syncMyInfo();
  }, [user?.id]);

  // 댓글 작성
  const handleAddComment = async (newText: string) => {
  const trimmed = newText.trim();
  if (!trimmed) return;

  try {
    const res = await postCommentWrite(bookId, trimmed);

    const commentIdFromServer = typeof res.data === "number"
        ? res.data
        : (res.data as any)?.commentId; 

    if (commentIdFromServer) {
      // commentId를 받았으면 바로 추가 (temp-id 필요없음)
      const newComment: Comment = {
        id: commentIdFromServer,
        userId: user.id,
        user: user.nickName || user.name,
        text: trimmed,
        date: new Date().toISOString(),
        likes: 0,
        profileImg: user.img || userProfile,
      };

      setComments(prev => [newComment, ...prev]);
      return;
    }

  } catch (e: any) {
    console.error("댓글 작성 실패:", e);
    alert(e.message || "댓글 작성 중 오류가 발생했습니다.");
  }
};


  // 좋아요 토글
  const handleToggleLike = async (commentId: string | number) => {
    if (isTempId(commentId)) {
      alert('방금 작성한 댓글은 서버 동기화 후 좋아요가 가능합니다. 새로고침 후 이용해주세요.');
      return;
    }
    const isCurrentlyLiked = likedCommentIds.includes(commentId);
    const target = comments.find(c => c.id === commentId);
    if (!target) return;

    const oldLikes = target.likes;

    //  UI 낙관적 업데이트
    setLikedCommentIds(prev =>
      isCurrentlyLiked ? prev.filter(id => id !== commentId) : [...prev, commentId],
    );
    setComments(prev =>
      prev.map(c =>
        c.id === commentId
          ? { ...c, likes: isCurrentlyLiked ? Math.max(0, c.likes - 1) : c.likes + 1 }
          : c,
      ),
    );

    // 서버 요청
    try {
      const res = await postCommentLike(commentId);
      if (res.data !== true) throw new Error('좋아요 처리 결과를 확인할 수 없습니다.');
    } catch (e: any) {
      console.error('좋아요 요청 실패, 롤백:', e);
      alert(e.message || '좋아요 처리 중 오류가 발생했습니다.');

      //롤백
      setLikedCommentIds(prev =>
        isCurrentlyLiked ? [...prev, commentId] : prev.filter(id => id !== commentId),
      );
      setComments(prev => prev.map(c => (c.id === commentId ? { ...c, likes: oldLikes } : c)));
    }
  };

  //  댓글 삭제
  const onDeleteComment = async (commentId: string | number) => {
    if (isTempId(commentId)) {
      alert('방금 작성한 댓글은 서버 동기화 후 삭제가 가능합니다. 새로고침 후 이용해주세요.');
      return;
    }
    if (!window.confirm('정말로 이 댓글을 삭제하시겠습니까?')) return;

    const originalComments = [...comments];
    try {
      //  UI에서 먼저 제거
      setComments(prev => prev.filter(c => c.id !== commentId));

      //  서버 호출
      await deleteComment(commentId);
      alert('댓글이 성공적으로 삭제되었습니다.');

      //  좋아요 목록에서도 제거
      setLikedCommentIds(prevIds => prevIds.filter(id => id !== commentId));
    } catch (e: any) {
      console.error('댓글 삭제 중 오류 발생 - 롤백:', e);
      alert(e.message || '댓글 삭제 중 오류가 발생했습니다.');
      setComments(originalComments); // 롤백
    }
  };

  return (
    <S.CollectionContainer>
      <div style={{ width: '1440px', padding: '20px 0' }}>
        <CommentForm onAddComment={handleAddComment} />
        <S.Divider />
        <CommentList
          comments={comments}
          onToggleLike={handleToggleLike}
          likedCommentIds={likedCommentIds}
          onDeleteComment={onDeleteComment}
          currentUserId={user.id}
        />
      </div>
    </S.CollectionContainer>
  );
};

export default ReviewSection;