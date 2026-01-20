import * as S from "./style"
import arrow from "../../assets/arrow.png"
import lock from "../../assets/lock.png"
import user from "../../assets/user.svg"
import noneSee from "../../assets/noneSee.png"
import see from "../../assets/see.png"
import {type MyPwResetProps} from "../../types/myPwResetTypes"
import danger from "../../assets/danger.png"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

export function MyPwResetInput({
  username,
  nowPassword,
  newPassword,
  confirmPassword,
  usernameError,
  nowPasswordError,
  newPasswordError,
  confirmPasswordError,
  isLoading,
  handleUsernameChange,
  handleNowPasswordChange,
  handlePasswordChange,
  handleConfirmPasswordChange,
  onSubmit,
}: MyPwResetProps) {
  const navigate = useNavigate();

  const [showNowPassword, setShowNowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handlePrevious = () => {
    navigate("/My");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoading) onSubmit();
  };

  const hasUsernameError = !!usernameError;
  const hasUsernameValue = username.length > 0;

  const hasNowPasswordError = !!nowPasswordError;
  const hasNowPasswordValue = nowPassword.length > 0;

  const hasNewPasswordError = !!newPasswordError;
  const hasNewPasswordValue = newPassword.length > 0;

  const hasConfirmPasswordError = !!confirmPasswordError;
  const hasConfirmPasswordValue = confirmPassword.length > 0;

  return (
    <S.Container as="form" onSubmit={handleSubmit}>
      <S.Content>
        <S.TextContent>
          <S.Arrow src={arrow} onClick={handlePrevious} alt="뒤로가기" />
          <S.Title>비밀번호 재설정</S.Title>
          <S.SubTitle>내 비밀번호를 변경합니다</S.SubTitle>
        </S.TextContent>

        <S.InputContent>
          {/* username */}
          <S.PasswordInputContainer>
            <S.PasswordInputTextContent>
              <img src={user} alt="아이디" />
              <S.PasswordInputText>아이디</S.PasswordInputText>
            </S.PasswordInputTextContent>

            <S.PasswordInputContent
              hasError={hasUsernameError}
              hasValue={hasUsernameValue}
            >
              <S.PasswordInput
                type="text"
                placeholder="아이디를 입력하세요"
                value={username}
                onChange={(e) => handleUsernameChange(e.target.value)}
              />
            </S.PasswordInputContent>
          </S.PasswordInputContainer>

          {usernameError && (
            <S.ErrorMessageContent>
              <img src={danger} alt="에러" />
              <S.ErrorMessage>{usernameError}</S.ErrorMessage>
            </S.ErrorMessageContent>
          )}

          {/* 현재 비밀번호 */}
          <S.PasswordInputContainer>
            <S.PasswordInputTextContent>
              <img src={lock} alt="현재 비밀번호" />
              <S.PasswordInputText>현재 비밀번호</S.PasswordInputText>
            </S.PasswordInputTextContent>

            <S.PasswordInputContent
              hasError={hasNowPasswordError}
              hasValue={hasNowPasswordValue}
            >
              <S.PasswordInput
                type={showNowPassword ? "text" : "password"}
                placeholder="현재 비밀번호를 입력하세요"
                value={nowPassword}
                onChange={(e) => handleNowPasswordChange(e.target.value)}
              />

              <S.SeeButton
                hasError={hasNowPasswordError}
                hasValue={hasNowPasswordValue}
                src={showNowPassword ? see : noneSee}
                alt="비밀번호 보기"
                onClick={() => setShowNowPassword((prev) => !prev)}
              />
            </S.PasswordInputContent>
          </S.PasswordInputContainer>

          {nowPasswordError && (
            <S.ErrorMessageContent>
              <img src={danger} alt="에러" />
              <S.ErrorMessage>{nowPasswordError}</S.ErrorMessage>
            </S.ErrorMessageContent>
          )}

          {/* 새 비밀번호 */}
          <S.PasswordInputContainer>
            <S.PasswordInputTextContent>
              <img src={lock} alt="새 비밀번호" />
              <S.PasswordInputText>새 비밀번호</S.PasswordInputText>
            </S.PasswordInputTextContent>

            <S.PasswordInputContent
              hasError={hasNewPasswordError}
              hasValue={hasNewPasswordValue}
            >
              <S.PasswordInput
                type={showNewPassword ? "text" : "password"}
                placeholder="새 비밀번호를 입력하세요"
                value={newPassword}
                onChange={(e) => handlePasswordChange(e.target.value)}
              />

              <S.SeeButton
                hasError={hasNewPasswordError}
                hasValue={hasNewPasswordValue}
                src={showNewPassword ? see : noneSee}
                alt="비밀번호 보기"
                onClick={() => setShowNewPassword((prev) => !prev)}
              />
            </S.PasswordInputContent>
          </S.PasswordInputContainer>

          {newPasswordError && (
            <S.ErrorMessageContent>
              <img src={danger} alt="에러" />
              <S.ErrorMessage>{newPasswordError}</S.ErrorMessage>
            </S.ErrorMessageContent>
          )}

          {/* 비밀번호 확인 */}
          <S.PasswordInputContainer>
            <S.PasswordInputTextContent>
              <img src={lock} alt="비밀번호 확인" />
              <S.PasswordInputText>비밀번호 확인</S.PasswordInputText>
            </S.PasswordInputTextContent>

            <S.PasswordInputContent
              hasError={hasConfirmPasswordError}
              hasValue={hasConfirmPasswordValue}
            >
              <S.PasswordInput
                type={showConfirmPassword ? "text" : "password"}
                placeholder="비밀번호를 다시 입력하세요"
                value={confirmPassword}
                onChange={(e) =>
                  handleConfirmPasswordChange(e.target.value)
                }
              />

              <S.SeeButton
                hasError={hasConfirmPasswordError}
                hasValue={hasConfirmPasswordValue}
                src={showConfirmPassword ? see : noneSee}
                alt="비밀번호 보기"
                onClick={() =>
                  setShowConfirmPassword((prev) => !prev)
                }
              />
            </S.PasswordInputContent>
          </S.PasswordInputContainer>

          {confirmPasswordError && (
            <S.ErrorMessageContent>
              <img src={danger} alt="에러" />
              <S.ErrorMessage>{confirmPasswordError}</S.ErrorMessage>
            </S.ErrorMessageContent>
          )}

          <S.NextButton type="submit" disabled={isLoading}>
            {isLoading ? "처리 중..." : "확인"}
          </S.NextButton>
        </S.InputContent>
      </S.Content>
    </S.Container>
  );
}

export default MyPwResetInput;