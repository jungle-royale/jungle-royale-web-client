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
import Board from "./pages/Board"
import BoardCreator from "./pages/BoardCreator";
import BoardEditor from "./pages/BoardEditor";

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
              <Route path="/board" element={<Board />}/>
              <Route path="/board-creator" element={<BoardCreator />}/>
              <Route path="/board-editor" element={<BoardEditor />}/>
            </Routes>
          </RoomsProvider>
        </LoginProvider>
      </ClickLockProvider>
    </>

  );
}

export default App;
