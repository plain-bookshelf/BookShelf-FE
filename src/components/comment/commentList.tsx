import React from 'react';
import * as S from './commentStyle';
import type { Comment } from '../../types/bookTypes';
import user from "../../assets/user.svg";
import like from '../../assets/like.svg'

interface CommentListProps {
  comments: Comment[];
  onToggleLike: (commentId: string | number) => Promise<void>;
  likedCommentIds: string[]; // ✅ string으로 통일
  onDeleteComment: (commentId: string | number) => Promise<void>;
  currentUserId: string;
}

const isTempId = (id: string | number) => typeof id === 'string' && id.startsWith('temp-');

const formatRelativeTime = (dateString: string): string => {
  const commentDate = new Date(dateString).getTime();
  const now = Date.now();
  const diffMinutes = Math.floor((now - commentDate) / (1000 * 60));

  const MINUTES_IN_HOUR = 60;
  const MINUTES_IN_DAY = 24 * MINUTES_IN_HOUR;

  if (diffMinutes < 1) return '방금 전';
  if (diffMinutes < MINUTES_IN_HOUR) {
    const roundedMinutes = Math.floor(diffMinutes / 10) * 10;
    const displayMinutes = roundedMinutes === 0 ? 10 : roundedMinutes;
    return `${displayMinutes}분 전`;
  }
  if (diffMinutes < MINUTES_IN_DAY) {
    const hours = Math.floor(diffMinutes / MINUTES_IN_HOUR);
    return `${hours}시간 전`;
  }
  const days = Math.floor(diffMinutes / MINUTES_IN_DAY);
  return `${days}일 전`;
};

const CommentList: React.FC<CommentListProps> = ({
  comments,
  onToggleLike,
  likedCommentIds,
  currentUserId,
  onDeleteComment
}) => {
  return (
    <S.ListWrapper>
      <h2>리뷰 ({comments.length}개)</h2>

      {comments.map((comment, idx) => {
        const id = comment.id;
        const idStr = String(id ?? '');
        const hasValidId = id !== undefined && id !== null && idStr !== '';
        const temp = hasValidId && isTempId(id);

        const isLiked = hasValidId ? likedCommentIds.includes(idStr) : false;
        const isMyComment = String(comment.userId ?? '') === currentUserId;

        return (
          <S.CommentItemWrapper key={hasValidId ? idStr : `no-id-${idx}`}>
            <S.CommentItemContent>
              <S.UserProfileContent>
                <S.UserProfile src={comment.profileImg || user} alt={`${comment.user}프로필`} />
              </S.UserProfileContent>

              <S.CommentTextContent>
                <S.CommentHeader>
                  <S.CommentUser>{comment.user}</S.CommentUser>
                  <span>{formatRelativeTime(comment.date)}</span>
                </S.CommentHeader>

                <S.CommentText>{comment.text}</S.CommentText>

                <S.CommentBottomContent>
                  <S.LikeButton
                    onClick={() => {
                      if (!hasValidId) {
                        alert('이 댓글은 ID가 없어 좋아요를 할 수 없습니다.');
                        console.warn('No comment id:', comment);
                        return;
                      }
                      if (temp) {
                        alert('임시 댓글은 서버 동기화 후 좋아요가 가능합니다.');
                        return;
                      }
                      onToggleLike(id);
                    }}
                    style={{ opacity: !hasValidId || temp ? 0.4 : 1 }}
                  >
                    <S.Like $isLiked={isLiked} src={like} alt="좋아요" />
                    <S.LikeNumber>{comment.likes}</S.LikeNumber>
                  </S.LikeButton>

                  {isMyComment && (
                    <S.DeleteButton
                      onClick={() => {
                        if (!hasValidId) {
                          alert('이 댓글은 ID가 없어 삭제할 수 없습니다.');
                          console.warn('No comment id:', comment);
                          return;
                        }
                        if (temp) {
                          alert('임시 댓글은 서버 동기화 후 삭제가 가능합니다.');
                          return;
                        }
                        onDeleteComment(id);
                      }}
                      style={{ opacity: !hasValidId || temp ? 0.4 : 1 }}
                    >
                      삭제
                    </S.DeleteButton>
                  )}
                </S.CommentBottomContent>
              </S.CommentTextContent>
            </S.CommentItemContent>
          </S.CommentItemWrapper>
        );
      })}

      {comments.length === 0 && (
        <p style={{ textAlign: 'center', color: '#888' }}>작성된 리뷰가 없습니다.</p>
      )}
    </S.ListWrapper>
  );
};

export default CommentList;
