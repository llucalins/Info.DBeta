import React, { useRef, useEffect, useState } from 'react';

const GlareHover = ({
  children,
  glareColor = "#ffffff",
  glareOpacity = 0.3,
  glareAngle = -30,
  glareSize = 300,
  transitionDuration = 800,
  playOnce = false,
  className = ""
}) => {
  const containerRef = useRef(null);
  const [glareStyle, setGlareStyle] = useState({});
  const [hasPlayed, setHasPlayed] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e) => {
      if (playOnce && hasPlayed) return;

      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const deltaX = x - centerX;
      const deltaY = y - centerY;
      
      const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      
      const glareX = (x / rect.width) * 100;
      const glareY = (y / rect.height) * 100;
      
      setGlareStyle({
        background: `linear-gradient(${angle + glareAngle}deg, transparent 0%, ${glareColor} 50%, transparent 100%)`,
        opacity: glareOpacity,
        left: `${glareX}%`,
        top: `${glareY}%`,
        transform: `translate(-50%, -50%)`,
        width: `${glareSize}px`,
        height: `${glareSize}px`,
        transition: `all ${transitionDuration}ms ease-out`,
      });

      if (playOnce) {
        setHasPlayed(true);
      }
    };

    const handleMouseLeave = () => {
      setGlareStyle({
        opacity: 0,
        transition: `opacity ${transitionDuration}ms ease-out`,
      });
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [glareColor, glareOpacity, glareAngle, glareSize, transitionDuration, playOnce, hasPlayed]);

  return (
    <div 
      ref={containerRef} 
      className={`relative overflow-hidden ${className}`}
      style={{ position: 'relative' }}
    >
      {children}
      <div
        className="absolute pointer-events-none rounded-full"
        style={{
          ...glareStyle,
          position: 'absolute',
          pointerEvents: 'none',
          borderRadius: '50%',
        }}
      />
    </div>
  );
};

export default GlareHover;
