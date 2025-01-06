import { QRCodeCanvas } from 'qrcode.react';
import PropTypes from 'prop-types';

const QRcode = ({ qrdata }) => {

  return (
    <>
      <QRCodeCanvas value={qrdata} size={300} />
    </>
  );
};

QRcode.propTypes = {
  qrdata: PropTypes.string.isRequired,
};

export default QRcode;
