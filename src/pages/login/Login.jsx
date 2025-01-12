import { useClickLock } from "../../contexts/ClickLockContext";
import useAuthHandlers from "../../hooks/useAuthHandlers";

const Login = () => {
  const { isLocked, lock } = useClickLock();
  const { handleLoginKakao, handleLoginGuest } = useAuthHandlers();

  return (
    <div
      className="bg-cover bg-center bg-fixed min-h-screen"
      style={{
        backgroundImage: `url(/assets/background.png)`,

      }}
    >
      <div className="flex items-center justify-center min-h-screen bg-black bg-opacity-50 px-4">
        {/* 외부 이미지로 감싼 상자 */}
        <div className="relative w-full max-w-lg mx-auto">
          <img
            src="/assets/login_page.png"
            alt="Login Box Frame"
            className="w-full object-contain"
          />
          {/* 내부 네모 상자 */}
          <div className="absolute inset-x-[10%] top-[35%] bottom-[15%] flex items-center justify-center">
            <div className="bg-white bg-opacity-0 p-6 text-center space-y-8 w-full h-full">
              {/* 카카오 로그인 버튼 */}
              <img
                src="/assets/kakaologinwide.png"
                className="cursor-pointer w-[80%] mx-auto"
                alt="카카오 로그인 버튼"
                onClick={() => {
                  if (!isLocked) {
                    lock();
                    handleLoginKakao();
                  }
                }}
              />
              {/* 비회원 로그인 텍스트 */}
              <div className="text-gray-600 text-base">
                <span className="hidden sm:inline">회원이 아니신가요? </span>
                <span
                  className="text-blue-500 cursor-pointer hover:underline"
                  onClick={() => {
                    if (!isLocked) {
                      lock();
                      handleLoginGuest();
                    }
                  }}
                >
                  비회원 로그인
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
