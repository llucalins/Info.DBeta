import React from 'react';

const GradientText = ({ 
  children, 
  colors = ["#40ffaa", "#4079ff", "#40ffaa", "#4079ff", "#40ffaa"],
  animationSpeed = 3,
  showBorder = false,
  className = ""
}) => {
  const gradientStyle = {
    background: `linear-gradient(45deg, ${colors.join(', ')})`,
    backgroundSize: `${colors.length * 100}% 100%`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    animation: `gradientShift ${animationSpeed}s ease-in-out infinite`,
    border: showBorder ? '2px solid transparent' : 'none',
    borderImage: showBorder ? `linear-gradient(45deg, ${colors.join(', ')}) 1` : 'none',
    padding: showBorder ? '0.5rem 1rem' : '0',
    borderRadius: showBorder ? '0.5rem' : '0',
  };

  return (
    <>
      <style jsx>{`
        @keyframes gradientShift {
          0%, 100% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
        }
      `}</style>
      <span style={gradientStyle} className={className}>
        {children}
      </span>
    </>
  );
};

export default GradientText;
