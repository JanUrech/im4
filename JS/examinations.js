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
        // Prüfung: Ist der Eintrag ein Objekt mit id und name?
        const examName = typeof examination === 'object' && examination !== null ? examination.name : examination;
        const examId = typeof examination === 'object' && examination !== null ? examination.id : null;
        const item = document.createElement('div');
        item.className = 'checkup-item';
        const icon = category === 'erledigte' ? '✓' : '>';
        if (category === 'erledigte') {
            item.classList.add('completed');
        }
        item.innerHTML = `
            <span>${examName}</span>
            <span class="icon">${icon}</span>
        `;
        item.dataset.examId = examId;
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
                            <button class="action-btn" onclick="updateStatusAndMove('${category}', ${index}, 'geplante', 'geplant')">
                                Zu Geplante
                            </button>
                            <button class="action-btn" onclick="updateStatusAndMove('${category}', ${index}, 'nichtDurchgefuehrte', 'abgelehnt')">
                                Zu Nicht durchgeführte
                            </button>
                            <button class="action-btn secondary" onclick="updateStatusAndMove('${category}', ${index}, 'erledigte', 'erledigt')">
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
                            <button class="action-btn secondary" onclick="updateStatusAndMove('${category}', ${index}, 'erledigte', 'erledigt')">
                                Als Erledigt markieren
                            </button>
                        </div>
                    `;
                } else if (category === 'nichtDurchgefuehrte') {
                    details.innerHTML = `
                        <h3>Untersuchung verwalten</h3>
                        <div class="examination-actions">
                            <button class="action-btn" onclick="updateStatusAndMove('${category}', ${index}, 'noetige', 'offen')">
                                Zurück zu Nötige
                            </button>
                            <button class="action-btn" onclick="updateStatusAndMove('${category}', ${index}, 'geplante', 'geplant')">
                                Zu Geplante
                            </button>
                            <button class="action-btn secondary" onclick="updateStatusAndMove('${category}', ${index}, 'erledigte', 'erledigt')">
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

// Neue Funktion zum Status-Update und Verschieben
window.updateStatusAndMove = function(fromCategory, index, toCategory, newStatus) {
    const examination = examinations[fromCategory][index];
    // Annahme: Der Name ist eindeutig und entspricht dem Wert in der DB
    // Hole die ID aus dem Backend oder speichere sie im JS, falls nötig
    fetch('/php/update_examination_status.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `untersuchungen_id=${encodeURIComponent(getExaminationId(examination))}&status=${encodeURIComponent(newStatus)}`
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            moveExamination(fromCategory, index, toCategory);
        } else {
            alert('Status konnte nicht aktualisiert werden!');
        }
    })
    .catch(() => alert('Fehler beim Status-Update!'));
};

// Dummy-Funktion: Hier muss die ID der Untersuchung aus dem Namen ermittelt werden
function getExaminationId(examination) {
    // Wenn examination ein Objekt ist, gib die id zurück
    if (typeof examination === 'object' && examination.id) {
        return examination.id;
    }
    // Fallback: Suche nach Name
    for (const cat of Object.values(examinations)) {
        for (const ex of cat) {
            if (typeof ex === 'object' && ex.name === examination) {
                return ex.id;
            }
        }
    }
    return 0;
}

// Untersuchung zwischen Kategorien verschieben
window.moveExamination = function(fromCategory, index, toCategory) {
    const examination = examinations[fromCategory][index];
    examinations[fromCategory].splice(index, 1);
    let newExam = examination;
    if (toCategory === 'erledigte') {
        const today = new Date().toLocaleDateString('de-DE');
        if (typeof examination === 'object' && examination !== null) {
            newExam = { ...examination, name: `${examination.name} (${today})` };
        } else {
            newExam = `${examination} (${today})`;
        }
    }
    examinations[toCategory].push(newExam);
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