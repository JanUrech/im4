// Single JS file for all pages
document.addEventListener('DOMContentLoaded', function() {
    // Get current page
    const currentPage = getCurrentPage();
    
    // Initialize based on current page
    switch(currentPage) {
        case 'index':
            initializeRegistration();
            break;
        case 'login':
            initializeLogin();
            break;
        case 'untersuchungen':
            loadPage();
            initializeUntersuchungen();
            break;
        case 'noetige':
        case 'geplante':
        case 'nicht-durchgefuehrte':
        case 'erledigte':
            loadPage();
            initializeExaminationList();
            break;
        case 'profil':
            loadPage();
            initializeProfile();
            break;
        case 'profil-bearbeiten':
            loadPage();
            initializeProfileEdit();
            break;
    }
});

// Get current page name from URL
function getCurrentPage() {
    const path = window.location.pathname;
    const page = path.substring(path.lastIndexOf('/') + 1);
    return page.split('.')[0] || 'index';
}

// Common functionality
let isAuthenticated = JSON.parse(localStorage.getItem('isAuthenticated') || 'false');
let userData = JSON.parse(localStorage.getItem('userData') || '{}');

function checkAuth() {
    if (!isAuthenticated) {
        window.location.href = 'index.html';
        return false;
    }
    return true;
}

function saveAuth(authenticated) {
    isAuthenticated = authenticated;
    localStorage.setItem('isAuthenticated', JSON.stringify(authenticated));
}

function saveUserData(data) {
    userData = data;
    localStorage.setItem('userData', JSON.stringify(data));
}

function navigateTo(page) {
    switch(page) {
        case 'profil':
            window.location.href = 'profil.html';
            break;
        case 'untersuchungen':
            window.location.href = 'untersuchungen.html';
            break;
        case 'noetige':
            window.location.href = 'noetige.html';
            break;
        case 'geplante':
            window.location.href = 'geplante.html';
            break;
        case 'nicht-durchgefuehrte':
            window.location.href = 'nicht-durchgefuehrte.html';
            break;
        case 'erledigte':
            window.location.href = 'erledigte.html';
            break;
    }
}

function initializeNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const view = this.getAttribute('data-view');
            navigateTo(view);
        });
    });
}

function loadPage() {
    checkAuth();
    initializeNavigation();
}

// Data storage for examinations
let examinations = JSON.parse(localStorage.getItem('examinations') || JSON.stringify({
    noetige: ['Blutabnahme', 'Blutdruck', 'Gewicht'],
    geplante: ['Zahnarzt (15.06.2025)', 'Hautcheck (23.07.2025)'],
    nichtDurchgefuehrte: ['Augenarzt', 'Allergietest'],
    erledigte: ['Blutabnahme (03.03.2025)', 'Zahnarzt (10.01.2025)']
}));

function saveExaminations() {
    localStorage.setItem('examinations', JSON.stringify(examinations));
}

// Profile data management
let profileData = JSON.parse(localStorage.getItem('profileData') || JSON.stringify({
    gender: 'männlich',
    age: 45,
    height: '1.75',
    weight: '83'
}));

function saveProfileData() {
    localStorage.setItem('profileData', JSON.stringify(profileData));
}

// Registration page
function initializeRegistration() {
    const form = document.getElementById('registration-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = {
                vorname: document.querySelector('input[name="vorname"]').value,
                nachname: document.querySelector('input[name="nachname"]').value,
                email: document.querySelector('input[name="email"]').value,
                password: document.querySelector('input[name="password"]').value,
                alter: document.querySelector('input[name="alter_jahre"]').value,
                geschlecht: document.querySelector('select[name="geschlecht"]').value,
                groesse: document.querySelector('input[name="groesse_cm"]').value,
                gewicht: document.querySelector('input[name="gewicht_kg"]').value
            };
            
            if (Object.values(formData).every(value => value !== '')) {
                saveUserData(formData);
                
                profileData = {
                    age: formData.alter,
                    height: (parseFloat(formData.groesse) / 100).toFixed(2),
                    weight: formData.gewicht,
                    gender: formData.geschlecht === 'm' ? 'männlich' : (formData.geschlecht === 'w' ? 'weiblich' : 'divers')
                };
                saveProfileData();
                
                alert('Registrierung erfolgreich! Sie werden jetzt zur Login-Seite weitergeleitet.');
                window.location.href = 'login.html';
            } else {
                alert('Bitte füllen Sie alle Felder aus');
            }
        });
    }

    const toLogin = document.getElementById('to-login');
    if (toLogin) {
        toLogin.addEventListener('click', function() {
            window.location.href = 'login.html';
        });
    }
}

