import { useNavigate } from "react-router-dom";
//import axios from "axios";  //서버 로그아웃 구현 시 잠금 해제


function useAuthHandlers(setIsLogin) {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  const handleLogout = () => {
    //서버 없이 로그아웃
    // 로그인 상태 업데이트
    setIsLogin(false);
    alert("로그아웃되었습니다.");
    navigate("/");
    // try {
    //   const response = await axios.post("http://192.168.1.241:8080/api/auth/logout"
    //     , {}, {
    //     headers: { Authorization: `Bearer ${localStorage.getItem("refresh_token")}` },
    //     "Content-Type": "application/json",
    //   });
  
    //   if (response.data.success) {
    //     // 성공적인 로그아웃 처리  
    //     setIsLogin(false);
    //     alert("로그아웃되었습니다.");
    //     navigate("/");
    //   } else {
    //     // 서버에서 오류 반환
    //     alert(response.data.message || "로그아웃 처리에 실패했습니다.");
    //   }
    // } catch (error) {
    //   console.error("로그아웃 요청 실패:", error.response || error.message);
    //   alert("로그아웃 요청 중 문제가 발생했습니다.");
    // }
  };

  return { handleLogin, handleLogout };
}

export default useAuthHandlers;
