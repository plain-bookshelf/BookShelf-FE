import { useEffect, useState } from "react"
import Recoomand from "../components/recommand/RecommandBook"
import type { RecommandBook } from "../types/Book"
import styled from "styled-components";
import { postRecommand } from "../api/recommand";
import { useUser } from "../components/contexts/UserContext";
import { bouncy } from 'ldrs'
import Loading from "../components/loading/loading";
bouncy.register();

export default function RecommandList() {
  const { user } = useUser();
  const [recommandBooks, setRecommandBooks] = useState<RecommandBook[]>([]);
  const [loading, setloading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try{
        console.log("요청 보냄");
        console.log(user.nickName)
        const res = await postRecommand(user.id);
        setRecommandBooks(res.data);
        setloading(false);
      } catch(error) {
        console.error(error);
      } 
    }

    fetchData();
  }, [user.id])

  return (
    <>
      <Container>
        {recommandBooks.map((e) => (
          <Recoomand
            id={e.id}
            img={e.img} 
            title={e.title}
            writer={e.writer}
            publisher={e.publisher}
            book_date={e.book_date}
            description={e.description}
            is_school={e.is_school}
          ></Recoomand>
        ))}
      </Container>
      <Loading loading={loading} bookList={recommandBooks} />
    </>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 75px;
  gap: 35px;
`