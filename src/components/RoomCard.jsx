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
      className={`p-6 bg-cover bg-center shadow-xl transform hover:scale-105 hover:shadow-2xl transition duration-300 ${
        isJoinable ? "cursor-pointer" : "opacity-60 cursor-not-allowed"
      } ${className}`}
      style={{
        backgroundImage: `url('/assets/roomcard.png')`,
        borderRadius: "16px",
      }}
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
      <h2 className="text-xl font-bold font-bagel text-blue-900 text-center drop-shadow-lg">
        {roomName}
      </h2>

      {/* 플레이어 정보 */}
      <p className="mt-2 text-base font-bagel text-gray-700 text-center drop-shadow-md">
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
