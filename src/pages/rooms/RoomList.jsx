import { useState, useEffect } from "react";
import { useSwipeable } from "react-swipeable";
import { fetchRooms, returnRoom } from "../../api";
import useSafeNavigation from "../../hooks/useSafeNavigation";
import Modal from "../../components/Modal";
import RoomCard from "../../components/RoomCard";
// import StompChat from "../../components/StompChat";
import isEqual from "lodash/isEqual"; // lodash를 사용하는 경우
import QRcode from "../../utils/QRcode";
import "./RoomList.css";


const RoomList = () => {
  const [rooms, setRooms] = useState([]);
  const [userName, setUserName] = useState("");
  const [isQRCodeOpen, setQRCodeOpen] = useState(false);
  const [qrData, setQRData] = useState("");
  const [roomIdForNavigation, setRoomIdForNavigation] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { navigateSafely } = useSafeNavigation();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRooms = rooms.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.max(1, Math.ceil(rooms.length / itemsPerPage));

  useEffect(() => {
    let previousRooms = [];
    const loadRooms = async () => {
      try {
        const response = await fetchRooms();
        const newRooms = response.data.gameRooms;
        const newUserName = response.data.userInfo.username;

        // 변경 사항이 있는 경우만 업데이트
        if (!isEqual(previousRooms, newRooms)) {
          console.log("Update 방 목록");
          setRooms(newRooms);
          previousRooms = newRooms;
        }
        setUserName(newUserName);
      } catch (error) {
        console.error("방 목록을 불러오는 중 오류 발생:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // 초기 로드
    loadRooms();

    // 10초마다 방 목록 업데이트
    const interval = setInterval(() => {
      loadRooms();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleReturn = async() => {
    const response = await returnRoom();
    const gameUrl = `http://game.eternalsnowman.com/room?roomId=${response.roomId}&clientId=${response.clientId}`;
    window.location.href = gameUrl; 
  }

  const handleJoinRoom = (room) => {
    const staticUrl = `${import.meta.env.VITE_KAKAO_REDIRECT_URL}/room/ready?roomId=${room.id}`;
    setQRData(staticUrl);
    setRoomIdForNavigation(room.id);
    setQRCodeOpen(true);
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => (prevPage === totalPages ? 1 : prevPage + 1));
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => (prevPage === 1 ? totalPages : prevPage - 1));
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: handleNextPage,  // Swipe left -> Next page
    onSwipedRight: handlePrevPage, // Swipe right -> Previous page
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  return (
    <div className="room-container">
      <div className="room-user-info">
        <p>안녕하세요, {userName}님!</p>
        <button onClick={handleReturn}>돌아가기</button>
        <button className="room-creater-go" onClick={(e) => navigateSafely(e, '/room/create')}>
          🛠 방 생성
        </button>
      </div>
      <div className="room-page" {...swipeHandlers}>
        <h1>게임 방 목록</h1>
        <div className="room-list">
          {isLoading
            ? Array(6).fill(null).map((_, index) => (
              <RoomCard
                key={index}
                roomName="Loading..."
                minPlayers={0}
                maxPlayers={0}
                isPlaying=""
                onJoin={() => {}}
                isLoading={true}
              />
            ))
          :
          currentRooms.map((room) => (
            <RoomCard
              key={room.id}
              roomName={room.title}
              minPlayers={room.minPlayers}
              maxPlayers={room.maxPlayers}
              isPlaying={room.status}
              onJoin={() => handleJoinRoom(room)}
              isLoading={isLoading}
            />
          ))}
        </div>
        <div className="pagination-controls">
          <button onClick={handlePrevPage}>이전</button>
          <span>
            {currentPage} / {totalPages}
          </span>
          <button onClick={handleNextPage}>다음</button>
        </div>
      </div>
      {/* <StompChat nickname={userName} /> */}
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
