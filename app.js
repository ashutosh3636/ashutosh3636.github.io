// Portfolio JavaScript functionality with Slideshow and Nested Sections

document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    initSmoothScrolling();
    
    // Initialize form handling
    initContactForm();
    
    // Initialize navbar highlighting
    initNavbarHighlight();
    
    // Initialize timeline and project toggles
    initToggleHandlers();
    
    // Initialize slideshows
    initSlideshows();
});

// Slideshow functionality
let slideshowStates = {};

function initSlideshows() {
    const slideshows = document.querySelectorAll('.slideshow');
    
    slideshows.forEach(slideshow => {
        const slideshowId = slideshow.getAttribute('data-slideshow');
        if (slideshowId) {
            slideshowStates[slideshowId] = {
                currentSlide: 0,
                slides: slideshow.querySelectorAll('.slide'),
                dots: slideshow.parentElement.querySelectorAll('.dot'),
                autoPlayInterval: null,
                isPaused: false
            };
            
            // Add hover pause functionality
            const container = slideshow.closest('.slideshow-container');
            if (container) {
                container.addEventListener('mouseenter', () => pauseAutoPlay(slideshowId));
                container.addEventListener('mouseleave', () => resumeAutoPlay(slideshowId));
            }
            
            // Add touch/swipe support
            addTouchSupport(slideshow, slideshowId);
            
            // Start autoplay
            startAutoPlay(slideshowId);
        }
    });
}

function changeSlide(slideshowId, direction) {
    const state = slideshowStates[slideshowId];
    if (!state) return;
    
    const { slides, dots } = state;
    const totalSlides = slides.length;
    
    // Update current slide index
    state.currentSlide += direction;
    
    // Handle wrap around
    if (state.currentSlide >= totalSlides) {
        state.currentSlide = 0;
    } else if (state.currentSlide < 0) {
        state.currentSlide = totalSlides - 1;
    }
    
    updateSlideDisplay(slideshowId);
    
    // Reset autoplay timer
    resetAutoPlay(slideshowId);
}

function currentSlide(slideshowId, slideNumber) {
    const state = slideshowStates[slideshowId];
    if (!state) return;
    
    state.currentSlide = slideNumber - 1; // Convert to 0-based index
    updateSlideDisplay(slideshowId);
    
    // Reset autoplay timer
    resetAutoPlay(slideshowId);
}

function updateSlideDisplay(slideshowId) {
    const state = slideshowStates[slideshowId];
    if (!state) return;
    
    const { slides, dots, currentSlide } = state;
    
    // Update slides
    slides.forEach((slide, index) => {
        slide.classList.toggle('active', index === currentSlide);
    });
    
    // Update dots
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
}

function startAutoPlay(slideshowId) {
    const state = slideshowStates[slideshowId];
    if (!state || state.isPaused) return;
    
    state.autoPlayInterval = setInterval(() => {
        if (!state.isPaused) {
            changeSlide(slideshowId, 1);
        }
    }, 4000); // Change slide every 4 seconds
}

function stopAutoPlay(slideshowId) {
    const state = slideshowStates[slideshowId];
    if (!state) return;
    
    if (state.autoPlayInterval) {
        clearInterval(state.autoPlayInterval);
        state.autoPlayInterval = null;
    }
}

function pauseAutoPlay(slideshowId) {
    const state = slideshowStates[slideshowId];
    if (!state) return;
    
    state.isPaused = true;
    stopAutoPlay(slideshowId);
}

function resumeAutoPlay(slideshowId) {
    const state = slideshowStates[slideshowId];
    if (!state) return;
    
    state.isPaused = false;
    startAutoPlay(slideshowId);
}

function resetAutoPlay(slideshowId) {
    stopAutoPlay(slideshowId);
    setTimeout(() => startAutoPlay(slideshowId), 1000); // Resume after 1 second
}

