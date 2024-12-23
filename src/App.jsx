import { LoginProvider } from "./contexts/LoginContext";
import './App.css';
import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import Login from "./pages/Login";
import RoomCreater from "./pages/RoomCreater";
import RoomList from "./pages/RoomList";
import useTokenRefresh from "./hooks/useTokenRefresh"; // Token 갱신 Hook 추가

function App() {
  useTokenRefresh(); // 자동 토큰 갱신 로직
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

  return (
    <LoginProvider>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/rooms" element={<RoomList rooms={rooms} onJoinRoom={(roomName) => console.log(roomName)} />} />
        <Route path="/roomcreater" element={<RoomCreater />} />
      </Routes>
    </LoginProvider>
  );
}

export default App;
