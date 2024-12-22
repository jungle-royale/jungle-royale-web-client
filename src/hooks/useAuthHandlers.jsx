import { useNavigate } from "react-router-dom";
import axios from "axios";


function useAuthHandlers(setIsLogin) {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  const handleLogout = async () => {
    try {
      // const response = await axios.post("http://192.168.1.241:8080/api/auth/logout"
      //   , {}, {
      //   authorization_access: `Bearer ${localStorage.getItem("access_token")}` ,
      //   authorization_refresh: `Bearer ${localStorage.getItem("refresh_token")}` ,
      //   "Content-Type": "application/json",
      // });

      const response = await axios.post(
        "http://192.168.1.241:8080/api/auth/logout",
        {}, {
          headers: {
            authorization_access: `Bearer ${localStorage.getItem("access_token")}` ,
            authorization_refresh: `Bearer ${localStorage.getItem("refresh_token")}` ,
          },
          "Content-Type": "application/json",
        }
      );
  
      if (response.data.success) {
        // 성공적인 로그아웃 처리
        localStorage.removeItem("access_token");
        localStorage.removeItem("expires_in");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("isLogin");
        localStorage.removeItem("isGuest");
        setIsLogin(false);
        alert("로그아웃되었습니다.");
        navigate("/");
      } else {
        // 서버에서 오류 반환
        alert(response.data.message || "로그아웃 처리에 실패했습니다.");
      }
    } catch (error) {
      console.error("로그아웃 요청 실패:", error.response || error.message);
      alert("로그아웃 요청 중 문제가 발생했습니다.");
    }
  };

  return { handleLogin, handleLogout };
}

export default useAuthHandlers;
