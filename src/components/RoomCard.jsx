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
        className={`p-4 bg-gradient-to-b from-blue-300 to-blue-100 rounded-xl shadow-lg border-4 border-dashed border-white flex items-center justify-center ${className}`}
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
    return (
      <div
        className={`p-4 bg-gradient-to-r from-blue-200 via-cyan-200 to-blue-400 opacity-50 rounded-lg shadow-lg border-4 border-dotted border-blue-300 ${className}`}
      ></div>
    );
  }

  const isJoinable = isPlaying === "WAITING" && minPlayers < maxPlayers;

  return (
    <div
      className={`p-6 bg-gradient-to-r from-cyan-200 via-blue-300 to-indigo-400 rounded-[1rem] shadow-xl border-[3px] border-solid border-white transform hover:scale-105 hover:shadow-2xl transition duration-300 ${
        isJoinable ? "cursor-pointer" : "opacity-60 cursor-not-allowed"
      } ${className}`}
      onClick={isJoinable ? onJoin : undefined}
    >
      {/* 상태 표시 */}
      <div
        className={`w-10 h-10 mb-4 rounded-[0.5rem] border-4 ${
          isJoinable
            ? "bg-green-500 border-white animate-pulse"
            : "bg-red-400 border-gray-200"
        }`}
      ></div>

      {/* 방 이름 */}
      <h2 className="text-lg font-bold font-game text-gray-100 text-center drop-shadow-lg">
        {roomName}
      </h2>

      {/* 플레이어 정보 */}
      <p className="mt-2 text-sm font-game text-gray-200 text-center drop-shadow-md">
        {minPlayers} / {maxPlayers} 인원
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
