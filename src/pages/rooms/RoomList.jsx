import { useState, useEffect } from "react";
import { fetchRooms, returnRoom } from "../../api";
import useSafeNavigation from "../../hooks/useSafeNavigation";
import Modal from "../../components/Modal";
import RoomCard from "../../components/RoomCard";
import StompChat from "../../components/chat/StompChat";
import QRcode from "../../utils/QRcode";
import isEqual from "lodash/isEqual";
// import LogoutIcon from "../../components/LogoutIcon";
import log from "loglevel";
import LoadingSpinner from "../../components/LoadingSpinner"; // 스피너 컴포넌트 import

const RoomList = () => {
  const [rooms, setRooms] = useState([]);
  const [userName, setUserName] = useState("");
  const [userStatus, setUserStatus] = useState("");
  //QRmodal
  const [isQRCodeOpen, setQRCodeOpen] = useState(false);
  const [qrData, setQRData] = useState("");
  //진입 실패 modal
  const [isWarningModalOpen, setWarningModalOpen] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");

  const [roomIdForNavigation, setRoomIdForNavigation] = useState("");
  const { navigateSafely } = useSafeNavigation();
  const [isLoaded, setIsLoaded] = useState(false); // 로딩 상태
  const [isDataLoading, setIsDataLoading] = useState(true); // 데이터 로딩 상태
  const [jwtToken, setJwtToken] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      setIsLoaded(true);
    }, 10);
  }, []);

  useEffect(() => {
    let intervalId = null;

    const checkJwtAndFetchRooms = async () => {
      const token = localStorage.getItem("jwt_token");

      if (!token) {
        log.info("JWT 토큰이 없습니다. API 호출을 건너뜁니다.");
        setIsDataLoading(false); // 로딩 종료
        return;
      }

      if (!jwtToken) {
        setJwtToken(token);
      }

      let previousRooms = [];
      const loadRooms = async () => {
        try {
          const response = await fetchRooms();
          log.info(response);
          const newRooms = response.data.gameRooms;
          const newUserName = response.data.userInfo.username;
          const newUserStatus = response.data.userInfo.userStatus;

          if (!isEqual(previousRooms, newRooms)) {
            setRooms((prevRooms) => {
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
          setUserStatus(newUserStatus);
          setIsDataLoading(false); // 데이터 로드 완료
        } catch (error) {
          log.error("방 목록을 불러오는 중 오류 발생:", error);
          setIsDataLoading(false); // 오류 발생 시 로딩 종료
        }
      };

      loadRooms();
      intervalId = setInterval(() => {
        loadRooms();
      }, 10000000000); //데이터 로드 시간
    };

    checkJwtAndFetchRooms();

    const jwtCheckInterval = setInterval(() => {
      const token = localStorage.getItem("jwt_token");
      if (token && token !== jwtToken) {
        setJwtToken(token);
        checkJwtAndFetchRooms();
      }
    }, 5000);

    return () => {
      clearInterval(intervalId);
      clearInterval(jwtCheckInterval);
    };
  }, [jwtToken]);

  const handleReturn = async () => {
    const response = await returnRoom();
    const gameUrl = `${import.meta.env.VITE_MAIN_URL}/room?roomId=${response.roomId}&clientId=${response.clientId}`;
    window.location.href = gameUrl;
  };

  const handleJoinRoom = (room) => {
    if (userStatus !== "WAITING") {
      setWarningMessage("게임 진행 중에는 다른 방에 들어갈 수 없습니다.");
      setWarningModalOpen(true);
      return;
    }

    const staticUrl = `${import.meta.env.VITE_BASE_URL}/room/ready?roomId=${room.id}`;
    log.info("QR url 출력", staticUrl);
    setQRData(staticUrl);
    setRoomIdForNavigation(room.id);
    setQRCodeOpen(true);
  };

  if (!isLoaded || isDataLoading) {
    // 로딩 상태라면 스피너를 표시
    return (
      <div className="flex items-center justify-center min-h-[100dvh] bg-black bg-opacity-50">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div
      className="flex flex-col pt-16 items-center min-h-[100dvh] bg-cover bg-center"
    >
      <div className="z-10 w-full max-w-5xl p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center mb-3 p-4 bg-[#107D9C] bg-opacity-80 border border-gray-300 rounded-lg shadow-lg h-auto">
          <img
            src="/assets/icon.png"
            alt="프로필 이미지"
            className="w-20 h-20 rounded-full mr-6"
          />
          <div className="flex-1 mb-4 sm:mb-0">
            <p className="text-3xl font-bold text-blue-200">{userName}</p>
          </div>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 w-full sm:w-auto">
            {userStatus === "WAITING" ? (
              <button
                className="w-64 h-20 bg-transparent border-none outline-none cursor-pointer transition-transform duration-300 ease-in-out transform hover:scale-105"
                onClick={(e) => navigateSafely(e, "/room/create")}
                style={{
                  backgroundImage: `url('/assets/new_game_button.png')`,
                  backgroundSize: "contain",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                }}
              >
                <span className="sr-only">새로하기</span>
              </button>
            ) : (
              <button
                className="w-64 h-20 bg-transparent border-none outline-none cursor-pointer transition-transform duration-300 ease-in-out transform hover:scale-105"
                onClick={handleReturn}
                style={{
                  backgroundImage: `url('/assets/continue_button.png')`,
                  backgroundSize: "contain",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                }}
              >
                <span className="sr-only">이어하기</span>
              </button>
            )}
          </div>
        </div>
        <div className="grid place-items-center w-full max-w-5xl">
          <div
            className={`w-full bg-[#107D9C] bg-opacity-90 border border-gray-300 shadow-lg rounded-lg p-6 transform transition-transform duration-700 ${
              isLoaded ? "translate-y-0" : "translate-y-full"
            } overflow-y-auto scrollbar-hidden`}
            style={{
              height: "calc(100vh - 400px)",
            }}
          >
            {rooms.length === 0 ? (
              <div className="text-center text-white text-lg font-medium">
                생성된 방이 없습니다.<br />
                방을 생성해주세요.
              </div>
            ) : (
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
            )}
          </div>
        </div>
        <div className="mt-3 w-full bg-white border rounded-lg shadow-lg">
          <StompChat nickname={userName} />
        </div>
      </div>

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
      <Modal isOpen={isWarningModalOpen} onClose={() => setWarningModalOpen(false)}>
        <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg">
          <p className="text-lg font-medium text-red-600 mb-4">{warningMessage}</p>
          <button
            className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition"
            onClick={() => setWarningModalOpen(false)}
          >
            닫기
          </button>
        </div>
      </Modal>

    </div>
  );
};

export default RoomList;
