// Professional Portfolio JavaScript - Fixed Navigation
document.addEventListener('DOMContentLoaded', function() {
    initNavigation();
    initScrollAnimations();
    initImageUpload();
    initContactForm();
    initMobileMenu();
    
    // Ensure sections are properly positioned
    setupSectionLayout();
});

// Setup proper section layout
function setupSectionLayout() {
    const sections = document.querySelectorAll('section[id]');
    sections.forEach(section => {
        section.style.minHeight = 'auto';
        section.style.paddingTop = '100px'; // Account for fixed navbar
    });
}

// Navigation functionality - Fixed
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Handle scroll effects on navbar
    window.addEventListener('scroll', throttle(() => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        updateActiveNavLink();
    }, 16));
    
    // Smooth scroll for navigation links - Fixed
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const href = link.getAttribute('href');
            
            if (href && href.startsWith('#')) {
                const targetId = href.substring(1);
                const targetSection = document.getElementById(targetId);
                
                if (targetSection) {
                    const navbarHeight = navbar.offsetHeight;
                    const offsetTop = targetSection.offsetTop - navbarHeight;
                    
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                    
                    // Update active state immediately
                    navLinks.forEach(nl => nl.classList.remove('active'));
                    link.classList.add('active');
                }
            }
            
            // Close mobile menu if open
            const navMenu = document.getElementById('nav-menu');
            const navToggle = document.getElementById('nav-toggle');
            if (navMenu && navToggle) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    });
    
    // Set initial active link
    const homeLink = document.querySelector('a[href="#home"]');
    if (homeLink) {
        homeLink.classList.add('active');
    }
}

// Update active navigation link based on scroll position - Fixed
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const navbarHeight = document.querySelector('.navbar').offsetHeight;
    
    let currentSection = '';
    const scrollPos = window.scrollY + navbarHeight + 50;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href === '#' + currentSection) {
            link.classList.add('active');
        }
    });
}

// Mobile menu toggle - Fixed
function initMobileMenu() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
        
        // Close menu when clicking on a nav link
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });
    }
}

// Scroll animations - Improved
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Stagger animations for child elements
                const childElements = entry.target.querySelectorAll('.experience-item, .project-card, .card');
                childElements.forEach((element, index) => {
                    setTimeout(() => {
                        element.classList.add('fade-in', 'visible');
                    }, index * 100);
                });
            }
        });
    }, observerOptions);

    // Observe sections and animate-able elements
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.add('fade-in');
        observer.observe(section);
    });
    
    const animatedElements = document.querySelectorAll('.experience-item, .project-card, .card');
    animatedElements.forEach(element => {
        element.classList.add('fade-in');
        observer.observe(element);
    });
}

// Image upload functionality - Enhanced
function initImageUpload() {
    const uploadArea = document.getElementById('upload-area');
    const imageUpload = document.getElementById('image-upload');
    const categorySelect = document.getElementById('image-category');
    
    if (!uploadArea || !imageUpload || !categorySelect) return;
    
    // Click to upload
    uploadArea.addEventListener('click', () => {
        if (categorySelect.value === '') {
            showNotification('Please select a project category first', 'warning');
            return;
        }
        imageUpload.click();
    });
    
    // Drag and drop functionality
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });
    
    uploadArea.addEventListener('dragleave', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        
        if (categorySelect.value === '') {
            showNotification('Please select a project category first', 'warning');
            return;
        }
        
        const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
        if (files.length > 0) {
            handleImageFiles(files, categorySelect.value);
        }
    });
    
    // File input change
    imageUpload.addEventListener('change', (e) => {
        const files = Array.from(e.target.files).filter(file => file.type.startsWith('image/'));
        if (files.length > 0) {
            handleImageFiles(files, categorySelect.value);
        }
        // Reset file input
        e.target.value = '';
    });
}

