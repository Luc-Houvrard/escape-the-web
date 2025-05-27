// Game logic separated for better testing - Enhanced with Audio
class EscapeGame {
  constructor(audioManager = null) {
    this.currentPuzzle = 1;
    this.selectedColors = [];
    this.puzzles = {
      1: { answer: '10', type: 'code' },
      2: { answer: 'WEB', type: 'password' },
      3: { answer: ['red', 'yellow', 'green', 'blue'], type: 'sequence' }
    };
    
    // Audio integration
    this.audioManager = audioManager;
    this.attempts = { puzzle1: 0, puzzle2: 0, puzzle3: 0 };
    this.startTime = null;
    this.completionTime = null;
  }

  // Start the game timer
  startGame() {
    this.startTime = Date.now();
    if (this.audioManager) {
      this.audioManager.startAmbientMusic();
    }
  }

  validateSafeCode(code) {
    this.attempts.puzzle1++;
    
    if (!code || code.trim() === '') {
      if (this.audioManager) this.audioManager.playError();
      return { success: false, message: 'Veuillez entrer un code' };
    }
    
    if (code.trim() === this.puzzles[1].answer) {
      if (this.audioManager) this.audioManager.playSuccess();
      return { success: true, message: 'Correct ! Le coffre s\'ouvre...' };
    }
    
    if (this.audioManager) this.audioManager.playError();
    return { success: false, message: 'Code incorrect. Réessayez !' };
  }

  validatePassword(password) {
    this.attempts.puzzle2++;
    
    if (!password || password.trim() === '') {
      if (this.audioManager) this.audioManager.playError();
      return { success: false, message: 'Veuillez entrer un mot de passe' };
    }
    
    if (password.trim().toUpperCase() === this.puzzles[2].answer) {
      if (this.audioManager) this.audioManager.playSuccess();
      return { success: true, message: 'Excellent ! Vous avez trouvé le mot caché !' };
    }
    
    if (this.audioManager) this.audioManager.playError();
    return { success: false, message: 'Mot de passe incorrect. Regardez bien les indices...' };
  }

  addColor(color) {
    if (this.selectedColors.length < 4 && !this.selectedColors.includes(color)) {
      this.selectedColors.push(color);
      if (this.audioManager) this.audioManager.playColorSelect(color);
      return true;
    }
    return false;
  }

  resetColors() {
    this.selectedColors = [];
    if (this.audioManager) this.audioManager.playReset();
  }

  validateColorOrder() {
    this.attempts.puzzle3++;
    
    if (this.selectedColors.length === 0) {
      if (this.audioManager) this.audioManager.playError();
      return { success: false, message: 'Veuillez sélectionner des couleurs' };
    }
    
    if (this.selectedColors.length !== 4) {
      if (this.audioManager) this.audioManager.playError();
      return { success: false, message: 'Sélectionnez les 4 couleurs dans l\'ordre' };
    }
    
    const correctOrder = this.puzzles[3].answer;
    const isCorrect = this.selectedColors.every((color, index) => color === correctOrder[index]);
    
    if (isCorrect) {
      this.completionTime = Date.now();
      if (this.audioManager) this.audioManager.playVictory();
      return { success: true, message: 'Parfait ! Vous avez trouvé le bon ordre !' };
    }
    
    if (this.audioManager) this.audioManager.playError();
    return { success: false, message: 'Ordre incorrect. Pensez au spectre visible...' };
  }

  nextPuzzle() {
    if (this.currentPuzzle < 3) {
      this.currentPuzzle++;
      return true;
    }
    return false;
  }

  reset() {
    this.currentPuzzle = 1;
    this.selectedColors = [];
    this.attempts = { puzzle1: 0, puzzle2: 0, puzzle3: 0 };
    this.startTime = null;
    this.completionTime = null;
    
    if (this.audioManager) {
      this.audioManager.playReset();
      this.audioManager.stopAmbientMusic();
    }
  }

