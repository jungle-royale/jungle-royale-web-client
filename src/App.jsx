import { Routes, Route } from "react-router-dom";
import { LoginProvider } from "./contexts/LoginContext";
import { RoomsProvider } from "./contexts/RoomsContext";
import { ClickLockProvider } from "./contexts/ClickLockContext";

import './App.css';
import Home from "./pages/Home";
import Login from "./pages/Login";
import RoomCreater from "./pages/RoomCreater";
import RoomList from "./pages/RoomList";
import MyPage from "./pages/MyPage"
import GameTemp from "./pages/GameTemp"
import useTokenRefresh from "./hooks/useTokenRefresh";
import Header from "./components/Header";

function App() {
  useTokenRefresh(); // 자동 토큰 갱신 로직

  return (
    <ClickLockProvider>
      <LoginProvider>
        <RoomsProvider>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/rooms" element={<RoomList />} />
            <Route path="/roomcreater" element={<RoomCreater />} />
            <Route path="/mypage" element={<MyPage />}/>
            <Route path="/game" element={<GameTemp />}/>
          </Routes>
        </RoomsProvider>
      </LoginProvider>
    </ClickLockProvider>
  );
}

export default App;
