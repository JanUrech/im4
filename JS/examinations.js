// examinations.js – Für die Anzeige und Verwaltung von Untersuchungen
console.log("examinations.js geladen");

// Datenobjekt für Untersuchungen (initial leer, wird vom Server geladen)
let examinations = {
    noetige: [],
    geplante: [],
    nichtDurchgefuehrte: [],
    erledigte: []
};

function saveExaminations() {
    // Nur optional, falls clientseitige Speicherung gewünscht ist
    localStorage.setItem('examinations', JSON.stringify(examinations));
}

// Funktion zur Darstellung der Untersuchungen im DOM
function renderExaminations(containerId, category) {
    const list = document.getElementById(containerId);
    if (!list) return;
    
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

// Untersuchung zwischen Kategorien verschieben
window.moveExamination = function(fromCategory, index, toCategory) {
    const examination = examinations[fromCategory][index];
    
    examinations[fromCategory].splice(index, 1);
    
    if (toCategory === 'erledigte') {
        const today = new Date().toLocaleDateString('de-DE');
        const examName = examination.replace(/\s*\(\d{2}\.\d{2}\.\d{4}\)/g, '').replace(/ \(zuletzt am.*\)/, '');
        examinations[toCategory].push(`${examName} (${today})`);
    } else {
        examinations[toCategory].push(examination);
    }
    
    saveExaminations();

    const currentPage = getCurrentPage();
    if (currentPage === 'noetige') {
        renderExaminations('noetige-list', 'noetige');
    } else if (currentPage === 'geplante') {
        renderExaminations('geplante-list', 'geplante');
    } else if (currentPage === 'nicht-durchgefuehrte') {
        renderExaminations('nicht-durchgefuehrte-list', 'nichtDurchgefuehrte');
    } else if (currentPage === 'erledigte') {
        renderExaminations('erledigte-list', 'erledigte');
    }
}

// Ermitteln der aktuellen Unterseite
function getCurrentPage() {
    const path = window.location.pathname;
    const page = path.substring(path.lastIndexOf('/') + 1);
    return page.split('.')[0] || 'index';
}

// Untersuchungen vom Backend laden
fetch('/php/sync_examinations.php')
    .then(response => {
        if (!response.ok) {
            throw new Error("Serverantwort nicht ok: " + response.status);
        }
        return response.json();
    })
    .then(data => {
        if (data.error) {
            console.error("Fehler in Daten:", data.error);
            return;
        }

        examinations = data;

        const currentPage = getCurrentPage();
        if (currentPage === 'noetige') {
            renderExaminations('noetige-list', 'noetige');
        } else if (currentPage === 'geplante') {
            renderExaminations('geplante-list', 'geplante');
        } else if (currentPage === 'nicht-durchgefuehrte') {
            renderExaminations('nicht-durchgefuehrte-list', 'nichtDurchgefuehrte');
        } else if (currentPage === 'erledigte') {
            renderExaminations('erledigte-list', 'erledigte');
        }
    })
    .catch(error => {
        console.error("Fehler beim Abrufen der Daten:", error.message);
    });