import "./Login.css";
import useSafeNavigation from "../../hooks/useSafeNavigation";

const LoginError = () => {
const {navigateSafely} = useSafeNavigation();

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>로그인 실패</h1>
        <p>로그인에 실패했습니다. 다시 시도해주세요.</p>
        <button className="retry-button" onClick={(e) => navigateSafely(e, "/")}>
          재로그인하기
        </button>
      </div>
    </div>
  );
};

export default LoginError;
