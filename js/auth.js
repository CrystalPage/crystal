document.addEventListener('DOMContentLoaded', () => {
    // Funktion zum Hashen von Passwörtern (clientseitig)
    async function hashPassword(password) {
        const msgBuffer = new TextEncoder().encode(password);
        const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    }
    document.querySelectorAll('#dropdown-menu a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.hash = link.getAttribute('href');
        }); 
    });

    // Funktion zum Validieren von Eingaben
    function validateInput(input, type) {
        if (type === 'email') {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
        }
        if (type === 'username') {
            return /^[a-zA-Z0-9_]{3,20}$/.test(input);
        }
        if (type === 'discord') {
            return /^.{3,32}#[0-9]{4}$/.test(input);
        }
        if (type === 'password') {
            return input.length >= 8;
        }
        return true;
    }

    // Anmeldestatus prüfen
    const currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
    const authButtons = document.getElementById('auth-buttons');
    const userDropdown = document.getElementById('user-dropdown');
    const usernameDisplay = document.getElementById('username-display');
    const dropdownMenu = document.getElementById('dropdown-menu');

    if (currentUser) {
        authButtons.classList.add('hidden');
        userDropdown.classList.remove('hidden');
        usernameDisplay.textContent = currentUser.username;
    }

    // Logout
    document.getElementById('logout-button')?.addEventListener('click', () => {
        localStorage.removeItem('currentUser');
        updateUI();
        window.location.hash = 'login'; // Zurück zum Login
    });

    // Sektionen basierend auf URL-Hash anzeigen
    function updateUI() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
        const authButtons = document.getElementById('auth-buttons');
        const userDropdown = document.getElementById('user-dropdown');
        const mobileAuthButtons = document.getElementById('mobile-auth-buttons');
        const mobileUserDropdown = document.getElementById('mobile-user-dropdown');
        const usernameDisplay = document.getElementById('username-display');
        const authContainer = document.getElementById('auth-container');
        const dashboardContainer = document.getElementById('dashboard-container');
    
        if (!authButtons || !userDropdown || !mobileAuthButtons || !mobileUserDropdown || !usernameDisplay || !authContainer || !dashboardContainer) {
            console.error('One or more UI elements not found');
            return;
        }
    
        if (currentUser) {
            authContainer.classList.add('hidden');
            dashboardContainer.classList.remove('hidden');
            authButtons.classList.add('hidden');
            userDropdown.classList.remove('hidden');
            mobileAuthButtons.classList.add('hidden');
            mobileUserDropdown.classList.remove('hidden');
            usernameDisplay.textContent = currentUser.username;
        } else {
            authContainer.classList.remove('hidden');
            dashboardContainer.classList.add('hidden');
            authButtons.classList.remove('hidden');
            userDropdown.classList.add('hidden');
            mobileAuthButtons.classList.remove('hidden');
            mobileUserDropdown.classList.add('hidden');
            const hash = window.location.hash;
            if (hash === '#register') document.getElementById('switchToRegister').click();
            else document.getElementById('backToLogin').click();
        }
    }

    window.addEventListener('hashchange', showSection);

    // Funktion zum Anzeigen der aktuellen Sektion basierend auf dem Hash
    function showSection() {
        const sections = ['dashboard-content', 'redeem-content', 'premium-chat-content'];
        const hash = window.location.hash.slice(1) || 'dashboard';
        sections.forEach(section => {
            const element = document.getElementById(section);
            if (element) element.classList.add('hidden');
        });
        const sectionElement = document.getElementById(hash + '-content');
        if (sectionElement) sectionElement.classList.remove('hidden');
    
        // Premium Chat Zugang prüfen
        if (hash === 'premium-chat') {
            const user = JSON.parse(localStorage.getItem('currentUser')) || { licenses: [] };
            if (!user.licenses.length) {
                document.getElementById('premium-chat-content').innerHTML = `
                    <p class="text-red-500 mb-4">No Active License</p>
                    <p>Purchase a product to join our Premium Chat and connect with hundreds of other users. Ask for help, share tips, or network with others who share your interests!</p>
                    <a href="shop.html#products" class="btn-red mt-4 inline-block">Shop Now</a>
                `;
            } else {
                document.getElementById('premium-chat-content').innerHTML = `
                    <h2 class="text-2xl font-bold mb-4 gradient-text text-center">Premium Chat - Only for Customers with Active Licenses</h2>
                    <p class="text-center mb-4">
                        Every member with an active license gains access to our exclusive Premium Chat, where hundreds of users with active licenses for various products connect. Ask questions, share tips, or network with others over shared interests. This chat is exclusively for active buyers, offering discussions, questions, and answers about all tools our customers use!
                    </p>
                    <a href="https://discord.gg/motiongoats" target="_blank" class="block bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition duration-300 text-center">
                        Join Premium Chat on Discord
                    </a>
                `;
            }
        }
    
        // Synchronisiere die UI mit dem aktuellen Benutzerstatus
        updateUI();
    }

    showSection();

    // Login-Formular
