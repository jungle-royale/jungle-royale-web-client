import { useState, useEffect, useRef } from "react";
import { useSwipeable } from "react-swipeable";
import { fetchRooms, returnRoom } from "../../api";
import useSafeNavigation from "../../hooks/useSafeNavigation";
import Modal from "../../components/Modal";
import RoomCard from "../../components/RoomCard";
import isEqual from "lodash/isEqual";
import QRcode from "../../utils/QRcode";
import "./RoomList.css";

const RoomList = () => {
  const [rooms, setRooms] = useState([]);
  const roomsRef = useRef([]); // rooms 데이터를 useRef로 관리
  const [userName, setUserName] = useState("");
  const [isLoading, setIsLoading] = useState(true); // 서버 통신 상태 추가
  const [isQRCodeOpen, setQRCodeOpen] = useState(false);
  const [qrData, setQRData] = useState("");
  const [roomIdForNavigation, setRoomIdForNavigation] = useState("");
  const { navigateSafely } = useSafeNavigation();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRooms = rooms.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.max(1, Math.ceil(rooms.length / itemsPerPage));

  const getPaddedRooms = (currentRooms, itemsPerPage) => {
    const paddedRooms = [...currentRooms];
    while (paddedRooms.length < itemsPerPage) {
      const placeholder = { id: `placeholder-${paddedRooms.length}`, isPlaceholder: true };
      paddedRooms.push(placeholder);
    }
    return paddedRooms;
  };

  const paddedRooms = isLoading
    ? Array.from({ length: itemsPerPage }, (_, i) => ({ id: `loading-${i}`, isLoading: true }))
    : getPaddedRooms(currentRooms, itemsPerPage);

  useEffect(() => {
    
    const loadRooms = async () => {
      setIsLoading(true); // 로딩 상태 시작
      try {
        const response = await fetchRooms();
        const newRooms = response.data.gameRooms;
        const newUserName = response.data.userInfo.username;

        setUserName(newUserName);

        // 이전 rooms와 비교하여 변경된 경우에만 업데이트
        if (!isEqual(roomsRef.current, newRooms)) {
          roomsRef.current = newRooms; // useRef에 새 데이터 저장
          setRooms(newRooms); // 렌더링 상태 업데이트
        }

      } catch (error) {
        console.error("방 목록을 불러오는 중 오류 발생:", error);
      } finally {
        setIsLoading(false); // 로딩 상태 종료
      }
    };

    loadRooms();
    // const interval = setInterval(loadRooms, 500000);
    // return () => clearInterval(interval);
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

  const swipeHandlers = useSwipeable({
    onSwipedUp: () => setCurrentPage((prevPage) => (prevPage === totalPages ? 1 : prevPage + 1)), // 다음 페이지
    onSwipedDown: () => setCurrentPage((prevPage) => (prevPage === 1 ? totalPages : prevPage - 1)), // 이전 페이지
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  return (
    <div className="room-container">
      <div className="room-user-info">
        <p>안녕하세요, {userName}님!</p>
        <button onClick={handleReturn}>돌아가기</button>
        <button className="room-creater-go" onClick={(e) => navigateSafely(e, "/room/create")}>
          🛠 방 생성
        </button>
      </div>
      <div className="room-page" {...swipeHandlers}>
        <h1>게임 방 목록</h1>
        <div className="room-wrapper">
          <div className="room-list">
            {paddedRooms.map((room) =>
              room.isLoading ? (
                <RoomCard key={room.id} isLoading={true} />
              ) : room.isPlaceholder ? (
                <RoomCard key={room.id} isPlaceholder={true} />
              ) : (
                <RoomCard
                  key={room.id}
                  roomName={room.title}
                  minPlayers={room.minPlayers}
                  maxPlayers={room.maxPlayers}
                  isPlaying={room.status}
                  onJoin={() => handleJoinRoom(room)}
                />
              )
            )}
          </div>
        </div>
      </div>
      <Modal isOpen={isQRCodeOpen} onClose={() => setQRCodeOpen(false)}>
        <QRcode qrdata={qrData} />
        <button
          onClick={(event) =>
            navigateSafely(event, `/room/ready?roomId=${roomIdForNavigation}`)
          }
          className="modal-button"
        >
          바로가기
        </button>
      </Modal>
    </div>
  );
};

export default RoomList;