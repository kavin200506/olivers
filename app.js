// AI Traffic Control Interactive Features

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all interactive features
    initScrollAnimations();
    initStatCounters();
    initTrafficSimulation();
    initSmoothScrolling();
    initHoverEffects();
    
    // Add loading animation
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 1s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// Smooth scrolling function
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Initialize smooth scrolling for all internal links
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            scrollToSection(targetId);
        });
    });
}

// Animated counter for statistics
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        // Format number with decimal places if needed
        if (target % 1 !== 0) {
            element.textContent = current.toFixed(2);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// Initialize stat counters with intersection observer
function initStatCounters() {
    const statNumbers = document.querySelectorAll('.stat-number');
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                const target = parseFloat(entry.target.dataset.target);
                animateCounter(entry.target, target);
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);
    
    statNumbers.forEach(stat => observer.observe(stat));
}

// Traffic simulation functionality - FIXED VERSION
function initTrafficSimulation() {
    let isAIMode = false;
    let simulationInterval;
    let lightCycle = 0;
    
    const toggleBtn = document.getElementById('toggleSimulation');
    const trafficLight = document.getElementById('trafficLight1');
    const waitingTimeEl = document.getElementById('waitingTime');
    const emissionsEl = document.getElementById('emissions');
    const systemTypeEl = document.getElementById('systemType');
    const cars = document.querySelectorAll('.car');
    
    // Ensure elements exist
    if (!toggleBtn || !trafficLight || !waitingTimeEl || !emissionsEl || !systemTypeEl) {
        console.warn('Some simulation elements not found');
        return;
    }
    
    const lights = trafficLight.querySelectorAll('.light');
    
    // Initial state - Fixed schedule
    updateSimulationDisplay();
    startSimulation();
    
    toggleBtn.addEventListener('click', function() {
        isAIMode = !isAIMode;
        updateButtonAndDisplay();
        restartSimulation();
        
        // Add button animation
        toggleBtn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            toggleBtn.style.transform = 'scale(1)';
        }, 150);
    });
    
    function updateButtonAndDisplay() {
        if (isAIMode) {
            toggleBtn.textContent = 'Switch to Fixed Schedule';
            toggleBtn.style.background = 'linear-gradient(45deg, #00ff88, #66ff99)';
        } else {
            toggleBtn.textContent = 'Switch to AI Control';
            toggleBtn.style.background = 'linear-gradient(45deg, #ff6600, #ff9933)';
        }
        updateSimulationDisplay();
    }
    
    function updateSimulationDisplay() {
        if (isAIMode) {
            waitingTimeEl.textContent = 'Low (-21.6%)';
            waitingTimeEl.style.color = '#00ff88';
            emissionsEl.textContent = 'Low (-31.73%)';
            emissionsEl.style.color = '#00ff88';
            systemTypeEl.textContent = 'AI Adaptive';
            systemTypeEl.style.color = '#00d4ff';
        } else {
            waitingTimeEl.textContent = 'High';
            waitingTimeEl.style.color = '#ff3333';
            emissionsEl.textContent = 'High';
            emissionsEl.style.color = '#ff3333';
            systemTypeEl.textContent = 'Fixed Schedule';
            systemTypeEl.style.color = '#ff9933';
        }
    }
    
    function setLight(color) {
        lights.forEach(light => light.classList.remove('active'));
        const targetLight = trafficLight.querySelector(`.light.${color}`);
        if (targetLight) {
            targetLight.classList.add('active');
        }
    }
    
    function restartSimulation() {
        clearInterval(simulationInterval);
        lightCycle = 0;
        startSimulation();
    }
    
    function startSimulation() {
        clearInterval(simulationInterval);
        
        if (isAIMode) {
            startAISimulation();
        } else {
            startFixedScheduleSimulation();
        }
    }
    
    function startFixedScheduleSimulation() {
        // Fixed schedule: Red (4s) -> Green (3s) -> Yellow (1s)
        const schedule = [
            { light: 'red', duration: 4000, carsMoving: false },
            { light: 'green', duration: 3000, carsMoving: true },
            { light: 'yellow', duration: 1000, carsMoving: false }
        ];
        
        function runCycle() {
            const currentPhase = schedule[lightCycle % schedule.length];
            setLight(currentPhase.light);
            
            if (currentPhase.carsMoving) {
                cars.forEach(car => {
                    car.style.animationPlayState = 'running';
                    car.style.animationDuration = '4s'; // Slower movement
                });
            } else {
                cars.forEach(car => {
                    car.style.animationPlayState = 'paused';
                });
            }
            
            lightCycle++;
            simulationInterval = setTimeout(runCycle, currentPhase.duration);
        }
        
        runCycle();
    }
    
    function startAISimulation() {
        // AI adaptive: Shorter red, longer green, adaptive timing
        const aiSchedule = [
            { light: 'red', duration: 2000, carsMoving: false },
            { light: 'green', duration: 5000, carsMoving: true },
            { light: 'yellow', duration: 800, carsMoving: false }
        ];
        
        function runAICycle() {
            const currentPhase = aiSchedule[lightCycle % aiSchedule.length];
            setLight(currentPhase.light);
            
            if (currentPhase.carsMoving) {
                cars.forEach(car => {
                    car.style.animationPlayState = 'running';
                    car.style.animationDuration = '2.5s'; // Faster, smoother movement
                });
            } else {
                cars.forEach(car => {
                    car.style.animationPlayState = 'paused';
                });
            }
            
            lightCycle++;
            simulationInterval = setTimeout(runAICycle, currentPhase.duration);
        }
        
        runAICycle();
    }
}

