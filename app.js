document.addEventListener('DOMContentLoaded', () => {
    
    /* ==========================================================================
       1. FALLING PETALS & SPARKLES CANVAS ANIMATION ENGINE
       ========================================================================== */
    const canvas = document.getElementById('petalsCanvas');
    const ctx = canvas.getContext('2d');

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const numParticles = 25; // elegant particle density

    class PetalParticle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * width;
            this.y = -20 - Math.random() * height * 0.5;
            this.size = Math.random() * 8 + 6;
            this.speedY = Math.random() * 0.8 + 0.4;
            this.speedX = Math.sin(Math.random() * Math.PI) * 0.5;
            this.rotation = Math.random() * 360;
            this.rotationSpeed = (Math.random() - 0.5) * 1.5;
            this.opacity = Math.random() * 0.6 + 0.25;
            // Rose gold / golden champagne tones
            const colors = ['#E8D3C5', '#D4A373', '#F3E5AB', '#E0A96D', '#F4E0D6'];
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }

        update() {
            this.y += this.speedY;
            this.x += Math.sin(this.y * 0.01) * 0.6 + this.speedX;
            this.rotation += this.rotationSpeed;

            if (this.y > height + 20) {
                this.reset();
            }
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate((this.rotation * Math.PI) / 180);
            ctx.globalAlpha = this.opacity;
            ctx.fillStyle = this.color;

            // Draw soft organic petal shape
            ctx.beginPath();
            ctx.moveTo(0, -this.size);
            ctx.bezierCurveTo(this.size, -this.size * 0.5, this.size, this.size * 0.8, 0, this.size);
            ctx.bezierCurveTo(-this.size, this.size * 0.8, -this.size, -this.size * 0.5, 0, -this.size);
            ctx.fill();

            ctx.restore();
        }
    }

    for (let i = 0; i < numParticles; i++) {
        particles.push(new PetalParticle());
    }

    function animateParticles() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animateParticles);
    }

    animateParticles();

    /* ==========================================================================
       2. AUDIO PLAYER TOGGLE WITH PULSE
       ========================================================================== */
    const bgMusic = document.getElementById('bgMusic');
    const audioToggle = document.getElementById('audioToggle');
    const audioText = audioToggle.querySelector('.audio-text');
    let isPlaying = false;

    audioToggle.addEventListener('click', () => {
        if (isPlaying) {
            bgMusic.pause();
            audioToggle.classList.remove('playing');
            audioText.textContent = 'Включить музыку';
            isPlaying = false;
        } else {
            bgMusic.play().then(() => {
                audioToggle.classList.add('playing');
                audioText.textContent = 'Пауза';
                isPlaying = true;
            }).catch(err => {
                console.log('Audio playback prevented by browser:', err);
                alert('Кликните по странице еще раз, чтобы включить воспроизведение.');
            });
        }
    });

    /* ==========================================================================
       3. COUNTDOWN TIMER
       ========================================================================== */
    const weddingDate = new Date('September 25, 2026 16:30:00').getTime();

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = weddingDate - now;

        if (distance < 0) {
            document.getElementById('days').innerText = '00';
            document.getElementById('hours').innerText = '00';
            document.getElementById('minutes').innerText = '00';
            document.getElementById('seconds').innerText = '00';
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById('days').innerText = days < 10 ? '0' + days : days;
        document.getElementById('hours').innerText = hours < 10 ? '0' + hours : hours;
        document.getElementById('minutes').innerText = minutes < 10 ? '0' + minutes : minutes;
        document.getElementById('seconds').innerText = seconds < 10 ? '0' + seconds : seconds;
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);

    /* ==========================================================================
       4. RSVP FORM HANDLING WITH CONFETTI EXPLOSION
       ========================================================================== */
    const rsvpForm = document.getElementById('rsvpForm');
    const rsvpSuccess = document.getElementById('rsvpSuccess');
    const rsvpResetBtn = document.getElementById('rsvpResetBtn');
    const attendanceRadios = document.getElementsByName('attendance');
    const plusOneGroup = document.getElementById('plusOneGroup');
    const drinksGroup = document.getElementById('drinksGroup');

    attendanceRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (e.target.value === 'no') {
                plusOneGroup.style.display = 'none';
                drinksGroup.style.display = 'none';
            } else {
                plusOneGroup.style.display = 'block';
                drinksGroup.style.display = 'block';
            }
        });
    });

    function triggerCelebrationConfetti() {
        if (typeof confetti === 'function') {
            // Golden & Rose Gold heart confetti shower
            confetti({
                particleCount: 80,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#D4A373', '#E8D3C5', '#FF416C', '#FF4B2B', '#FFD700']
            });

            setTimeout(() => {
                confetti({
                    particleCount: 50,
                    angle: 60,
                    spread: 55,
                    origin: { x: 0 },
                    colors: ['#D4A373', '#E0A96D', '#FFD700']
                });
                confetti({
                    particleCount: 50,
                    angle: 120,
                    spread: 55,
                    origin: { x: 1 },
                    colors: ['#D4A373', '#E0A96D', '#FFD700']
                });
            }, 300);
        }
    }

    rsvpForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const guestName = document.getElementById('guestName').value.trim();
        const attendance = document.querySelector('input[name="attendance"]:checked').value;
        const plusOne = document.getElementById('plusOne').value.trim();
        const notes = document.getElementById('notes').value.trim();

        const selectedDrinks = Array.from(document.querySelectorAll('input[name="drinks"]:checked'))
            .map(cb => cb.value);

        const rsvpData = {
            guestName,
            attendance: attendance === 'yes' ? 'Присутствует' : 'Не сможет прийти',
            plusOne,
            drinks: selectedDrinks.join(', ') || 'Не выбрано',
            notes,
            timestamp: new Date().toISOString()
        };

        const existingRSVPs = JSON.parse(localStorage.getItem('wedding_rsvps') || '[]');
        existingRSVPs.push(rsvpData);
        localStorage.setItem('wedding_rsvps', JSON.stringify(existingRSVPs));

        rsvpForm.classList.add('hidden');
        rsvpSuccess.classList.remove('hidden');

        const successText = document.getElementById('successText');
        if (attendance === 'yes') {
            successText.innerHTML = `Дорогой(ая) <strong>${guestName}</strong>, ваш ответ успешно сохранен!<br>С нетерпением ждем нашей встречи на банкете! 🎉`;
            triggerCelebrationConfetti();
        } else {
            successText.innerHTML = `Дорогой(ая) <strong>${guestName}</strong>, спасибо за то, что сообщили!<br>Нам очень жаль, но мы чувствуем вашу поддержку! ❤️`;
        }
    });

    rsvpResetBtn.addEventListener('click', () => {
        rsvpForm.reset();
        plusOneGroup.style.display = 'block';
        drinksGroup.style.display = 'block';
        rsvpSuccess.classList.add('hidden');
        rsvpForm.classList.remove('hidden');
    });

    /* ==========================================================================
       5. GUESTBOOK / WISHES
       ========================================================================== */
    const wishForm = document.getElementById('wishForm');
    const wishesList = document.getElementById('wishesList');

    const defaultWishes = [
        { author: 'Айдос и Мадина', text: 'Поздравляем вас с днем создания семьи! Желаем нескончаемой любви, уюта и счастья!', time: 'Только что' },
        { author: 'Тетя Гульнара', text: 'Пусть ваш дом всегда наполняется смехом и радостью. Будьте бесконечно счастливы!', time: '1 час назад' }
    ];

    function loadWishes() {
        const savedWishes = JSON.parse(localStorage.getItem('wedding_wishes') || '[]');
        const allWishes = [...defaultWishes, ...savedWishes];
        
        wishesList.innerHTML = '';
        allWishes.reverse().forEach((wish, idx) => {
            const card = document.createElement('div');
            card.className = 'wish-card fade-in visible';
            card.style.animationDelay = `${idx * 0.1}s`;
            card.innerHTML = `
                <div class="wish-author">${escapeHtml(wish.author)}</div>
                <div class="wish-text">«${escapeHtml(wish.text)}»</div>
                <div class="wish-time">${wish.time}</div>
            `;
            wishesList.appendChild(card);
        });
    }

    wishForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const authorInput = document.getElementById('wishAuthor');
        const textInput = document.getElementById('wishText');

        const newWish = {
            author: authorInput.value.trim(),
            text: textInput.value.trim(),
            time: 'Только что'
        };

        const savedWishes = JSON.parse(localStorage.getItem('wedding_wishes') || '[]');
        savedWishes.push(newWish);
        localStorage.setItem('wedding_wishes', JSON.stringify(savedWishes));

        authorInput.value = '';
        textInput.value = '';
        loadWishes();
        triggerCelebrationConfetti();
    });

    loadWishes();

    /* ==========================================================================
       6. ADD TO CALENDAR EVENT
       ========================================================================== */
    const addToCalendarBtn = document.getElementById('addToCalendarBtn');
    addToCalendarBtn.addEventListener('click', () => {
        const title = encodeURIComponent('Свадьба Данияра и Аружан');
        const details = encodeURIComponent('Ресторан Grand Ballroom Royal, Алматы. Сбор гостей в 16:30.');
        const location = encodeURIComponent('мкр. Самал-2, ул. Жолдасбекова, 15, Алматы');
        
        const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=20260925T103000Z/20260925T173000Z&details=${details}&location=${location}`;
        window.open(googleCalendarUrl, '_blank');
    });

    /* ==========================================================================
       7. ADVANCED SCROLL REVEAL (IntersectionObserver)
       ========================================================================== */
    const observerOptions = {
        threshold: 0.05,
        rootMargin: '0px 0px -20px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe all fade-in and reveal elements
    document.querySelectorAll('.fade-in, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
        observer.observe(el);
    });

    document.querySelectorAll('.section-header, .story-image-wrapper, .story-text-content, .location-card, .dresscode-card, .rsvp-form').forEach((el, index) => {
        if (index % 2 === 0) {
            el.classList.add('reveal-left');
        } else {
            el.classList.add('reveal-right');
        }
        observer.observe(el);
    });

    document.querySelectorAll('.timer-card, .timeline-item, .contact-card').forEach((el, index) => {
        el.classList.add('fade-in');
        el.style.transitionDelay = `${(index % 4) * 0.12}s`;
        observer.observe(el);
    });

    function escapeHtml(str) {
        return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    }
});
