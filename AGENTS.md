# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v56.0.0/ before writing any code.

## Project
- Web-based coding tower defense RPG at `C:\Users\vbadu\Videos\coding-rpg`
- React Native Expo with Firebase Auth + Firestore leaderboard
- Deployed to GitHub Pages: `https://davincenzoky.github.io/coding-rpg`
- Deploy via `deploy.ps1` (builds with `npx expo export --platform web`, injects PWA/manifest/anti-tamper/fonts)

## Progress
### Done
- Initial Expo project setup with web support
- Firebase auth (email/password), leaderboard (best score per email)
- 12x6 game board, path rendering, enemy movement, tower placement
- Animated enemy (bounce, pulse, eyes, antenna, HP bar), tower (rotating dish, pulse glow), projectile (glow trail)
- Building-block code challenge (tap to answer, shake on wrong, skip, 6 choices, randomized order)
- 100 levels per tech stack (Beginner 1-25, Intermediate 26-50, Advanced 51-75, Expert 76-100)
- 5 tech stacks: JavaScript, Python, HTML/CSS, SQL, React
- Countdown overlay before waves with animated numbers and bar
- Theme system (dark/light, CSS variables, localStorage persistence, CSS transitions)
- Responsive layout (breakpoints, Inter font, custom scrollbar, box-sizing)
- Game board scales to viewport via `useWindowDimensions`
- Anti-tamper (right-click, F12, Ctrl+Shift+I/J/C, Ctrl+U)
- PWA manifest + service worker
- Keyboard shortcuts (Enter=retry/next, Escape=back, 1-6=select answer)
- Animated score counter (eased count-up), confetti particles on victory
- HUD shake animation on life loss
- Tutorial once per browser session
- Randomized challenges per tower per session
- CodeChallenge defensive guards (missing choices/hints fallback)
- ErrorBoundary, custom logo, .nojekyll for GitHub Pages

### Phase 2 - Core Gameplay Expansion (COMPLETE)
- **Tower types**: normal, ice (slows enemies), sniper (high damage), mgun (fast fire). Random per spot. Visual color/emoji variants. Projectile colors match type.
- **Enemy varieties**: normal, fast (2x speed/0.5x HP), tanky (0.5x speed/3x HP), boss (6x HP). Pool unlocks per tier. Last wave gets toughest.
- **Multiple waves**: Beginner=1, Intermediate=2, Advanced=3, Expert=4 waves. HP/speed/count scale per wave within level.
- **Tower upgrades**: Tap solved tower → see type/level → solve another challenge → upgrade (Lv.1-5). +0.5 damage, +0.3 range per level.
- **HUD updates**: Shows active enemy count, solved tower count.
- **Tutorial updated**: Covers tower types, enemy types, multi-wave, upgrades.

## Key Files
- `App.js` - Root with auth-gated navigation, ErrorBoundary, ThemeProvider
- `src/theme.js` - Design tokens with CSS variable strings
- `src/contexts/ThemeContext.js` - Theme toggle with CSS variable injection
- `src/utils/gameEngine.js` - Tower state, enemy movement, projectile physics, TOWER_TYPES/ENEMY_TYPES configs
- `src/data/levels.js` - Challenge pools, level generator with multi-wave and tower type assignment
- `src/screens/GameScreen.js` - Main game loop, tower press/solve/upgrade, projectile logic
- `src/components/GameBoard.js` - Grid with responsive scaling, passes tower type/level to tower component
- `src/components/AnimatedTower.js` - Visual tower with type-specific colors and level badge
- `src/components/AnimatedProjectile.js` - Projectile with type-specific color
- `src/components/AnimatedEnemy.js` - Enemy visual with type variations
- `src/components/HUD.js` - Score/wave/enemies/lives display with shake animation
- `src/components/CodeChallenge.js` - Building-block tap interface with keyboard shortcuts
- `src/components/Tutorial.js` - Tutorial with steps for all current features
- `src/components/Confetti.js` - Victory confetti animation
- `src/components/AnimatedNumber.js` - Eased count-up animation
- `src/components/ChatWidget.js` - Real-time chat for player global conversation
- `src/hooks/useKeyboard.js` - Keyboard shortcut hook
- `src/services/firebase.js` - Firebase config with real API keys
- `src/services/leaderboardService.js` - Score save/leaderboard query
- `deploy.ps1` - Build-fix-deploy pipeline with PWA/anti-tamper injection

## Critical Rules
- Always use `useNativeDriver: false` on Animated.timing (web compatibility)
- Firebase Firestore `leaderboard` collection: documents keyed by sanitized email, `{ email, displayName, bestScore, topLevel }`
- No composite index needed (no `where` with `orderBy`)
- Deploy: `npx expo export --platform web` then inject then `npx gh-pages -d dist`
- `.nojekyll` required on gh-pages branch for `_expo/` directory
- MetaMask extension errors in console are harmless (Chrome extension issue)
