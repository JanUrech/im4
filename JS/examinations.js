// examinations.js – Für die Anzeige und Verwaltung von Untersuchungen
console.log("examinations.js geladen"); // Sagt in der Konsole: Das Skript ist gestartet

// Hier speichern wir alle Untersuchungen, die wir vom Server bekommen
let examinations = {
    noetige: [], // Untersuchungen, die noch gemacht werden müssen
    geplante: [], // Untersuchungen, die schon geplant sind
    nichtDurchgefuehrte: [], // Untersuchungen, die abgelehnt wurden
    erledigte: [] // Untersuchungen, die schon erledigt sind
};

function saveExaminations() {
    // Speichert die Untersuchungen im Browser, damit sie nicht verloren gehen
    localStorage.setItem('examinations', JSON.stringify(examinations));
}

// Diese Funktion zeigt die Untersuchungen auf der Seite an
function renderExaminations(containerId, category) {
    const list = document.getElementById(containerId); // Holt das Feld, wo die Untersuchungen stehen sollen
    if (!list) return; // Wenn es das Feld nicht gibt, mache nichts
    list.innerHTML = '';

    // Für jede Untersuchung in der Kategorie:
    examinations[category].forEach((examination, index) => {
        // Hole den Namen und die ID der Untersuchung
        const examName = typeof examination === 'object' && examination !== null ? examination.name : examination;
        const examId = typeof examination === 'object' && examination !== null ? examination.id : null;
        const item = document.createElement('div'); // Mache ein neues Feld für die Untersuchung
        item.className = 'checkup-item';
        const icon = category === 'erledigte' ? '✓' : '>';
        if (category === 'erledigte') {
            item.classList.add('completed'); // Wenn erledigt, mache es grün
        }
        item.innerHTML = `
            <span>${examName}</span>
            <span class="icon">${icon}</span>
        `;
        item.dataset.examId = examId;
        // Wenn man auf die Untersuchung klickt, zeigt sie mehr Knöpfe an
        item.addEventListener('click', function(e) {
            if (e.target.classList.contains('action-btn')) return;
            this.classList.toggle('active');
            if (this.nextElementSibling && this.nextElementSibling.classList.contains('checkup-details')) {
                this.nextElementSibling.remove();
            } else {
                const details = document.createElement('div');
                details.className = 'checkup-details';
                // Je nach Kategorie gibt es andere Knöpfe
                if (category === 'noetige') {
                    details.innerHTML = `
                        <h3>Untersuchung verwalten</h3>
                        <div class="form-group">
                            <label for="last-date-${examId}">Letzter Untersuch</label>
                            <input type="date" class="form-control" id="last-date-${examId}">
                        </div>
                        <div class="form-group">
                            <label for="next-date-${examId}">Geplanter Untersuch</label>
                            <input type="date" class="form-control" id="next-date-${examId}">
                        </div>
                        <div class="examination-actions">
                            <button class="action-btn" onclick="rejectNoetige('${category}', ${index})">
                                Ablehnen
                            </button>
                            <button class="action-btn secondary" onclick="saveNoetigeDates('${category}', ${index})">
                                Speichern
                            </button>
                        </div>
                    `;
                } else if (category === 'geplante' || category === 'erledigte') {
                    // Hole das gespeicherte Datum aus dem Objekt, falls vorhanden
                    let dateValue = '';
                    if (category === 'erledigte') {
                        if (typeof examination === 'object' && examination.letzte_untersuchung && examination.letzte_untersuchung !== 'null' && examination.letzte_untersuchung !== null && examination.letzte_untersuchung !== '') {
                            dateValue = examination.letzte_untersuchung.split('T')[0];
                        }
                    } else {
                        let nextExamDate = '';
                        if (typeof examination === 'object' && examination !== null) {
                            if (examination.naechste_untersuchung && examination.naechste_untersuchung !== 'null' && examination.naechste_untersuchung !== null && examination.naechste_untersuchung !== '') {
                                nextExamDate = examination.naechste_untersuchung;
                            } else if (
                                examination.nutzer_untersuchung &&
                                examination.nutzer_untersuchung.naechste_untersuchung &&
                                examination.nutzer_untersuchung.naechste_untersuchung !== 'null' &&
                                examination.nutzer_untersuchung.naechste_untersuchung !== null &&
                                examination.nutzer_untersuchung.naechste_untersuchung !== ''
                            ) {
                                nextExamDate = examination.nutzer_untersuchung.naechste_untersuchung;
                            }
                        }
                        if (nextExamDate && !isNaN(Date.parse(nextExamDate))) {
                            dateValue = nextExamDate.split('T')[0];
                        }
                    }
                    details.innerHTML = `
                        <h3>Details eintragen</h3>
                        <div class="form-group">
                            <label for="value-${examId}">Arzt</label>
                            <input id="value-${examId}" class="form-control" type="text" placeholder="Arzt wählen">
                        </div>
                        <div class="form-group">
                            <label for="date">Datum</label>
                            <input type="date" class="form-control" id="date-${examId}"${dateValue ? ` value="${dateValue}"` : ''}>
                        </div>
                        <div class="examination-actions">
                            <button class="action-btn secondary" onclick="saveExaminationDate('${category}', ${index})">
                                Speichern
                            </button>
                            ${category === 'geplante' ? `<button class="action-btn secondary" onclick="updateStatusAndMove('${category}', ${index}, 'erledigte', 'erledigt')">Als Erledigt markieren</button>` : ''}
                        </div>
                    `;
                } else if (category === 'nichtDurchgefuehrte') {
                    details.innerHTML = `
                        <h3>Untersuchung verwalten</h3>
                        <div class="examination-actions">
                            <button class="action-btn" onclick="updateStatusAndMove('${category}', ${index}, 'noetige', 'offen')">
                                Zurück zu Nötige
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
                if (window.initArztDropdowns) window.initArztDropdowns();
            }
        });
        list.appendChild(item);
    });
}

// Diese Funktion schickt an den Server, dass sich der Status geändert hat und verschiebt die Untersuchung
window.updateStatusAndMove = function(fromCategory, index, toCategory, newStatus) {
    const examination = examinations[fromCategory][index];
    // Sagt dem Server: Ändere den Status!
    fetch('/php/update_examination_status.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `untersuchungen_id=${encodeURIComponent(getExaminationId(examination))}&status=${encodeURIComponent(newStatus)}`
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            moveExamination(fromCategory, index, toCategory); // Verschiebe die Untersuchung in die neue Kategorie
        } else {
            alert('Status konnte nicht aktualisiert werden!');
        }
    })
    .catch(() => alert('Fehler beim Status-Update!'));
};

// Diese Funktion holt die ID der Untersuchung
function getExaminationId(examination) {
    // Wenn es ein Objekt ist, nimm die id
    if (typeof examination === 'object' && examination.id) {
        return examination.id;
    }
    // Sonst suche nach dem Namen
    for (const cat of Object.values(examinations)) {
        for (const ex of cat) {
            if (typeof ex === 'object' && ex.name === examination) {
                return ex.id;
            }
        }
    }
    return 0; // Wenn nichts gefunden, gib 0 zurück
}

// Diese Funktion verschiebt die Untersuchung in eine andere Kategorie
window.moveExamination = function(fromCategory, index, toCategory) {
    const examination = examinations[fromCategory][index];
    examinations[fromCategory].splice(index, 1); // Löscht die Untersuchung aus der alten Kategorie
    let newExam = examination;
    if (toCategory === 'erledigte') {
        const today = new Date().toLocaleDateString('de-DE');
        if (typeof examination === 'object' && examination !== null) {
            newExam = { ...examination, name: `${examination.name} (${today})` };
        } else {
            newExam = `${examination} (${today})`;
        }
    }
    examinations[toCategory].push(newExam); // Fügt die Untersuchung in die neue Kategorie ein
    saveExaminations();
    // Zeigt die neue Liste an
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

// Diese Funktion schaut, auf welcher Seite wir gerade sind
function getCurrentPage() {
    const path = window.location.pathname;
    const page = path.substring(path.lastIndexOf('/') + 1);
    return page.split('.')[0] || 'index';
}

// Holt die Untersuchungen vom Server und zeigt sie an
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
        examinations = data; // Speichert die Untersuchungen
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

// Funktion zum Speichern des Datums in die Datenbank
window.saveExaminationDate = function(category, index) {
    const examination = examinations[category][index];
    const examId = typeof examination === 'object' && examination !== null ? examination.id : null;
    const dateValue = document.getElementById(`date-${examId}`).value;
    if (!dateValue) {
        alert('Bitte ein Datum eingeben!');
        return;
    }
    let body = `untersuchungen_id=${encodeURIComponent(examId)}`;
    if (category === 'geplante') {
        body += `&naechste_untersuchung=${encodeURIComponent(dateValue)}`;
    } else if (category === 'erledigte') {
        body += `&letzte_untersuchung=${encodeURIComponent(dateValue)}`;
    }
    fetch('/php/update_examination_status.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            // Aktualisiere das Datum auch im lokalen Objekt, damit es beim erneuten Öffnen angezeigt wird
            if (typeof examination === 'object' && examination !== null) {
                if (category === 'geplante' && 'naechste_untersuchung' in examination) {
                    examination.naechste_untersuchung = dateValue;
                } else if (category === 'geplante' && examination.nutzer_untersuchung && typeof examination.nutzer_untersuchung === 'object') {
                    examination.nutzer_untersuchung.naechste_untersuchung = dateValue;
                } else if (category === 'erledigte' && 'letzte_untersuchung' in examination) {
                    examination.letzte_untersuchung = dateValue;
                }
            }
            alert('Datum gespeichert!');
        } else {
            alert('Datum konnte nicht gespeichert werden!');
        }
    })
    .catch(() => alert('Fehler beim Speichern des Datums!'));
}

// Neue Funktion zum Speichern der Daten für nötige Untersuchungen
window.saveNoetigeDates = function(category, index) {
    const examination = examinations[category][index];
    const examId = typeof examination === 'object' && examination !== null ? examination.id : null;
    const lastDate = document.getElementById(`last-date-${examId}`).value;
    const nextDate = document.getElementById(`next-date-${examId}`).value;
    if (!lastDate && !nextDate) {
        alert('Bitte mindestens ein Datum eingeben!');
        return;
    }
    let body = `untersuchungen_id=${encodeURIComponent(examId)}`;
    if (lastDate) body += `&letzte_untersuchung=${encodeURIComponent(lastDate)}`;
    if (nextDate) body += `&naechste_untersuchung=${encodeURIComponent(nextDate)}`;
    fetch('/php/update_examination_status.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            alert('Datum gespeichert!');
        } else {
            alert('Datum konnte nicht gespeichert werden!');
        }
    })
    .catch(() => alert('Fehler beim Speichern des Datums!'));
}

// Funktion für Ablehnen-Button bei nötigen Untersuchungen
window.rejectNoetige = function(category, index) {
    const examination = examinations[category][index];
    const examId = typeof examination === 'object' && examination !== null ? examination.id : null;
    fetch('/php/update_examination_status.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `untersuchungen_id=${encodeURIComponent(examId)}&status=abgelehnt`
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            moveExamination(category, index, 'nichtDurchgefuehrte');
        } else {
            alert('Status konnte nicht aktualisiert werden!');
        }
    })
    .catch(() => alert('Fehler beim Status-Update!'));
}