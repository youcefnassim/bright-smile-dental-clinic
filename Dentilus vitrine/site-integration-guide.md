# Guide d'Intégration - Espace Médecin & Site Vitrine

## Vue d'ensemble
Ce guide explique comment naviguer entre le site vitrine public de Bright Smile et l'espace médecin professionnel.

## Navigation entre les sites

### 🏠 **Site Public → Espace Médecin**
1. **Depuis la page d'accueil** : Cliquez sur "Accès" → "Espace Médecin"
2. **Menu mobile** : Utilisez le menu hamburger → "Espace Médecin"
3. **URL directe** : `login.html`

### 🏥 **Espace Médecin → Site Public**
1. **Menu utilisateur** : Cliquez sur votre nom → "Site Public"
2. **Logo** : Cliquez sur le logo Bright Smile
3. **Navigation** : Utilisez les liens de navigation dans le header

## Authentification

### Comptes de test disponibles
- **Admin** : `admin@brightsmile.dz` / `password123`
- **Docteur** : `doctor@brightsmile.dz` / `password123`
- **Legacy** : `admin@dentilus.fr` / `admin123`

### Fonctionnalités de connexion
- ✅ Connexion sécurisée avec validation
- ✅ Option "Se souvenir de moi"
- ✅ Redirection automatique après connexion
- ✅ Gestion de session avec localStorage
- ✅ Déconnexion sécurisée

## Fonctionnalités d'intégration

### 🔄 **Navigation fluide**
- Transitions animées entre pages
- Indicateur de chargement
- Notifications cross-site
- Protection d'accès automatique

### 🔐 **Sécurité**
- Vérification d'authentification automatique
- Redirection si non connecté
- Nettoyage de session à la déconnexion
- Messages d'erreur informatifs

### 📱 **Responsive**
- Navigation mobile optimisée
- Menu hamburger fonctionnel
- Dropdowns tactiles
- Interface adaptative

## Structure des fichiers

```
Dentilus vitrine/
├── index-public.html          # Page d'accueil publique
├── login.html                 # Page de connexion
├── navigation-helper.js       # Script d'intégration
├── public-style.css          # Styles du site public
└── Espace medecin/
    ├── espace-medecin.html    # Dashboard médecin
    ├── style.css              # Styles espace médecin
    └── script.js              # Fonctionnalités dashboard
```

## Utilisation

### Pour les visiteurs
1. Naviguez normalement sur le site public
2. Utilisez "Prendre rendez-vous" pour la prise de RDV
3. Consultez les services et informations

### Pour les médecins
1. Cliquez sur "Espace Médecin" depuis n'importe quelle page
2. Connectez-vous avec vos identifiants
3. Accédez au dashboard complet
4. Utilisez "Site Public" pour revenir au site vitrine

### Fonctionnalités du dashboard
- 📊 Statistiques en temps réel
- 👥 Gestion des patients
- 📅 Planning des rendez-vous
- 📦 Gestion d'inventaire
- 📈 Rapports détaillés
- ⚙️ Paramètres du cabinet

## Messages et notifications

Le système affiche des notifications contextuelles pour :
- ✅ Connexion réussie
- ❌ Erreurs d'authentification
- ℹ️ Changements de page
- ⚠️ Alertes de sécurité

## Maintenance

### Mise à jour des identifiants
Modifiez les identifiants de test dans `login.html` ligne 377-379.

### Personnalisation
- Logos : Remplacez `logo.jpg`
- Couleurs : Modifiez les variables CSS
- Contenu : Éditez les fichiers HTML correspondants

## Support technique

Pour toute question ou problème :
- 📧 Email : brightsmile.dentaire@gmail.com
- 📞 Téléphone : 05 41 70 60 27
- 📍 Adresse : Cité Cadi - Maghnia - Rue Lacoste

---

**Note** : Cette intégration est conçue pour offrir une expérience utilisateur fluide entre le site public et l'espace professionnel, avec une sécurité appropriée et une navigation intuitive.
