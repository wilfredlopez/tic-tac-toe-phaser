import 'phaser'
import LoaderScene from './scenes/LoaderScene'
import TicTacToeScene from './scenes/TicTacToeScene'
import GameOverScene from './scenes/GameOverScene'

const config = {
  width: 700,
  height: 1024,
  parent: "container",
  title: 'Parchis',
  version: '1.0',
  type: Phaser.AUTO,
  backgroundColor: '#000000',
  scene: [LoaderScene, TicTacToeScene, GameOverScene],
  scale: {
    mode: Phaser.Scale.ScaleModes.FIT
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 200 }
    }
  },
  input: {
    keyboard: true
  },
  // render: { pixelArt: true, antialias: false }
}



export class Game extends Phaser.Game {
  constructor(config: Phaser.Types.Core.GameConfig) {
    super(config)
  }
}

window.addEventListener('load', () => {
  new Game(config)
})

