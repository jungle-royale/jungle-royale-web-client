import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRooms } from "../contexts/RoomsContext";
import { fetchRooms } from "../api";
import RoomCard from "../components/RoomCard";
import Button from "../components/Button";

const RoomList = () => {
  const { rooms, setRooms } = useRooms();
  const navigate = useNavigate();

  useEffect(() => {
    const loadRooms = async () => {
      try {
        const response = await fetchRooms(); // API 호출
        setRooms(response.data); // 상태 업데이트
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
