import PropTypes from "prop-types";
import Skeleton from "./Skeleton.jsx";

const RoomCard = ({
  roomName,
  minPlayers,
  maxPlayers,
  isPlaying,
  onJoin,
  isLoading,
  isPlaceholder,
  className,
}) => {
  if (isLoading) {
    return (
      <div
        className={`p-4 bg-gradient-to-b from-blue-300 to-blue-100 rounded-3xl shadow-lg flex items-center justify-center ${className}`}
      >
        <Skeleton type="circle" width="40px" height="40px" circle={true} />
        <div className="flex-1 ml-4">
          <Skeleton width="70%" height="20px" />
          <Skeleton width="50%" height="15px" className="mt-2" />
        </div>
      </div>
    );
  }

  if (isPlaceholder) {
    return <div className={`p-4 bg-gray-200 rounded-3xl shadow-lg ${className}`}></div>;
  }

  const isJoinable = isPlaying === "WAITING" && minPlayers < maxPlayers;

  return (
    <div
      className={`p-6 bg-gradient-to-br from-blue-300 via-blue-200 to-blue-100 rounded-3xl shadow-xl transform hover:scale-105 transition duration-200 ${
        isJoinable ? "cursor-pointer hover:shadow-2xl" : "opacity-60 cursor-not-allowed"
      } ${className}`}
      onClick={isJoinable ? onJoin : undefined}
    >
      {/* 상태 표시 */}
      <div
        className={`w-6 h-6 mb-4 rounded-full ${
          isJoinable ? "bg-green-500 animate-pulse" : "bg-red-400"
        }`}
      ></div>

      {/* 방 이름 */}
      <h2 className="text-lg font-bold font-game text-gray-800">{roomName}</h2>

      {/* 플레이어 정보 */}
      <p className="mt-2 text-sm font-game text-gray-600">
        {minPlayers}인방
      </p>
    </div>
  );
};

RoomCard.propTypes = {
  roomName: PropTypes.string,
  minPlayers: PropTypes.number,
  maxPlayers: PropTypes.number,
  isPlaying: PropTypes.string,
  onJoin: PropTypes.func,
  isLoading: PropTypes.bool,
  isPlaceholder: PropTypes.bool,
  className: PropTypes.string,
};

export default RoomCard;
