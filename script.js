// ============ MEMORIES COUNTER ============
let flippedMemories = new Set();

function updateMemoriesCounter() {
    const flippedCount = document.getElementById('flippedCount');
    flippedCount.textContent = flippedMemories.size;
}

// ============ FLIP CARD FUNCTION ============

function flipCard(element) {
    const wasFlipped = element.classList.contains('flipped');
    element.classList.toggle('flipped');
    
    // Track flipped cards
    if (!wasFlipped) {
        flippedMemories.add(element);
        updateMemoriesCounter();
        createSparkles(element);
    } else {
        flippedMemories.delete(element);
        updateMemoriesCounter();
    }
    
    // Haptic feedback
    if (navigator.vibrate) {
        navigator.vibrate(150);
    }
}

// ============ SPARKLE EFFECT ============

function createSparkles(element) {
    const sparkles = ['✨', '💫', '⭐', '🌟', '💥'];
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    for (let i = 0; i < 8; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.textContent = sparkles[Math.floor(Math.random() * sparkles.length)];
        
        const angle = (i / 8) * Math.PI * 2;
        const distance = 60;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;
        
        sparkle.style.left = centerX + 'px';
        sparkle.style.top = centerY + 'px';
        sparkle.style.setProperty('--tx', tx + 'px');
        sparkle.style.setProperty('--ty', ty + 'px');
        
        document.body.appendChild(sparkle);
        
        sparkle.style.animation = `sparkleAnimation 0.8s ease-out forwards`;
        
        setTimeout(() => {
            sparkle.remove();
        }, 800);
    }
}

// ============ LOVE HEARTS ANIMATION ============

function createLoveHearts() {
    const hearts = ['❤️', '💕', '💖', '💗', '💝', '💓', '💞'];
    
    for (let i = 0; i < 15; i++) {
        const heart = document.createElement('div');
        heart.className = 'love-heart';
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        
        // Random position
        const startX = Math.random() * window.innerWidth;
        const startY = window.innerHeight + 10;
        
        heart.style.left = startX + 'px';
        heart.style.top = startY + 'px';
        heart.style.fontSize = (Math.random() * 20 + 20) + 'px';
        heart.style.opacity = '1';
        
        document.body.appendChild(heart);
        
        // Animation
        const duration = Math.random() * 2000 + 2000;
        const delay = i * 50;
        
        setTimeout(() => {
            heart.style.animation = `floatUp ${duration}ms ease-out forwards`;
        }, delay);
        
        // Remove after animation
        setTimeout(() => {
            heart.remove();
        }, delay + duration);
    }
}

// ============ SCROLL ROLL ANIMATION ENGINE ============

const timelineElements = document.querySelectorAll('.timeline-moment, .midway-card-wrapper');

// Preload images first
function preloadAllImages() {
    const images = document.querySelectorAll('.flip-card-front img');
    let loadedCount = 0;
    const totalImages = images.length;

    return new Promise((resolve) => {
        if (totalImages === 0) {
            resolve();
            return;
        }

        images.forEach(img => {
            const tempImg = new Image();
            tempImg.onload = () => {
                loadedCount++;
                if (loadedCount === totalImages) {
                    resolve();
                }
            };
            tempImg.onerror = () => {
                loadedCount++;
                if (loadedCount === totalImages) {
                    resolve();
                }
            };
            tempImg.src = img.src;
        });
    });
}

function observeScrollRoll() {
    const observerOptions = {
        root: null,
        rootMargin: '-30% 0px -30% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Element is in view - add in-view class
                entry.target.classList.remove('out-view');
                entry.target.classList.add('in-view');
            } else {
                // Element is out of view
                const rect = entry.target.getBoundingClientRect();
                
                if (rect.top > 0) {
                    // Element is above viewport - add out-view class
                    entry.target.classList.remove('in-view');
                    entry.target.classList.add('out-view');
                } else {
                    // Element is below viewport - reset
                    entry.target.classList.remove('in-view', 'out-view');
                    entry.target.style.opacity = '0';
                }
            }
        });
    }, observerOptions);

    timelineElements.forEach(element => {
        observer.observe(element);
    });
}

