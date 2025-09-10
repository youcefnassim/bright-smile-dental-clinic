# Bright Smile Dental Clinic Website

A modern, responsive website for Dr. Ayad Soumia's Bright Smile dental clinic featuring patient management, appointment booking, and comprehensive dental services.

## 🦷 About

Bright Smile is a professional dental clinic website built with modern web technologies, offering a complete digital presence for dental practices. The website includes patient portals, doctor dashboards, appointment booking systems, and comprehensive service showcases.

## ✨ Features

### Frontend Features
- **Responsive Design**: Mobile-first approach with modern UI/UX
- **Patient Portal**: Complete patient registration, login, and dashboard
- **Appointment Booking**: Multi-step booking system with calendar integration
- **Doctor Dashboard**: Professional interface for medical staff
- **Service Showcase**: Detailed dental services with pricing
- **Blog System**: Content management for dental articles
- **Gallery**: Visual showcase of clinic and treatments
- **Contact System**: Multiple contact methods and forms

### Backend Features (Laravel API)
- **Authentication**: Sanctum token-based authentication
- **Role Management**: Patient, Doctor, and Admin roles
- **Appointment System**: Complete booking and scheduling
- **Medical Records**: Patient history and treatment plans
- **Inventory Management**: Stock tracking and alerts
- **Reporting**: Analytics and financial reports

## 🚀 Technologies Used

### Frontend
- **HTML5**: Semantic markup
- **CSS3**: Modern styling with CSS Grid and Flexbox
- **JavaScript**: Vanilla JS for interactivity
- **Font Awesome**: Icon library
- **Google Fonts**: Typography (Inter font family)

### Backend
- **Laravel 10**: PHP framework
- **MySQL**: Database management
- **Sanctum**: API authentication
- **RESTful API**: Clean API design

## 📁 Project Structure

```
├── index-public.html          # Homepage
├── patient-public.html        # Patient portal
├── rendez-vous.html          # Appointment booking
├── blog-public.html          # Blog page
├── doctor-profile.html       # Doctor information
├── login.html               # Login page
├── public-style.css         # Main stylesheet
├── navigation-helper.js     # Navigation functionality
├── api-client.js           # API integration
├── api-config.js           # API configuration
├── Espace medecin/         # Doctor dashboard
│   ├── espace-medecin.html
│   ├── services-public.html
│   ├── script.js
│   └── style.css
├── backend/                # Laravel backend
│   ├── app/
│   ├── database/
│   ├── routes/
│   └── ...
├── img/                    # Images and media
└── logo.jpg               # Clinic logo
```

## 🛠️ Installation & Setup

### Frontend Setup
1. Clone the repository
```bash
git clone https://github.com/yourusername/bright-smile-clinic.git
cd bright-smile-clinic
```

2. Open `index-public.html` in your browser or serve with a local server
```bash
# Using Python
python -m http.server 8000

# Using Node.js
npx serve .

# Using PHP
php -S localhost:8000
```

### Backend Setup (Laravel)
1. Navigate to the backend directory
```bash
cd backend
```

2. Install dependencies
```bash
composer install
```

3. Setup environment
```bash
cp .env.example .env
php artisan key:generate
```

4. Configure database in `.env` file
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=bright_smile
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

5. Run migrations and seeders
```bash
php artisan migrate --seed
```

6. Start the server
```bash
php artisan serve
```

## 🎨 Design Features

- **Modern UI**: Clean, professional design
- **Responsive Layout**: Works on all devices
- **Accessibility**: WCAG compliant design
- **Performance**: Optimized loading and interactions
- **SEO Friendly**: Semantic HTML and meta tags

## 📱 Pages Overview

### Public Pages
- **Homepage** (`index-public.html`): Main landing page with services overview
- **Patient Portal** (`patient-public.html`): Patient registration and login
- **Appointments** (`rendez-vous.html`): Online booking system
- **Services** (`services-public.html`): Detailed service descriptions
- **Blog** (`blog-public.html`): Dental health articles
- **Doctor Profile** (`doctor-profile.html`): Professional information

### Admin/Doctor Pages
- **Doctor Dashboard** (`espace-medecin.html`): Management interface
- **Patient Management**: View and manage patient records
- **Appointment Management**: Schedule and track appointments

## 🔧 Configuration

### API Configuration
Update `api-config.js` with your backend URL:
```javascript
const API_CONFIG = {
    BASE_URL: 'http://localhost:8000/api',
    // ... other settings
};
```

### Contact Information
Update contact details in the HTML files and configuration files.

## 📊 Features in Detail

### Patient Management
- Registration with validation
- Login/logout functionality
- Dashboard with appointment history
- Medical records access
- Prescription management

### Appointment System
- Service selection
- Date and time picker
- Patient information forms
- Confirmation system
- Email notifications

### Doctor Dashboard
- Patient overview
- Daily appointments
- Quick actions
- Statistics and reports

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

**Bright Smile Dental Clinic**
- **Address**: Cité Cadi - Rue lacoste - à côté de CNS - Maghnia
- **Phone**: +213 5 41 70 60 27
- **Email**: Brightsmile.dentaire@gmail.com

## 🙏 Acknowledgments

- Font Awesome for icons
- Google Fonts for typography
- Laravel community for backend framework
- All contributors and testers

---

**Built with ❤️ for modern dental practices**
