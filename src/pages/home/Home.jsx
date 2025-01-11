import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useLoginContext } from "../../contexts/LoginContext.jsx";
import { useClickLock } from "../../contexts/ClickLockContext.jsx";
import Snowfall from "../../utils/SnowFall.jsx";

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

  return (
    <div
      className="bg-cover bg-center bg-fixed h-screen"
      style={{
        backgroundImage: `url(/assets/background.png)`,
      }}
    >
      <Snowfall />
      <div className="flex flex-col items-center justify-center h-full bg-black bg-opacity-50 text-center">
        <div className="mb-8">
          <img
            src="/assets/intro_logo_2.png"
            alt="Game Logo"
            className="object-contain"
          />
        </div>
        <div className="flex space-x-4">
          <ActionButton
            handleClick={handleButtonClick}
            label={isLogin ? "GAME START" : "LOGIN"}
          />
        </div>
      </div>
    </div>
  );
};

ActionButton.propTypes = {
  handleClick: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
};

export default Home;
