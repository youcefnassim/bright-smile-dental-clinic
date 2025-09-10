// Patient Dashboard Backend Integration
document.addEventListener('DOMContentLoaded', async function() {
    // Check authentication
    if (!window.apiClient || !window.apiClient.isAuthenticated()) {
        window.location.href = 'index-public.html';
        return;
    }

    // Load patient data
    await loadPatientData();
    
    // Load appointments
    await loadAppointments();
    
    // Setup event listeners
    setupEventListeners();
});

async function loadPatientData() {
    try {
        const response = await window.apiClient.getProfile();
        if (response.success) {
            const user = response.data;
            updatePatientInfo(user);
        }
    } catch (error) {
        console.error('Error loading patient data:', error);
        // Fallback to localStorage data
        const userData = window.apiClient.getCurrentUser();
        if (userData) {
            updatePatientInfo(userData);
        }
    }
}

function updatePatientInfo(user) {
    const patientName = `${user.firstname} ${user.lastname}`;
    const initials = `${user.firstname.charAt(0)}${user.lastname.charAt(0)}`;
    
    const nameElement = document.querySelector('.patient-info h1');
    const avatarElement = document.querySelector('.patient-avatar');
    
    if (nameElement) {
        nameElement.textContent = `Bienvenue, ${patientName}`;
    }
    
    if (avatarElement) {
        avatarElement.textContent = initials;
    }
}

async function loadAppointments() {
    try {
        const response = await window.apiClient.getAppointments();
        if (response.success) {
            updateAppointmentsList(response.data);
        }
    } catch (error) {
        console.error('Error loading appointments:', error);
        showNotification('Erreur lors du chargement des rendez-vous', 'error');
    }
}

function updateAppointmentsList(appointments) {
    const appointmentContainer = document.querySelector('.dashboard-card .card-content');
    if (!appointmentContainer) return;

    // Clear existing appointments except the "Nouveau RDV" button
    const existingItems = appointmentContainer.querySelectorAll('.appointment-item');
    existingItems.forEach(item => item.remove());

    if (appointments.length === 0) {
        const noAppointments = document.createElement('p');
        noAppointments.textContent = 'Aucun rendez-vous programmé';
        noAppointments.style.color = '#666';
        appointmentContainer.insertBefore(noAppointments, appointmentContainer.lastElementChild);
        return;
    }

    appointments.slice(0, 3).forEach(appointment => {
        const appointmentItem = document.createElement('div');
        appointmentItem.className = 'appointment-item';
        
        const date = new Date(appointment.appointment_date);
        const formattedDate = date.toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
        
        appointmentItem.innerHTML = `
            <div>
                <div class="appointment-date">${formattedDate}</div>
                <div class="appointment-time">${appointment.appointment_time}</div>
            </div>
            <a href="rendez-vous.html?edit=${appointment.id}" class="btn-primary-small">Modifier</a>
        `;
        
        appointmentContainer.insertBefore(appointmentItem, appointmentContainer.lastElementChild);
    });
}

function setupEventListeners() {
    // Logout functionality
    const logoutBtns = document.querySelectorAll('.logout-btn, .dropdown-item[href="index-public.html"]');
    logoutBtns.forEach(btn => {
        btn.addEventListener('click', async function(e) {
            e.preventDefault();
            await window.apiClient.logout();
            window.location.href = 'index-public.html';
        });
    });

    // Quick action buttons
    const actionButtons = document.querySelectorAll('.action-btn');
    actionButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            if (this.href.includes('#')) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
}

// Notification function (if not already defined)
if (typeof showNotification === 'undefined') {
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
}
