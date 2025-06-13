# Website Features Documentation

Welcome to the documentation for our website! Below you'll find a comprehensive overview of allHealth App - Medizinische Untersuchungen Management System
Eine umfassende Webanwendung zur Verwaltung und Planung medizinischer Untersuchungen mit personalisierten Benutzerprofilen und Arzt-Datenbank.
📋 Inhaltsverzeichnis

Projektübersicht
Features
Technologie-Stack
Architektur
Installation
Datenbankstruktur
API-Dokumentation
Frontend-Komponenten
Sicherheit
Entwicklungsprozess
Design-Entscheidungen
Responsive Design
Verwendung
Troubleshooting

🎯 Projektübersicht
Die Health App ist ein vollständiges Gesundheitsmanagement-System, das Benutzern ermöglicht, ihre medizinischen Untersuchungen zu organisieren, zu planen und zu verfolgen. Die Anwendung bietet eine intuitive Benutzeroberfläche mit personalisierten Profilen und einer integrierten Arzt-Datenbank.
Kernfunktionalitäten

Benutzerverwaltung: Registrierung, Login, Profilverwaltung mit BMI-Berechnung
Untersuchungsmanagement: Kategorisierung in Nötige, Geplante, Erledigte und Nicht durchgeführte Untersuchungen
Arzt-Integration: Vollständige Arzt-Datenbank mit CRUD-Operationen
Responsive Design: Optimiert für Desktop, Tablet und Mobile
Session-Management: Sichere Authentifizierung und Datenschutz

✨ Features
🔐 Authentifizierung & Sicherheit

Sichere Benutzerregistrierung mit Passwort-Hashing (PHP password_hash())
Session-basierte Authentifizierung
Automatische Session-Validierung auf geschützten Seiten
Logout-Funktionalität mit Session-Bereinigung

👤 Profilverwaltung

Persönliche Profile mit demografischen Daten
Automatische BMI-Berechnung und -Speicherung
Bearbeitbare Profilfelder (Alter, Größe, Gewicht, Geschlecht)
Avatar-Integration mit visueller Darstellung

🏥 Untersuchungsmanagement

Vier Kategorien:

Nötige: Offene, noch zu planende Untersuchungen
Geplante: Terminierte Untersuchungen mit Datum
Erledigte: Abgeschlossene Untersuchungen mit Ergebnissen
Nicht durchgeführte: Abgelehnte oder verschobene Untersuchungen


Statusbasierte automatische Kategorisierung
Datum-Management mit automatischer Fälligkeitsberechnung
Dynamische Status-Updates basierend auf Datumslogik

🩺 Arzt-Datenbank

Vollständige Arzt-Profile (Name, Adresse, Telefon, Website, E-Mail)
Dropdown-Integration in Untersuchungsformularen
Modal-basierte Arzt-Erstellung mit Validierung
Info-Ansicht für detaillierte Arzt-Informationen
Responsive Arzt-Auswahl mit Such- und Filterfunktionen

📱 Benutzeroberfläche

Responsive Design: Mobile-first Ansatz mit Desktop-Optimierung
Moderne UI-Elemente: Glasmorphismus, Schatten-Effekte, sanfte Animationen
Intuitive Navigation: Bottom-Navigation für Mobile, Sidebar für Desktop
Accessibility: Fokus-Management, Keyboard-Navigation, semantische HTML-Struktur

🛠 Technologie-Stack
Frontend

HTML5: Semantische Struktur und Accessibility
CSS3:

CSS Grid & Flexbox für Layout
CSS Custom Properties für Theme-Management
Media Queries für Responsive Design
Keyframe-Animationen für Interaktionen


Vanilla JavaScript ES6+:

Fetch API für AJAX-Requests
Async/Await für asynchrone Operationen
Event-Delegation und DOM-Manipulation
Modular organisierter Code



Backend

PHP 8+: Server-seitige Logik und API-Endpoints
PDO: Datenbankabstraktion mit prepared statements
Session Management: Sichere Benutzer-Sessions
JSON APIs: RESTful Kommunikation zwischen Frontend und Backend

