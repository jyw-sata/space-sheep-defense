import Phaser from 'phaser';
import { COLORS } from '../config/Constants.js';

export class MainMenuScene extends Phaser.Scene {
  constructor() {
    super('MainMenu');
  }

  create() {
    const w = this.cameras.main.width;
    const h = this.cameras.main.height;

    // Starfield background
    for (let i = 0; i < 100; i++) {
      const x = Phaser.Math.Between(0, w);
      const y = Phaser.Math.Between(0, h);
      const size = Phaser.Math.FloatBetween(0.5, 2);
      const star = this.add.circle(x, y, size, 0xffffff, Phaser.Math.FloatBetween(0.3, 1));
      this.tweens.add({
        targets: star,
        alpha: 0.2,
        duration: Phaser.Math.Between(1000, 3000),
        yoyo: true,
        repeat: -1,
      });
    }

    // Title
    this.add.text(w / 2, h * 0.25, '🛸', { fontSize: '80px' }).setOrigin(0.5);

    this.add.text(w / 2, h * 0.35, 'SPACE SHEEP\nDEFENSE', {
      fontFamily: 'monospace',
      fontSize: '42px',
      fill: '#00ffcc',
      align: 'center',
      fontStyle: 'bold',
      lineSpacing: 8,
    }).setOrigin(0.5);

    this.add.text(w / 2, h * 0.45, 'Protect your flock from alien invaders!', {
      fontFamily: 'monospace',
      fontSize: '14px',
      fill: '#8888aa',
      align: 'center',
    }).setOrigin(0.5);

    // Animated sheep
    const sheepGroup = [];
    for (let i = 0; i < 5; i++) {
      const sheep = this.add.image(w * 0.3 + i * 35, h * 0.55, 'sheep').setScale(1.5);
      sheepGroup.push(sheep);
      this.tweens.add({
        targets: sheep,
        y: sheep.y - 8,
        duration: 600 + i * 100,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
    }

    // Play button
    const playBtn = this.add.image(w / 2, h * 0.7, 'button').setScale(2, 1.5).setInteractive();
    this.add.text(w / 2, h * 0.7, 'PLAY', {
      fontFamily: 'monospace',
      fontSize: '28px',
      fill: '#00ffcc',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    playBtn.on('pointerover', () => playBtn.setTint(0x00ffcc));
    playBtn.on('pointerout', () => playBtn.clearTint());
    playBtn.on('pointerdown', () => {
      this.cameras.main.fadeOut(500, 0, 0, 0);
      this.time.delayedCall(500, () => this.scene.start('Game'));
    });

    // How to play
    const helpTexts = [
      'Tap grid to place towers',
      'Create a maze to slow aliens',
      'Protect all 10 sheep!',
      'Flying aliens ignore your maze',
    ];

    helpTexts.forEach((text, i) => {
      this.add.text(w / 2, h * 0.8 + i * 24, text, {
        fontFamily: 'monospace',
        fontSize: '13px',
        fill: '#6666aa',
        align: 'center',
      }).setOrigin(0.5);
    });

    // Version
    this.add.text(w / 2, h * 0.97, 'v1.0 - SF Tower Defense', {
      fontFamily: 'monospace',
      fontSize: '10px',
      fill: '#444466',
    }).setOrigin(0.5);
  }
}
