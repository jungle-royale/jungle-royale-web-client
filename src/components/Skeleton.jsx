import PropTypes from "prop-types";
import "./Skeleton.css";

const Skeleton = ({ type, width, height, circle }) => {
  const styles = {
    width: width || "100%",
    height: height || "20px",
    borderRadius: circle ? "50%" : "4px",
  };

  return <div className={`skeleton ${type}`} style={styles}></div>;
};

Skeleton.propTypes = {
  type: PropTypes.string, // 추가적인 클래스를 위한 타입
  width: PropTypes.string, // 커스텀 너비
  height: PropTypes.string, // 커스텀 높이
  circle: PropTypes.bool, // 원형 여부
};

export default Skeleton;
