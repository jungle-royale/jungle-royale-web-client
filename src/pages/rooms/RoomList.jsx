import { useState, useEffect } from "react";
import { fetchRooms, returnRoom } from "../../api";
import useSafeNavigation from "../../hooks/useSafeNavigation";
import SendAuthCode from "../../utils/SendAuthCode.jsx";
import Modal from "../../components/Modal";
import RoomCard from "../../components/RoomCard";
import QRcode from "../../utils/QRcode";
import isEqual from "lodash/isEqual";
import FloatingButton from "../../components/FloatingButton";
import LogoutIcon from "../../components/LogoutIcon";

const RoomList = () => {
  const [rooms, setRooms] = useState([]);
  const [userName, setUserName] = useState("");
  const [isQRCodeOpen, setQRCodeOpen] = useState(false);
  const [qrData, setQRData] = useState("");
  const [roomIdForNavigation, setRoomIdForNavigation] = useState("");
  const { navigateSafely } = useSafeNavigation();

  useEffect(() => {
    let previousRooms = [];
    const loadRooms = async () => {
      try {
        const response = await fetchRooms();
        const newRooms = response.data.gameRooms;
        const newUserName = response.data.userInfo.username;

        // 변경된 데이터만 업데이트
        if (!isEqual(previousRooms, newRooms)) {
          setRooms((prevRooms) => {
            // 변경된 방만 추가
            const updatedRooms = newRooms.map((newRoom) => {
              const existingRoom = prevRooms.find(
                (room) => room.id === newRoom.id
              );
              return existingRoom ? { ...existingRoom, ...newRoom } : newRoom;
            });

            return updatedRooms;
          });
          previousRooms = newRooms;
        }
        setUserName(newUserName);
      } catch (error) {
        console.error("방 목록을 불러오는 중 오류 발생:", error);
      }
    };

    // 초기 데이터 로드
    loadRooms();

    // 10초마다 데이터 갱신
    const interval = setInterval(() => {
      loadRooms();
    }, 10000);

    return () => clearInterval(interval); // 컴포넌트 언마운트 시 인터벌 제거
  }, []);

  const handleReturn = async () => {
    const response = await returnRoom();
    const gameUrl = `http://game.eternalsnowman.com/room?roomId=${response.roomId}&clientId=${response.clientId}`;
    window.location.href = gameUrl;
  };

  const handleJoinRoom = (room) => {
    const staticUrl = `${import.meta.env.VITE_KAKAO_REDIRECT_URL}/room/ready?roomId=${room.id}`;
    setQRData(staticUrl);
    setRoomIdForNavigation(room.id);
    setQRCodeOpen(true);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-blue-50 text-gray-800">
            <SendAuthCode />

      <div className="w-full max-w-5xl p-6 relative">
        {/* 로그아웃 아이콘 */}
        <div className="absolute -top-6 right-4">
          <LogoutIcon />
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center mb-6 p-6 bg-blue-100 rounded-lg shadow-lg h-auto">
          {/* 프로필 이미지 */}
          <img
            src="/assets/icon.png"
            alt="프로필 이미지"
            className="w-20 h-20 rounded-full mr-6"
          />
          {/* 사용자 정보 */}
          <div className="flex-1 mb-4 sm:mb-0">
            <p className="text-3xl font-bold text-blue-900">{userName}님</p>
            <p className="text-lg text-gray-700">현재 랭킹: 123위</p>
          </div>
          {/* 버튼 영역 */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 w-full sm:w-auto">
            <button
              className="px-6 py-3 text-lg font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition w-full sm:w-auto"
              onClick={handleReturn}
            >
              이어하기
            </button>
            <button
              className="px-6 py-3 text-lg font-medium text-white bg-green-500 rounded-lg hover:bg-green-600 transition w-full sm:w-auto"
              onClick={(e) => navigateSafely(e, "/room/create")}
            >
              새로하기
            </button>
          </div>
        </div>

        {/* 방 목록 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {rooms.map((room) => (
            <RoomCard
              key={room.id}
              roomName={room.title}
              minPlayers={room.minPlayers}
              maxPlayers={room.maxPlayers}
              isPlaying={room.status}
              onJoin={() => handleJoinRoom(room)}
            />
          ))}
        </div>
      </div>

      {/* 모달 */}
      <Modal isOpen={isQRCodeOpen} onClose={() => setQRCodeOpen(false)}>
        <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg">
          <div className="mb-4">
            <QRcode qrdata={qrData} />
          </div>
          <div className="flex space-x-4">
            <button
              className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition"
              onClick={(event) =>
                navigateSafely(
                  event,
                  `/room/ready?roomId=${roomIdForNavigation}`
                )
              }
            >
              바로가기
            </button>
            <button
              className="px-4 py-2 text-sm font-medium text-blue-800 bg-blue-200 rounded-lg hover:bg-blue-300 transition"
              onClick={() => setQRCodeOpen(false)}
            >
              뒤로가기
            </button>
          </div>
        </div>
      </Modal>

      {/* 플로팅 버튼 */}
      <FloatingButton />
    </div>
  );
};

export default RoomList;