// Handle uploaded image files - Enhanced
function handleImageFiles(files, category) {
    const categoryMap = {
        'robotics': 'Digital Twin Robotics',
        'uav': 'Defense UAV Development',
        'automation': 'Industrial Automation',
        'manufacturing': 'Additive Manufacturing'
    };
    
    const categoryName = categoryMap[category];
    const galleryCategories = document.querySelectorAll('.gallery-category');
    let targetCategory = null;
    
    // Find the target gallery category
    galleryCategories.forEach(cat => {
        const title = cat.querySelector('h3').textContent;
        if (title === categoryName) {
            targetCategory = cat;
        }
    });
    
    if (!targetCategory) {
        showNotification('Category not found', 'error');
        return;
    }
    
    const imageGrid = targetCategory.querySelector('.image-grid');
    let uploadedCount = 0;
    
    files.forEach((file, index) => {
        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            showNotification(`File ${file.name} is too large. Maximum size is 5MB.`, 'warning');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
            // Create new image element
            const imageContainer = document.createElement('div');
            imageContainer.className = 'image-container';
            imageContainer.innerHTML = `
                <img src="${e.target.result}" alt="Project image - ${file.name}" style="
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                    border-radius: var(--radius-base);
                    transition: transform var(--duration-normal) var(--ease-standard);
                ">
                <button class="remove-image" onclick="removeImage(this)" style="
                    position: absolute;
                    top: var(--space-8);
                    right: var(--space-8);
                    background: var(--color-error);
                    color: white;
                    border: none;
                    border-radius: 50%;
                    width: 24px;
                    height: 24px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: var(--font-size-xs);
                    opacity: 0;
                    transition: opacity var(--duration-fast) var(--ease-standard);
                    z-index: 10;
                ">×</button>
                <div class="image-info" style="
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    background: linear-gradient(transparent, rgba(0,0,0,0.7));
                    color: white;
                    padding: var(--space-8);
                    font-size: var(--font-size-xs);
                    opacity: 0;
                    transition: opacity var(--duration-fast) var(--ease-standard);
                ">${file.name}</div>
            `;
            
            imageContainer.style.cssText = `
                position: relative;
                aspect-ratio: 4/3;
                overflow: hidden;
                border-radius: var(--radius-base);
                box-shadow: var(--shadow-sm);
                transition: all var(--duration-normal) var(--ease-standard);
                cursor: pointer;
            `;
            
            // Add hover effects
            imageContainer.addEventListener('mouseenter', () => {
                const img = imageContainer.querySelector('img');
                const removeBtn = imageContainer.querySelector('.remove-image');
                const info = imageContainer.querySelector('.image-info');
                img.style.transform = 'scale(1.05)';
                removeBtn.style.opacity = '1';
                info.style.opacity = '1';
                imageContainer.style.boxShadow = 'var(--shadow-md)';
            });
            
            imageContainer.addEventListener('mouseleave', () => {
                const img = imageContainer.querySelector('img');
                const removeBtn = imageContainer.querySelector('.remove-image');
                const info = imageContainer.querySelector('.image-info');
                img.style.transform = 'scale(1)';
                removeBtn.style.opacity = '0';
                info.style.opacity = '0';
                imageContainer.style.boxShadow = 'var(--shadow-sm)';
            });
            
            // Click to view full size
            imageContainer.addEventListener('click', (e) => {
                if (!e.target.classList.contains('remove-image')) {
                    openImageModal(e.target.src || e.target.querySelector('img').src, file.name);
                }
            });
            
            // Replace placeholder if available, otherwise append
            const placeholders = imageGrid.querySelectorAll('.image-placeholder');
            if (placeholders.length > 0) {
                imageGrid.replaceChild(imageContainer, placeholders[0]);
            } else {
                imageGrid.appendChild(imageContainer);
            }
            
            // Add fade-in animation
            imageContainer.style.opacity = '0';
            imageContainer.style.transform = 'translateY(20px)';
            setTimeout(() => {
                imageContainer.style.transition = 'all 0.5s ease-out';
                imageContainer.style.opacity = '1';
                imageContainer.style.transform = 'translateY(0)';
            }, index * 100);
            
            uploadedCount++;
        };
        
        reader.onerror = () => {
            showNotification(`Error reading file ${file.name}`, 'error');
        };
        
        reader.readAsDataURL(file);
    });
    
    if (uploadedCount > 0 || files.length > 0) {
        showNotification(`Processing ${files.length} image(s) for ${categoryName}`, 'info');
    }
}

