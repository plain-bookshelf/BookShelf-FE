import { CategoryBox, CheckBox, InfoBox } from "../components/borrowList/BorrowList";
import styled from "styled-components";
import PaginationBar from "../components/pagination/PaginationBar";
import { useList } from "../components/contexts/BorrowListContext";
import { useState, useEffect } from "react";
import SearchBar from "../components/searchBar/SearchBar";
import { getOverdueList, getRentalList, getUserSearch } from "../api/manage";

export default function BorrowList() {
  const { listData, setListData } = useList();
  const [currentPage, setCurrentPage] = useState(0);
  const [pageCount, setPageCount] = useState(0);
  const [query, setQuery] = useState<string>("");
  const [check, setCheck] = useState(false);

useEffect(() => {
  const fetchData = async () => {
    try {
      let res;

      if (query !== "") {
        console.log(`검색어 "${query}"로 검색 중`);
        res = await getUserSearch(query);
      } else if (check) {
        console.log("연체 데이터만 불러오는 중");
        res = await getOverdueList(currentPage);
      } else {
        console.log("전체 대출 리스트 불러오는 중");
        res = await getRentalList(currentPage);
      }

      setPageCount(res.data.data.total_pages);
      setListData(res.data.data.response_dto_list);
    } catch (error) {
      console.error(error);
    }
  };

  fetchData();
}, [check, currentPage, query]);


  useEffect(() => {
    setCurrentPage(0);
  }, [check, query])

  const handleSearch = (content: string) => {
    if(content === ""){
      alert("검색어를 입력해주세요");
      return;
    }

    setQuery(content);
  }

  const toggleCheck = () => setCheck(!check);

  return(
    <>
      <Container>
        <SearchBar handleSearch={handleSearch} State="user" />
        <CheckBox checked={check} onChange={toggleCheck} />
        <CategoryBox />
        {listData.map((e) => (
          <InfoBox
            book_name={e.book_name}
            registration_number={e.registration_number}
            nick_name={e.nick_name}
            return_date={e.return_date}
            overdue_status={e.overdue_status}
            allow={e.allow}
            day={e.day}
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
  display: flex;
  flex-direction: column;
  align-items: center;
`