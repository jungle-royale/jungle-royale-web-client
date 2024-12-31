import { useRef, useState } from "react";
import PropTypes from "prop-types";
import "./AudioPlayer.css";

const AudioPlayer = ({ src, loop = true }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

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
      <button
        className={`audio-control-button ${isPlaying ? "playing" : "paused"}`}
        onClick={handlePlayPause}
      >
        {isPlaying ? "Pause" : "Play"}
      </button>
    </div>
  );
};

AudioPlayer.propTypes = {
  src: PropTypes.string.isRequired,
  loop: PropTypes.bool,
};

export default AudioPlayer;
