import Phaser from 'phaser';
import { COLORS } from '../config/Constants.js';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('Boot');
  }

  preload() {
    // Create loading bar
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x222244, 0.8);
    progressBox.fillRect(width / 2 - 160, height / 2 - 25, 320, 50);

    const loadingText = this.add.text(width / 2, height / 2 - 50, 'LOADING...', {
      fontFamily: 'monospace',
      fontSize: '20px',
      fill: '#00ffcc',
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

    // Generate all game textures programmatically
    this.createTextures();
  }

  createTextures() {
    const g = this.make.graphics({ add: false });

    // Grid cell
    g.clear();
    g.fillStyle(0x1a1a3e, 1);
    g.fillRect(0, 0, 40, 40);
    g.lineStyle(1, 0x2a2a5e, 0.5);
    g.strokeRect(0, 0, 40, 40);
    g.generateTexture('cell', 40, 40);

    // Cell highlight (valid placement)
    g.clear();
    g.fillStyle(0x00ff88, 0.3);
    g.fillRect(0, 0, 40, 40);
    g.lineStyle(1, 0x00ff88, 0.8);
    g.strokeRect(0, 0, 40, 40);
    g.generateTexture('cell_valid', 40, 40);

    // Cell highlight (invalid placement)
    g.clear();
    g.fillStyle(0xff0044, 0.3);
    g.fillRect(0, 0, 40, 40);
    g.lineStyle(1, 0xff0044, 0.8);
    g.strokeRect(0, 0, 40, 40);
    g.generateTexture('cell_invalid', 40, 40);

    // Sheep
    g.clear();
    g.fillStyle(0xffffff, 1);
    g.fillCircle(16, 16, 12);
    g.fillStyle(0xeeeeee, 1);
    g.fillCircle(12, 12, 6);
    g.fillCircle(20, 12, 6);
    g.fillStyle(0x333333, 1);
    g.fillCircle(13, 18, 2);
    g.fillCircle(19, 18, 2);
    g.generateTexture('sheep', 32, 32);

    // Sheep pen
    g.clear();
    g.fillStyle(0x00ff88, 0.15);
    g.fillRect(0, 0, 40, 40);
    g.lineStyle(2, 0x00ff88, 0.4);
    g.strokeRect(1, 1, 38, 38);
    g.generateTexture('sheep_pen', 40, 40);

    // Spawn point
    g.clear();
    g.fillStyle(0xff0044, 0.2);
    g.fillRect(0, 0, 40, 40);
    g.lineStyle(2, 0xff0044, 0.6);
    g.strokeRect(1, 1, 38, 38);
    g.generateTexture('spawn_point', 40, 40);

    // --- Towers ---
    // Plasma Tower (blue) - round turret with gun barrel
    g.clear();
    g.fillStyle(0x003366, 1);
    g.fillRect(6, 6, 28, 28); // base
    g.fillStyle(0x0088ff, 1);
    g.fillCircle(20, 22, 10); // turret dome
    g.fillStyle(0x00ccff, 1);
    g.fillRect(18, 4, 4, 16); // gun barrel up
    g.fillStyle(0x44ddff, 1);
    g.fillCircle(20, 4, 3); // muzzle glow
    g.generateTexture('tower_plasma', 40, 40);

    // Laser Tower (red) - sniper cannon
    g.clear();
    g.fillStyle(0x441111, 1);
    g.fillRect(6, 6, 28, 28); // base
    g.fillStyle(0xff4444, 1);
    g.fillRect(10, 14, 20, 12); // body
    g.fillStyle(0xff6666, 1);
    g.fillRect(16, 2, 8, 18); // long barrel
    g.fillStyle(0xff0000, 1);
    g.fillRect(18, 0, 4, 6); // muzzle
    g.fillStyle(0xffaaaa, 1);
    g.fillCircle(20, 0, 2); // laser tip glow
    g.generateTexture('tower_laser', 40, 40);

    // Slow Tower (cyan) - radar dish / freeze emitter
    g.clear();
    g.fillStyle(0x004444, 1);
    g.fillRect(6, 6, 28, 28); // base
    g.fillStyle(0x00cccc, 1);
    g.fillCircle(20, 20, 12); // outer ring
    g.fillStyle(0x004444, 1);
    g.fillCircle(20, 20, 8); // inner
    g.fillStyle(0x00ffff, 1);
    g.fillCircle(20, 20, 5); // core glow
    g.fillStyle(0x88ffff, 0.6);
    g.fillCircle(20, 20, 3); // bright center
    // wave lines
    g.lineStyle(1, 0x00ffff, 0.6);
    g.strokeCircle(20, 20, 16);
    g.generateTexture('tower_slow', 40, 40);

    // Missile Tower (orange) - missile launcher
    g.clear();
    g.fillStyle(0x442200, 1);
    g.fillRect(6, 6, 28, 28); // base
    g.fillStyle(0x885500, 1);
    g.fillRect(8, 10, 24, 20); // launcher body
    g.fillStyle(0xff8800, 1);
    // 4 missile tubes
    g.fillRect(10, 4, 5, 14);
    g.fillRect(17, 4, 5, 14);
    g.fillRect(25, 4, 5, 14);
    g.fillStyle(0xffcc00, 1);
    // missile tips
    g.beginPath(); g.moveTo(12, 4); g.lineTo(14, 0); g.lineTo(16, 4); g.closePath(); g.fillPath();
    g.beginPath(); g.moveTo(19, 4); g.lineTo(21, 0); g.lineTo(23, 4); g.closePath(); g.fillPath();
    g.beginPath(); g.moveTo(26, 4); g.lineTo(28, 0); g.lineTo(30, 4); g.closePath(); g.fillPath();
    g.generateTexture('tower_missile', 40, 40);

    // Flak Tower (purple) - anti-air twin cannon
    g.clear();
    g.fillStyle(0x220044, 1);
    g.fillRect(6, 6, 28, 28); // base
    g.fillStyle(0x6633aa, 1);
    g.fillCircle(20, 24, 10); // turret base
    g.fillStyle(0x8844ff, 1);
    // twin barrels pointing up
    g.fillRect(13, 4, 4, 20);
    g.fillRect(23, 4, 4, 20);
    g.fillStyle(0xbb88ff, 1);
    g.fillCircle(15, 4, 3); // left muzzle
    g.fillCircle(25, 4, 3); // right muzzle
    g.fillStyle(0xddaaff, 0.7);
    g.fillCircle(15, 4, 1.5);
    g.fillCircle(25, 4, 1.5);
    g.generateTexture('tower_flak', 40, 40);

    // --- Enemies (bigger, more detailed) ---
    // Basic alien (green) - classic grey alien
    g.clear();
    g.fillStyle(0x33cc33, 1);
    g.fillCircle(16, 12, 11); // big head
    g.fillStyle(0x44ff44, 1);
    g.fillCircle(16, 10, 9); // head highlight
    g.fillStyle(0x33cc33, 1);
    g.fillRect(10, 16, 12, 12); // body
    g.fillRect(7, 18, 5, 3); // left arm
    g.fillRect(20, 18, 5, 3); // right arm
    g.fillStyle(0x000000, 1);
    g.fillCircle(12, 10, 3); // left eye
    g.fillCircle(20, 10, 3); // right eye
    g.fillStyle(0xccffcc, 1);
    g.fillCircle(12, 9, 1); // eye glint
    g.fillCircle(20, 9, 1);
    g.generateTexture('enemy_basic', 32, 32);

    // Fast alien (yellow) - sleek bug creature
    g.clear();
    g.fillStyle(0xcccc00, 1);
    g.fillCircle(16, 14, 9); // body
    g.fillStyle(0xffff00, 1);
    g.fillCircle(16, 12, 7); // head
    g.fillStyle(0xffff88, 1);
    g.beginPath(); g.moveTo(8, 8); g.lineTo(4, 2); g.lineTo(10, 6); g.closePath(); g.fillPath(); // left antenna
    g.beginPath(); g.moveTo(24, 8); g.lineTo(28, 2); g.lineTo(22, 6); g.closePath(); g.fillPath(); // right antenna
    g.fillStyle(0x000000, 1);
    g.fillCircle(13, 11, 2);
    g.fillCircle(19, 11, 2);
    g.fillStyle(0xff0000, 1);
    g.fillCircle(13, 11, 1); // red eyes
    g.fillCircle(19, 11, 1);
    g.generateTexture('enemy_fast', 32, 32);

    // Tank alien (red/big) - armored brute
    g.clear();
    g.fillStyle(0xaa2222, 1);
    g.fillRect(4, 8, 24, 22); // armored body
    g.fillStyle(0xff4444, 1);
    g.fillCircle(16, 10, 10); // head
    g.fillStyle(0xcc3333, 1);
    g.fillRect(2, 14, 6, 12); // left arm
    g.fillRect(24, 14, 6, 12); // right arm
    g.fillStyle(0x666666, 1);
    g.fillRect(6, 10, 20, 4); // armor plate
    g.fillStyle(0x000000, 1);
    g.fillCircle(12, 8, 3);
    g.fillCircle(20, 8, 3);
    g.fillStyle(0xff6666, 1);
    g.fillCircle(12, 8, 1.5); // glowing eyes
    g.fillCircle(20, 8, 1.5);
    g.generateTexture('enemy_tank', 32, 32);

    // Flying alien (purple) - UFO saucer
    g.clear();
    g.fillStyle(0x6622cc, 1);
    g.fillCircle(16, 16, 12); // saucer body
    g.fillStyle(0x8844ff, 1);
    g.fillCircle(16, 14, 8); // dome
    g.fillStyle(0xcc88ff, 1);
    g.fillCircle(16, 12, 5); // cockpit
    // lights around saucer
    g.fillStyle(0x00ffff, 1);
    g.fillCircle(6, 18, 2);
    g.fillCircle(16, 22, 2);
    g.fillCircle(26, 18, 2);
    g.fillStyle(0xeeddff, 0.5);
    g.fillCircle(16, 12, 2); // window glint
    g.generateTexture('enemy_flying', 32, 32);

    // Boss alien - Emperor with crown
    g.clear();
    g.fillStyle(0xcc0066, 1);
    g.fillCircle(18, 18, 16); // big head
    g.fillStyle(0xff0088, 1);
    g.fillCircle(18, 16, 13);
    g.fillRect(6, 22, 24, 14); // body
    // Crown
    g.fillStyle(0xffdd00, 1);
    g.fillRect(6, 2, 24, 6);
    g.beginPath(); g.moveTo(6, 2); g.lineTo(10, -4); g.lineTo(14, 2); g.closePath(); g.fillPath();
    g.beginPath(); g.moveTo(14, 2); g.lineTo(18, -6); g.lineTo(22, 2); g.closePath(); g.fillPath();
    g.beginPath(); g.moveTo(22, 2); g.lineTo(26, -4); g.lineTo(30, 2); g.closePath(); g.fillPath();
    // Jewels on crown
    g.fillStyle(0xff0000, 1);
    g.fillCircle(10, 0, 2);
    g.fillCircle(18, -2, 2);
    g.fillCircle(26, 0, 2);
    // Eyes
    g.fillStyle(0x000000, 1);
    g.fillCircle(13, 16, 4);
    g.fillCircle(23, 16, 4);
    g.fillStyle(0xff00ff, 1);
    g.fillCircle(13, 16, 2); // glowing purple eyes
    g.fillCircle(23, 16, 2);
    g.generateTexture('enemy_boss', 36, 36);

    // --- Projectiles ---
    g.clear();
    g.fillStyle(0x00ccff, 1);
    g.fillCircle(4, 4, 4);
    g.generateTexture('bullet_plasma', 8, 8);

    g.clear();
    g.fillStyle(0xff4444, 1);
    g.fillRect(0, 1, 12, 2);
    g.generateTexture('bullet_laser', 12, 4);

    g.clear();
    g.fillStyle(0x00ffff, 1);
    g.fillCircle(6, 6, 6);
    g.fillStyle(0x00ffff, 0.3);
    g.fillCircle(6, 6, 10);
    g.generateTexture('bullet_slow', 20, 20);

    g.clear();
    g.fillStyle(0xff8800, 1);
    g.beginPath();
    g.moveTo(4, 0);
    g.lineTo(8, 8);
    g.lineTo(0, 8);
    g.closePath();
    g.fillPath();
    g.generateTexture('bullet_missile', 8, 8);

    g.clear();
    g.fillStyle(0xbb88ff, 1);
    g.fillCircle(3, 3, 3);
    g.generateTexture('bullet_flak', 6, 6);

    // Explosion
    g.clear();
    g.fillStyle(0xffaa00, 0.6);
    g.fillCircle(16, 16, 16);
    g.fillStyle(0xffff00, 0.4);
    g.fillCircle(16, 16, 10);
    g.generateTexture('explosion', 32, 32);

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
    g.fillCircle(8, 8, 8);
    g.fillStyle(0xffaa00, 1);
    g.fillCircle(8, 8, 5);
    g.generateTexture('coin', 16, 16);

    g.destroy();
  }

  create() {
    this.scene.start('MainMenu');
  }
}
