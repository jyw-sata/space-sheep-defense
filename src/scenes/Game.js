import Phaser from 'phaser';
import { GRID, COLORS, TOWER_TYPES, ENEMY_TYPES } from '../config/Constants.js';
import { PathManager } from '../systems/PathManager.js';
import { WaveManager } from '../systems/WaveManager.js';

export class GameScene extends Phaser.Scene {
  constructor() {
    super('Game');
  }

  create() {
    this.pathManager = new PathManager();
    this.waveManager = new WaveManager(this);

    // Game state
    this.coins = 400;
    this.sheepCount = 10;
    this.selectedTower = null; // tower type key to place
    this.towers = [];
    this.enemies = [];
    this.projectiles = [];
    this.gameSpeed = 1;
    this.isPaused = false;
    this.waveStarted = false;

    // Create layers
    this.gridLayer = this.add.container(0, 0);
    this.entityLayer = this.add.container(0, 0);
    this.uiLayer = this.add.container(0, 0);
    this.uiLayer.setDepth(100);

    this.createStarfield();
    this.createGrid();
    this.createSheep();
    this.createSpawnPoints();
    this.createUI();
    this.setupInput();

    // Ghost tower for placement preview
    this.ghostTower = null;
    this.ghostValid = null;
  }

  createStarfield() {
    for (let i = 0; i < 50; i++) {
      const x = Phaser.Math.Between(0, 720);
      const y = Phaser.Math.Between(0, 1280);
      const star = this.add.circle(x, y, Phaser.Math.FloatBetween(0.3, 1.2), 0xffffff, 0.4);
      star.setDepth(-1);
    }
  }

  createGrid() {
    for (let row = 0; row < GRID.ROWS; row++) {
      for (let col = 0; col < GRID.COLS; col++) {
        const x = GRID.OFFSET_X + col * GRID.CELL_SIZE + GRID.CELL_SIZE / 2;
        const y = GRID.OFFSET_Y + row * GRID.CELL_SIZE + GRID.CELL_SIZE / 2;
        const cell = this.add.image(x, y, 'cell');
        this.gridLayer.add(cell);
      }
    }
  }

  createSheep() {
    this.sheepSprites = [];
    const sheepPositions = [
      { col: 8, row: 11 }, { col: 9, row: 11 }, { col: 10, row: 11 },
      { col: 8, row: 12 }, { col: 9, row: 12 }, { col: 10, row: 12 },
      { col: 8, row: 13 }, { col: 9, row: 13 }, { col: 10, row: 13 },
      { col: 9, row: 12 }, // 10th sheep in center
    ];

    // Draw sheep pen
    for (const area of this.pathManager.sheepArea) {
      const pos = this.pathManager.gridToWorld(area.col, area.row);
      this.add.image(pos.x, pos.y, 'sheep_pen');
    }

    for (let i = 0; i < 10; i++) {
      const p = sheepPositions[i];
      const pos = this.pathManager.gridToWorld(p.col, p.row);
      const offsetX = Phaser.Math.Between(-8, 8);
      const offsetY = Phaser.Math.Between(-8, 8);
      const sheep = this.add.image(pos.x + offsetX, pos.y + offsetY, 'sheep').setScale(1.3);
      this.entityLayer.add(sheep);

      // Idle animation
      this.tweens.add({
        targets: sheep,
        y: sheep.y - 3,
        duration: 800 + Phaser.Math.Between(0, 400),
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });

      this.sheepSprites.push(sheep);
    }
  }

  createSpawnPoints() {
    for (const spawn of this.pathManager.spawnPoints) {
      const pos = this.pathManager.gridToWorld(spawn.col, spawn.row);
      const sp = this.add.image(pos.x, pos.y, 'spawn_point');
      this.gridLayer.add(sp);

      // Pulsing effect
      this.tweens.add({
        targets: sp,
        alpha: 0.4,
        duration: 1000,
        yoyo: true,
        repeat: -1,
      });
    }
  }

