import { SCENE_KEYS } from '../constants'
import { IGameOverSceneData } from '../interfaces/tictactoe.interface'

class GameOverScene extends Phaser.Scene {

    /* ------------------------------------ */
    constructor() {
        super({ key: SCENE_KEYS.GameOver })
    }


    // public async init() {

    // }


    public async create(data: IGameOverSceneData) {
        const { cx, cy } = this.getCenter()
        const result = data.winner ? "YOU WIN!" : "YOU LOST!"
        const title = this.add.text(cx, cy, result, {
            fontSize: 40,
            color: '#ffffff',
            align: 'center',
            strokeThickness: 1
        })
            .setOrigin(0.5)

        this.add.text(title.x, title.y + 100, 'Press Space to play again.').setOrigin(0.5)

        this.input.keyboard.once('keyup-SPACE', () => {
            data?.onRestart()
        })


    }






    private getCenter() {
        const { width, height } = this.scale
        const cx = width * 0.5
        const cy = height * 0.5
        return {
            cx, cy, width, height
        }
    }









    update(_time?: number, delta?: number) {

    }
}

export default GameOverScene