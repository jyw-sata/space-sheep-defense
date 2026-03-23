import Phaser from 'phaser';
import { BootScene } from './scenes/Boot.js';
import { MainMenuScene } from './scenes/MainMenu.js';
import { GameScene } from './scenes/Game.js';
import { GameOverScene } from './scenes/GameOver.js';
import { VictoryScene } from './scenes/Victory.js';

const config = {
  type: Phaser.AUTO,
  parent: 'game-container',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 720,
    height: 1280,
  },
  backgroundColor: '#2d6a2d',
  scene: [BootScene, MainMenuScene, GameScene, GameOverScene, VictoryScene],
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
    },
  },
  input: {
    activePointers: 3,
  },
};

const game = new Phaser.Game(config);