  createUI() {
    const w = 720;

    // Top bar background
    this.add.rectangle(w / 2, 40, w, 80, 0x0a0a2e, 0.9).setDepth(100);

    // Coins
    this.add.image(30, 25, 'coin').setDepth(100).setScale(1.5);
    this.coinsText = this.add.text(50, 16, `${this.coins}`, {
      fontFamily: 'monospace', fontSize: '20px', fill: '#ffdd00', fontStyle: 'bold',
    }).setDepth(100);

    // Sheep count
    this.add.image(30, 55, 'sheep').setDepth(100).setScale(0.7);
    this.sheepText = this.add.text(50, 46, `${this.sheepCount}/10`, {
      fontFamily: 'monospace', fontSize: '18px', fill: '#ffffff',
    }).setDepth(100);

    // Wave info
    this.waveText = this.add.text(w / 2, 20, '시작을 누르세요!', {
      fontFamily: 'monospace', fontSize: '18px', fill: '#00ffcc', fontStyle: 'bold',
    }).setOrigin(0.5).setDepth(100);

    // Speed button
    this.speedBtn = this.add.text(w - 70, 15, '1x', {
      fontFamily: 'monospace', fontSize: '18px', fill: '#00ffcc',
      backgroundColor: '#1a1a3e', padding: { x: 8, y: 4 },
    }).setInteractive().setDepth(100);
    this.speedBtn.on('pointerdown', () => this.toggleSpeed());

    // Start/Next wave button
    this.startBtn = this.add.text(w - 70, 48, 'START', {
      fontFamily: 'monospace', fontSize: '14px', fill: '#00ff88',
      backgroundColor: '#1a1a3e', padding: { x: 8, y: 4 },
    }).setInteractive().setDepth(100);
    this.startBtn.on('pointerdown', () => this.onStartWave());

    // Bottom tower selection panel
    const panelY = 1170;
    this.add.rectangle(w / 2, panelY + 55, w, 220, 0x0a0a2e, 0.95).setDepth(100);

    // Selected tower info text (above buttons)
    this.infoText = this.add.text(w / 2, panelY - 5, '타워를 선택하세요', {
      fontFamily: 'monospace', fontSize: '13px', fill: '#8888aa',
    }).setOrigin(0.5).setDepth(101);

    const towerKeys = Object.keys(TOWER_TYPES);
    const towerNames = { plasma: '플라즈마', laser: '레이저', slow: '냉동', missile: '미사일', flak: '대공포' };
    const towerEmojis = { plasma: '🔫', laser: '🔴', slow: '❄️', missile: '🚀', flak: '💜' };
    const towerDesc = {
      plasma: '만능형\n지상+공중',
      laser: '고데미지\n지상+공중',
      slow: '감속\n지상전용',
      missile: '범위폭발\n지상전용',
      flak: '대공전문\n공중전용',
    };
    const spacing = 136;
    const startX = 80;
    const rowY = panelY + 35;

    this.towerButtons = [];
    towerKeys.forEach((key, i) => {
      const tower = TOWER_TYPES[key];
      const x = startX + i * spacing;
      const y = rowY;

      // Slot background (bigger)
      const slot = this.add.image(x, y, 'tower_slot').setScale(1.3, 1.6).setInteractive().setDepth(100);

      // Emoji label
      this.add.text(x, y - 35, towerEmojis[key], {
        fontSize: '18px',
      }).setOrigin(0.5).setDepth(101);

      // Tower icon
      const icon = this.add.image(x, y - 14, tower.key).setScale(0.85).setDepth(101);

      // Name (Korean, bigger)
      this.add.text(x, y + 10, towerNames[key], {
        fontFamily: 'monospace', fontSize: '12px', fill: '#ffffff', fontStyle: 'bold',
      }).setOrigin(0.5).setDepth(101);

      // Short description
      this.add.text(x, y + 32, towerDesc[key], {
        fontFamily: 'monospace', fontSize: '9px', fill: '#8888cc', align: 'center', lineSpacing: 2,
      }).setOrigin(0.5).setDepth(101);

      // Cost text (bigger, clearer)
      const costText = this.add.text(x, y + 55, `💰${tower.cost}`, {
        fontFamily: 'monospace', fontSize: '13px', fill: '#ffdd00', fontStyle: 'bold',
      }).setOrigin(0.5).setDepth(101);

      slot.on('pointerdown', () => this.selectTower(key));

      this.towerButtons.push({ slot, icon, costText, key });
    });

    // Tower action panel (upgrade/sell) - hidden initially
    this.actionPanel = this.add.container(0, 0).setDepth(200).setVisible(false);
    this.selectedTowerForAction = null;
  }

  setupInput() {
    this.input.on('pointerdown', (pointer) => {
      if (pointer.y < GRID.OFFSET_Y || pointer.y > GRID.OFFSET_Y + GRID.ROWS * GRID.CELL_SIZE) return;

      const { col, row } = this.pathManager.worldToGrid(pointer.x, pointer.y);
      if (col < 0 || col >= GRID.COLS || row < 0 || row >= GRID.ROWS) return;

      if (this.selectedTower) {
        this.tryPlaceTower(col, row);
      } else {
        this.trySelectPlacedTower(col, row);
      }
    });

    this.input.on('pointermove', (pointer) => {
      if (!this.selectedTower) return;
      if (pointer.y < GRID.OFFSET_Y || pointer.y > GRID.OFFSET_Y + GRID.ROWS * GRID.CELL_SIZE) return;

      const { col, row } = this.pathManager.worldToGrid(pointer.x, pointer.y);
      this.updateGhostTower(col, row);
    });
  }

  selectTower(key) {
    if (this.selectedTower === key) {
      this.selectedTower = null;
      this.clearGhost();
      this.infoText.setText('');
      this.highlightTowerButton(null);
      return;
    }

    const tower = TOWER_TYPES[key];
    if (this.coins < tower.cost) {
      this.showFloatingText(360, 1160, '코인 부족!', '#ff0044');
      return;
    }

    this.selectedTower = key;
    this.hideActionPanel();
    const kNames = { plasma: '플라즈마', laser: '레이저', slow: '냉동', missile: '미사일', flak: '대공포' };
    const kDesc = { plasma: '만능형 - 지상+공중 공격', laser: '고데미지 저격 - 지상+공중', slow: '적 감속 - 지상전용', missile: '범위 폭발 - 지상전용', flak: '대공 전문 - 공중전용' };
    this.infoText.setText(`${kNames[key]}: ${kDesc[key]}`);
    this.highlightTowerButton(key);
  }

  highlightTowerButton(key) {
    this.towerButtons.forEach(btn => {
      if (btn.key === key) {
        btn.slot.setTint(0x00ffcc);
      } else {
        btn.slot.clearTint();
      }
    });
  }

  updateGhostTower(col, row) {
    const pos = this.pathManager.gridToWorld(col, row);

    if (!this.ghostTower) {
      this.ghostTower = this.add.image(pos.x, pos.y, TOWER_TYPES[this.selectedTower].key)
        .setAlpha(0.6).setDepth(50);
      this.ghostValid = this.add.image(pos.x, pos.y, 'cell_valid').setDepth(49);
    }

    this.ghostTower.setPosition(pos.x, pos.y);
    this.ghostTower.setTexture(TOWER_TYPES[this.selectedTower].key);
    this.ghostValid.setPosition(pos.x, pos.y);

    const blocked = this.pathManager.isBlocked(col, row) ||
      this.pathManager.isSheepArea(col, row) ||
      this.pathManager.isSpawnArea(col, row);
    this.ghostValid.setTexture(blocked ? 'cell_invalid' : 'cell_valid');
  }

  clearGhost() {
    if (this.ghostTower) {
      this.ghostTower.destroy();
      this.ghostTower = null;
    }
    if (this.ghostValid) {
      this.ghostValid.destroy();
      this.ghostValid = null;
    }
  }

  async tryPlaceTower(col, row) {
    const towerType = TOWER_TYPES[this.selectedTower];
    if (this.coins < towerType.cost) {
      this.showFloatingText(360, 1160, '코인 부족!', '#ff0044');
      return;
    }

    const canPlace = await this.pathManager.canPlace(col, row);
    if (!canPlace) {
      this.showFloatingText(360, 600, '설치 불가!', '#ff0044');
      return;
    }

    // Place the tower
    this.coins -= towerType.cost;
    this.updateUI();

    const pos = this.pathManager.gridToWorld(col, row);
    const sprite = this.add.image(pos.x, pos.y, towerType.key).setDepth(10).setScale(1.2);
    this.entityLayer.add(sprite);

    // Place animation
    sprite.setScale(0);
    this.tweens.add({
      targets: sprite,
      scale: 1.2,
      duration: 200,
      ease: 'Back.easeOut',
    });

    const tower = {
      sprite,
      col,
      row,
      type: this.selectedTower,
      config: { ...towerType },
      level: 0,
      lastFired: 0,
      rangeCircle: null,
    };

    this.towers.push(tower);

    // Update paths for all enemies
    this.updateEnemyPaths();
  }

  trySelectPlacedTower(col, row) {
    const tower = this.towers.find(t => t.col === col && t.row === row);
    if (tower) {
      this.showActionPanel(tower);
    } else {
      this.hideActionPanel();
    }
  }

  showActionPanel(tower) {
    this.hideActionPanel();
    this.selectedTowerForAction = tower;

    const pos = this.pathManager.gridToWorld(tower.col, tower.row);
    const kNames = { plasma: '플라즈마', laser: '레이저', slow: '냉동', missile: '미사일', flak: '대공포' };

    // Show range circle with color
    const range = tower.config.range * GRID.CELL_SIZE;
    tower.rangeCircle = this.add.circle(pos.x, pos.y, range, tower.config.color, 0.08)
      .setStrokeStyle(2, tower.config.color, 0.4).setDepth(5);

    // Pulse the selected tower
    tower.sprite.setTint(0xffffff);
    this.time.delayedCall(100, () => { if (tower.sprite.active) tower.sprite.clearTint(); });

    // Action buttons container - bigger, clearer
    this.actionPanel.removeAll(true);

    // Position above tower, but clamp to screen
    let panelY = pos.y - 75;
    if (panelY < 100) panelY = pos.y + 60;
    this.actionPanel.setPosition(pos.x, panelY);
    this.actionPanel.setVisible(true);

    // Background - bigger panel
    const bg = this.add.rectangle(0, 0, 260, 90, 0x0a0a2e, 0.95)
      .setStrokeStyle(2, tower.config.color, 0.8);
    this.actionPanel.add(bg);

    // Tower name and level
    const lvlText = this.add.text(0, -32, `${kNames[tower.type]} Lv.${tower.level + 1}`, {
      fontFamily: 'monospace', fontSize: '15px', fill: '#00ffcc', fontStyle: 'bold',
    }).setOrigin(0.5);
    this.actionPanel.add(lvlText);

    // Stats line
    const statsText = this.add.text(0, -14, `공격력:${tower.config.damage} | 범위:${tower.config.range} | 속도:${tower.config.fireRate}ms`, {
      fontFamily: 'monospace', fontSize: '9px', fill: '#8888cc',
    }).setOrigin(0.5);
    this.actionPanel.add(statsText);

    // Upgrade button
    const nextLevel = tower.level + 1;
    const upgrades = TOWER_TYPES[tower.type].upgrades;
    if (nextLevel <= upgrades.length) {
      const upgradeCost = upgrades[nextLevel - 1].cost;
      const canAfford = this.coins >= upgradeCost;

      // Upgrade button - green box
      const upgBg = this.add.rectangle(-65, 18, 110, 36, canAfford ? 0x115522 : 0x333333, 0.9)
        .setStrokeStyle(1.5, canAfford ? 0x00ff88 : 0x555555, 0.8).setInteractive();
      this.actionPanel.add(upgBg);

      const upgradeBtn = this.add.text(-65, 18, `⬆ 강화 💰${upgradeCost}`, {
        fontFamily: 'monospace', fontSize: '12px',
        fill: canAfford ? '#00ff88' : '#666666',
        fontStyle: 'bold',
      }).setOrigin(0.5);
      this.actionPanel.add(upgradeBtn);

      if (canAfford) {
        upgBg.on('pointerdown', () => this.upgradeTower(tower));
      }
    } else {
      const maxBg = this.add.rectangle(-65, 18, 110, 36, 0x443300, 0.9)
        .setStrokeStyle(1.5, 0xffdd00, 0.8);
      this.actionPanel.add(maxBg);
      const maxText = this.add.text(-65, 18, '⭐ MAX', {
        fontFamily: 'monospace', fontSize: '14px', fill: '#ffdd00', fontStyle: 'bold',
      }).setOrigin(0.5);
      this.actionPanel.add(maxText);
    }

    // Sell button - red box
    const sellValue = Math.floor(tower.config.cost * 0.6);
    const sellBg = this.add.rectangle(65, 18, 110, 36, 0x442211, 0.9)
      .setStrokeStyle(1.5, 0xff6633, 0.8).setInteractive();
    this.actionPanel.add(sellBg);

    const sellBtn = this.add.text(65, 18, `판매 💰${sellValue}`, {
      fontFamily: 'monospace', fontSize: '12px', fill: '#ff8844', fontStyle: 'bold',
    }).setOrigin(0.5);
    this.actionPanel.add(sellBtn);
    sellBg.on('pointerdown', () => this.sellTower(tower));
  }

  hideActionPanel() {
    this.actionPanel.setVisible(false);
    if (this.selectedTowerForAction && this.selectedTowerForAction.rangeCircle) {
      this.selectedTowerForAction.rangeCircle.destroy();
      this.selectedTowerForAction.rangeCircle = null;
    }
    this.selectedTowerForAction = null;
  }

  upgradeTower(tower) {
    const upgrades = TOWER_TYPES[tower.type].upgrades;
    const nextLevel = tower.level + 1;
    if (nextLevel > upgrades.length) return;

    const upgrade = upgrades[nextLevel - 1];
    if (this.coins < upgrade.cost) return;

    this.coins -= upgrade.cost;
    tower.level = nextLevel;

    // Apply upgrade stats
    if (upgrade.damage) tower.config.damage = upgrade.damage;
    if (upgrade.range) tower.config.range = upgrade.range;
    if (upgrade.fireRate) tower.config.fireRate = upgrade.fireRate;
    if (upgrade.slowFactor) tower.config.slowFactor = upgrade.slowFactor;
    tower.config.cost += upgrade.cost;

    // Upgrade visual effect - energy burst
    const pos = this.pathManager.gridToWorld(tower.col, tower.row);
    // Ring burst
    const ring = this.add.circle(pos.x, pos.y, 5, 0x00ffcc, 0).setStrokeStyle(3, 0x00ffcc, 1).setDepth(50);
    this.tweens.add({ targets: ring, scale: 4, alpha: 0, duration: 400, onComplete: () => ring.destroy() });
    // Flash
    tower.sprite.setTint(0xffffff);
    this.tweens.add({
      targets: tower.sprite,
      scale: tower.sprite.scale * 1.3,
      duration: 150,
      yoyo: true,
      ease: 'Back.easeOut',
      onComplete: () => { if (tower.sprite.active) tower.sprite.clearTint(); },
    });
    // Particles
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI * 2 / 6) * i;
      const p = this.add.circle(pos.x, pos.y, 3, 0x00ffcc, 1).setDepth(50);
      this.tweens.add({
        targets: p,
        x: pos.x + Math.cos(angle) * 30,
        y: pos.y + Math.sin(angle) * 30,
        alpha: 0, scale: 0,
        duration: 400,
        onComplete: () => p.destroy(),
      });
    }
    this.showFloatingText(pos.x, pos.y - 30, `⬆ Lv.${tower.level + 1}`, '#00ffcc');

    this.updateUI();
    this.showActionPanel(tower); // Refresh panel
  }

  sellTower(tower) {
    const sellValue = Math.floor(tower.config.cost * 0.6);
    this.coins += sellValue;

    this.pathManager.removeTower(tower.col, tower.row);
    tower.sprite.destroy();
    if (tower.rangeCircle) tower.rangeCircle.destroy();

    this.towers = this.towers.filter(t => t !== tower);
    this.hideActionPanel();
    this.updateUI();
    this.updateEnemyPaths();

    this.showFloatingText(360, 600, `+$${sellValue}`, '#ffdd00');
  }

  onStartWave() {
    if (this.waveManager.isSpawning) return;

    this.waveStarted = true;
    this.waveManager.autoStart = true;
    const hasMore = this.waveManager.startNextWave();
    if (hasMore) {
      this.startBtn.setText('다음');
      this.updateUI();
    }
  }

  toggleSpeed() {
    if (this.gameSpeed === 1) {
      this.gameSpeed = 2;
      this.speedBtn.setText('2x');
      this.time.timeScale = 2;
    } else {
      this.gameSpeed = 1;
      this.speedBtn.setText('1x');
      this.time.timeScale = 1;
    }
  }

  spawnEnemy(config) {
    // Pick random spawn point
    const spawn = Phaser.Utils.Array.GetRandom(this.pathManager.spawnPoints);
    const pos = this.pathManager.gridToWorld(spawn.col, spawn.row);

    const enemyScale = config.type === 'boss' ? 1.8 : config.type === 'tank' ? 1.5 : 1.3;
    const sprite = this.add.image(pos.x, pos.y, config.key).setDepth(20).setScale(enemyScale);
    this.entityLayer.add(sprite);

    // Walk/bob animation
    const bobSpeed = config.type === 'fast' ? 150 : config.type === 'tank' ? 400 : 250;
    const bobHeight = config.type === 'flying' ? 5 : 2;
    this.tweens.add({
      targets: sprite,
      scaleX: enemyScale * (config.type === 'flying' ? 1 : 0.92),
      scaleY: enemyScale * (config.type === 'flying' ? 1.05 : 1.08),
      duration: bobSpeed,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // Spawn flash effect
    sprite.setAlpha(0);
    this.tweens.add({ targets: sprite, alpha: 1, duration: 200 });
    const spawnFlash = this.add.circle(pos.x, pos.y, 15, 0xff0044, 0.5).setDepth(19);
    this.tweens.add({ targets: spawnFlash, scale: 2, alpha: 0, duration: 300, onComplete: () => spawnFlash.destroy() });

    // HP bar background (bigger)
    const hpBarW = config.type === 'boss' ? 40 : 30;
    const hpBarBg = this.add.rectangle(pos.x, pos.y - 22, hpBarW, 5, 0x333333).setDepth(21);
    const hpBar = this.add.rectangle(pos.x, pos.y - 22, hpBarW, 5, 0x00ff44).setDepth(22);

    const enemy = {
      sprite,
      hpBar,
      hpBarBg,
      hp: config.hp,
      maxHp: config.maxHp,
      speed: config.speed,
      baseSpeed: config.speed,
      reward: config.reward,
      flying: config.flying,
      type: config.type,
      path: null,
      pathIndex: 0,
      slowTimer: 0,
      reachedSheep: false,
      hpBarWidth: hpBarW,
    };

    this.enemies.push(enemy);

    // Get path
    if (!config.flying) {
      this.pathManager.getPath(spawn.col, spawn.row).then(path => {
        if (path && enemy.sprite.active) {
          enemy.path = path;
          enemy.pathIndex = 0;
        }
      });
    } else {
      // Flying enemies go straight to sheep
      const sheepPos = this.pathManager.gridToWorld(
        this.pathManager.sheepPos.col, this.pathManager.sheepPos.row
      );
      enemy.targetX = sheepPos.x;
      enemy.targetY = sheepPos.y;
    }
  }

  async updateEnemyPaths() {
    for (const enemy of this.enemies) {
      if (enemy.flying || enemy.reachedSheep) continue;

      const { col, row } = this.pathManager.worldToGrid(enemy.sprite.x, enemy.sprite.y);
      const path = await this.pathManager.getPath(col, row);
      if (path) {
        enemy.path = path;
        enemy.pathIndex = 0;
      }
    }
  }

  update(time, delta) {
    if (this.isPaused) return;

    const dt = delta / 1000;

    this.updateEnemies(dt);
    this.updateTowers(time);
    this.updateProjectiles(dt);
    this.updateUI();
  }

  updateEnemies(dt) {
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const enemy = this.enemies[i];

      // Update slow effect
      if (enemy.slowTimer > 0) {
        enemy.slowTimer -= dt * 1000;
        if (enemy.slowTimer <= 0) {
          enemy.speed = enemy.baseSpeed;
        }
      }

      let targetX, targetY;

      if (enemy.flying) {
        // Fly straight to sheep
        const sheepPos = this.pathManager.gridToWorld(
          this.pathManager.sheepPos.col, this.pathManager.sheepPos.row
        );
        targetX = sheepPos.x;
        targetY = sheepPos.y;
      } else if (enemy.path && enemy.pathIndex < enemy.path.length) {
        const target = enemy.path[enemy.pathIndex];
        const pos = this.pathManager.gridToWorld(target.x, target.y);
        targetX = pos.x;
        targetY = pos.y;
      } else {
        continue;
      }

      // Move toward target
      const dx = targetX - enemy.sprite.x;
      const dy = targetY - enemy.sprite.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 5) {
        if (enemy.flying) {
          this.enemyReachedSheep(enemy, i);
          continue;
        } else if (enemy.path && enemy.pathIndex < enemy.path.length - 1) {
          enemy.pathIndex++;
        } else {
          this.enemyReachedSheep(enemy, i);
          continue;
        }
      } else {
        const speed = enemy.speed * this.gameSpeed;
        enemy.sprite.x += (dx / dist) * speed * dt;
        enemy.sprite.y += (dy / dist) * speed * dt;
      }

      // Update HP bar position
      enemy.hpBar.setPosition(enemy.sprite.x, enemy.sprite.y - 24);
      enemy.hpBarBg.setPosition(enemy.sprite.x, enemy.sprite.y - 24);

      // Check if dead
      if (enemy.hp <= 0) {
        this.killEnemy(enemy, i);
      }
    }
  }

  enemyReachedSheep(enemy, index) {
    this.sheepCount--;
    if (this.sheepCount >= 0 && this.sheepSprites[this.sheepCount]) {
      const sheep = this.sheepSprites[this.sheepCount];
      const sx = sheep.x;
      const sy = sheep.y;

      // UFO beam effect
      const beam = this.add.rectangle(sx, sy - 30, 20, 60, 0x88ffff, 0.3).setDepth(35);
      this.tweens.add({ targets: beam, scaleX: 0.2, alpha: 0, duration: 800, onComplete: () => beam.destroy() });

      // Sheep gets pulled up
      this.tweens.add({
        targets: sheep,
        y: sy - 120,
        scaleX: 0.3,
        scaleY: 1.5,
        alpha: 0,
        duration: 800,
        ease: 'Cubic.easeIn',
        onComplete: () => sheep.setVisible(false),
      });

      // Screen shake
      this.cameras.main.shake(200, 0.005);

      // Warning text
      this.showFloatingText(sx, sy - 40, '양 납치!', '#ff0044');
    }

    this.destroyEnemy(enemy, index);

    if (this.sheepCount <= 0) {
      this.time.delayedCall(500, () => {
        this.scene.start('GameOver', { wave: this.waveManager.getWaveNumber() });
      });
    }
  }

  killEnemy(enemy, index) {
    this.coins += enemy.reward;
    const ex = enemy.sprite.x;
    const ey = enemy.sprite.y;

    // Multi-layered explosion
    const explosion = this.add.image(ex, ey, 'explosion')
      .setDepth(30).setScale(0.3);
    this.tweens.add({
      targets: explosion,
      scale: 2,
      alpha: 0,
      duration: 400,
      onComplete: () => explosion.destroy(),
    });

    // Secondary flash
    const flash = this.add.circle(ex, ey, 8, 0xffffff, 0.8).setDepth(31);
    this.tweens.add({ targets: flash, scale: 3, alpha: 0, duration: 200, onComplete: () => flash.destroy() });

    // Debris particles
    const colors = [0xff4400, 0xffaa00, 0xffff00];
    for (let i = 0; i < 5; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 20 + Math.random() * 30;
      const p = this.add.circle(ex, ey, 2 + Math.random() * 2, Phaser.Utils.Array.GetRandom(colors), 1).setDepth(30);
      this.tweens.add({
        targets: p,
        x: ex + Math.cos(angle) * speed,
        y: ey + Math.sin(angle) * speed,
        alpha: 0,
        duration: 300 + Math.random() * 200,
        onComplete: () => p.destroy(),
      });
    }

    // Boss kills are extra dramatic
    if (enemy.type === 'boss') {
      this.cameras.main.shake(300, 0.01);
      for (let i = 0; i < 3; i++) {
        this.time.delayedCall(i * 100, () => {
          const bx = ex + Phaser.Math.Between(-20, 20);
          const by = ey + Phaser.Math.Between(-20, 20);
          const bExp = this.add.image(bx, by, 'explosion').setDepth(30).setScale(0.5);
          this.tweens.add({ targets: bExp, scale: 1.5, alpha: 0, duration: 300, onComplete: () => bExp.destroy() });
        });
      }
    }

    this.showFloatingText(ex, ey - 20, `+💰${enemy.reward}`, '#ffdd00');
    this.destroyEnemy(enemy, index);
  }

  destroyEnemy(enemy, index) {
    enemy.sprite.destroy();
    enemy.hpBar.destroy();
    enemy.hpBarBg.destroy();
    this.enemies.splice(index, 1);
  }

  updateTowers(time) {
    for (const tower of this.towers) {
      if (time - tower.lastFired < tower.config.fireRate / this.gameSpeed) continue;

      // Find target in range
      const range = tower.config.range * GRID.CELL_SIZE;
      const towerPos = this.pathManager.gridToWorld(tower.col, tower.row);
      let bestTarget = null;
      let bestDist = Infinity;

      for (const enemy of this.enemies) {
        // Air-only tower check
        if (tower.config.airOnly && !enemy.flying) continue;
        // Can't hit air check
        if (enemy.flying && !tower.config.canHitAir) continue;

        const dx = enemy.sprite.x - towerPos.x;
        const dy = enemy.sprite.y - towerPos.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist <= range && dist < bestDist) {
          bestDist = dist;
          bestTarget = enemy;
        }
      }

      if (bestTarget) {
        tower.lastFired = time;
        this.fireBullet(tower, towerPos, bestTarget);

        // Tower recoil animation
        const dx = bestTarget.sprite.x - towerPos.x;
        const dy = bestTarget.sprite.y - towerPos.y;
        const angle = Math.atan2(dy, dx);
        const recoil = tower.type === 'missile' ? 4 : tower.type === 'laser' ? 3 : 2;
        this.tweens.add({
          targets: tower.sprite,
          x: towerPos.x - Math.cos(angle) * recoil,
          y: towerPos.y - Math.sin(angle) * recoil,
          duration: 50,
          yoyo: true,
          ease: 'Power2',
        });

        // Rotate tower toward target
        tower.sprite.rotation = angle - Math.PI / 2;
      }
    }
  }

  fireBullet(tower, towerPos, target) {
    const bullet = this.add.image(towerPos.x, towerPos.y, tower.config.bulletKey)
      .setDepth(25).setScale(1.2);

    // Tower-specific bullet speeds and effects
    const bulletSpeeds = { plasma: 280, laser: 500, slow: 200, missile: 220, flak: 400 };
    const speed = bulletSpeeds[tower.type] || 300;

    // Muzzle flash for tower
    const flash = this.add.circle(towerPos.x, towerPos.y, 8, tower.config.color, 0.6).setDepth(26);
    this.tweens.add({ targets: flash, scale: 2, alpha: 0, duration: 150, onComplete: () => flash.destroy() });

    // Laser draws a line instead of a projectile
    if (tower.type === 'laser') {
      bullet.setScale(1.5);
    }

    // Missile has a smoke trail
    if (tower.type === 'missile') {
      bullet.setScale(1.0);
    }

    const proj = {
      sprite: bullet,
      tower,
      target,
      speed,
      damage: tower.config.damage,
      type: tower.type,
    };

    this.projectiles.push(proj);
  }

  updateProjectiles(dt) {
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const proj = this.projectiles[i];

      if (!proj.target || !proj.target.sprite || !proj.target.sprite.active) {
        proj.sprite.destroy();
        this.projectiles.splice(i, 1);
        continue;
      }

      const dx = proj.target.sprite.x - proj.sprite.x;
      const dy = proj.target.sprite.y - proj.sprite.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 12) {
        // Hit effects based on type
        this.createHitEffect(proj);
        this.hitEnemy(proj.target, proj);
        proj.sprite.destroy();
        this.projectiles.splice(i, 1);
      } else {
        const speed = proj.speed * this.gameSpeed;
        proj.sprite.x += (dx / dist) * speed * dt;
        proj.sprite.y += (dy / dist) * speed * dt;
        proj.sprite.rotation = Math.atan2(dy, dx);

        // Missile smoke trail
        if (proj.type === 'missile') {
          const smoke = this.add.circle(proj.sprite.x, proj.sprite.y, 3, 0x888888, 0.4).setDepth(24);
          this.tweens.add({ targets: smoke, scale: 2, alpha: 0, duration: 300, onComplete: () => smoke.destroy() });
        }
        // Plasma glow trail
        if (proj.type === 'plasma') {
          const glow = this.add.circle(proj.sprite.x, proj.sprite.y, 2, 0x00aaff, 0.3).setDepth(24);
          this.tweens.add({ targets: glow, scale: 1.5, alpha: 0, duration: 200, onComplete: () => glow.destroy() });
        }
      }
    }
  }

  createHitEffect(proj) {
    const x = proj.target.sprite.x;
    const y = proj.target.sprite.y;

    if (proj.type === 'missile') {
      // Big explosion
      const exp = this.add.image(x, y, 'explosion').setDepth(30).setScale(0.3);
      this.tweens.add({ targets: exp, scale: 2, alpha: 0, duration: 400, onComplete: () => exp.destroy() });
      // Shockwave ring
      const ring = this.add.circle(x, y, 5, 0xffaa00, 0).setStrokeStyle(2, 0xffaa00, 0.8).setDepth(30);
      this.tweens.add({ targets: ring, scale: 4, alpha: 0, duration: 300, onComplete: () => ring.destroy() });
    } else if (proj.type === 'slow') {
      // Ice burst
      for (let j = 0; j < 4; j++) {
        const angle = (Math.PI * 2 / 4) * j;
        const shard = this.add.circle(x, y, 3, 0x88ffff, 0.8).setDepth(30);
        this.tweens.add({
          targets: shard,
          x: x + Math.cos(angle) * 20,
          y: y + Math.sin(angle) * 20,
          alpha: 0, duration: 300,
          onComplete: () => shard.destroy(),
        });
      }
    } else if (proj.type === 'laser') {
      // Red flash
      const flash = this.add.circle(x, y, 10, 0xff2222, 0.5).setDepth(30);
      this.tweens.add({ targets: flash, scale: 2, alpha: 0, duration: 150, onComplete: () => flash.destroy() });
    } else {
      // Default spark
      const spark = this.add.circle(x, y, 5, 0xffffff, 0.6).setDepth(30);
      this.tweens.add({ targets: spark, scale: 2, alpha: 0, duration: 200, onComplete: () => spark.destroy() });
    }
  }

  hitEnemy(enemy, proj) {
    enemy.hp -= proj.damage;

    // Update HP bar
    const hpRatio = Math.max(0, enemy.hp / enemy.maxHp);
    enemy.hpBar.setSize((enemy.hpBarWidth || 30) * hpRatio, 5);
    enemy.hpBar.setFillStyle(hpRatio > 0.5 ? 0x00ff44 : hpRatio > 0.25 ? 0xffaa00 : 0xff0044);

    // Flash effect
    enemy.sprite.setTint(0xffffff);
    this.time.delayedCall(50, () => {
      if (enemy.sprite.active) enemy.sprite.clearTint();
    });

    // Slow effect
    if (proj.tower.config.slowFactor) {
      enemy.speed = enemy.baseSpeed * proj.tower.config.slowFactor;
      enemy.slowTimer = proj.tower.config.slowDuration || 2000;
      enemy.sprite.setTint(0x00ffff);
    }

    // Splash damage
    if (proj.tower.config.splashRadius) {
      const splashRange = proj.tower.config.splashRadius * GRID.CELL_SIZE;
      for (const other of this.enemies) {
        if (other === enemy) continue;
        const dx = other.sprite.x - enemy.sprite.x;
        const dy = other.sprite.y - enemy.sprite.y;
        if (Math.sqrt(dx * dx + dy * dy) <= splashRange) {
          other.hp -= proj.damage * 0.5;
          const otherHpRatio = Math.max(0, other.hp / other.maxHp);
          other.hpBar.setSize((other.hpBarWidth || 30) * otherHpRatio, 5);
        }
      }
    }
  }

  onAllWavesComplete() {
    this.time.delayedCall(2000, () => {
      this.scene.start('Victory', { sheepLeft: this.sheepCount });
    });
  }

  updateUI() {
    this.coinsText.setText(`${this.coins}`);
    this.sheepText.setText(`${this.sheepCount}/10`);
    if (this.waveStarted) {
      this.waveText.setText(`웨이브 ${this.waveManager.getWaveNumber()}/${this.waveManager.totalWaves}`);
    }

    // Update tower button affordability
    this.towerButtons.forEach(btn => {
      const cost = TOWER_TYPES[btn.key].cost;
      btn.costText.setColor(this.coins >= cost ? '#ffdd00' : '#664400');
      btn.icon.setAlpha(this.coins >= cost ? 1 : 0.4);
    });
  }

  showFloatingText(x, y, text, color) {
    const ft = this.add.text(x, y, text, {
      fontFamily: 'monospace', fontSize: '16px', fill: color, fontStyle: 'bold',
    }).setOrigin(0.5).setDepth(200);

    this.tweens.add({
      targets: ft,
      y: y - 40,
      alpha: 0,
      duration: 800,
      onComplete: () => ft.destroy(),
    });
  }

  showWaveAnnouncement(waveNum, total, isBoss) {
    const w = 720;
    const h = 640; // center of play area

    // Background flash
    const overlay = this.add.rectangle(w / 2, h, w, 120, isBoss ? 0xff0022 : 0x0a0a2e, 0.85).setDepth(300);

    // Wave text
    const mainText = this.add.text(w / 2, h - 15, isBoss ? '⚠ 최종 보스 웨이브! ⚠' : `웨이브 ${waveNum}`, {
      fontFamily: 'monospace',
      fontSize: isBoss ? '28px' : '32px',
      fill: isBoss ? '#ff4444' : '#00ffcc',
      fontStyle: 'bold',
    }).setOrigin(0.5).setDepth(301).setAlpha(0).setScale(0.5);

    const subText = this.add.text(w / 2, h + 20, isBoss ? '황제가 직접 출격합니다!' : `${waveNum}/${total}`, {
      fontFamily: 'monospace',
      fontSize: '14px',
      fill: isBoss ? '#ff8888' : '#8888aa',
    }).setOrigin(0.5).setDepth(301).setAlpha(0);

    // Animate in
    this.tweens.add({
      targets: mainText,
      alpha: 1,
      scale: 1,
      duration: 300,
      ease: 'Back.easeOut',
    });
    this.tweens.add({
      targets: subText,
      alpha: 1,
      duration: 300,
      delay: 100,
    });

    // Animate out
    this.time.delayedCall(1500, () => {
      this.tweens.add({
        targets: [mainText, subText, overlay],
        alpha: 0,
        duration: 400,
        onComplete: () => { mainText.destroy(); subText.destroy(); overlay.destroy(); },
      });
    });

    // Boss wave screen shake
    if (isBoss) {
      this.cameras.main.shake(500, 0.008);
    }
  }
}
