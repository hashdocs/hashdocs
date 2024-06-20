import { useEffect, useState } from 'react';

function useMobile() {
  const [isMobile, setIsMobile] = useState(false);
  const [isIos, setIsIos] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== 'undefined') {
        setIsMobile(window.innerWidth < 700);
      }
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const checkIos = () => {
      const userAgent = navigator.userAgent.toLowerCase();
      setIsIos(/iphone|ipad|ipod/.test(userAgent));
    };
    checkIos();
  }, []);

  return { isMobile, isIos };
}

export default useMobile;
