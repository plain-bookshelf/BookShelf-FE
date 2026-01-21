import React from 'react';
import * as S from './commentStyle';
import type { Comment } from '../../types/bookTypes';
import user from "../../assets/user.svg";
import like from '../../assets/like.svg'

interface CommentListProps {
  comments: Comment[];
  onToggleLike: (commentId: string | number) => Promise<void>;
  likedCommentIds: (number | string)[];
  onDeleteComment: (commentId: string | number) => Promise<void>;
  currentUserId: string;
}

const formatRelativeTime = (dateString: string): string => {
  const commentDate = new Date(dateString).getTime();
  const now = Date.now();
  const diffMilliseconds = now - commentDate;
  const diffMinutes = Math.floor(diffMilliseconds / (1000 * 60));

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

      {comments.map((comment) => {
        const isLiked = likedCommentIds.includes(comment.id);
        const isMyComment = comment.userId === currentUserId;

        return (
          <S.CommentItemWrapper key={comment.id}>
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
                  <S.LikeButton onClick={() => onToggleLike(comment.id)}>
                    <S.Like $isLiked={isLiked} src={like} alt="좋아요" />
                    <S.LikeNumber>{comment.likes}</S.LikeNumber>
                  </S.LikeButton>

                  {isMyComment && (
                    <S.DeleteButton onClick={() => onDeleteComment(comment.id)}>
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