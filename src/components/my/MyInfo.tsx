import * as S from "./style"
import { useEffect, useState } from "react"
import type { MyBook } from "../../types/Book";
import userInfoedit from "../../assets/userInfoEdit.png"
import userImgEdit from "../../assets/userImgEdit.png"
import { useUser } from "../contexts/UserContext";
import EditModal from "../modal/styleA/EditModal";
import lock from "../../assets/lock.png"
import go from "../../assets/go.png"
import { useNavigate } from "react-router-dom";
import { getMyPage, getMyInfo, putEditUserName, postLogout } from "../../api/my";
import { getDayDiff } from "../../utils/daydiff";
import deleteUser from "../../assets/deleteUser.png";
import DeleteUserModal from "../modal/styleB/DeleteUserModal";

export default function MyProfile() {
  const { user, setUser } = useUser();
  const [borrowBooks, setBorrowBooks] = useState<MyBook[]>([]);
  const [reserveBooks, setReserveBooks] = useState<MyBook[]>([]);
  const [overdueBooks, setOverdueBooks] = useState<MyBook[]>([]);
  const [penalty, setPenalty] = useState(0);
  const [statistics, setStatistics] = useState(0);
  const [deleteUserModal, setDeleteUserModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [editImgModal, setEditImgModal] = useState(false);
  const [editName, setEditName] = useState(user.nickName);
  const navigate = useNavigate();

  useEffect(() => {
    setEditName(user.nickName);
  }, [user.nickName])

  useEffect(() => {

    const fetchData = async () => {
      try{
        console.log("정보 가져오는 중");
        const res = await getMyPage(user.id);
        setUser({...user, nickName: res.data.data.nick_name, img: res.data.data.profile});
        setStatistics(res.data.data.one_month_statistics);

        const rentalBook = res.data.data.rental_book;

        let borrowBook = rentalBook.filter((e: MyBook) => !e.is_over_due);
        borrowBook = borrowBook.map((e: MyBook) => ({...e, day: getDayDiff(e.over_due_time!)}));
        borrowBook = borrowBook.map((e: MyBook) => (e.book_name.length > 8 ? {...e, book_name: e.book_name.slice(0, 8) + "..."} : e));
        setBorrowBooks(borrowBook);

        let reserveBook = res.data.data.reservation_book;
        reserveBook = reserveBook.map((e: MyBook) => (e.book_name.length > 8 ? {...e, book_name: e.book_name.slice(0, 8) + "..."} : e));
        setReserveBooks(res.data.data.reservation_book);

        let overdueBook = rentalBook.filter((e: MyBook) => e.is_over_due);
        overdueBook = overdueBook.map((e: MyBook) => ({...e, day: Math.abs(getDayDiff(e.over_due_time!))}))
        overdueBook = overdueBook.map((e: MyBook) => (e.book_name.length > 8 ? {...e, book_name: e.book_name.slice(0, 8) + "..."} : e));
        setOverdueBooks(overdueBook);

        setPenalty(res.data.data.user_over_due_date);
        console.log("로그인 후 userId:", user.id);
      } catch(error) {
        console.log(error)
      }
    }

    fetchData();
  }, [user.id])

  const userEditInfo = async () => {
    setEditModal(true);

    try {
      console.log("유저 정보 수정을 위한 정보 불러오는 중");
      const res = await getMyInfo(user.id);
      setUser({...user, email: res.data.data.address});
    } catch (error) {
      console.log(error)
    }
  }

  return(
    <>
      <S.Banner>
        <S.Container>
          <S.BannerTitle>마이페이지</S.BannerTitle>
          <S.ProfileContainer>
            <S.ProfileBox>
              <S.ProfileOutlien onClick={() => setEditImgModal(true)}>
                <img src={user.img} style={{width: "100px", height: "100px", borderRadius: "50%"}} />
                <img src={userImgEdit} style={{position: "absolute"}} />
              </S.ProfileOutlien>
              <div style={{display: "flex", alignItems: "center", flexWrap: "wrap"}}>
                <S.InfoTitle color="#00C471">{user.nickName}</S.InfoTitle>
                <S.InfoTitle color="black" style={{marginRight: "17px"}}>님의 회원정보</S.InfoTitle>
                <img src={userInfoedit} onClick={() => userEditInfo()} style={{cursor: "pointer"}} />
              </div>
            </S.ProfileBox>
            <S.InfoContainer>
              <S.InfoBox>
                <S.InfoTitle color="black">대출</S.InfoTitle>
                <span><S.InfoContent color="#00C471">{borrowBooks.length}</S.InfoContent><S.InfoContent color="black">권</S.InfoContent></span>
              </S.InfoBox>
              <S.VerticalLine />
              <S.InfoBox>
                <S.InfoTitle color="black">예약</S.InfoTitle>
                <span><S.InfoContent color="#00C471">{reserveBooks.length}</S.InfoContent><S.InfoContent color="black">권</S.InfoContent></span>
              </S.InfoBox>
              <S.VerticalLine />
              <S.InfoBox>
                <S.InfoTitle color="black">연체기간</S.InfoTitle>
                <span><S.InfoContent color="#00C471">{penalty}</S.InfoContent><S.InfoContent color="black">일</S.InfoContent></span>
              </S.InfoBox>
              <S.VerticalLine />
              <S.InfoBox>
                <S.InfoTitle color="black">한 달 통계</S.InfoTitle>
                <span><S.InfoContent color="#00C471">{statistics}</S.InfoContent><S.InfoContent color="black">권</S.InfoContent></span>
              </S.InfoBox>
            </S.InfoContainer>
          </S.ProfileContainer>
        </S.Container>
          {!editModal && <S.DetailInfoContainer>
            <S.DetailInfoBox>
              <S.DetailInfoTitle>대출</S.DetailInfoTitle>
              <S.DetailInfoList>
                {borrowBooks.map((e, index) => (
                <S.DetailInfo>
                  <S.BookInfoBox>
                    <S.BookNumber>{index + 1}</S.BookNumber>
                    <S.BookInfo>
                      <S.BookTitle>{e.book_name}</S.BookTitle>
                      <S.BookState>대여 {e.day}일 남음</S.BookState>
                    </S.BookInfo>
                  </S.BookInfoBox>
                </S.DetailInfo>
                ))}
              </S.DetailInfoList>
            </S.DetailInfoBox>
            <S.DetailInfoBox>
              <S.DetailInfoTitle>예약</S.DetailInfoTitle>
              <S.DetailInfoList>
                {reserveBooks.map((e, index) => (
                <S.DetailInfo>
                  <S.BookInfoBox>
                    <S.BookNumber>{index + 1}</S.BookNumber>
                    <S.BookInfo>
                      <S.BookTitle>{e.book_name}</S.BookTitle>
                      <S.BookState>예약</S.BookState>
                    </S.BookInfo>
                  </S.BookInfoBox>
                </S.DetailInfo>
                ))}
              </S.DetailInfoList>
            </S.DetailInfoBox>
            <S.DetailInfoBox>
              <S.DetailInfoTitle>연체</S.DetailInfoTitle>
              <S.DetailInfoList>
                {overdueBooks.map((e, index) =>  (
                <S.DetailInfo>
                  <S.BookInfoBox>
                    <S.BookNumber>{index + 1}</S.BookNumber>
                    <S.BookInfo>
                      <S.BookTitle>{e.book_name}</S.BookTitle>
                      <S.BookState>{e.day}일 연체중</S.BookState>
                    </S.BookInfo>
                  </S.BookInfoBox>
                </S.DetailInfo>
                ))}
              </S.DetailInfoList>
            </S.DetailInfoBox>
          </S.DetailInfoContainer>}
          {editModal && <S.EditContainer>
            <S.EditTitle>유저 정보</S.EditTitle>
              <S.EditInputContainer>
                <S.EditInputBox>
                  <S.EditInputTitle>닉네임</S.EditInputTitle>
                  <S.EditInput
                    onKeyDown={async (e) => {
                      if(e.key === "Enter"){
                        if(editName.length < 3 || editName.length > 16){
                          alert("이름은 3 ~ 16자 사이어야 합니다")
                          return;
                        }
                        setUser({ ...user, nickName: editName });
                        setEditModal(false);
                        await putEditUserName(user.id, editName);
                      }}
                    }
                    allow={true}
                    weight={600}
                    color="#5A5A5A"
                    bgColor="#ffffff"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                  />
                </S.EditInputBox>
                {user.email === "" ? 
                <S.EditInputBox onClick={() => navigate("/emailRegistration")} style={{cursor: "pointer"}}>
                  <S.EditInputTitle>이메일</S.EditInputTitle>
                  <S.EditBox>
                    <S.EditInput
                      allow={false}
                      weight={600}
                      bgColor="#ffffff"
                      color="#5A5A5A"
                      value="등록된 이메일 없습니다."
                    />
                    <S.EditGo go={571}>등록 하러가기</S.EditGo>
                  </S.EditBox>
                </S.EditInputBox>
                : 
                <S.EditInputBox style={{cursor: "not-allowed"}}>
                  <S.EditInputTitle>이메일</S.EditInputTitle>
                  <S.EditBox>
                    <S.EditInput
                    allow={false}
                    weight={600}
                    bgColor="#f0f0f0"
                    color="#5A5A5A"
                    value={user.email}
                  />
                  </S.EditBox>
                </S.EditInputBox>}
                <S.EditInputBox>
                  <S.EditInputTitle><img src={lock} />비밀번호</S.EditInputTitle>
                  <S.EditBox onClick={() => navigate("/myPwReset")}>
                    <S.EditInput
                      readOnly
                      allow={true}
                      weight={500}
                      bgColor="#f0f0f0"
                      color="#5A5A5A"
                      value="비밀번호 재설정 하러가기"
                      style={{cursor: "pointer"}}
                    />
                    <S.EditGo go={653}><img src={go} style={{cursor: "pointer"}} /></S.EditGo>
                  </S.EditBox>
                </S.EditInputBox>
                <S.EditInputBox>
                  <S.EditInputTitle><img src={lock} />로그아웃</S.EditInputTitle>
                  <S.EditBox onClick={async () => {
                    await postLogout();
                  }}>
                    <S.EditInput
                      readOnly
                      allow={true}
                      weight={500}
                      bgColor="#f0f0f0"
                      color="#5A5A5A"
                      value="로그아웃 하러가기"
                      style={{cursor: "pointer"}}
                    />
                    <S.EditGo go={653}><img src={go} style={{cursor: "pointer"}} /></S.EditGo>
                  </S.EditBox>
                </S.EditInputBox>
                <S.EditInputBox>
                  <S.EditInputTitle><img src={deleteUser} />회원탈퇴</S.EditInputTitle>
                  <S.EditBox onClick={() => setDeleteUserModal(true)}>
                    <S.EditInput
                      readOnly
                      allow={true}
                      weight={500}
                      bgColor="#f0f0f0"
                      color="#5A5A5A"
                      value="탈퇴진행"
                      style={{cursor: "pointer"}}
                    />
                    <S.EditGo go={653}><img src={go} style={{cursor: "pointer"}} /></S.EditGo>
                  </S.EditBox>
                </S.EditInputBox>
              </S.EditInputContainer>
            <S.Button onClick={async () => {
              if(editName.length < 3 || editName.length > 16){
                alert("이름은 3 ~ 16자 사이어야 합니다")
                return;
              }
              setUser({ ...user, nickName: editName });
              setEditModal(false);
              await putEditUserName(user.id, editName);
              }}>확인</S.Button>
          </S.EditContainer>}
          {editImgModal && <EditModal onClose={() => setEditImgModal(false)}/>}
          {deleteUserModal && <DeleteUserModal onClose={() => setDeleteUserModal(false)} />}
      </S.Banner>
    </>
  )
}