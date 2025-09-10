// Script JavaScript pour l'espace médecin
document.addEventListener('DOMContentLoaded', function() {
    
    // Gestion du menu mobile
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }

    // Gestion du dropdown d'accès
    const accessToggle = document.querySelector('.access-toggle');
    const accessDropdown = document.querySelector('.access-dropdown');
    
    if (accessToggle && accessDropdown) {
        accessToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            accessDropdown.classList.toggle('active');
        });

        // Fermer le dropdown en cliquant ailleurs
        document.addEventListener('click', function(e) {
            if (!accessDropdown.contains(e.target)) {
                accessDropdown.classList.remove('active');
            }
        });
    }

    // Animation des cartes au chargement
    const cards = document.querySelectorAll('.stat-card, .dashboard-card, .action-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'all 0.5s ease-out';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });

    // Gestion des actions rapides
    const actionCards = document.querySelectorAll('.action-card');
    actionCards.forEach(card => {
        card.addEventListener('click', function() {
            const title = this.querySelector('.action-title').textContent;
            handleQuickAction(title);
        });
    });

    // Fonction pour gérer les actions rapides
    function handleQuickAction(action) {
        switch(action) {
            case 'Nouveau Rendez-vous':
                showNotification('Redirection vers la page de prise de rendez-vous...', 'info');
                setTimeout(() => {
                    window.location.href = '../rendez-vous.html';
                }, 1000);
                break;
            
            case 'Nouveau Patient':
                showModal('Ajouter un nouveau patient', createPatientForm());
                break;
            
            case 'Plans de Traitement':
                showModal('Plans de Traitement', createTreatmentPlansInterface());
                break;
            
            case 'Inventaire':
                showModal('Gestion de l\'Inventaire', createInventoryInterface());
                break;
            
            case 'Rapports':
                showModal('Rapports et Statistiques', createReportsInterface());
                break;
            
            case 'Paramètres':
                showModal('Paramètres du Cabinet', createSettingsInterface());
                break;
            
            default:
                showNotification('Action non implémentée', 'warning');
        }
    }

    // Fonction pour afficher les notifications
    function showNotification(message, type = 'info') {
        // Supprimer les notifications existantes
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notif => notif.remove());

        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 12px;">
                <i class="fas ${getNotificationIcon(type)}"></i>
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; color: inherit; cursor: pointer; margin-left: auto;">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Afficher la notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Masquer automatiquement après 5 secondes
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 300);
        }, 5000);
    }

    // Fonction pour obtenir l'icône de notification
    function getNotificationIcon(type) {
        switch(type) {
            case 'success': return 'fa-check-circle';
            case 'error': return 'fa-exclamation-circle';
            case 'warning': return 'fa-exclamation-triangle';
            default: return 'fa-info-circle';
        }
    }

    // Fonction pour créer l'interface des rapports
    function createReportsInterface() {
        return `
            <div style="display: grid; gap: 20px;">
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
                    <div onclick="generateReport('patients')" style="background: #f8f8f8; padding: 20px; border-radius: 8px; cursor: pointer; text-align: center; border: 1px solid var(--border-color);">
                        <i class="fas fa-users" style="font-size: 2rem; color: var(--primary-color); margin-bottom: 8px;"></i>
                        <h4>Rapport Patients</h4>
                        <p style="color: var(--text-secondary); font-size: 0.875rem;">Liste complète des patients</p>
                    </div>
                    
                    <div onclick="generateReport('appointments')" style="background: #f8f8f8; padding: 20px; border-radius: 8px; cursor: pointer; text-align: center; border: 1px solid var(--border-color);">
                        <i class="fas fa-calendar-alt" style="font-size: 2rem; color: var(--primary-color); margin-bottom: 8px;"></i>
                        <h4>Rapport RDV</h4>
                        <p style="color: var(--text-secondary); font-size: 0.875rem;">Rendez-vous du mois</p>
                    </div>
                    
                    <div onclick="generateReport('financial')" style="background: #f8f8f8; padding: 20px; border-radius: 8px; cursor: pointer; text-align: center; border: 1px solid var(--border-color);">
                        <i class="fas fa-chart-line" style="font-size: 2rem; color: var(--primary-color); margin-bottom: 8px;"></i>
                        <h4>Rapport Financier</h4>
                        <p style="color: var(--text-secondary); font-size: 0.875rem;">Revenus et statistiques</p>
                    </div>
                    
                    <div onclick="generateReport('treatments')" style="background: #f8f8f8; padding: 20px; border-radius: 8px; cursor: pointer; text-align: center; border: 1px solid var(--border-color);">
                        <i class="fas fa-tooth" style="font-size: 2rem; color: var(--primary-color); margin-bottom: 8px;"></i>
                        <h4>Rapport Traitements</h4>
                        <p style="color: var(--text-secondary); font-size: 0.875rem;">Traitements effectués</p>
                    </div>
                </div>
                
                <div style="border-top: 1px solid var(--border-color); padding-top: 20px;">
                    <h4 style="margin-bottom: 16px;">Statistiques Rapides</h4>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 12px;">
                        <div style="text-align: center; padding: 12px; background: #f8f8f8; border-radius: 6px;">
                            <div style="font-size: 1.5rem; font-weight: bold; color: var(--primary-color);">2,547</div>
                            <div style="font-size: 0.875rem; color: var(--text-secondary);">Patients Total</div>
                        </div>
                        <div style="text-align: center; padding: 12px; background: #f8f8f8; border-radius: 6px;">
                            <div style="font-size: 1.5rem; font-weight: bold; color: var(--primary-color);">342</div>
                            <div style="font-size: 0.875rem; color: var(--text-secondary);">RDV ce mois</div>
                        </div>
                        <div style="text-align: center; padding: 12px; background: #f8f8f8; border-radius: 6px;">
                            <div style="font-size: 1.5rem; font-weight: bold; color: var(--primary-color);">98%</div>
                            <div style="font-size: 0.875rem; color: var(--text-secondary);">Satisfaction</div>
                        </div>
                        <div style="text-align: center; padding: 12px; background: #f8f8f8; border-radius: 6px;">
                            <div style="font-size: 1.5rem; font-weight: bold; color: var(--primary-color);">€45,230</div>
                            <div style="font-size: 0.875rem; color: var(--text-secondary);">Revenus mois</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Fonction pour créer l'interface des paramètres
    function createSettingsInterface() {
        return `
            <div style="display: grid; gap: 24px;">
                <div>
                    <h4 style="margin-bottom: 16px; color: var(--text-primary);">Informations du Cabinet</h4>
                    <div style="display: grid; gap: 16px;">
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                            <div>
                                <label style="display: block; margin-bottom: 4px; font-weight: 500;">Nom du Cabinet</label>
                                <input type="text" value="Bright Smile Dental Clinic" style="width: 100%; padding: 8px 12px; border: 1px solid var(--border-color); border-radius: 6px;">
                            </div>
                            <div>
                                <label style="display: block; margin-bottom: 4px; font-weight: 500;">Téléphone</label>
                                <input type="tel" value="05 41 70 60 27" style="width: 100%; padding: 8px 12px; border: 1px solid var(--border-color); border-radius: 6px;">
                            </div>
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 4px; font-weight: 500;">Adresse</label>
                            <input type="text" value="Cité Cadi - Maghnia - Rue Lacoste - à côté de CNS" style="width: 100%; padding: 8px 12px; border: 1px solid var(--border-color); border-radius: 6px;">
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 4px; font-weight: 500;">Email</label>
                            <input type="email" value="brightsmile.dentaire@gmail.com" style="width: 100%; padding: 8px 12px; border: 1px solid var(--border-color); border-radius: 6px;">
                        </div>
                    </div>
                </div>
                
                <div style="border-top: 1px solid var(--border-color); padding-top: 20px;">
                    <h4 style="margin-bottom: 16px; color: var(--text-primary);">Horaires d'Ouverture</h4>
                    <div style="display: grid; gap: 12px;">
                        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; align-items: center;">
                            <span style="font-weight: 500;">Lundi - Vendredi</span>
                            <input type="time" value="08:00" style="padding: 6px 8px; border: 1px solid var(--border-color); border-radius: 4px;">
                            <input type="time" value="18:00" style="padding: 6px 8px; border: 1px solid var(--border-color); border-radius: 4px;">
                        </div>
                        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; align-items: center;">
                            <span style="font-weight: 500;">Samedi</span>
                            <input type="time" value="09:00" style="padding: 6px 8px; border: 1px solid var(--border-color); border-radius: 4px;">
                            <input type="time" value="14:00" style="padding: 6px 8px; border: 1px solid var(--border-color); border-radius: 4px;">
                        </div>
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <input type="checkbox" id="sundayOpen">
                            <label for="sundayOpen">Ouvert le dimanche</label>
                        </div>
                    </div>
                </div>
                
                <div style="border-top: 1px solid var(--border-color); padding-top: 20px;">
                    <h4 style="margin-bottom: 16px; color: var(--text-primary);">Préférences</h4>
                    <div style="display: grid; gap: 12px;">
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <input type="checkbox" id="emailNotifications" checked>
                            <label for="emailNotifications">Notifications par email</label>
                        </div>
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <input type="checkbox" id="smsReminders" checked>
                            <label for="smsReminders">Rappels SMS aux patients</label>
                        </div>
                        <div style="display: flex; align-items: center; gap: 8px;">
                            <input type="checkbox" id="autoBackup">
                            <label for="autoBackup">Sauvegarde automatique</label>
                        </div>
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <label for="language">Langue:</label>
                            <select id="language" style="padding: 6px 8px; border: 1px solid var(--border-color); border-radius: 4px;">
                                <option value="fr" selected>Français</option>
                                <option value="ar">العربية</option>
                                <option value="en">English</option>
                            </select>
                        </div>
                    </div>
                </div>
                
                <div style="display: flex; gap: 12px; justify-content: flex-end; margin-top: 16px; border-top: 1px solid var(--border-color); padding-top: 20px;">
                    <button type="button" onclick="closeModal()" style="padding: 10px 20px; border: 1px solid var(--border-color); background: white; color: var(--text-primary); border-radius: 6px; cursor: pointer;">
                        Annuler
                    </button>
                    <button type="button" onclick="saveSettings()" style="padding: 10px 20px; background: var(--primary-color); color: white; border: none; border-radius: 6px; cursor: pointer;">
                        Sauvegarder
                    </button>
                </div>
            </div>
        `;
    }

    // Fonction pour créer l'interface des plans de traitement
    function createTreatmentPlansInterface() {
        return `
            <div style="display: grid; gap: 20px;">
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 16px;">
                    <div style="background: #f8f8f8; padding: 20px; border-radius: 8px; border: 1px solid var(--border-color);">
                        <h4 style="margin-bottom: 12px; color: var(--primary-color);">Plans Actifs</h4>
                        <div style="font-size: 2rem; font-weight: bold; color: var(--text-primary);">23</div>
                        <p style="color: var(--text-secondary); font-size: 0.875rem;">En cours de traitement</p>
                    </div>
                    
                    <div style="background: #f8f8f8; padding: 20px; border-radius: 8px; border: 1px solid var(--border-color);">
                        <h4 style="margin-bottom: 12px; color: var(--primary-color);">Terminés</h4>
                        <div style="font-size: 2rem; font-weight: bold; color: var(--text-primary);">156</div>
                        <p style="color: var(--text-secondary); font-size: 0.875rem;">Ce mois</p>
                    </div>
                    
                    <div style="background: #f8f8f8; padding: 20px; border-radius: 8px; border: 1px solid var(--border-color);">
                        <h4 style="margin-bottom: 12px; color: var(--primary-color);">En Attente</h4>
                        <div style="font-size: 2rem; font-weight: bold; color: var(--text-primary);">8</div>
                        <p style="color: var(--text-secondary); font-size: 0.875rem;">Validation requise</p>
                    </div>
                </div>
                
                <div style="border-top: 1px solid var(--border-color); padding-top: 20px;">
                    <h4 style="margin-bottom: 16px;">Plans de Traitement Récents</h4>
                    <div style="overflow-x: auto;">
                        <table style="width: 100%; border-collapse: collapse;">
                            <thead>
                                <tr style="background: #f8f8f8;">
                                    <th style="padding: 12px; text-align: left; border: 1px solid var(--border-color);">Patient</th>
                                    <th style="padding: 12px; text-align: left; border: 1px solid var(--border-color);">Traitement</th>
                                    <th style="padding: 12px; text-align: left; border: 1px solid var(--border-color);">Statut</th>
                                    <th style="padding: 12px; text-align: left; border: 1px solid var(--border-color);">Prochaine Séance</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td style="padding: 12px; border: 1px solid var(--border-color);">Amina Bensalem</td>
                                    <td style="padding: 12px; border: 1px solid var(--border-color);">Orthodontie</td>
                                    <td style="padding: 12px; border: 1px solid var(--border-color);"><span style="background: #f0f0f0; padding: 4px 8px; border-radius: 12px; font-size: 0.75rem;">En cours</span></td>
                                    <td style="padding: 12px; border: 1px solid var(--border-color);">20/01/2024</td>
                                </tr>
                                <tr>
                                    <td style="padding: 12px; border: 1px solid var(--border-color);">Youcef Meziane</td>
                                    <td style="padding: 12px; border: 1px solid var(--border-color);">Implant dentaire</td>
                                    <td style="padding: 12px; border: 1px solid var(--border-color);"><span style="background: #f0f0f0; padding: 4px 8px; border-radius: 12px; font-size: 0.75rem;">Planifié</span></td>
                                    <td style="padding: 12px; border: 1px solid var(--border-color);">25/01/2024</td>
                                </tr>
                                <tr>
                                    <td style="padding: 12px; border: 1px solid var(--border-color);">Fatima Boumediene</td>
                                    <td style="padding: 12px; border: 1px solid var(--border-color);">Blanchiment</td>
                                    <td style="padding: 12px; border: 1px solid var(--border-color);"><span style="background: #f0f0f0; padding: 4px 8px; border-radius: 12px; font-size: 0.75rem;">Terminé</span></td>
                                    <td style="padding: 12px; border: 1px solid var(--border-color);">-</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                
                <div style="display: flex; gap: 12px; justify-content: flex-end; margin-top: 16px;">
                    <button onclick="showNotification('Nouveau plan de traitement créé!', 'success')" style="padding: 10px 20px; background: var(--primary-color); color: white; border: none; border-radius: 6px; cursor: pointer;">
                        Nouveau Plan
                    </button>
                    <button onclick="generateReport('treatments')" style="padding: 10px 20px; border: 1px solid var(--border-color); background: white; color: var(--text-primary); border-radius: 6px; cursor: pointer;">
                        Rapport Complet
                    </button>
                </div>
            </div>
        `;
    }

    // Fonction pour créer l'interface de l'inventaire
    function createInventoryInterface() {
        return `
            <div style="display: grid; gap: 20px;">
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
                    <div style="background: #f8f8f8; padding: 20px; border-radius: 8px; text-align: center; border: 1px solid var(--border-color);">
                        <i class="fas fa-boxes" style="font-size: 2rem; color: var(--primary-color); margin-bottom: 8px;"></i>
                        <h4>Articles Totaux</h4>
                        <div style="font-size: 1.5rem; font-weight: bold; color: var(--text-primary);">247</div>
                    </div>
                    
                    <div style="background: #f8f8f8; padding: 20px; border-radius: 8px; text-align: center; border: 1px solid var(--border-color);">
                        <i class="fas fa-exclamation-triangle" style="font-size: 2rem; color: var(--warning-color); margin-bottom: 8px;"></i>
                        <h4>Stock Faible</h4>
                        <div style="font-size: 1.5rem; font-weight: bold; color: var(--warning-color);">12</div>
                    </div>
                    
                    <div style="background: #f8f8f8; padding: 20px; border-radius: 8px; text-align: center; border: 1px solid var(--border-color);">
                        <i class="fas fa-shopping-cart" style="font-size: 2rem; color: var(--primary-color); margin-bottom: 8px;"></i>
                        <h4>Commandes</h4>
                        <div style="font-size: 1.5rem; font-weight: bold; color: var(--text-primary);">3</div>
                    </div>
                </div>
                
                <div style="border-top: 1px solid var(--border-color); padding-top: 20px;">
                    <h4 style="margin-bottom: 16px;">Articles en Stock Faible</h4>
                    <div style="overflow-x: auto;">
                        <table style="width: 100%; border-collapse: collapse;">
                            <thead>
                                <tr style="background: #f8f8f8;">
                                    <th style="padding: 12px; text-align: left; border: 1px solid var(--border-color);">Article</th>
                                    <th style="padding: 12px; text-align: left; border: 1px solid var(--border-color);">Catégorie</th>
                                    <th style="padding: 12px; text-align: left; border: 1px solid var(--border-color);">Stock Actuel</th>
                                    <th style="padding: 12px; text-align: left; border: 1px solid var(--border-color);">Seuil Min.</th>
                                    <th style="padding: 12px; text-align: left; border: 1px solid var(--border-color);">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td style="padding: 12px; border: 1px solid var(--border-color);">Gants latex</td>
                                    <td style="padding: 12px; border: 1px solid var(--border-color);">Consommables</td>
                                    <td style="padding: 12px; border: 1px solid var(--border-color); color: var(--warning-color);">15</td>
                                    <td style="padding: 12px; border: 1px solid var(--border-color);">50</td>
                                    <td style="padding: 12px; border: 1px solid var(--border-color);">
                                        <button onclick="showNotification('Commande passée pour Gants latex', 'success')" style="padding: 4px 8px; background: var(--primary-color); color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 0.75rem;">Commander</button>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 12px; border: 1px solid var(--border-color);">Amalgame dentaire</td>
                                    <td style="padding: 12px; border: 1px solid var(--border-color);">Matériaux</td>
                                    <td style="padding: 12px; border: 1px solid var(--border-color); color: var(--warning-color);">3</td>
                                    <td style="padding: 12px; border: 1px solid var(--border-color);">10</td>
                                    <td style="padding: 12px; border: 1px solid var(--border-color);">
                                        <button onclick="showNotification('Commande passée pour Amalgame dentaire', 'success')" style="padding: 4px 8px; background: var(--primary-color); color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 0.75rem;">Commander</button>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 12px; border: 1px solid var(--border-color);">Anesthésique local</td>
                                    <td style="padding: 12px; border: 1px solid var(--border-color);">Médicaments</td>
                                    <td style="padding: 12px; border: 1px solid var(--border-color); color: var(--warning-color);">8</td>
                                    <td style="padding: 12px; border: 1px solid var(--border-color);">20</td>
                                    <td style="padding: 12px; border: 1px solid var(--border-color);">
                                        <button onclick="showNotification('Commande passée pour Anesthésique local', 'success')" style="padding: 4px 8px; background: var(--primary-color); color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 0.75rem;">Commander</button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                
                <div style="display: flex; gap: 12px; justify-content: flex-end; margin-top: 16px;">
                    <button onclick="showNotification('Nouvel article ajouté à l\\'inventaire!', 'success')" style="padding: 10px 20px; background: var(--primary-color); color: white; border: none; border-radius: 6px; cursor: pointer;">
                        Ajouter Article
                    </button>
                    <button onclick="exportData('inventory')" style="padding: 10px 20px; border: 1px solid var(--border-color); background: white; color: var(--text-primary); border-radius: 6px; cursor: pointer;">
                        Exporter Inventaire
                    </button>
                </div>
            </div>
        `;
    }

    // Fonction pour créer le formulaire de nouveau patient
    function createPatientForm() {
        return `
            <form id="newPatientForm" style="display: grid; gap: 16px;">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                    <div>
                        <label style="display: block; margin-bottom: 4px; font-weight: 500;">Prénom *</label>
                        <input type="text" name="firstName" required style="width: 100%; padding: 8px 12px; border: 1px solid var(--border-color); border-radius: 6px;">
                    </div>
                    <div>
                        <label style="display: block; margin-bottom: 4px; font-weight: 500;">Nom *</label>
                        <input type="text" name="lastName" required style="width: 100%; padding: 8px 12px; border: 1px solid var(--border-color); border-radius: 6px;">
                    </div>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                    <div>
                        <label style="display: block; margin-bottom: 4px; font-weight: 500;">Téléphone *</label>
                        <input type="tel" name="phone" required style="width: 100%; padding: 8px 12px; border: 1px solid var(--border-color); border-radius: 6px;">
                    </div>
                    <div>
                        <label style="display: block; margin-bottom: 4px; font-weight: 500;">Date de naissance</label>
                        <input type="date" name="birthDate" style="width: 100%; padding: 8px 12px; border: 1px solid var(--border-color); border-radius: 6px;">
                    </div>
                </div>
                
                <div>
                    <label style="display: block; margin-bottom: 4px; font-weight: 500;">Email</label>
                    <input type="email" name="email" style="width: 100%; padding: 8px 12px; border: 1px solid var(--border-color); border-radius: 6px;">
                </div>
                
                <div>
                    <label style="display: block; margin-bottom: 4px; font-weight: 500;">Adresse</label>
                    <textarea name="address" rows="2" style="width: 100%; padding: 8px 12px; border: 1px solid var(--border-color); border-radius: 6px; resize: vertical;"></textarea>
                </div>
                
                <div>
                    <label style="display: block; margin-bottom: 4px; font-weight: 500;">Notes médicales</label>
                    <textarea name="medicalNotes" rows="3" placeholder="Allergies, antécédents médicaux, etc." style="width: 100%; padding: 8px 12px; border: 1px solid var(--border-color); border-radius: 6px; resize: vertical;"></textarea>
                </div>
                
                <div style="display: flex; gap: 12px; justify-content: flex-end; margin-top: 16px;">
                    <button type="button" onclick="closeModal()" style="padding: 10px 20px; border: 1px solid var(--border-color); background: white; color: var(--text-primary); border-radius: 6px; cursor: pointer;">
                        Annuler
                    </button>
                    <button type="submit" style="padding: 10px 20px; background: var(--primary-color); color: white; border: none; border-radius: 6px; cursor: pointer;">
                        Ajouter le patient
                    </button>
                </div>
            </form>
        `;
    }

    // Fonction pour afficher une modal
    function showModal(title, content) {
        // Supprimer les modals existantes
        const existingModals = document.querySelectorAll('.modal-overlay');
        existingModals.forEach(modal => modal.remove());

        const modalOverlay = document.createElement('div');
        modalOverlay.className = 'modal-overlay';
        modalOverlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;

        const modal = document.createElement('div');
        modal.style.cssText = `
            background: white;
            border-radius: 12px;
            padding: 24px;
            max-width: 600px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            transform: scale(0.9);
            transition: transform 0.3s ease;
        `;

        modal.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; padding-bottom: 16px; border-bottom: 1px solid var(--border-color);">
                <h3 style="margin: 0; font-size: 1.25rem; font-weight: 600;">${title}</h3>
                <button onclick="closeModal()" style="background: none; border: none; font-size: 1.25rem; cursor: pointer; color: var(--text-secondary);">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div>${content}</div>
        `;

        modalOverlay.appendChild(modal);
        document.body.appendChild(modalOverlay);

        // Animer l'apparition
        setTimeout(() => {
            modalOverlay.style.opacity = '1';
            modal.style.transform = 'scale(1)';
        }, 10);

        // Gestion du formulaire de nouveau patient
        const form = modal.querySelector('#newPatientForm');
        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                const formData = new FormData(form);
                const patientData = Object.fromEntries(formData);
                
                // Ici vous pouvez ajouter la logique pour sauvegarder le patient
                console.log('Nouveau patient:', patientData);
                
                showNotification('Patient ajouté avec succès!', 'success');
                closeModal();
                
                // Optionnel: recharger la liste des patients
                // updatePatientList();
            });
        }

        // Fermer en cliquant sur l'overlay
        modalOverlay.addEventListener('click', function(e) {
            if (e.target === modalOverlay) {
                closeModal();
            }
        });
    }

    // Fonction pour fermer la modal
    window.closeModal = function() {
        const modal = document.querySelector('.modal-overlay');
        if (modal) {
            modal.style.opacity = '0';
            modal.querySelector('div').style.transform = 'scale(0.9)';
            setTimeout(() => {
                modal.remove();
            }, 300);
        }
    };

    // Gestion des rendez-vous (simulation de données en temps réel)
    function updateAppointmentStatus() {
        const appointmentItems = document.querySelectorAll('.appointment-item');
        appointmentItems.forEach(item => {
            const time = item.querySelector('.appointment-time').textContent;
            const currentTime = new Date();
            const appointmentTime = new Date();
            const [hours, minutes] = time.split(':');
            appointmentTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
            
            // Ajouter un indicateur de statut
            let statusIndicator = item.querySelector('.status-indicator');
            if (!statusIndicator) {
                statusIndicator = document.createElement('div');
                statusIndicator.className = 'status-indicator';
                statusIndicator.style.cssText = `
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    margin-left: 8px;
                `;
                item.appendChild(statusIndicator);
            }
            
            if (appointmentTime < currentTime) {
                statusIndicator.style.background = 'var(--success-color)';
                statusIndicator.title = 'Terminé';
            } else if (Math.abs(appointmentTime - currentTime) < 30 * 60 * 1000) { // 30 minutes
                statusIndicator.style.background = 'var(--warning-color)';
                statusIndicator.title = 'Bientôt';
            } else {
                statusIndicator.style.background = 'var(--text-secondary)';
                statusIndicator.title = 'Programmé';
            }
        });
    }

    // Mettre à jour les statuts toutes les minutes
    updateAppointmentStatus();
    setInterval(updateAppointmentStatus, 60000);

    // Gestion du scroll pour l'header
    let lastScrollTop = 0;
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scroll vers le bas
            header.style.transform = 'translateY(-100%)';
        } else {
            // Scroll vers le haut
            header.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });

    // Raccourcis clavier
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + N pour nouveau patient
        if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
            e.preventDefault();
            handleQuickAction('Nouveau Patient');
        }
        
        // Ctrl/Cmd + R pour nouveau rendez-vous
        if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
            e.preventDefault();
            handleQuickAction('Nouveau Rendez-vous');
        }
        
        // Échap pour fermer les modals
        if (e.key === 'Escape') {
            closeModal();
            // Fermer aussi le dropdown
            if (accessDropdown) {
                accessDropdown.classList.remove('active');
            }
        }
    });

    // Fonction pour simuler la mise à jour des statistiques
    function updateDashboardStats() {
        const stats = document.querySelectorAll('.stat-number');
        stats.forEach(stat => {
            const currentValue = parseInt(stat.textContent);
            // Simulation d'une légère variation
            const variation = Math.floor(Math.random() * 3) - 1; // -1, 0, ou 1
            const newValue = Math.max(0, currentValue + variation);
            
            if (newValue !== currentValue) {
                stat.style.transform = 'scale(1.1)';
                stat.style.color = 'var(--success-color)';
                
                setTimeout(() => {
                    stat.textContent = newValue;
                    stat.style.transform = 'scale(1)';
                    stat.style.color = 'var(--primary-color)';
                }, 200);
            }
        });
    }

    // Mettre à jour les stats toutes les 5 minutes (simulation)
    setInterval(updateDashboardStats, 5 * 60 * 1000);

    // Initialisation terminée
    console.log('Dashboard médecin initialisé avec succès');
    
    // Afficher une notification de bienvenue
    setTimeout(() => {
        showNotification('Bienvenue dans votre espace médecin, Dr. Soumia!', 'success');
    }, 1000);
});

