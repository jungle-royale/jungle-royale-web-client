import { QRCodeCanvas } from 'qrcode.react';
import PropTypes from 'prop-types';

const QRcode = ({ qrdata }) => {

  const canvas = document.querySelector("canvas");
  canvas.style.width = "300px";
  canvas.style.height = "300px";
  canvas.style.margin = "0 auto";

  return (
    <>
      <QRCodeCanvas value={qrdata} />
    </>
  );
};

QRcode.propTypes = {
  qrdata: PropTypes.string.isRequired,
};

export default QRcode;
