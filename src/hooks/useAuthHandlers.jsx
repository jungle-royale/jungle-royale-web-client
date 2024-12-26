//로그아웃 처리리
import { useNavigate } from "react-router-dom";
import { useLoginContext } from "../contexts/LoginContext";
import { logout } from "../api";

function useAuthHandlers() {
  const { setIsLogin } = useLoginContext();
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  const handleLogout = async () => {
    try {
      await logout();
      setIsLogin(false);
      alert("로그아웃되었습니다.");
      navigate("/");
    } catch (error) {
      console.error("로그아웃 요청 실패:", error.message);
      alert("로그아웃 요청 중 문제가 발생했습니다.");
    }
  };


  return { handleLogin, handleLogout };
}

export default useAuthHandlers;