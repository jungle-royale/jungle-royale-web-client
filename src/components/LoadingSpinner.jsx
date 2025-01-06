import "./LoadingSpinner.css"; // 로딩 스피너 스타일

const LoadingSpinner = () => {
  return (
    <div className="loading-spinner">
      <div className="spinner"></div>
      <p>로딩 중...</p>
    </div>
  );
};

export default LoadingSpinner;
