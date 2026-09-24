// Custom Hook: useResponsive for adaptive layouts and breakpoint detection
import { useState, useEffect } from 'react';

export const useResponsive = () => {
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 1200
  );

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    isMobile: windowWidth <= 640,
    isTablet: windowWidth > 640 && windowWidth <= 900,
    isDesktop: windowWidth > 900,
    width: windowWidth
  };
};

export default useResponsive;
