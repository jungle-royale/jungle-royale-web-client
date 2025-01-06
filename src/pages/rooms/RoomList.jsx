import { useState, useEffect } from "react";
import { useSwipeable } from "react-swipeable";
import { fetchRooms } from "../../api";
import useSafeNavigation from "../../hooks/useSafeNavigation";
import Modal from "../../components/Modal";
import RoomCreater from "./RoomCreater";
import RoomCard from "../../components/RoomCard";
import StompChat from "../../components/StompChat";
import QRcode from "../../utils/QRcode";
import "./RoomList.css";

const RoomList = () => {
  const [rooms, setRooms] = useState([]);
  const [userName, setUserName] = useState("");
  const [isQRCodeOpen, setQRCodeOpen] = useState(false);
  const [qrData, setQRData] = useState("");
  const [roomIdForNavigation, setRoomIdForNavigation] = useState("");
  const [isRoomCreaterOpen, setRoomCreaterOpen] = useState(false);
  const { navigateSafely } = useSafeNavigation();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRooms = rooms.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(rooms.length / itemsPerPage);

  useEffect(() => {
    const loadRooms = async () => {
      try {
        const response = await fetchRooms();
        setRooms(response.data.gameRooms);
        setUserName(response.data.userInfo.username);
      } catch (error) {
        console.error("방 목록을 불러오는 중 오류 발생:", error);
      }
    };
    loadRooms();
  }, []);

  const handleJoinRoom = (room) => {
    const staticUrl = `${import.meta.env.VITE_API_BASE_URL}/room/ready?roomId=${room.id}`;
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
      </div>
      <div className="room-page" {...swipeHandlers}>
        <h1>게임 방 목록</h1>
        <img
          src="/assets/pluscircle.png"
          className="room-creater-go"
          alt="Room Creater"
          onClick={() => setRoomCreaterOpen(true)}
        />
        <div className="room-list">
          {currentRooms.map((room) => (
            <RoomCard
              key={room.id}
              roomName={room.title}
              currentPlayers={room.currentPlayers}
              maxPlayers={room.maxPlayers}
              isPlaying={room.status}
              onJoin={() => handleJoinRoom(room)}
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
      <StompChat />
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
      <Modal isOpen={isRoomCreaterOpen} onClose={() => setRoomCreaterOpen(false)}>
        <RoomCreater />
      </Modal>
    </div>
  );
};

export default RoomList;
