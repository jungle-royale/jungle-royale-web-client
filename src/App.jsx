import { Routes, Route } from "react-router-dom";
import { LoginProvider } from "./contexts/LoginContext";
import { RoomsProvider } from "./contexts/RoomsContext";
import { ClickLockProvider } from "./contexts/ClickLockContext";
import './App.css';
import log from 'loglevel';

import useGlobalEventHandler from "./hooks/useGlobalEventHandler";
import Home from "./pages/home/Home";
import Header from "./components/Header";
import Login from "./pages/login/Login";
import LoginError from "./pages/Failure"
import KakaoAuthPage from "./pages/login/KakaoAuthPage"
import RoomList from "./pages/rooms/RoomList";
import RoomReady from "./pages/rooms/RoomReady";
import RoomCreater from "./pages/rooms/RoomCreater";
import MyPage from "./pages/mypage/MyPage"
import Ranking from "./pages/rank/Ranking"
import ScrollToTop from "./utils/ScrollToTop";
import Post from "./pages/posts/Post";
import PostViewer from "./pages/posts/PostViewer";
import PostCreator from "./pages/posts/PostCreator";
import PostEditor from "./pages/posts/PostEditor";
  import PreloadImages from './components/PreloadImages';

// Initialize loglevel
if (import.meta.env.VITE_NODE_ENV === 'production') {
  log.setLevel('silent');
} else {
  log.setLevel('debug');
}

log.info("Application started");

function App() {

  useGlobalEventHandler();

  return (
    <PreloadImages>
      <ScrollToTop />
      <ClickLockProvider>
        <LoginProvider>
          <RoomsProvider>
            <Header />
            <main className="font-yonepick">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/loginerror" element={<LoginError />} />
                <Route path="/login/auth" element={<KakaoAuthPage />} />
                <Route path="/room" element={<RoomList />} />
                <Route path="room/create" element={<RoomCreater />} />
                <Route path="/room/ready" element={<RoomReady />} />
                <Route path="/mypage" element={<MyPage />}/>
                <Route path="/ranking" element={<Ranking />}/>
                <Route path="/posts" element={<Post />} />
                <Route path="/posts/:id" element={<PostViewer />} /> {/* 동적 경로 */}
                <Route path="/post-creator" element={<PostCreator />}/>
                <Route path="/posts/:id/update" element={<PostEditor />}/> {/* 동적 경로 */}
              </Routes>
            </main>
          </RoomsProvider>
        </LoginProvider>
      </ClickLockProvider>
    </PreloadImages>
  );
  
  
}

export default App;
