import React from 'react';

import * as S from './commentStyle';
import type { Comment } from '../../types/bookTypes';
import user from "../../assets/user.svg";
import like from '../../assets/like.svg'

interface CommentListProps {
  comments: Comment[];
  onToggleLike: (commnetId: string | number) => Promise<void>; 
  likedCommentIds: (number | string)[]; 
  onDeleteComment: (commentId: string | number) => Promise<void>;
  currentUserId: string;
}

const formatRelativeTime = (dateString: string): string => {
  const commentDate = new Date(dateString).getTime();
  const now = Date.now();
  const diffMilliseconds = now - commentDate;
  // 전체 분 차이 (내림)
  const diffMinutes = Math.floor(diffMilliseconds / (1000 * 60)); 

  const MINUTES_IN_HOUR = 60;
  const MINUTES_IN_DAY = 24 * MINUTES_IN_HOUR;

  if (diffMinutes < 1) {
    // 1분 미만: '방금 전'
    return '방금 전';
  } else if (diffMinutes < MINUTES_IN_HOUR) {
    // 1시간 미만: 10분 단위로 내림하여 표시
    const roundedMinutes = Math.floor(diffMinutes / 10) * 10;
    // 1분 이상 9분 이하의 경우 '0분 전' 대신 '10분 전'으로 처리하여 10분 단위 표시를 유지함.
    const displayMinutes = roundedMinutes === 0 ? 10 : roundedMinutes;
    return `${displayMinutes}분 전`;
  } else if (diffMinutes < MINUTES_IN_DAY) {
    // 1일 미만: '시간 전'으로 표시
    const hours = Math.floor(diffMinutes / MINUTES_IN_HOUR);
    return `${hours}시간 전`;
  } else {
    // 1일 이상: '일 전'으로 표시
    const days = Math.floor(diffMinutes / MINUTES_IN_DAY);
    return `${days}일 전`;
  }
};

// props 구조 분해 할당 수정
const CommentList: React.FC<CommentListProps> = ({ comments, onToggleLike, likedCommentIds, currentUserId, onDeleteComment }) => {
  
  return (
    <S.ListWrapper>
      <h2>리뷰 ({comments.length}개)</h2>
      {comments.map((comment) => {
        // 현재 댓글의 좋아요 상태 확인
        const isLiked = likedCommentIds.includes(comment.id);
        const isMyComment = comment.userId === currentUserId;
        
        return (
          <S.CommentItemWrapper key={comment.id}>
            <S.CommentItemContent>
              <S.UserProfileContent>
                <S.UserProfile src={comment.profileImg || user} alt={`${comment.user}프로필`}/>
              </S.UserProfileContent>
              <S.CommentTextContent>
                <S.CommentHeader>
                  <S.CommentUser>{comment.user}</S.CommentUser>
                  <span>{formatRelativeTime(comment.date)}</span>
                </S.CommentHeader>
                <S.CommentText>{comment.text}</S.CommentText>
                <S.CommentBottomContent>
                  {/* LikeButton으로 감싸고 클릭 이벤트 연결 */}
                  <S.LikeButton onClick={() => onToggleLike(comment.id)}> 
                    {/* isLiked 상태에 따라 스타일 반영 */}
                    <S.Like $isLiked={isLiked} src={like} alt="좋아요"/>
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
      {comments.length === 0 && <p style={{ textAlign: 'center', color: '#888' }}>작성된 리뷰가 없습니다.</p>}
    </S.ListWrapper>
  );
};

export default CommentList;