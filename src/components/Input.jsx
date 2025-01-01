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
      {type === 'textarea' ? (
        <textarea
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
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
