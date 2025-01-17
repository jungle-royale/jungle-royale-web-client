import { useState, useEffect, useRef } from "react";
import { fetchRooms, returnRoom } from "../../api";
import useSafeNavigation from "../../hooks/useSafeNavigation";
import { useNavigate } from "react-router-dom";
import Modal from "../../components/Modal";
import RoomCard from "../../components/RoomCard";
// import StompChat from "../../components/StompChat";
import QRcode from "../../utils/QRcode";
import tierImages from "../../utils/TierImages";
import isEqual from "lodash/isEqual";
// import LogoutIcon from "../../components/LogoutIcon";
import log from "loglevel";
import LoadingSpinner from "../../components/LoadingSpinner"; // 스피너 컴포넌트 import

const RoomList = () => {
  const [rooms, setRooms] = useState([]); // 방 목록
  const [userName, setUserName] = useState(""); // 사용자 이름
  const [userStatus, setUserStatus] = useState(""); // 사용자 상태(inGame?)
  const [userScore, setUserScore] = useState(""); // 사용자 점수
  const [userRank, setUserRank] = useState(""); // 사용자 랭킹
  const [userTier, setUserTier] = useState(""); // 사용자 티어
  const [isQRCodeOpen, setQRCodeOpen] = useState(false); // QR코드 모달 상태
  const [qrData, setQRData] = useState(""); // QR코드 데이터
  const [isWarningModalOpen, setWarningModalOpen] = useState(false); // 경고 모달 상태
  const [warningMessage, setWarningMessage] = useState(""); // 경고 메시지
  const [roomIdForNavigation, setRoomIdForNavigation] = useState(""); // 네비게이션용 방 ID
  const { navigateSafely } = useSafeNavigation(); // 안전한 네비게이션 훅
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false); // 애니메이션 로딩 상태
  const [isDataLoading, setIsDataLoading] = useState(true); // 데이터 로딩 상태
  const [jwtToken, setJwtToken] = useState(null); // JWT 토큰
  const warningShown = useRef(false); // 경고창 표시 상태 추적


  // 데이터 로딩 완료 후 애니메이션 활성화
  useEffect(() => {
    if (!isDataLoading) {
      setTimeout(() => {
        setIsLoaded(true); // 데이터 로딩 완료 후 애니메이션 활성화
      }, 10);
    }
  }, [isDataLoading]);

  //로그인 여부 확인
  useEffect(() => {
    const token = localStorage.getItem("jwt_token");

    if(!token && !warningShown.current){
      log.info("로그인되지 않은 상태입니다.");
      setWarningMessage("로그인이 필요합니다. 로그인 페이지로 이동합니다.");
      setWarningModalOpen(true);
      warningShown.current = true;

      // 3초 후 로그인 페이지로 이동
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } else {
      setJwtToken(token);
    }
  });

  // 방 목록과 사용자 정보를 주기적으로 로드
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
          const response = await fetchRooms(); // 서버에서 방 목록과 사용자 정보 로드
          log.info(response);
          const newRooms = response.data.gameRooms;
          const newUserName = response.data.userInfo.username;
          const newUserStatus = response.data.userInfo.userStatus;
          const newUserScore = response.data.userInfo.score;
          const newUserRank = response.data.userInfo.rank;
          const newUserTier = response.data.userInfo.tier;

          // 방 목록 변경 여부 확인 후 상태 업데이트
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
          setUserScore(newUserScore);
          setUserRank(newUserRank);
          setUserTier(newUserTier);
          setIsDataLoading(false); // 데이터 로드 완료
        } catch (error) {
          log.error("방 목록을 불러오는 중 오류 발생:", error);
          setIsDataLoading(false); // 오류 발생 시 로딩 종료
        }
      };

      loadRooms();
      intervalId = setInterval(() => {
        loadRooms(); // 주기적으로 방 목록 로드
      }, 5000);
    };

    checkJwtAndFetchRooms();

    // JWT 토큰 변경 감지
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

  // 방 복귀 처리
  const handleReturn = async () => {
    const response = await returnRoom(); // 방 복귀 API 호출
    const gameUrl = `${import.meta.env.VITE_MAIN_URL}/room?roomId=${response.roomId}&clientId=${response.clientId}&username=${response.username}`;
    window.location.href = gameUrl;
  };

  // 방 참여 처리
  const handleJoinRoom = (room) => {
    if (userStatus !== "WAITING") {
      setWarningMessage("게임 진행 중에는 다른 방에 들어갈 수 없습니다."); // 경고 메시지 설정
      setWarningModalOpen(true);
      return;
    }

    const staticUrl = `${import.meta.env.VITE_BASE_URL}/room/ready?roomId=${room.id}`;
    log.info("QR url 출력", staticUrl);
    setQRData(staticUrl);
    setRoomIdForNavigation(room.id);
    setQRCodeOpen(true);
  };

  // 로딩 상태 처리
  if (!isLoaded || isDataLoading) {
    return (
      <div className="flex items-center justify-center min-h-[100dvh] bg-black bg-opacity-50">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col pt-16 items-center min-h-[100dvh] bg-cover bg-center">
      <div className="z-10 w-full max-w-5xl p-6">
        {/* 사용자 정보 표시 */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center mb-3 p-4 bg-[#107D9C] bg-opacity-80 border border-gray-300 rounded-lg shadow-lg h-auto">
          <img
            src="/assets/icon.png"
            alt="프로필 이미지"
            className="w-20 h-20 rounded-full mr-6"
          />
          <div className="flex-1 mb-4 sm:mb-0">
            <div className="flex items-center">
              <p className="text-3xl font-bold text-blue-200">{userName}</p>
              <img
                src={tierImages[userTier] || "/assets/bronze.png"}
                alt={`${userTier} Tier`}
                className="w-10 h-10 ml-3"
                title={`Tier: ${userTier}`}
              />
            </div>
            <p className="text-lg text-white">현재 점수: {userScore}점</p>
            <p className="text-lg text-white">현재 랭킹: {userRank}위</p>
          </div>
          {/* 새로하기 및 이어하기 버튼 */}
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
        {/* 방 목록 표시 */}
        <div className="grid place-items-center w-full max-w-5xl">
          <div
            className={`w-full bg-[#107D9C] bg-opacity-90 border border-gray-300 shadow-lg rounded-lg p-6 transform transition-transform duration-700 ${
              isLoaded ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
            } overflow-y-auto scrollbar-hidden`}
            style={{
              height: "calc(100vh - 300px)",
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
      </div>
      {/* QR 코드 모달 */}
      <Modal isOpen={isQRCodeOpen} onClose={() => setQRCodeOpen(false)}>
        <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg">
          <div className="mb-4 hidden h-sm:hidden">
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
      {/* 경고 모달 */}
      <Modal
        isOpen={isWarningModalOpen}
        onClose={() => setWarningModalOpen(false)}
      >
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
