// Dynamic Background Canvas Particle Engine
// Supports 'girl' (Dreamy Bloom petals & sparkles) and 'boy' (Neon Grid matrix & cyber pulses)

export class ParticleEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.theme = 'girl';
    this.animationFrame = null;
    this.width = 0;
    this.height = 0;
    this.gridOffset = 0;

    this.resize = this.resize.bind(this);
    this.animate = this.animate.bind(this);

    window.addEventListener('resize', this.resize);
    this.resize();
    this.initParticles();
    this.animate();
  }

  setTheme(theme) {
    this.theme = theme;
    this.initParticles();
  }

  resize() {
    if (!this.canvas) return;
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
  }

  initParticles() {
    this.particles = [];
    const count = this.theme === 'girl' ? 45 : 55;

    for (let i = 0; i < count; i++) {
      if (this.theme === 'girl') {
        this.particles.push({
          type: Math.random() > 0.4 ? 'petal' : (Math.random() > 0.5 ? 'sparkle' : 'heart'),
          x: Math.random() * this.width,
          y: Math.random() * this.height,
          size: Math.random() * 8 + 4,
          speedY: -(Math.random() * 0.8 + 0.3),
          speedX: (Math.random() - 0.5) * 0.5,
          angle: Math.random() * Math.PI * 2,
          angularSpeed: (Math.random() - 0.5) * 0.03,
          opacity: Math.random() * 0.5 + 0.3,
          hue: Math.random() * 30 + 320 // soft pinks to lilac
        });
      } else {
        this.particles.push({
          type: Math.random() > 0.3 ? 'cyberNode' : 'spark',
          x: Math.random() * this.width,
          y: Math.random() * this.height,
          size: Math.random() * 3 + 1.5,
          speedY: (Math.random() - 0.5) * 0.8,
          speedX: (Math.random() - 0.5) * 0.8,
          pulse: Math.random() * Math.PI,
          pulseSpeed: 0.03 + Math.random() * 0.04,
          color: Math.random() > 0.5 ? '#00f0ff' : '#9d00ff'
        });
      }
    }
  }

  animate() {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.width, this.height);

    if (this.theme === 'girl') {
      this.drawGirlTheme();
    } else {
      this.drawBoyTheme();
    }

    this.animationFrame = requestAnimationFrame(this.animate);
  }

  drawGirlTheme() {
    // Ambient soft radial gradient
    const gradient = this.ctx.createRadialGradient(
      this.width * 0.5, this.height * 0.3, 50,
      this.width * 0.5, this.height * 0.5, this.width * 0.8
    );
    gradient.addColorStop(0, 'rgba(255, 235, 245, 0.4)');
    gradient.addColorStop(0.6, 'rgba(235, 215, 255, 0.15)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.width, this.height);

    for (let p of this.particles) {
      p.y += p.speedY;
      p.x += Math.sin(p.angle) * 0.6;
      p.angle += p.angularSpeed;

      if (p.y < -20) {
        p.y = this.height + 20;
        p.x = Math.random() * this.width;
      }
      if (p.x < -20) p.x = this.width + 20;
      if (p.x > this.width + 20) p.x = -20;

      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate(p.angle);
      this.ctx.globalAlpha = p.opacity;

      if (p.type === 'petal') {
        this.ctx.fillStyle = `hsl(${p.hue}, 85%, 82%)`;
        this.ctx.beginPath();
        this.ctx.ellipse(0, 0, p.size, p.size * 0.55, 0, 0, Math.PI * 2);
        this.ctx.fill();
      } else if (p.type === 'sparkle') {
        this.ctx.fillStyle = '#fff9db';
        this.ctx.shadowColor = 'rgba(255, 215, 0, 0.6)';
        this.ctx.shadowBlur = 6;
        this.ctx.beginPath();
        this.ctx.moveTo(0, -p.size);
        this.ctx.quadraticCurveTo(0, 0, p.size, 0);
        this.ctx.quadraticCurveTo(0, 0, 0, p.size);
        this.ctx.quadraticCurveTo(0, 0, -p.size, 0);
        this.ctx.quadraticCurveTo(0, 0, 0, -p.size);
        this.ctx.fill();
      } else if (p.type === 'heart') {
        this.ctx.fillStyle = `hsl(${p.hue}, 90%, 80%)`;
        const s = p.size * 0.5;
        this.ctx.beginPath();
        this.ctx.moveTo(0, s * 0.3);
        this.ctx.bezierCurveTo(-s, -s, -s * 1.5, s * 0.5, 0, s * 1.5);
        this.ctx.bezierCurveTo(s * 1.5, s * 0.5, s, -s, 0, s * 0.3);
        this.ctx.fill();
      }
      this.ctx.restore();
    }
  }

  drawBoyTheme() {
    this.gridOffset = (this.gridOffset + 0.4) % 40;

    // Cyberpunk grid
    this.ctx.strokeStyle = 'rgba(0, 240, 255, 0.05)';
    this.ctx.lineWidth = 1;

    const gridSize = 40;
    for (let x = 0; x <= this.width; x += gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.height);
      this.ctx.stroke();
    }

    for (let y = this.gridOffset; y <= this.height; y += gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.width, y);
      this.ctx.stroke();
    }

    // Connect close cyber nodes
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          this.ctx.strokeStyle = `rgba(0, 240, 255, ${0.12 * (1 - dist / 100)})`;
          this.ctx.lineWidth = 0.8;
          this.ctx.beginPath();
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
          this.ctx.stroke();
        }
      }
    }

    // Nodes
    for (let p of this.particles) {
      p.x += p.speedX;
      p.y += p.speedY;
      p.pulse += p.pulseSpeed;

      if (p.x < 0) p.x = this.width;
      if (p.x > this.width) p.x = 0;
      if (p.y < 0) p.y = this.height;
      if (p.y > this.height) p.y = 0;

      const currentSize = p.size + Math.sin(p.pulse) * 1.2;
      this.ctx.save();
      this.ctx.fillStyle = p.color;
      this.ctx.shadowColor = p.color;
      this.ctx.shadowBlur = 8;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, Math.max(0.5, currentSize), 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    }
  }

  destroy() {
    if (this.animationFrame) cancelAnimationFrame(this.animationFrame);
    window.removeEventListener('resize', this.resize);
  }
}