// ============ BUTTON INTERACTION ============

function revealMessage() {
    const messageReveal = document.getElementById('messageReveal');
    messageReveal.classList.add('show');
    
    // Create love hearts animation
    createLoveHearts();

    // Haptic feedback if available
    if (navigator.vibrate) {
        navigator.vibrate([200, 100, 200]);
    }

    // Hide button after reveal
    setTimeout(() => {
        document.querySelector('.love-button').style.opacity = '0.5';
        document.querySelector('.love-button').disabled = true;
        document.querySelector('.love-button').textContent = 'I love you more 🤍';
    }, 800);
}

// ============ SMOOTH SCROLL ENHANCEMENT ============

document.addEventListener('DOMContentLoaded', async () => {
    // Preload all images first
    await preloadAllImages();
    
    // Hide loading indicator
    const loadingIndicator = document.getElementById('loadingIndicator');
    if (loadingIndicator) {
        loadingIndicator.classList.add('hidden');
        setTimeout(() => {
            loadingIndicator.style.display = 'none';
        }, 500);
    }
    
    // Setup scroll progress bar
    setupScrollProgress();
    
    observeScrollRoll();

    // Parallax effect for hero
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const hero = document.querySelector('.hero-content');
        
        if (scrollY < window.innerHeight) {
            hero.style.transform = `translateY(${scrollY * 0.3}px)`;
            hero.style.opacity = 1 - (scrollY / window.innerHeight) * 0.5;
        }
    }, { passive: true });
});

// ============ MUSIC TOGGLE ============

// ============ SCROLL PROGRESS BAR ============

function setupScrollProgress() {
    const progressBar = document.getElementById('progressBar');

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrolled + '%';
    }, { passive: true });
}

// ============ PRELOAD IMAGES ============

function preloadImages() {
    const images = document.querySelectorAll('.moment-image img');
    
    images.forEach(img => {
        const source = img.src;
        const imageLoader = new Image();
        imageLoader.src = source;
    });
}

// Preload on page load
window.addEventListener('load', preloadImages);

// ============ TOUCH OPTIMIZATION ============

document.addEventListener('touchstart', () => {
    // Enable GPU acceleration on touch devices
    document.body.style.webkitTransformZ = 'translateZ(0)';
}, { passive: true });

// ============ PERFORMANCE OPTIMIZATION ============

let ticking = false;

function updateScroll() {
    const scrollY = window.scrollY;
    
    timelineElements.forEach(element => {
        const rect = element.getBoundingClientRect();
        const isInViewport = (rect.top > -window.innerHeight * 0.3) && 
                             (rect.bottom < window.innerHeight * 1.3);
        
        if (isInViewport) {
            element.style.willChange = 'transform, opacity';
        } else {
            element.style.willChange = 'auto';
        }
    });
    
    ticking = false;
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(updateScroll);
        ticking = true;
    }
}, { passive: true });

// ============ CREATE HERO FLOATING HEARTS ============
function createHeroHearts() {
    const heroHearts = document.getElementById('heroHearts');
    if (!heroHearts) return;
    
    function addHeartBurst() {
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const heart = document.createElement('div');
                heart.className = 'hero-heart';
                heart.textContent = '💕';
                heart.style.left = Math.random() * 100 + '%';
                heart.style.animationDelay = Math.random() * 2 + 's';
                heart.style.animationDuration = (3 + Math.random() * 2) + 's';
                heroHearts.appendChild(heart);
                
                // Remove after animation
                setTimeout(() => heart.remove(), 6000);
            }, i * 800);
        }
    }
    
    // Initial burst
    addHeartBurst();
    
    // Repeat every 6 seconds
    setInterval(addHeartBurst, 6000);
}

// Initialize hero hearts when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    createHeroHearts();
});
