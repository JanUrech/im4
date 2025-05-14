// profile.js - Database version
console.log("profile.js (Database version) geladen");

let profileData = {};

// Load profile data from database
async function loadProfileFromDatabase() {
    try {
        const response = await fetch('php/get_profile.php', {
            credentials: 'include'
        });
        const data = await response.json();

        if (data.success && data.profile) {
            profileData = data.profile;
            updateProfileDisplay();
            return true;
        } else {
            console.error('Fehler beim Laden des Profils:', data.error);
            alert('Fehler beim Laden des Profils: ' + data.error);
            return false;
        }
    } catch (error) {
        console.error('Netzwerkfehler beim Laden des Profils:', error);
        alert('Netzwerkfehler beim Laden des Profils');
        return false;
    }
}

// Save profile data to database
async function saveProfileToDatabase() {
    try {
        const response = await fetch('php/update_profile.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(profileData)
        });

        const data = await response.json();

        if (data.success) {
            console.log('Profil erfolgreich gespeichert');
            return true;
        } else {
            console.error('Fehler beim Speichern:', data.error);
            alert('Fehler beim Speichern: ' + data.error);
            return false;
        }
    } catch (error) {
        console.error('Netzwerkfehler beim Speichern:', error);
        alert('Netzwerkfehler beim Speichern');
        return false;
    }
}

// Update profile info display
function updateProfileDisplay() {
    const profileInfo = document.querySelector('.profile-info');
    if (profileInfo && profileData) {
        const genderText = profileData.gender === 'männlich' ? 'Männlich' :
            profileData.gender === 'weiblich' ? 'Weiblich' : 'Divers';

        profileInfo.innerHTML = `
            <div class="info-pill">${genderText}</div>
            <div class="info-pill">${profileData.age} Jahre</div>
            <div class="info-pill">${profileData.height.toFixed(2)} m</div>
            <div class="info-pill">${profileData.weight} kg</div>
        `;
    }
}

// Populate profile edit form
function populateEditForm() {
    if (!profileData) return;

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
        inputs[1].value = profileData.height.toFixed(2);
        inputs[2].value = profileData.weight;
    }
}

document.addEventListener('DOMContentLoaded', async function () {
    // Load profile data from database
    await loadProfileFromDatabase();

    // Only populate edit form if we're on the edit page
    if (window.location.pathname.includes('profil-bearbeiten')) {
        populateEditForm();

        // Gender toggle functionality
        document.querySelectorAll('.toggle-option').forEach(toggle => {
            toggle.addEventListener('click', function () {
                document.querySelectorAll('.toggle-option').forEach(t => t.classList.remove('active'));
                this.classList.add('active');
            });
        });

        // Save button
        const saveBtn = document.getElementById('save-btn');
        if (saveBtn) {
            saveBtn.addEventListener('click', async function () {
                const activeGender = document.querySelector('.toggle-option.active');
                profileData.gender = activeGender.getAttribute('data-value');

                const inputs = document.querySelectorAll('.edit-input');
                profileData.age = parseInt(inputs[0].value);
                profileData.height = parseFloat(inputs[1].value);
                profileData.weight = parseFloat(inputs[2].value);

                // Save to database
                const success = await saveProfileToDatabase();
                if (success) {
                    window.location.href = 'profil.html';
                }
            });
        }
    }
});