import "./RoomCard.css";
import PropTypes from "prop-types";
import Skeleton from "./Skeleton.jsx";

const RoomCard = ({ roomName, minPlayers, maxPlayers, isPlaying, onJoin, isLoading, isPlaceholder }) => {

    // 상태 로그 추가
    console.log("RoomCard Rendered:", {
      roomName,
      minPlayers,
      maxPlayers,
      isPlaying,
      isLoading,
      isPlaceholder,
    });
  // Skeleton UI 처리
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

  // isPlaceholder 상태 처리
  if (isPlaceholder) {
    return <div className="room-card-placeholder"></div>; // 플레이스홀더 상태일 경우 렌더링
  }


  // 기본 렌더링 처리
  const isJoinable = isPlaying === "WAITING" && minPlayers < maxPlayers;

  return (
    <div
      className={`room-card ${isJoinable ? "clickable" : "not-clickable"}`}
      onClick={isJoinable ? onJoin : undefined} // 클릭 가능 여부에 따라 onJoin 실행
    >
      <div className={`indicator ${isJoinable ? "available" : "unavailable"}`}></div>
      <h2>{roomName}</h2>
      <p>
        {minPlayers} ~ {maxPlayers}
      </p>
    </div>
  );
};

// PropTypes 정의
RoomCard.propTypes = {
  roomName: PropTypes.string,
  minPlayers: PropTypes.number,
  maxPlayers: PropTypes.number,
  isPlaying: PropTypes.string,
  onJoin: PropTypes.func,
  isLoading: PropTypes.bool,
  isPlaceholder: PropTypes.bool,
};

export default RoomCard;
