const CELL_SIZE = 50;

export const TOWER_TYPES = {
  normal: { label: 'Basic', range: 3, damage: 1, cooldown: 0.3, color: '#4caf50', emoji: '🛡️' },
  ice:    { label: 'Ice',   range: 2.5, damage: 0.5, cooldown: 0.5, color: '#4fc3f7', emoji: '❄️', slowFactor: 0.5, slowDuration: 1.5 },
  sniper: { label: 'Sniper', range: 5, damage: 3, cooldown: 1.0, color: '#ff6b6b', emoji: '🎯' },
  mgun:   { label: 'MG',    range: 2, damage: 0.5, cooldown: 0.08, color: '#ffd93d', emoji: '⚡' },
};

export const ENEMY_TYPES = {
  normal: { label: 'Bug', speedMult: 1, hpMult: 1, bodyColor: '#c62828', size: 1 },
  fast:   { label: 'Fast Bug', speedMult: 2, hpMult: 0.5, bodyColor: '#e65100', size: 0.8 },
  tanky:  { label: 'Tank Bug', speedMult: 0.5, hpMult: 3, bodyColor: '#4a148c', size: 1.4 },
  boss:   { label: 'BOSS', speedMult: 1.2, hpMult: 6, bodyColor: '#1a237e', size: 1.8 },
};

function getWaveConfig(level, waveIndex) {
  return level.waves[waveIndex] || level.waves[level.waves.length - 1];
}

export function createInitialState(level, initialLives = 5) {
  const enemies = [];
  const towers = level.towerSpots.map((spot, i) => ({
    id: i,
    x: spot.x,
    y: spot.y,
    challenge: level.challenges[i] || level.challenges[level.challenges.length - 1],
    solved: false,
    type: spot.towerType || 'normal',
    level: 1,
    solves: 0,
    cooldown: 0,
    range: 3,
    damage: 1,
  }));
  return {
    level,
    towers,
    enemies,
    wave: 0,
    score: 0,
    lives: Math.max(1, initialLives),
    gameOver: false,
    victory: false,
    waveInProgress: false,
    spawnTimer: 0,
    pathIndex: 0,
    activeChallenge: null,
    showChallenge: false,
  };
}

export function startWave(state) {
  const totalWaves = state.level.waves.length;
  if (state.wave >= totalWaves) return state;
  return {
    ...state,
    wave: state.wave + 1,
    waveInProgress: true,
    spawnTimer: 0,
    pathIndex: 0,
  };
}

export function updateGame(state, dt) {
  if (state.gameOver || state.victory || !state.waveInProgress) return state;

  let newState = { ...state };
  let { enemies } = newState;
  const totalWaves = newState.level.waves.length;
  const waveIdx = newState.wave - 1;
  const waveConfig = getWaveConfig(newState.level, waveIdx);

  if (enemies.length === 0 && newState.pathIndex >= waveConfig.enemiesPerWave) {
    if (newState.wave >= totalWaves) {
      newState.victory = true;
      newState.waveInProgress = false;
    } else {
      newState.waveInProgress = false;
    }
    return newState;
  }

  newState.spawnTimer += dt;
  if (newState.spawnTimer > 1.0 && newState.pathIndex < waveConfig.enemiesPerWave) {
    const enemyTypes = waveConfig.enemyTypes || ['normal'];
    const type = enemyTypes[Math.floor(Math.random() * enemyTypes.length)] || 'normal';
    const eType = ENEMY_TYPES[type] || ENEMY_TYPES.normal;
    const baseHp = waveConfig.enemyHealth || 1;
    const baseSpeed = (waveConfig.enemySpeed || 1) * 30;
    enemies.push({
      id: Date.now() + Math.random(),
      pathIndex: 0,
      x: newState.level.path[0].x * CELL_SIZE,
      y: newState.level.path[0].y * CELL_SIZE,
      health: Math.round(baseHp * eType.hpMult),
      maxHealth: Math.round(baseHp * eType.hpMult),
      speed: baseSpeed * eType.speedMult,
      alive: true,
      type,
      slowTimer: 0,
    });
    newState.spawnTimer = 0;
    newState.pathIndex++;
  }

  const path = newState.level.path;

  enemies = enemies
    .map((enemy) => {
      if (!enemy.alive) return enemy;
      const nextIdx = enemy.pathIndex + 1;
      if (nextIdx >= path.length) {
        newState.lives--;
        return { ...enemy, alive: false };
      }
      const current = path[enemy.pathIndex];
      const next = path[nextIdx];
      const targetX = next.x * CELL_SIZE;
      const targetY = next.y * CELL_SIZE;

      let dx = targetX - enemy.x;
      let dy = targetY - enemy.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      let speed = enemy.speed;
      if (enemy.slowTimer > 0) {
        speed *= 0.5;
        enemy.slowTimer -= dt;
      }

      if (dist < speed * dt) {
        return { ...enemy, x: targetX, y: targetY, pathIndex: nextIdx, slowTimer: Math.max(0, enemy.slowTimer - dt) };
      }
      const vx = (dx / dist) * speed * dt;
      const vy = (dy / dist) * speed * dt;
      return { ...enemy, x: enemy.x + vx, y: enemy.y + vy, slowTimer: Math.max(0, enemy.slowTimer - dt) };
    })
    .filter((e) => e.alive);

  newState.enemies = enemies;

  // Process tower slow/freeze effects
  newState.towers.forEach(t => {
    if (!t.solved) return;
    const tType = TOWER_TYPES[t.type] || TOWER_TYPES.normal;
    if (tType.slowFactor && tType.slowDuration) {
      const center = getCellCenter(t.x, t.y);
      newState.enemies.forEach(e => {
        if (!e.alive) return;
        const dist = getDistance(center.x, center.y, e.x, e.y);
        if (dist < tType.range * CELL_SIZE) {
          e.slowTimer = tType.slowDuration;
        }
      });
    }
  });

  return newState;
}

export function getCellCenter(cellX, cellY) {
  return { x: cellX * CELL_SIZE + CELL_SIZE / 2, y: cellY * CELL_SIZE + CELL_SIZE / 2 };
}

export function getDistance(x1, y1, x2, y2) {
  return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
}

export { CELL_SIZE };
