import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useWindowDimensions } from 'react-native';
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
  const { width: winWidth } = useWindowDimensions();
  const scale = Math.min(1, (winWidth - 32) / (COLS * CELL_SIZE));

  const cellSize = CELL_SIZE * scale;

  const boardWidth = COLS * cellSize;
  const boardHeight = ROWS * cellSize;

  const gridLines = useMemo(() => {
    const lines = [];
    for (let x = 0; x <= COLS; x++) {
      lines.push(
        <View
          key={`v-${x}`}
          style={[styles.gridLine, styles.vLine, { left: x * cellSize }]}
        />
      );
    }
    for (let y = 0; y <= ROWS; y++) {
      lines.push(
        <View
          key={`h-${y}`}
          style={[styles.gridLine, styles.hLine, { top: y * cellSize }]}
        />
      );
    }
    return lines;
  }, [cellSize]);

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
              { left: p.x * cellSize, top: p.y * cellSize, width: cellSize, height: cellSize },
              isStart && styles.startCell,
              isEnd && styles.endCell,
            ]}
          >
            {isStart && <Text style={styles.pathLabel}>S</Text>}
            {isEnd && <Text style={styles.pathLabel}>E</Text>}
          </View>
        );
      }),
    [level.path, cellSize]
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
                left: spot.x * cellSize + 2 * scale,
                top: spot.y * cellSize + 2 * scale,
                width: cellSize - 4 * scale,
                height: cellSize - 4 * scale,
                borderRadius: radius.lg * scale,
              },
              solved && styles.towerSpotSolved,
            ]}
            onPress={() => onTowerPress && onTowerPress(spot, tower)}
            activeOpacity={0.7}
          >
            <AnimatedTower
              solved={solved}
              onPress={() => onTowerPress && onTowerPress(spot, tower)}
              scale={scale}
              towerType={tower?.type || spot.towerType || 'normal'}
              level={tower?.level || 1}
            />
          </TouchableOpacity>
        );
      }),
    [level.towerSpots, towers, towerRanges, cellSize, scale]
  );

  const enemyElements = enemies
    .filter((e) => e.alive)
    .map((enemy) => (
      <AnimatedEnemy key={enemy.id} enemy={enemy} scale={scale} />
    ));

  const projectileElements = projectiles.map((p) => (
    <AnimatedProjectile key={p.id} projectile={p} scale={scale} />
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
  container: { alignItems: 'center', padding: spacing.sm, width: '100%' },
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
    position: 'absolute',
    backgroundColor: colors.bgCard2, borderWidth: 1, borderColor: colors.border,
    justifyContent: 'center', alignItems: 'center',
  },
  startCell: { backgroundColor: 'rgba(76,175,80,0.12)' },
  endCell: { backgroundColor: 'rgba(233,69,96,0.12)' },
  pathLabel: { color: 'rgba(255,255,255,0.25)', fontSize: font.sizeSm, fontWeight: 'bold' },
  towerSpot: {
    position: 'absolute',
    backgroundColor: 'rgba(233,69,96,0.06)',
    borderWidth: 2, borderColor: colors.primary, borderStyle: 'dashed',
    justifyContent: 'center', alignItems: 'center', zIndex: 5,
  },
  towerSpotSolved: {
    backgroundColor: 'rgba(76,175,80,0.08)',
    borderColor: colors.success, borderStyle: 'solid',
  },
});
