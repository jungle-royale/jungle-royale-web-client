import { useEffect, useState } from "react";
import "./SnowFall.css"; // 위에서 작성한 CSS 추가

const Snowfall = () => {
  const [flakes, setFlakes] = useState([]);

  useEffect(() => {
    // 눈송이를 생성하는 함수
    const createSnowflake = () => {
      const snowflake = {
        id: Math.random(),
        left: Math.random() * 100 + "vw", // 랜덤한 가로 위치
        animationDuration: Math.random() * 3 + 2 + "s", // 애니메이션 지속시간
        size: Math.random() * 5 + 5 + "px", // 랜덤한 크기
      };
      setFlakes((prevFlakes) => [...prevFlakes, snowflake]);

      // 일정 시간이 지나면 눈송이를 제거
      setTimeout(() => {
        setFlakes((prevFlakes) =>
          prevFlakes.filter((flake) => flake.id !== snowflake.id)
        );
      }, parseFloat(snowflake.animationDuration) * 1000);
    };

    const interval = setInterval(createSnowflake, 300); // 눈송이 생성 간격

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="snow-container">
      {flakes.map((flake) => (
        <div
          key={flake.id}
          className="snowflake"
          style={{
            left: flake.left,
            animationDuration: flake.animationDuration,
            width: flake.size,
            height: flake.size,
          }}
        ></div>
      ))}
    </div>
  );
};

export default Snowfall;
