import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import "./Home.css";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div>
      <div className="image"></div>
      <div className="button-room-list">
      <Button
        text="Room List"
        type="button-room-list"
        onClick={() => navigate("/rooms")}
      />
      </div>
    </div>
  );
};

export default Home;
