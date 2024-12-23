import Button from "../components/Button";
import { useNavigate } from "react-router-dom";


const Home = () => {
  const navigate = useNavigate();

  return(
    <div>
      <Button text="Room List" onClick={() => navigate("/rooms")}/>
    </div>
  );

};

export default Home;