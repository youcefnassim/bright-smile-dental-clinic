// JavaScript pour le site vitrine public

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing scripts...');
    
    // Access dropdown toggle - FIRST PRIORITY
    const accessDropdown = document.querySelector('.access-dropdown');
    const accessToggle = document.querySelector('.access-toggle');
    
    console.log('Looking for dropdown elements...');
    console.log('Access dropdown found:', accessDropdown);
    console.log('Access toggle found:', accessToggle);
    
    if (accessToggle && accessDropdown) {
        console.log('Setting up dropdown event listeners...');
        
        accessToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Access toggle clicked!');
            accessDropdown.classList.toggle('active');
            console.log('Dropdown active class:', accessDropdown.classList.contains('active'));
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!accessDropdown.contains(e.target)) {
                accessDropdown.classList.remove('active');
            }
        });
    } else {
        console.error('Dropdown elements not found!');
    }
    
    // Wait a bit for all elements to be fully rendered
    setTimeout(function() {
        
        // Mobile Menu Toggle
        const mobileToggle = document.querySelector('.mobile-menu-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (mobileToggle && navMenu) {
            console.log('Mobile menu elements found');
            
            // Remove any existing event listeners
            mobileToggle.replaceWith(mobileToggle.cloneNode(true));
            const newMobileToggle = document.querySelector('.mobile-menu-toggle');
            
            newMobileToggle.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                console.log('Mobile toggle clicked');
                
                navMenu.classList.toggle('mobile-active');
                
                // Change hamburger icon to X when menu is open
                const icon = this.querySelector('i');
                if (navMenu.classList.contains('mobile-active')) {
                    icon.className = 'fas fa-times';
                } else {
                    icon.className = 'fas fa-bars';
                }
            });
            
            // Close mobile menu when clicking on a link
            const navLinks = navMenu.querySelectorAll('a');
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    if (navMenu.classList.contains('mobile-active')) {
                        navMenu.classList.remove('mobile-active');
                        const icon = newMobileToggle.querySelector('i');
                        icon.className = 'fas fa-bars';
                    }
                });
            });
        } else {
            console.log('Mobile menu elements not found:', {mobileToggle, navMenu});
        }
    }, 100);
});

// Gallery Slider Functionality
let currentSlideIndex = 0;
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');
const totalSlides = slides.length;

function showSlide(index) {
    // Hide all slides
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));
    
    // Show current slide
    if (slides[index]) {
        slides[index].classList.add('active');
    }
    if (dots[index]) {
        dots[index].classList.add('active');
    }
    
    // Move slider track
    const track = document.getElementById('galleryTrack');
    if (track) {
        track.style.transform = `translateX(-${index * 100}%)`;
    }
}

function changeSlide(direction) {
    currentSlideIndex += direction;
    
    if (currentSlideIndex >= totalSlides) {
        currentSlideIndex = 0;
    } else if (currentSlideIndex < 0) {
        currentSlideIndex = totalSlides - 1;
    }
    
    showSlide(currentSlideIndex);
}

function currentSlide(index) {
    currentSlideIndex = index - 1;
    showSlide(currentSlideIndex);
}

// Auto-play slider
let sliderInterval;
function startSliderAutoplay() {
    sliderInterval = setInterval(() => {
        if (totalSlides > 0) {
            changeSlide(1);
        }
    }, 5000);
}

function stopSliderAutoplay() {
    if (sliderInterval) {
        clearInterval(sliderInterval);
    }
}

// Initialize slider
document.addEventListener('DOMContentLoaded', function() {
    if (totalSlides > 0) {
        showSlide(0);
        startSliderAutoplay();
        
        // Pause autoplay on hover
        const sliderContainer = document.querySelector('.gallery-slider');
        if (sliderContainer) {
            sliderContainer.addEventListener('mouseenter', stopSliderAutoplay);
            sliderContainer.addEventListener('mouseleave', startSliderAutoplay);
        }
    }
});

// Fonction pour aller à un slide spécifique
function currentSlide(n) {
    // Retirer la classe active de l'élément actuel
    slides[currentSlideIndex].classList.remove('active');
    dots[currentSlideIndex].classList.remove('active');
    
    // Définir le nouvel index
    currentSlideIndex = n - 1;
    
    // Ajouter la classe active au nouvel élément
    slides[currentSlideIndex].classList.add('active');
    dots[currentSlideIndex].classList.add('active');
    
    // Déplacer le slider
    const track = document.getElementById('galleryTrack');
    track.style.transform = `translateX(-${currentSlideIndex * 100}%)`;
}

// Auto-play du slider (optionnel)
function autoSlide() {
    changeSlide(1);
}

// Démarrer l'auto-play toutes les 5 secondes
setInterval(autoSlide, 5000);

