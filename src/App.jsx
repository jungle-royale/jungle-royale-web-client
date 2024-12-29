import { Routes, Route } from "react-router-dom";
import { LoginProvider } from "./contexts/LoginContext";
import { RoomsProvider } from "./contexts/RoomsContext";
import { ClickLockProvider } from "./contexts/ClickLockContext";


import './App.css';
import Home from "./pages/Home";
import Login from "./pages/Login";
import RoomList from "./pages/RoomList";
import MyPage from "./pages/MyPage"
import GameTemp from "./pages/GameTemp"
import useTokenRefresh from "./hooks/useTokenRefresh";
import Header from "./components/Header";
import ScrollToTop from "./components/ScrollToTop";
import Post from "./pages/Post"
import PostCreator from "./pages/PostCreator";
import PostEditor from "./pages/PostEditor";

function App() {
  useTokenRefresh(); // 자동 토큰 갱신 로직

  return (
    <>
      <ScrollToTop />
      <ClickLockProvider>
        <LoginProvider>
          <RoomsProvider>
            <Header />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/rooms" element={<RoomList />} />
              <Route path="/mypage" element={<MyPage />}/>
              <Route path="/game" element={<GameTemp />}/>
              <Route path="/post" element={<Post />}/>
              <Route path="/post-creator" element={<PostCreator />}/>
              <Route path="/post-editor" element={<PostEditor />}/>
            </Routes>
          </RoomsProvider>
        </LoginProvider>
      </ClickLockProvider>
    </>

  );
}

export default App;
