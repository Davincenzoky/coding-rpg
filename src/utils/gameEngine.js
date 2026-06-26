const CELL_SIZE = 50;

function getWaveConfig(level, waveIndex) {
  return level.waves[waveIndex] || level.waves[level.waves.length - 1];
}

export function createInitialState(level) {
  const enemies = [];
  const towers = level.towerSpots.map((spot, i) => ({
    id: i,
    x: spot.x,
    y: spot.y,
    challenge: level.challenges[i] || level.challenges[level.challenges.length - 1],
    solved: false,
    cooldown: 0,
    range: 3,
  }));
  return {
    level,
    towers,
    enemies,
    wave: 0,
    score: 0,
    lives: 10,
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
    enemies.push({
      id: Date.now() + Math.random(),
      pathIndex: 0,
      x: newState.level.path[0].x * CELL_SIZE,
      y: newState.level.path[0].y * CELL_SIZE,
      health: waveConfig.enemyHealth,
      maxHealth: waveConfig.enemyHealth,
      speed: waveConfig.enemySpeed * 30,
      alive: true,
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

      if (dist < enemy.speed * dt) {
        return { ...enemy, x: targetX, y: targetY, pathIndex: nextIdx };
      }
      const vx = (dx / dist) * enemy.speed * dt;
      const vy = (dy / dist) * enemy.speed * dt;
      return { ...enemy, x: enemy.x + vx, y: enemy.y + vy };
    })
    .filter((e) => e.alive);

  newState.enemies = enemies;
  return newState;
}

export function getCellCenter(cellX, cellY) {
  return { x: cellX * CELL_SIZE + CELL_SIZE / 2, y: cellY * CELL_SIZE + CELL_SIZE / 2 };
}

export function getDistance(x1, y1, x2, y2) {
  return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
}

export { CELL_SIZE };
