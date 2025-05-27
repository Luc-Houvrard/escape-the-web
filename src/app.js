// Initialisation du gestionnaire audio
let audioManager;

// Game state
let selectedColors = [];
let currentPuzzle = 1;

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    audioManager = new AudioManager();
    setupAudioControls();
    
    // Activer l'audio au premier clic
    document.addEventListener('click', function enableAudioOnFirstClick() {
        audioManager.enableAudio();
        document.removeEventListener('click', enableAudioOnFirstClick);
    }, { once: true });
});

function setupAudioControls() {
    // Boutons de contrôle
    document.getElementById('musicToggle').addEventListener('click', () => {
        audioManager.playClick();
        audioManager.toggleMusic();
    });

    document.getElementById('sfxToggle').addEventListener('click', () => {
        audioManager.playClick();
        audioManager.toggleSfx();
    });

    document.getElementById('audioSettings').addEventListener('click', () => {
        audioManager.playClick();
        toggleAudioMenu();
    });

    // Sliders de volume
    document.getElementById('masterVolume').addEventListener('input', (e) => {
        audioManager.setMasterVolume(e.target.value / 100);
    });

    document.getElementById('musicVolume').addEventListener('input', (e) => {
        audioManager.setMusicVolume(e.target.value / 100);
    });

    document.getElementById('sfxVolume').addEventListener('input', (e) => {
        audioManager.setSfxVolume(e.target.value / 100);
    });

    // Initialiser les valeurs des sliders
    document.getElementById('masterVolume').value = audioManager.masterVolume * 100;
    document.getElementById('musicVolume').value = audioManager.musicVolume * 100;
    document.getElementById('sfxVolume').value = audioManager.sfxVolume * 100;

    // Mettre à jour l'UI
    audioManager.updateUI();

    // Fermer le menu si on clique ailleurs
    document.addEventListener('click', function(e) {
        const menu = document.getElementById('audioMenu');
        const settingsBtn = document.getElementById('audioSettings');
        
        if (!menu.contains(e.target) && e.target !== settingsBtn) {
            menu.classList.remove('visible');
        }
    });
}

function toggleAudioMenu() {
    const menu = document.getElementById('audioMenu');
    menu.classList.toggle('visible');
}

// Puzzle 1: Safe code validation
function checkSafeCode() {
    audioManager.playValidate();
    
    const input = document.getElementById('safecode');
    const message = document.getElementById('message1');
    const code = input.value.trim();
    
    message.classList.remove('hidden', 'success', 'error');
    
    if (code === '') {
        message.textContent = 'Veuillez entrer un code';
        message.classList.add('error');
        audioManager.playError();
        return false;
    }
    
    if (code === '10') {
        message.textContent = 'Correct ! Le coffre s\'ouvre...';
        message.classList.add('success');
        audioManager.playSuccess();
        setTimeout(() => {
            document.getElementById('puzzle1').classList.add('hidden');
            document.getElementById('puzzle2').classList.remove('hidden');
            currentPuzzle = 2;
        }, 1500);
        return true;
    } else {
        message.textContent = 'Code incorrect. Réessayez !';
        message.classList.add('error');
        audioManager.playError();
        return false;
    }
}

// Puzzle 2: Password validation
function checkPassword() {
    audioManager.playValidate();
    
    const input = document.getElementById('password');
    const message = document.getElementById('message2');
    const password = input.value.trim().toUpperCase();
    
    message.classList.remove('hidden', 'success', 'error');
    
    if (password === '') {
        message.textContent = 'Veuillez entrer un mot de passe';
        message.classList.add('error');
        audioManager.playError();
        return false;
    }
    
    if (password === 'WEB') {
        message.textContent = 'Excellent ! Vous avez trouvé le mot caché !';
        message.classList.add('success');
        audioManager.playSuccess();
        setTimeout(() => {
            document.getElementById('puzzle2').classList.add('hidden');
            document.getElementById('puzzle3').classList.remove('hidden');
            currentPuzzle = 3;
        }, 1500);
        return true;
    } else {
        message.textContent = 'Mot de passe incorrect. Regardez bien les indices...';
        message.classList.add('error');
        audioManager.playError();
        return false;
    }
}

// Puzzle 3: Color order
function selectColor(color) {
    audioManager.playColorSelect(color);
    
    if (selectedColors.length < 4 && !selectedColors.includes(color)) {
        selectedColors.push(color);
        updateColorDisplay();
        
        document.querySelectorAll('.color-button').forEach(btn => {
            if (btn.classList.contains(color)) {
                btn.classList.add('selected');
            }
        });
    }
}

function updateColorDisplay() {
    const display = document.getElementById('colorOrder');
    const colorEmojis = {
        'red': '🔴', 'yellow': '🟡', 'green': '🟢', 'blue': '🔵'
    };
    display.textContent = selectedColors.map(c => colorEmojis[c]).join(' ');
}

function resetColors() {
    audioManager.playReset();
    
    selectedColors = [];
    updateColorDisplay();
    document.querySelectorAll('.color-button').forEach(btn => {
        btn.classList.remove('selected');
    });
    const message = document.getElementById('message3');
    message.classList.add('hidden');
}

function checkColorOrder() {
    audioManager.playValidate();
    
    const message = document.getElementById('message3');
    const correctOrder = ['red', 'yellow', 'green', 'blue'];
    
    message.classList.remove('hidden', 'success', 'error');
    
    if (selectedColors.length === 0) {
        message.textContent = 'Veuillez sélectionner des couleurs';
        message.classList.add('error');
        audioManager.playError();
        return false;
    }
    
    if (selectedColors.length !== 4) {
        message.textContent = 'Sélectionnez les 4 couleurs dans l\'ordre';
        message.classList.add('error');
        audioManager.playError();
        return false;
    }
    
    const isCorrect = selectedColors.every((color, index) => color === correctOrder[index]);
    
    if (isCorrect) {
        message.textContent = 'Parfait ! Vous avez trouvé le bon ordre !';
        message.classList.add('success');
        audioManager.playVictory();
        setTimeout(() => {
            document.getElementById('puzzle3').classList.add('hidden');
            document.getElementById('victory').classList.remove('hidden');
        }, 1500);
        return true;
    } else {
        message.textContent = 'Ordre incorrect. Pensez au spectre visible...';
        message.classList.add('error');
        audioManager.playError();
        return false;
    }
}

function resetGame() {
    audioManager.playClick();
    
    // Reset all puzzles
    document.getElementById('puzzle1').classList.remove('hidden');
    document.getElementById('puzzle2').classList.add('hidden');
    document.getElementById('puzzle3').classList.add('hidden');
    document.getElementById('victory').classList.add('hidden');
    
    // Clear inputs
    document.getElementById('safecode').value = '';
    document.getElementById('password').value = '';
    
    // Reset colors
    selectedColors = [];
    updateColorDisplay();
    document.querySelectorAll('.color-button').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // Hide messages
    document.querySelectorAll('.message').forEach(msg => {
        msg.classList.add('hidden');
    });
    
    currentPuzzle = 1;
}

// Add Enter key support
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('safecode').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            audioManager.playClick();
            checkSafeCode();
        }
    });
    
    document.getElementById('password').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            audioManager.playClick();
            checkPassword();
        }
    });

    // Ajouter des sons de clic sur tous les boutons
    document.querySelectorAll('button:not(.audio-button):not(.test-button)').forEach(btn => {
        btn.addEventListener('click', () => {
            if (audioManager) audioManager.playClick();
        });
    });
});