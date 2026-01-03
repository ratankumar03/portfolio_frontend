import { useEffect, useRef, useState } from 'react';

const RainEffect = () => {
  const canvasRef = useRef(null);
  const [colorScheme, setColorScheme] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Attractive 3D color schemes that change every 5 seconds
    const colorSchemes = [
      // Purple to Blue (Original)
      ['rgba(139, 92, 246, ', 'rgba(168, 85, 247, ', 'rgba(14, 165, 233, '],
      // Pink to Orange
      ['rgba(236, 72, 153, ', 'rgba(251, 146, 60, ', 'rgba(252, 211, 77, '],
      // Green to Cyan
      ['rgba(34, 197, 94, ', 'rgba(6, 182, 212, ', 'rgba(59, 130, 246, '],
      // Red to Pink
      ['rgba(239, 68, 68, ', 'rgba(236, 72, 153, ', 'rgba(168, 85, 247, '],
      // Gold to Red
      ['rgba(250, 204, 21, ', 'rgba(251, 146, 60, ', 'rgba(239, 68, 68, '],
      // Teal to Purple
      ['rgba(20, 184, 166, ', 'rgba(99, 102, 241, ', 'rgba(168, 85, 247, '],
    ];

    // Change color scheme every 5 seconds
    const colorInterval = setInterval(() => {
      setColorScheme((prev) => (prev + 1) % colorSchemes.length);
    }, 5000);

    // Rain drops array
    const raindrops = [];
    const numberOfDrops = 150; // Number of raindrops

    // Create raindrop class with 120-degree angle
    class Raindrop {
      constructor() {
        this.x = Math.random() * (canvas.width + canvas.height);
        this.y = Math.random() * canvas.height - canvas.height;
        this.length = Math.random() * 20 + 10;
        this.speed = Math.random() * 3 + 2;
        this.opacity = Math.random() * 0.5 + 0.3;
        // 120 degrees = 2π/3 radians
        this.angle = (120 * Math.PI) / 180;
      }

      fall() {
        // Move in both x and y direction based on 120-degree angle
        this.y += this.speed * Math.sin(this.angle);
        this.x += this.speed * Math.cos(this.angle);

        // Reset raindrop when it goes off screen
        if (this.y > canvas.height || this.x < -this.length) {
          this.y = -this.length;
          this.x = Math.random() * (canvas.width + canvas.height);
        }
      }

      draw() {
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        // Draw line at 120-degree angle
        const endX = this.x + this.length * Math.cos(this.angle);
        const endY = this.y + this.length * Math.sin(this.angle);
        ctx.lineTo(endX, endY);

        // Get current color scheme
        const currentColors = colorSchemes[colorScheme];

        // Create 3D gradient for raindrop with changing colors
        const gradient = ctx.createLinearGradient(this.x, this.y, endX, endY);
        gradient.addColorStop(0, currentColors[0] + this.opacity + ')');
        gradient.addColorStop(0.5, currentColors[1] + this.opacity + ')');
        gradient.addColorStop(1, currentColors[2] + this.opacity + ')');

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2; // Slightly thicker for 3D effect
        ctx.lineCap = 'round';
        ctx.stroke();

        // Add glow effect for 3D appearance
        ctx.shadowBlur = 10;
        ctx.shadowColor = currentColors[1] + '0.8)';
      }
    }

    // Initialize raindrops
    for (let i = 0; i < numberOfDrops; i++) {
      raindrops.push(new Raindrop());
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      raindrops.forEach(drop => {
        drop.fall();
        drop.draw();
      });

      requestAnimationFrame(animate);
    };

    animate();

    // Handle window resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      clearInterval(colorInterval);
    };
  }, [colorScheme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none z-[5]"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};

export default RainEffect;