// Fonctions utilitaires globales
window.formatDate = function(date) {
    return new Intl.DateTimeFormat('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }).format(new Date(date));
};

window.formatTime = function(time) {
    return new Intl.DateTimeFormat('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
    }).format(new Date(time));
};

// Fonction pour exporter les données (placeholder)
window.exportData = function(type) {
    console.log(`Export des données: ${type}`);
    showNotification(`Export ${type} en cours...`, 'info');
    
    // Simulation d'export
    setTimeout(() => {
        showNotification(`Export ${type} terminé!`, 'success');
    }, 2000);
};

// Fonction pour imprimer (placeholder)
window.printReport = function(type) {
    console.log(`Impression du rapport: ${type}`);
    window.print();
};

// Fonction pour générer les rapports
window.generateReport = function(type) {
    showNotification(`Génération du rapport ${type}...`, 'info');
    
    setTimeout(() => {
        const reportData = getReportData(type);
        displayReportResults(type, reportData);
        showNotification(`Rapport ${type} généré avec succès!`, 'success');
    }, 1500);
};

// Fonction pour obtenir les données de rapport
function getReportData(type) {
    switch(type) {
        case 'patients':
            return {
                title: 'Rapport des Patients',
                data: [
                    { name: 'Amina Bensalem', phone: '0541706027', lastVisit: '15/01/2024', treatments: 3 },
                    { name: 'Youcef Meziane', phone: '0541706028', lastVisit: '12/01/2024', treatments: 5 },
                    { name: 'Fatima Boumediene', phone: '0541706029', lastVisit: '10/01/2024', treatments: 2 },
                    { name: 'Karim Hadj Ahmed', phone: '0541706030', lastVisit: '08/01/2024', treatments: 4 }
                ]
            };
        case 'appointments':
            return {
                title: 'Rapport des Rendez-vous',
                data: [
                    { date: '15/01/2024', time: '09:00', patient: 'Amina Bensalem', type: 'Consultation' },
                    { date: '15/01/2024', time: '10:30', patient: 'Youcef Meziane', type: 'Implant' },
                    { date: '15/01/2024', time: '14:00', patient: 'Fatima Boumediene', type: 'Esthétique' },
                    { date: '15/01/2024', time: '15:30', patient: 'Karim Hadj Ahmed', type: 'Hygiène' }
                ]
            };
        case 'financial':
            return {
                title: 'Rapport Financier',
                data: [
                    { month: 'Janvier 2024', revenue: '€45,230', consultations: 342, treatments: 156 },
                    { month: 'Décembre 2023', revenue: '€42,180', consultations: 328, treatments: 142 },
                    { month: 'Novembre 2023', revenue: '€38,950', consultations: 301, treatments: 134 }
                ]
            };
        case 'treatments':
            return {
                title: 'Rapport des Traitements',
                data: [
                    { treatment: 'Consultations', count: 342, revenue: '€17,100' },
                    { treatment: 'Implants', count: 45, revenue: '€22,500' },
                    { treatment: 'Blanchiments', count: 67, revenue: '€3,350' },
                    { treatment: 'Détartrages', count: 89, revenue: '€2,670' }
                ]
            };
        default:
            return { title: 'Rapport', data: [] };
    }
}

