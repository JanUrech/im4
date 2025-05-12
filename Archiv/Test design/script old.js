// Benutzerdaten (in einer realen App würden diese aus einer Datenbank kommen)
const user = {
    id: 1,
    name: "Max Mustermann",
    email: "max@example.com",
    age: 45,
    gender: "männlich",
    weight: 83,
    height: 175,
    riskFactors: ["Raucher", "Hoher Cholesterinspiegel"]
};

// Empfohlene Untersuchungen basierend auf Alter, Geschlecht und Risikofaktoren
const recommendedCheckups = [
    {
        id: 1,
        name: "Augenuntersuchung",
        description: "Überprüfung der Sehkraft und Augengesundheit",
        frequency: "jährlich",
        completed: false,
        appointment: null
    },
    {
        id: 2,
        name: "Prostata",
        description: "Prostatauntersuchung zur Früherkennung von Prostatakrebs",
        frequency: "jährlich",
        completed: false,
        appointment: null
    },
    {
        id: 3,
        name: "Zeckenimpfung",
        description: "Impfung gegen FSME (Frühsommer-Meningoenzephalitis)",
        frequency: "alle 5 Jahre",
        completed: false,
        appointment: {
            doctor: {
                name: "",
                address: "",
                phone: ""
            },
            date: "",
            time: ""
        }
    }
];

// Funktion zum Anzeigen der Untersuchungen
function displayCheckups() {
    const checkupList = document.getElementById('checkupList');
    checkupList.innerHTML = '';

    recommendedCheckups.forEach(checkup => {
        const checkupItem = document.createElement('div');
        checkupItem.className = `checkup-item ${checkup.completed ? 'completed' : ''}`;
        checkupItem.setAttribute('data-id', checkup.id);
        
        checkupItem.innerHTML = `
            <div class="checkup-name">${checkup.name}</div>
            <div class="icon">${checkup.completed ? '✓' : '>'}</div>
        `;

        checkupItem.addEventListener('click', () => toggleCheckupDetails(checkup.id));
        
        checkupList.appendChild(checkupItem);
        
        // Wenn ein Termin bereits angelegt wurde, Details anzeigen
        if (checkup.appointment && (checkup.appointment.doctor.name || checkup.appointment.date)) {
            toggleCheckupDetails(checkup.id);
        }
    });
}

