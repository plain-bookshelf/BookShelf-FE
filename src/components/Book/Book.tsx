import * as S from "./style";
import type { Book } from "../../types/Book";
import type { ReactNode } from "react";
import { useRef, useState, useEffect } from "react";
import scrollButton from "../../assets/scrollButton.png"
import { BookNumber } from "../my/style";
import undefindImg from "../../assets/undefindImg.png"

type Props = {
  searchTitle?: string
  BookListTitle: string;
  children: ReactNode;
}

export const BookList: React.FC<Props> = ({searchTitle, BookListTitle, children}) => {
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const handleScroll = () => {
      const { scrollLeft, scrollWidth, clientWidth } = el;

      setShowLeft(scrollLeft > 0);

      setShowRight(scrollLeft + clientWidth < scrollWidth);
    };

    el.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => el.removeEventListener("scroll", handleScroll);
  }, []);
  
  const scrollLeft = () => {
    containerRef.current?.scrollBy({left: -500, behavior: "smooth"});
  }

  const scrollRight = () => {
    containerRef.current?.scrollBy({left: 500, behavior: "smooth"});
  }

  return(<>
    {BookListTitle !== "검색 결과" && <S.Title><span style={{color: "#00C471"}}>{searchTitle}</span>{BookListTitle}</S.Title>}
    <S.Container>
      {showLeft &&
        <S.ScrollButton onClick={scrollLeft}>
          <img src={scrollButton} style={{width: 15, height: 25, transform: 'rotate(180deg)'}}/>
        </S.ScrollButton>
      }
      {!showLeft && <div style={{width: "48px"}}></div>}
      <S.BookContainer ref={containerRef}>
        {children}
      </S.BookContainer>
      {showRight &&
        <S.ScrollButton onClick={scrollRight}>
          <img src={scrollButton} style={{width: 15, height: 25}}  />
        </S.ScrollButton>
      }
    </S.Container>
  </>)
}

export function Book({book_name, book_type, book_image_url, author, onClick}: Book) {
  const book_type_split = book_type.split(">");
  let category = book_type_split[book_type_split.length-1];
  if(category.length> 8){
    category = category.slice(0, 8) + "...";
  }

  let title = book_name;
  
  if(book_name.length > 8){
    title = book_name.slice(0, 8) + "...";
  }

  if(book_image_url === null){
    book_image_url = undefindImg;
  }

  return(<>
    <S.Book onClick={onClick}>
      <img style={{height: 300}} src={book_image_url}/>
      <S.BookInfo>
        <S.BookTitle>{title}</S.BookTitle>
        <S.Author>{author}</S.Author>
        <S.CategoryBox>
          <S.CategoryFilter>카테고리 분류</S.CategoryFilter>
          <S.Category>{category}</S.Category>
        </S.CategoryBox>
      </S.BookInfo>
    </S.Book>
  </>)
}

export function Popular({book_name, book_type, book_image_url, author, rank, onClick}: Book) {
  const book_type_split = book_type.split(">");
  let category = book_type_split[book_type_split.length-1];
  if(category.length> 8){
    category = category.slice(0, 8) + "...";
  }

  let title = book_name;
  
  if(book_name.length > 8){
    title = book_name.slice(0, 8) + "...";
  }

  if(book_image_url === null){
    book_image_url = undefindImg;
  }

  let book_author = author;

  if(author.length > 8){
    book_author = author.slice(0, 8) + "...";
  }

  return(<>
    <S.Book onClick={onClick}>
      <img style={{height: 300}} src={book_image_url}/>
      <S.RankBox>
        <BookNumber style={{margin: 0}}>{rank}</BookNumber>
      </S.RankBox>
      <S.BookInfo>
        <S.BookTitle>{title}</S.BookTitle>
        <S.Author>{book_author}</S.Author>
        <S.CategoryBox>
          <S.CategoryFilter>카테고리 분류</S.CategoryFilter>
          <S.Category>{category}</S.Category>
        </S.CategoryBox>
      </S.BookInfo>
    </S.Book>
  </>)
}