import PropTypes from 'prop-types';
import RoomCard from '../components/RoomCard';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';

const RoomList = ({ rooms, onJoinRoom }) => {
  const navigate = useNavigate();
  return (
    <div>
      {/* <Header /> */}
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
              onJoin={() => onJoinRoom(room.name)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

// PropTypes 정의
RoomList.propTypes = {
  rooms: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      currentPlayers: PropTypes.number.isRequired,
      maxPlayers: PropTypes.number.isRequired,
      isPlaying: PropTypes.bool.isRequired,
    })
  ).isRequired, // rooms는 필수이며 객체 배열
  onJoinRoom: PropTypes.func.isRequired, // onJoinRoom은 필수이며 함수
};

export default RoomList;