  // Get game statistics
  getStats() {
    const totalTime = this.completionTime && this.startTime ? 
      Math.round((this.completionTime - this.startTime) / 1000) : null;
    
    const totalAttempts = this.attempts.puzzle1 + this.attempts.puzzle2 + this.attempts.puzzle3;
    
    return {
      completionTime: totalTime,
      totalAttempts,
      attemptsPerPuzzle: { ...this.attempts },
      currentPuzzle: this.currentPuzzle,
      isCompleted: this.currentPuzzle > 3 && this.completionTime !== null
    };
  }

  // Get hint based on attempt count
  getHint(puzzleNumber) {
    const attemptCount = this.attempts[`puzzle${puzzleNumber}`] || 0;
    
    const hints = {
      1: [
        "C'est une addition simple...",
        "1 + 2 = 3, puis continuez...",
        "La réponse est un nombre à deux chiffres : 10"
      ],
      2: [
        "Regardez les lettres en majuscules dans l'indice...",
        "W-E-B, ces trois lettres forment un mot",
        "Le mot est 'WEB' !"
      ],
      3: [
        "Pensez à l'arc-en-ciel...",
        "Rouge, Jaune, Vert, Bleu - dans cet ordre",
        "L'ordre du spectre visible : Rouge → Jaune → Vert → Bleu"
      ]
    };
    
    if (attemptCount >= 3 && hints[puzzleNumber]) {
      const hintIndex = Math.min(attemptCount - 3, hints[puzzleNumber].length - 1);
      return hints[puzzleNumber][hintIndex];
    }
    
    return null;
  }

  // Save progress to localStorage
  saveProgress() {
    const progress = {
      currentPuzzle: this.currentPuzzle,
      selectedColors: this.selectedColors,
      attempts: this.attempts,
      startTime: this.startTime,
      completionTime: this.completionTime
    };
    
    try {
      localStorage.setItem('escapeWebProgress', JSON.stringify(progress));
    } catch (error) {
      console.warn('Impossible de sauvegarder la progression:', error);
    }
  }

  // Load progress from localStorage
  loadProgress() {
    try {
      const saved = localStorage.getItem('escapeWebProgress');
      if (saved) {
        const progress = JSON.parse(saved);
        this.currentPuzzle = progress.currentPuzzle || 1;
        this.selectedColors = progress.selectedColors || [];
        this.attempts = progress.attempts || { puzzle1: 0, puzzle2: 0, puzzle3: 0 };
        this.startTime = progress.startTime || null;
        this.completionTime = progress.completionTime || null;
        return true;
      }
    } catch (error) {
      console.warn('Impossible de charger la progression:', error);
    }
    return false;
  }

  // Clear saved progress
  clearProgress() {
    try {
      localStorage.removeItem('escapeWebProgress');
    } catch (error) {
      console.warn('Impossible de supprimer la progression:', error);
    }
  }

  // Generate completion certificate data
  generateCertificate() {
    if (!this.getStats().isCompleted) return null;
    
    const stats = this.getStats();
    const date = new Date().toLocaleDateString('fr-FR');
    
    return {
      playerName: 'Joueur', // Could be customized
      completionDate: date,
      completionTime: `${stats.completionTime} secondes`,
      totalAttempts: stats.totalAttempts,
      difficulty: this.getDifficultyRating(stats),
      score: this.calculateScore(stats)
    };
  }

  // Calculate difficulty rating based on performance
  getDifficultyRating(stats) {
    if (stats.totalAttempts <= 3 && stats.completionTime <= 60) return 'Expert';
    if (stats.totalAttempts <= 6 && stats.completionTime <= 120) return 'Avancé';
    if (stats.totalAttempts <= 10 && stats.completionTime <= 300) return 'Intermédiaire';
    return 'Débutant';
  }

  // Calculate score (higher is better)
  calculateScore(stats) {
    const baseScore = 1000;
    const timePenalty = Math.max(0, (stats.completionTime - 60) * 2);
    const attemptPenalty = Math.max(0, (stats.totalAttempts - 3) * 50);
    
    return Math.max(100, Math.round(baseScore - timePenalty - attemptPenalty));
  }
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = EscapeGame;
}