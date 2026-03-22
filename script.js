/* ===== PARTICLE BACKGROUND ===== */
(function initParticles() {
  const canvas = document.getElementById('particles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  let animId;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createParticles() {
    particles = [];
    const count = Math.min(Math.floor((canvas.width * canvas.height) / 12000), 120);
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.5 + 0.2,
        color: Math.random() > 0.5 ? '0, 255, 136' : '123, 47, 255',
      });
    }
  }

  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color}, ${p.alpha})`;
      ctx.fill();
    }

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0, 255, 136, ${0.08 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    animId = requestAnimationFrame(drawParticles);
  }

  resize();
  createParticles();
  drawParticles();

  window.addEventListener('resize', () => {
    resize();
    createParticles();
  });
})();

/* ===== DROPDOWN MENU ===== */
(function initMenu() {
  const btn = document.getElementById('menuBtn');
  const menu = document.getElementById('dropdownMenu');
  if (!btn || !menu) return;

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    menu.classList.toggle('active');
  });

  document.addEventListener('click', (e) => {
    if (!menu.contains(e.target) && e.target !== btn) {
      menu.classList.remove('active');
    }
  });

  // Close on link click
  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      menu.classList.remove('active');
    });
  });
})();

/* ===== PIE CHART ===== */
(function initPieChart() {
  const canvas = document.getElementById('pieChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const size = 300;
  canvas.width = size * dpr;
  canvas.height = size * dpr;
  canvas.style.width = size + 'px';
  canvas.style.height = size + 'px';
  ctx.scale(dpr, dpr);

  const data = [
    { label: 'Liquidity', pct: 40, color: '#00ff88' },
    { label: 'Community', pct: 30, color: '#7b2fff' },
    { label: 'Marketing', pct: 15, color: '#00b4ff' },
    { label: 'ZILA Holders', pct: 5, color: '#ff6b6b' },
    { label: 'Team & Dev', pct: 10, color: '#ffd93d' },
  ];

  const cx = size / 2;
  const cy = size / 2;
  const radius = size / 2 - 20;
  const innerRadius = radius * 0.55;

  let currentAngle = -Math.PI / 2;
  for (const seg of data) {
    const sliceAngle = (seg.pct / 100) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, radius, currentAngle, currentAngle + sliceAngle);
    ctx.closePath();
    ctx.fillStyle = seg.color;
    ctx.fill();

    // Glow
    ctx.shadowColor = seg.color;
    ctx.shadowBlur = 15;
    ctx.fill();
    ctx.shadowBlur = 0;

    currentAngle += sliceAngle;
  }

  // Inner circle (donut)
  ctx.beginPath();
  ctx.arc(cx, cy, innerRadius, 0, Math.PI * 2);
  ctx.fillStyle = '#0a0a0a';
  ctx.fill();

  // Center text
  ctx.fillStyle = '#00ff88';
  ctx.font = '700 16px Orbitron, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('100B', cx, cy - 8);
  ctx.fillStyle = '#a0a0b0';
  ctx.font = '400 11px Inter, sans-serif';
  ctx.fillText('CROC', cx, cy + 12);
})();

/* ===== ANIMATED COUNTER ===== */
(function initCounter() {
  const el = document.getElementById('totalSupply');
  if (!el) return;
  const target = 100000000000;
  let started = false;

  function animateCount() {
    if (started) return;
    started = true;
    const duration = 2000;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);
      el.textContent = current.toLocaleString('en-US');
      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  const observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) {
        animateCount();
        observer.disconnect();
      }
    },
    { threshold: 0.3 }
  );

  observer.observe(el);
})();

/* ===== SCROLL REVEAL ===== */
(function initReveal() {
  const sections = document.querySelectorAll('.section');
  sections.forEach((s) => s.classList.add('reveal'));

  // Immediately reveal sections that are already in viewport
  function checkVisible() {
    document.querySelectorAll('.reveal').forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight + 100) {
        el.classList.add('visible');
      }
    });
  }

  // Run immediately
  checkVisible();

  // Also use IntersectionObserver for scroll
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.05, rootMargin: '0px 0px 100px 0px' }
  );

  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));

  // Fallback: make all visible after 1.5s to ensure nothing stays hidden
  setTimeout(() => {
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('visible'));
  }, 1500);
})();

/* ===== AIRDROP FORM ===== */
(function initForm() {
  const form = document.getElementById('airdropForm');
  const msg = document.getElementById('formMessage');
  if (!form || !msg) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const tweetLink = document.getElementById('tweetLink').value.trim();
    const evmAddress = document.getElementById('evmAddress').value.trim();

    if (!tweetLink || !evmAddress) {
      msg.textContent = 'Please fill in all fields.';
      msg.className = 'form-message error';
      return;
    }

    if (!evmAddress.startsWith('0x') || evmAddress.length !== 42) {
      msg.textContent = 'Please enter a valid EVM address (0x...).';
      msg.className = 'form-message error';
      return;
    }

    // Simulate submission
    msg.textContent = '✅ Submission received! You are now in the airdrop queue.';
    msg.className = 'form-message success';
    form.reset();

    setTimeout(() => {
      msg.textContent = '';
      msg.className = 'form-message';
    }, 5000);
  });
})();

/* ===== SMOOTH SCROLL FOR NAV ===== */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
})();
