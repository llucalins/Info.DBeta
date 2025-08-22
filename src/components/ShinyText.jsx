import React from 'react';

const ShinyText = ({ 
  text, 
  disabled = false, 
  speed = 3, 
  className = "" 
}) => {
  const shinyStyle = {
    position: 'relative',
    display: 'inline-block',
    background: 'linear-gradient(90deg, #333 0%, #666 50%, #333 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    animation: disabled ? 'none' : `shiny ${speed}s ease-in-out infinite`,
  };

  return (
    <>
      <style jsx>{`
        @keyframes shiny {
          0% {
            background-position: -200% center;
          }
          100% {
            background-position: 200% center;
          }
        }
      `}</style>
      <span style={shinyStyle} className={className}>
        {text}
      </span>
    </>
  );
};

export default ShinyText;
