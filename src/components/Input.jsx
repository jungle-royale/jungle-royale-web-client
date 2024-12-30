import PropTypes from 'prop-types';

const Input = ({
  label = '',
  type,
  //name,
  value,
  onChange,
  placeholder = '',
}) => {
  return (
    <div style={{ marginBottom: '10px' }}>
      {label && <label style={{ display: 'block', marginBottom: '5px' }}>{label}</label>}
      {type === 'textarea' ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          style={{
            width: '100%',
            height: '100px', // 높이 설정
            padding: '10px',
            border: '1px solid #ccc',
            borderRadius: '4px',
          }}
        />
      ) : (
        <input
          type={type}
          //name={name}
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
      )}
    </div>
  );
};

Input.propTypes = {
  label: PropTypes.string,
  type: PropTypes.string.isRequired,
  //name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
};

export default Input;