// Open image in modal
function openImageModal(src, filename) {
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        cursor: pointer;
    `;
    
    modal.innerHTML = `
        <div style="max-width: 90%; max-height: 90%; position: relative;">
            <img src="${src}" alt="${filename}" style="
                max-width: 100%;
                max-height: 100%;
                object-fit: contain;
                border-radius: var(--radius-base);
            ">
            <button onclick="this.parentElement.parentElement.remove()" style="
                position: absolute;
                top: var(--space-16);
                right: var(--space-16);
                background: var(--color-error);
                color: white;
                border: none;
                border-radius: 50%;
                width: 32px;
                height: 32px;
                cursor: pointer;
                font-size: var(--font-size-lg);
            ">×</button>
            <div style="
                position: absolute;
                bottom: var(--space-16);
                left: var(--space-16);
                right: var(--space-16);
                background: rgba(0,0,0,0.7);
                color: white;
                padding: var(--space-8);
                border-radius: var(--radius-base);
                text-align: center;
            ">${filename}</div>
        </div>
    `;
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    document.body.appendChild(modal);
}

// Remove image function
function removeImage(button) {
    const imageContainer = button.parentElement;
    imageContainer.style.transition = 'all 0.3s ease-out';
    imageContainer.style.opacity = '0';
    imageContainer.style.transform = 'scale(0.8)';
    
    setTimeout(() => {
        imageContainer.remove();
        showNotification('Image removed', 'info');
    }, 300);
}

// Contact form handling - Enhanced
function initContactForm() {
    const contactForm = document.querySelector('.contact-form');
    if (!contactForm) return;
    
    contactForm.addEventListener('submit', handleContactSubmit);
    
    // Real-time validation
    const inputs = contactForm.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => clearFieldError(input));
    });
}

// Validate individual field
function validateField(field) {
    const value = field.value.trim();
    
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, 'This field is required');
        return false;
    }
    
    if (field.type === 'email' && value && !isValidEmail(value)) {
        showFieldError(field, 'Please enter a valid email address');
        return false;
    }
    
    clearFieldError(field);
    return true;
}

// Handle contact form submission - Enhanced
function handleContactSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    
    // Validate all fields
    const isValid = validateContactForm(form);
    if (!isValid) {
        showNotification('Please fix the errors in the form', 'error');
        return;
    }
    
    // Show loading state
    submitBtn.classList.add('loading');
    submitBtn.disabled = true;
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    
    // Get form data
    const formData = {
        name: form.querySelector('#name').value,
        email: form.querySelector('#email').value,
        subject: form.querySelector('#subject').value,
        message: form.querySelector('#message').value
    };
    
    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
        // Reset form
        form.reset();
        
        // Reset button
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        
        // Show success modal
        showSuccessModal();
        
        // Show notification
        showNotification('Message sent successfully! I\'ll get back to you soon.', 'success');
        
        // Track event
        trackEvent('contact_form_submit', {
            has_subject: !!formData.subject,
            message_length: formData.message.length
        });
        
    }, 2000);
}

// Validate contact form - Enhanced
function validateContactForm(form) {
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!validateField(field)) {
            isValid = false;
        }
    });
    
    return isValid;
}

// Show field error
function showFieldError(field, message) {
    clearFieldError(field);
    
    field.style.borderColor = 'var(--color-error)';
    field.setAttribute('aria-invalid', 'true');
    
    const errorElement = document.createElement('span');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    errorElement.style.cssText = `
        color: var(--color-error);
        font-size: var(--font-size-sm);
        margin-top: var(--space-4);
        display: block;
    `;
    
    field.parentElement.appendChild(errorElement);
}

// Clear field error
function clearFieldError(field) {
    field.style.borderColor = '';
    field.removeAttribute('aria-invalid');
    const existingError = field.parentElement.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Show success modal - Enhanced
function showSuccessModal() {
    const modal = document.getElementById('success-modal');
    if (modal) {
        modal.classList.remove('hidden');
        
        // Focus trap for accessibility
        const closeBtn = modal.querySelector('.btn');
        if (closeBtn) {
            closeBtn.focus();
        }
        
        // Auto-close after 5 seconds
        setTimeout(() => {
            if (!modal.classList.contains('hidden')) {
                closeModal();
            }
        }, 5000);
    }
}

// Close modal
function closeModal() {
    const modal = document.getElementById('success-modal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

// Show notification - Enhanced
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.setAttribute('role', 'alert');
    notification.setAttribute('aria-live', 'polite');
    
    const typeColors = {
        success: 'var(--color-success)',
        error: 'var(--color-error)',
        warning: 'var(--color-warning)',
        info: 'var(--color-info)'
    };
    
    const typeIcons = {
        success: '✓',
        error: '✕',
        warning: '⚠',
        info: 'ℹ'
    };
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: var(--space-20);
        background: ${typeColors[type]};
        color: white;
        padding: var(--space-16) var(--space-20);
        border-radius: var(--radius-base);
        box-shadow: var(--shadow-lg);
        z-index: 9999;
        max-width: 400px;
        font-weight: var(--font-weight-medium);
        transform: translateX(100%);
        transition: transform var(--duration-normal) var(--ease-standard);
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: var(--space-8);
    `;
    
    notification.innerHTML = `
        <span style="font-size: var(--font-size-lg);">${typeIcons[type]}</span>
        <span>${message}</span>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 5 seconds
    const autoRemove = setTimeout(() => {
        if (notification.parentElement) {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }
    }, 5000);
    
    // Click to dismiss
    notification.addEventListener('click', () => {
        clearTimeout(autoRemove);
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
}

// Keyboard navigation - Enhanced
document.addEventListener('keydown', (e) => {
    // Close modal with Escape
    if (e.key === 'Escape') {
        closeModal();
        
        // Close image modal
        const imageModal = document.querySelector('.image-modal');
        if (imageModal) {
            imageModal.remove();
        }
        
        // Close mobile menu
        const navMenu = document.getElementById('nav-menu');
        const navToggle = document.getElementById('nav-toggle');
        if (navMenu && navToggle) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    }
    
    // Quick navigation with Alt + number keys
    if (e.altKey && e.key >= '1' && e.key <= '6') {
        e.preventDefault();
        const sections = ['home', 'about', 'experience', 'projects', 'gallery', 'contact'];
        const targetSection = sections[parseInt(e.key) - 1];
        const element = document.getElementById(targetSection);
        
        if (element) {
            const navbar = document.querySelector('.navbar');
            const offsetTop = element.offsetTop - (navbar ? navbar.offsetHeight : 80);
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    }
});

// Performance optimizations
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Handle window resize
const handleResize = debounce(() => {
    if (window.innerWidth > 768) {
        const navMenu = document.getElementById('nav-menu');
        const navToggle = document.getElementById('nav-toggle');
        if (navMenu && navToggle) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    }
}, 250);

window.addEventListener('resize', handleResize);

// Analytics helper
function trackEvent(eventName, eventData = {}) {
    console.log(`Analytics: ${eventName}`, eventData);
}

// Track important interactions
document.addEventListener('click', (e) => {
    const target = e.target;
    
    if (target.classList.contains('nav-link')) {
        trackEvent('navigation_click', {
            section: target.getAttribute('href')?.substring(1) || 'unknown'
        });
    }
    
    if (target.classList.contains('contact-item') || target.closest('.contact-item')) {
        const link = target.closest('.contact-item') || target;
        const href = link.href || '';
        trackEvent('contact_click', {
            type: href.includes('tel:') ? 'phone' : 
                  href.includes('mailto:') ? 'email' : 'social'
        });
    }
    
    if (target.closest('.project-card')) {
        const projectTitle = target.closest('.project-card').querySelector('h3')?.textContent || 'unknown';
        trackEvent('project_view', {
            project: projectTitle
        });
    }
});

console.log('Professional Portfolio initialized successfully! 🚀');
