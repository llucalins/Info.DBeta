import React, { useEffect, useRef } from 'react';

const AnimatedBackground = ({ children }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationId;

    // Configurar canvas
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Gradiente branco com detalhes amarelos
    const createProfessionalGradient = () => {
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#FFFFFF');    // Branco
      gradient.addColorStop(0.3, '#FEFEFE');  // Branco sutil
      gradient.addColorStop(0.7, '#FDFDFD');  // Branco muito claro
      gradient.addColorStop(1, '#FCFCFC');    // Branco com tom
      return gradient;
    };

    // Linhas sutis animadas
    const lines = [];
    const lineCount = 8;

    class Line {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.length = Math.random() * 200 + 100;
        this.angle = Math.random() * Math.PI * 2;
        this.speed = Math.random() * 0.5 + 0.1;
        this.opacity = Math.random() * 0.2 + 0.1;
      }

      update() {
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;

        if (this.x < -this.length) this.x = canvas.width + this.length;
        if (this.x > canvas.width + this.length) this.x = -this.length;
        if (this.y < -this.length) this.y = canvas.height + this.length;
        if (this.y > canvas.height + this.length) this.y = -this.length;
      }

      draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);
        
        const gradient = ctx.createLinearGradient(0, 0, this.length, 0);
        gradient.addColorStop(0, `rgba(255, 193, 7, 0)`);
        gradient.addColorStop(0.5, `rgba(255, 193, 7, ${this.opacity})`);
        gradient.addColorStop(1, `rgba(255, 193, 7, 0)`);
        
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(this.length, 0);
        ctx.stroke();
        ctx.restore();
      }
    }

    // Criar linhas
    for (let i = 0; i < lineCount; i++) {
      lines.push(new Line());
    }

    // Pontos de destaque
    const dots = [];
    const dotCount = 15;

    class Dot {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.opacity = Math.random() * 0.4 + 0.2;
        this.pulseSpeed = Math.random() * 0.02 + 0.01;
        this.pulseOffset = Math.random() * Math.PI * 2;
      }

      update(time) {
        this.opacity = 0.2 + 0.3 * Math.sin(time * this.pulseSpeed + this.pulseOffset);
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 193, 7, ${this.opacity})`;
        ctx.fill();
      }
    }

    // Criar pontos
    for (let i = 0; i < dotCount; i++) {
      dots.push(new Dot());
    }

    let time = 0;

    const animate = () => {
      // Limpar canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Desenhar gradiente de fundo
      ctx.fillStyle = createProfessionalGradient();
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Atualizar e desenhar linhas
      lines.forEach(line => {
        line.update();
        line.draw();
      });

      // Atualizar e desenhar pontos
      dots.forEach(dot => {
        dot.update(time);
        dot.draw();
      });

      time += 0.01;
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: -1 }}>
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: -1,
        }}
      />
    </div>
  );
};

export default AnimatedBackground;