Datenbank

MySQL/MariaDB: Relationale Datenbankstruktur
Normalisierte Schemas: Optimierte Tabellenbeziehungen
Indexes: Performance-optimierte Abfragen

Entwicklungstools

Git: Versionskontrolle
Responsive Testing: Cross-Browser und Cross-Device Kompatibilität

🏗 Architektur
MVC-Pattern Implementation
Die Anwendung folgt einem modifizierten MVC-Pattern:

Model: PHP-Backend mit Datenbanklogik
View: HTML-Templates mit CSS-Styling
Controller: JavaScript-Module für Frontend-Logik

Modulare JavaScript-Architektur
JS/
├── arztDropdown.js      # Arzt-Dropdown und Modal-Management
├── examinations.js      # Untersuchungslogik und Rendering
├── login.js            # Anmelde-Funktionalität
├── logout.js           # Abmelde-Prozess
├── navigation.js       # Seitennavigation und Routing
├── profile.js          # Profilverwaltung
├── protectedText.js    # Session-Validierung
├── register.js         # Registrierungslogik
├── session.js          # Session-Management
└── wertDropdown.js     # Legacy-Datei (umbenannt zu arztDropdown.js)
PHP-Backend-Struktur
php/
├── aerzteDatenbank.php           # Arzt-CRUD-Operationen
├── auto_update_status.php        # Automatische Status-Updates
├── get_profile.php              # Profildaten abrufen
├── login.php                    # Anmelde-Verarbeitung
├── logout.php                   # Abmelde-Verarbeitung
├── protected.php                # Session-Validierung
├── register.php                 # Registrierungs-Verarbeitung
├── session.php                  # Session-Utilities
├── sync_examinations.php        # Untersuchungssynchronisation
├── synch_nutzer_untersuchungen.php # User-Untersuchung-Verknüpfung
├── update_examination_status.php   # Status-Updates
└── update_profile.php           # Profil-Updates
📦 Installation
Voraussetzungen

PHP 8.0+
MySQL/MariaDB 10.3+
Webserver (Apache/Nginx)
Moderne Browser-Unterstützung

Setup-Schritte

Repository klonen

bashgit clone [repository-url]
cd health-app

Datenbankstruktur erstellen

sql-- Benutzer-Tabelle
CREATE TABLE nutzer (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    vorname VARCHAR(100) NOT NULL,
    nachname VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    alter_jahre INT,
    geschlecht ENUM('m', 'w', 'd'),
    groesse_cm DECIMAL(5,2),
    gewicht_kg DECIMAL(5,2),
    BMI DECIMAL(4,1),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Untersuchungen-Tabelle
CREATE TABLE untersuchungen (
    ID INT AUTO_INCREMENT PRIMARY KEY,
    Untersuchung VARCHAR(255) NOT NULL,
    frequenz INT DEFAULT 1
);

-- Arzt-Tabelle
CREATE TABLE arzt (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    adresse TEXT,
    telefon VARCHAR(50),
    webseite VARCHAR(255),
    email VARCHAR(255)
);

-- Nutzer-Untersuchung-Verknüpfung
CREATE TABLE nutzer_untersuchung (
    nutzer_id INT,
    untersuchungen_id INT,
    arzt_id INT NULL,
    letzte_untersuchung DATE NULL,
    naechste_untersuchung DATE NULL,
    faelligkeit_untersuchung DATE NULL,
    status ENUM('offen', 'geplant', 'erledigt', 'abgelehnt') DEFAULT 'offen',
    PRIMARY KEY (nutzer_id, untersuchungen_id),
    FOREIGN KEY (nutzer_id) REFERENCES nutzer(ID),
    FOREIGN KEY (untersuchungen_id) REFERENCES untersuchungen(ID),
    FOREIGN KEY (arzt_id) REFERENCES arzt(id)
);

Konfigurationsdatei erstellen

php// system/config.php
<?php
$host = 'localhost';
$dbname = 'health_app';
$username = 'your_username';
$password = 'your_password';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    die("Verbindung fehlgeschlagen: " . $e->getMessage());
}
?>

