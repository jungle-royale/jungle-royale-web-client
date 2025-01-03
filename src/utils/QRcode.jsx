import { QRCodeCanvas } from 'qrcode.react';
// import { useNavigate } from 'react-router-dom';

const QRcode = () => {
  // const navigate = useNavigate();
  const qrdata = 'https://www.naver.com/';

  return (
    <>
      <QRCodeCanvas value={qrdata} />
    </>
  )

}
export default QRcode;