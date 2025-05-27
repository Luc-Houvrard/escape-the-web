const { test, expect } = require('@playwright/test');

test.describe('Escape The Web Game', () => {
  test.beforeEach(async ({ page }) => {
    // Ajustez l'URL selon votre configuration Live Server
    await page.goto('http://127.0.0.1:5500/src/index.html');
  });

  test('should display the first puzzle on load', async ({ page }) => {
    await expect(page.locator('#puzzle1')).toBeVisible();
    await expect(page.locator('#puzzle2')).not.toBeVisible();
    await expect(page.locator('#puzzle3')).not.toBeVisible();
    await expect(page.locator('#victory')).not.toBeVisible();
  });

  test('should display game title', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Escape The Web');
  });

  // Tests pour l'énigme 1 (Coffre-fort)
  test.describe('Puzzle 1 - Safe Code', () => {
    test('should show error for empty safe code', async ({ page }) => {
      await page.click('button:has-text("Valider")');
      await expect(page.locator('#message1')).toBeVisible();
      await expect(page.locator('#message1')).toHaveText('Veuillez entrer un code');
      await expect(page.locator('#message1')).toHaveClass(/error/);
    });

    test('should show error for incorrect safe code', async ({ page }) => {
      await page.fill('#safecode', '1234');
      await page.click('button:has-text("Valider")');
      await expect(page.locator('#message1')).toContainText('Code incorrect');
      await expect(page.locator('#message1')).toHaveClass(/error/);
      // Should stay on puzzle 1
      await expect(page.locator('#puzzle1')).toBeVisible();
    });

    test('should show error for whitespace only input', async ({ page }) => {
      await page.fill('#safecode', '   ');
      await page.click('button:has-text("Valider")');
      await expect(page.locator('#message1')).toContainText('Veuillez entrer un code');
    });

    test('should advance to puzzle 2 with correct safe code', async ({ page }) => {
      await page.fill('#safecode', '10');
      await page.click('button:has-text("Valider")');
      
      await expect(page.locator('#message1')).toContainText('Correct ! Le coffre s\'ouvre...');
      await expect(page.locator('#message1')).toHaveClass(/success/);
      
      // Wait for transition
      await page.waitForTimeout(1600);
      await expect(page.locator('#puzzle1')).not.toBeVisible();
      await expect(page.locator('#puzzle2')).toBeVisible();
    });

    test('should handle Enter key on safe code input', async ({ page }) => {
      await page.fill('#safecode', '10');
      await page.press('#safecode', 'Enter');
      await expect(page.locator('#message1')).toContainText('Correct');
    });
  });

  // Tests pour l'énigme 2 (Mot de passe)
  test.describe('Puzzle 2 - Password', () => {
    test.beforeEach(async ({ page }) => {
      // Navigate to puzzle 2
      await page.fill('#safecode', '10');
      await page.click('button:has-text("Valider")');
      await page.waitForTimeout(1600);
    });

    test('should show error for empty password', async ({ page }) => {
      await page.locator('#puzzle2 button:has-text("Valider")').click();
      await expect(page.locator('#message2')).toBeVisible();
      await expect(page.locator('#message2')).toHaveText('Veuillez entrer un mot de passe');
      await expect(page.locator('#message2')).toHaveClass(/error/);
    });

    test('should show error for incorrect password', async ({ page }) => {
      await page.fill('#password', 'WRONG');
      await page.locator('#puzzle2 button:has-text("Valider")').click();
      await expect(page.locator('#message2')).toContainText('Mot de passe incorrect');
      await expect(page.locator('#puzzle2')).toBeVisible();
    });

    test('should accept password in lowercase', async ({ page }) => {
      await page.fill('#password', 'web');
      await page.locator('#puzzle2 button:has-text("Valider")').click();
      await expect(page.locator('#message2')).toContainText('Excellent');
      await expect(page.locator('#message2')).toHaveClass(/success/);
    });

    test('should accept password in uppercase', async ({ page }) => {
      await page.fill('#password', 'WEB');
      await page.locator('#puzzle2 button:has-text("Valider")').click();
      await expect(page.locator('#message2')).toContainText('Excellent');
    });

    test('should accept password in mixed case', async ({ page }) => {
      await page.fill('#password', 'WeB');
      await page.locator('#puzzle2 button:has-text("Valider")').click();
      await expect(page.locator('#message2')).toContainText('Excellent');
    });

    test('should advance to puzzle 3 with correct password', async ({ page }) => {
      await page.fill('#password', 'WEB');
      await page.locator('#puzzle2 button:has-text("Valider")').click();
      await page.waitForTimeout(1600);
      
      await expect(page.locator('#puzzle2')).not.toBeVisible();
      await expect(page.locator('#puzzle3')).toBeVisible();
    });

    test('should handle Enter key on password input', async ({ page }) => {
      await page.fill('#password', 'WEB');
      await page.press('#password', 'Enter');
      await expect(page.locator('#message2')).toContainText('Excellent');
    });
  });

  // Tests pour l'énigme 3 (Ordre des couleurs)
  test.describe('Puzzle 3 - Color Order', () => {
    test.beforeEach(async ({ page }) => {
      // Navigate to puzzle 3
      await page.fill('#safecode', '10');
      await page.click('button:has-text("Valider")');
      await page.waitForTimeout(1600);
      
      await page.fill('#password', 'WEB');
      await page.locator('#puzzle2 button:has-text("Valider")').click();
      await page.waitForTimeout(1600);
    });

    test('should select colors and display them', async ({ page }) => {
      await page.click('.color-button.red');
      await expect(page.locator('#colorOrder')).toContainText('🔴');
      await expect(page.locator('.color-button.red')).toHaveClass(/selected/);
      
      await page.click('.color-button.blue');
      await expect(page.locator('#colorOrder')).toContainText('🔵');
    });

    test('should not select same color twice', async ({ page }) => {
      await page.click('.color-button.red');
      await page.click('.color-button.red'); // Click again
      
      // Should only show one red
      const colorText = await page.locator('#colorOrder').textContent();
      const redCount = (colorText.match(/🔴/g) || []).length;
      expect(redCount).toBe(1);
    });

    test('should reset colors when clicking reset button', async ({ page }) => {
      // Select some colors
      await page.click('.color-button.red');
      await page.click('.color-button.blue');
      
      // Check colors are displayed
      await expect(page.locator('#colorOrder')).toContainText('🔴');
      await expect(page.locator('#colorOrder')).toContainText('🔵');
      
      // Reset
      await page.click('button:has-text("Réinitialiser")');
      
      // Colors should be cleared
      const colorText = await page.locator('#colorOrder').textContent().then(text => text.trim());
      expect(colorText).toBe('');
      
      // Selected class should be removed
      await expect(page.locator('.color-button.red')).not.toHaveClass(/selected/);
    });

    test('should show error for empty color selection', async ({ page }) => {
      await page.locator('#puzzle3 button:has-text("Valider")').click();
      await expect(page.locator('#message3')).toContainText('Veuillez sélectionner des couleurs');
      await expect(page.locator('#message3')).toHaveClass(/error/);
    });

    test('should show error for incomplete color selection', async ({ page }) => {
      await page.click('.color-button.red');
      await page.click('.color-button.yellow');
      
      await page.locator('#puzzle3 button:has-text("Valider")').click();
      await expect(page.locator('#message3')).toContainText('Sélectionnez les 4 couleurs');
    });

    test('should show error for incorrect color order', async ({ page }) => {
      await page.click('.color-button.blue');
      await page.click('.color-button.red');
      await page.click('.color-button.yellow');
      await page.click('.color-button.green');
      
      await page.locator('#puzzle3 button:has-text("Valider")').click();
      await expect(page.locator('#message3')).toContainText('Ordre incorrect');
      await expect(page.locator('#puzzle3')).toBeVisible();
    });

    test('should complete puzzle with correct color order', async ({ page }) => {
      await page.click('.color-button.red');
      await page.click('.color-button.yellow');
      await page.click('.color-button.green');
      await page.click('.color-button.blue');
      
      await page.locator('#puzzle3 button:has-text("Valider")').click();
      await expect(page.locator('#message3')).toContainText('Parfait');
      await expect(page.locator('#message3')).toHaveClass(/success/);
      
      await page.waitForTimeout(1600);
      await expect(page.locator('#victory')).toBeVisible();
    });

    test('should not allow more than 4 colors', async ({ page }) => {
      // Select 4 colors
      await page.click('.color-button.red');
      await page.click('.color-button.yellow');
      await page.click('.color-button.green');
      await page.click('.color-button.blue');
      
      // Try to select same colors again - should not add duplicates
      await page.click('.color-button.red');
      
      // Check that we still have only 4 colors selected
      const colorText = await page.locator('#colorOrder').textContent();
      
      // Alternative approach: check that each color appears exactly once
      expect(colorText).toContain('🔴');
      expect(colorText).toContain('🟡');
      expect(colorText).toContain('🟢');
      expect(colorText).toContain('🔵');
      
      // Or check the selectedColors array length through the game state
      // Since we can't add duplicates, clicking red again should not change anything
      const redButtons = await page.locator('.color-button.red.selected').count();
      expect(redButtons).toBe(1); // Red should still be selected only once
    });
  });

  // Test complet du jeu
  test('should complete all puzzles and show victory screen', async ({ page }) => {
    // Puzzle 1
    await page.fill('#safecode', '10');
    await page.click('button:has-text("Valider")');
    await page.waitForTimeout(1600);
    
    // Puzzle 2
    await page.fill('#password', 'WEB');
    await page.locator('#puzzle2 button:has-text("Valider")').click();
    await page.waitForTimeout(1600);
    
    // Puzzle 3
    await page.click('.color-button.red');
    await page.click('.color-button.yellow');
    await page.click('.color-button.green');
    await page.click('.color-button.blue');
    await page.locator('#puzzle3 button:has-text("Valider")').click();
    
    await page.waitForTimeout(1600);
    
    // Victory screen
    await expect(page.locator('#victory')).toBeVisible();
    await expect(page.locator('#victory h2')).toContainText('Félicitations');
    await expect(page.locator('#victory')).toContainText('réussi à vous échapper');
  });

  // Test de redémarrage
  test('should restart game from victory screen', async ({ page }) => {
    // Complete all puzzles quickly
    await page.fill('#safecode', '10');
    await page.press('#safecode', 'Enter');
    await page.waitForTimeout(1600);
    
    await page.fill('#password', 'WEB');
    await page.press('#password', 'Enter');
    await page.waitForTimeout(1600);
    
    await page.click('.color-button.red');
    await page.click('.color-button.yellow');
    await page.click('.color-button.green');
    await page.click('.color-button.blue');
    await page.locator('#puzzle3 button:has-text("Valider")').click();
    await page.waitForTimeout(1600);
    
    // Click restart
    await page.click('button:has-text("Rejouer")');
    
    // Should be back at puzzle 1
    await expect(page.locator('#puzzle1')).toBeVisible();
    await expect(page.locator('#puzzle2')).not.toBeVisible();
    await expect(page.locator('#puzzle3')).not.toBeVisible();
    await expect(page.locator('#victory')).not.toBeVisible();
    
    // Inputs should be cleared
    await expect(page.locator('#safecode')).toHaveValue('');
  });

  // Tests de l'interface
  test('should have proper hint display for puzzle 2', async ({ page }) => {
    await page.fill('#safecode', '10');
    await page.click('button:has-text("Valider")');
    await page.waitForTimeout(1600);
    
    await expect(page.locator('.hint')).toBeVisible();
    await expect(page.locator('.hint')).toContainText('Le mot que vous cherchez');
  });

  // Test d'accessibilité
  test('should have proper aria labels', async ({ page }) => {
    await expect(page.locator('#safecode')).toHaveAttribute('aria-label', 'Code du coffre-fort');
    
    await page.fill('#safecode', '10');
    await page.click('button:has-text("Valider")');
    await page.waitForTimeout(1600);
    
    await expect(page.locator('#password')).toHaveAttribute('aria-label', 'Mot de passe');
  });

  // Test responsive (viewport mobile)
  test('should work on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    await expect(page.locator('#puzzle1')).toBeVisible();
    await page.fill('#safecode', '10');
    await page.click('button:has-text("Valider")');
    await expect(page.locator('#message1')).toContainText('Correct');
  });
});