// Touch/Swipe support for mobile
function addTouchSupport(slideshow, slideshowId) {
    let touchStartX = 0;
    let touchEndX = 0;
    let touchStartY = 0;
    let touchEndY = 0;
    
    slideshow.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    }, { passive: true });
    
    slideshow.addEventListener('touchmove', (e) => {
        // Prevent default only if it's a horizontal swipe
        const touchCurrentX = e.touches[0].clientX;
        const touchCurrentY = e.touches[0].clientY;
        const deltaX = Math.abs(touchCurrentX - touchStartX);
        const deltaY = Math.abs(touchCurrentY - touchStartY);
        
        if (deltaX > deltaY) {
            e.preventDefault();
        }
    }, { passive: false });
    
    slideshow.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].clientX;
        touchEndY = e.changedTouches[0].clientY;
        handleSwipe(slideshowId);
    }, { passive: true });
    
    function handleSwipe(slideshowId) {
        const deltaX = touchEndX - touchStartX;
        const deltaY = Math.abs(touchEndY - touchStartY);
        const minSwipeDistance = 50;
        
        // Only handle horizontal swipes
        if (Math.abs(deltaX) > minSwipeDistance && Math.abs(deltaX) > deltaY) {
            if (deltaX > 0) {
                // Swipe right - previous slide
                changeSlide(slideshowId, -1);
            } else {
                // Swipe left - next slide
                changeSlide(slideshowId, 1);
            }
        }
    }
}

// Initialize toggle handlers for timeline and projects
function initToggleHandlers() {
    // Timeline toggle handlers - keep existing onclick handlers working
    // No additional event listeners needed since HTML has onclick handlers
    
    // Project toggle handlers - remove conflicting event listeners
    // The onclick handlers in HTML will handle this
}

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
    
    // Close all other experience details and stop their slideshows
    allDetails.forEach(detail => {
        if (detail.id !== expId && detail.classList.contains('show')) {
            detail.classList.remove('show');
            
            // Close any nested sections in closed experience
            const nestedSections = detail.querySelectorAll('.nested-details.show');
            nestedSections.forEach(nested => {
                nested.classList.remove('show');
                const icon = nested.previousElementSibling?.querySelector('.nested-icon');
                if (icon) {
                    icon.textContent = '+';
                    icon.classList.remove('expanded');
                }
            });
            
            // Stop slideshows in closed sections
            const slideshows = detail.querySelectorAll('.slideshow');
            slideshows.forEach(slideshow => {
                const slideshowId = slideshow.getAttribute('data-slideshow');
                if (slideshowId) {
                    stopAutoPlay(slideshowId);
                }
            });
        }
    });
    
    // Toggle current experience details
    const isOpening = !details.classList.contains('show');
    details.classList.toggle('show');
    
    if (isOpening) {
        // Start slideshows in opened section
        const slideshows = details.querySelectorAll('.slideshow');
        slideshows.forEach(slideshow => {
            const slideshowId = slideshow.getAttribute('data-slideshow');
            if (slideshowId && slideshowStates[slideshowId]) {
                // Reset to first slide
                slideshowStates[slideshowId].currentSlide = 0;
                updateSlideDisplay(slideshowId);
                startAutoPlay(slideshowId);
            }
        });
        
        // Smooth scroll to the expanded item
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
    } else {
        // Close all nested sections when main section closes
        const nestedSections = details.querySelectorAll('.nested-details.show');
        nestedSections.forEach(nested => {
            nested.classList.remove('show');
            const icon = nested.previousElementSibling?.querySelector('.nested-icon');
            if (icon) {
                icon.textContent = '+';
                icon.classList.remove('expanded');
            }
        });
        
        // Stop slideshows in closed section
        const slideshows = details.querySelectorAll('.slideshow');
        slideshows.forEach(slideshow => {
            const slideshowId = slideshow.getAttribute('data-slideshow');
            if (slideshowId) {
                stopAutoPlay(slideshowId);
            }
        });
    }
}

