// Portfolio JavaScript functionality

document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    initSmoothScrolling();
    
    // Initialize form handling
    initContactForm();
    
    // Initialize navbar highlighting
    initNavbarHighlight();
    
    // Initialize loading animation
    initLoadingAnimation();
});

// Smooth scrolling navigation
function initSmoothScrolling() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Toggle work experience details
function toggleExperience(expId) {
    const details = document.getElementById(expId);
    
    if (!details) {
        console.error(`Experience details not found for ID: ${expId}`);
        return;
    }
    
    const allDetails = document.querySelectorAll('.timeline-details');
    
    // Close all other experience details
    allDetails.forEach(detail => {
        if (detail.id !== expId) {
            detail.classList.remove('show');
        }
    });
    
    // Toggle current experience details
    details.classList.toggle('show');
    
    // Smooth scroll to the expanded item if opening
    if (details.classList.contains('show')) {
        setTimeout(() => {
            const timelineItem = details.closest('.timeline-item');
            if (timelineItem) {
                const offsetTop = timelineItem.offsetTop - 100;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        }, 100);
    }
}

// Toggle project details
function toggleProject(projectId) {
    const details = document.getElementById(projectId);
    
    if (!details) {
        console.error(`Project details not found for ID: ${projectId}`);
        return;
    }
    
    const expandBtn = details.parentNode.querySelector('.expand-btn');
    
    // Toggle project details
    details.classList.toggle('show');
    
    // Update expand button text
    if (details.classList.contains('show')) {
        if (expandBtn) expandBtn.textContent = 'Click to collapse';
        
        // Smooth scroll to the expanded project
        setTimeout(() => {
            const projectCard = details.closest('.project-card');
            if (projectCard) {
                const offsetTop = projectCard.offsetTop - 100;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        }, 100);
    } else {
        if (expandBtn) expandBtn.textContent = 'Click to expand';
    }
}

// Contact form handling
function initContactForm() {
    const contactForm = document.querySelector('.contact-form form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const nameInput = this.querySelector('input[placeholder="Your Name"]');
            const emailInput = this.querySelector('input[placeholder="Your Email"]');
            const subjectInput = this.querySelector('input[placeholder="Subject"]');
            const messageInput = this.querySelector('textarea[placeholder="Your Message"]');
            
            const name = nameInput ? nameInput.value.trim() : '';
            const email = emailInput ? emailInput.value.trim() : '';
            const subject = subjectInput ? subjectInput.value.trim() : '';
            const message = messageInput ? messageInput.value.trim() : '';
            
            // Basic validation
            if (!name || !email || !subject || !message) {
                showNotification('Please fill in all fields.', 'error');
                return;
            }
            
            if (!isValidEmail(email)) {
                showNotification('Please enter a valid email address.', 'error');
                return;
            }
            
            // Simulate form submission
            const submitBtn = this.querySelector('.btn');
            const originalText = submitBtn ? submitBtn.textContent : 'Send Message';
            
            if (submitBtn) {
                submitBtn.textContent = 'Sending...';
                submitBtn.disabled = true;
            }
            
            // Simulate API call
            setTimeout(() => {
                showNotification('Message sent successfully! I will get back to you soon.', 'success');
                this.reset();
                
                if (submitBtn) {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }
            }, 1500);
        });
    }
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => {
        if (notification.parentNode) {
            notification.remove();
        }
    });
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification--${type}`;
    
    // Create notification content
    const notificationContent = document.createElement('div');
    notificationContent.className = 'notification-content';
    
    const messageSpan = document.createElement('span');
    messageSpan.className = 'notification-message';
    messageSpan.textContent = message;
    
    const closeBtn = document.createElement('button');
    closeBtn.className = 'notification-close';
    closeBtn.innerHTML = '×';
    closeBtn.onclick = function() {
        if (notification.parentNode) {
            notification.remove();
        }
    };
    
    notificationContent.appendChild(messageSpan);
    notificationContent.appendChild(closeBtn);
    notification.appendChild(notificationContent);
    
    // Add notification styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        max-width: 400px;
        padding: 1rem;
        border-radius: 8px;
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        font-family: "Times New Roman", Times, serif;
    `;
    
    // Set colors based on type
    if (type === 'success') {
        notification.style.backgroundColor = '#1f2937';
        notification.style.color = '#10b981';
        notification.style.border = '1px solid #10b981';
    } else if (type === 'error') {
        notification.style.backgroundColor = '#1f2937';
        notification.style.color = '#ef4444';
        notification.style.border = '1px solid #ef4444';
    } else {
        notification.style.backgroundColor = '#1f2937';
        notification.style.color = '#3b82f6';
        notification.style.border = '1px solid #3b82f6';
    }
    
    // Style notification content
    notificationContent.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 1rem;
    `;
    
    // Style close button
    closeBtn.style.cssText = `
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        color: inherit;
        opacity: 0.7;
        padding: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    
    closeBtn.addEventListener('mouseover', function() {
        this.style.opacity = '1';
    });
    
    closeBtn.addEventListener('mouseout', function() {
        this.style.opacity = '0.7';
    });
    
    // Add animation keyframes if not already present
    if (!document.querySelector('#notification-styles')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'notification-styles';
        styleSheet.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes slideOutRight {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(100%);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(styleSheet);
    }
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }
    }, 5000);
}

// Navbar active link highlighting
function initNavbarHighlight() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    function highlightNavLink() {
        let currentSection = '';
        const scrollPos = window.scrollY + 100; // Account for fixed navbar
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.style.color = '';
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.style.color = '#3b82f6';
                link.style.fontWeight = '600';
            } else {
                link.style.fontWeight = '500';
            }
        });
    }
    
    // Throttled scroll listener
    let ticking = false;
    window.addEventListener('scroll', function() {
        if (!ticking) {
            requestAnimationFrame(() => {
                highlightNavLink();
                ticking = false;
            });
            ticking = true;
        }
    });
    
    // Initial highlight
    highlightNavLink();
}

// Loading animation
function initLoadingAnimation() {
    document.body.classList.add('loading');
    
    window.addEventListener('load', function() {
        setTimeout(() => {
            document.body.classList.remove('loading');
            document.body.classList.add('loaded');
        }, 100);
    });
}

// Keyboard accessibility
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        // Close any open project details
        const openDetails = document.querySelectorAll('.project-details.show, .timeline-details.show');
        openDetails.forEach(detail => {
            detail.classList.remove('show');
            
            // Reset expand button text for projects
            const expandBtn = detail.parentNode.querySelector('.expand-btn');
            if (expandBtn) {
                expandBtn.textContent = 'Click to expand';
            }
        });
        
        // Close notifications
        const notifications = document.querySelectorAll('.notification');
        notifications.forEach(notification => {
            if (notification.parentNode) {
                notification.remove();
            }
        });
    }
});

// Make functions globally available for onclick handlers in HTML
window.toggleExperience = toggleExperience;
window.toggleProject = toggleProject;