// Fonction pour afficher les résultats du rapport
function displayReportResults(type, reportData) {
    let tableHTML = `
        <div style="margin-top: 20px;">
            <h4>${reportData.title}</h4>
            <div style="overflow-x: auto; margin-top: 16px;">
                <table style="width: 100%; border-collapse: collapse; border: 1px solid var(--border-color);">
                    <thead style="background: #f8f8f8;">
    `;
    
    if (type === 'patients') {
        tableHTML += `
                        <tr>
                            <th style="padding: 12px; border: 1px solid var(--border-color); text-align: left;">Nom</th>
                            <th style="padding: 12px; border: 1px solid var(--border-color); text-align: left;">Téléphone</th>
                            <th style="padding: 12px; border: 1px solid var(--border-color); text-align: left;">Dernière visite</th>
                            <th style="padding: 12px; border: 1px solid var(--border-color); text-align: left;">Traitements</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        reportData.data.forEach(patient => {
            tableHTML += `
                        <tr>
                            <td style="padding: 12px; border: 1px solid var(--border-color);">${patient.name}</td>
                            <td style="padding: 12px; border: 1px solid var(--border-color);">${patient.phone}</td>
                            <td style="padding: 12px; border: 1px solid var(--border-color);">${patient.lastVisit}</td>
                            <td style="padding: 12px; border: 1px solid var(--border-color);">${patient.treatments}</td>
                        </tr>
            `;
        });
    } else if (type === 'appointments') {
        tableHTML += `
                        <tr>
                            <th style="padding: 12px; border: 1px solid var(--border-color); text-align: left;">Date</th>
                            <th style="padding: 12px; border: 1px solid var(--border-color); text-align: left;">Heure</th>
                            <th style="padding: 12px; border: 1px solid var(--border-color); text-align: left;">Patient</th>
                            <th style="padding: 12px; border: 1px solid var(--border-color); text-align: left;">Type</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        reportData.data.forEach(appointment => {
            tableHTML += `
                        <tr>
                            <td style="padding: 12px; border: 1px solid var(--border-color);">${appointment.date}</td>
                            <td style="padding: 12px; border: 1px solid var(--border-color);">${appointment.time}</td>
                            <td style="padding: 12px; border: 1px solid var(--border-color);">${appointment.patient}</td>
                            <td style="padding: 12px; border: 1px solid var(--border-color);">${appointment.type}</td>
                        </tr>
            `;
        });
    }
    
    tableHTML += `
                    </tbody>
                </table>
            </div>
            <div style="margin-top: 16px; display: flex; gap: 12px;">
                <button onclick="window.print()" style="padding: 8px 16px; background: var(--primary-color); color: white; border: none; border-radius: 4px; cursor: pointer;">
                    <i class="fas fa-print"></i> Imprimer
                </button>
                <button onclick="exportData('${type}')" style="padding: 8px 16px; background: var(--secondary-color); color: white; border: none; border-radius: 4px; cursor: pointer;">
                    <i class="fas fa-download"></i> Exporter
                </button>
            </div>
        </div>
    `;
    
    // Ajouter le tableau à la modal existante
    const modalContent = document.querySelector('.modal-overlay .grid');
    if (modalContent) {
        modalContent.innerHTML += tableHTML;
    }
}

