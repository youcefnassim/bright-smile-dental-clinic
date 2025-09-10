// Doctor Dashboard Backend Integration
document.addEventListener('DOMContentLoaded', async function() {
    // Check authentication and role
    if (!window.apiClient || !window.apiClient.isAuthenticated()) {
        window.location.href = '../index-public.html';
        return;
    }

    const user = window.apiClient.getCurrentUser();
    if (!user || (user.role !== 'doctor' && user.role !== 'admin')) {
        window.location.href = '../index-public.html';
        return;
    }

    // Load dashboard data
    await loadDashboardStats();
    await loadTodayAppointments();
    
    // Setup event listeners
    setupEventListeners();
});

async function loadDashboardStats() {
    try {
        const response = await window.apiClient.getDashboardStats();
        if (response.success) {
            updateDashboardStats(response.data);
        }
    } catch (error) {
        console.error('Error loading dashboard stats:', error);
        // Use fallback data
        updateDashboardStats({
            total_patients: 156,
            appointments_today: 8,
            appointments_this_week: 32,
            revenue_this_month: 15420
        });
    }
}

function updateDashboardStats(stats) {
    const statElements = {
        patients: document.querySelector('.stat-card:nth-child(1) .stat-number'),
        appointmentsToday: document.querySelector('.stat-card:nth-child(2) .stat-number'),
        appointmentsWeek: document.querySelector('.stat-card:nth-child(3) .stat-number'),
        revenue: document.querySelector('.stat-card:nth-child(4) .stat-number')
    };

    if (statElements.patients) {
        statElements.patients.textContent = stats.total_patients || '0';
    }
    if (statElements.appointmentsToday) {
        statElements.appointmentsToday.textContent = stats.appointments_today || '0';
    }
    if (statElements.appointmentsWeek) {
        statElements.appointmentsWeek.textContent = stats.appointments_this_week || '0';
    }
    if (statElements.revenue) {
        statElements.revenue.textContent = `${stats.revenue_this_month || '0'}€`;
    }
}

async function loadTodayAppointments() {
    try {
        const response = await window.apiClient.getTodayAppointments();
        if (response.success) {
            updateTodayAppointments(response.data);
        }
    } catch (error) {
        console.error('Error loading today appointments:', error);
        // Use fallback data
        updateTodayAppointments([
            {
                id: 1,
                patient_name: 'Ahmed Benali',
                appointment_time: '09:00',
                service: 'Consultation',
                status: 'confirmed'
            },
            {
                id: 2,
                patient_name: 'Fatima Zohra',
                appointment_time: '10:30',
                service: 'Détartrage',
                status: 'confirmed'
            }
        ]);
    }
}

function updateTodayAppointments(appointments) {
    const appointmentsList = document.querySelector('.appointments-list, .today-appointments');
    if (!appointmentsList) return;

    appointmentsList.innerHTML = '';

    if (appointments.length === 0) {
        appointmentsList.innerHTML = '<p class="no-appointments">Aucun rendez-vous aujourd\'hui</p>';
        return;
    }

    appointments.forEach(appointment => {
        const appointmentItem = document.createElement('div');
        appointmentItem.className = 'appointment-item';
        
        const statusClass = appointment.status === 'confirmed' ? 'confirmed' : 
                           appointment.status === 'cancelled' ? 'cancelled' : 'pending';
        
        appointmentItem.innerHTML = `
            <div class="appointment-time">${appointment.appointment_time}</div>
            <div class="appointment-details">
                <div class="patient-name">${appointment.patient_name}</div>
                <div class="service-name">${appointment.service}</div>
            </div>
            <div class="appointment-status ${statusClass}">${appointment.status}</div>
            <div class="appointment-actions">
                <button class="btn-small" onclick="viewAppointment(${appointment.id})">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn-small" onclick="editAppointment(${appointment.id})">
                    <i class="fas fa-edit"></i>
                </button>
            </div>
        `;
        
        appointmentsList.appendChild(appointmentItem);
    });
}

function setupEventListeners() {
    // Logout functionality
    const logoutBtns = document.querySelectorAll('.logout-btn, .dropdown-item[href="../index-public.html"]');
    logoutBtns.forEach(btn => {
        btn.addEventListener('click', async function(e) {
            e.preventDefault();
            await window.apiClient.logout();
            window.location.href = '../index-public.html';
        });
    });

    // Quick action buttons
    const quickActions = document.querySelectorAll('.quick-action');
    quickActions.forEach(action => {
        action.addEventListener('click', function() {
            const actionType = this.dataset.action;
            handleQuickAction(actionType);
        });
    });

    // Refresh button
    const refreshBtn = document.querySelector('.refresh-btn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', async function() {
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            await loadDashboardStats();
            await loadTodayAppointments();
            this.innerHTML = '<i class="fas fa-sync-alt"></i>';
        });
    }
}

function handleQuickAction(actionType) {
    switch (actionType) {
        case 'new-appointment':
            window.location.href = '../rendez-vous.html';
            break;
        case 'view-patients':
            // Navigate to patients page (to be implemented)
            showNotification('Fonctionnalité en cours de développement', 'info');
            break;
        case 'inventory':
            // Navigate to inventory page (to be implemented)
            showNotification('Fonctionnalité en cours de développement', 'info');
            break;
        case 'reports':
            // Navigate to reports page (to be implemented)
            showNotification('Fonctionnalité en cours de développement', 'info');
            break;
        default:
            console.log('Unknown action:', actionType);
    }
}

function viewAppointment(appointmentId) {
    // Implement appointment viewing functionality
    showNotification(`Affichage du rendez-vous #${appointmentId}`, 'info');
}

function editAppointment(appointmentId) {
    // Implement appointment editing functionality
    showNotification(`Modification du rendez-vous #${appointmentId}`, 'info');
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
