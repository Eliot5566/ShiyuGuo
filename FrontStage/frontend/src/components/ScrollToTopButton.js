import React, { useState, useEffect } from 'react';
import './ScrollToTopButton.css';
import gototop from '../images/gototop.png';
function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      className={`scroll-to-top-button ${isVisible ? 'visible' : 'hidden'}`}
      onClick={scrollToTop}
    >
      {' '}
      <img src={gototop} width={80} alt="gototop" />
      <br />
      TOP
    </button>
  );
}

export default ScrollToTopButton;
