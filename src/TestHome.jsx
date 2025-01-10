import { useState, useEffect, useRef, useCallback } from "react";
import { fetchRooms, returnRoom } from "./api";
import useSafeNavigation from "./hooks/useSafeNavigation";
import Modal from "./components/Modal";
import RoomCard from "./components/RoomCard";
import isEqual from "lodash/isEqual";
import QRcode from "./utils/QRcode";
import FloatingButton from "./components/FloatingButton"; // 플로팅 버튼 임포트
import LogoutIcon from "./components/LogoutIcon";

const TestHome = () => {
  const [rooms, setRooms] = useState([]);
  const roomsRef = useRef([]); // rooms 데이터를 useRef로 관리
  const [userName, setUserName] = useState("");
  const [isLoading, setIsLoading] = useState(true); // 서버 통신 상태 추가
  const [isQRCodeOpen, setQRCodeOpen] = useState(false);
  const [qrData, setQRData] = useState("");
  const [roomIdForNavigation, setRoomIdForNavigation] = useState("");
  const { navigateSafely } = useSafeNavigation();
  const [hasMore, setHasMore] = useState(true); // 추가 로드 가능 여부

  const observer = useRef();

  const loadRooms = useCallback(
    async (page = 1) => {
      setIsLoading(true);
      try {
        const response = await fetchRooms({ page });
        const newRooms = response.data.gameRooms;
        const newUserName = response.data.userInfo.username;

        setUserName(newUserName);

        // 중복 데이터 확인 후 추가
        if (!isEqual(roomsRef.current, [...roomsRef.current, ...newRooms])) {
          roomsRef.current = [...roomsRef.current, ...newRooms];
          setRooms(roomsRef.current);
        }

        // 더 이상 로드할 데이터가 없을 경우
        if (newRooms.length === 0) {
          setHasMore(false);
        }
      } catch (error) {
        console.error("방 목록을 불러오는 중 오류 발생:", error);
      } finally {
        setIsLoading(false);
      }
    },
    [roomsRef]
  );

  useEffect(() => {
    loadRooms(1); // 초기 데이터 로드
  }, [loadRooms]);

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

  const lastRoomRef = useCallback(
    (node) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadRooms(Math.ceil(roomsRef.current.length / 6) + 1); // 다음 페이지 로드
        }
      });

      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore, loadRooms]
  );

  return (
    <div className="flex flex-col items-center min-h-screen bg-blue-50 text-gray-800">
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
            <p className="text-lg text-gray-700">현재 랭킹: 123위</p> {/* 임시 랭킹 텍스트 */}
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


  
        {/* 최대 인원 안내 문구 */}
        <p className="text-sm text-gray-500 mb-2">
          * 최대 인원은 100명입니다.
        </p>
  
        {/* 방 목록 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {rooms.map((room, index) => {
            if (rooms.length === index + 1) {
              // 마지막 요소에 ref 연결
              return (
                <RoomCard
                  key={room.id}
                  ref={lastRoomRef}
                  roomName={room.title}
                  minPlayers={room.minPlayers}
                  maxPlayers={room.maxPlayers}
                  isPlaying={room.status}
                  onJoin={() => handleJoinRoom(room)}
                />
              );
            }
            return (
              <RoomCard
                key={room.id}
                roomName={room.title}
                minPlayers={room.minPlayers}
                maxPlayers={room.maxPlayers}
                isPlaying={room.status}
                onJoin={() => handleJoinRoom(room)}
              />
            );
          })}
          {isLoading &&
            Array.from({ length: 6 }).map((_, index) => (
              <RoomCard key={`loading-${index}`} isLoading={true} />
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

export default TestHome;
