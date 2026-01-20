import styled from "styled-components";

export const Container = styled.div`
  width: 620px;
  height: 800px;
  
  border: 1px solid #E7E7E7;
  box-shadow: 1px 1px 10px #E7E7E7;
  border-radius: 15px;
  
  display: flex;
  justify-content: center;
  align-items: center;
`

export const  Content = styled.div`
  width: 500px;
  height: 650px;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

export const TextContent = styled.div`
  width: 400px;
  height: 150px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

export const Arrow = styled.img`
  width: 31px;
  height: 32px;
`

export const Title = styled.h1`
  font-size: 32px;
`

export const SubTitle = styled.p`
  font-size: 17px;
  color: #7D7D7D;
`

export const InputContent = styled.div`
  width: 500px;
  height: 465px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`

interface InputContentProps {
  hasError?: boolean
  hasValue?: boolean
}

export const PasswordInputContainer = styled.div`
  width: 500px;
  height: 86px;

  display: flex;
  flex-direction: column;
`

export const PasswordInputTextContent = styled.div`
  width: 500px;
  height: 25px;

  display: flex;
  align-items: center; 
  gap: 5px;
  
  margin-bottom: 10px;
`

export const PasswordInputImg = styled.img`
  width: 20px;
  height: 20px;
`

export const PasswordInputText = styled.p`
  color: #5D5D5D;
  font-size: 16px;
`

export const PasswordInputContent = styled.div<InputContentProps>`
   width: 500px;
   height: 50px;
   border: 1px solid ${(props) => 
     (props.hasError ? "#FF4444" : 
     (!props.hasError && props.hasValue) ? "#00C471" : 
     "#B9B9B9")
   };
   box-sizing: border-box;
   overflow: hidden;
   border-radius: 10px;
   position: relative;

   &:focus-within {
      /* 포커스 시 테두리 색상 */
      border-color: ${(props) => (props.hasError ? "#FF4444" : "#00C471")};
      outline: none;
      /* 포커스 시 그림자 색상 */
      box-shadow: 0 2px 5px 5px ${(props) => (props.hasError ? "rgba(255, 68, 68, 0.1)" : "rgba(0, 196, 113, 0.1)")};
  }
`

export const PasswordInput = styled.input`
  width: 450px;
  height: 50px;

  padding-left: 15px;
  border: none;
  box-sizing: border-box;
  
  color: #5D5D5D;
  font-size: 16px;
  
    &:focus {
      outline: none;
      border: none;
      box-shadow: none;
  }

  &:disabled {
    background-color: white;
    cursor: not-allowed;
  }
`

interface SeeButtonProps {
  hasError?: boolean
  hasValue?: boolean
}

export const SeeButton = styled.img<SeeButtonProps>`
  width: 25px;
  height: 25px;

  position: absolute;

  top: 13px;
  right: 15px;

  cursor: pointer;
  transition: opacity 0.2s ease;

  ${(props) =>
    props.hasError
      ? `filter: invert(27%) sepia(98%) saturate(7426%) hue-rotate(352deg) brightness(101%) contrast(107%);` // 에러(빨강색 필터)
      : props.hasValue // 에러가 없고, 값이 입력되어 있을 때 (hasValue 사용)
      ? `filter: invert(56%) sepia(50%) saturate(1408%) hue-rotate(124deg) brightness(98%) contrast(101%);` // 초록색 필터 적용
      : ``
  }

  &:hover {
    opacity: 0.7;
  }
`

export const NextButton = styled.button`
  width: 500px;
  height: 55px;
  margin-top: 10px;
  background-color: #00C471;
  border: none;
  color: white;
  font-size: 16px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:active {
    background-color: #00A05D;
  }

  &:disabled{
    cursor: not-allowed;
  }
`

export const ErrorMessageContent = styled.div`
  width: 500px;
  height: 24px;
  display: flex;
  align-items: center;
  gap: 5px;
`

export const ErrorMessage = styled.p`
  color: #FF4444;
  font-size: 16px;

`