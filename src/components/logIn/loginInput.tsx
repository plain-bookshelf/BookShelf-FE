import * as S from "./style";
import user from '../../assets/deleteUser.png';
import lock from '../../assets/lock.png';
import noneSee from '../../assets/noneSee.png';
import see from '../../assets/see.png';
import danger from '../../assets/danger.png';
import { useState } from "react";

interface LoginInputProps {
  identifier: string
  password: string
  error: string
  loginError: boolean
  onEmailChange: (value: string) => void
  onPasswordChange: (value: string) => void
  onSubmit: () => void
  isLoading: boolean
}

export function LoginInput({
  identifier,
  password,
  error,
  loginError,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  isLoading,
}: LoginInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit()
  }
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onSubmit()
    }
  }
  return (
    <>
      <S.LogInContent>
        <S.TextContainer>
          <S.TextContent>
            <S.LogInText>로그인</S.LogInText>
            <S.LinkContent>
              <S.IdPasswordFind to="/idPasswordFind">아이디/비밀번호 찾기</S.IdPasswordFind>
              <S.SignUpText to="/emailRegistration">계정이 없으신가요?</S.SignUpText>
            </S.LinkContent>
          </S.TextContent>
        </S.TextContainer>
        <S.InputContainer as="form" onSubmit={handleSubmit}>
          <S.IdInputContainer>
            <S.IdInputTextContent>
              <S.IdInputImg src={user} alt="user icon" />
              <S.IdInputText>아이디</S.IdInputText>
            </S.IdInputTextContent>
            <S.IdInputContent hasError={loginError}>
              <S.IdInput
                type="text"
                placeholder="아이디 또는 이메일을 입력해 주세요"
                value={identifier}
                onChange={(e) => onEmailChange(e.target.value)}
                onKeyDown={handleKeyPress}
                disabled={isLoading}
              />
            </S.IdInputContent>
          </S.IdInputContainer>
          <S.PasswordInputContainer>
            <S.PasswordInputTextContent>
              <S.PasswordInputImg src={lock} alt="lock icon"/>
              <S.PasswordInputText>비밀번호</S.PasswordInputText>
            </S.PasswordInputTextContent>
            <S.PasswordInputContent hasError={loginError}>  
              <S.PasswordInput
                type= {showPassword ? "text" : "password"}
                placeholder="비밀번호를 입력해 주세요"
                value={password}
                onChange={(e) => onPasswordChange(e.target.value)}
                onKeyDown={handleKeyPress}
                disabled={isLoading}
              />
            {password.length > 0 && 
            <S.SeeButton 
              src={showPassword ? see : noneSee}
              onClick={togglePasswordVisibility}
              hasError={loginError}
            />}
            </S.PasswordInputContent>
          </S.PasswordInputContainer>
          {error && <S.ErrorMessageContent>
            <img src={danger}/>
            <S.ErrorMessage>{error}</S.ErrorMessage>
          </S.ErrorMessageContent>}
          <S.Button type="submit" onClick={onSubmit} disabled={isLoading}>로그인</S.Button>
        </S.InputContainer>
      </S.LogInContent>
    </>
  )
};

export default LoginInput;