import "./RoomCard.css"
import PropTypes from "prop-types"
import Skeleton from "./Skeleton.jsx";


const RoomCard = ({ roomName, minPlayers, maxPlayers, isPlaying, onJoin, isLoading }) => {
  const isJoinable = (isPlaying === "WAITING") && (minPlayers < maxPlayers);
  if (isLoading) {
    return (
      <div className="room-card">
        <Skeleton type="circle" width="30px" height="30px" circle={true} />
        <div style={{ flex: 1 }}>
          <Skeleton width="60%" height="20px" />
          <Skeleton width="40%" height="15px" />
        </div>
        <Skeleton width="20%" height="20px" />
      </div>
    );
  }

  return (
    <div className="room-card">
      <div className={`indicator ${ isJoinable ? "available" : "unavailable" }`}></div>
      <h2>{roomName}</h2>
      <p>
        {minPlayers} ~ {maxPlayers}
      </p>
      <button className="join-button" onClick={onJoin} disabled={!isJoinable}>
        {isJoinable ? "입장하기" : "입장 불가"}
      </button>
    </div>
  );
};

// PropTypes 정의
RoomCard.propTypes = {
  roomName: PropTypes.string.isRequired, // roomName은 필수이며 문자열
  minPlayers: PropTypes.number.isRequired, // minPlayers는 필수이며 숫자
  maxPlayers: PropTypes.number.isRequired, // maxPlayers는 필수이며 숫자
  isPlaying: PropTypes.string.isRequired, // isPlaying은 필수이며 문자열
  onJoin: PropTypes.func.isRequired, // onJoin은 필수이며 함수
  isLoading: PropTypes.bool, 
};


export default RoomCard;
