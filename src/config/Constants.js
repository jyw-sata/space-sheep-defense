export const GRID = {
  COLS: 18,
  ROWS: 24,
  CELL_SIZE: 40,
  OFFSET_X: 0,
  OFFSET_Y: 80, // Top UI space
};

export const COLORS = {
  BG: 0x0a0a2e,
  GRID_LINE: 0x2a2a5e,
  UI_BG: 0x1a1a3e,
  ACCENT: 0x00ffcc,
  DANGER: 0xff0044,
  GOLD: 0xffdd00,
  TEXT: '#00ffcc',
  TEXT_WHITE: '#ffffff',
  TEXT_DANGER: '#ff0044',
};

export const TOWER_TYPES = {
  plasma: {
    name: 'Plasma',
    key: 'tower_plasma',
    bulletKey: 'bullet_plasma',
    cost: 50,
    damage: 15,
    range: 3, // in grid cells
    fireRate: 800, // ms between shots
    color: 0x0088ff,
    description: 'Balanced. Hits ground & air.',
    canHitAir: true,
    upgrades: [
      { cost: 40, damage: 25, range: 3.5, fireRate: 700 },
      { cost: 80, damage: 40, range: 4, fireRate: 600 },
      { cost: 150, damage: 60, range: 4.5, fireRate: 500 },
    ],
  },
  laser: {
    name: 'Laser',
    key: 'tower_laser',
    bulletKey: 'bullet_laser',
    cost: 75,
    damage: 25,
    range: 4,
    fireRate: 1000,
    color: 0xff4444,
    description: 'High damage, single target.',
    canHitAir: true,
    upgrades: [
      { cost: 60, damage: 40, range: 4.5, fireRate: 900 },
      { cost: 120, damage: 65, range: 5, fireRate: 800 },
      { cost: 200, damage: 100, range: 5.5, fireRate: 700 },
    ],
  },
  slow: {
    name: 'Slow',
    key: 'tower_slow',
    bulletKey: 'bullet_slow',
    cost: 60,
    damage: 5,
    range: 2.5,
    fireRate: 1200,
    color: 0x00cccc,
    description: 'Slows enemies in area.',
    canHitAir: false,
    slowFactor: 0.5,
    slowDuration: 2000,
    upgrades: [
      { cost: 50, damage: 8, range: 3, slowFactor: 0.4 },
      { cost: 100, damage: 12, range: 3.5, slowFactor: 0.3 },
      { cost: 180, damage: 18, range: 4, slowFactor: 0.2 },
    ],
  },
  missile: {
    name: 'Missile',
    key: 'tower_missile',
    bulletKey: 'bullet_missile',
    cost: 100,
    damage: 40,
    range: 3.5,
    fireRate: 1500,
    color: 0xff8800,
    description: 'AoE splash damage.',
    canHitAir: false,
    splashRadius: 1.5,
    upgrades: [
      { cost: 80, damage: 60, range: 4, fireRate: 1300 },
      { cost: 150, damage: 90, range: 4.5, fireRate: 1100 },
      { cost: 250, damage: 140, range: 5, fireRate: 900 },
    ],
  },
  flak: {
    name: 'Flak',
    key: 'tower_flak',
    bulletKey: 'bullet_flak',
    cost: 80,
    damage: 30,
    range: 3.5,
    fireRate: 600,
    color: 0x8844ff,
    description: 'Anti-air specialist.',
    canHitAir: true,
    airOnly: true,
    upgrades: [
      { cost: 60, damage: 50, range: 4, fireRate: 500 },
      { cost: 120, damage: 75, range: 4.5, fireRate: 400 },
      { cost: 200, damage: 110, range: 5, fireRate: 300 },
    ],
  },
};

export const ENEMY_TYPES = {
  basic: {
    name: 'Grey Scout',
    key: 'enemy_basic',
    hp: 50,
    speed: 45,
    reward: 12,
    flying: false,
  },
  fast: {
    name: 'Critter',
    key: 'enemy_fast',
    hp: 25,
    speed: 90,
    reward: 18,
    flying: false,
  },
  tank: {
    name: 'Heavy Grey',
    key: 'enemy_tank',
    hp: 180,
    speed: 28,
    reward: 30,
    flying: false,
  },
  flying: {
    name: 'Scout UFO',
    key: 'enemy_flying',
    hp: 40,
    speed: 55,
    reward: 25,
    flying: true,
  },
  boss: {
    name: 'Grey Emperor',
    key: 'enemy_boss',
    hp: 600,
    speed: 20,
    reward: 150,
    flying: false,
  },
};

export const WAVES = [
  // Wave 1-3: Tutorial (basic only, few enemies)
  { enemies: [{ type: 'basic', count: 3 }], delay: 1500 },
  { enemies: [{ type: 'basic', count: 4 }], delay: 1300 },
  { enemies: [{ type: 'basic', count: 5 }], delay: 1200 },
  // Wave 4-6: Introduce fast
  { enemies: [{ type: 'basic', count: 4 }, { type: 'fast', count: 2 }], delay: 1100 },
  { enemies: [{ type: 'fast', count: 5 }], delay: 1000 },
  { enemies: [{ type: 'basic', count: 5 }, { type: 'fast', count: 3 }], delay: 1000 },
  // Wave 7-9: Introduce tanks
  { enemies: [{ type: 'tank', count: 2 }, { type: 'basic', count: 4 }], delay: 1100 },
  { enemies: [{ type: 'basic', count: 6 }, { type: 'tank', count: 2 }], delay: 1000 },
  { enemies: [{ type: 'tank', count: 3 }, { type: 'fast', count: 4 }], delay: 900 },
  // Wave 10-12: Introduce flying
  { enemies: [{ type: 'flying', count: 3 }], delay: 1000 },
  { enemies: [{ type: 'basic', count: 6 }, { type: 'flying', count: 3 }], delay: 900 },
  { enemies: [{ type: 'tank', count: 3 }, { type: 'flying', count: 3 }, { type: 'fast', count: 3 }], delay: 800 },
  // Wave 13-16: Mid difficulty
  { enemies: [{ type: 'fast', count: 8 }, { type: 'basic', count: 5 }], delay: 700 },
  { enemies: [{ type: 'tank', count: 4 }, { type: 'flying', count: 4 }], delay: 800 },
  { enemies: [{ type: 'basic', count: 8 }, { type: 'fast', count: 5 }, { type: 'flying', count: 3 }], delay: 700 },
  { enemies: [{ type: 'tank', count: 5 }, { type: 'fast', count: 6 }], delay: 600 },
  // Wave 17-19: Hard
  { enemies: [{ type: 'tank', count: 5 }, { type: 'flying', count: 5 }, { type: 'fast', count: 5 }], delay: 600 },
  { enemies: [{ type: 'fast', count: 10 }, { type: 'flying', count: 5 }], delay: 500 },
  { enemies: [{ type: 'tank', count: 6 }, { type: 'basic', count: 8 }, { type: 'flying', count: 4 }], delay: 500 },
  // Wave 20: Boss
  { enemies: [{ type: 'boss', count: 1 }, { type: 'tank', count: 3 }, { type: 'flying', count: 3 }, { type: 'basic', count: 5 }], delay: 700 },
];
