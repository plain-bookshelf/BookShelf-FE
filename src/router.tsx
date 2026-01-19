import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRouter from "./protectedRouter";
import My from "./pages/Mypage";
import Main from "./pages/Main";
import Login from "./pages/logIn";
import EmailRegistration from "./pages/emailRegistration";
import Signup from "./pages/SignUp"
import IdPasswordFind from "./pages/idPasswordFind";
import IdFind from "./pages/idFind"
import CheckEmailPwReset from "./pages/checkEmailPwReset";
import BookDetail from "./pages/BookDetail";
import ShowId from "./pages/showId"
import PwReset from "./pages/pwReset";
import ShowPw from "./pages/showPw";
import MyPwReset from "./pages/myPwReset";
import RecommandList from "./pages/Recommand";
import ChatBot from "./pages/chatBot";
import AllowList from "./pages/borrowAllow";
import BorrowList from "./pages/borrowList";
import Layout from "./layouts/Layout";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="/login" element={<Login/>}/>
          <Route path="/showPw" element={<ShowPw/>}/>
          <Route path="/MyPwReset" element={<MyPwReset/>}/>
          <Route path="/checkEmailPwReset" element={<CheckEmailPwReset/>}/>
          <Route path="/emailRegistration" element={<EmailRegistration/>}/>
          <Route path="/signup" element={<Signup/>}/>
          <Route path="/idPasswordFind" element={<IdPasswordFind/>}/>
          <Route path="/idFind" element={<IdFind/>}/>
          <Route path="/showId" element={<ShowId/>}/>
          <Route path="/pwReset" element={<PwReset/>}/>
          <Route element={<ProtectedRouter/>} >
            <Route index element={<Main />} />
            <Route path="/my" element={<My />} />
            <Route path="/books/:bookId" element={<BookDetail/>}/>
            <Route path="/recommand" element={<RecommandList />} />
            <Route path="/ai" element={<ChatBot />} />
            <Route path="allow" element={<AllowList />} />
            <Route path="list" element={<BorrowList />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}