// Toggle nested sections within work experience
function toggleNestedSection(nestedId) {
    const nestedDetails = document.getElementById(nestedId);
    
    if (!nestedDetails) {
        console.error(`Nested section not found for ID: ${nestedId}`);
        return;
    }
    
    const nestedHeader = nestedDetails.previousElementSibling;
    const icon = nestedHeader?.querySelector('.nested-icon');
    
    // Toggle nested section
    const isOpening = !nestedDetails.classList.contains('show');
    nestedDetails.classList.toggle('show');
    
    // Update icon
    if (icon) {
        if (isOpening) {
            icon.textContent = '−';
            icon.classList.add('expanded');
            // Set aria attribute for accessibility
            nestedHeader.setAttribute('aria-expanded', 'true');
        } else {
            icon.textContent = '+';
            icon.classList.remove('expanded');
            nestedHeader.setAttribute('aria-expanded', 'false');
        }
    }
    
    // Smooth scroll to nested section if opening
    if (isOpening) {
        setTimeout(() => {
            const offsetTop = nestedHeader.offsetTop - 120;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }, 100);
    }
}

// Toggle project details - updated for new design with slideshow
function toggleProject(projectId) {
    const details = document.getElementById(projectId);
    
    if (!details) {
        console.error(`Project details not found for ID: ${projectId}`);
        return;
    }
    
    const projectCard = details.closest('.project-card');
    const expandBtn = projectCard ? projectCard.querySelector('.expand-btn') : null;
    
    // Toggle project details
    const isOpening = !details.classList.contains('show');
    details.classList.toggle('show');
    
    // Update expand button text
    if (details.classList.contains('show')) {
        if (expandBtn) expandBtn.textContent = 'Click to Collapse';
        
        // Start slideshows in opened project
        const slideshows = details.querySelectorAll('.slideshow');
        slideshows.forEach(slideshow => {
            const slideshowId = slideshow.getAttribute('data-slideshow');
            if (slideshowId && slideshowStates[slideshowId]) {
                // Reset to first slide
                slideshowStates[slideshowId].currentSlide = 0;
                updateSlideDisplay(slideshowId);
                startAutoPlay(slideshowId);
            }
        });
        
        // Smooth scroll to the expanded project
        setTimeout(() => {
            if (projectCard) {
                const offsetTop = projectCard.offsetTop - 100;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        }, 100);
    } else {
        if (expandBtn) expandBtn.textContent = 'Click to Expand';
        
        // Stop slideshows in closed project
        const slideshows = details.querySelectorAll('.slideshow');
        slideshows.forEach(slideshow => {
            const slideshowId = slideshow.getAttribute('data-slideshow');
            if (slideshowId) {
                stopAutoPlay(slideshowId);
            }
        });
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

// Notification system (updated for dark theme)
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
    
    // Add notification styles (updated for dark theme)
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        max-width: 400px;
        padding: 1rem;
        border-radius: 8px;
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.5);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        font-family: "Times New Roman", Times, serif;
        border: 1px solid;
    `;
    
    // Set colors based on type (dark theme colors)
    if (type === 'success') {
        notification.style.backgroundColor = '#1e293b';
        notification.style.color = '#10b981';
        notification.style.borderColor = '#10b981';
    } else if (type === 'error') {
        notification.style.backgroundColor = '#1e293b';
        notification.style.color = '#ef4444';
        notification.style.borderColor = '#ef4444';
    } else {
        notification.style.backgroundColor = '#1e293b';
        notification.style.color = '#3b82f6';
        notification.style.borderColor = '#3b82f6';
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
        transition: opacity 0.3s ease;
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

// Navbar active link highlighting (updated for dark theme and new awards section)
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
            link.style.fontWeight = '';
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.style.color = '#3b82f6'; // Blue accent for active link
                link.style.fontWeight = '600';
            } else {
                link.style.color = '#e2e8f0'; // Light gray for inactive links
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

// Add loading animation for better UX
window.addEventListener('load', function() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    requestAnimationFrame(() => {
        document.body.style.opacity = '1';
    });
});

// Keyboard accessibility
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        // Close any open project details and stop their slideshows
        const openDetails = document.querySelectorAll('.project-details.show, .timeline-details.show');
        openDetails.forEach(detail => {
            detail.classList.remove('show');
            
            // Reset expand button text for projects
            const projectCard = detail.closest('.project-card');
            const expandBtn = projectCard ? projectCard.querySelector('.expand-btn') : null;
            if (expandBtn) {
                expandBtn.textContent = 'Click to Expand';
            }
            
            // Close nested sections
            const nestedSections = detail.querySelectorAll('.nested-details.show');
            nestedSections.forEach(nested => {
                nested.classList.remove('show');
                const icon = nested.previousElementSibling?.querySelector('.nested-icon');
                if (icon) {
                    icon.textContent = '+';
                    icon.classList.remove('expanded');
                }
            });
            
            // Stop slideshows
            const slideshows = detail.querySelectorAll('.slideshow');
            slideshows.forEach(slideshow => {
                const slideshowId = slideshow.getAttribute('data-slideshow');
                if (slideshowId) {
                    stopAutoPlay(slideshowId);
                }
            });
        });
        
        // Close notifications
        const notifications = document.querySelectorAll('.notification');
        notifications.forEach(notification => {
            if (notification.parentNode) {
                notification.remove();
            }
        });
    }
    
    // Keyboard navigation for slideshows
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        const activeSlideshow = document.querySelector('.timeline-details.show .slideshow, .project-details.show .slideshow');
        if (activeSlideshow) {
            const slideshowId = activeSlideshow.getAttribute('data-slideshow');
            if (slideshowId) {
                const direction = e.key === 'ArrowLeft' ? -1 : 1;
                changeSlide(slideshowId, direction);
                e.preventDefault();
            }
        }
    }
});

// Add hover effects for interactive elements
document.addEventListener('DOMContentLoaded', function() {
    // Add hover effects to timeline items
    const timelineItems = document.querySelectorAll('.timeline-content');
    timelineItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(5px)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
        });
    });
    
    // Add subtle glow effect to active elements
    const interactiveElements = document.querySelectorAll('.timeline-header, .expand-btn, .nested-header');
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.filter = 'brightness(1.1)';
            this.style.transition = 'filter 0.3s ease';
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.filter = 'brightness(1)';
        });
    });
    
    // Add hover effects to award items
    const awardItems = document.querySelectorAll('.award-item');
    awardItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.filter = 'brightness(1.05)';
            this.style.transition = 'all 0.3s ease';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.filter = 'brightness(1)';
        });
    });
    
    // Add hover effects to award categories
    const awardCategories = document.querySelectorAll('.award-category');
    awardCategories.forEach(category => {
        category.addEventListener('mouseenter', function() {
            this.style.filter = 'brightness(1.02)';
            this.style.transition = 'all 0.3s ease';
        });
        
        category.addEventListener('mouseleave', function() {
            this.style.filter = 'brightness(1)';
        });
    });
});

// Intersection Observer for scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.project-card, .award-category, .timeline-item');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        observer.observe(el);
    });
    
    // Add animation keyframes
    if (!document.querySelector('#scroll-animations')) {
        const styleSheet = document.createElement('style');
        styleSheet.id = 'scroll-animations';
        styleSheet.textContent = `
            @keyframes fadeInUp {
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
        document.head.appendChild(styleSheet);
    }
}

// Initialize scroll animations after page load
window.addEventListener('load', function() {
    setTimeout(() => {
        initScrollAnimations();
    }, 500);
});

// Cleanup function to stop all slideshows when page is unloaded
window.addEventListener('beforeunload', function() {
    Object.keys(slideshowStates).forEach(slideshowId => {
        stopAutoPlay(slideshowId);
    });
});

// Make functions globally available (keeping for onclick handlers in HTML)
window.toggleExperience = toggleExperience;
window.toggleProject = toggleProject;
window.toggleNestedSection = toggleNestedSection;
window.changeSlide = changeSlide;
window.currentSlide = currentSlide;