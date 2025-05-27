const EscapeGame = require('../../src/game.js');

describe('EscapeGame', () => {
  let game;

  beforeEach(() => {
    game = new EscapeGame();
  });

  describe('Puzzle 1 - Safe Code', () => {
    test('should reject empty input', () => {
      const result = game.validateSafeCode('');
      expect(result.success).toBe(false);
      expect(result.message).toBe('Veuillez entrer un code');
    });

    test('should reject null input', () => {
      const result = game.validateSafeCode(null);
      expect(result.success).toBe(false);
      expect(result.message).toBe('Veuillez entrer un code');
    });

    test('should reject whitespace only input', () => {
      const result = game.validateSafeCode('   ');
      expect(result.success).toBe(false);
      expect(result.message).toBe('Veuillez entrer un code');
    });

    test('should reject incorrect code', () => {
      const result = game.validateSafeCode('1234');
      expect(result.success).toBe(false);
      expect(result.message).toBe('Code incorrect. Réessayez !');
    });

    test('should accept correct code', () => {
      const result = game.validateSafeCode('10');
      expect(result.success).toBe(true);
      expect(result.message).toBe('Correct ! Le coffre s\'ouvre...');
    });

    test('should accept correct code with whitespace', () => {
      const result = game.validateSafeCode(' 10 ');
      expect(result.success).toBe(true);
    });
  });

  describe('Puzzle 2 - Password', () => {
    test('should reject empty password', () => {
      const result = game.validatePassword('');
      expect(result.success).toBe(false);
      expect(result.message).toBe('Veuillez entrer un mot de passe');
    });

    test('should reject null password', () => {
      const result = game.validatePassword(null);
      expect(result.success).toBe(false);
      expect(result.message).toBe('Veuillez entrer un mot de passe');
    });

    test('should reject whitespace only password', () => {
      const result = game.validatePassword('   ');
      expect(result.success).toBe(false);
      expect(result.message).toBe('Veuillez entrer un mot de passe');
    });

    test('should reject incorrect password', () => {
      const result = game.validatePassword('WRONG');
      expect(result.success).toBe(false);
      expect(result.message).toBe('Mot de passe incorrect. Regardez bien les indices...');
    });

    test('should accept correct password in uppercase', () => {
      const result = game.validatePassword('WEB');
      expect(result.success).toBe(true);
      expect(result.message).toBe('Excellent ! Vous avez trouvé le mot caché !');
    });

    test('should accept correct password in lowercase', () => {
      const result = game.validatePassword('web');
      expect(result.success).toBe(true);
    });

    test('should accept correct password in mixed case', () => {
      const result = game.validatePassword('WeB');
      expect(result.success).toBe(true);
    });

    test('should accept correct password with whitespace', () => {
      const result = game.validatePassword(' WEB ');
      expect(result.success).toBe(true);
    });
  });

  describe('Puzzle 3 - Color Order', () => {
    test('should add colors to selection', () => {
      expect(game.addColor('red')).toBe(true);
      expect(game.selectedColors).toEqual(['red']);
    });

    test('should not add duplicate colors', () => {
      game.addColor('red');
      expect(game.addColor('red')).toBe(false);
      expect(game.selectedColors).toEqual(['red']);
    });

    test('should not add more than 4 colors', () => {
      game.addColor('red');
      game.addColor('yellow');
      game.addColor('green');
      game.addColor('blue');
      expect(game.addColor('purple')).toBe(false);
      expect(game.selectedColors.length).toBe(4);
    });

    test('should add multiple different colors', () => {
      game.addColor('red');
      game.addColor('blue');
      game.addColor('green');
      expect(game.selectedColors).toEqual(['red', 'blue', 'green']);
    });

    test('should reset colors', () => {
      game.addColor('red');
      game.addColor('blue');
      game.resetColors();
      expect(game.selectedColors).toEqual([]);
    });

    test('should reject empty color selection', () => {
      const result = game.validateColorOrder();
      expect(result.success).toBe(false);
      expect(result.message).toBe('Veuillez sélectionner des couleurs');
    });

    test('should reject incomplete color selection', () => {
      game.addColor('red');
      game.addColor('yellow');
      const result = game.validateColorOrder();
      expect(result.success).toBe(false);
      expect(result.message).toBe('Sélectionnez les 4 couleurs dans l\'ordre');
    });

    test('should reject incorrect color order', () => {
      game.addColor('blue');
      game.addColor('red');
      game.addColor('yellow');
      game.addColor('green');
      const result = game.validateColorOrder();
      expect(result.success).toBe(false);
      expect(result.message).toBe('Ordre incorrect. Pensez au spectre visible...');
    });

    test('should accept correct color order', () => {
      game.addColor('red');
      game.addColor('yellow');
      game.addColor('green');
      game.addColor('blue');
      const result = game.validateColorOrder();
      expect(result.success).toBe(true);
      expect(result.message).toBe('Parfait ! Vous avez trouvé le bon ordre !');
    });
  });

  describe('Game Progression', () => {
    test('should start at puzzle 1', () => {
      expect(game.currentPuzzle).toBe(1);
    });

    test('should advance to next puzzle', () => {
      expect(game.nextPuzzle()).toBe(true);
      expect(game.currentPuzzle).toBe(2);
    });

    test('should advance from puzzle 2 to 3', () => {
      game.currentPuzzle = 2;
      expect(game.nextPuzzle()).toBe(true);
      expect(game.currentPuzzle).toBe(3);
    });

    test('should not advance past puzzle 3', () => {
      game.currentPuzzle = 3;
      expect(game.nextPuzzle()).toBe(false);
      expect(game.currentPuzzle).toBe(3);
    });

    test('should reset game state', () => {
      game.currentPuzzle = 3;
      game.addColor('red');
      game.reset();
      expect(game.currentPuzzle).toBe(1);
      expect(game.selectedColors).toEqual([]);
    });
  });

  describe('Game initialization', () => {
    test('should initialize with correct default values', () => {
      const newGame = new EscapeGame();
      expect(newGame.currentPuzzle).toBe(1);
      expect(newGame.selectedColors).toEqual([]);
      expect(newGame.puzzles).toBeDefined();
      expect(newGame.puzzles[1].answer).toBe('10');
      expect(newGame.puzzles[2].answer).toBe('WEB');
      expect(newGame.puzzles[3].answer).toEqual(['red', 'yellow', 'green', 'blue']);
    });
  });
});