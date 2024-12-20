//RoomCard Component
//예상 인수:{ roomName, currentPlayers, maxPlayers, isPlaying, onJoin }
import PropTypes from "prop-types"

const RoomCard = ({ roomName, currentPlayers, maxPlayers, isPlaying, onJoin }) => {
  return (
    <div className="room-card">
      <h2>{roomName}</h2>
      <p>
        상태: {isPlaying ? "게임 중" : "대기 중"}
      </p>
      <p>
        인원: {currentPlayers} / {maxPlayers}
      </p>
      <button onClick={onJoin} disabled={isPlaying}>
        {isPlaying ? "입장 불가" : "입장하기"}
      </button>
    </div>
  );
};

// PropTypes 정의
RoomCard.propTypes = {
  roomName: PropTypes.string.isRequired, // roomName은 필수이며 문자열
  currentPlayers: PropTypes.number.isRequired, // currentPlayers는 필수이며 숫자
  maxPlayers: PropTypes.number.isRequired, // maxPlayers는 필수이며 숫자
  isPlaying: PropTypes.bool.isRequired, // isPlaying은 필수이며 불리언
  onJoin: PropTypes.func.isRequired, // onJoin은 필수이며 함수
};

export default RoomCard;

//Q1. maxplayer는 고정값?