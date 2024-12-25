import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRooms } from "../contexts/RoomsContext";
import { fetchRooms } from "../api";
import RoomCard from "../components/RoomCard";
import Button from "../components/Button";

const RoomList = () => {
  const { rooms, setRooms } = useRooms();
  const [userName, setUserName] = useState(""); // 유저 이름 상태 추가
  const navigate = useNavigate();

  useEffect(() => {
    const loadRooms = async () => {
      try {
        const response = await fetchRooms(); // API 호출
        console.log("list: ", response);
        setRooms(response.data.gameRooms); // 상태 업데이트
        setUserName(response.data.userInfo.username); // 유저 이름 상태 업데이트
      } catch (error) {
        console.error("방 목록을 불러오는 중 오류 발생:", error);
      }
    };

    loadRooms();
  }, [setRooms]);

  return (
    <div>
      <div>
        <Button text="Room Creater" onClick={() => navigate("/roomcreater")} />
      </div>
      <div className="user-info">
        <p>안녕하세요, {userName}님!</p>
      </div>
      <div className="room-page">
        <h1>게임 방 목록</h1>
        <div className="room-list">
          {rooms.map((room) => (
            <RoomCard
              key={room.id}
              roomName={room.title}
              currentPlayers={room.currentPlayers}
              maxPlayers={room.maxPlayers}
              isPlaying={room.status}
              onJoin={() => console.log(`${room.title}에 입장합니다.`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoomList;
