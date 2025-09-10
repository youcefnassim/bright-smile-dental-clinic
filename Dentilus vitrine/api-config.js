// API Configuration for Bright Smile Dental Clinic
class ApiConfig {
    constructor() {
        // Backend API base URL - Update this to match your Laravel backend URL
        this.baseURL = 'http://localhost:8000/api';
        
        // API endpoints
        this.endpoints = {
            // Authentication
            login: '/login',
            register: '/register',
            logout: '/logout',
            me: '/me',
            updateProfile: '/profile',
            changePassword: '/change-password',
            
            // Services
            services: '/services',
            serviceCategories: '/services/categories',
            
            // Appointments
            appointments: '/appointments',
            availableSlots: '/appointments/slots/available',
            todayAppointments: '/appointments/today/list',
            
            // Patients
            patients: '/patients',
            patientStats: '/patients/stats/overview',
            
            // Reports
            dashboardStats: '/reports/dashboard',
            appointmentReport: '/reports/appointments',
            patientReport: '/reports/patients',
            financialReport: '/reports/financial',
            
            // Inventory
            inventory: '/inventory',
            lowStockAlerts: '/inventory/alerts/low-stock',
            expiringAlerts: '/inventory/alerts/expiring',
            
            // Treatment Plans
            treatmentPlans: '/treatment-plans'
        };
    }

    // Get full URL for endpoint
    getUrl(endpoint) {
        return this.baseURL + this.endpoints[endpoint];
    }

    // Get authorization headers
    getAuthHeaders() {
        const token = localStorage.getItem('auth_token');
        return {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
        };
    }

    // Get headers without auth (for public endpoints)
    getPublicHeaders() {
        return {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };
    }
}

// Create global instance
window.apiConfig = new ApiConfig();
