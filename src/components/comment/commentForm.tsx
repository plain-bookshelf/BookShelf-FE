import React, { useState } from 'react';
import * as S from "./commentFormStyle";

interface CommentFormProps {
  onAddComment: (text: string) => void;
}

const MAX_LENGTH = 225;

const CommentForm: React.FC<CommentFormProps> = ({ onAddComment }) => {
  const [commentText, setCommentText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim().length === 0) return;

    onAddComment(commentText);
    setCommentText('');
  };

  const isDisabled = commentText.trim().length === 0 || commentText.length > MAX_LENGTH;


  return (
    <S.FormWrapper>
      <S.FormContainer>
      <h3>댓글 쓰기</h3>
      <form onSubmit={handleSubmit}>
        <S.CommentTextArea
          placeholder="댓글를 작성해 주세요..."
          value={commentText}
          maxLength={MAX_LENGTH}
          onChange={(e) => setCommentText(e.target.value)}
          required
        />
        <S.SubmitButtonContent>
          <S.SubmitButton type="submit" disabled={isDisabled}>작성</S.SubmitButton>
        </S.SubmitButtonContent>
      </form>
      </S.FormContainer>
    </S.FormWrapper>
  );
};

export default CommentForm;