// Gestion de l'affichage des onglets de connexion/inscription
function showTab(tabName) {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const loginTab = document.querySelector('[onclick="showTab(\'login\')"]');
    const registerTab = document.querySelector('[onclick="showTab(\'register\')"]');
    
    // Réinitialiser tous les onglets
    if (loginForm) loginForm.classList.remove('active');
    if (registerForm) registerForm.classList.remove('active');
    if (loginTab) loginTab.classList.remove('active');
    if (registerTab) registerTab.classList.remove('active');
    
    // Activer l'onglet sélectionné
    if (tabName === 'login') {
        if (loginForm) loginForm.classList.add('active');
        if (loginTab) loginTab.classList.add('active');
    } else if (tabName === 'register') {
        if (registerForm) registerForm.classList.add('active');
        if (registerTab) registerTab.classList.add('active');
    }
}

// Gestion des formulaires d'authentification
document.addEventListener('DOMContentLoaded', function() {
    // Formulaire de connexion
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
                const response = await apiClient.login(email, password);
                
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
    
    // Formulaire d'inscription
    const registerForm = document.querySelector('.patient-register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const password = document.getElementById('register-password').value;
            const confirmPassword = document.getElementById('register-confirm-password').value;
            
            // Vérifier que les mots de passe correspondent
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
                const response = await apiClient.register({
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
});

document.addEventListener('DOMContentLoaded', function() {
    // Gestion du header au scroll
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
    
    // Gestion du menu mobile
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            
            // Changer l'icône
            const icon = this.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.className = 'fas fa-times';
            } else {
                icon.className = 'fas fa-bars';
            }
        });
        
        // Fermer le menu en cliquant sur un lien
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                mobileMenuToggle.querySelector('i').className = 'fas fa-bars';
            });
        });
    }
    
    // Initialize API client if available
    if (typeof ApiClient !== 'undefined' && typeof ApiConfig !== 'undefined') {
        window.apiClient = new ApiClient();
    }
    
    // Access dropdown toggle
    const accessDropdown = document.querySelector('.access-dropdown');
    const accessToggle = document.querySelector('.access-toggle');
    
    if (accessToggle && accessDropdown) {
        accessToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            accessDropdown.classList.toggle('active');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!accessDropdown.contains(e.target)) {
                accessDropdown.classList.remove('active');
            }
        });
    }
});

// Gestion des notifications
function showNotification(message, type = 'info') {
    // Créer l'élément notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
        <span>${message}</span>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Ajouter les styles si pas déjà présents
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
            
            .notification-error {
                border-left: 4px solid #ef4444;
                color: #7f1d1d;
            }
            
            .notification-info {
                border-left: 4px solid #3b82f6;
                color: #1e3a8a;
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
    
    // Gestion des tooltips
    const tooltipElements = document.querySelectorAll('[data-tooltip]');
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = this.dataset.tooltip;
            document.body.appendChild(tooltip);
            
            const rect = this.getBoundingClientRect();
            tooltip.style.left = rect.left + rect.width / 2 - tooltip.offsetWidth / 2 + 'px';
            tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
        });
        
        element.addEventListener('mouseleave', function() {
            const tooltip = document.querySelector('.tooltip');
            if (tooltip) {
                tooltip.remove();
            }
        });
    });
    
    // Gestion du scroll progress
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.body.offsetHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });
    
    // Gestion des raccourcis clavier
    document.addEventListener('keydown', function(e) {
        // Ctrl + K pour ouvrir la recherche
        if (e.ctrlKey && e.key === 'k') {
            e.preventDefault();
            const searchInput = document.querySelector('input[type="search"]');
            if (searchInput) {
                searchInput.focus();
            }
        }
        
        // Échap pour fermer les modales
        if (e.key === 'Escape') {
            const modals = document.querySelectorAll('.image-modal');
            modals.forEach(modal => modal.remove());
        }
    });
    
    // Gestion du thème sombre (optionnel)
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            document.body.classList.toggle('dark-theme');
            const isDark = document.body.classList.contains('dark-theme');
            localStorage.setItem('darkTheme', isDark);
        });
        
        // Charger le thème sauvegardé
        if (localStorage.getItem('darkTheme') === 'true') {
            document.body.classList.add('dark-theme');
        }
    }
    
    // Gestion des animations de particules (optionnel)
    function createParticles() {
        const particleContainer = document.createElement('div');
        particleContainer.className = 'particles';
        document.body.appendChild(particleContainer);
        
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 20 + 's';
            particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
            particleContainer.appendChild(particle);
        }
    }
    
    // Initialiser les particules si on est sur la page d'accueil
    if (window.location.pathname === '/' || window.location.pathname.includes('index')) {
        createParticles();
    }
    
    console.log('Site vitrine Bright Smile initialisé avec succès !');
    
    // Debug: Test if dropdown elements exist
    console.log('Access dropdown:', document.querySelector('.access-dropdown'));
    console.log('Access toggle:', document.querySelector('.access-toggle'));
});
