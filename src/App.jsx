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
import PostViewer from "./pages/PostViewer";
import PostCreator from "./pages/PostCreator";
import PostEditor from "./pages/PostEditor";
import Store from "./pages/Store";

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
              <Route path="/posts/:id" element={<PostViewer />} /> {/* 동적 경로 */}
              <Route path="/post-creator" element={<PostCreator />}/>
              <Route path="/posts/:id/update" element={<PostEditor />}/>
              <Route path="/store" element={<Store />} />

            </Routes>
          </RoomsProvider>
        </LoginProvider>
      </ClickLockProvider>
    </>

  );
}

export default App;
