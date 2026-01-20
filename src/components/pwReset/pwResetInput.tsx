import * as S from "./style"
import arrow from "../../assets/arrow.png"
import lock from "../../assets/lock.png"
import noneSee from "../../assets/noneSee.png"
import see from "../../assets/see.png"
import {type PwResetProps} from "../../types/pwResetTypes"
import danger from "../../assets/danger.png"
import user from "../../assets/user.svg"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

export function PwResetInput({
  username,
  newPassword, 
  confirmPassword, 
  isLoading,
  usernameError, 
  newPasswordError, 
  confirmPasswordError,
  handleUsernameChange, 
  handlePasswordChange, 
  handleConfirmPasswordChange, 
  onSubmit 
}: PwResetProps) {
  
  const navigate = useNavigate()
  const[showNewPassword, setShowNewPassword] = useState(false)
  const[showConfirmPassword, setShowConfirmPassword] = useState(false)
  
   const PreviousButton = () => {
    navigate("/checkEmailPwReset")
  }

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      onSubmit()
  }

  const hasUsernameError = !!usernameError
  const hasUsernameValue = username.length > 0

  const hasNewPasswordError = !!newPasswordError
  const hasNewPasswordValue = newPassword.length > 0
  
  const hasConfirmPasswordError = !!confirmPasswordError
  const hasConfirmPasswordValue = confirmPassword.length > 0

  return(
    <>
      <S.Container as="form" onSubmit={handleSubmit}>
        <S.Content>
          <S.TextContent>
            <S.Arrow src={arrow} onClick={PreviousButton}/>
            <S.Title>비밀번호 재설정</S.Title>
            <S.SubTitle>비밀번호를 재설정해주세요</S.SubTitle>
          </S.TextContent>
          <S.InputContent>
               <S.PasswordInputContainer>
              <S.PasswordInputTextContent>
                <img src={user}/>
                <S.PasswordInputText>아이디</S.PasswordInputText>
              </S.PasswordInputTextContent>
              <S.PasswordInputContent hasError={hasUsernameError} hasValue={hasUsernameValue}>
                <S.PasswordInput 
                type= "text"
                placeholder="아이디를 다시 입력해 주세요"
                value={username}
                onChange={(e) => handleUsernameChange(e.target.value)}></S.PasswordInput>
              </S.PasswordInputContent>
            </S.PasswordInputContainer>
              {usernameError && 
              <S.ErrorMessageContent>
                <img src={danger}/>
                <S.ErrorMessage>{usernameError}</S.ErrorMessage>
              </S.ErrorMessageContent>} 
            <S.PasswordInputContainer>
              <S.PasswordInputTextContent>
                <img src={lock}/>
                <S.PasswordInputText>새 비밀번호</S.PasswordInputText>
              </S.PasswordInputTextContent>
              <S.PasswordInputContent hasError={hasNewPasswordError} hasValue={hasNewPasswordValue}>
                <S.PasswordInput 
                type={showNewPassword ? "text" : "password"}
                placeholder="새 비밀번호를 입력하세요"
                value={newPassword}
                onChange={(e) => handlePasswordChange(e.target.value)}></S.PasswordInput>
                <S.SeeButton
                hasError={hasNewPasswordError} 
                hasValue={hasNewPasswordValue} 
                src={showNewPassword ? see : noneSee} 
                onClick={() => setShowNewPassword(prev => !prev)}/>
              </S.PasswordInputContent>
            </S.PasswordInputContainer>
              {newPasswordError && 
              <S.ErrorMessageContent>
                <img src={danger}/>
                <S.ErrorMessage>{newPasswordError}</S.ErrorMessage>
              </S.ErrorMessageContent>}              
            <S.PasswordInputContainer>
              <S.PasswordInputTextContent>
                <img src={lock}/>
                <S.PasswordInputText>비밀번호 확인</S.PasswordInputText>
              </S.PasswordInputTextContent>
              <S.PasswordInputContent hasError={hasConfirmPasswordError} hasValue={hasConfirmPasswordValue}>
                <S.PasswordInput 
                type={showConfirmPassword ? "text" : "password"} 
                placeholder="비밀번호를 다시 입력해 주세요"
                value={confirmPassword}
                onChange={(e) => handleConfirmPasswordChange(e.target.value)}></S.PasswordInput>
                <S.SeeButton 
                hasError={hasConfirmPasswordError} 
                hasValue={hasConfirmPasswordValue} 
                src={showConfirmPassword ? see : noneSee} 
                onClick={() => setShowConfirmPassword(prev => !prev)}/>
              </S.PasswordInputContent>
            </S.PasswordInputContainer>
              {confirmPasswordError && 
              <S.ErrorMessageContent>
                <img src={danger}/>
                <S.ErrorMessage>{confirmPasswordError}</S.ErrorMessage>
              </S.ErrorMessageContent>} 
            <S.NextButton type="submit" disabled={isLoading}>확인</S.NextButton>
          </S.InputContent>
        </S.Content>
      </S.Container>
    </>
  )
}

export default PwResetInput 