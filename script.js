// ===== Particle Background =====
function initParticles() {
    const canvas = document.getElementById('particles');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener('resize', resize);

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.3;
            this.speedY = (Math.random() - 0.5) * 0.3;
            this.opacity = Math.random() * 0.5 + 0.1;
            this.color = Math.random() > 0.7 ? '#8b5cf6' : '#00ff88';
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.globalAlpha = this.opacity;
            ctx.fill();
            ctx.globalAlpha = 1;
        }
    }

    const count = Math.min(80, Math.floor(window.innerWidth / 15));
    for (let i = 0; i < count; i++) {
        particles.push(new Particle());
    }

    function connectParticles() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 150) {
                    ctx.beginPath();
                    ctx.strokeStyle = '#00ff88';
                    ctx.globalAlpha = 0.03 * (1 - dist / 150);
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                    ctx.globalAlpha = 1;
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        connectParticles();
        animationId = requestAnimationFrame(animate);
    }

    animate();
}

// ===== Navbar Scroll Effect =====
function initNavbar() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// ===== Dropdown Menu =====
function initDropdown() {
    const toggle = document.getElementById('menuToggle');
    const menu = document.getElementById('dropdownMenu');
    if (!toggle || !menu) return;

    toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        menu.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
        if (!menu.contains(e.target) && !toggle.contains(e.target)) {
            menu.classList.remove('active');
        }
    });

    menu.querySelectorAll('.dropdown-item').forEach(item => {
        item.addEventListener('click', () => {
            menu.classList.remove('active');
        });
    });
}

// ===== Pie Chart (Canvas) =====
function initPieChart() {
    const canvas = document.getElementById('tokenChart');
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
        { label: 'Liquidity Pool', value: 40, color: '#00ff88' },
        { label: 'Community Rewards', value: 25, color: '#8b5cf6' },
        { label: 'Marketing', value: 20, color: '#3b82f6' },
        { label: 'Team & Dev', value: 10, color: '#f59e0b' },
        { label: 'ZILA Airdrop', value: 5, color: '#ef4444' },
    ];

    const cx = size / 2;
    const cy = size / 2;
    const outerR = 130;
    const innerR = 85;
    let currentAngle = -Math.PI / 2;
    let animProgress = 0;
    let animated = false;

    function drawChart(progress) {
        ctx.clearRect(0, 0, size, size);
        let angle = -Math.PI / 2;
        const totalAngle = Math.PI * 2 * progress;

        data.forEach((seg) => {
            const sliceAngle = (seg.value / 100) * Math.PI * 2;
            const drawAngle = Math.min(sliceAngle, Math.max(0, totalAngle - (angle + Math.PI / 2)));

            if (drawAngle > 0) {
                ctx.beginPath();
                ctx.arc(cx, cy, outerR, angle, angle + drawAngle);
                ctx.arc(cx, cy, innerR, angle + drawAngle, angle, true);
                ctx.closePath();

                const gradient = ctx.createRadialGradient(cx, cy, innerR, cx, cy, outerR);
                gradient.addColorStop(0, seg.color + '88');
                gradient.addColorStop(1, seg.color);
                ctx.fillStyle = gradient;
                ctx.fill();

                // Glow
                ctx.shadowColor = seg.color;
                ctx.shadowBlur = 10;
                ctx.fill();
                ctx.shadowBlur = 0;
            }

            // Gap line
            ctx.beginPath();
            ctx.moveTo(cx + innerR * Math.cos(angle), cy + innerR * Math.sin(angle));
            ctx.lineTo(cx + outerR * Math.cos(angle), cy + outerR * Math.sin(angle));
            ctx.strokeStyle = '#0a0a0a';
            ctx.lineWidth = 2;
            ctx.stroke();

            angle += sliceAngle;
        });
    }

    function animateChart() {
        if (animProgress < 1) {
            animProgress += 0.02;
            drawChart(Math.min(animProgress, 1));
            requestAnimationFrame(animateChart);
        }
    }

    // Observe when chart is in view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !animated) {
                animated = true;
                animateChart();
                animateTokenBars();
            }
        });
    }, { threshold: 0.3 });

    observer.observe(canvas);
}

// ===== Token Bars Animation =====
function animateTokenBars() {
    document.querySelectorAll('.token-fill').forEach(bar => {
        const width = bar.getAttribute('data-width');
        setTimeout(() => {
            bar.style.width = width + '%';
        }, 300);
    });
}

// ===== Counter Animation =====
function initCounters() {
    const counters = document.querySelectorAll('[data-count]');
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        let current = 0;
        const increment = target / 60;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                counter.textContent = target;
                clearInterval(timer);
            } else {
                counter.textContent = Math.floor(current);
            }
        }, 30);
    });
}

// ===== Scroll Animations (AOS) =====
function initScrollAnimations() {
    const elements = document.querySelectorAll('[data-aos]');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 100);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    elements.forEach(el => observer.observe(el));
}

// ===== Smooth Scroll for Anchor Links =====
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// ===== Initialize Everything =====
document.addEventListener('DOMContentLoaded', function () {
    initParticles();
    initNavbar();
    initDropdown();
    initPieChart();
    initCounters();
    initScrollAnimations();
    initSmoothScroll();
});
