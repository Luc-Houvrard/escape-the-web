// Game logic separated for better testing
class EscapeGame {
  constructor() {
    this.currentPuzzle = 1;
    this.selectedColors = [];
    this.puzzles = {
      1: { answer: '10', type: 'code' },
      2: { answer: 'WEB', type: 'password' },
      3: { answer: ['red', 'yellow', 'green', 'blue'], type: 'sequence' }
    };
  }

  validateSafeCode(code) {
    if (!code || code.trim() === '') {
      return { success: false, message: 'Veuillez entrer un code' };
    }
    
    if (code.trim() === this.puzzles[1].answer) {
      return { success: true, message: 'Correct ! Le coffre s\'ouvre...' };
    }
    
    return { success: false, message: 'Code incorrect. Réessayez !' };
  }

  validatePassword(password) {
    if (!password || password.trim() === '') {
      return { success: false, message: 'Veuillez entrer un mot de passe' };
    }
    
    if (password.trim().toUpperCase() === this.puzzles[2].answer) {
      return { success: true, message: 'Excellent ! Vous avez trouvé le mot caché !' };
    }
    
    return { success: false, message: 'Mot de passe incorrect. Regardez bien les indices...' };
  }

  addColor(color) {
    if (this.selectedColors.length < 4 && !this.selectedColors.includes(color)) {
      this.selectedColors.push(color);
      return true;
    }
    return false;
  }

  resetColors() {
    this.selectedColors = [];
  }

  validateColorOrder() {
    if (this.selectedColors.length === 0) {
      return { success: false, message: 'Veuillez sélectionner des couleurs' };
    }
    
    if (this.selectedColors.length !== 4) {
      return { success: false, message: 'Sélectionnez les 4 couleurs dans l\'ordre' };
    }
    
    const correctOrder = this.puzzles[3].answer;
    const isCorrect = this.selectedColors.every((color, index) => color === correctOrder[index]);
    
    if (isCorrect) {
      return { success: true, message: 'Parfait ! Vous avez trouvé le bon ordre !' };
    }
    
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
  }
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
  module.exports = EscapeGame;
}