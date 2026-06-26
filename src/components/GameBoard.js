import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CELL_SIZE } from '../utils/gameEngine';
import AnimatedEnemy from './AnimatedEnemy';
import AnimatedTower from './AnimatedTower';
import AnimatedProjectile from './AnimatedProjectile';
import { colors, spacing, radius, font } from '../theme';

const COLS = 12;
const ROWS = 6;

export default function GameBoard({
  level,
  enemies,
  towers,
  projectiles,
  onTowerPress,
  towerRanges,
}) {
  const boardWidth = COLS * CELL_SIZE;
  const boardHeight = ROWS * CELL_SIZE;

  const gridLines = useMemo(() => {
    const lines = [];
    for (let x = 0; x <= COLS; x++) {
      lines.push(
        <View
          key={`v-${x}`}
          style={[styles.gridLine, styles.vLine, { left: x * CELL_SIZE }]}
        />
      );
    }
    for (let y = 0; y <= ROWS; y++) {
      lines.push(
        <View
          key={`h-${y}`}
          style={[styles.gridLine, styles.hLine, { top: y * CELL_SIZE }]}
        />
      );
    }
    return lines;
  }, []);

  const pathCells = useMemo(
    () =>
      level.path.map((p, i) => {
        const isStart = i === 0;
        const isEnd = i === level.path.length - 1;
        return (
          <View
            key={`path-${i}`}
            style={[
              styles.pathCell,
              { left: p.x * CELL_SIZE, top: p.y * CELL_SIZE },
              isStart && styles.startCell,
              isEnd && styles.endCell,
            ]}
          >
            {isStart && <Text style={styles.pathLabel}>S</Text>}
            {isEnd && <Text style={styles.pathLabel}>E</Text>}
          </View>
        );
      }),
    [level.path]
  );

  const towerElements = useMemo(
    () =>
      level.towerSpots.map((spot, i) => {
        const tower = towers.find((t) => t.x === spot.x && t.y === spot.y);
        const solved = tower?.solved || false;

        return (
          <TouchableOpacity
            key={`spot-${i}`}
            style={[
              styles.towerSpot,
              {
                left: spot.x * CELL_SIZE + 2,
                top: spot.y * CELL_SIZE + 2,
              },
              solved && styles.towerSpotSolved,
            ]}
            onPress={() => onTowerPress && onTowerPress(spot, tower)}
            activeOpacity={0.7}
          >
            <AnimatedTower
              solved={solved}
              onPress={() => onTowerPress && onTowerPress(spot, tower)}
            />
          </TouchableOpacity>
        );
      }),
    [level.towerSpots, towers, towerRanges]
  );

  const enemyElements = enemies
    .filter((e) => e.alive)
    .map((enemy) => (
      <AnimatedEnemy key={enemy.id} enemy={enemy} />
    ));

  const projectileElements = projectiles.map((p) => (
    <AnimatedProjectile key={p.id} projectile={p} />
  ));

  return (
    <View style={styles.container}>
      <View style={[styles.grid, { width: boardWidth, height: boardHeight }]}>
        {gridLines}
        {pathCells}
        {towerElements}
        {enemyElements}
        {projectileElements}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', padding: spacing.sm },
  grid: {
    position: 'relative',
    backgroundColor: colors.bgDark,
    borderRadius: radius.lg,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: colors.border,
  },
  gridLine: { position: 'absolute', backgroundColor: colors.bgCard2 },
  vLine: { width: 1, height: '100%', top: 0 },
  hLine: { height: 1, width: '100%', left: 0 },
  pathCell: {
    position: 'absolute', width: CELL_SIZE, height: CELL_SIZE,
    backgroundColor: colors.bgCard2, borderWidth: 1, borderColor: colors.border,
    justifyContent: 'center', alignItems: 'center',
  },
  startCell: { backgroundColor: 'rgba(76,175,80,0.12)' },
  endCell: { backgroundColor: 'rgba(233,69,96,0.12)' },
  pathLabel: { color: 'rgba(255,255,255,0.25)', fontSize: font.sizeSm, fontWeight: 'bold' },
  towerSpot: {
    position: 'absolute', width: CELL_SIZE - 4, height: CELL_SIZE - 4,
    borderRadius: radius.lg,
    backgroundColor: 'rgba(233,69,96,0.06)',
    borderWidth: 2, borderColor: colors.primary, borderStyle: 'dashed',
    justifyContent: 'center', alignItems: 'center', zIndex: 5,
  },
  towerSpotSolved: {
    backgroundColor: 'rgba(76,175,80,0.08)',
    borderColor: colors.success, borderStyle: 'solid',
  },
});
