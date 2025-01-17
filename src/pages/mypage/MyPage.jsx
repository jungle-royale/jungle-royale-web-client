import { useEffect, useState } from "react";
import Input from "../../components/Input.jsx";
import log from "loglevel";
import { fetchMyPage, myPageEdit } from "../../api.js";

const MyPage = () => {
  const [nickname, setNickname] = useState("");
  const [message, setMessage] = useState(""); // State for success/error message
  const [messageColor, setMessageColor] = useState(""); // State for message color
  const [errorMessage, setErrorMessage] = useState(""); // State for nickname length error
  const [gift, setGift] = useState(null); // 서버에서 받은 선물 데이터
  // const [isModalOpen, setIsModalOpen] = useState(false); // 모달 상태

  const handleNicknameChange = (e) => {
    const value = e.target.value;
    // 실시간으로 10자 제한 체크
    if (value.length > 10) {
      setErrorMessage("닉네임은 10자 이내로 입력해주세요.");
    } else {
      setErrorMessage(""); // 에러 메시지 초기화
    }
    setNickname(value);
    setMessage(""); // Clear success/error message when editing
  };

  const handleSaveNickname = async () => {
    // 닉네임 길이 초과 시 저장 방지
    if (nickname.length > 10) {
      setErrorMessage("닉네임은 10자 이내로 입력해주세요.");
      return;
    }

    try {
      await myPageEdit(nickname); // Update nickname
      const response = await fetchMyPage();
      log.info(response);
      setNickname(response.data.username || ""); // Update nickname
      setMessage("변경 완료!"); // Success message
      setMessageColor("text-blue-500"); // Blue color for success
    } catch (error) {
      log.error(error);
      setMessage("이미 사용 중인 닉네임입니다."); // Error message
      setMessageColor("text-red-500"); // Red color for error
    }
  };

  // const handleOpenModal = () => setIsModalOpen(true);
  // const handleCloseModal = () => setIsModalOpen(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchMyPage();
        log.info("First Response:", response);
        setNickname(response.data.username || "");
        setGift(response.data.gift || null); // gift 데이터 설정
      } catch (error) {
        log.error("마이페이지 데이터를 불러오는 중 오류 발생:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div
      className="min-h-[100dvh] flex flex-col items-center justify-center bg-cover bg-center relative pt-20 pb-20 px-10"
      style={{
        backgroundImage: `url(/assets/snowy_background.png)`,
      }}
    >
      {/* 어두운 오버레이 */}
      <div className="absolute inset-0 bg-black bg-opacity-50 z-0"></div>

      <div className="bg-white bg-opacity-85 shadow-lg rounded-lg p-6 w-full max-w-md z-10">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">닉네임 정보</h2>
        <Input
          label="닉네임"
          type="text"
          value={nickname}
          onChange={handleNicknameChange}
          placeholder="닉네임 입력"
          className="w-full mb-2 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {/* 실시간 경고 메시지 */}
        {errorMessage && (
          <p className="text-sm text-red-500 mb-4">{errorMessage}</p>
        )}
        <button
          onClick={handleSaveNickname}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
        >
          닉네임 저장
        </button>
        {/* Success/Error Message */}
        {message && (
          <p className={`mt-2 text-sm ${messageColor}`}>{message}</p>
        )}
        <div>
          {/* 선물 URL */}
          {gift && (
            <div className="mt-4 bg-white">
              <p className="text-lg text-gray-700">
                선물 URL:{" "}
                <a
                  href={gift}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline hover:text-blue-700"
                  style={{ pointerEvents: "auto" }} // 클릭 가능하도록 명시적으로 설정
                >
                  {gift}
                </a>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyPage;
