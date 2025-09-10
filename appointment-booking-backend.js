// Appointment Booking Backend Integration
document.addEventListener('DOMContentLoaded', function() {
    // Initialize appointment booking functionality
    initializeAppointmentBooking();
    loadServices();
});

async function loadServices() {
    try {
        const response = await window.apiClient.getServices();
        if (response.success) {
            populateServiceOptions(response.data);
        }
    } catch (error) {
        console.error('Error loading services:', error);
        showNotification('Erreur lors du chargement des services', 'error');
    }
}

function populateServiceOptions(services) {
    const serviceSelects = document.querySelectorAll('select[name="service"], #service-select');
    
    serviceSelects.forEach(select => {
        // Clear existing options except the first one
        while (select.children.length > 1) {
            select.removeChild(select.lastChild);
        }
        
        services.forEach(service => {
            const option = document.createElement('option');
            option.value = service.id;
            option.textContent = `${service.name} - ${service.price}€`;
            select.appendChild(option);
        });
    });
}

function initializeAppointmentBooking() {
    const appointmentForm = document.querySelector('#appointment-form, .appointment-form');
    if (appointmentForm) {
        appointmentForm.addEventListener('submit', handleAppointmentSubmission);
    }

    // Service selection change handler
    const serviceSelect = document.querySelector('select[name="service"], #service-select');
    if (serviceSelect) {
        serviceSelect.addEventListener('change', function() {
            const selectedServiceId = this.value;
            if (selectedServiceId) {
                loadAvailableSlots(selectedServiceId);
            }
        });
    }

    // Date selection change handler
    const dateInput = document.querySelector('input[name="date"], #appointment-date');
    if (dateInput) {
        dateInput.addEventListener('change', function() {
            const selectedDate = this.value;
            const serviceSelect = document.querySelector('select[name="service"], #service-select');
            const selectedServiceId = serviceSelect ? serviceSelect.value : null;
            
            if (selectedDate && selectedServiceId) {
                loadAvailableSlots(selectedServiceId, selectedDate);
            }
        });
    }
}

async function loadAvailableSlots(serviceId, date = null) {
    try {
        const selectedDate = date || document.querySelector('input[name="date"], #appointment-date')?.value;
        
        if (!selectedDate) {
            return;
        }

        const response = await window.apiClient.getAvailableSlots(selectedDate, serviceId);
        if (response.success) {
            populateTimeSlots(response.data);
        }
    } catch (error) {
        console.error('Error loading available slots:', error);
        showNotification('Erreur lors du chargement des créneaux disponibles', 'error');
    }
}

function populateTimeSlots(slots) {
    const timeContainer = document.querySelector('.time-slots, #time-slots');
    if (!timeContainer) return;

    timeContainer.innerHTML = '';

    if (slots.length === 0) {
        timeContainer.innerHTML = '<p>Aucun créneau disponible pour cette date</p>';
        return;
    }

    slots.forEach(slot => {
        const timeButton = document.createElement('button');
        timeButton.type = 'button';
        timeButton.className = 'time-slot';
        timeButton.textContent = slot.time;
        timeButton.dataset.time = slot.time;
        
        timeButton.addEventListener('click', function() {
            // Remove active class from all time slots
            document.querySelectorAll('.time-slot').forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Add active class to clicked slot
            this.classList.add('active');
            
            // Update hidden input if exists
            const timeInput = document.querySelector('input[name="time"], #appointment-time');
            if (timeInput) {
                timeInput.value = this.dataset.time;
            }
        });
        
        timeContainer.appendChild(timeButton);
    });
}

async function handleAppointmentSubmission(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const appointmentData = {
        service_id: formData.get('service') || document.querySelector('#service-select')?.value,
        appointment_date: formData.get('date') || document.querySelector('#appointment-date')?.value,
        appointment_time: formData.get('time') || document.querySelector('#appointment-time')?.value || document.querySelector('.time-slot.active')?.dataset.time,
        notes: formData.get('notes') || formData.get('message') || ''
    };

    // Validation
    if (!appointmentData.service_id || !appointmentData.appointment_date || !appointmentData.appointment_time) {
        showNotification('Veuillez remplir tous les champs obligatoires', 'error');
        return;
    }

    const submitBtn = e.target.querySelector('button[type="submit"], .submit-btn');
    const originalText = submitBtn ? submitBtn.innerHTML : '';
    
    if (submitBtn) {
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Réservation...';
        submitBtn.disabled = true;
    }

    try {
        const response = await window.apiClient.createAppointment(appointmentData);
        
        if (response.success) {
            showNotification('Rendez-vous réservé avec succès !', 'success');
            
            // Reset form
            e.target.reset();
            document.querySelectorAll('.time-slot').forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Redirect to patient dashboard if authenticated
            if (window.apiClient.isAuthenticated()) {
                setTimeout(() => {
                    window.location.href = 'patient-dashboard.html';
                }, 2000);
            }
        } else {
            throw new Error(response.message || 'Erreur lors de la réservation');
        }
    } catch (error) {
        showNotification(error.message || 'Erreur lors de la réservation du rendez-vous', 'error');
    } finally {
        if (submitBtn) {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }
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
