import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="app">
      {/* 대문 사진 */}
      <div className="main-bg"></div>
      <div>
        <Button text="Room List" onClick={() => navigate("/rooms")} />
      </div>
    </div>
  );
};

export default Home;
