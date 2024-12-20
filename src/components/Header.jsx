import { useNavigate } from "react-router-dom";


const Header = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/social-kakao");
  }
  return(
    <header>
      <h1>Jungle Royal</h1>
      <button onClick={handleLoginClick}>login</button>
    </header>
  )

};

export default Header;