
import { useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar/SearchBar"
import * as B from "../components/Book/Book"
import type { Book, SearchBook } from "../types/Book"
import { useEffect, useState } from "react"
import { Line, LineContainer } from "../components/Book/style"
import styled from "styled-components"
import searchResult from "../assets/searchResult.png"
import { getBookSearch, getMain } from "../api/main"
import { useUser } from "../components/contexts/UserContext"
import Loading from "../components/loading/loading"
import { setUserId } from "../utils/tokenService"

export default function Main() {
  const { user, setUser } = useUser();
  const [searchBookList, setSearchBookList] = useState<SearchBook[]>([]);
  const [popularBookList, setPopularBookList] = useState<Book[]>([]);
  const [newBookList, setNewBookList] = useState<Book[]>([]);
  const [search, setSearch] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try{
        console.log("책 가져오는 중");
        const res = await getMain();
        setPopularBookList(res.data.data.book_popularity_list_response_dto);
        setNewBookList(res.data.data.book_recent_list_response_dto);
        setUser({...user, img: res.data.data.profile, id: res.data.data.member_id});
        
        setUserId(user.id);
        setLoading(false);
      } catch(error) {
        console.error(error);
      }
    }

    fetchData();
  }, [user.id])


  const handleSearch = (content: string) => {
    if(content === ""){
      alert("검색어를 입력해주세요");
      return;
    }

    setQuery(content);
    setSearch(true);
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("검색 결과 불러오는 중");
        setLoading(true);
        const { data } = await getBookSearch(query);
        const resultList = data.data?.results || [];
        setSearchBookList(resultList);
        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    }
    
    if (query) fetchData();
  }, [query])
 
 return(<>
    <SearchBar handleSearch={handleSearch} State="book" />

    {searchBookList.length !== 0 && search &&
      <div>
        <Title style={{margin: "0px auto 50px 240px"}}><span style={{color: "#00C471"}}>'{query}'</span> 에 대한 검색 결과입니다</Title>
        <B.BookList BookListTitle="검색 결과">
          {searchBookList.map((e) => (
          <B.Book
            id={e.id}
            book_name={e.book_name}
            author={e.author}
            book_type={e.book_type}
            book_image_url={e.book_image}
            onClick={() => navigate(`books/${e.id}`)}
          />
        ))}
        </B.BookList>
      </div>
    }

    {searchBookList.length === 0 && search && !loading &&
      <Container>
        <img src={searchResult} style={{margin: "155px 0 54px"}} />
        <Title style={{margin: "0 0 100px 0", color: "#878787"}}><span style={{color: "#00C471", fontSize: "40px"}}>'{query}'</span>에 대한 검색 결과가 없습니다</Title>
      </Container>
    }

    {!search && !loading &&
      <B.BookList BookListTitle="인기 도서">
        {popularBookList.map((e, index) => (
          <B.Popular 
            rank={index + 1}
            id={e.id}
            book_name={e.book_name}
            author={e.author}
            book_type={e.book_type}
            book_image_url={e.book_image_url}
            onClick={() => navigate(`books/${e.id}`)}
          />
        ))}
      </B.BookList>
    }

    {!loading &&
    <LineContainer>
      {!search && <Line />}
    </LineContainer>
    }

    {!search && !loading &&
      <B.BookList BookListTitle="최신 도서">
        {newBookList.map((e) => (
          <B.Book
            id={e.id}
            book_name={e.book_name}
            author={e.author}
            book_type={e.book_type}
            book_image_url={e.book_image_url}
            onClick={() => navigate(`books/${e.id}`)}
          />
        ))}
      </B.BookList>
    }
    <Loading loading={loading} />
  </>)
}

const Title = styled.h1`
  margin: 0;
  font-size: 36px;
  font-weight: 600;
  color: black;
  margin: 0 0 80px 240px;
`

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`