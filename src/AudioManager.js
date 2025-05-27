// AudioManager.js - Gestionnaire des sons et musiques
class AudioManager {
  constructor() {
    this.audioContext = null;
    this.masterVolume = 0.7;
    this.musicVolume = 0.5;
    this.sfxVolume = 0.8;
    this.musicEnabled = localStorage.getItem('musicEnabled') !== 'false';
    this.sfxEnabled = localStorage.getItem('sfxEnabled') !== 'false';
    
    // Sons générés procéduralement (pas besoin de fichiers audio externes)
    this.sounds = {};
    this.currentMusic = null;
    
    this.initAudioContext();
    this.createSounds();
  }

  async initAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    } catch (error) {
      console.warn('Audio non supporté:', error);
    }
  }

  // Crée des sons synthétiques
  createSounds() {
    // Sons de succès - accord majeur
    this.sounds.success = () => this.playChord([523.25, 659.25, 783.99], 0.8, 'sine');
    
    // Son d'erreur - dissonance
    this.sounds.error = () => this.playTone(220, 0.3, 'sawtooth', 0.1);
    
    // Son de clic - tick court
    this.sounds.click = () => this.playTone(800, 0.1, 'square', 0.05);
    
    // Son de sélection de couleur
    this.sounds.colorSelect = (color) => {
      const frequencies = {
        red: 261.63,    // Do
        yellow: 329.63, // Mi
        green: 392.00,  // Sol
        blue: 523.25    // Do aigu
      };
      this.playTone(frequencies[color] || 440, 0.2, 'sine', 0.1);
    };
    
    // Son de validation
    this.sounds.validate = () => this.playTone(660, 0.15, 'triangle', 0.08);
    
    // Son de victoire - fanfare
    this.sounds.victory = () => {
      const melody = [523.25, 659.25, 783.99, 1046.50];
      melody.forEach((freq, index) => {
        setTimeout(() => this.playTone(freq, 0.4, 'sine', 0.2), index * 200);
      });
    };
    
    // Son de reset
    this.sounds.reset = () => this.playTone(196, 0.2, 'triangle', 0.1);
  }

  // Joue une tonalité simple
  playTone(frequency, duration, waveType = 'sine', volume = 0.1) {
    if (!this.sfxEnabled || !this.audioContext) return;

    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
      oscillator.type = waveType;
      
      // Envelope ADSR simple
      const now = this.audioContext.currentTime;
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(volume * this.sfxVolume * this.masterVolume, now + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);
      
      oscillator.start(now);
      oscillator.stop(now + duration);
    } catch (error) {
      console.warn('Erreur lecture audio:', error);
    }
  }

  // Joue un accord (plusieurs notes simultanées)
  playChord(frequencies, duration, waveType = 'sine') {
    if (!this.sfxEnabled || !this.audioContext) return;

    frequencies.forEach(freq => {
      this.playTone(freq, duration, waveType, 0.05);
    });
  }

  // Musique d'ambiance générative
  startAmbientMusic() {
    if (!this.musicEnabled || !this.audioContext || this.currentMusic) return;

    this.currentMusic = this.createAmbientLoop();
  }

  createAmbientLoop() {
    if (!this.audioContext) return null;

    try {
      // Créer une boucle d'ambiance avec des notes espacées
      const playAmbientNote = () => {
        if (!this.musicEnabled) return;

        const notes = [130.81, 146.83, 164.81, 174.61, 196.00]; // Notes graves
        const randomNote = notes[Math.floor(Math.random() * notes.length)];
        
        this.playTone(randomNote, 2, 'sine', 0.02);
        
        // Note d'accompagnement
        setTimeout(() => {
          if (this.musicEnabled) {
            this.playTone(randomNote * 1.5, 1.5, 'triangle', 0.015);
          }
        }, 500);
      };

      // Jouer une note toutes les 3-6 secondes
      const scheduleNext = () => {
        const delay = 3000 + Math.random() * 3000;
        setTimeout(() => {
          if (this.musicEnabled) {
            playAmbientNote();
            scheduleNext();
          }
        }, delay);
      };

      scheduleNext();
      return { stop: () => { this.musicEnabled = false; } };
    } catch (error) {
      console.warn('Erreur musique d\'ambiance:', error);
      return null;
    }
  }

  stopAmbientMusic() {
    if (this.currentMusic) {
      this.currentMusic.stop();
      this.currentMusic = null;
    }
  }

  // Méthodes publiques pour jouer les sons
  playSuccess() {
    this.sounds.success();
  }

  playError() {
    this.sounds.error();
  }

  playClick() {
    this.sounds.click();
  }

  playColorSelect(color) {
    this.sounds.colorSelect(color);
  }

  playValidate() {
    this.sounds.validate();
  }

  playVictory() {
    this.sounds.victory();
  }

  playReset() {
    this.sounds.reset();
  }

  // Contrôles de volume et préférences
  setMasterVolume(volume) {
    this.masterVolume = Math.max(0, Math.min(1, volume));
    localStorage.setItem('masterVolume', this.masterVolume);
  }

  setMusicVolume(volume) {
    this.musicVolume = Math.max(0, Math.min(1, volume));
    localStorage.setItem('musicVolume', this.musicVolume);
  }

  setSfxVolume(volume) {
    this.sfxVolume = Math.max(0, Math.min(1, volume));
    localStorage.setItem('sfxVolume', this.sfxVolume);
  }

  toggleMusic() {
    this.musicEnabled = !this.musicEnabled;
    localStorage.setItem('musicEnabled', this.musicEnabled);
    
    if (this.musicEnabled) {
      this.startAmbientMusic();
    } else {
      this.stopAmbientMusic();
    }
  }

  toggleSfx() {
    this.sfxEnabled = !this.sfxEnabled;
    localStorage.setItem('sfxEnabled', this.sfxEnabled);
  }

  // Initialisation avec interaction utilisateur (requis par les navigateurs modernes)
  async enableAudio() {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      try {
        await this.audioContext.resume();
        this.startAmbientMusic();
      } catch (error) {
        console.warn('Impossible d\'activer l\'audio:', error);
      }
    }
  }

  // Méthode utilitaire pour tester tous les sons
  testAllSounds() {
    const sounds = ['click', 'validate', 'success', 'error', 'victory', 'reset'];
    sounds.forEach((sound, index) => {
      setTimeout(() => this.sounds[sound](), index * 500);
    });
    
    // Test des couleurs
    setTimeout(() => {
      ['red', 'yellow', 'green', 'blue'].forEach((color, index) => {
        setTimeout(() => this.playColorSelect(color), index * 300);
      });
    }, sounds.length * 500);
  }
}