Webserver konfigurieren


Document Root auf Projektverzeichnis setzen
PHP-Sessions aktivieren
.htaccess für URL-Rewriting (falls Apache)

🗄 Datenbankstruktur
Entitäts-Beziehungsmodell
Hauptentitäten

nutzer: Benutzerdaten und Profile
untersuchungen: Katalog medizinischer Untersuchungen
arzt: Arztdatenbank mit Kontaktinformationen
nutzer_untersuchung: Many-to-Many Relationship zwischen Nutzern und Untersuchungen

Beziehungen

Ein Nutzer kann viele Untersuchungen haben (1:n)
Eine Untersuchung kann vielen Nutzern zugeordnet sein (n:m)
Ein Arzt kann für mehrere Untersuchungen zuständig sein (1:n)
Jede Nutzer-Untersuchung-Kombination hat einen Status und Termine

Datenintegrität

Foreign Key Constraints für referentielle Integrität
ENUM-Werte für Status-Felder
Automatische Timestamps für Audit-Trails
Unique Constraints für E-Mail-Adressen

🔌 API-Dokumentation
Authentifizierung
POST /php/login.php
Anmeldung von Benutzern
Request:
json{
    "email": "user@example.com",
    "password": "password123"
}
Response:
json{
    "status": "success",
    "message": "Login erfolgreich. Willkommen, user@example.com!"
}
POST /php/register.php
Registrierung neuer Benutzer
Request (FormData):

vorname, nachname, email, password
alter_jahre, geschlecht, groesse_cm, gewicht_kg

GET /php/logout.php
Benutzer abmelden
Profilverwaltung
GET /php/get_profile.php
Profildaten abrufen
Response:
json{
    "success": true,
    "profile": {
        "vorname": "John",
        "nachname": "Doe",
        "age": 30,
        "gender": "männlich",
        "height": 1.75,
        "weight": 75,
        "bmi": 24.5
    }
}
POST /php/update_profile.php
Profil aktualisieren
Untersuchungen
GET /php/sync_examinations.php
Untersuchungen synchronisieren
Response:
json{
    "noetige": [...],
    "geplante": [...],
    "erledigte": [...],
    "nichtDurchgefuehrte": [...]
}
POST /php/update_examination_status.php
Untersuchungsstatus aktualisieren
Arzt-Datenbank
GET /php/aerzteDatenbank.php
Alle Ärzte abrufen
GET /php/aerzteDatenbank.php?id=1
Einzelnen Arzt abrufen
POST /php/aerzteDatenbank.php
Neuen Arzt anlegen
🎨 Frontend-Komponenten
CSS-Framework
Die Anwendung verwendet ein custom CSS-Framework mit:
Design System

Primärfarben: #14363e (Dunkel Teal), #b8dce2 (Hell Teal), #EBF7F9 (Background)
Typography: Arial, sans-serif mit responsiven Schriftgrößen
Spacing: 8px Grid-System für konsistente Abstände
Shadows: Inset-Shadows für "Eingeprägt"-Effekt

Komponenten-Bibliothek
css/* Button-Komponenten */
.action-btn, .auth-button, .untersuchungen-button
.arzt-neu-btn, .arzt-info-btn, .logout-button

/* Form-Komponenten */
.form-control, .auth-input, .edit-input
.gender-toggle, .arzt-dropdown

/* Layout-Komponenten */
.app-container, .view-container, .nav-bar
.profile-content, .checkup-list

