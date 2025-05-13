// App state management - using simple variables instead of localStorage
let isAuthenticated = false;
let userData = {
    username: '',
    email: ''
};

// Navigation
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', function() {
        // Remove active class from all nav items
        document.querySelectorAll('.nav-item').forEach(navItem => {
            navItem.classList.remove('active');
        });
        
        // Add active class to clicked nav item
        this.classList.add('active');
        
        // Hide all view containers
        document.querySelectorAll('.view-container').forEach(view => {
            view.classList.remove('active-view');
        });
        
        // Show the selected view container
        const viewId = this.getAttribute('data-view');
        document.getElementById(viewId).classList.add('active-view');
    });
});

// Untersuchungen buttons navigation
document.getElementById('btn-noetige').addEventListener('click', function() {
    showView('noetige-view');
});

document.getElementById('btn-geplante').addEventListener('click', function() {
    showView('geplante-view');
});

document.getElementById('btn-nicht-durchgefuehrte').addEventListener('click', function() {
    showView('nicht-durchgefuehrte-view');
});

document.getElementById('btn-erledigte').addEventListener('click', function() {
    showView('erledigte-view');
});

function showView(viewId) {
    // Hide all view containers
    document.querySelectorAll('.view-container').forEach(view => {
        view.classList.remove('active-view');
    });
    
    // Show the selected view container
    document.getElementById(viewId).classList.add('active-view');
}

// Data storage for examinations
let examinations = {
    noetige: [
        'Blutabnahme',
        'Blutdruck',
        'Gewicht'
    ],
    geplante: [
        'Zahnarzt (15.06.2025)',
        'Hautcheck (23.07.2025)'
    ],
    nichtDurchgefuehrte: [
        'Augenarzt',
        'Allergietest'
    ],
    erledigte: [
        'Blutabnahme (03.03.2025)',
        'Zahnarzt (10.01.2025)'
    ]
};

// Function to render examinations in a view
function renderExaminations(viewId, category) {
    const view = document.getElementById(viewId);
    const list = view.querySelector('.checkup-list');
    list.innerHTML = '';

    examinations[category].forEach((examination, index) => {
        const item = document.createElement('div');
        item.className = 'checkup-item';
        
        const icon = category === 'erledigte' ? '✓' : '>';
        if (category === 'erledigte') {
            item.classList.add('completed');
        }
        
        item.innerHTML = `
            <span>${examination}</span>
            <span class="icon">${icon}</span>
        `;
        
        // Add click event for expansion
        item.addEventListener('click', function(e) {
            if (e.target.classList.contains('action-btn')) return;
            
            this.classList.toggle('active');
            
            // If there's already a details section after this item, remove it
            if (this.nextElementSibling && this.nextElementSibling.classList.contains('checkup-details')) {
                this.nextElementSibling.remove();
            } else {
                // Create and insert details section
                const details = document.createElement('div');
                details.className = 'checkup-details';
                
                if (category === 'noetige') {
                    details.innerHTML = `
                        <h3>Untersuchung verwalten</h3>
                        <div class="examination-actions">
                            <button class="action-btn" onclick="moveExamination('${category}', ${index}, 'geplante')">
                                Zu Geplante
                            </button>
                            <button class="action-btn" onclick="moveExamination('${category}', ${index}, 'nichtDurchgefuehrte')">
                                Zu Nicht durchgeführte
                            </button>
                            <button class="action-btn secondary" onclick="moveExamination('${category}', ${index}, 'erledigte')">
                                Als Erledigt markieren
                            </button>
                        </div>
                    `;
                } else if (category === 'geplante') {
                    details.innerHTML = `
                        <h3>Details eintragen</h3>
                        <div class="form-group">
                            <label for="value">Wert</label>
                            <input type="text" class="form-control" id="value" placeholder="Wert eintragen">
                        </div>
                        <div class="form-group">
                            <label for="date">Datum</label>
                            <input type="date" class="form-control" id="date">
                        </div>
                        <div class="examination-actions">
                            <button class="action-btn secondary" onclick="moveExamination('${category}', ${index}, 'erledigte')">
                                Als Erledigt markieren
                            </button>
                        </div>
                    `;
                } else if (category === 'nichtDurchgefuehrte') {
                    details.innerHTML = `
                        <h3>Untersuchung verwalten</h3>
                        <div class="examination-actions">
                            <button class="action-btn" onclick="moveExamination('${category}', ${index}, 'noetige')">
                                Zurück zu Nötige
                            </button>
                            <button class="action-btn" onclick="moveExamination('${category}', ${index}, 'geplante')">
                                Zu Geplante
                            </button>
                            <button class="action-btn secondary" onclick="moveExamination('${category}', ${index}, 'erledigte')">
                                Als Erledigt markieren
                            </button>
                        </div>
                    `;
                } else {
                    details.innerHTML = `
                        <h3>Details eintragen</h3>
                        <div class="form-group">
                            <label for="value">Wert</label>
                            <input type="text" class="form-control" id="value" placeholder="Wert eintragen">
                        </div>
                        <div class="form-group">
                            <label for="date">Datum</label>
                            <input type="date" class="form-control" id="date">
                        </div>
                    `;
                }
                this.insertAdjacentElement('afterend', details);
            }
        });
        
        list.appendChild(item);
    });
}

