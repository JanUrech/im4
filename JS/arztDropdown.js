// arztDropdown.js - Dropdown für Arzt/Wert Auswahl mit "neu"-Button
// Ursprünglich wertDropdown.js, umbenannt nach Userwunsch
// Fügt ein Dropdown-Menü und einen "neu"-Button für das Arzt/Wert-Feld in geplante, erledigte und noetige Untersuchungen hinzu

console.log("arztDropdown.js geladen");

function createArztModal(onSubmit) {
    // Modal-Overlay
    const overlay = document.createElement('div');
    overlay.className = 'arzt-modal-overlay';

    // Modal-Box
    const modal = document.createElement('div');
    modal.className = 'arzt-modal-box';
    modal.innerHTML = `
        <h3 class="arzt-modal-title">Neuen Arzt anlegen</h3>
        <form id="arzt-form">
            <div class="arzt-modal-form-group"><label class="arzt-modal-label">Name*</label><input name="name" required class="form-control"></div>
            <div class="arzt-modal-form-group"><label class="arzt-modal-label">Adresse</label><input name="adresse" class="form-control"></div>
            <div class="arzt-modal-form-group"><label class="arzt-modal-label">Telefon</label><input name="telefon" class="form-control"></div>
            <div class="arzt-modal-form-group"><label class="arzt-modal-label">Webseite</label><input name="webseite" class="form-control"></div>
            <div class="arzt-modal-form-group"><label class="arzt-modal-label">Email</label><input name="email" type="email" class="form-control"></div>
            <div class="arzt-modal-btn-row">
                <button type="button" id="arzt-cancel" class="arzt-modal-btn">Abbrechen</button>
                <button type="submit" class="arzt-modal-btn secondary">Speichern</button>
            </div>
        </form>
    `;
    overlay.appendChild(modal);
    document.body.appendChild(overlay);
    // Cancel
    modal.querySelector('#arzt-cancel').onclick = () => document.body.removeChild(overlay);
    // Submit
    modal.querySelector('#arzt-form').onsubmit = function(e) {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(this));
        onSubmit(data, () => document.body.removeChild(overlay));
    };
}

function initArztDropdowns() {
    // Finde alle relevanten Arzt-Input-Felder (id beginnt mit value-)
    const valueInputs = document.querySelectorAll('input[id^="value-"][type="text"]');
    console.log('initArztDropdowns: gefundene Inputs:', valueInputs.length);
    valueInputs.forEach(input => {
        // Prüfe, ob bereits ein Wrapper existiert (um Duplikate zu vermeiden)
        if (input.parentNode.querySelector('.arzt-dropdown-wrapper')) return;
        // Wrapper erstellen
        const wrapper = document.createElement('div');
        wrapper.className = 'arzt-dropdown-wrapper';
        wrapper.style.display = 'flex';
        wrapper.style.alignItems = 'center';
        // Dropdown erstellen
        const select = document.createElement('select');
        select.className = 'form-control arzt-dropdown';
        select.id = input.id;
        // Lade Ärzte dynamisch
        fetch('php/aerzteDatenbank.php')
            .then(res => res.json())
            .then(aerzte => {
                // Standardoption
                const defaultOpt = document.createElement('option');
                defaultOpt.value = '';
                defaultOpt.textContent = 'Arzt wählen';
                select.appendChild(defaultOpt);
                if (Array.isArray(aerzte)) {
                    aerzte.forEach(arzt => {
                        const option = document.createElement('option');
                        option.value = arzt.id;
                        option.textContent = arzt.name;
                        select.appendChild(option);
                    });
                } else {
                    // Fehlerfall: Fallback-Optionen
                    const fallback = document.createElement('option');
                    fallback.value = '';
                    fallback.textContent = 'Keine Ärzte gefunden';
                    select.appendChild(fallback);
                }
            })
            .catch(() => {
                const fallback = document.createElement('option');
                fallback.value = '';
                fallback.textContent = 'Fehler beim Laden';
                select.appendChild(fallback);
            });
        // Neu-Button erstellen
        const neuBtn = document.createElement('button');
        neuBtn.type = 'button';
        neuBtn.className = 'action-btn arzt-neu-btn';
        neuBtn.textContent = 'neu';
        neuBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Neu-Button geklickt');
            createArztModal((arztData, closeModal) => {
                fetch('php/aerzteDatenbank.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(arztData)
                })
                .then(res => res.json())
                .then(result => {
                    if (result && result.success && result.arzt) {
                        const neueOption = document.createElement('option');
                        neueOption.value = result.arzt.id;
                        neueOption.textContent = result.arzt.name;
                        select.appendChild(neueOption);
                        select.value = result.arzt.id;
                        closeModal();
                    } else {
                        alert(result && result.error ? result.error : 'Fehler beim Speichern!');
                    }
                })
                .catch(() => alert('Fehler beim Speichern!'));
            });
        });
        // Info-Button erstellen
        const infoBtn = document.createElement('button');
        infoBtn.type = 'button';
        infoBtn.className = 'action-btn arzt-info-btn';
        infoBtn.textContent = 'Info';
        infoBtn.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Info-Button geklickt');
            const arztId = select.value;
            if (!arztId) {
                alert('Bitte zuerst einen Arzt auswählen!');
                return;
            }
            fetch('php/aerzteDatenbank.php?id=' + encodeURIComponent(arztId))
                .then(res => res.json())
                .then(arzt => {
                    if (!arzt || !arzt.id) {
                        alert('Arzt nicht gefunden!');
                        return;
                    }
                    // Info-Modal anzeigen
                    const overlay = document.createElement('div');
                    overlay.className = 'arzt-modal-overlay';
                    const modal = document.createElement('div');
                    modal.className = 'arzt-modal-box';
                    modal.innerHTML = `
                        <h3 class="arzt-modal-title">Arzt-Informationen</h3>
                        <div class="arzt-modal-form-group"><span class="arzt-modal-label">Name:</span> ${arzt.name || ''}</div>
                        <div class="arzt-modal-form-group"><span class="arzt-modal-label">Adresse:</span> ${arzt.adresse || '-'}</div>
                        <div class="arzt-modal-form-group"><span class="arzt-modal-label">Telefon:</span> ${arzt.telefon || '-'}</div>
                        <div class="arzt-modal-form-group"><span class="arzt-modal-label">Webseite:</span> ${arzt.webseite ? `<a href="${arzt.webseite}" target="_blank">${arzt.webseite}</a>` : '-'}</div>
                        <div class="arzt-modal-form-group"><span class="arzt-modal-label">Email:</span> ${arzt.email ? `<a href="mailto:${arzt.email}">${arzt.email}</a>` : '-'}</div>
                        <div class="arzt-modal-btn-row">
                            <button type="button" class="arzt-modal-btn" id="arzt-info-close">Schließen</button>
                        </div>
                    `;
                    overlay.appendChild(modal);
                    document.body.appendChild(overlay);
                    modal.querySelector('#arzt-info-close').onclick = () => document.body.removeChild(overlay);
                })
                .catch(() => alert('Fehler beim Laden der Arzt-Informationen!'));
        });
        // Baue Wrapper zusammen
        wrapper.appendChild(select);
        wrapper.appendChild(neuBtn);
        wrapper.appendChild(infoBtn);
        // Ersetze das Input-Feld durch den Wrapper
        input.parentNode.replaceChild(wrapper, input);
        console.log('Input ersetzt durch Dropdown + Buttons:', input.id);
    });
}

window.initArztDropdowns = initArztDropdowns;
document.addEventListener('DOMContentLoaded', initArztDropdowns);
