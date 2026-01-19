import styled from "styled-components"

export const Container = styled.div`
    height: 96px;
    width: 1920px;
    max-width: 1920px;
    border-bottom: 2px solid #00C471;
    display: flex;
    align-items: center;
`

export const Logo = styled.img`
  margin-left: 240px;
  cursor: pointer;
`

export const PageContent = styled.div`
  width: 513px;
  height: 47px;
  margin-top: 24px;
  margin-bottom: 25px;
  margin-left: 55px;
  margin-right: 425px;
  display: flex;
  justify-content: center;
  align-items: center; 
  gap: 75px;
`

export const BookRequest = styled.a`
  width: 80px;
  height: 27px;

  font-weight: 700;
  color: black;
  text-decoration: none;
  &:hover{
    cursor: pointer;
  }
`

export const FindFavoriteBooks = styled.a`
  width: 156px;
  height: 27px;

  font-size: 18px;
  font-weight: 700;
  color: black;
  text-decoration: none;
  &:hover{
    cursor: pointer;
  }
`

export const MyPage = styled.a`
  width: 100px;
  height: 27px;
  font-size: 18px;
  font-weight: 700;
  color: black;
  text-decoration: none;
    &:hover{
    cursor: pointer;
  }
`

export const AiPage = styled.a`
  width: 80px;
  height: 27px;

  font-size: 18px;
  font-weight: 700;
  color: black;
  text-decoration: none;

  cursor: pointer;
`

export const TextContent = styled.div`
  width: 226px;
  height: 45px;
  margin-right: 240px;
  margin-top: 26px;
  margin-bottom: 25px;
  
  display: flex;
  justify-content: space-around;
  align-items: center;
`

export const LogInContent = styled.div`
  width: 85px;
  height: 25px;
  display: flex; 
  align-items: center; 
  gap: 5px; 
  &:hover{
    cursor: pointer;
  }
`

export const SignUpContent = styled.div`
  width: 99px;
  height: 24px;
  display: flex; 
  align-items: center; 
  gap: 5px; 
  &:hover{
    cursor: pointer;
  }
`

export const LogInImg = styled.img`
  width: 48px;
  height: 48px;
  color: #00C471; 
  text-decoration: none;
`

export const SignUpText = styled.a`
  width: 60px;
  height: 24px;
  color: #00C471;
  text-decoration: none;
`

export const ProfileWrapper = styled.div`
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  margin-left: auto;
  margin-right: 240px;
  gap: 8px;
  cursor: pointer;
`;

export const ProfileAvatar = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
`;
