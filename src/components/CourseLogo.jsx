import React from 'react';

const CourseLogo = ({ size = 'medium', className = '' }) => {
  const sizeClasses = {
    small: 'w-20 h-20',
    medium: 'w-32 h-32',
    large: 'w-48 h-48'
  };

  const textSizes = {
    small: 'text-xs',
    medium: 'text-sm',
    large: 'text-base'
  };

  return (
    <div className={`${sizeClasses[size]} ${className} relative`}>
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
        {/* Anel externo laranja */}
        <circle cx="50" cy="50" r="50" fill="#FF8C00" />
        
        {/* Anel interno laranja mais claro */}
        <circle cx="50" cy="50" r="42" fill="#FFA500" />
        
        {/* Linha tracejada branca */}
        <circle cx="50" cy="50" r="38" fill="none" stroke="white" strokeWidth="1" strokeDasharray="2,2" />
        
        {/* Círculo central branco */}
        <circle cx="50" cy="50" r="34" fill="white" />
        
        {/* Lâmpada central */}
        <g transform="translate(50, 50)">
          {/* Base da lâmpada */}
          <ellipse cx="0" cy="0" rx="4" ry="5" fill="#FF8C00" />
          
          {/* Engrenagem dentro da lâmpada */}
          <circle cx="0" cy="0" r="2" fill="#FF8C00" />
          <circle cx="0" cy="0" r="1.5" fill="white" />
          
          {/* Base da lâmpada */}
          <ellipse cx="0" cy="6" rx="3" ry="1" fill="#FF8C00" />
        </g>
        
        {/* Figuras humanas no topo */}
        <g transform="translate(50, 15)">
          <circle cx="-2" cy="0" r="0.8" fill="#FF8C00" />
          <circle cx="0" cy="0" r="0.8" fill="#FF8C00" />
          <circle cx="2" cy="0" r="0.8" fill="#FF8C00" />
        </g>
        
        {/* Engrenagem esquerda */}
        <g transform="translate(15, 50)">
          <circle cx="0" cy="0" r="2" fill="#FF8C00" />
          <circle cx="0" cy="0" r="1.5" fill="white" />
          <line x1="-1.5" y1="0" x2="1.5" y2="0" stroke="#FF8C00" strokeWidth="0.5" />
          <line x1="0" y1="-1.5" x2="0" y2="1.5" stroke="#FF8C00" strokeWidth="0.5" />
        </g>
        
        {/* Engrenagem direita */}
        <g transform="translate(85, 50)">
          <circle cx="0" cy="0" r="2" fill="#FF8C00" />
          <circle cx="0" cy="0" r="1.5" fill="white" />
          <line x1="-1.5" y1="0" x2="1.5" y2="0" stroke="#FF8C00" strokeWidth="0.5" />
          <line x1="0" y1="-1.5" x2="0" y2="1.5" stroke="#FF8C00" strokeWidth="0.5" />
        </g>
        
        {/* Engrenagem parcial baixo-direita */}
        <g transform="translate(75, 75)">
          <circle cx="0" cy="0" r="1.5" fill="#FF8C00" />
          <circle cx="0" cy="0" r="1" fill="white" />
        </g>
        
        {/* Texto superior */}
        <text x="50" y="12" textAnchor="middle" fill="white" fontSize="4" fontWeight="bold" className="uppercase">
          INFORMÁTICA • DESCOMPLICADA
        </text>
        
        {/* Texto inferior */}
        <text x="50" y="88" textAnchor="middle" fill="white" fontSize="4" fontWeight="bold" className="uppercase">
          ESTUDANTES • NO UNIVERSO DIGITAL
        </text>
      </svg>
    </div>
  );
};

export default CourseLogo;
