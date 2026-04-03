/* ============================================
   SNAP.IT — Interactive Scripts
   ============================================ */

// ---------- Particle System ----------
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width, height;
  const particles = [];
  const PARTICLE_COUNT = 80;
  const CONNECTION_DIST = 150;

  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.radius = Math.random() * 1.5 + 0.5;
      this.opacity = Math.random() * 0.5 + 0.1;

      // Color variation
      const colors = [
        [139, 92, 246],   // purple
        [236, 72, 153],   // pink
        [34, 211, 238],   // cyan
      ];
      this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color[0]}, ${this.color[1]}, ${this.color[2]}, ${this.opacity})`;
      ctx.fill();
    }
  }

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new Particle());
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < CONNECTION_DIST) {
          const opacity = (1 - dist / CONNECTION_DIST) * 0.08;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(139, 92, 246, ${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach(p => {
      p.update();
      p.draw();
    });

    drawConnections();
    requestAnimationFrame(animate);
  }

  animate();
})();


// ---------- Terminal Typing Effect ----------
(function initTerminal() {
  const terminalText = document.getElementById('terminal-text');
  if (!terminalText) return;

  const messages = [
    'initializing neural debugger...',
    'connecting to AI engine...',
    'scanning repositories...',
    'compiling intelligence matrix...',
    'ready for deployment.',
    'snap.it v2.0 loaded.',
    'awaiting developer authentication...',
  ];

  let msgIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let pauseTimer = 0;

  function type() {
    const currentMsg = messages[msgIndex];

    if (!isDeleting) {
      terminalText.textContent = currentMsg.substring(0, charIndex + 1);
      charIndex++;

      if (charIndex === currentMsg.length) {
        pauseTimer = 60; // pause before deleting
        isDeleting = true;
      }
    } else {
      if (pauseTimer > 0) {
        pauseTimer--;
        requestAnimationFrame(type);
        return;
      }

      terminalText.textContent = currentMsg.substring(0, charIndex - 1);
      charIndex--;

      if (charIndex === 0) {
        isDeleting = false;
        msgIndex = (msgIndex + 1) % messages.length;
      }
    }

    const speed = isDeleting ? 30 : 60;
    setTimeout(() => requestAnimationFrame(type), speed);
  }

  // Start after card entrance animation
  setTimeout(type, 1200);
})();


// ---------- Login Button Ripple Effect ----------
(function initRipple() {
  const btn = document.getElementById('login-btn');
  if (!btn) return;

  btn.addEventListener('click', function(e) {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const ripple = document.createElement('span');
    ripple.style.cssText = `
      position: absolute;
      left: ${x}px;
      top: ${y}px;
      width: 0;
      height: 0;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.3);
      transform: translate(-50%, -50%);
      pointer-events: none;
      animation: rippleExpand 0.6s ease-out forwards;
    `;

    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });

  // Add ripple keyframe dynamically
  const style = document.createElement('style');
  style.textContent = `
    @keyframes rippleExpand {
      to {
        width: 300px;
        height: 300px;
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
})();


// ---------- Card Tilt Effect ----------
(function initTilt() {
  const card = document.getElementById('login-card');
  if (!card) return;

  const section = document.getElementById('login-section');

  section.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = (e.clientX - centerX) / rect.width;
    const deltaY = (e.clientY - centerY) / rect.height;

    const rotateX = deltaY * -5;
    const rotateY = deltaX * 5;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
  });

  section.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
    card.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
    setTimeout(() => { card.style.transition = ''; }, 600);
  });
})();


// ---------- Intersection Observer Fade-Ins ----------
(function initObserver() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.login-card, .tagline, .security-badge').forEach(el => {
    observer.observe(el);
  });
})();


// ---------- Logo Glitch Effect on hover ----------
(function initGlitch() {
  const logo = document.getElementById('logo-container');
  if (!logo) return;

  logo.addEventListener('mouseenter', () => {
    logo.style.animation = 'glitchShake 0.3s ease';
    setTimeout(() => { logo.style.animation = ''; }, 300);
  });

  const style = document.createElement('style');
  style.textContent = `
    @keyframes glitchShake {
      0%, 100% { transform: translate(0); }
      10% { transform: translate(-2px, 1px); }
      20% { transform: translate(2px, -1px); }
      30% { transform: translate(-1px, 2px); }
      40% { transform: translate(1px, -2px); }
      50% { transform: translate(-2px, 0); }
      60% { transform: translate(2px, 1px); }
      70% { transform: translate(-1px, -1px); }
      80% { transform: translate(1px, 2px); }
      90% { transform: translate(0, -2px); }
    }
  `;
  document.head.appendChild(style);
})();
