import { useNavigate } from "react-router-dom";
import { useLoginContext } from "../contexts/LoginContext";

const useNavigateToMypage = () => {
  const { isLogin } = useLoginContext();
  const navigate = useNavigate();

  return () => {
    const role = localStorage.getItem("role");
    if (!isLogin || role === "GUEST") {
      alert("회원만 접근할 수 있는 페이지입니다.");
      navigate("/login");
    } else {
      navigate("/mypage");
    }
  };
};

export default useNavigateToMypage;
