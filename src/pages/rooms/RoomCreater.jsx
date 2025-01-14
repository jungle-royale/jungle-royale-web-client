import { useState } from 'react';
import { createRoom } from "../../api";
import { useClickLock } from '../../contexts/ClickLockContext';
import log from 'loglevel';

const RoomCreater = () => {
  const [roomName, setRoomName] = useState('');
  const [minPlayers, setMinPlayers] = useState('');
  const [maxGameTime, setMaxGameTime] = useState('');
  const [errors, setErrors] = useState({});
  const { isLocked, lock, unlock } = useClickLock();

  const randomTitles = [
    "신나는 방",
    "모험의 시작",
    "숨겨진 보물찾기",
    "치열한 전투",
    "평화로운 마을",
  ];

  const validateField = (name, value) => {
    let error = "";
    if (name === "roomName") {
      if (value.length > 15) {
        error = "방 이름은 최대 15자까지 가능합니다.";
      }
    }
    if (name === "minPlayers") {
      if (!value || parseInt(value, 10) < 2 || parseInt(value, 10) > 100) {
        error = "최소 인원은 2에서 100 사이의 값이어야 합니다.";
      }
    }
    if (name === "maxGameTime") {
      if (!value || parseInt(value, 10) < 1 || parseInt(value, 10) > 10) {
        error = "게임 소요 시간은 1에서 10 사이의 값이어야 합니다.";
      }
    }
    return error;
  };

  const handleChange = (name, value) => {
    const newErrors = { ...errors };
    const error = validateField(name, value);
    if (error) {
      newErrors[name] = error;
    } else {
      delete newErrors[name];
    }

    setErrors(newErrors);

    if (name === "roomName") setRoomName(value);
    if (name === "minPlayers") setMinPlayers(value.replace(/\D/g, '')); // 숫자만 허용
    if (name === "maxGameTime") setMaxGameTime(value.replace(/\D/g, '')); // 숫자만 허용
  };

  const handleCreateRoom = async () => {
    const newErrors = {};
    newErrors.minPlayers = validateField("minPlayers", minPlayers);
    newErrors.maxGameTime = validateField("maxGameTime", maxGameTime);
    newErrors.roomName = validateField("roomName", roomName);

    if (Object.values(newErrors).some((error) => error)) {
      setErrors(newErrors);
      unlock();
      return;
    }

    const defaultRoomName = randomTitles[Math.floor(Math.random() * randomTitles.length)];
    const roomDetails = {
      title: roomName || defaultRoomName,
      maxPlayers: 100,
      minPlayers: parseInt(minPlayers, 10),
      maxGameTime: parseInt(maxGameTime, 10),
    };

    try {
      const response = await createRoom(roomDetails);
      log.info("방 생성 성공:", response);
      const { roomId, clientId, username } = response.data;
      window.history.pushState({ from: "RoomCreater" }, "", "/room");
      window.location.href = `${import.meta.env.VITE_MAIN_URL}/room?roomId=${roomId}&clientId=${clientId}&username=${username}`;
    } catch (error) {
      log.error("방 생성 중 오류 발생:", error.response?.data || error.message);
      // alert("방 생성 중 문제가 발생했습니다. 다시 시도해주세요.");
    } finally {
      unlock();
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-cover bg-center relative pt-20 pb-20"
      style={{
        backgroundImage: `url(/assets/snowy_background.png)`,
      }}
    >
      {/* 어두운 오버레이 */}
      <div className="absolute inset-0 bg-black bg-opacity-50 z-0"></div>

      {/* 네모 박스 반응형 넓이 설정 */}
      <div
        className="shadow-lg rounded-lg px-6 py-12 z-10 relative w-full max-w-xl md:max-w-2xl"
        style={{
          backgroundImage: `url(/assets/room_create_page.png)`,
          backgroundSize: "auto",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      >
        <div className="flex flex-col space-y-4">
          {/* 방 이름 */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">방 이름</label>
            <input
              type="text"
              value={roomName}
              onChange={(e) => handleChange("roomName", e.target.value)}
              placeholder="방 이름을 입력하세요(미입력 시 랜덤)"
              className={`w-full px-4 py-2 border rounded-md outline-none text-lg ${
                errors.roomName ? "border-red-500 focus:ring-red-400" : "focus:ring-2 focus:ring-blue-400"
              }`}
            />
            {errors.roomName && <p className="text-red-500 text-sm mt-1">{errors.roomName}</p>}
          </div>

          {/* 최소 인원 */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">최소 인원</label>
            <input
              type="text" // 숫자만 허용
              value={minPlayers}
              onChange={(e) => handleChange("minPlayers", e.target.value)}
              placeholder="2 ~ 100명"
              className={`w-full px-4 py-2 border rounded-md outline-none text-lg ${
                errors.minPlayers ? "border-red-500" : "focus:ring-2 focus:ring-blue-400"
              }`}
            />
            {errors.minPlayers && <p className="text-red-500 text-sm mt-1">{errors.minPlayers}</p>}
          </div>

          {/* 게임 소요 시간 */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">게임 소요 시간 (분)</label>
            <input
              type="text" // 숫자만 허용
              value={maxGameTime}
              onChange={(e) => handleChange("maxGameTime", e.target.value)}
              placeholder="1 ~ 10분"
              className={`w-full px-4 py-2 border rounded-md outline-none text-lg ${
                errors.maxGameTime ? "border-red-500" : "focus:ring-2 focus:ring-blue-400"
              }`}
            />
            {errors.maxGameTime && <p className="text-red-500 text-sm mt-1">{errors.maxGameTime}</p>}
          </div>
        </div>
      </div>

      {/* 버튼과 박스 사이에 여백 추가 */}
      <button
        className="relative w-80 h-24 bg-transparent border-none outline-none cursor-pointer mt-6 
                  transition-transform duration-300 ease-in-out transform hover:scale-110"
        onClick={() => {
          if (!isLocked) {
            lock();
            handleCreateRoom();
          }
        }}
        disabled={isLocked}
        style={{
          backgroundImage: `url(${isLocked ? "/assets/loading_button.png" : "/assets/game_button.png"})`,
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      >
        {/* 버튼 내용은 보이지 않게 */}
        <span className="sr-only">{isLocked ? "방 생성 중..." : "방 생성"}</span>
      </button>
    </div>
  );
};

export default RoomCreater;
