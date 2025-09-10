// API Client for Bright Smile Dental Clinic
class ApiClient {
    constructor() {
        this.config = window.apiConfig;
    }

    // Generic API request method
    async request(endpoint, options = {}) {
        const url = this.config.getUrl(endpoint);
        const defaultOptions = {
            method: 'GET',
            headers: options.auth !== false ? this.config.getAuthHeaders() : this.config.getPublicHeaders()
        };

        const requestOptions = { ...defaultOptions, ...options };
        
        // Add body for POST/PUT requests
        if (requestOptions.body && typeof requestOptions.body === 'object') {
            requestOptions.body = JSON.stringify(requestOptions.body);
        }

        try {
            const response = await fetch(url, requestOptions);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Une erreur est survenue');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // Authentication methods
    async login(email, password) {
        const response = await this.request('login', {
            method: 'POST',
            auth: false,
            body: { email, password }
        });
        
        if (response.success && response.data.token) {
            localStorage.setItem('auth_token', response.data.token);
            localStorage.setItem('user_data', JSON.stringify(response.data.user));
        }
        
        return response;
    }

    async register(userData) {
        const response = await this.request('register', {
            method: 'POST',
            auth: false,
            body: userData
        });
        
        if (response.success && response.data.token) {
            localStorage.setItem('auth_token', response.data.token);
            localStorage.setItem('user_data', JSON.stringify(response.data.user));
        }
        
        return response;
    }

    async logout() {
        try {
            await this.request('logout', { method: 'POST' });
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user_data');
        }
    }

    async getProfile() {
        return await this.request('me');
    }

    // Services methods
    async getServices() {
        return await this.request('services', { auth: false });
    }

    async getService(id) {
        return await this.request('services', { auth: false });
    }

    // Appointments methods
    async getAppointments() {
        return await this.request('appointments');
    }

    async createAppointment(appointmentData) {
        return await this.request('appointments', {
            method: 'POST',
            body: appointmentData
        });
    }

    async updateAppointment(id, appointmentData) {
        return await this.request('appointments', {
            method: 'PUT',
            body: appointmentData
        });
    }

    async deleteAppointment(id) {
        return await this.request('appointments', {
            method: 'DELETE'
        });
    }

    async getAvailableSlots(date, serviceId) {
        const params = new URLSearchParams({ date, service_id: serviceId });
        return await this.request(`availableSlots?${params}`);
    }

    // Dashboard methods
    async getDashboardStats() {
        return await this.request('dashboardStats');
    }

    async getTodayAppointments() {
        return await this.request('todayAppointments');
    }

    // Patient methods
    async getPatients() {
        return await this.request('patients');
    }

    async getPatientAppointments(patientId) {
        return await this.request(`patients/${patientId}/appointments`);
    }

    async getPatientMedicalRecords(patientId) {
        return await this.request(`patients/${patientId}/medical-records`);
    }

    // Utility methods
    isAuthenticated() {
        return !!localStorage.getItem('auth_token');
    }

    getCurrentUser() {
        const userData = localStorage.getItem('user_data');
        return userData ? JSON.parse(userData) : null;
    }

    // Error handling
    handleError(error) {
        console.error('API Client Error:', error);
        
        // Handle authentication errors
        if (error.message.includes('401') || error.message.includes('Unauthenticated')) {
            this.logout();
            window.location.href = 'index-public.html';
            return;
        }

        // Show user-friendly error message
        this.showNotification(error.message || 'Une erreur est survenue', 'error');
    }

    // Show notification (integrate with existing notification system)
    showNotification(message, type = 'info') {
        if (typeof showNotification === 'function') {
            showNotification(message, type);
        } else {
            console.log(`${type.toUpperCase()}: ${message}`);
        }
    }
}

// Create global instance
window.apiClient = new ApiClient();