// Function to move examination between categories
function moveExamination(fromCategory, index, toCategory) {
    const examination = examinations[fromCategory][index];
    
    // Remove from source category
    examinations[fromCategory].splice(index, 1);
    
    // Add to destination category
    if (toCategory === 'erledigte') {
        // Add current date for completed examinations
        const today = new Date().toLocaleDateString('de-DE');
        const examName = examination.replace(/\s*\(\d{2}\.\d{2}\.\d{4}\)/g, '');
        examinations[toCategory].push(`${examName} (${today})`);
    } else {
        examinations[toCategory].push(examination);
    }
    
    // Re-render the views
    renderExaminations('noetige-view', 'noetige');
    renderExaminations('geplante-view', 'geplante');
    renderExaminations('nicht-durchgefuehrte-view', 'nichtDurchgefuehrte');
    renderExaminations('erledigte-view', 'erledigte');
}

// Profile data management
let profileData = {
    gender: 'männlich',
    age: 45,
    height: '1.75',
    weight: '83'
};

// Update profile info display
function updateProfileDisplay() {
    const profileInfo = document.querySelector('#profile-view .profile-info');
    const genderText = profileData.gender === 'männlich' ? 'Männlich' : 'Weiblich';
    profileInfo.innerHTML = `
        <div class="info-pill">${genderText}</div>
        <div class="info-pill">${profileData.age} Jahre</div>
        <div class="info-pill">${profileData.height} m</div>
        <div class="info-pill">${profileData.weight} KG</div>
    `;
}

// Populate profile edit form
function populateEditForm() {
    const genderToggles = document.querySelectorAll('.toggle-option');
    genderToggles.forEach(toggle => {
        toggle.classList.remove('active');
        if (toggle.getAttribute('data-value') === profileData.gender) {
            toggle.classList.add('active');
        }
    });

    const inputs = document.querySelectorAll('.edit-input');
    inputs[0].value = profileData.age;
    inputs[1].value = profileData.height;
    inputs[2].value = profileData.weight;
}

// Authentication functions
function showAuthenticatedApp() {
    isAuthenticated = true;
    // Hide authentication views
    document.getElementById('registration-view').classList.remove('active-view');
    document.getElementById('login-view').classList.remove('active-view');
    // Show main app
    document.getElementById('untersuchungen-main-view').classList.add('active-view');
    // Show navigation bar
    document.querySelector('.nav-bar').style.display = 'block';
}

function showRegistration() {
    document.querySelectorAll('.view-container').forEach(view => {
        view.classList.remove('active-view');
    });
    document.getElementById('registration-view').classList.add('active-view');
}

function showLogin() {
    document.querySelectorAll('.view-container').forEach(view => {
        view.classList.remove('active-view');
    });
    document.getElementById('login-view').classList.add('active-view');
}

