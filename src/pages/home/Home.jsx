import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
// import { loginGuest } from "../../api.js";
import { useLoginContext } from "../../contexts/LoginContext.jsx";
import { useClickLock } from "../../contexts/ClickLockContext.jsx";
import Snowfall from "../../utils/SnowFall.jsx";
import SendAuthCode from "../../utils/SendAuthCode.jsx";
// import log from "loglevel";

const ActionButton = ({ handleClick, label }) => {
  return (
    <button
      className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition"
      onClick={handleClick}
    >
      {label}
    </button>
  );
};

const Home = () => {
  const { isLogin } = useLoginContext();
  const { isLocked, unlock } = useClickLock();
  const navigate = useNavigate();

  const handleButtonClick = () => {
    if (isLocked) return;
    if (isLogin) {
      navigate("/room");
      unlock();
    } else {
      navigate("/login");
      unlock();
    }
  };

  // const handleLoginGuest = async () => {
  //   if (isLocked) return;
  //   lock();
  //   try {
  //     const response = await loginGuest();
  //     setIsLogin(true);
  //     setUserRole(response.role);
  //     log.info("비회원 Login 성공:", response);
  //     alert("비회원으로 로그인되었습니다.");
  //     navigate("/");
  //   } catch (error) {
  //     console.error("비회원 로그인 처리 중 오류 발생:", error.message);
  //     alert("비회원 로그인 중 문제가 발생했습니다. 다시 시도해주세요.");
  //   } finally {
  //     unlock();
  //   }
  // };

  return (
    <div
      className="bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: `url(/assets/background.png)`,
        height: "calc(100vh - 4rem)", // 헤더 높이만큼 제외
      }}
    >
      <Snowfall />
      <SendAuthCode />
      <div className="flex flex-col items-center justify-center h-full bg-black bg-opacity-50 text-center">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white drop-shadow-lg">
            Welcome to Snowman World
          </h1>
          <p className="text-lg text-gray-300 mt-2">
            Enjoy the game and let it snow!
          </p>
        </div>
        <div className="flex space-x-4">
          <ActionButton
            handleClick={handleButtonClick}
            label={isLogin ? "GAME START" : "LOGIN"}
          />
        </div>
          {/* {!isLogin && (
            <ActionButton
              handleClick={handleLoginGuest}
              label="비회원 로그인"
            />
          )} */}

      </div>
    </div>
  );
  
};

ActionButton.propTypes = {
  handleClick: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
};

export default Home;
