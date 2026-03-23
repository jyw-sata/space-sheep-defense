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
    // Plasma Tower (blue)
    g.clear();
    g.fillStyle(0x0088ff, 1);
    g.fillRect(8, 8, 24, 24);
    g.fillStyle(0x00ccff, 1);
    g.fillCircle(20, 20, 6);
    g.generateTexture('tower_plasma', 40, 40);

    // Laser Tower (red)
    g.clear();
    g.fillStyle(0xff4444, 1);
    g.fillRect(8, 8, 24, 24);
    g.fillStyle(0xff8888, 1);
    g.fillRect(14, 6, 12, 4);
    g.generateTexture('tower_laser', 40, 40);

    // Slow Tower (cyan)
    g.clear();
    g.fillStyle(0x00cccc, 1);
    g.fillRect(8, 8, 24, 24);
    g.fillStyle(0x00ffff, 1);
    g.fillCircle(20, 20, 8);
    g.fillStyle(0x00cccc, 1);
    g.fillCircle(20, 20, 4);
    g.generateTexture('tower_slow', 40, 40);

    // Missile Tower (orange)
    g.clear();
    g.fillStyle(0xff8800, 1);
    g.fillRect(8, 8, 24, 24);
    g.fillStyle(0xffcc00, 1);
    g.beginPath();
    g.moveTo(20, 6);
    g.lineTo(28, 20);
    g.lineTo(12, 20);
    g.closePath();
    g.fillPath();
    g.generateTexture('tower_missile', 40, 40);

    // Flak Tower (purple, anti-air)
    g.clear();
    g.fillStyle(0x8844ff, 1);
    g.fillRect(8, 8, 24, 24);
    g.fillStyle(0xbb88ff, 1);
    g.fillRect(18, 4, 4, 12);
    g.fillRect(14, 8, 12, 4);
    g.generateTexture('tower_flak', 40, 40);

    // --- Enemies ---
    // Basic alien (green)
    g.clear();
    g.fillStyle(0x44ff44, 1);
    g.fillCircle(12, 10, 8);
    g.fillStyle(0x44ff44, 1);
    g.fillRect(6, 10, 12, 10);
    g.fillStyle(0x000000, 1);
    g.fillCircle(9, 9, 2);
    g.fillCircle(15, 9, 2);
    g.generateTexture('enemy_basic', 24, 24);

    // Fast alien (yellow)
    g.clear();
    g.fillStyle(0xffff00, 1);
    g.fillCircle(12, 10, 7);
    g.fillRect(7, 10, 10, 8);
    g.fillStyle(0x000000, 1);
    g.fillCircle(9, 9, 2);
    g.fillCircle(15, 9, 2);
    g.generateTexture('enemy_fast', 24, 24);

    // Tank alien (red/big)
    g.clear();
    g.fillStyle(0xff4444, 1);
    g.fillCircle(14, 12, 10);
    g.fillRect(6, 12, 16, 12);
    g.fillStyle(0x000000, 1);
    g.fillCircle(10, 10, 3);
    g.fillCircle(18, 10, 3);
    g.generateTexture('enemy_tank', 28, 28);

    // Flying alien (purple)
    g.clear();
    g.fillStyle(0xaa44ff, 1);
    g.fillCircle(12, 12, 8);
    g.fillStyle(0xcc88ff, 1);
    g.fillRect(0, 8, 24, 4);
    g.fillStyle(0x000000, 1);
    g.fillCircle(9, 10, 2);
    g.fillCircle(15, 10, 2);
    g.generateTexture('enemy_flying', 24, 24);

    // Boss alien
    g.clear();
    g.fillStyle(0xff0088, 1);
    g.fillCircle(16, 16, 14);
    g.fillRect(4, 16, 24, 14);
    g.fillStyle(0xffff00, 1);
    g.beginPath();
    g.moveTo(8, 4);
    g.lineTo(16, 0);
    g.lineTo(24, 4);
    g.lineTo(20, 8);
    g.lineTo(12, 8);
    g.closePath();
    g.fillPath();
    g.fillStyle(0x000000, 1);
    g.fillCircle(12, 14, 3);
    g.fillCircle(20, 14, 3);
    g.generateTexture('enemy_boss', 32, 32);

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