// Initialize app - start with registration
function initializeApp() {
    // Hide navigation bar initially
    document.querySelector('.nav-bar').style.display = 'none';
    // Show registration as the first page
    showRegistration();
}

// Initialize profile display
document.addEventListener('DOMContentLoaded', function() {
    updateProfileDisplay();
    renderExaminations('noetige-view', 'noetige');
    renderExaminations('geplante-view', 'geplante');
    renderExaminations('nicht-durchgefuehrte-view', 'nichtDurchgefuehrte');
    renderExaminations('erledigte-view', 'erledigte');
    
    // Edit profile button
    document.getElementById('edit-profile-btn').addEventListener('click', function() {
        populateEditForm();
        showView('profile-edit-view');
    });

    // Gender toggle functionality
    document.querySelectorAll('.toggle-option').forEach(toggle => {
        toggle.addEventListener('click', function() {
            document.querySelectorAll('.toggle-option').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Back button
    document.getElementById('back-btn').addEventListener('click', function() {
        showView('profile-view');
    });

    // Save button
    document.getElementById('save-btn').addEventListener('click', function() {
        const activeGender = document.querySelector('.toggle-option.active');
        profileData.gender = activeGender.getAttribute('data-value');
        
        const inputs = document.querySelectorAll('.edit-input');
        profileData.age = inputs[0].value;
        profileData.height = inputs[1].value;
        profileData.weight = inputs[2].value;
        
        updateProfileDisplay();
        showView('profile-view');
    });

    // Authentication event listeners
    document.getElementById('registration-form').addEventListener('submit', function(e) {
        // e.preventDefault();
        const vorname = document.querySelector('input[name="vorname"]').value;
        const nachname = document.querySelector('input[name="nachname"]').value;
        const password = document.querySelector('input[name="password"]').value;
        const alter = document.querySelector('input[name="alter"]').value;
        const geschlecht = document.querySelector('select[name="geschlecht"]').value;
        const groesse = document.querySelector('input[name="groesse_cm"]').value;
        const gewicht = document.querySelector('input[name="gewicht_kg"]').value;
        
        // Simple validation - all fields must be filled
        if (vorname && nachname && password && alter && geschlecht && groesse && gewicht) {
            // Store user data in memory (since localStorage is not available)
            userData = {
                vorname: vorname,
                nachname: nachname,
                alter: alter,
                geschlecht: geschlecht,
                groesse: groesse,
                gewicht: gewicht
            };
            
            // Update profile with registration data
            profileData = {
                age: alter,
                height: (parseFloat(groesse) / 100).toFixed(2), // Convert cm to m
                weight: gewicht,
                gender: geschlecht === 'm' ? 'männlich' : (geschlecht === 'w' ? 'weiblich' : 'divers')
            };
            
            alert('Registrierung erfolgreich! Sie werden jetzt zur Login-Seite weitergeleitet.');
            // Redirect to login page after registration
            showLogin();
        } else {
            alert('Bitte füllen Sie alle Felder aus');
        }
    });

    // Login form submission
    // document.getElementById('login-form').addEventListener('submit', function(e) {
    //     e.preventDefault();
    //     const vorname = document.querySelector('input[name="vorname"]').value;
    //     const nachname = document.querySelector('input[name="nachname"]').value;
        
    //     // Simple validation - check if user exists and credentials match
    //     if (vorname && nachname) {
    //         // Basic check if user has registered
    //         if (userData.vorname === vorname && userData.nachname === nachname) {
    //             showAuthenticatedApp();
    //         } else {
    //             alert('Ungültige Anmeldedaten. Bitte überprüfen Sie Ihre Eingaben oder registrieren Sie sich.');
    //         }
    //     } else {
    //         alert('Bitte füllen Sie alle Felder aus');
    //     }
    // });

    document.getElementById('to-login').addEventListener('click', showLogin);
    document.getElementById('to-register').addEventListener('click', showRegistration);

    // Initialize app - start with registration
    initializeApp();
});