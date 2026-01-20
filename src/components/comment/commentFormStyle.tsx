import styled from 'styled-components';

export const FormWrapper = styled.div`
  padding: 20px;
  border: 1px solid #ADADAD;
  box-shadow: 10px 10px 10px 1px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  margin-bottom: 20px;
`

export const FormContainer = styled.div`
  width: 1350px;
  height: 220px;
  display: flex;
  flex-direction: column;
`

export const CommentTextArea = styled.textarea`
  width: 1350px;
  height: 100px;
  padding: 15px;
  font-family: Noto;
  margin-bottom: 10px;
  border: 1px solid #00C471;
  box-sizing: border-box;
  border-radius: 10px;
  resize: none;
  font-size: 15px;
  color:#5D5D5D;
  font-weight: 500;

  :focus{
    box-shadow: 2px 5px 5px rgba(255, 68, 68, 0.1);
  }
`;

export const SubmitButtonContent = styled.div`
  width: 1350px;
  height: 45px;
  display: flex;
  justify-content: flex-end;

`

export const SubmitButton = styled.button`
  width: 120px;
  
  background-color: ${({disabled}) => (disabled ? "#CCCCCC" : "#00C471")} ;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  font-weight: bold;

  &:hover {
    background-color: #00b065;
  }
`;