document.addEventListener('DOMContentLoaded', () => {
    // ── Global State & UI ──
    const loader = document.getElementById('loading-screen');
    const sagaNav = document.querySelector('.saga-nav');
    
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader?.classList.add('fade-out');
            sagaNav?.classList.add('visible');
            startSeaEvents(); // Start background events
        }, 2000);
    });

    // ── Sea Events Spawning ──
    function createSeaEvent(type) {
        const event = document.createElement('div');
        event.className = `sea-event ${type}`;

        if (type === 'news-coo') {
            event.innerHTML = `
                <svg viewBox="0 0 100 60" class="coo-svg">
                    <path d="M10,30 Q30,10 50,30 T90,30" fill="none" stroke="#fff" stroke-width="2" />
                    <rect x="40" y="35" width="20" height="15" fill="#fff" opacity="0.8" />
                </svg>
            `;
            event.style.top = `${Math.random() * 20 + 5}%`;
            document.body.appendChild(event);
            setTimeout(() => event.remove(), 15000);
        } else if (type === 'sea-king') {
            event.innerHTML = `
                <svg viewBox="0 0 400 200" class="king-svg">
                    <path d="M0,150 Q100,100 200,150 T400,150" fill="rgba(255,255,255,0.05)" />
                </svg>
            `;
            event.style.top = `${Math.random() * 50 + 20}%`;
            document.body.appendChild(event);
            setTimeout(() => event.remove(), 30000);
        }
    }

    function startSeaEvents() {
        setInterval(() => {
            if (Math.random() > 0.5) createSeaEvent('news-coo');
        }, 30000);
        setInterval(() => {
            if (Math.random() > 0.7) createSeaEvent('sea-king');
        }, 60000);
    }

    // ── Web Audio API Setup ──
    const audio = document.getElementById('ambient-audio');
    const toggleBtn = document.getElementById('audio-toggle');
    const playIcon = toggleBtn?.querySelector('.icon-play');
    const pauseIcon = toggleBtn?.querySelector('.icon-pause');

    let audioCtx, source, biquadFilter, gainNode;

    function initAudio() {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            source = audioCtx.createMediaElementSource(audio);
            biquadFilter = audioCtx.createBiquadFilter();
            gainNode = audioCtx.createGain();
            source.connect(biquadFilter);
            biquadFilter.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            biquadFilter.type = "allpass";
            gainNode.gain.value = 0.3;
        }
    }

    if (audio && toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            initAudio();
            if (audio.paused) {
                audioCtx.resume();
                audio.play().then(() => {
                    playIcon.style.display = 'none';
                    pauseIcon.style.display = 'block';
                    toggleBtn.classList.add('playing');
                });
            } else {
                audio.pause();
                playIcon.style.display = 'block';
                pauseIcon.style.display = 'none';
                toggleBtn.classList.remove('playing');
            }
        });
    }

    function updateAtmosphere(saga) {
        if (!biquadFilter || !gainNode) return;
        const now = audioCtx.currentTime;
        if (saga === 'skypiea') {
            biquadFilter.type = "highpass";
            biquadFilter.frequency.setTargetAtTime(1500, now, 2);
            gainNode.gain.setTargetAtTime(0.2, now, 2);
        } else if (saga === 'water7' || saga === 'summit') {
            biquadFilter.type = "lowpass";
            biquadFilter.frequency.setTargetAtTime(800, now, 2);
            gainNode.gain.setTargetAtTime(0.5, now, 2);
        } else if (saga === 'thriller') {
            biquadFilter.type = "peaking";
            biquadFilter.frequency.setTargetAtTime(200, now, 2);
            gainNode.gain.setTargetAtTime(0.15, now, 2);
        } else {
            biquadFilter.type = "allpass";
            biquadFilter.frequency.setTargetAtTime(10000, now, 1);
            gainNode.gain.setTargetAtTime(0.3, now, 1);
        }
    }

    // ── Conqueror's Haki Ripple ──
    const hakiTrigger = document.getElementById('haki-trigger');
    const hakiRipple = hakiTrigger?.querySelector('.haki-ripple');
    hakiTrigger?.addEventListener('click', () => {
        hakiRipple?.classList.remove('animate');
        void hakiRipple?.offsetWidth;
        hakiRipple?.classList.add('animate');
        document.body.classList.add('haki-flash');
        setTimeout(() => document.body.classList.remove('haki-flash'), 500);
    });

    // ── Poneglyph Hunt ──
    const collectedPones = JSON.parse(localStorage.getItem('collectedPones') || '[]');
    const poneCountDisplay = document.getElementById('pone-count');
    const poneCounterUI = document.getElementById('pone-counter');
    const laughTaleReveal = document.getElementById('laugh-tale-reveal');

    function updatePoneUI() {
        if (poneCountDisplay) poneCountDisplay.innerText = collectedPones.length;
        if (collectedPones.length === 4) {
            poneCounterUI?.classList.add('all-found');
            laughTaleReveal?.classList.remove('hidden');
            laughTaleReveal?.classList.add('visible');
        }
        collectedPones.forEach(id => {
            document.querySelector(`[data-pone-id="${id}"]`)?.classList.add('collected');
        });
    }

    document.querySelectorAll('.poneglyph').forEach(pone => {
        pone.addEventListener('click', () => {
            const id = pone.getAttribute('data-pone-id');
            if (!collectedPones.includes(id)) {
                collectedPones.push(id);
                localStorage.setItem('collectedPones', JSON.stringify(collectedPones));
                pone.classList.add('collected');
                updatePoneUI();
                hakiTrigger?.click();
            }
        });
    });
    updatePoneUI();

    // ── Bounty Tracking ──
    const bountyTracker = document.getElementById('bounty-tracker');
    const bountyAmount = document.getElementById('bounty-amount');
    const bounties = {
        'romance-dawn': 0, 'arlong-park': 30000000, 'alabasta': 160000000, 'enies-lobby': 664000050,
        'sabaody': 664000050, 'fishman-island': 800000050, 'dressrosa': 1570000100,
        'whole-cake': 3123000100, 'wano': 8806001000, 'egghead': 8806001000, 'elbaf': 8806001000
    };

    function updateBounty(arcKey) {
        let currentBounty = 0;
        const keys = Object.keys(bounties);
        for (let key of keys) {
            if (bounties[key] !== undefined) currentBounty = bounties[key];
            if (key === arcKey) break;
        }
        if (bountyAmount) {
            const target = currentBounty, start = parseInt(bountyAmount.innerText.replace(/,/g, '')) || 0, duration = 1000, startTime = performance.now();
            function animate(currentTime) {
                const elapsed = currentTime - startTime, progress = Math.min(elapsed / duration, 1), current = Math.floor(start + (target - start) * progress);
                bountyAmount.innerText = current.toLocaleString();
                if (progress < 1) requestAnimationFrame(animate);
            }
            requestAnimationFrame(animate);
        }
        if (currentBounty > 0) bountyTracker?.classList.add('visible');
        else bountyTracker?.classList.remove('visible');
    }

    // ── State Variables ──
    let currentSaga = 'eastblue';
    let currentArc = 'romance-dawn';

    // ── Intersection Observers ──
    const drumsOverlay = document.getElementById('drums-overlay');
    const sagaObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sagaName = entry.target.getAttribute('data-saga');
                if (sagaName && currentSaga !== sagaName) {
                    currentSaga = sagaName;
                    document.body.className = `active-saga-${sagaName}`;
                    updateAtmosphere(sagaName);
                    if (sagaName === 'yonko' || sagaName === 'final') drumsOverlay?.classList.add('active');
                    else drumsOverlay?.classList.remove('active');
                    document.querySelectorAll('.nav-item').forEach(item => item.classList.toggle('active', item.getAttribute('data-saga-link') === sagaName));
                }
            }
        });
    }, { rootMargin: '-20% 0px -60% 0px', threshold: 0 });
    document.querySelectorAll('.saga-section').forEach(section => sagaObserver.observe(section));

    const arcObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                const arcName = entry.target.getAttribute('data-arc');
                if (arcName && currentArc !== arcName) {
                    currentArc = arcName;
                    updateBounty(arcName);
                    if (window.particleSystem) window.particleSystem.forEach(p => { p.reset(); p.y = Math.random() * window.innerHeight; });
                }
                if (arcName === 'elbaf') document.querySelector('.to-be-continued')?.classList.add('visible');
            }
        });
    }, { rootMargin: '0px 0px -100px 0px', threshold: 0.2 });
    document.querySelectorAll('.arc-entry').forEach(card => arcObserver.observe(card));

    // ── Parallax & 3D Tilt for Cards ──
    document.querySelectorAll('.arc-card').forEach(card => {
        const internalImg = card.querySelector('.card-image img');
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect(), x = e.clientX - rect.left, y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
            card.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
            const centerX = rect.width / 2, centerY = rect.height / 2, rotateX = ((y - centerY) / centerY) * -10, rotateY = ((x - centerX) / centerX) * 10;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px) scale(1.02)`;
            if (internalImg) {
                const moveX = ((x - centerX) / centerX) * -15, moveY = ((y - centerY) / centerY) * -15;
                internalImg.style.transform = `translate(${moveX}px, ${moveY}px)`;
            }
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0) rotateY(0) translateY(0) scale(1)`;
            if (internalImg) internalImg.style.transform = `translate(0, 0)`;
        });
    });

    // ── Scroll Progress ──
    const timelineLine = document.getElementById('timeline-progress-line');
    const timelineContainer = document.querySelector('.timeline');
    window.addEventListener('scroll', () => {
        if (timelineLine && timelineContainer) {
            const rect = timelineContainer.getBoundingClientRect(), viewportHeight = window.innerHeight, scrollDistance = -rect.top + (viewportHeight / 2), progress = Math.max(0, Math.min(100, (scrollDistance / rect.height) * 100));
            timelineLine.style.height = `${progress}%`;
        }
    }, { passive: true });

    // ── Advanced Particle System ──
    const pCanvas = document.getElementById('particles-canvas');
    if (pCanvas) {
        const ctx = pCanvas.getContext('2d');
        let width = pCanvas.width = window.innerWidth, height = pCanvas.height = window.innerHeight, particles = [];
        window.addEventListener('resize', () => { width = pCanvas.width = window.innerWidth; height = pCanvas.height = window.innerHeight; });
        class Particle {
            constructor() { this.reset(); this.y = Math.random() * height; }
            reset() {
                this.x = Math.random() * width; this.y = -20; this.size = Math.random() * 2 + 1;
                this.speedY = Math.random() * 1 + 0.5; this.speedX = Math.random() * 0.5 - 0.25;
                this.opacity = Math.random() * 0.5 + 0.1; this.color = '#ffffff'; this.type = 'circle';
                if (currentArc === 'orange-town') { this.color = `hsl(${Math.random() * 360}, 70%, 60%)`; this.type = 'square'; }
                else if (['arlong-park', 'loguetown', 'water-7', 'enies-lobby'].includes(currentArc)) { this.color = '#60a5fa'; this.type = 'droplet'; this.speedY = Math.random() * 5 + 5; this.speedX = -1; }
                else if (currentArc === 'drum-island') { this.size = Math.random() * 4 + 2; }
                else if (currentArc === 'alabasta') { this.color = '#f59e0b'; this.speedX = Math.random() * 4 - 2; }
                else if (currentArc === 'skypiea') { this.color = '#facc15'; }
                else if (currentArc === 'thriller-bark') { this.color = '#4ade80'; this.size = Math.random() * 8 + 4; this.y = Math.random() * height; }
                else if (['sabaody', 'fishman-island'].includes(currentArc)) { this.color = currentArc === 'sabaody' ? '#fef08a' : '#a5f3fc'; this.y = height + 20; this.speedY = -(Math.random() * 2 + 1); this.type = 'bubble'; }
                else if (currentArc === 'marineford') { this.color = Math.random() > 0.5 ? '#4b5563' : '#ef4444'; }
                else if (currentArc === 'dressrosa' || currentArc === 'wano' || currentArc === 'elbaf') { this.color = currentArc === 'dressrosa' ? '#f43f5e' : (currentArc === 'wano' ? '#f472b6' : '#ea580c'); this.type = 'petal'; }
                else if (currentArc === 'egghead') { this.color = '#22d3ee'; this.type = 'square'; }
            }
            update() {
                this.x += this.speedX; this.y += this.speedY; if (this.type === 'petal') this.x += Math.sin(this.y * 0.02) * 1.5;
                if (this.speedY < 0) { if (this.y < -20) this.reset(); }
                else { if (this.y > height + 20 || this.x > width + 20 || this.x < -20) this.reset(); }
            }
            draw() {
                ctx.fillStyle = this.color; ctx.globalAlpha = this.opacity; ctx.beginPath();
                if (this.type === 'droplet') { ctx.moveTo(this.x, this.y); ctx.lineTo(this.x + this.speedX, this.y + this.size); ctx.strokeStyle = this.color; ctx.lineWidth = 1; ctx.stroke(); }
                else if (this.type === 'square') { ctx.fillRect(this.x, this.y, this.size, this.size); }
                else if (this.type === 'bubble') { ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.strokeStyle = this.color; ctx.lineWidth = 1; ctx.stroke(); }
                else if (this.type === 'petal') { ctx.ellipse(this.x, this.y, this.size, this.size / 2, this.y * 0.1, 0, Math.PI * 2); ctx.fill(); }
                else { ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2); ctx.fill(); }
                ctx.globalAlpha = 1.0;
            }
        }
        for (let i = 0; i < 60; i++) particles.push(new Particle());
        window.particleSystem = particles;
        function animate() { ctx.clearRect(0, 0, width, height); particles.forEach(p => { p.update(); p.draw(); }); requestAnimationFrame(animate); }
        animate();
    }
});