// Scroll animations
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.stat-card, .step-card, .city-card, .benefit-card, .comparison-card');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '0';
                entry.target.style.transform = 'translateY(50px)';
                entry.target.style.transition = 'all 0.6s ease';
                
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, Math.random() * 300); // Stagger animations
            }
        });
    }, observerOptions);
    
    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

// Enhanced hover effects
function initHoverEffects() {
    // Add particle effect to hero button
    const heroBtn = document.querySelector('.btn-hero');
    if (heroBtn) {
        heroBtn.addEventListener('mouseenter', createParticleEffect);
    }
    
    // Add dynamic glow to cards
    const cards = document.querySelectorAll('.stat-card, .step-card, .city-card, .benefit-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            this.style.setProperty('--mouse-x', x + 'px');
            this.style.setProperty('--mouse-y', y + 'px');
            
            // Add temporary glow effect
            const glow = document.createElement('div');
            glow.className = 'card-glow';
            glow.style.cssText = `
                position: absolute;
                width: 100px;
                height: 100px;
                background: radial-gradient(circle, rgba(0,212,255,0.3) 0%, transparent 70%);
                border-radius: 50%;
                pointer-events: none;
                left: ${x - 50}px;
                top: ${y - 50}px;
                animation: glowPulse 0.6s ease-out forwards;
            `;
            
            this.style.position = 'relative';
            this.appendChild(glow);
            
            setTimeout(() => {
                if (glow.parentNode) {
                    glow.remove();
                }
            }, 600);
        });
    });
}

// Create particle effect
function createParticleEffect(e) {
    const button = e.target;
    const rect = button.getBoundingClientRect();
    
    for (let i = 0; i < 6; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: #00d4ff;
            border-radius: 50%;
            pointer-events: none;
            left: ${rect.left + rect.width / 2}px;
            top: ${rect.top + rect.height / 2}px;
            animation: particleFloat ${0.6 + Math.random() * 0.4}s ease-out forwards;
            transform: translate(-2px, -2px);
            z-index: 1000;
        `;
        
        // Random direction
        const angle = (i / 6) * Math.PI * 2;
        const distance = 50 + Math.random() * 50;
        const endX = Math.cos(angle) * distance;
        const endY = Math.sin(angle) * distance;
        
        particle.style.setProperty('--end-x', endX + 'px');
        particle.style.setProperty('--end-y', endY + 'px');
        
        document.body.appendChild(particle);
        
        setTimeout(() => {
            if (particle.parentNode) {
                particle.remove();
            }
        }, 1000);
    }
}

// Add CSS for particle animation
const particleStyle = document.createElement('style');
particleStyle.textContent = `
    @keyframes particleFloat {
        0% {
            opacity: 1;
            transform: translate(-2px, -2px);
        }
        100% {
            opacity: 0;
            transform: translate(calc(-2px + var(--end-x)), calc(-2px + var(--end-y)));
        }
    }
    
    @keyframes glowPulse {
        0% {
            opacity: 0;
            transform: scale(0.5);
        }
        50% {
            opacity: 1;
            transform: scale(1);
        }
        100% {
            opacity: 0;
            transform: scale(1.5);
        }
    }
`;
document.head.appendChild(particleStyle);

// Parallax scrolling effect for hero background
function initParallaxEffect() {
    const hero = document.querySelector('.hero');
    const heroBgEffect = document.querySelector('.hero-bg-effect');
    
    if (hero && heroBgEffect) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxSpeed = 0.5;
            
            if (scrolled < hero.offsetHeight) {
                heroBgEffect.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
            }
        });
    }
}

// Initialize parallax effect
initParallaxEffect();

// Add dynamic typing effect to hero title
function initTypingEffect() {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        heroTitle.textContent = '';
        
        let i = 0;
        const typeInterval = setInterval(() => {
            heroTitle.textContent += originalText.charAt(i);
            i++;
            
            if (i >= originalText.length) {
                clearInterval(typeInterval);
                // Add cursor blink effect
                heroTitle.classList.add('typing-complete');
            }
        }, 100);
    }
}

// Add CSS for typing effect
const typingStyle = document.createElement('style');
typingStyle.textContent = `
    .hero-title::after {
        content: '|';
        animation: blink 1s infinite;
    }
    
    .hero-title.typing-complete::after {
        display: none;
    }
    
    @keyframes blink {
        0%, 50% { opacity: 1; }
        51%, 100% { opacity: 0; }
    }
`;
document.head.appendChild(typingStyle);

// Enhanced button click effects
document.addEventListener('click', function(e) {
    if (e.target.matches('.glow-button, .btn-cta, .toggle-btn')) {
        const button = e.target;
        
        // Create ripple effect
        const ripple = document.createElement('div');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        `;
        
        button.style.position = 'relative';
        button.style.overflow = 'hidden';
        button.appendChild(ripple);
        
        setTimeout(() => {
            if (ripple.parentNode) {
                ripple.remove();
            }
        }, 600);
    }
});

// Add CSS for ripple effect
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// Initialize typing effect after page load
setTimeout(initTypingEffect, 1000);

// Add intersection observer for section titles
const sectionTitles = document.querySelectorAll('.section-title');
const titleObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'glow 2s ease-in-out infinite alternate';
        }
    });
}, { threshold: 0.5 });

sectionTitles.forEach(title => titleObserver.observe(title));