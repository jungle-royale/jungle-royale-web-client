import { useRef, useState } from "react";
import PropTypes from "prop-types";
import "./AudioPlayer.css";

const AudioPlayer = ({ src, loop = true }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false); // 기본값: 재생되지 않음

  const handlePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch((err) => console.error("Audio play error:", err));
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="audio-player">
      <audio ref={audioRef} src={src} loop={loop} />
      <button className="audio-control-button" onClick={handlePlayPause}>
        {isPlaying ? "Pause Music" : "Play Music"}
      </button>
    </div>
  );
};

AudioPlayer.propTypes = {
  src: PropTypes.string.isRequired, // 오디오 파일 경로
  loop: PropTypes.bool, // 반복 여부
};

export default AudioPlayer;
