import { WAVES, ENEMY_TYPES } from '../config/Constants.js';

export class WaveManager {
  constructor(scene) {
    this.scene = scene;
    this.currentWave = -1;
    this.totalWaves = WAVES.length;
    this.isSpawning = false;
    this.waveTimer = null;
    this.betweenWaveDelay = 5000; // 5 seconds between waves
    this.autoStart = false;
  }

  startNextWave() {
    this.currentWave++;
    if (this.currentWave >= this.totalWaves) {
      this.scene.onAllWavesComplete();
      return false;
    }

    this.isSpawning = true;
    const wave = WAVES[this.currentWave];
    const enemies = this.flattenWave(wave);

    // Wave announcement
    this.scene.showWaveAnnouncement(this.currentWave + 1, this.totalWaves, this.currentWave === this.totalWaves - 1);

    let index = 0;
    this.waveTimer = this.scene.time.addEvent({
      delay: wave.delay,
      callback: () => {
        if (index < enemies.length) {
          this.scene.spawnEnemy(enemies[index]);
          index++;
        }
        if (index >= enemies.length) {
          this.isSpawning = false;
          this.waveTimer.remove();

          // Auto-start next wave after delay
          this.scene.time.delayedCall(this.betweenWaveDelay, () => {
            if (this.autoStart) {
              this.startNextWave();
            }
          });
        }
      },
      loop: true,
    });

    return true;
  }

  flattenWave(wave) {
    const enemies = [];
    for (const group of wave.enemies) {
      const config = ENEMY_TYPES[group.type];
      // Scale HP based on wave number
      const hpScale = 1 + this.currentWave * 0.1;
      for (let i = 0; i < group.count; i++) {
        enemies.push({
          ...config,
          type: group.type,
          hp: Math.floor(config.hp * hpScale),
          maxHp: Math.floor(config.hp * hpScale),
        });
      }
    }
    // Shuffle enemies a bit for variety
    for (let i = enemies.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [enemies[i], enemies[j]] = [enemies[j], enemies[i]];
    }
    return enemies;
  }

  getWaveNumber() {
    return this.currentWave + 1;
  }

  isLastWave() {
    return this.currentWave >= this.totalWaves - 1;
  }
}