// Login page
function initializeLogin() {
    const form = document.getElementById('login-form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.querySelector('#user-email').value;
            const password = document.querySelector('#user-password').value;
            
            if (email && password) {
                if (userData.email === email && userData.password === password) {
                    saveAuth(true);
                    window.location.href = 'untersuchungen.html';
                } else {
                    alert('Ungültige Anmeldedaten. Bitte überprüfen Sie Ihre Eingaben oder registrieren Sie sich.');
                }
            } else {
                alert('Bitte füllen Sie alle Felder aus');
            }
        });
    }

    const toRegister = document.getElementById('to-register');
    if (toRegister) {
        toRegister.addEventListener('click', function() {
            window.location.href = 'index.html';
        });
    }
}

// Untersuchungen main page
function initializeUntersuchungen() {
    document.getElementById('btn-noetige').addEventListener('click', function() {
        navigateTo('noetige');
    });

    document.getElementById('btn-geplante').addEventListener('click', function() {
        navigateTo('geplante');
    });

    document.getElementById('btn-nicht-durchgefuehrte').addEventListener('click', function() {
        navigateTo('nicht-durchgefuehrte');
    });

    document.getElementById('btn-erledigte').addEventListener('click', function() {
        navigateTo('erledigte');
    });
}

// Examination list pages
function initializeExaminationList() {
    const currentPage = getCurrentPage();
    let category, containerId;
    
    switch(currentPage) {
        case 'noetige':
            category = 'noetige';
            containerId = 'noetige-list';
            break;
        case 'geplante':
            category = 'geplante';
            containerId = 'geplante-list';
            break;
        case 'nicht-durchgefuehrte':
            category = 'nichtDurchgefuehrte';
            containerId = 'nicht-durchgefuehrte-list';
            break;
        case 'erledigte':
            category = 'erledigte';
            containerId = 'erledigte-list';
            break;
    }
    
    renderExaminations(containerId, category);
}

function renderExaminations(containerId, category) {
    const list = document.getElementById(containerId);
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
        
        item.addEventListener('click', function(e) {
            if (e.target.classList.contains('action-btn')) return;
            
            this.classList.toggle('active');
            
            if (this.nextElementSibling && this.nextElementSibling.classList.contains('checkup-details')) {
                this.nextElementSibling.remove();
            } else {
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

window.moveExamination = function(fromCategory, index, toCategory) {
    const examination = examinations[fromCategory][index];
    
    examinations[fromCategory].splice(index, 1);
    
    if (toCategory === 'erledigte') {
        const today = new Date().toLocaleDateString('de-DE');
        const examName = examination.replace(/\s*\(\d{2}\.\d{2}\.\d{4}\)/g, '');
        examinations[toCategory].push(`${examName} (${today})`);
    } else {
        examinations[toCategory].push(examination);
    }
    
    saveExaminations();
    
    // Re-render current view
    const currentPage = getCurrentPage();
    initializeExaminationList();
}

// Profile page
function initializeProfile() {
    updateProfileDisplay();
    
    const editBtn = document.getElementById('edit-profile-btn');
    if (editBtn) {
        editBtn.addEventListener('click', function() {
            window.location.href = 'profil-bearbeiten.html';
        });
    }
}

function updateProfileDisplay() {
    const profileInfo = document.querySelector('.profile-info');
    if (profileInfo) {
        const genderText = profileData.gender === 'männlich' ? 'Männlich' : 'Weiblich';
        profileInfo.innerHTML = `
            <div class="info-pill">${genderText}</div>
            <div class="info-pill">${profileData.age} Jahre</div>
            <div class="info-pill">${profileData.height} m</div>
            <div class="info-pill">${profileData.weight} KG</div>
        `;
    }
}

// Profile edit page
function initializeProfileEdit() {
    populateEditForm();
    
    document.querySelectorAll('.toggle-option').forEach(toggle => {
        toggle.addEventListener('click', function() {
            document.querySelectorAll('.toggle-option').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    const backBtn = document.getElementById('back-btn');
    if (backBtn) {
        backBtn.addEventListener('click', function() {
            window.location.href = 'profil.html';
        });
    }
    
    const saveBtn = document.getElementById('save-btn');
    if (saveBtn) {
        saveBtn.addEventListener('click', function() {
            const activeGender = document.querySelector('.toggle-option.active');
            profileData.gender = activeGender.getAttribute('data-value');
            
            const inputs = document.querySelectorAll('.edit-input');
            profileData.age = inputs[0].value;
            profileData.height = inputs[1].value;
            profileData.weight = inputs[2].value;
            
            saveProfileData();
            window.location.href = 'profil.html';
        });
    }
}

function populateEditForm() {
    const genderToggles = document.querySelectorAll('.toggle-option');
    genderToggles.forEach(toggle => {
        toggle.classList.remove('active');
        if (toggle.getAttribute('data-value') === profileData.gender) {
            toggle.classList.add('active');
        }
    });

    const inputs = document.querySelectorAll('.edit-input');
    if (inputs.length >= 3) {
        inputs[0].value = profileData.age;
        inputs[1].value = profileData.height;
        inputs[2].value = profileData.weight;
    }
}