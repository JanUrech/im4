// arztDropdown.js - Dropdown für Arzt/Wert Auswahl mit "neu"-Button
// Ursprünglich wertDropdown.js, umbenannt nach Userwunsch
// Fügt ein Dropdown-Menü und einen "neu"-Button für das Arzt/Wert-Feld in geplante, erledigte und noetige Untersuchungen hinzu

console.log("arztDropdown.js geladen");

document.addEventListener('DOMContentLoaded', function() {
    // Finde alle Wert-Formgruppen auf der Seite
    const valueGroups = document.querySelectorAll('.form-group label[for^="value"]');
    valueGroups.forEach(label => {
        const formGroup = label.closest('.form-group');
        if (!formGroup) return;
        // Prüfe, ob das Input-Feld existiert und ersetze es
        const input = formGroup.querySelector('input[type="text"]');
        if (input) {
            // Dropdown erstellen
            const select = document.createElement('select');
            select.className = 'form-control arzt-dropdown';
            select.id = input.id ? input.id : '';
            // Beispieloptionen (kann dynamisch angepasst werden)
            const options = [
                { value: '', text: 'Wert wählen' },
                { value: 'positiv', text: 'Positiv' },
                { value: 'negativ', text: 'Negativ' },
                { value: 'unauffällig', text: 'Unauffällig' },
                { value: 'auffällig', text: 'Auffällig' },
                { value: 'andere', text: 'Andere' }
            ];
            options.forEach(opt => {
                const option = document.createElement('option');
                option.value = opt.value;
                option.textContent = opt.text;
                select.appendChild(option);
            });
            // Button erstellen
            const neuBtn = document.createElement('button');
            neuBtn.type = 'button';
            neuBtn.className = 'action-btn arzt-neu-btn';
            neuBtn.textContent = 'neu';
            neuBtn.style.marginLeft = '8px';
            neuBtn.addEventListener('click', function(e) {
                e.preventDefault();
                // Optional: Hier kann ein Dialog für einen neuen Wert erscheinen
                const neuerWert = prompt('Neuen Wert eingeben:');
                if (neuerWert && neuerWert.trim() !== '') {
                    // Füge neuen Wert als Option hinzu und wähle ihn aus
                    const neueOption = document.createElement('option');
                    neueOption.value = neuerWert;
                    neueOption.textContent = neuerWert;
                    select.appendChild(neueOption);
                    select.value = neuerWert;
                }
            });
            // Ersetze das Input-Feld durch Dropdown + Button
            formGroup.replaceChild(select, input);
            formGroup.appendChild(neuBtn);
        }
    });
});
