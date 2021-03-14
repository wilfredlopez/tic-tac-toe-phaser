// import { DICES } from '../constants'
import {
    // BOARD, 
    SCENE_KEYS
} from '../constants/constants'
import { IGameOverSceneData, TicTacToeSceneData } from '../interfaces/tictactoe.interface'
import RoomService from '../service/RoomService'

class LoaderScene extends Phaser.Scene {
    constructor() {
        super({ key: SCENE_KEYS.LoaderScene })
    }

    roomService: RoomService


    init() {
        this.roomService = new RoomService()
    }

    preload() {
        //tablero
        this.load.image('bg', 'assets/images/bg.png')
        // this.load.bitmapFont('font', "./assets/font/font.png", "./assets/font/font.fnt")
        // this.movement = false

        // this.load.image(DICES.dice01, 'assets/images/dice1.png')

        this.load.on('complete', () => {
            console.log('load complete')
            // this.scene.start(SCENE_KEYS.GameOver, { winner: true })
            //llamar escena principal
            // this.scene.start(SCENE_KEYS.ParchisScene)
            // this.createGame()
        })

    }

    create() {
        this.createGame()
    }
    private handleGameOver(data: IGameOverSceneData) {
        this.roomService.leave()
        this.scene.stop(SCENE_KEYS.TicTacToeScene)
        this.scene.launch(SCENE_KEYS.GameOver, { ...data, onRestart: this.onRestart })
        console.log('on GameOver Called.')
    }
    private onRestart = () => {
        this.scene.stop(SCENE_KEYS.GameOver)
        this.createGame()
    }
    private createGame() {
        this.scene.launch(SCENE_KEYS.TicTacToeScene, {
            onGameOver: (data: IGameOverSceneData) => {
                this.handleGameOver(data)
            },
            roomService: this.roomService
        } as TicTacToeSceneData)
    }
}

export default LoaderScene