document.getElementById('login-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const errorP = document.getElementById('login-error');

    if (!validateInput(email, 'email') || !validateInput(password, 'password')) {
        errorP.textContent = 'Invalid email or password.';
        errorP.classList.remove('hidden');
        return;
    }

    const hashedPassword = await hashPassword(password);
    // Hier würdest du normalerweise eine API-Anfrage an dein Backend senden
    // Für Demo: Simuliere erfolgreichen Login
    const user = { username: email.split('@')[0], email, licenses: [] };
    localStorage.setItem('currentUser', JSON.stringify(user));
    updateUI();
    window.location.hash = 'dashboard'; // Hash ändern ohne Seite neu zu laden
});

    // Registrierungs-Formular
document.getElementById('register-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = document.getElementById('register-username').value;
    const discord = document.getElementById('register-discord').value;
    const country = document.getElementById('register-country').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const errorP = document.getElementById('register-error');

    if (!validateInput(username, 'username') || !validateInput(discord, 'discord') || !country ||
        !validateInput(email, 'email') || !validateInput(password, 'password')) {
        errorP.textContent = 'Please fill out all fields correctly.';
        errorP.classList.remove('hidden');
        return;
    }

    const hashedPassword = await hashPassword(password);
    const userData = { username, discord, country, email, password: hashedPassword };

    // Sende Daten an Webhook
    try {
        await fetch('YOUR_WEBHOOK_URL', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        localStorage.setItem('currentUser', JSON.stringify({ username, email, licenses: [] }));
        showRegistrationSuccessModal(); // Zeige das Erfolgsmodal
    } catch (error) {
        errorP.textContent = 'Error during registration. Please try again.';
        errorP.classList.remove('hidden');
    }
});

    // Redeem-Formular
    document.getElementById('redeem-form')?.addEventListener('submit', (e) => {
        // Dropdown-Toggle und Navigation
const dropdownToggle = document.getElementById('dropdown-toggle');
const dropdownMenu = document.getElementById('dropdown-menu');
if (dropdownToggle && dropdownMenu) {
    dropdownToggle.addEventListener('click', () => {
        dropdownMenu.classList.toggle('hidden');
    });

    document.querySelectorAll('#dropdown-menu a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const hash = link.getAttribute('href').slice(1); // Entferne das '#'
            window.location.hash = hash;
            dropdownMenu.classList.add('hidden'); // Schließe das Dropdown nach Klick
            showSection(); // Aktualisiere die Sektion
        });
    });
}
        e.preventDefault();
        const code = document.getElementById('license-code').value;
        const resultP = document.getElementById('redeem-result');

        // Simulierte Lizenzprüfung
        if (code === 'VALID123') { // Beispielcode
            const user = JSON.parse(localStorage.getItem('user'));
            user.licenses = user.licenses || [];
            user.licenses.push({ product: 'Monero Crypto Jacker', variant: 'Lifetime', status: 'Active' });
            localStorage.setItem('user', JSON.stringify(user));
            resultP.innerHTML = 'License activated! <a href="#" class="text-blue-500">Download</a>';
            resultP.classList.add('text-green-500');
        } else {
            resultP.textContent = 'Invalid license code.';
            resultP.classList.add('text-red-500');
        }
    });
});
