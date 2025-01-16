import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import LoadingSpinner from "./LoadingSpinner"; // 스피너 컴포넌트 import


const PreloadImages = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const images = [
      '/assets/background.webp',
      '/assets/background_with_overlay.png',
      '/assets/continue_button.png',
      '/assets/game_button.png',
      '/assets/headercon.png',
      '/assets/home_logo.png',
      '/assets/kakaologinwide.png',
      '/assets/loading_button.png',
      '/assets/login_button.png',
      '/assets/login_page.png',
      '/assets/matching_button.png',
      '/assets/new_game_button.png',
      '/assets/pluscircle.png',
      '/assets/room_create_page.png',
      '/assets/roomcard.png',
      '/assets/snowy_background.png',
      '/assets/bronze.png',
      '/assets/dia.png',
      '/assets/gold.png',
      '/assets/ruby.png',
      '/assets/silver.png',
    ];
    let loadedCount = 0;

    images.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        loadedCount += 1;
        if (loadedCount === images.length) {
          setIsLoaded(true);
        }
      };
    });
  }, []);

  if (!isLoaded) {
    return(
      <div className="flex items-center justify-center min-h-[100dvh] bg-black bg-opacity-50">
        <LoadingSpinner />
      </div>
    )
  }
  return <>{children}</>;
};

// PropTypes를 이용한 prop validation 추가
PreloadImages.propTypes = {
  children: PropTypes.node.isRequired,
};

export default PreloadImages;
