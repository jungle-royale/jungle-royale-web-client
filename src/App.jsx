import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'
import Home from "./pages/Home";
import SocialKakao from './pages/SocialKakao'
import { useState } from "react";


//1. "/" : Home 화면
//2. "/social-kakao" : 카카오 간편 로그인
function App() {
  const [ isLogin, setIsLogin ] = useState(false);
  // 방 정보 배열-임시list
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

  // 입장하기 버튼 클릭 핸들러
  const handleJoinRoom = (roomName) => {
    alert(`${roomName}에 입장했습니다!`);
  };

  return (
      <Router>
      <Routes>
        <Route path="/" element={<Home rooms={rooms} onJoinRoom={handleJoinRoom} />} />
        <Route path="/social-kakao" element={<SocialKakao isLogin={isLogin} setIsLogin={setIsLogin}/>} />
      </Routes>
    </Router>   
  );
}

export default App;
