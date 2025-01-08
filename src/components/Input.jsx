import PropTypes from 'prop-types';

const Input = ({
  label = '',
  type,
  value,
  onChange,
  placeholder = '',
  name = '',
  className = '', // className prop 추가
}) => {
  return (
    <div style={{ marginBottom: '10px' }}>
      {label && <label>{label}</label>}
      {type === 'textarea' ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={className} // className 전달
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          name={name} // name은 HTML name 속성으로 사용
          className={className} // className 전달
        />
      )}
    </div>
  );
};

Input.propTypes = {
  label: PropTypes.string,
  type: PropTypes.string.isRequired,
  name: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  className: PropTypes.string, // className prop 추가
};

export default Input;
