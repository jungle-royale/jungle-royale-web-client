import { useLoginContext } from "../contexts/LoginContext";
import useAuthHandlers from "../hooks/useAuthHandlers";
import useSafeNavigation from "../hooks/useSafeNavigation";

const Header = () => {
  const { isLogin } = useLoginContext();
  const { handleLogout } = useAuthHandlers();
  const { navigateSafely } = useSafeNavigation();

  return (
    <header className="fixed top-0 left-0 w-full h-16 bg-white bg-opacity-75 shadow-md z-50 flex font-yonepick items-center px-4">
      <div className="flex items-center">
        <a href="/" onClick={(e) => navigateSafely(e, "/")} className="flex items-center">
          <img src="/assets/headercon.png" alt="Eternal Snowman" className="h-20" />
        </a>
      </div>
      <nav className="flex items-center ml-auto space-x-4">
        {import.meta.env.VITE_SHOW_DEV_PAGE === "true" && (
          <a
            href="/test"
            onClick={(e) => navigateSafely(e, "/test")}
            className="text-sm font-medium text-gray-700 hover:text-blue-600"
          >
            test
          </a>
        )}
        <a
          href="/posts"
          onClick={(e) => navigateSafely(e, "/posts")}
          className="text-sm font-medium text-gray-700 hover:text-blue-600"
        >
          게시판
        </a>

        {/* {isLogin && (
          <a
            href="/store"
            onClick={(e) => navigateSafely(e, "/store")}
            className="text-sm font-medium text-gray-700 hover:text-blue-600"
          >
            상점
          </a>
        )} */}
        <a
          href="/ranking"
          onClick={(e) => navigateSafely(e, "/ranking")}
          className="text-sm font-medium text-gray-700 hover:text-blue-600"
        >
          랭킹
        </a>
        <div className="flex space-x-4">
          {isLogin ? (
            <>
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-gray-700 hover:text-blue-600"
              >
                로그아웃
              </button>
              <a
                href="/mypage"
                onClick={(e) => navigateSafely(e, "/mypage")}
                className="text-sm font-medium text-gray-700 hover:text-blue-600"
              >
                마이페이지
              </a>
            </>
          ) : (
            <a
              href="/login"
              onClick={(e) => navigateSafely(e, "/login")}
              className="text-sm font-medium text-gray-700 hover:text-blue-600"
            >
              로그인
            </a>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
