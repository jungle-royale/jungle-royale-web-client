import { useClickLock } from '../../contexts/ClickLockContext';
import useAuthHandlers from '../../hooks/useAuthHandlers';

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
      <div className="flex items-center justify-center min-h-screen bg-black bg-opacity-50">
        <div className="bg-white p-8 rounded shadow-md text-center space-y-6">
          <h1 className="text-2xl font-bold text-gray-800">로그인 화면</h1>
          <img
            src="/assets/kakaologinwide.png"
            className="cursor-pointer w-full max-w-xs mx-auto"
            alt="카카오 로그인 버튼"
            onClick={() => {
              if (!isLocked) {
                lock();
                handleLoginKakao();
              }
            }}
          />
          <button
            onClick={() => {
              if (!isLocked) {
                lock();
                handleLoginGuest();
              }
            }}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            비회원 로그인
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
