import styled from "styled-components";

// === 1. 메인 레이아웃 및 헤더/푸터 스타일 ===

// Header/Footer는 기존 코드 구조를 따르므로, 메인 콘텐츠 Wrapper만 정의
export const DetailPageWrapper = styled.div`
  max-width: 1920px;
  display: flex;
  padding-top: 20px;
  flex-direction: column;
  align-items: center;
  background-color: white;
`;

export const Divider = styled.hr`
  border: none;
  border-top: 1px solid #eee;
  margin: 20px 0;
`;

// === 2. Book Info Section 스타일 ===

export const InfoSection = styled.section`
  width: 1440px;
  height: 405px;
  display: flex; /* 표지, 메타데이터, 요약을 가로로 배열 */
  gap: 40px;
  padding: 30px 0;
  box-sizing: border-box;
  align-items: flex-start;
`;

export const BookCoverArea = styled.div`
  text-align: center;
  width: 260px;
  height: 404px;
  flex-shrink: 0;
`;


export const StatusBadge = styled.div`
  width: 260px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
`

export const BookCover = styled.img`
  width: 260px;
  height: 404px;
  border: 1px solid #ddd;
  box-shadow: 3px 3px 5px rgba(0, 0, 0, 0.1);
  object-fit: cover;
`;

export const BookTitle = styled.h1`
  font-size: 2em;
  font-weight: bold;
  color: #333;
  margin-top: 10px;
  text-align: left;
`;

export const BookMetadata = styled.div`
  flex-grow: 1;
  font-size: 0.95em;
  color: #555;
  font-weight: 550;
  line-height: 1.8;
  padding-top: 10px;
  
  & > p {
    margin: 0;
    width: 516px;
    
  }
  
  strong {
    color: #333;
    font-weight: 600;
  }
`



export const Categories = styled.div`
  margin-top: 15px;
  display: flex;
  align-items: center;
  font-size: 0.85em;
`

export const CategoryLabel = styled.span`
  height: 21px;
  padding: 3px 8px;
  margin-right: 10px;
  border-radius: 15px;
  background-color: #EDEDED;
  color: #7D7D7D;
`

export const CategoryItem = styled.span`
  color: #5D5D5D; 
  font-weight: 500;
  margin-right: 8px;
`

export const BookSummary = styled.div`
  width: 310px;
  border: 1px solid #E7E7E7;
  box-shadow: 1px 1px 10px #E7E7E7;
  border-radius: 10px;
  padding: 30px;
`

export const BookSummaryTextContent = styled.div`
  font-size: 16px;
  font-weight: 550;
  color: #5D5D5D;
  line-height: 1.6;

`

// === 3. Tab Navigation 스타일 ===

export const TabContainer = styled.div`
  width: 1920px;
  height: 80px;
  border-bottom: 2px solid #ddd;
  margin-top: 20px;
  margin-bottom: 15px;
  display: flex;
  justify-content: center;
`

export const DetailTabs = styled.nav`
  width: 1440px;
  height: 80px;
  border-bottom: 2px solid #ddd;
  display: flex;
`

export const TabButton = styled.button<{ $isActive: boolean }>`
  background: none;
  border: none;
  padding: 10px 20px;
  font-size: 1.1em;
  cursor: pointer;
  color: ${(props) => (props.$isActive ? "#000" : "#888")};
  font-weight: ${(props) => (props.$isActive ? "bold" : "normal")};
  border-bottom: 2px solid ${(props) => (props.$isActive ? "#00C471" : "transparent")};
  transition: border-bottom 0.3s, color 0.3s;
`;


// === 4. Collection Table 스타일 ===

export const CollectionContainer = styled.section`
  overflow-x: auto;
  display: flex;
  justify-content: center;
  align-items: center;
`

export const LibraryTable = styled.table`
  width: 1440px;
  border-collapse: collapse;
  text-align: center;
  font-size: 0.9em;
`

export const TableHead = styled.thead`
  height: 70px;
  box-shadow: 0 3px 5px 3px #E7E7E7;
  border-radius: 15px;
  th {
    padding: 12px 15px;
    color: #333;
    font-size: 16px;
    font-weight: 600;
  }
`

export const TableBody = styled.tbody`
    &::before {
    content: "";
    display: block;
    height: 1px;
  }

  tr {
    width: 1440px;
    height: 80px;

    &:hover {
      background-color: #fafafa;
    }
  }
  td {
    padding: 12px 15px;
    border-bottom: 1px solid #eee;
    font-size: 16px;
  }
`
export const StatusCell = styled.td<{$status: '대출중' | '대출가능' | '예약중'}>`
  font-weight: bold;
  color: ${(props) => {
    switch (props.$status) {
      case '대출가능':
        return '#00C471';   // 그린
      case '대출중':
      case '예약중':
      default:
        return '#8D8D8D';   // 회색
    }
  }};
`;

export const ActionButton = styled.button<{ $type: 'primary' | 'secondary' | 'disabled' }>`
  padding: 6px 12px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 0.9em;
  transition: background-color 0.2s;
  min-width: 80px;

  ${(props) => {
    if (props.$type === 'primary') {
      return `
       background-color: white;
        color: #00C471;
        border: 1px solid #00C471;
        &:hover {
          background-color: #ebfff7;
        }
      `
    } else if (props.$type === 'secondary') {
      return `
        background-color: white;
        color: #00C471;
        border: 1px solid #00C471;
        &:hover {
          background-color: #ebfff7;
        }
      `
    } else {
      return `
        background-color: #f0f0f0;
        color: #898989;
        border: 1px solid #ddd;
        cursor: not-allowed;
      `
    }
  }}
`