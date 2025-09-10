// Navigation Helper - Seamless integration between public site and espace médecin
class NavigationHelper {
    constructor() {
        this.init();
    }

    init() {
        // Check if user is logged in when accessing espace médecin
        this.checkAuthStatus();
        
        // Add smooth transitions between pages
        this.addPageTransitions();
        
        // Handle breadcrumb navigation
        this.setupBreadcrumbs();
    }

    checkAuthStatus() {
        const currentPath = window.location.pathname;
        const isEspaceMedecin = currentPath.includes('espace-medecin.html');
        const isLoggedIn = localStorage.getItem('dentilus_remember') === 'true';

        // If accessing espace médecin without being logged in, redirect to login
        if (isEspaceMedecin && !isLoggedIn) {
            this.showLoginPrompt();
        }
    }

    showLoginPrompt() {
        const shouldRedirect = confirm(
            'Vous devez vous connecter pour accéder à l\'espace médecin.\n\nVoulez-vous être redirigé vers la page de connexion ?'
        );
        
        if (shouldRedirect) {
            window.location.href = '../login.html';
        } else {
            window.location.href = '../index-public.html';
        }
    }

    addPageTransitions() {
        // Add loading animation for page transitions
        const links = document.querySelectorAll('a[href]');
        
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                
                // Skip external links and anchors
                if (href.startsWith('http') || href.startsWith('#') || href.startsWith('mailto:')) {
                    return;
                }
                
                // Add loading state
                this.showPageTransition();
            });
        });
    }

    showPageTransition() {
        // Create overlay if it doesn't exist
        if (!document.getElementById('page-transition')) {
            const overlay = document.createElement('div');
            overlay.id = 'page-transition';
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(255, 255, 255, 0.9);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
                opacity: 0;
                transition: opacity 0.3s ease;
            `;
            
            overlay.innerHTML = `
                <div style="text-align: center;">
                    <div style="width: 40px; height: 40px; border: 3px solid #f3f3f3; border-top: 3px solid #00bcd4; border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 15px;"></div>
                    <p style="color: #666; font-size: 14px;">Chargement...</p>
                </div>
            `;
            
            document.body.appendChild(overlay);
            
            // Add CSS animation
            const style = document.createElement('style');
            style.textContent = `
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }
        
        const overlay = document.getElementById('page-transition');
        overlay.style.opacity = '1';
        
        // Hide after 2 seconds (in case page doesn't load)
        setTimeout(() => {
            overlay.style.opacity = '0';
        }, 2000);
    }

    setupBreadcrumbs() {
        const currentPath = window.location.pathname;
        const breadcrumbContainer = document.querySelector('.breadcrumb-nav');
        
        if (!breadcrumbContainer) return;
        
        let breadcrumbs = [];
        
        if (currentPath.includes('espace-medecin.html')) {
            breadcrumbs = [
                { text: 'Accueil', url: '../index-public.html' },
                { text: 'Espace Médecin', url: '#', active: true }
            ];
        } else if (currentPath.includes('services-public.html')) {
            breadcrumbs = [
                { text: 'Accueil', url: '../index-public.html' },
                { text: 'Services', url: '#', active: true }
            ];
        }
        
        this.renderBreadcrumbs(breadcrumbs, breadcrumbContainer);
    }

    renderBreadcrumbs(breadcrumbs, container) {
        const breadcrumbHTML = breadcrumbs.map((item, index) => {
            if (item.active) {
                return `<span class="breadcrumb-active">${item.text}</span>`;
            }
            return `<a href="${item.url}" class="breadcrumb-link">${item.text}</a>`;
        }).join(' <i class="fas fa-chevron-right breadcrumb-separator"></i> ');
        
        container.innerHTML = breadcrumbHTML;
    }

    // Method to handle cross-site notifications
    static showCrossSiteNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `cross-site-notification ${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : '#2196f3'};
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            max-width: 300px;
            animation: slideInRight 0.3s ease;
        `;
        
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 10px;">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; color: white; cursor: pointer; margin-left: auto;">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
        
        // Add CSS animation if not exists
        if (!document.getElementById('cross-site-animations')) {
            const style = document.createElement('style');
            style.id = 'cross-site-animations';
            style.textContent = `
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }
    }
}

// Initialize navigation helper when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new NavigationHelper();
});

// Export for use in other scripts
window.NavigationHelper = NavigationHelper;
