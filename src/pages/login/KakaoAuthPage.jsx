import { useEffect, useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import log from 'loglevel';


const KakaoAuthPage = () => {
  const { loginWithKakaoContext } = useAuth();
  const navigate = useNavigate();
  const [status, setStatus] = useState("processing"); // "processing", "success", "error"

  useEffect(() => {
    const handleAuth = async () => {
      const code = new URLSearchParams(window.location.search).get("code");
      if (code) {
        try {
          await loginWithKakaoContext(code);
          setStatus("success");
          setTimeout(() => navigate("/room"), 1500); // 1.5초 후 RoomList로 이동
        } catch (error) {
          log.error("인증 실패:", error.message);
          setStatus("error");
        }
      } else {
        navigate("/"); // code가 없으면 메인 페이지로 이동
      }
    };

    handleAuth();
  }, [loginWithKakaoContext, navigate]);

  if (status === "processing") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="loader animate-spin rounded-full border-4 border-t-4 border-gray-300 h-12 w-12"></div>
        <p className="mt-4 text-lg font-medium text-gray-700">
          로그인 처리 중입니다...
        </p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-red-100">
        <p className="text-lg font-medium text-red-700 mb-4">
          인증에 실패했습니다. 다시 시도해주세요.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
        >
          다시 시도
        </button>
      </div>
    );
  }

  return null;
};

export default KakaoAuthPage;
