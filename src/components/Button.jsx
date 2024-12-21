import PropTypes from 'prop-types';

const Button = ({ text, type = 'primary', onClick = () => {} }) => {
  return (
    <button
      onClick={onClick}
      className={`Button Button_${type}`}
    >
      {text}
    </button>
  );
};

Button.propTypes = {
  text: PropTypes.string.isRequired, // text는 필수 문자열
  type: PropTypes.string, // type은 문자열 - 버튼 스타일
  onClick: PropTypes.func, // onClick은 함수
};

export default Button;
