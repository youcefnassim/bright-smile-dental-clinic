# Bright Smile Dental Clinic - Backend API

## Description
API Laravel complète pour la gestion du cabinet dentaire Bright Smile. Cette API fournit tous les endpoints nécessaires pour la gestion des patients, rendez-vous, services, inventaire et rapports.

## Fonctionnalités

### 🔐 Authentification
- Inscription et connexion des patients
- Authentification par tokens Sanctum
- Gestion des rôles (patient, doctor, admin)
- Mise à jour du profil et changement de mot de passe

### 👥 Gestion des Patients
- CRUD complet des patients
- Historique des rendez-vous
- Dossiers médicaux
- Plans de traitement
- Statistiques patients

### 📅 Gestion des Rendez-vous
- Prise de rendez-vous en ligne
- Vérification des créneaux disponibles
- Gestion des statuts (programmé, confirmé, en cours, terminé, annulé)
- Rendez-vous d'urgence
- Notifications

### 🦷 Services Dentaires
- Catalogue complet des services
- Gestion des prix et durées
- Catégorisation des services
- Services actifs/inactifs

### 📦 Gestion d'Inventaire
- Suivi du stock en temps réel
- Alertes stock faible
- Gestion des dates d'expiration
- Catégorisation des articles
- Mise à jour automatique des stocks

### 📊 Plans de Traitement
- Création de plans personnalisés
- Suivi de l'avancement
- Coûts et planification
- Statuts multiples

### 📈 Rapports et Statistiques
- Dashboard avec métriques clés
- Rapports de rendez-vous
- Rapports financiers
- Statistiques patients
- Rapports d'inventaire

## Installation

### Prérequis
- PHP 8.1 ou supérieur
- Composer
- MySQL 8.0 ou supérieur
- Extension PHP : BCMath, Ctype, Fileinfo, JSON, Mbstring, OpenSSL, PDO, Tokenizer, XML

### Étapes d'installation

1. **Cloner le projet**
```bash
git clone <repository-url>
cd backend
```

2. **Installer les dépendances**
```bash
composer install
```

3. **Configuration de l'environnement**
```bash
cp .env.example .env
```

4. **Configurer la base de données dans .env**
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=dental_clinic
DB_USERNAME=root
DB_PASSWORD=your_password
```

5. **Générer la clé d'application**
```bash
php artisan key:generate
```

6. **Créer la base de données**
```sql
CREATE DATABASE dental_clinic CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

7. **Exécuter les migrations**
```bash
php artisan migrate
```

8. **Peupler la base avec des données de test**
```bash
php artisan db:seed
```

9. **Démarrer le serveur de développement**
```bash
php artisan serve
```

L'API sera accessible sur `http://localhost:8000`

## Configuration

### Variables d'environnement importantes

```env
# Application
APP_NAME="Bright Smile Dental Clinic API"
APP_URL=http://localhost:8000

# Base de données
DB_CONNECTION=mysql
DB_DATABASE=dental_clinic

# Email (pour les notifications)
MAIL_FROM_ADDRESS="hello@brightsmile.dz"
MAIL_FROM_NAME="${APP_NAME}"

# Configuration du cabinet
CLINIC_NAME="Bright Smile Dental Clinic"
CLINIC_PHONE="05 41 70 60 27"
CLINIC_ADDRESS="Cité Cadi - Maghnia - Rue Lacoste - à côté de CNS"
CLINIC_EMAIL="brightsmile.dentaire@gmail.com"
```

## Utilisation de l'API

### Authentification

#### Inscription d'un patient
```http
POST /api/register
Content-Type: application/json

{
    "first_name": "Amina",
    "last_name": "Bensalem",
    "email": "amina@email.dz",
    "password": "password123",
    "password_confirmation": "password123",
    "phone": "0661234567",
    "birth_date": "1990-05-15",
    "address": "Oran, Algérie"
}
```

#### Connexion
```http
POST /api/login
Content-Type: application/json

{
    "email": "amina@email.dz",
    "password": "password123"
}
```

### Endpoints principaux

#### Rendez-vous
- `GET /api/appointments` - Liste des rendez-vous
- `POST /api/appointments` - Créer un rendez-vous
- `GET /api/appointments/{id}` - Détails d'un rendez-vous
- `PUT /api/appointments/{id}` - Modifier un rendez-vous
- `DELETE /api/appointments/{id}` - Annuler un rendez-vous
- `GET /api/appointments/slots/available` - Créneaux disponibles

#### Patients (Admin/Docteur uniquement)
- `GET /api/patients` - Liste des patients
- `POST /api/patients` - Ajouter un patient
- `GET /api/patients/{id}` - Profil patient
- `PUT /api/patients/{id}` - Modifier un patient
- `GET /api/patients/{id}/appointments` - Rendez-vous du patient

#### Services
- `GET /api/services` - Liste des services
- `GET /api/services/{id}` - Détails d'un service
- `GET /api/services/categories` - Catégories de services

#### Rapports (Admin/Docteur uniquement)
- `GET /api/reports/dashboard` - Statistiques du dashboard
- `GET /api/reports/appointments` - Rapport des rendez-vous
- `GET /api/reports/financial` - Rapport financier
- `GET /api/reports/patients` - Rapport des patients

### Authentification des requêtes

Toutes les requêtes protégées doivent inclure le token d'authentification :

```http
Authorization: Bearer {token}
```

## Données de test

Après avoir exécuté `php artisan db:seed`, vous aurez accès aux comptes suivants :

### Comptes administrateur/médecin
- **Admin** : `admin@brightsmile.dz` / `password123`
- **Docteur** : `doctor@brightsmile.dz` / `password123`

### Comptes patients
- `amina.bensalem@email.dz` / `password123`
- `youcef.meziane@email.dz` / `password123`
- `fatima.boumediene@email.dz` / `password123`
- `karim.hadjahmed@email.dz` / `password123`

## Structure de la base de données

### Tables principales
- `users` - Utilisateurs (patients, médecins, admin)
- `services` - Services dentaires
- `appointments` - Rendez-vous
- `treatment_plans` - Plans de traitement
- `medical_records` - Dossiers médicaux
- `inventory` - Inventaire du cabinet

### Relations
- Un utilisateur peut avoir plusieurs rendez-vous (patient/médecin)
- Un rendez-vous appartient à un service
- Un plan de traitement lie un patient et un médecin
- Les dossiers médicaux sont liés aux rendez-vous

## Sécurité

- Authentification par tokens Sanctum
- Validation des données d'entrée
- Middleware de rôles pour les permissions
- Protection CORS configurée
- Hashage sécurisé des mots de passe

## Développement

### Commandes utiles

```bash
# Créer une nouvelle migration
php artisan make:migration create_table_name

# Créer un nouveau modèle
php artisan make:model ModelName

# Créer un nouveau contrôleur
php artisan make:controller ControllerName

# Nettoyer le cache
php artisan cache:clear
php artisan config:clear
php artisan route:clear

# Voir les routes
php artisan route:list
```

### Tests

Pour exécuter les tests (à implémenter) :
```bash
php artisan test
```

## Support

Pour toute question ou problème :
- Email : brightsmile.dentaire@gmail.com
- Téléphone : 05 41 70 60 27
- Adresse : Cité Cadi - Maghnia - Rue Lacoste - à côté de CNS

## Licence

Ce projet est développé pour Bright Smile Dental Clinic. Tous droits réservés.
