import Phaser from 'phaser';

export class MainMenuScene extends Phaser.Scene {
  constructor() {
    super('MainMenu');
  }

  create() {
    const w = this.cameras.main.width;
    const h = this.cameras.main.height;

    // Green grass background
    this.add.rectangle(w / 2, h / 2, w, h, 0x3a8a3a);

    // Sky at top
    this.add.rectangle(w / 2, h * 0.15, w, h * 0.3, 0x5599dd, 0.4);

    // Clouds
    for (let i = 0; i < 8; i++) {
      const cx = Phaser.Math.Between(30, w - 30);
      const cy = Phaser.Math.Between(40, h * 0.25);
      const cloud = this.add.ellipse(cx, cy, Phaser.Math.Between(60, 120), Phaser.Math.Between(20, 35), 0xffffff, 0.2);
      this.tweens.add({
        targets: cloud, x: cloud.x + 30, duration: Phaser.Math.Between(4000, 8000),
        yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
      });
    }

    // UFO hovering at top
    this.add.text(w / 2, h * 0.22, '🛸', { fontSize: '80px' }).setOrigin(0.5);
    // Abduction beam
    const beam = this.add.rectangle(w / 2, h * 0.35, 60, 100, 0x88ffff, 0.08);
    this.tweens.add({ targets: beam, scaleX: 0.6, alpha: 0.03, duration: 1500, yoyo: true, repeat: -1 });

    // Title
    this.add.text(w / 2, h * 0.35, '우주양\n방어전', {
      fontFamily: 'monospace', fontSize: '48px', fill: '#ffffff',
      align: 'center', fontStyle: 'bold', lineSpacing: 8,
      stroke: '#2a5a2a', strokeThickness: 4,
    }).setOrigin(0.5);

    this.add.text(w / 2, h * 0.46, 'Space Sheep Defense', {
      fontFamily: 'monospace', fontSize: '16px', fill: '#ddffdd',
      stroke: '#2a5a2a', strokeThickness: 2,
    }).setOrigin(0.5);

    this.add.text(w / 2, h * 0.50, '외계인으로부터 양을 지켜라!', {
      fontFamily: 'monospace', fontSize: '14px', fill: '#cceecc',
    }).setOrigin(0.5);

    // Animated sheep on grass
    for (let i = 0; i < 6; i++) {
      const sx = w * 0.15 + i * (w * 0.7 / 5);
      const sy = h * 0.58 + Phaser.Math.Between(-10, 10);
      const sheep = this.add.image(sx, sy, 'sheep').setScale(1.4);
      // Grazing animation - gentle bob
      this.tweens.add({
        targets: sheep,
        y: sheep.y - 5,
        scaleX: 1.35 + (i % 2) * 0.1,
        duration: 800 + i * 150,
        yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
      });
    }

    // Green grass patch under sheep
    this.add.rectangle(w / 2, h * 0.58, w * 0.8, 40, 0x55aa55, 0.3);

    // Play button - big wooden style
    const btnBg = this.add.rectangle(w / 2, h * 0.70, 240, 60, 0x8B6914, 0.95)
      .setStrokeStyle(3, 0xaa8822, 1).setInteractive();
    const btnInner = this.add.rectangle(w / 2, h * 0.70, 230, 50, 0x44882a, 0.95);
    this.add.text(w / 2, h * 0.70, '▶  게임 시작', {
      fontFamily: 'monospace', fontSize: '26px', fill: '#ffffff', fontStyle: 'bold',
    }).setOrigin(0.5);

    // Button pulse
    this.tweens.add({
      targets: [btnBg, btnInner],
      scaleX: 1.03, scaleY: 1.06,
      duration: 800, yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
    });

    btnBg.on('pointerdown', () => {
      this.cameras.main.fadeOut(500, 0, 0, 0);
      this.time.delayedCall(500, () => this.scene.start('Game'));
    });

    // How to play
    const helpTexts = [
      '🏗  격자를 탭해서 타워를 배치하세요',
      '🧱  미로를 만들어 외계인을 늦추세요',
      '🐑  양 10마리를 모두 지키세요!',
      '🛸  비행 외계인은 미로를 무시합니다',
    ];

    helpTexts.forEach((text, i) => {
      this.add.text(w / 2, h * 0.79 + i * 26, text, {
        fontFamily: 'monospace', fontSize: '12px', fill: '#ddeedd',
      }).setOrigin(0.5);
    });

    this.add.text(w / 2, h * 0.97, 'v2.0 - Tower Madness Style', {
      fontFamily: 'monospace', fontSize: '10px', fill: '#2a6a2a',
    }).setOrigin(0.5);
  }
}
