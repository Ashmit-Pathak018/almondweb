// ALMOND — V8 Neural Amber Interface

// === SMOOTH SCROLL ===
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href'))
            ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});

// === SCROLL PROGRESS + NAV ACTIVE ===
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.nav-links a');
const progressBar = document.getElementById('scroll-progress');

window.addEventListener('scroll', () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    if (progressBar) progressBar.style.width = `${(scrollTop / (scrollHeight - clientHeight)) * 100}%`;

    let current = '';
    sections.forEach(s => { if (scrollTop >= s.offsetTop - 300) current = s.getAttribute('id'); });
    navLinks.forEach(link => link.classList.toggle('active', link.getAttribute('href') === `#${current}`));
}, { passive: true });

// === HERO QUESTION SEQUENCE ===
// Questions fade in one by one, very slowly, then hero reveal appears
const heroLines = document.querySelectorAll('.hq');
const heroReveal = document.getElementById('hero-reveal');
const heroBtns = document.getElementById('hero-btns');

function runHeroSequence() {
    let delay = 300;
    heroLines.forEach((line, i) => {
        setTimeout(() => {
            line.classList.add('visible');
            // peak lit state — briefly highlight
            setTimeout(() => line.classList.add('lit'), 100);
            // dim after a moment, then next line takes focus
            setTimeout(() => {
                line.classList.remove('lit');
                line.classList.add('dim');
            }, 1800);
        }, delay);
        delay += 900;
    });

    // reveal hero text after all questions
    const revealAt = delay + 400;
    setTimeout(() => {
        heroReveal && heroReveal.classList.add('visible');
        setTimeout(() => heroBtns && heroBtns.classList.add('visible'), 600);
    }, revealAt);
}

// Only run full sequence if user is at top; otherwise just show everything
if (window.scrollY < 100) {
    runHeroSequence();
} else {
    heroLines.forEach(l => { l.classList.add('visible', 'dim'); });
    heroReveal?.classList.add('visible');
    heroBtns?.classList.add('visible');
}

// === FADE-UP REVEAL ===
const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(e => e.isIntersecting && e.target.classList.add('visible'));
}, { threshold: 0.1 });

document.querySelectorAll('.fade-up').forEach(el => revealObserver.observe(el));

// === METRIC COUNTERS ===
const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = +el.dataset.count;
        const suffix = el.dataset.suffix || '';
        let current = 0;
        const step = target / 70;
        const tick = () => {
            current += step;
            if (current < target) { el.innerText = Math.floor(current) + suffix; requestAnimationFrame(tick); }
            else el.innerText = target + suffix;
        };
        tick();
        counterObserver.unobserve(el);
    });
}, { threshold: 0.5 });

document.querySelectorAll('[data-count]').forEach(el => counterObserver.observe(el));

// === RETRIEVAL TRACE ANIMATION ===
// Lights up each node in sequence, loops
const traceNodes = document.querySelectorAll('.trace-node');
const traceArrows = document.querySelectorAll('.trace-arrow');

function animateTrace() {
    let i = 0;
    // reset
    traceNodes.forEach(n => n.classList.remove('trace-lit'));
    traceArrows.forEach(a => a.classList.remove('arrow-lit'));

    const step = () => {
        if (i > 0) traceArrows[i - 1]?.classList.add('arrow-lit');
        traceNodes[i]?.classList.add('trace-lit');
        i++;
        if (i < traceNodes.length) setTimeout(step, 700);
        else setTimeout(animateTrace, 2800); // restart after pause
    };
    step();
}

if (traceNodes.length) {
    // Start trace when architecture section is visible
    const archSection = document.getElementById('architecture');
    const traceObserver = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) { animateTrace(); traceObserver.disconnect(); }
    }, { threshold: 0.3 });
    if (archSection) traceObserver.observe(archSection);
}

// === PEFF BARS — animate on scroll ===
const peffFills = document.querySelectorAll('.peff-fill');
peffFills.forEach(bar => { const w = bar.style.width; bar.style.width = '0%'; bar._target = w; });

const peffObserver = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
        peffFills.forEach((bar, i) => {
            setTimeout(() => { bar.style.width = bar._target; }, i * 180);
        });
        peffObserver.disconnect();
    }
}, { threshold: 0.4 });

const formulaSection = document.getElementById('formula');
if (formulaSection) peffObserver.observe(formulaSection);

// === TERMINAL TEXT ===
const terminalLines = [
    'Initializing governed cognition...',
    'Loading episodic memory layers...',
    'Temporal retrieval calibration active.',
    'Monitoring memory pollution... rate: 0.12',
    'Semantic reranker synchronized.',
    'Persistence scoring operational.',
    'P_eff governance online.',
    'Artificial continuity initialized.',
    'Cross-session coherence: 54.2%',
    'Identity continuity: investigating...'
];

(() => {
    const terminal = document.getElementById('terminal-line');
    if (!terminal) return;
    let i = 0;
    setInterval(() => {
        terminal.style.opacity = 0;
        setTimeout(() => {
            terminal.innerText = terminalLines[i % terminalLines.length];
            terminal.style.opacity = 1;
            i++;
        }, 260);
    }, 3800);
})();

// === LIVE CLOCK + YEAR ===
const clockEl = document.getElementById('live-clock');
const yearEl = document.getElementById('year');
if (yearEl) yearEl.innerText = new Date().getFullYear();
if (clockEl) {
    const tick = () => clockEl.innerText = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    setInterval(tick, 1000); tick();
}

// === CARD MOUSE GLOW (subtle) ===
document.querySelectorAll('.card, .rcard, .role-card').forEach(card => {
    card.addEventListener('mousemove', e => {
        const { left, top } = card.getBoundingClientRect();
        card.style.setProperty('--mouse-x', `${e.clientX - left}px`);
        card.style.setProperty('--mouse-y', `${e.clientY - top}px`);
    });
});

// === STARFIELD ===
const canvas = document.getElementById('starfield');
if (canvas) {
    const ctx = canvas.getContext('2d');
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    const stars = Array.from({ length: 100 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.2 + 0.2,
        a: Math.random() * 0.5 + 0.2,
        speed: Math.random() * 0.15 + 0.02
    }));

    const draw = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Connections
        for (let i = 0; i < stars.length; i++) {
            for (let j = i + 1; j < stars.length; j++) {
                const dx = stars[i].x - stars[j].x, dy = stars[i].y - stars[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 100) {
                    ctx.beginPath();
                    ctx.moveTo(stars[i].x, stars[i].y);
                    ctx.lineTo(stars[j].x, stars[j].y);
                    ctx.strokeStyle = `rgba(217,164,65,${0.018 * (1 - dist / 100)})`;
                    ctx.lineWidth = 0.6;
                    ctx.stroke();
                }
            }
        }

        stars.forEach(s => {
            s.y += s.speed;
            if (s.y > canvas.height) { s.y = 0; s.x = Math.random() * canvas.width; }
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(217,164,65,${s.a})`;
            ctx.fill();
        });

        requestAnimationFrame(draw);
    };
    draw();
}

// === SUBTLE PARALLAX ===
window.addEventListener('mousemove', e => {
    document.body.style.backgroundPosition =
        `${(e.clientX / window.innerWidth) * 12}px ${(e.clientY / window.innerHeight) * 12}px`;
}, { passive: true });