// Fonction pour sauvegarder les paramètres
window.saveSettings = function() {
    showNotification('Sauvegarde des paramètres...', 'info');
    
    // Simuler la sauvegarde
    setTimeout(() => {
        showNotification('Paramètres sauvegardés avec succès!', 'success');
        closeModal();
    }, 1000);
};

// Fonction de déconnexion
function logout() {
    // Nettoyer le localStorage
    localStorage.removeItem('dentilus_remember');
    localStorage.removeItem('dentilus_email');
    localStorage.removeItem('dentilus_user_name');
    localStorage.removeItem('dentilus_login_time');
    
    // Afficher une notification
    showNotification('Déconnexion en cours...', 'info');
    
    // Notification avec navigation helper
    if (window.NavigationHelper) {
        NavigationHelper.showCrossSiteNotification('Déconnexion réussie. Redirection vers la page de connexion...', 'success');
    }
    
    // Rediriger vers la page de connexion après 1 seconde
    setTimeout(() => {
        window.location.href = '../login.html';
    }, 1000);
}

// Vérifier l'authentification au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    checkAuthentication();
    loadTodayAppointments();
    loadDashboardStats();
});

// Load today's appointments from API or localStorage
async function loadTodayAppointments() {
    try {
        // First try to load from API
        const token = localStorage.getItem('authToken');
        let appointments = [];
        
        if (token) {
            try {
                const response = await fetch('http://localhost:8000/api/appointments/today', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    const apiData = await response.json();
                    appointments = apiData.data || apiData;
                }
            } catch (apiError) {
                console.log('API non disponible, chargement des rendez-vous locaux');
            }
        }
        
        // If no API data, load from localStorage
        if (appointments.length === 0) {
            const localAppointments = JSON.parse(localStorage.getItem('pendingAppointments') || '[]');
            const today = new Date().toDateString();
            
            appointments = localAppointments.filter(apt => {
                if (!apt.appointment_date) return false;
                const aptDate = new Date(apt.appointment_date).toDateString();
                return aptDate === today;
            }).map(apt => ({
                id: apt.id,
                appointment_time: apt.appointment_time,
                notes: apt.notes,
                status: apt.status,
                patient: {
                    first_name: apt.patient_data.first_name,
                    last_name: apt.patient_data.last_name
                },
                service: {
                    name: getServiceNameById(apt.service_id)
                }
            }));
        }
        
        displayAppointments(appointments);
        
    } catch (error) {
        console.error('Erreur lors du chargement des rendez-vous:', error);
        displayAppointments([]);
    }
}

