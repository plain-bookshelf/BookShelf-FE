import { CategoryBox, InfoBox } from "../components/borrowMange/borrowManage";
import styled from "styled-components";
import PaginationBar from "../components/pagination/PaginationBar";
import { useManage } from "../components/contexts/ManagementContext";
import { useState, useEffect } from "react";
import { getAllowList } from "../api/manage";

export default function AllowList() {
  const { manageData, setManageData } = useManage();
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);

  //여기서 페이지 단위로 데이터 + 페이지 개수 요청 보내면 될듯
  useEffect(() => {
    console.log("test")
    const fetchData = async () => {
      try {
        console.log("관리자 승인 페이지 불러오는 중");
        const res = await getAllowList(currentPage);
        setPageCount(res.data.data.total_pages);
        setManageData(res.data.data.response_dto_list);
      } catch (error) {
        console.log(error);
      }
    }

    fetchData(); 
  }, [currentPage]);

  return(
    <>
      <Container>
        <CategoryBox />
        {manageData.map((e) => (
          <InfoBox
            book_name={e.book_name}
            registration_number={e.registration_number}
            nick_name={e.nick_name}
            request_date={e.request_date}
            allow={e.allow}
          />
        ))}
      </Container>
      <PaginationBar 
        pageCount={pageCount}
        onPageChange={(event: any) => setCurrentPage(event.selected)}
      />
    </>
  )
}

const Container = styled.div`
  width: 100%;
  margin-top: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
`