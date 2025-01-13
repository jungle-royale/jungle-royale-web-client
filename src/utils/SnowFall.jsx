import { useEffect, useState } from "react";
import "./SnowFall.css";

const Snowfall = () => {
  const [flakes, setFlakes] = useState([]);

  useEffect(() => {
    const createSnowflake = () => {
      const types = ["snow", "star"]; // 눈송이의 종류
      const snowflakeType = types[Math.floor(Math.random() * types.length)]; // 랜덤 선택
      const snowflake = {
        id: Math.random(),
        type: snowflakeType,
        left: Math.random() * 100 + "vw",
        animationDuration: Math.random() * 3 + 2 + "s",
        size: Math.random() * 10 + 5 + "px",
      };
      setFlakes((prevFlakes) => [...prevFlakes, snowflake]);

      setTimeout(() => {
        setFlakes((prevFlakes) =>
          prevFlakes.filter((flake) => flake.id !== snowflake.id)
        );
      }, parseFloat(snowflake.animationDuration) * 1000);
    };

    const interval = setInterval(createSnowflake, 300);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="snow-container">
      {flakes.map((flake) => (
        <div
          key={flake.id}
          className={`snowflake ${flake.type}`}
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
