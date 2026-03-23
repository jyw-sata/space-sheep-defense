import Phaser from 'phaser';

export class VictoryScene extends Phaser.Scene {
  constructor() {
    super('Victory');
  }

  create(data) {
    const w = this.cameras.main.width;
    const h = this.cameras.main.height;
    const sheepLeft = data.sheepLeft || 0;

    this.add.rectangle(w / 2, h / 2, w, h, 0x000000, 0.7);

    this.add.text(w / 2, h * 0.25, 'VICTORY!', {
      fontFamily: 'monospace',
      fontSize: '48px',
      fill: '#00ffcc',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(w / 2, h * 0.35, 'The aliens have been defeated!', {
      fontFamily: 'monospace',
      fontSize: '16px',
      fill: '#88ffcc',
    }).setOrigin(0.5);

    // Stars based on sheep saved
    const stars = sheepLeft >= 10 ? 4 : sheepLeft >= 7 ? 3 : sheepLeft >= 4 ? 2 : 1;
    const starText = '★'.repeat(stars) + '☆'.repeat(4 - stars);

    this.add.text(w / 2, h * 0.45, starText, {
      fontSize: '40px',
      fill: '#ffdd00',
    }).setOrigin(0.5);

    this.add.text(w / 2, h * 0.53, `${sheepLeft}/10 sheep saved`, {
      fontFamily: 'monospace',
      fontSize: '22px',
      fill: '#ffffff',
    }).setOrigin(0.5);

    // Replay
    const retryBtn = this.add.image(w / 2, h * 0.67, 'button').setScale(2, 1.5).setInteractive();
    this.add.text(w / 2, h * 0.67, 'PLAY AGAIN', {
      fontFamily: 'monospace',
      fontSize: '22px',
      fill: '#00ffcc',
      fontStyle: 'bold',
    }).setOrigin(0.5);
    retryBtn.on('pointerdown', () => this.scene.start('Game'));

    // Menu
    const menuBtn = this.add.image(w / 2, h * 0.77, 'button').setScale(2, 1.5).setInteractive();
    this.add.text(w / 2, h * 0.77, 'MENU', {
      fontFamily: 'monospace',
      fontSize: '22px',
      fill: '#00ffcc',
      fontStyle: 'bold',
    }).setOrigin(0.5);
    menuBtn.on('pointerdown', () => this.scene.start('MainMenu'));
  }
}
