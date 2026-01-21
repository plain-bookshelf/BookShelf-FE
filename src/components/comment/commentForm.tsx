import React, { useState } from 'react';
import * as S from "./commentFormStyle";

interface CommentFormProps {
  onAddComment: (text: string) => void | Promise<void>;
  disabled?: boolean;
}

const MAX_LENGTH = 200;

const CommentForm: React.FC<CommentFormProps> = ({ onAddComment, disabled = false }) => {
  const [commentText, setCommentText] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (disabled) return;

    const trimmed = commentText.trim();
    if (!trimmed) return;

    await Promise.resolve(onAddComment(trimmed));
    setCommentText('');
  };

  const isTooLong = commentText.length > MAX_LENGTH;
  const isEmpty = commentText.trim().length === 0;
  const isDisabled = disabled || isEmpty || isTooLong;

  return (
    <S.FormWrapper>
      <S.FormContainer>
        <h3>댓글 쓰기</h3>
        <form onSubmit={handleSubmit}>
          <S.CommentTextArea
            placeholder={disabled ? "로그인 후 댓글을 작성할 수 있어요." : "댓글을 작성해 주세요..."}
            value={commentText}
            maxLength={MAX_LENGTH}
            onChange={(e) => setCommentText(e.target.value)}
            required={!disabled}
            disabled={disabled}
          />
          <S.SubmitButtonContent>
            <S.SubmitButton type="submit" disabled={isDisabled}>
              작성
            </S.SubmitButton>
          </S.SubmitButtonContent>
        </form>
      </S.FormContainer>
    </S.FormWrapper>
  );
};

export default CommentForm;