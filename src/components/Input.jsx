import PropTypes from 'prop-types';

const Input = ({
  label = '',
  type,
  value,
  onChange,
  placeholder = '',
}) => {
  return (
    <div style={{ marginBottom: '10px' }}>
      {label && <label style={{ display: 'block', marginBottom: '5px' }}>{label}</label>}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{
          width: '100%',
          padding: '10px',
          border: '1px solid #ccc',
          borderRadius: '4px',
        }}
      />
    </div>
  );
};

Input.propTypes = {
  label: PropTypes.string, // 레이블 텍스트
  type: PropTypes.string.isRequired, // 입력 필드 타입 (e.g., 'text', 'password', 'email')
  value: PropTypes.string.isRequired, // 입력 값
  onChange: PropTypes.func.isRequired, // 값 변경 핸들러
  placeholder: PropTypes.string, // 입력 필드 placeholder (선택 사항)
};

export default Input;