function getServiceNameById(serviceId) {
    const serviceNames = {
        1: 'Consultation',
        2: 'Dentisterie Esthétique',
        3: 'Implant Dentaire',
        4: 'Orthodontie',
        5: 'Endodontie',
        6: 'Hygiène Dentaire'
    };
    return serviceNames[serviceId] || 'Service non spécifié';
}

// Display appointments in the dashboard
function displayAppointments(appointments) {
    const appointmentList = document.querySelector('.appointment-list');
    if (!appointmentList) return;

    if (!appointments || appointments.length === 0) {
        appointmentList.innerHTML = '<li class="no-appointments">Aucun rendez-vous aujourd\'hui</li>';
        return;
    }

    appointmentList.innerHTML = appointments.map(appointment => {
        const patientName = appointment.patient ? 
            `${appointment.patient.first_name} ${appointment.patient.last_name}` : 
            'Patient inconnu';
        
        const serviceName = appointment.service ? 
            appointment.service.name : 
            'Service non spécifié';

        const appointmentTime = appointment.appointment_time ? 
            appointment.appointment_time.substring(0, 5) : 
            'Heure non définie';

        return `
            <li class="appointment-item">
                <div class="appointment-time">${appointmentTime}</div>
                <div class="appointment-patient">
                    <div class="patient-name">${patientName}</div>
                    <div class="patient-last-visit">${appointment.notes || 'Pas de notes'}</div>
                </div>
                <div class="appointment-type">${serviceName}</div>
                <div class="appointment-status status-${appointment.status}">
                    ${getStatusLabel(appointment.status)}
                </div>
            </li>
        `;
    }).join('');
}

