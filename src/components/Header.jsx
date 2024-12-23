import Button from "./Button";
import { useLoginContext } from "../contexts/LoginContext";
import useAuthHandlers from "../hooks/useAuthHandlers";

const Header = () => {
  const { isLogin } = useLoginContext();
  const { handleLogin, handleLogout } = useAuthHandlers();

  return (
    <header>
      <h1>Jungle Royal</h1>
      {isLogin ? (
        <Button text="Logout" type="secondary" onClick={handleLogout} />
      ) : (
        <Button text="Login" type="primary" onClick={handleLogin} />
      )}
    </header>
  );
};

export default Header;