// Funktion zum Ein-/Ausklappen der Untersuchungsdetails
function toggleCheckupDetails(checkupId) {
    const checkupItem = document.querySelector(`.checkup-item[data-id="${checkupId}"]`);
    const existingDetails = document.querySelector(`.checkup-details[data-id="${checkupId}"]`);
    
    // Wenn die Details bereits angezeigt werden, entferne sie
    if (existingDetails) {
        existingDetails.remove();
        checkupItem.classList.remove('active');
        if (checkupItem.classList.contains('completed')) {
            checkupItem.querySelector('.icon').textContent = '✓';
        } else {
            checkupItem.querySelector('.icon').textContent = '>';
        }
        return;
    }
    
    // Schließe alle anderen geöffneten Details
    document.querySelectorAll('.checkup-details').forEach(detail => detail.remove());
    document.querySelectorAll('.checkup-item').forEach(item => {
        item.classList.remove('active');
        if (item.classList.contains('completed')) {
            item.querySelector('.icon').textContent = '✓';
        } else {
            item.querySelector('.icon').textContent = '>';
        }
    });
    
    // Finde die aktuelle Untersuchung
    const checkup = recommendedCheckups.find(c => c.id === checkupId);
    
    // Erstelle das Detailelement
    const detailsElement = document.createElement('div');
    detailsElement.className = 'checkup-details';
    detailsElement.setAttribute('data-id', checkupId);
    
    // Wenn die Untersuchung "Zeckenimpfung" ist, zeige das Formular an
    if (checkup.name === "Zeckenimpfung") {
        detailsElement.innerHTML = `
            <h3>wo führen sie die Untersuchung durch ?</h3>
            <div class="form-group">
                <input type="text" class="form-control" id="doctorName" placeholder="Name des Arztes" value="${checkup.appointment?.doctor?.name || ''}">
            </div>
            <div class="form-group">
                <input type="text" class="form-control" id="doctorAddress" placeholder="Adresse" value="${checkup.appointment?.doctor?.address || ''}">
            </div>
            <div class="form-group">
                <input type="tel" class="form-control" id="doctorPhone" placeholder="Telefon" value="${checkup.appointment?.doctor?.phone || ''}">
            </div>
            <h3>Wann führen sie die Untersuchung durch ?</h3>
            <div class="form-group">
                <input type="date" class="form-control" id="appointmentDate" placeholder="Datum" value="${checkup.appointment?.date || ''}">
            </div>
            <div class="form-group">
                <input type="time" class="form-control" id="appointmentTime" placeholder="Zeit" value="${checkup.appointment?.time || ''}">
            </div>
        `;
    } else {
        // Für andere Untersuchungen zeigen wir nur das grundlegende Formular
        detailsElement.innerHTML = `
            <h3>Details für ${checkup.name}</h3>
            <p>${checkup.description}</p>
            <p>Empfohlene Häufigkeit: ${checkup.frequency}</p>
            <h3>Termin vereinbaren</h3>
            <div class="form-group">
                <input type="text" class="form-control" placeholder="Name des Arztes">
            </div>
            <div class="form-group">
                <input type="text" class="form-control" placeholder="Adresse">
            </div>
            <div class="form-group">
                <input type="date" class="form-control" placeholder="Datum">
            </div>
        `;
    }
    
    // Füge die Details nach dem checkupItem ein
    checkupItem.after(detailsElement);
    checkupItem.classList.add('active');
    checkupItem.querySelector('.icon').textContent = 'V';
    
    // Eventlistener für Formulare
    if (checkup.name === "Zeckenimpfung") {
        const saveAppointment = () => {
            const doctorName = document.getElementById('doctorName').value;
            const doctorAddress = document.getElementById('doctorAddress').value;
            const doctorPhone = document.getElementById('doctorPhone').value;
            const appointmentDate = document.getElementById('appointmentDate').value;
            const appointmentTime = document.getElementById('appointmentTime').value;
            
            // Update der Termindaten im Objekt
            checkup.appointment = {
                doctor: {
                    name: doctorName,
                    address: doctorAddress,
                    phone: doctorPhone
                },
                date: appointmentDate,
                time: appointmentTime
            };
            
            // Wenn alle Felder ausgefüllt sind, markiere als abgeschlossen
            if (doctorName && doctorAddress && appointmentDate) {
                checkup.completed = true;
                checkupItem.classList.add('completed');
                checkupItem.querySelector('.icon').textContent = '✓';
            }
            
            // Speichere in localStorage (für Persistenz zwischen Seitenaufrufen)
            saveToLocalStorage();
        };
        
        // Event-Listener für Änderungen
        document.getElementById('doctorName').addEventListener('change', saveAppointment);
        document.getElementById('doctorAddress').addEventListener('change', saveAppointment);
        document.getElementById('doctorPhone').addEventListener('change', saveAppointment);
        document.getElementById('appointmentDate').addEventListener('change', saveAppointment);
        document.getElementById('appointmentTime').addEventListener('change', saveAppointment);
    }
}

// Funktion zum Wechseln der Ansicht (Profil/Untersuchungen)
function switchView(view) {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => item.classList.remove('active'));
    
    // Alle Views ausblenden
    document.querySelectorAll('.view-container').forEach(container => {
        container.classList.remove('active-view');
    });
    
    if (view === 'profile') {
        // Profilansicht aktivieren
        document.getElementById('profileView').classList.add('active-view');
        document.querySelector('.nav-item:nth-child(1)').classList.add('active');
        
        // Profilinfos aktualisieren
        updateProfileInfo();
    } else {
        // Untersuchungsansicht aktivieren
        document.getElementById('checkupsView').classList.add('active-view');
        document.querySelector('.nav-item:nth-child(2)').classList.add('active');
    }
}

// Funktion zum Aktualisieren der Profilinformationen
function updateProfileInfo() {
    document.getElementById('genderPill').textContent = user.gender;
    document.getElementById('agePill').textContent = `${user.age} Jahre`;
    document.getElementById('heightPill').textContent = `${(user.height / 100).toFixed(2)} m`;
    document.getElementById('weightPill').textContent = `${user.weight} KG`;
}

// Speichern der Daten im localStorage
function saveToLocalStorage() {
    localStorage.setItem('recommendedCheckups', JSON.stringify(recommendedCheckups));
}

// Laden der Daten aus dem localStorage
function loadFromLocalStorage() {
    const savedCheckups = localStorage.getItem('recommendedCheckups');
    if (savedCheckups) {
        const parsedCheckups = JSON.parse(savedCheckups);
        
        // Update der Untersuchungen mit gespeicherten Daten
        parsedCheckups.forEach((savedCheckup, index) => {
            if (index < recommendedCheckups.length) {
                recommendedCheckups[index].completed = savedCheckup.completed;
                recommendedCheckups[index].appointment = savedCheckup.appointment;
            }
        });
    }
}

// Seite initialisieren
window.onload = function() {
    loadFromLocalStorage();
    displayCheckups();
    
    // Event-Listener für den "Ändern" Button im Profil
    document.getElementById('editProfileBtn').addEventListener('click', function() {
        alert('Die Profil-Bearbeitungsfunktion ist in diesem Demo nicht implementiert.');
    });
};