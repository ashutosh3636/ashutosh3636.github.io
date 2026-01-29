document.addEventListener('DOMContentLoaded', () => {
    
    // Smooth Scroll for Navigation Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Intersection Observer for Scroll Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.fade-in, .fade-in-up, .fade-in-left');
    animatedElements.forEach(el => observer.observe(el));

    // Custom Cursor Glow Effect
    const cursor = document.querySelector('.cursor-glow');
    
    document.addEventListener('mousemove', (e) => {
        const x = e.clientX;
        const y = e.clientY;
        
        // Simple follow effect
        cursor.style.left = `${x}px`;
        cursor.style.top = `${y}px`;
    });

    // Mobile Menu Toggle (Simple placeholder for now if we add mobile menu UI)
    const hamburger = document.querySelector('.hamburger');
    if(hamburger) {
        hamburger.addEventListener('click', () => {
             // Logic to toggle mobile menu would go here
             // For now just logging
             console.log('Mobile menu clicked');
        });
    }
});
