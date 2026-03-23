import Phaser from 'phaser';

export class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOver');
  }

  create(data) {
    const w = this.cameras.main.width;
    const h = this.cameras.main.height;
    const wave = data.wave || 0;

    // Background overlay
    this.add.rectangle(w / 2, h / 2, w, h, 0x000000, 0.7);

    this.add.text(w / 2, h * 0.3, '게임 오버', {
      fontFamily: 'monospace',
      fontSize: '48px',
      fill: '#ff0044',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(w / 2, h * 0.4, '외계인이 양을 모두 납치했습니다!', {
      fontFamily: 'monospace',
      fontSize: '15px',
      fill: '#ff6688',
    }).setOrigin(0.5);

    this.add.text(w / 2, h * 0.5, `${wave} 웨이브 생존`, {
      fontFamily: 'monospace',
      fontSize: '24px',
      fill: '#ffffff',
    }).setOrigin(0.5);

    // Retry button
    const retryBtn = this.add.image(w / 2, h * 0.65, 'button').setScale(2, 1.5).setInteractive();
    this.add.text(w / 2, h * 0.65, '재도전', {
      fontFamily: 'monospace',
      fontSize: '24px',
      fill: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    retryBtn.on('pointerdown', () => this.scene.start('Game'));

    // Menu button
    const menuBtn = this.add.image(w / 2, h * 0.75, 'button').setScale(2, 1.5).setInteractive();
    this.add.text(w / 2, h * 0.75, '메뉴', {
      fontFamily: 'monospace',
      fontSize: '24px',
      fill: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    menuBtn.on('pointerdown', () => this.scene.start('MainMenu'));
  }
}
