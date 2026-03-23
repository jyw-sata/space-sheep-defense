import EasyStar from 'easystarjs';
import { GRID } from '../config/Constants.js';

export class PathManager {
  constructor() {
    this.grid = [];
    this.easyStar = new EasyStar.js();
    this.easyStar.setAcceptableTiles([0]);
    this.easyStar.enableDiagonals();
    this.easyStar.disableCornerCutting();

    // Initialize empty grid
    for (let row = 0; row < GRID.ROWS; row++) {
      this.grid[row] = [];
      for (let col = 0; col < GRID.COLS; col++) {
        this.grid[row][col] = 0; // 0 = walkable
      }
    }
    this.easyStar.setGrid(this.grid);

    this.sheepPos = { col: 9, row: 12 }; // Center of map
    this.spawnPoints = [
      { col: 0, row: 0 },      // Top-left
      { col: 17, row: 0 },     // Top-right
      { col: 0, row: 23 },     // Bottom-left
      { col: 17, row: 23 },    // Bottom-right
    ];

    // Mark sheep pen area as unwalkable for towers (but walkable for enemies)
    this.sheepArea = [];
    for (let r = 11; r <= 13; r++) {
      for (let c = 8; c <= 10; c++) {
        this.sheepArea.push({ row: r, col: c });
      }
    }
  }

  isSheepArea(col, row) {
    return this.sheepArea.some(p => p.row === row && p.col === col);
  }

  isSpawnArea(col, row) {
    return this.spawnPoints.some(p => p.row === row && p.col === col);
  }

  isBlocked(col, row) {
    if (row < 0 || row >= GRID.ROWS || col < 0 || col >= GRID.COLS) return true;
    return this.grid[row][col] === 1;
  }

  // Try placing a tower - returns true if placement is valid (path still exists)
  async canPlace(col, row) {
    if (this.isBlocked(col, row)) return false;
    if (this.isSheepArea(col, row)) return false;
    if (this.isSpawnArea(col, row)) return false;

    // Temporarily block this cell
    this.grid[row][col] = 1;
    this.easyStar.setGrid(this.grid);

    // Check if path exists from all spawn points to sheep
    let allPathsExist = true;
    for (const spawn of this.spawnPoints) {
      const pathExists = await this.findPathAsync(spawn.col, spawn.row, this.sheepPos.col, this.sheepPos.row);
      if (!pathExists) {
        allPathsExist = false;
        break;
      }
    }

    if (!allPathsExist) {
      // Revert
      this.grid[row][col] = 0;
      this.easyStar.setGrid(this.grid);
      return false;
    }

    return true;
  }

  placeTower(col, row) {
    this.grid[row][col] = 1;
    this.easyStar.setGrid(this.grid);
  }

  removeTower(col, row) {
    this.grid[row][col] = 0;
    this.easyStar.setGrid(this.grid);
  }

  findPathAsync(startCol, startRow, endCol, endRow) {
    return new Promise((resolve) => {
      this.easyStar.findPath(startCol, startRow, endCol, endRow, (path) => {
        resolve(path);
      });
      this.easyStar.calculate();
    });
  }

  async getPath(spawnCol, spawnRow) {
    const path = await this.findPathAsync(spawnCol, spawnRow, this.sheepPos.col, this.sheepPos.row);
    return path;
  }

  gridToWorld(col, row) {
    return {
      x: GRID.OFFSET_X + col * GRID.CELL_SIZE + GRID.CELL_SIZE / 2,
      y: GRID.OFFSET_Y + row * GRID.CELL_SIZE + GRID.CELL_SIZE / 2,
    };
  }

  worldToGrid(x, y) {
    return {
      col: Math.floor((x - GRID.OFFSET_X) / GRID.CELL_SIZE),
      row: Math.floor((y - GRID.OFFSET_Y) / GRID.CELL_SIZE),
    };
  }
}
