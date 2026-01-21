import search from "../../assets/search.png"
import { useState } from "react"
import * as S from "../SearchBar/style"

type SearchBarProps = {
  handleSearch: (query: string) => void;
  State: "book" | "user";
};  

export default function SearchBar({ handleSearch, State }: SearchBarProps) {
  const [query, setQuery] = useState<string>("");
  const [focused, setFocused] = useState<boolean>(false);

  return(<>
    <S.Container>
      <S.SearchContainer state={State} $active={focused || query.length > 0} >
        <S.SearchBar
          placeholder={State === "book" ? "검색어를 입력해주세요." : "유저 이름을 입력해주세요."}
          type="text"
          value={query}
          onChange={(e: any) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={(e: any) => {
            if(e.key === "Enter"){
              handleSearch?.(query);
            }
          }}
        />
        <S.SearchButton onClick={() => handleSearch?.(query)}>
          <img src={search} style={{width: 26, height: 26}}/>
        </S.SearchButton>
      </S.SearchContainer>
    </S.Container>
  </>)
}