// Get status label in French
function getStatusLabel(status) {
    const statusMap = {
        'scheduled': 'Programmé',
        'confirmed': 'Confirmé',
        'in_progress': 'En cours',
        'completed': 'Terminé',
        'cancelled': 'Annulé',
        'no_show': 'Absent'
    };
    return statusMap[status] || status;
}

// Load dashboard statistics
async function loadDashboardStats() {
    try {
        const token = localStorage.getItem('authToken');
        if (!token) return;

        const response = await fetch('http://localhost:8000/api/reports/dashboard', {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            const stats = await response.json();
            updateDashboardStats(stats.data || stats);
        }
    } catch (error) {
        console.error('Erreur lors du chargement des statistiques:', error);
    }
}

// Update dashboard statistics display
function updateDashboardStats(stats) {
    const statCards = document.querySelectorAll('.stat-card .stat-number');
    
    if (statCards[0] && stats.today_appointments !== undefined) {
        statCards[0].textContent = stats.today_appointments;
    }
    
    if (statCards[1] && stats.total_patients !== undefined) {
        statCards[1].textContent = stats.total_patients.toLocaleString();
    }
    
    if (statCards[2] && stats.pending_appointments !== undefined) {
        statCards[2].textContent = stats.pending_appointments;
    }
    
    if (statCards[3] && stats.satisfaction_rate !== undefined) {
        statCards[3].textContent = `${stats.satisfaction_rate}%`;
    }
}

// Check authentication
function checkAuthentication() {
    const isLoggedIn = localStorage.getItem('dentilus_remember') === 'true';
    const userEmail = localStorage.getItem('dentilus_email');
    
    if (!isLoggedIn || !userEmail) {
        // Rediriger vers la page de connexion si pas connecté
        if (window.NavigationHelper) {
            NavigationHelper.showCrossSiteNotification('Veuillez vous connecter pour accéder à l\'espace médecin', 'error');
        }
        setTimeout(() => {
            window.location.href = '../login.html';
        }, 2000);
    } else {
        // Afficher un message de bienvenue
        const userName = localStorage.getItem('dentilus_user_name') || 'Docteur';
        if (window.NavigationHelper) {
            NavigationHelper.showCrossSiteNotification(`Bienvenue ${userName}`, 'success');
        }
    }
}
