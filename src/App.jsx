import { useState, useEffect } from "react";
import './App.css';
import { Routes, Route } from "react-router-dom"; // BrowserRouter 제거
import Header from "./components/Header";
import Home from "./pages/Home";
import Login from "./pages/Login";
import RoomCreater from "./pages/RoomCreater";
import RoomList from "./pages/RoomList";

function App() {
  // 로그인 상태 초기화
  const [isLogin, setIsLogin] = useState(false);

  const rooms = [
    { id: 1, name: "Room 1", currentPlayers: 20, maxPlayers: 50, isPlaying: true },
    { id: 2, name: "Room 2", currentPlayers: 10, maxPlayers: 50, isPlaying: false },
    { id: 3, name: "Room 3", currentPlayers: 35, maxPlayers: 50, isPlaying: false },
    { id: 4, name: "Room 4", currentPlayers: 35, maxPlayers: 50, isPlaying: false },
    { id: 5, name: "Room 5", currentPlayers: 35, maxPlayers: 50, isPlaying: false },
    { id: 6, name: "Room 6", currentPlayers: 35, maxPlayers: 50, isPlaying: false },
    { id: 7, name: "Room 7", currentPlayers: 35, maxPlayers: 50, isPlaying: false },
    { id: 8, name: "Room 8", currentPlayers: 35, maxPlayers: 50, isPlaying: false },
    { id: 9, name: "Room 9", currentPlayers: 35, maxPlayers: 50, isPlaying: false },

  ];
  

  useEffect(() => {
    // 로컬 스토리지에서 로그인 상태 확인
    const loginStatus = localStorage.getItem("isLogin");
    setIsLogin(loginStatus === "true");
  }, []);

  return (
    <>
      {/* Header에 isLogin과 setIsLogin 전달 */}
      <Header isLogin={isLogin} setIsLogin={setIsLogin} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/rooms" element={<RoomList rooms={rooms} onJoinRoom={(roomName) => console.log(roomName)} />} />
        <Route path="/roomcreater" element={<RoomCreater />} />
      </Routes>
    </>
  );
}

export default App;
