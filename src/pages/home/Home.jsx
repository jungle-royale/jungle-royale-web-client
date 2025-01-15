import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useLoginContext } from "../../contexts/LoginContext.jsx";
import { useClickLock } from "../../contexts/ClickLockContext.jsx";
import Snowfall from "../../utils/SnowFall.jsx";

const ActionButton = ({ handleClick, imageSrc, altText }) => {
  return (
    <img
      src={imageSrc}
      alt={altText}
      className="cursor-pointer w-40 h-auto transition-transform transform hover:scale-105"
      onClick={handleClick}
    />
  );
};

const Home = () => {
  const { isLogin } = useLoginContext();
  const { isLocked, lock, unlock } = useClickLock();
  const navigate = useNavigate();

  const handleButtonClick = () => {
    if (isLocked) return;
    lock();
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
      className="bg-cover bg-center bg-fixed min-h-[100dvh] drag-none select-none"
      style={{
        backgroundImage: `url(/assets/background.webp)`,
      }}
    >
      <Snowfall />
      <div className="flex flex-col items-center justify-center pt-16 min-h-[100dvh] bg-black bg-opacity-50 text-center">
        <div className="pb-8 max-w-[400px] w-[30%] min-w-[150px]">
          <img
            src="/assets/home_logo.png"
            alt="Game Logo"
            className="object-contain w-full h-auto"
          />
        </div>

        <div className="flex space-x-4">
          <ActionButton
            handleClick={handleButtonClick}
            imageSrc={isLogin ? "/assets/game_button.png" : "/assets/login_button.png"}
            altText={isLogin ? "Game Start Button" : "Login Button"}
          />
        </div>
      </div>
    </div>
  );
};

ActionButton.propTypes = {
  handleClick: PropTypes.func.isRequired,
  imageSrc: PropTypes.string.isRequired,
  altText: PropTypes.string.isRequired,
};

export default Home;
