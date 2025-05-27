# 🕸️ Escape The Web de Luc Houvrard

Un mini-jeu d'escape game développé en JavaScript avec une approche TDD (Test-Driven Development). Le joueur doit résoudre trois énigmes pour s'échapper du web !

## 📖 Description

**Escape The Web** est un jeu d'évasion interactif qui met le joueur au défi de résoudre trois puzzles consécutifs :

1. **Le Coffre-fort** : Résoudre une équation mathématique simple
2. **Le Mot Caché** : Découvrir un mot dissimulé dans un texte d'indices
3. **L'Ordre des Couleurs** : Organiser les couleurs selon le spectre visible

Le jeu présente une interface moderne avec des animations fluides, des effets visuels attractifs et une expérience utilisateur soignée.

## 🎮 Comment Jouer

1. **Énigme 1** : Entrez la réponse à l'équation `1 + 2 + 3 + 4 = ?`
2. **Énigme 2** : Trouvez le mot caché dans l'indice fourni
3. **Énigme 3** : Sélectionnez les couleurs dans l'ordre du spectre visible (🔴🟡🟢🔵)

Chaque énigme doit être résolue pour accéder à la suivante. Une fois toutes les énigmes résolues, l'écran de victoire s'affiche !

## 🚀 Installation et Lancement

### Prérequis
- Node.js (version 14 ou supérieure)
- Un serveur web local (Live Server recommandé pour VSCode)

### Installation des dépendances
```bash
npm install
```

### Lancement du jeu
1. **Avec Live Server (recommandé)** :
   - Ouvrez `src/index.html` avec Live Server dans VSCode
   - Le jeu sera accessible à `http://127.0.0.1:5500/src/index.html`

2. **Avec http-server** :
   ```bash
   npm run serve
   ```
   - Accédez à `http://localhost:8080`

## 🧪 Tests

Le projet utilise une approche TDD avec deux types de tests :

### Tests Unitaires (Jest)
```bash
# Lancer tous les tests
npm test

# Tests en mode watch
npm run test:watch

# Tests avec couverture
npm run test:coverage
```

**Coverage actuel** : 98.6% (35/36 statements, 27/28 branches)

### Tests End-to-End (Playwright)
```bash
# Prérequis : Lancer Live Server sur le port 5500
npm run test:e2e
```

Les tests E2E couvrent :
- Navigation entre les puzzles
- Validation des entrées utilisateur
- Interactions avec l'interface
- Responsivité mobile
- Accessibilité

## 📁 Structure du Projet

```
escape-the-web/
├── src/
│   ├── index.html          # Interface principale du jeu
│   ├── game.js             # Logique métier (classe EscapeGame)
│   └── style.css           # Styles CSS (vide, styles intégrés dans HTML)
├── tests/
│   ├── unit/
│   │   └── game.test.js    # Tests unitaires Jest
│   └── e2e/
│       └── game.e2e.test.js # Tests E2E Playwright
├── coverage/               # Rapports de couverture de code
├── jest.config.js          # Configuration Jest
├── playwright.config.js    # Configuration Playwright
├── .eslintrc.js           # Configuration ESLint
├── .prettierrc            # Configuration Prettier
└── package.json
```

## 🛠️ Scripts Disponibles

```bash
npm test              # Lance les tests unitaires
npm run test:watch    # Tests unitaires en mode watch
npm run test:coverage # Tests avec rapport de couverture
npm run test:e2e      # Tests end-to-end Playwright
npm run lint          # Vérification du code avec ESLint
npm run format        # Formatage du code avec Prettier
npm run serve         # Serveur de développement
npm run build         # Construction pour production
```

## 🎨 Caractéristiques Techniques

### Frontend
- **HTML5** avec sémantique moderne
- **CSS3** avec animations et effets glassmorphism
- **JavaScript ES6+** avec classes et modules
- **Design responsive** adapté mobile/desktop
- **Accessibilité** avec labels ARIA appropriés

### Qualité de Code
- **ESLint** pour la qualité du code
- **Prettier** pour le formatage automatique
- **Jest** pour les tests unitaires (98.6% de couverture)
- **Playwright** pour les tests E2E
- **CI/CD** avec GitHub Actions

### Architecture
- **Séparation des responsabilités** : logique métier isolée dans `game.js`
- **Approche TDD** : tests écrits avant l'implémentation
- **Modularité** : classe `EscapeGame` réutilisable
- **État de jeu centralisé** avec méthodes de validation

## 🔧 Configuration

### Jest (`jest.config.js`)
- Environnement : jsdom
- Couverture : 100% requis pour branches, fonctions, lignes et statements
- Répertoire de tests : `tests/unit/`

### Playwright (`playwright.config.js`)
- Tests E2E dans `tests/e2e/`
- Configuration pour Live Server (port 5500)
- Support multi-navigateurs
- Retry automatique

### ESLint (`.eslintrc.js`)
- Règles recommandées + Jest + Prettier
- Support ES2021, Browser, Node.js
- Règles strictes pour la qualité du code

## 🤝 Contribution

1. Forkez le projet
2. Créez une branche feature (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add AmazingFeature'`)
4. Poussez vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

### Standards de Code
- Suivre la configuration ESLint
- Maintenir 100% de couverture de tests
- Ajouter des tests E2E pour les nouvelles fonctionnalités
- Utiliser Prettier pour le formatage

## 📝 License

Ce projet est sous licence ISC.

## 🎯 Roadmap

- [ ] Système de scores
- [ ] Nouvelles énigmes
- [ ] Musique et effets sonores
- [ ] Mode multijoueur
- [ ] Sauvegarde de progression
- [ ] Thèmes personnalisables

---

**Développé avec ❤️ en utilisant TDD et les meilleures pratiques JavaScript**
