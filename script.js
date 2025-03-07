document.addEventListener('DOMContentLoaded', () => {
    // Language Toggle
    const langButton = document.getElementById('langButton');
    const htmlElement = document.documentElement;
    const langText = langButton.querySelector('.current-lang');

    function toggleLanguage() {
        const currentLang = htmlElement.getAttribute('data-lang');
        const newLang = currentLang === 'uk' ? 'en' : 'uk';
        htmlElement.setAttribute('data-lang', newLang);
        langText.textContent = newLang.toUpperCase();
        localStorage.setItem('language', newLang);
    }

    // Відновлюємо збережену мову
    const savedLang = localStorage.getItem('language');
    if (savedLang) {
        htmlElement.setAttribute('data-lang', savedLang);
        langText.textContent = savedLang.toUpperCase();
    }

    langButton.addEventListener('click', toggleLanguage);

    // Theme Toggle
    const themeButton = document.getElementById('themeButton');
    const themeMenu = document.querySelector('.theme-menu');
    const themeOptions = document.querySelectorAll('.theme-option');
    const themeIcon = themeButton.querySelector('i');

    // Показати/приховати меню тем
    themeButton.addEventListener('click', () => {
        themeMenu.classList.toggle('active');
    });

    // Закрити меню при кліку поза ним
    document.addEventListener('click', (e) => {
        if (!themeButton.contains(e.target) && !themeMenu.contains(e.target)) {
            themeMenu.classList.remove('active');
        }
    });

    // Зміна теми
    themeOptions.forEach(option => {
        option.addEventListener('click', () => {
            const newTheme = option.dataset.theme;
            htmlElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            // Оновлюємо іконку на кнопці
            const icons = {
                'light': 'fa-sun',
                'dark': 'fa-moon',
                'yellow': 'fa-star'
            };
            themeIcon.className = `fas ${icons[newTheme]}`;
            
            themeMenu.classList.remove('active');
        });
    });

    // Відновлюємо збережену тему
    const savedTheme = localStorage.getItem('theme') || 'light';
    htmlElement.setAttribute('data-theme', savedTheme);
    const icons = {
        'light': 'fa-sun',
        'dark': 'fa-moon',
        'yellow': 'fa-star'
    };
    themeIcon.className = `fas ${icons[savedTheme]}`;

    // Slider functionality
    const slides = document.querySelectorAll('.slide');
    const prevButton = document.querySelector('.prev');
    const nextButton = document.querySelector('.next');
    const slidesContainer = document.querySelector('.slide-indicators');
    const reactionButtons = document.querySelectorAll('.reaction-btn');
    let currentSlide = 0;
    let slideInterval;

    // Створюємо індикатори для слайдів
    slides.forEach((_, index) => {
        const indicator = document.createElement('div');
        indicator.classList.add('indicator');
        if (index === 0) indicator.classList.add('active');
        indicator.addEventListener('click', () => showSlide(index));
        slidesContainer.appendChild(indicator);
    });

    const indicators = document.querySelectorAll('.indicator');

    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        indicators.forEach(ind => ind.classList.remove('active'));
        
        if (index >= slides.length) {
            currentSlide = 0;
        } else if (index < 0) {
            currentSlide = slides.length - 1;
        } else {
            currentSlide = index;
        }

        slides[currentSlide].classList.add('active');
        indicators[currentSlide].classList.add('active');
    }

    function startSlideshow() {
        if (slideInterval) clearInterval(slideInterval);
        slideInterval = setInterval(() => {
            showSlide(currentSlide + 1);
        }, 5000);
    }

    // Floating Elements Animation
    function createFloatingElement() {
        const elements = ['🌸', '🌺', '🌹', '🌷', '✨', '⭐', '❤️'];
        const element = document.createElement('div');
        element.className = 'floating-element';
        element.textContent = elements[Math.floor(Math.random() * elements.length)];
        
        // Випадкова позиція по горизонталі
        element.style.left = Math.random() * 90 + 5 + '%';
        
        // Випадковий розмір
        const size = Math.random() * 1 + 1;
        element.style.fontSize = size + 'rem';
        
        document.querySelector('.floating-elements').appendChild(element);

        // Видаляємо елемент після завершення анімації
        element.addEventListener('animationend', () => element.remove());
    }

    // Створюємо нові елементи з різними інтервалами
    function startFloatingElements() {
        // Початкове створення кількох елементів
        for(let i = 0; i < 3; i++) {
            setTimeout(createFloatingElement, i * 800);
        }
        
        // Продовжуємо створювати нові елементи
        setInterval(() => {
            if(document.querySelectorAll('.floating-element').length < 10) {
                createFloatingElement();
            }
        }, 2000);
    }

    startFloatingElements();

    prevButton.addEventListener('click', () => {
        showSlide(currentSlide - 1);
        startSlideshow();
    });

    nextButton.addEventListener('click', () => {
        showSlide(currentSlide + 1);
        startSlideshow();
    });

    // Додаємо анімацію для кнопок реакцій
    reactionButtons.forEach(button => {
        button.addEventListener('click', () => {
            const emoji = button.dataset.emoji;
            for (let i = 0; i < 3; i++) {
                const particle = document.createElement('span');
                particle.textContent = emoji;
                particle.style.position = 'fixed';
                particle.style.left = `${button.getBoundingClientRect().left + button.offsetWidth/2}px`;
                particle.style.top = `${button.getBoundingClientRect().top}px`;
                particle.style.fontSize = '2rem';
                particle.style.pointerEvents = 'none';
                document.body.appendChild(particle);

                const angle = (Math.random() - 0.5) * Math.PI;
                const velocity = 5 + Math.random() * 5;

                const animation = particle.animate([
                    {
                        transform: 'translate(-50%, 0) scale(1)',
                        opacity: 1
                    },
                    {
                        transform: `translate(${Math.sin(angle) * 100}px, ${-velocity * 50}px) scale(1.5)`,
                        opacity: 0
                    }
                ], {
                    duration: 1000,
                    easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
                });

                animation.onfinish = () => particle.remove();
            }
            
            button.style.transform = 'scale(0.95)';
            setTimeout(() => button.style.transform = '', 150);
        });
    });

    // Додаємо керування клавішами
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            showSlide(currentSlide - 1);
            startSlideshow();
        } else if (e.key === 'ArrowRight') {
            showSlide(currentSlide + 1);
            startSlideshow();
        }
    });

    // Запускаємо слайдшоу
    startSlideshow();

    // Magic Bubbles
    const bubblesContainer = document.querySelector('.magic-bubbles');
    const compliments = {
        uk: [
            "Ти неймовірна! ✨",
            "Твоя посмішка осяює весь Лондон! 🌟",
            "Ти робиш світ кращим! 🌍",
            "Твої мрії обов'язково здійсняться! 🎯",
            "Ти справжня королева! 👑",
            "Твоя енергія заряджає всіх навколо! ⚡",
            "Ти робиш неможливе можливим! 🌈",
            "Лондон пощастило з тобою! 🇬🇧",
            "Ти справжнє сонечко! ☀️",
            "Твій успіх надихає! 🌟"
        ],
        en: [
            "You're amazing! ✨",
            "Your smile lights up London! 🌟",
            "You make the world better! 🌍",
            "Your dreams will come true! 🎯",
            "You're a true queen! 👑",
            "Your energy is contagious! ⚡",
            "You make impossible possible! 🌈",
            "London is lucky to have you! 🇬🇧",
            "You're a real sunshine! ☀️",
            "Your success inspires! 🌟"
        ]
    };

    let lastBubbleTime = 0;
    const BUBBLE_COOLDOWN = 800; // збільшуємо час між бульбашками
    let lastMouseX = 0;
    let lastMouseY = 0;
    const MOUSE_DISTANCE_THRESHOLD = 100; // мінімальна відстань для створення нової бульбашки

    function createBubble(x, y) {
        const currentTime = Date.now();
        if (currentTime - lastBubbleTime < BUBBLE_COOLDOWN) return;

        // Перевіряємо відстань від останньої позиції миші
        const distance = Math.sqrt(Math.pow(x - lastMouseX, 2) + Math.pow(y - lastMouseY, 2));
        if (distance < MOUSE_DISTANCE_THRESHOLD && lastMouseX !== 0) return;

        lastMouseX = x;
        lastMouseY = y;
        lastBubbleTime = currentTime;

        const bubble = document.createElement('div');
        bubble.className = 'magic-bubble';
        
        const currentLang = document.documentElement.getAttribute('data-lang');
        const complimentsList = compliments[currentLang];
        const randomCompliment = complimentsList[Math.floor(Math.random() * complimentsList.length)];
        
        bubble.textContent = randomCompliment;
        bubble.style.left = `${x - 50}px`;
        bubble.style.top = `${y - 50}px`;
        
        // Випадковий розмір бульбашки
        const size = Math.random() * 50 + 100;
        bubble.style.width = `${size}px`;
        bubble.style.height = `${size}px`;

        bubblesContainer.appendChild(bubble);
        
        // Видаляємо бульбашку після анімації
        bubble.addEventListener('animationend', () => bubble.remove());
    }

    // Оптимізована підтримка миші з перевіркою швидкості руху
    let isCreatingBubble = false;
    document.addEventListener('mousemove', (e) => {
        if (!isCreatingBubble) {
            isCreatingBubble = true;
            createBubble(e.clientX, e.clientY);
            setTimeout(() => {
                isCreatingBubble = false;
            }, BUBBLE_COOLDOWN);
        }
    });

    // Оновлюємо текст підказки для мобільних пристроїв
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const hintElement = document.querySelector('.magic-hint');
    if (isMobile) {
        const ukHint = hintElement.querySelector('.uk-text');
        const enHint = hintElement.querySelector('.en-text');
        ukHint.textContent = 'Торкайся екрану, щоб побачити магію!';
        enHint.textContent = 'Touch the screen to see the magic!';
    }

    // Magic Mode
    const title = document.querySelector('.title');
    let clickCount = 0;
    let lastClickTime = 0;

    title.addEventListener('click', () => {
        const currentTime = Date.now();
        if (currentTime - lastClickTime > 500) {
            clickCount = 1;
        } else {
            clickCount++;
        }
        lastClickTime = currentTime;

        if (clickCount === 3) {
            document.body.classList.toggle('magic-mode');
            
            // Створюємо феєрверк
            for (let i = 0; i < 20; i++) {
                setTimeout(() => {
                    const x = Math.random() * window.innerWidth;
                    const y = Math.random() * window.innerHeight;
                    createBubble(x, y);
                }, i * 100);
            }
            
            // Додаємо звуковий ефект
            const audio = new Audio('https://www.soundjay.com/misc/sounds/magic-chime-01.mp3');
            audio.volume = 0.3;
            audio.play().catch(() => {}); // Ігноруємо помилку, якщо браузер блокує автовідтворення
            
            clickCount = 0;
        }
    });
}); 