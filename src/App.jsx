import { Routes, Route } from "react-router-dom";
import { LoginProvider } from "./contexts/LoginContext";
import { RoomsProvider } from "./contexts/RoomsContext";
import { ClickLockProvider } from "./contexts/ClickLockContext";
import './App.css';
import log from 'loglevel';

import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import LoginError from "./pages/Failure"
import RoomList from "./pages/rooms/RoomList";
import RoomReady from "./pages/rooms/RoomReady";
import Failure from "./pages/Failure";
import MyPage from "./pages/mypage/MyPage"
import GameTemp from "./pages/GameTemp"
import Header from "./components/Header";
import ScrollToTop from "./utils/ScrollToTop";
import PostViewer from "./pages/posts/PostViewer";
import PostCreator from "./pages/posts/PostCreator";
import PostEditor from "./pages/posts/PostEditor";
import Store from "./pages/store/Store";
import Ranking from "./pages/Ranking";
import TestPageStore from "./pages/TestPageStore";

// Initialize loglevel
if (import.meta.env.VITE_NODE_ENV === 'production') {
  log.setLevel('silent');
} else {
  log.setLevel('debug');
}

log.info("Application started");

function App() {

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
              <Route path="/loginerror" element={<LoginError />} />
              <Route path="/room" element={<RoomList />} />
              <Route path="/room/ready" element={<RoomReady />} />
              <Route path="/failure" element={<Failure />} /> {/* 입장 실패 페이지 */}
              <Route path="/mypage" element={<MyPage />}/>
              <Route path="/game" element={<GameTemp />}/>
              <Route path="/posts/:id" element={<PostViewer />} /> {/* 동적 경로 */}
              <Route path="/post-creator" element={<PostCreator />}/>
              <Route path="/posts/:id/update" element={<PostEditor />}/>
              <Route path="/store" element={<Store />} />
              <Route path="/ranking" element={<Ranking />} />
              <Route path="/test" element={<TestPageStore />}/> {/* 삭제 예정 */}
            </Routes>
          </RoomsProvider>
        </LoginProvider>
      </ClickLockProvider>
    </>

  );
}

export default App;