/* Modal-Komponenten */
.arzt-modal-overlay, .arzt-modal-box
JavaScript-Module
Examination Management (examinations.js)
javascript// Hauptfunktionen
renderExaminations(containerId, category)
updateStatusAndMove(fromCategory, index, toCategory, newStatus)
saveExaminationDate(category, index)
moveExamination(fromCategory, index, toCategory)
Arzt-Integration (arztDropdown.js)
javascript// Arzt-Dropdown-System
createArztModal(onSubmit)
initArztDropdowns()
// Automatische Initialisierung bei DOM-Änderungen
Profile Management (profile.js)
javascript// Profilverwaltung
loadProfileFromDatabase()
saveProfileToDatabase()
updateProfileDisplay()
populateEditForm()
🔒 Sicherheit
Implementierte Sicherheitsmaßnahmen
1. Passwort-Sicherheit

BCrypt-Hashing: Verwendung von password_hash() mit starken Salt-Werten
Mindestlänge: 8 Zeichen Mindestlänge für Passwörter
Keine Klartext-Speicherung: Passwörter werden niemals im Klartext gespeichert

2. SQL-Injection-Schutz

Prepared Statements: Ausschließliche Verwendung von PDO Prepared Statements
Parameter-Binding: Alle Benutzereingaben werden über Parameter gebunden
Input-Validierung: Server-seitige Validierung aller Eingaben

3. Session-Sicherheit

Session-Regeneration: session_regenerate_id(true) bei Login
Session-Timeout: Automatische Session-Bereinigung
Sichere Session-Cookies: HTTPOnly und Secure Flags

4. XSS-Schutz

Ausgabe-Escaping: htmlspecialchars() für alle Ausgaben
Content Security Policy: CSP-Headers für zusätzlichen Schutz
Input-Sanitization: Bereinigung aller Benutzereingaben

5. CSRF-Schutz

Token-Validierung: CSRF-Tokens für state-changing Operationen
Referrer-Checking: Überprüfung der Request-Herkunft

Datenschutz-Compliance

DSGVO-konform: Minimale Datensammlung und explizite Einwilligung
Daten-Anonymisierung: Möglichkeit zur Daten-Anonymisierung
Löschfunktionen: Implementierung von Daten-Löschfunktionen

🔄 Entwicklungsprozess
1. Analyse und Planung
Anforderungserhebung:

Benutzerprofile und -rollen definiert
Use Cases für Untersuchungsmanagement erstellt
Datenbankschema basierend auf medizinischen Workflows entwickelt

Technische Entscheidungen:

PHP für Backend wegen breiter Hosting-Unterstützung
Vanilla JavaScript für Frontend-Performance
MySQL für strukturierte medizinische Daten

2. Datenbank-Design
Normalisierung:

3NF (Dritte Normalform) für optimale Datenstruktur
Separate Entitäten für Nutzer, Untersuchungen und Ärzte
Junction-Table für Many-to-Many Beziehungen

Performance-Optimierungen:

Indexes auf häufig abgefragte Spalten
Effiziente JOIN-Queries für komplexe Abfragen
Automatische Status-Updates durch Trigger-ähnliche PHP-Logik

3. Backend-Entwicklung
API-Design:

RESTful Endpoints für CRUD-Operationen
JSON-basierte Kommunikation
Konsistente Error-Handling-Patterns

Security-First Approach:

Jeder Endpoint mit Authentifizierungs-Check
Input-Validierung vor Datenbankoperationen
Detailed Logging für Security-Monitoring

4. Frontend-Entwicklung
Mobile-First Design:

Responsive Breakpoints bei 480px, 768px, 1024px
Touch-optimierte Interaktionen
Progressive Enhancement für Desktop-Features

Component-Based Architecture:

Wiederverwendbare CSS-Komponenten
Modulare JavaScript-Funktionen
Event-Delegation für dynamische Inhalte

5. Integration und Testing
Cross-Browser Testing:

Chrome, Firefox, Safari, Edge Kompatibilität
Mobile Browser (iOS Safari, Chrome Mobile)
Progressive Web App Features

Performance-Optimierung:

Lazy Loading für große Datensätze
Optimierte CSS und JavaScript
Database Query Optimization

💡 Design-Entscheidungen
1. Architekturelle Entscheidungen
Frontend-Framework Verzicht
Entscheidung: Vanilla JavaScript statt React/Vue/Angular
Begründung:

