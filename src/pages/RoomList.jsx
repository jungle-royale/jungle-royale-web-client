import RoomCard from '../components/RoomCard';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';
import { useRooms } from "../contexts/RoomsContext";


const RoomList = () => {
  const {rooms} = useRooms();
  const navigate = useNavigate();

  return (
    <div>
      <div>
        <Button text="Room Creater" onClick={() => navigate("/roomcreater")}/>
      </div>
      <div className="room-page">
        <h1>게임 방 목록</h1>
        <div className="room-list">
          {rooms.map((room) => (
            <RoomCard
              key={room.id}
              roomName={room.name}
              currentPlayers={room.currentPlayers}
              maxPlayers={room.maxPlayers}
              isPlaying={room.isPlaying}
              onJoin={() => console.log(`${room.name}에 입장합니다.`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoomList;