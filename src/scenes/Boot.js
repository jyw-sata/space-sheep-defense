import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  preload() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x222244, 0.8);
    progressBox.fillRect(width / 2 - 160, height / 2 - 25, 320, 50);

    const loadingText = this.add.text(width / 2, height / 2 - 50, 'LOADING...', {
      fontFamily: 'monospace', fontSize: '20px', fill: '#00ffcc',
    }).setOrigin(0.5);

    this.load.on('progress', (value) => {
      progressBar.clear();
      progressBar.fillStyle(0x00ffcc, 1);
      progressBar.fillRect(width / 2 - 150, height / 2 - 15, 300 * value, 30);
    });

    this.load.on('complete', () => {
      progressBar.destroy();
      progressBox.destroy();
      loadingText.destroy();
    });

    this.createTextures();
  }

  createTextures() {
    const g = this.make.graphics({ add: false });
    const S = 40; // cell size

    // --- Grid ---
    g.clear();
    g.fillStyle(0x141435, 1);
    g.fillRect(0, 0, S, S);
    g.lineStyle(1, 0x252555, 0.6);
    g.strokeRect(0, 0, S, S);
    // subtle inner glow dots at corners
    g.fillStyle(0x303068, 0.4);
    g.fillCircle(0, 0, 2);
    g.fillCircle(S, 0, 2);
    g.fillCircle(0, S, 2);
    g.fillCircle(S, S, 2);
    g.generateTexture('cell', S, S);

    g.clear();
    g.fillStyle(0x00ff88, 0.2);
    g.fillRect(0, 0, S, S);
    g.lineStyle(2, 0x00ff88, 0.7);
    g.strokeRect(1, 1, S - 2, S - 2);
    g.generateTexture('cell_valid', S, S);

    g.clear();
    g.fillStyle(0xff0044, 0.2);
    g.fillRect(0, 0, S, S);
    g.lineStyle(2, 0xff0044, 0.7);
    g.strokeRect(1, 1, S - 2, S - 2);
    g.generateTexture('cell_invalid', S, S);

    // ========== SHEEP (48x48, cute fluffy) ==========
    const sh = 48;
    g.clear();
    // Fluffy wool body (multiple overlapping circles)
    g.fillStyle(0xf0f0f0, 1);
    g.fillCircle(24, 26, 14); // main body
    g.fillCircle(18, 22, 10); // top-left fluff
    g.fillCircle(30, 22, 10); // top-right fluff
    g.fillCircle(16, 30, 8);  // bottom-left fluff
    g.fillCircle(32, 30, 8);  // bottom-right fluff
    g.fillCircle(24, 18, 9);  // top fluff
    // Whiter highlights
    g.fillStyle(0xffffff, 1);
    g.fillCircle(22, 20, 6);
    g.fillCircle(28, 20, 6);
    g.fillCircle(24, 24, 7);
    // Face (dark)
    g.fillStyle(0x333333, 1);
    g.fillCircle(24, 16, 7); // head
    g.fillStyle(0x444444, 1);
    g.fillCircle(24, 16, 6);
    // Eyes
    g.fillStyle(0xffffff, 1);
    g.fillCircle(21, 15, 2.5);
    g.fillCircle(27, 15, 2.5);
    g.fillStyle(0x111111, 1);
    g.fillCircle(22, 15, 1.5);
    g.fillCircle(28, 15, 1.5);
    // Ears
    g.fillStyle(0x555555, 1);
    g.fillCircle(17, 12, 3);
    g.fillCircle(31, 12, 3);
    g.fillStyle(0xffaaaa, 1);
    g.fillCircle(17, 12, 1.5);
    g.fillCircle(31, 12, 1.5);
    // Legs
    g.fillStyle(0x333333, 1);
    g.fillRect(17, 36, 4, 8);
    g.fillRect(27, 36, 4, 8);
    // Hooves
    g.fillStyle(0x222222, 1);
    g.fillRect(16, 42, 6, 3);
    g.fillRect(26, 42, 6, 3);
    g.generateTexture('sheep', sh, sh);

    // Sheep pen
    g.clear();
    g.fillStyle(0x00cc66, 0.08);
    g.fillRect(0, 0, S, S);
    g.lineStyle(1, 0x00cc66, 0.3);
    g.strokeRect(2, 2, S - 4, S - 4);
    // Grass tufts
    g.fillStyle(0x00aa44, 0.3);
    g.fillCircle(10, 35, 4);
    g.fillCircle(30, 32, 3);
    g.fillCircle(20, 38, 3);
    g.generateTexture('sheep_pen', S, S);

    // Spawn point
    g.clear();
    g.fillStyle(0xff0044, 0.1);
    g.fillRect(0, 0, S, S);
    g.lineStyle(2, 0xff0044, 0.5);
    g.strokeRect(2, 2, S - 4, S - 4);
    // Warning icon
    g.fillStyle(0xff0044, 0.4);
    g.beginPath(); g.moveTo(20, 8); g.lineTo(32, 30); g.lineTo(8, 30); g.closePath(); g.fillPath();
    g.fillStyle(0xff4466, 0.6);
    g.fillRect(18, 14, 4, 8);
    g.fillCircle(20, 26, 2);
    g.generateTexture('spawn_point', S, S);

    // ========== TOWERS (48x48 for detail, displayed at cell size) ==========
    const T = 48;

    // PLASMA TOWER - energy sphere cannon (blue glowing orb on base)
    g.clear();
    // Dark base platform
    g.fillStyle(0x112244, 1);
    g.fillRoundedRect(6, 30, 36, 14, 5);
    g.fillStyle(0x1a3366, 1);
    g.fillRoundedRect(8, 32, 32, 10, 4);
    // Short stubby barrel
    g.fillStyle(0x2255aa, 1);
    g.fillRoundedRect(19, 18, 10, 16, 3);
    // Energy sphere (the main visual)
    g.fillStyle(0x0066ff, 0.4);
    g.fillCircle(24, 14, 14); // outer glow
    g.fillStyle(0x0088ff, 0.6);
    g.fillCircle(24, 14, 11);
    g.fillStyle(0x33aaff, 0.8);
    g.fillCircle(24, 14, 8);
    g.fillStyle(0x66ccff, 1);
    g.fillCircle(24, 14, 5);
    g.fillStyle(0xbbeeFF, 1);
    g.fillCircle(24, 12, 3);
    g.fillStyle(0xffffff, 0.8);
    g.fillCircle(23, 11, 1.5);
    // Electric arcs around sphere
    g.lineStyle(1, 0x44bbff, 0.6);
    g.strokeCircle(24, 14, 12);
    g.lineStyle(1, 0x88ddff, 0.3);
    g.strokeCircle(24, 14, 16);
    g.generateTexture('tower_plasma', T, T);

    // LASER TOWER - long precision sniper (red, clearly a long barrel)
    g.clear();
    // Armored base
    g.fillStyle(0x3a1a1a, 1);
    g.fillRoundedRect(6, 30, 36, 14, 5);
    g.fillStyle(0x4a2525, 1);
    g.fillRoundedRect(8, 32, 32, 10, 4);
    // Solid turret body (box shape)
    g.fillStyle(0x882222, 1);
    g.fillRoundedRect(14, 22, 20, 12, 2);
    g.fillStyle(0xaa3333, 1);
    g.fillRoundedRect(16, 24, 16, 8, 1);
    // LONG thin barrel (clearly a sniper/laser)
    g.fillStyle(0x771111, 1);
    g.fillRect(22, 0, 4, 26);
    g.fillStyle(0x993333, 1);
    g.fillRect(23, 0, 2, 26);
    // Barrel tip - thin red line glow
    g.fillStyle(0xff2222, 1);
    g.fillRect(22, 0, 4, 2);
    g.fillStyle(0xff0000, 0.8);
    g.fillCircle(24, 0, 2);
    // Scope on side
    g.fillStyle(0x661111, 1);
    g.fillCircle(32, 20, 4);
    g.fillStyle(0xff4444, 0.5);
    g.fillCircle(32, 20, 2.5);
    g.fillStyle(0xff0000, 1);
    g.fillCircle(32, 20, 1);
    // Red dot sight glow
    g.fillStyle(0xff0000, 0.3);
    g.fillCircle(24, 0, 5);
    g.generateTexture('tower_laser', T, T);

    // SLOW TOWER - cryo crystal emitter
    g.clear();
    // Base
    g.fillStyle(0x0a2233, 1);
    g.fillRoundedRect(6, 32, 36, 12, 5);
    g.fillStyle(0x113344, 1);
    g.fillRoundedRect(8, 34, 32, 8, 4);
    // Central pillar
    g.fillStyle(0x005577, 1);
    g.fillRoundedRect(20, 16, 8, 20, 2);
    // Large ice crystal (diamond shape)
    g.fillStyle(0x00ccee, 0.7);
    g.beginPath(); g.moveTo(24, 0); g.lineTo(36, 18); g.lineTo(24, 36); g.lineTo(12, 18); g.closePath(); g.fillPath();
    g.fillStyle(0x44ddff, 0.8);
    g.beginPath(); g.moveTo(24, 4); g.lineTo(33, 18); g.lineTo(24, 32); g.lineTo(15, 18); g.closePath(); g.fillPath();
    g.fillStyle(0x88eeff, 0.9);
    g.beginPath(); g.moveTo(24, 8); g.lineTo(30, 18); g.lineTo(24, 28); g.lineTo(18, 18); g.closePath(); g.fillPath();
    // Bright center
    g.fillStyle(0xccffff, 1);
    g.fillCircle(24, 18, 4);
    g.fillStyle(0xffffff, 0.8);
    g.fillCircle(23, 16, 2);
    // Frost aura
    g.lineStyle(1.5, 0x66eeff, 0.3);
    g.strokeCircle(24, 18, 18);
    g.lineStyle(1, 0x88ffff, 0.2);
    g.strokeCircle(24, 18, 22);
    // Small ice shards
    g.fillStyle(0xaaeeff, 0.5);
    g.beginPath(); g.moveTo(6, 10); g.lineTo(10, 6); g.lineTo(12, 12); g.closePath(); g.fillPath();
    g.beginPath(); g.moveTo(42, 10); g.lineTo(38, 6); g.lineTo(36, 12); g.closePath(); g.fillPath();
    g.generateTexture('tower_slow', T, T);

    // MISSILE TOWER - heavy rocket launcher
    g.clear();
    // Base
    g.fillStyle(0x332211, 1);
    g.fillRoundedRect(6, 32, 36, 12, 5);
    g.fillStyle(0x443322, 1);
    g.fillRoundedRect(8, 34, 32, 8, 4);
    // Launcher housing (olive/military)
    g.fillStyle(0x556633, 1);
    g.fillRoundedRect(8, 10, 32, 26, 4);
    g.fillStyle(0x667744, 1);
    g.fillRoundedRect(10, 12, 28, 22, 3);
    // 4 missile tubes (2x2 grid, dark holes)
    g.fillStyle(0x333333, 1);
    g.fillCircle(17, 18, 6);
    g.fillCircle(31, 18, 6);
    g.fillCircle(17, 29, 6);
    g.fillCircle(31, 29, 6);
    g.fillStyle(0x222222, 1);
    g.fillCircle(17, 18, 4.5);
    g.fillCircle(31, 18, 4.5);
    g.fillCircle(17, 29, 4.5);
    g.fillCircle(31, 29, 4.5);
    // Visible missiles (orange tips)
    g.fillStyle(0xff6600, 1);
    g.fillCircle(17, 18, 2.5);
    g.fillCircle(31, 18, 2.5);
    g.fillStyle(0xffaa00, 1);
    g.fillCircle(17, 18, 1.2);
    g.fillCircle(31, 18, 1.2);
    // Warning triangle
    g.fillStyle(0xffcc00, 0.6);
    g.beginPath(); g.moveTo(24, 4); g.lineTo(28, 10); g.lineTo(20, 10); g.closePath(); g.fillPath();
    g.fillStyle(0x333300, 1);
    g.fillRect(23, 5.5, 2, 3);
    g.fillCircle(24, 9, 0.8);
    g.generateTexture('tower_missile', T, T);

    // FLAK TOWER - dual autocannon (anti-air)
    g.clear();
    // Base
    g.fillStyle(0x1a1133, 1);
    g.fillRoundedRect(6, 32, 36, 12, 5);
    g.fillStyle(0x221a44, 1);
    g.fillRoundedRect(8, 34, 32, 8, 4);
    // Turret rotating mount
    g.fillStyle(0x4422aa, 1);
    g.fillCircle(24, 28, 12);
    g.fillStyle(0x5533bb, 1);
    g.fillCircle(24, 26, 10);
    // Twin long barrels
    g.fillStyle(0x6633cc, 1);
    g.fillRoundedRect(13, 2, 6, 26, 2);
    g.fillRoundedRect(29, 2, 6, 26, 2);
    g.fillStyle(0x7744dd, 1);
    g.fillRoundedRect(14, 2, 4, 26, 1.5);
    g.fillRoundedRect(30, 2, 4, 26, 1.5);
    // Barrel highlights
    g.fillStyle(0x9966ee, 0.5);
    g.fillRect(14, 4, 1, 20);
    g.fillRect(30, 4, 1, 20);
    // Muzzle flashes (bright purple)
    g.fillStyle(0xaa66ff, 0.4);
    g.fillCircle(16, 2, 6);
    g.fillCircle(32, 2, 6);
    g.fillStyle(0xcc88ff, 0.7);
    g.fillCircle(16, 2, 4);
    g.fillCircle(32, 2, 4);
    g.fillStyle(0xeeccff, 1);
    g.fillCircle(16, 2, 2);
    g.fillCircle(32, 2, 2);
    // Radar dish on turret center
    g.fillStyle(0x8855ee, 0.6);
    g.fillCircle(24, 24, 4);
    g.lineStyle(1, 0xbb88ff, 0.5);
    g.strokeCircle(24, 24, 6);
    // Upward arrow indicator (anti-air)
    g.fillStyle(0xbb88ff, 0.4);
    g.beginPath(); g.moveTo(24, 14); g.lineTo(28, 20); g.lineTo(20, 20); g.closePath(); g.fillPath();
    g.generateTexture('tower_flak', T, T);

    // ========== ENEMIES (40x40) ==========
    const E = 40;

    // BASIC ALIEN - classic grey
    g.clear();
    // Body
    g.fillStyle(0x228822, 1);
    g.fillRoundedRect(12, 20, 16, 16, 4);
    // Head (large)
    g.fillStyle(0x33bb33, 1);
    g.fillCircle(20, 14, 13);
    g.fillStyle(0x44dd44, 1);
    g.fillCircle(20, 12, 11);
    // Big almond eyes
    g.fillStyle(0x000000, 1);
    g.fillCircle(14, 13, 5);
    g.fillCircle(26, 13, 5);
    g.fillStyle(0x115511, 1);
    g.fillCircle(14, 13, 3.5);
    g.fillCircle(26, 13, 3.5);
    g.fillStyle(0x44ff44, 1);
    g.fillCircle(15, 12, 1.5);
    g.fillCircle(27, 12, 1.5);
    // Arms
    g.fillStyle(0x33aa33, 1);
    g.fillRoundedRect(4, 22, 8, 4, 2);
    g.fillRoundedRect(28, 22, 8, 4, 2);
    // Legs
    g.fillStyle(0x228822, 1);
    g.fillRect(14, 34, 4, 6);
    g.fillRect(22, 34, 4, 6);
    g.generateTexture('enemy_basic', E, E);

    // FAST ALIEN - speedy critter
    g.clear();
    // Sleek body
    g.fillStyle(0xccaa00, 1);
    g.beginPath();
    g.moveTo(20, 4); g.lineTo(36, 20); g.lineTo(32, 34); g.lineTo(8, 34); g.lineTo(4, 20);
    g.closePath(); g.fillPath();
    g.fillStyle(0xeedd00, 1);
    g.beginPath();
    g.moveTo(20, 8); g.lineTo(32, 20); g.lineTo(28, 30); g.lineTo(12, 30); g.lineTo(8, 20);
    g.closePath(); g.fillPath();
    // Antennae
    g.lineStyle(2, 0xffee44, 1);
    g.lineBetween(14, 10, 6, 0);
    g.lineBetween(26, 10, 34, 0);
    g.fillStyle(0xff4444, 1);
    g.fillCircle(6, 0, 2.5);
    g.fillCircle(34, 0, 2.5);
    // Eyes (red, menacing)
    g.fillStyle(0xff0000, 1);
    g.fillCircle(14, 18, 4);
    g.fillCircle(26, 18, 4);
    g.fillStyle(0xff6666, 1);
    g.fillCircle(15, 17, 2);
    g.fillCircle(27, 17, 2);
    // Speed lines
    g.lineStyle(1, 0xffff88, 0.4);
    g.lineBetween(2, 24, 8, 24);
    g.lineBetween(0, 28, 6, 28);
    g.lineBetween(34, 24, 40, 24);
    g.lineBetween(36, 28, 40, 28);
    g.generateTexture('enemy_fast', E, E);

    // TANK ALIEN - armored brute
    g.clear();
    // Big armored body
    g.fillStyle(0x882222, 1);
    g.fillRoundedRect(4, 10, 32, 26, 6);
    g.fillStyle(0xaa3333, 1);
    g.fillRoundedRect(6, 12, 28, 22, 5);
    // Armor plates
    g.fillStyle(0x666666, 1);
    g.fillRoundedRect(8, 16, 24, 6, 2);
    g.fillStyle(0x888888, 1);
    g.fillRoundedRect(10, 17, 20, 4, 1);
    // Head
    g.fillStyle(0xcc4444, 1);
    g.fillCircle(20, 10, 9);
    g.fillStyle(0xdd5555, 1);
    g.fillCircle(20, 9, 7);
    // Angry eyes
    g.fillStyle(0x000000, 1);
    g.fillRect(13, 6, 5, 4);
    g.fillRect(22, 6, 5, 4);
    g.fillStyle(0xff2222, 1);
    g.fillRect(14, 7, 3, 2);
    g.fillRect(23, 7, 3, 2);
    // Big arms
    g.fillStyle(0x993333, 1);
    g.fillRoundedRect(0, 14, 6, 16, 3);
    g.fillRoundedRect(34, 14, 6, 16, 3);
    // Fists
    g.fillStyle(0xaa4444, 1);
    g.fillCircle(3, 30, 4);
    g.fillCircle(37, 30, 4);
    g.generateTexture('enemy_tank', E, E);

    // FLYING ALIEN - UFO saucer
    g.clear();
    // Beam below
    g.fillStyle(0x8844ff, 0.15);
    g.beginPath(); g.moveTo(12, 28); g.lineTo(28, 28); g.lineTo(36, 40); g.lineTo(4, 40); g.closePath(); g.fillPath();
    // Saucer body
    g.fillStyle(0x5522aa, 1);
    g.fillCircle(20, 20, 14);
    g.fillStyle(0x6633cc, 1);
    g.fillCircle(20, 18, 12);
    // Dome
    g.fillStyle(0x8855ee, 1);
    g.fillCircle(20, 14, 8);
    g.fillStyle(0xaa77ff, 1);
    g.fillCircle(20, 12, 6);
    // Cockpit window
    g.fillStyle(0xccbbff, 0.8);
    g.fillCircle(20, 11, 4);
    g.fillStyle(0xeeddff, 0.6);
    g.fillCircle(19, 10, 2);
    // Running lights
    g.fillStyle(0x00ffff, 1);
    g.fillCircle(8, 22, 2.5);
    g.fillCircle(20, 26, 2.5);
    g.fillCircle(32, 22, 2.5);
    g.fillStyle(0x88ffff, 1);
    g.fillCircle(8, 22, 1.5);
    g.fillCircle(20, 26, 1.5);
    g.fillCircle(32, 22, 1.5);
    // Ring
    g.lineStyle(1.5, 0x9966ff, 0.5);
    g.strokeCircle(20, 20, 14);
    g.generateTexture('enemy_flying', E, E);

    // BOSS ALIEN - Emperor
    g.clear();
    const B = 48;
    // Robe body
    g.fillStyle(0x880044, 1);
    g.fillRoundedRect(6, 24, 36, 20, 6);
    g.fillStyle(0xaa0055, 1);
    g.fillRoundedRect(8, 26, 32, 16, 5);
    // Cape edges
    g.fillStyle(0xcc9900, 0.5);
    g.fillRect(6, 24, 36, 3);
    // Big head
    g.fillStyle(0xdd0077, 1);
    g.fillCircle(24, 18, 15);
    g.fillStyle(0xff0088, 1);
    g.fillCircle(24, 16, 13);
    // Crown
    g.fillStyle(0xffcc00, 1);
    g.fillRect(10, 2, 28, 6);
    g.beginPath(); g.moveTo(10, 2); g.lineTo(14, -5); g.lineTo(18, 2); g.closePath(); g.fillPath();
    g.beginPath(); g.moveTo(18, 2); g.lineTo(24, -8); g.lineTo(30, 2); g.closePath(); g.fillPath();
    g.beginPath(); g.moveTo(30, 2); g.lineTo(34, -5); g.lineTo(38, 2); g.closePath(); g.fillPath();
    // Crown jewels
    g.fillStyle(0xff0000, 1);
    g.fillCircle(14, -1, 2.5);
    g.fillCircle(24, -3, 3);
    g.fillCircle(34, -1, 2.5);
    g.fillStyle(0xff6666, 0.8);
    g.fillCircle(14, -2, 1);
    g.fillCircle(24, -4, 1.5);
    g.fillCircle(34, -2, 1);
    // Evil eyes
    g.fillStyle(0x000000, 1);
    g.fillCircle(18, 16, 5);
    g.fillCircle(30, 16, 5);
    g.fillStyle(0xff00ff, 1);
    g.fillCircle(18, 16, 3);
    g.fillCircle(30, 16, 3);
    g.fillStyle(0xff88ff, 1);
    g.fillCircle(19, 15, 1.5);
    g.fillCircle(31, 15, 1.5);
    // Mouth
    g.lineStyle(2, 0xcc0066, 1);
    g.beginPath(); g.moveTo(18, 24); g.lineTo(24, 22); g.lineTo(30, 24); g.stroke();
    g.generateTexture('enemy_boss', B, B);

    // ========== PROJECTILES (distinct per tower) ==========

    // Plasma bullet - glowing energy orb
    g.clear();
    g.fillStyle(0x0088ff, 0.3);
    g.fillCircle(8, 8, 8);
    g.fillStyle(0x00bbff, 0.6);
    g.fillCircle(8, 8, 5);
    g.fillStyle(0x66ddff, 1);
    g.fillCircle(8, 8, 3);
    g.fillStyle(0xffffff, 0.8);
    g.fillCircle(8, 8, 1.5);
    g.generateTexture('bullet_plasma', 16, 16);

    // Laser beam - long red beam
    g.clear();
    g.fillStyle(0xff0000, 0.3);
    g.fillRect(0, 0, 24, 6);
    g.fillStyle(0xff4444, 0.7);
    g.fillRect(2, 1, 20, 4);
    g.fillStyle(0xff8888, 1);
    g.fillRect(4, 2, 16, 2);
    g.fillStyle(0xffffff, 0.8);
    g.fillRect(6, 2.5, 12, 1);
    g.generateTexture('bullet_laser', 24, 6);

    // Freeze shard - ice crystal
    g.clear();
    g.fillStyle(0x00ddff, 0.3);
    g.fillCircle(12, 12, 12);
    g.fillStyle(0x88ffff, 0.6);
    // Crystal shape
    g.beginPath(); g.moveTo(12, 0); g.lineTo(16, 8); g.lineTo(12, 24); g.lineTo(8, 8); g.closePath(); g.fillPath();
    g.fillStyle(0xccffff, 0.8);
    g.beginPath(); g.moveTo(12, 2); g.lineTo(14, 8); g.lineTo(12, 20); g.lineTo(10, 8); g.closePath(); g.fillPath();
    g.fillStyle(0xffffff, 0.6);
    g.fillCircle(12, 8, 2);
    g.generateTexture('bullet_slow', 24, 24);

    // Missile - actual rocket shape
    g.clear();
    // Smoke trail
    g.fillStyle(0xff8800, 0.2);
    g.fillCircle(6, 18, 5);
    g.fillStyle(0xff6600, 0.3);
    g.fillCircle(6, 16, 3);
    // Rocket body
    g.fillStyle(0xcc5500, 1);
    g.fillRect(4, 2, 4, 14);
    g.fillStyle(0xff7700, 1);
    g.fillRect(5, 2, 2, 14);
    // Nose cone
    g.fillStyle(0xffaa00, 1);
    g.beginPath(); g.moveTo(4, 2); g.lineTo(6, -2); g.lineTo(8, 2); g.closePath(); g.fillPath();
    // Fins
    g.fillStyle(0xcc5500, 1);
    g.beginPath(); g.moveTo(4, 14); g.lineTo(0, 18); g.lineTo(4, 12); g.closePath(); g.fillPath();
    g.beginPath(); g.moveTo(8, 14); g.lineTo(12, 18); g.lineTo(8, 12); g.closePath(); g.fillPath();
    // Exhaust flame
    g.fillStyle(0xffdd00, 1);
    g.fillCircle(6, 18, 2.5);
    g.fillStyle(0xff6600, 0.8);
    g.fillCircle(6, 20, 2);
    g.generateTexture('bullet_missile', 12, 22);

    // Flak shell - purple tracer
    g.clear();
    g.fillStyle(0x8844ff, 0.3);
    g.fillRect(0, 0, 10, 4);
    g.fillStyle(0xaa66ff, 0.7);
    g.fillRect(2, 0.5, 6, 3);
    g.fillStyle(0xddaaff, 1);
    g.fillCircle(8, 2, 2.5);
    g.fillStyle(0xffffff, 0.7);
    g.fillCircle(8, 2, 1);
    g.generateTexture('bullet_flak', 10, 4);

    // Explosion
    g.clear();
    g.fillStyle(0xff4400, 0.4);
    g.fillCircle(20, 20, 20);
    g.fillStyle(0xff8800, 0.6);
    g.fillCircle(20, 20, 14);
    g.fillStyle(0xffcc00, 0.8);
    g.fillCircle(20, 20, 8);
    g.fillStyle(0xffffff, 0.5);
    g.fillCircle(20, 20, 4);
    g.generateTexture('explosion', 40, 40);

    // Range indicator
    g.clear();
    g.lineStyle(1, 0xffffff, 0.3);
    g.strokeCircle(100, 100, 100);
    g.generateTexture('range_circle', 200, 200);

    // UI Button
    g.clear();
    g.fillStyle(0x1a1a3e, 0.9);
    g.fillRoundedRect(0, 0, 120, 50, 8);
    g.lineStyle(2, 0x00ffcc, 1);
    g.strokeRoundedRect(0, 0, 120, 50, 8);
    g.generateTexture('button', 120, 50);

    // Tower slot button
    g.clear();
    g.fillStyle(0x1a1a3e, 0.9);
    g.fillRoundedRect(0, 0, 80, 80, 8);
    g.lineStyle(2, 0x4444aa, 1);
    g.strokeRoundedRect(0, 0, 80, 80, 8);
    g.generateTexture('tower_slot', 80, 80);

    // Coin icon
    g.clear();
    g.fillStyle(0xffdd00, 1);
    g.fillCircle(10, 10, 10);
    g.fillStyle(0xffaa00, 1);
    g.fillCircle(10, 10, 7);
    g.fillStyle(0xffee44, 1);
    g.fillCircle(9, 8, 3);
    g.generateTexture('coin', 20, 20);

    g.destroy();
  }

  create() {
    this.scene.start('MainMenu');
  }
}
