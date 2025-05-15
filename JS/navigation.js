// Navigation script for Health App - Untersuchungen
document.addEventListener('DOMContentLoaded', function() {
    // Button navigation mappings
    const navigationMap = {
        'btn-noetige': 'noetige.html',
        'btn-geplante': 'geplante.html',
        'btn-nicht-durchgefuehrte': 'nicht-durchgefuehrte.html',
        'btn-erledigte': 'erledigte.html'
    };

    // Add click event listeners to all untersuchungen buttons
    Object.keys(navigationMap).forEach(buttonId => {
        const button = document.getElementById(buttonId);
        if (button) {
            button.addEventListener('click', function() {
                window.location.href = navigationMap[buttonId];
            });
        }
    });

    // Optional: Add keyboard navigation support
    document.addEventListener('keydown', function(event) {
        // Navigate with number keys 1-4
        const keyMap = {
            '1': 'btn-noetige',
            '2': 'btn-geplante',
            '3': 'btn-nicht-durchgefuehrte',
            '4': 'btn-erledigte'
        };

        if (keyMap[event.key]) {
            const button = document.getElementById(keyMap[event.key]);
            if (button) {
                button.click();
            }
        }
    });

    // Optional: Add visual feedback for button interactions
    const buttons = document.querySelectorAll('.untersuchungen-button');
    buttons.forEach(button => {
        // Add hover effect (can be styled with CSS)
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.05)';
            this.style.transition = 'transform 0.2s ease';
        });

        button.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
        });

        // Add click animation
        button.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 100);
        });
    });
});

// Optional: Function to navigate programmatically
function navigateToUntersuchung(type) {
    const navigationMap = {
        'noetige': 'noetige.html',
        'geplante': 'geplante.html',
        'nicht-durchgefuehrte': 'nicht-durchgefuehrte.html',
        'erledigte': 'erledigte.html'
    };

    if (navigationMap[type]) {
        window.location.href = navigationMap[type];
    } else {
        console.error('Unknown untersuchung type:', type);
    }
}

// Optional: Add loading indicator function
function showLoadingIndicator() {
    // You can implement a loading spinner here if needed
    document.body.style.cursor = 'wait';
}

function hideLoadingIndicator() {
    document.body.style.cursor = 'default';
}