Reduzierte Komplexität und Bundle-Größe
Bessere Performance für kleine bis mittlere Anwendungen
Vollständige Kontrolle über DOM-Manipulation
Keine Build-Tools erforderlich

Session-basierte Authentifizierung
Entscheidung: PHP Sessions statt JWT
Begründung:

Einfachere Implementierung für traditionelle Web-App
Server-seitige Session-Kontrolle
Automatische Session-Bereinigung
Bessere Sicherheit für sensitive medizinische Daten

2. UI/UX-Entscheidungen
Farbschema-Wahl
Primärpalette: Teal-basierte Farben (#14363e, #b8dce2)
Begründung:

Medizinische Assoziation (Vertrauen, Sauberkeit)
Hoher Kontrast für Accessibility
Beruhigende Wirkung für Gesundheitsanwendungen

Navigation-Pattern
Mobile: Bottom Navigation
Desktop: Sidebar Navigation
Begründung:

Thumb-friendly für Mobile-Nutzung
Desktop nutzt verfügbaren Platz optimal
Konsistente Navigation zwischen Geräten

Modal vs. Page-Navigation
Entscheidung: Modals für Arzt-Management
Begründung:

Workflow bleibt im Kontext
Schnellere Interaktionen
Reduzierte Seitenwechsel

3. Datenstruktuur-Entscheidungen
Status-Management
Enum-Values: 'offen', 'geplant', 'erledigt', 'abgelehnt'
Begründung:

Klare Zustandsdefinition
Datenbankintegrität durch Constraints
Einfache UI-Kategorisierung

Datum-Handling
Drei-Datum-System:

letzte_untersuchung: Vergangene Termine
naechste_untersuchung: Geplante Termine
faelligkeit_untersuchung: Berechnete Fälligkeiten

Begründung:

Flexible Terminplanung
Automatische Erinnerungsfunktionen
Compliance mit medizinischen Intervallen

4. Performance-Entscheidungen
Client-Side Rendering
Entscheidung: JavaScript-basiertes DOM-Rendering
Begründung:

Interaktive Benutzeroberfläche
Reduzierte Server-Last
Bessere User Experience durch sofortige Updates

Database Normalization
Entscheidung: 3NF mit Junction Tables
Begründung:

Datenintegrität und -konsistenz
Skalierbarkeit für große Benutzerzahlen
Effiziente Query-Performance

📱 Responsive Design
Breakpoint-Strategie
css/* Mobile First Approach */
/* Base Styles: 320px - 480px */

@media (min-width: 481px) and (max-width: 768px) {
    /* Tablet Styles */
}

@media (min-width: 769px) {
    /* Desktop Styles */
}
Layout-Adaptionen
Mobile (< 480px)

Single-column Layout
Bottom Navigation
Touch-optimierte Button-Größen (44px minimum)
Stacked Form-Layouts
Fullscreen Modals

Tablet (481px - 768px)

Two-column Layout für Content
Größere Touch-Targets
Optimierte Modal-Größen
Horizontal Button-Groups

Desktop (> 769px)

Multi-column Layouts
Sidebar Navigation
Hover-Effects
Enhanced Animations
Larger Modal Windows

Touch-Optimierungen

Minimum Touch Target: 44px x 44px
Gesture Support: Swipe-Navigation (future feature)
Scroll-Behavior: Smooth scrolling für bessere UX
Focus Management: Keyboard-Navigation Support

📖 Verwendung
Benutzer-Workflow
1. Registrierung

Aufruf der Startseite (index.html)
Eingabe persönlicher Daten (Name, E-Mail, Passwort)
Eingabe medizinischer Basisdaten (Alter, Geschlecht, Größe, Gewicht)
Automatische BMI-Berechnung und Account-Erstellung

2. Anmeldung

Login über login.html mit E-Mail und Passwort
Session-Erstellung und Weiterleitung zur Hauptseite
Automatische Synchronisation der Untersuchungen

3. Profilverwaltung

Profil-Ansicht über Navigation erreichen
Bearbeitung der persönlichen Daten
Automatische BMI-Neuberechnung bei Änderungen

4. Untersuchungsmanagement

Übersicht: Hauptseite zeigt vier Kategorien
Detailansicht: Klick auf Kategorie öffnet spezifische Liste
Aktionen: Klick auf Untersuchung öffnet Aktionsmenü
Status-Änderung: Buttons für Statuswechsel zwischen Kategorien

5. Arzt-Integration

Auswahl: Dropdown-Menü in Untersuchungsformularen
Neuer Arzt: "neu"-Button öffnet Erstellungsmodal
Arzt-Info: "Info"-Button zeigt Arztdetails
Automatische Integration: Neue Ärzte erscheinen sofort in Dropdown

Administrationsfeatures
Datenbankwartung

Automatische Status-Updates basierend auf Datumslogik
Synchronisation von Nutzer-Untersuchung-Beziehungen
Session-Bereinigung und -Management

Monitoring

Fehler-Logging in PHP-Files
JavaScript-Console-Ausgaben für Debugging
Database Query Performance Monitoring

🐛 Troubleshooting
Häufige Probleme
1. Login-Probleme
Symptom: "E-Mail oder Passwort ist falsch"
Lösung:

Überprüfung der Datenbankverbindung
Kontrolle der Passwort-Hash-Funktionen
Session-Konfiguration überprüfen

2. Responsive Design-Probleme
Symptom: Layout bricht auf bestimmten Geräten
Lösung:

Browser-Cache leeren
CSS-Syntaxfehler überprüfen
Media Query Reihenfolge kontrollieren

3. Arzt-Dropdown lädt nicht
Symptom: Dropdown zeigt "Fehler beim Laden"
Lösung:

PHP-Fehlerlog überprüfen (/php/aerzteDatenbank.php)
Datenbankverbindung testen
JavaScript-Konsole auf Netzwerkfehler überprüfen

4. Untersuchungen werden nicht synchronisiert
Symptom: Leere Listen oder veraltete Daten
Lösung:

/php/sync_examinations.php direkt aufrufen
Session-Gültigkeit überprüfen
Datenbankbeziehungen kontrollieren

Debug-Modi
PHP-Debugging
php// In config.php hinzufügen
ini_set('display_errors', 1);
error_reporting(E_ALL);
JavaScript-Debugging
javascript// Console-Logging aktiviert in allen JS-Files
console.log("Debug-Information");
Logs und Monitoring

PHP-Errors: Server Error Logs
JavaScript-Errors: Browser Developer Console
Database-Queries: SQL Query Logs
Session-Issues: PHP Session Logs

🚀 Zukunftige Entwicklungen
Geplante Features

Push-Benachrichtigungen für Untersuchungstermine
Kalender-Integration mit iCal/Google Calendar Export
PDF-Reports für Untersuchungshistorie
Multi-Language Support (Deutsch/Englisch)
Dark Mode Theme-Option
Progressive Web App Features
Offline-Modus für Dateneingabe

Technische Verbesserungen

API-Versioning für zukünftige Kompatibilität
Caching-Layer für bessere Performance
Automated Testing Suite
CI/CD Pipeline für Deployments
Docker-Containerization
Microservices Architecture für Skalierbarkeit

Sicherheits-Upgrades

Two-Factor Authentication
OAuth2 Integration (Google, Apple, Microsoft)
Advanced Encryption für sensitive Daten
Audit Logging für Compliance
Penetration Testing und Security Audits


📄 Lizenz
Dieses Projekt ist unter der MIT-Lizenz lizenziert. Siehe LICENSE-Datei für Details.
🤝 Beiträge
Beiträge sind willkommen! Bitte lesen Sie die CONTRIBUTING.md für Details zum Entwicklungsprozess.
📞 Kontakt
Bei Fragen oder Problemen erstellen Sie bitte ein Issue im Repository oder kontaktieren Sie das Entwicklungsteam.

Version: 1.0.0
Letzte Aktualisierung: 2025
Entwicklungsstatus: Production Ready