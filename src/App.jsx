import { LoginProvider } from "./contexts/LoginContext";
import { RoomsProvider } from "./contexts/RoomsContext";
import './App.css';
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Login from "./pages/Login";
import RoomCreater from "./pages/RoomCreater";
import RoomList from "./pages/RoomList";
import MyPage from "./pages/MyPage"
import useTokenRefresh from "./hooks/useTokenRefresh"; // Token 갱신 Hook 추가

function App() {
  useTokenRefresh(); // 자동 토큰 갱신 로직

  return (
    <LoginProvider>
      <RoomsProvider>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/rooms" element={<RoomList />} />
          <Route path="/roomcreater" element={<RoomCreater />} />
          <Route path="/mypage" element={<MyPage />}/>
        </Routes>
      </RoomsProvider>
    </LoginProvider>
  );
}

export default App;
