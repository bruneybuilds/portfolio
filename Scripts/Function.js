// Function.js - Smooth animations and form handling

document.addEventListener('DOMContentLoaded', function() {
    // Cache DOM elements
    const themeToggle = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;
    const flipCard = document.querySelector('.flip-card');
    const flipButton = document.querySelector('.flip-button');
    const flipBackButton = document.querySelector('.flip-back');
    const form = document.querySelector('.contact-form');
    const yearSpan = document.getElementById('current-year');
    
    // Update copyright year
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // Theme handling
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
    
    themeToggle?.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
    });
    
    function setTheme(theme) {
        htmlElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        themeToggle.textContent = theme === 'dark' ? '🌙' : '☀️';
        themeToggle.setAttribute('aria-label', `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`);
    }

    // Modal/Flip card handling
    if (flipCard && flipButton && flipBackButton) {
        const toggleFlip = (show) => {
            flipCard.classList.toggle('flipped', show); // Use only the flipped class for animation
            if (!show) {
                // Reset form when closing
                form?.reset();
                const formStatus = form?.querySelector('.form-status');
                if (formStatus) formStatus.textContent = '';
            }
        };

        flipButton.addEventListener('click', () => toggleFlip(true));
        flipBackButton.addEventListener('click', () => toggleFlip(false));

        // Close modal on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') toggleFlip(false);
        });
    }

    // Smooth scrolling with performance optimization
    const smoothScroll = (e) => {
        e.preventDefault();
        const target = document.querySelector(e.currentTarget.getAttribute('href'));
        if (target) {
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    };

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', smoothScroll);
    });

    // Form handling with improved error handling and validation
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            const formStatus = form.querySelector('.form-status');
            const submitButton = form.querySelector('button[type="submit"]');
            
            try {
                submitButton.disabled = true;
                const formData = new FormData(form);
                const object = Object.fromEntries(formData);
                
                const response = await fetch(form.action, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(object)
                });

                const result = await response.json();
                
                if (response.ok) {
                    formStatus.textContent = 'Message sent successfully!';
                    formStatus.style.color = 'var(--success-color)';
                    form.reset();
                    toggleFlip(false); // Reset the flip card after successful submission
                } else {
                    throw new Error(result.message || 'Something went wrong');
                }
            } catch (error) {
                formStatus.textContent = error.message;
                formStatus.style.color = 'var(--error-color)';
            } finally {
                submitButton.disabled = false;
            }
        });
    }

    // Slide Bar Navigation
    const sections = [
        document.querySelector('#main'),
        document.querySelector('#projects'),
        document.querySelector('#contact')
    ];
    const dots = document.querySelectorAll('.slide-bar .dot');

    const activateDot = (index) => {
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    };

    const handleScroll = () => {
        let currentIndex = 0;
        sections.forEach((section, index) => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
                currentIndex = index;
            }
        });
        activateDot(currentIndex);
    };

    dots.forEach((dot, index) => {
        dot.addEventListener('click', (e) => {
            e.preventDefault();
            sections[index].scrollIntoView({ behavior: 'smooth' });
        });
    });

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initialize on page load
});