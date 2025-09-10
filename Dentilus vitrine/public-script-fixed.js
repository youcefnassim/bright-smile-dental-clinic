// Public Script for Bright Smile Dental Clinic - Backend Integration
document.addEventListener('DOMContentLoaded', function() {
    // Initialize API client
    if (typeof window.apiConfig !== 'undefined') {
        window.apiClient = new ApiClient();
    }

    // Header scroll effect
    const header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 100) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            
            const icon = this.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.className = 'fas fa-times';
            } else {
                icon.className = 'fas fa-bars';
            }
        });
        
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                mobileMenuToggle.querySelector('i').className = 'fas fa-bars';
            });
        });
    }

    // Access dropdown toggle
    const accessDropdown = document.querySelector('.access-dropdown');
    const accessToggle = document.querySelector('.access-toggle');
    
    if (accessToggle && accessDropdown) {
        accessToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            accessDropdown.classList.toggle('active');
        });
        
        document.addEventListener('click', function(e) {
            if (!accessDropdown.contains(e.target)) {
                accessDropdown.classList.remove('active');
            }
        });
    }

    // Authentication forms
    initializeAuthForms();
    
    // Gallery functionality
    initializeGallery();
    
    // Smooth scrolling
    initializeSmoothScrolling();
    
    // Form validation
    initializeFormValidation();
    
    // Check authentication status
    checkAuthStatus();
});

// Authentication form handlers
function initializeAuthForms() {
    // Patient login form
    const loginForm = document.querySelector('.patient-login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            
            const submitBtn = this.querySelector('.auth-btn');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Connexion...';
            submitBtn.disabled = true;
            
            try {
                const response = await window.apiClient.login(email, password);
                
                if (response.success) {
                    showNotification('Connexion réussie ! Redirection vers votre espace...', 'success');
                    
                    setTimeout(() => {
                        window.location.href = 'patient-dashboard.html';
                    }, 1000);
                } else {
                    throw new Error(response.message || 'Email ou mot de passe incorrect');
                }
            } catch (error) {
                showNotification(error.message || 'Erreur de connexion', 'error');
            } finally {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }
    
    // Patient registration form
    const registerForm = document.querySelector('.patient-register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const password = document.getElementById('register-password').value;
            const confirmPassword = document.getElementById('register-confirm-password').value;
            
            if (password !== confirmPassword) {
                showNotification('Les mots de passe ne correspondent pas.', 'error');
                return;
            }
            
            const submitBtn = this.querySelector('.auth-btn');
            const originalText = submitBtn.innerHTML;
            
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Création du compte...';
            submitBtn.disabled = true;
            
            const firstname = document.getElementById('register-firstname').value;
            const lastname = document.getElementById('register-lastname').value;
            const email = document.getElementById('register-email').value;
            const phone = document.getElementById('register-phone')?.value || '';
            
            try {
                const response = await window.apiClient.register({
                    firstname,
                    lastname,
                    email,
                    phone,
                    password,
                    password_confirmation: confirmPassword,
                    role: 'patient'
                });
                
                if (response.success) {
                    showNotification('Compte créé avec succès ! Redirection vers votre espace...', 'success');
                    
                    setTimeout(() => {
                        window.location.href = 'patient-dashboard.html';
                    }, 1000);
                } else {
                    throw new Error(response.message || 'Erreur lors de la création du compte');
                }
            } catch (error) {
                showNotification(error.message || 'Erreur lors de la création du compte', 'error');
            } finally {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }
}

// Tab switching for auth forms
function showTab(tabName) {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const loginTab = document.querySelector('[onclick="showTab(\'login\')"]');
    const registerTab = document.querySelector('[onclick="showTab(\'register\')"]');
    
    if (tabName === 'login') {
        loginForm.classList.add('active');
        registerForm.classList.remove('active');
        loginTab.classList.add('active');
        registerTab.classList.remove('active');
    } else {
        registerForm.classList.add('active');
        loginForm.classList.remove('active');
        registerTab.classList.add('active');
        loginTab.classList.remove('active');
    }
}

// Gallery functionality
function initializeGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item img');
    galleryItems.forEach(img => {
        img.addEventListener('click', function() {
            openImageModal(this.src, this.alt);
        });
    });
}

function openImageModal(src, alt) {
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <img src="${src}" alt="${alt}">
            <p>${alt}</p>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    const closeBtn = modal.querySelector('.close-modal');
    closeBtn.addEventListener('click', () => modal.remove());
    
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Smooth scrolling
function initializeSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Form validation
function initializeFormValidation() {
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(this);
            });
        });
    });
}

function validateField(field) {
    const value = field.value.trim();
    const type = field.type;
    const required = field.hasAttribute('required');
    
    field.classList.remove('error', 'success');
    
    if (required && !value) {
        field.classList.add('error');
        return false;
    }
    
    if (type === 'email' && value && !isValidEmail(value)) {
        field.classList.add('error');
        return false;
    }
    
    if (type === 'tel' && value && !isValidPhone(value)) {
        field.classList.add('error');
        return false;
    }
    
    field.classList.add('success');
    return true;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
}

// Check authentication status
function checkAuthStatus() {
    if (window.apiClient && window.apiClient.isAuthenticated() && window.location.pathname.includes('index-public.html')) {
        const user = window.apiClient.getCurrentUser();
        if (user && user.role === 'patient') {
            window.location.href = 'patient-dashboard.html';
        } else if (user && (user.role === 'doctor' || user.role === 'admin')) {
            window.location.href = 'Espace medecin/espace-medecin.html';
        }
    }
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
        <span>${message}</span>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    if (!document.querySelector('#notification-styles')) {
        const styles = document.createElement('style');
        styles.id = 'notification-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                padding: 15px 20px;
                border-radius: 8px;
                box-shadow: 0 5px 15px rgba(0,0,0,0.1);
                display: flex;
                align-items: center;
                gap: 10px;
                z-index: 10000;
                min-width: 300px;
                animation: slideInRight 0.3s ease;
            }
            
            .notification-success {
                border-left: 4px solid #10b981;
                color: #065f46;
            }
            
            .notification-error {
                border-left: 4px solid #ef4444;
                color: #7f1d1d;
            }
            
            .notification-info {
                border-left: 4px solid #3b82f6;
                color: #1e3a8a;
            }
            
            .notification-close {
                background: none;
                border: none;
                cursor: pointer;
                margin-left: auto;
                opacity: 0.7;
                transition: opacity 0.2s;
            }
            
            .notification-close:hover {
                opacity: 1;
            }
            
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
        `;
        document.head.appendChild(styles);
    }
    
    document.body.appendChild(notification);
    
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.remove();
    });
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}
