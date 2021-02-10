// import { DICES } from '../constants'
import {
    // BOARD, 
    SCENE_KEYS
} from '../constants/constants'

class LoaderScene extends Phaser.Scene {
    constructor() {
        super({ key: SCENE_KEYS.LoaderScene })
    }

    preload() {
        //tablero
        this.load.image('bg', 'assets/images/bg.png')
        // this.load.bitmapFont('font', "./assets/font/font.png", "./assets/font/font.fnt")
        // this.movement = false

        // this.load.image(DICES.dice01, 'assets/images/dice1.png')

        this.load.on('complete', () => {
            console.log('load complete')
            //llamar escena principal
            this.scene.start(SCENE_KEYS.ParchisScene)
        })

    }

}

export default LoaderScene