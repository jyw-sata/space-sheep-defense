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

    this.add.text(w / 2, h * 0.25, '승리!', {
      fontFamily: 'monospace',
      fontSize: '48px',
      fill: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(0.5);

    this.add.text(w / 2, h * 0.35, '외계인을 물리쳤습니다!', {
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

    this.add.text(w / 2, h * 0.53, `${sheepLeft}/10 마리 생존`, {
      fontFamily: 'monospace',
      fontSize: '22px',
      fill: '#ffffff',
    }).setOrigin(0.5);

    // Replay
    const retryBtn = this.add.image(w / 2, h * 0.67, 'button').setScale(2, 1.5).setInteractive();
    this.add.text(w / 2, h * 0.67, '다시 하기', {
      fontFamily: 'monospace',
      fontSize: '22px',
      fill: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(0.5);
    retryBtn.on('pointerdown', () => this.scene.start('Game'));

    // Menu
    const menuBtn = this.add.image(w / 2, h * 0.77, 'button').setScale(2, 1.5).setInteractive();
    this.add.text(w / 2, h * 0.77, '메뉴', {
      fontFamily: 'monospace',
      fontSize: '22px',
      fill: '#ffffff',
      fontStyle: 'bold',
    }).setOrigin(0.5);
    menuBtn.on('pointerdown', () => this.scene.start('MainMenu'));
  }
}
