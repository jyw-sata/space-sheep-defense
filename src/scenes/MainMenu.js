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

    this.add.text(w / 2, h * 0.35, '우주양\n방어전', {
      fontFamily: 'monospace',
      fontSize: '48px',
      fill: '#00ffcc',
      align: 'center',
      fontStyle: 'bold',
      lineSpacing: 8,
    }).setOrigin(0.5);

    this.add.text(w / 2, h * 0.46, 'Space Sheep Defense', {
      fontFamily: 'monospace',
      fontSize: '16px',
      fill: '#6688aa',
      align: 'center',
    }).setOrigin(0.5);

    this.add.text(w / 2, h * 0.50, '외계인으로부터 양을 지켜라!', {
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
    this.add.text(w / 2, h * 0.7, '시작', {
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
      '격자를 탭해서 타워를 배치하세요',
      '미로를 만들어 외계인을 늦추세요',
      '양 10마리를 모두 지키세요!',
      '비행 외계인은 미로를 무시합니다',
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
