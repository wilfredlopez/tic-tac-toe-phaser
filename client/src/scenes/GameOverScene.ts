import { SCENE_KEYS } from '../constants'

class GameOverScene extends Phaser.Scene {

    /* ------------------------------------ */
    constructor() {
        super({ key: SCENE_KEYS.GameOver })
    }


    // public async init() {

    // }


    public async create({ result }: { result: string }) {
        const { cx } = this.getCenter()
        this.add.text(cx, 250, result, {
            fontSize: 30,
            color: '#ffffff',
            align: 'center',
            strokeThickness: 1

        })
            .setOrigin(0.5)

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