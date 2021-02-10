import { ArraySchema, Schema, type } from '@colyseus/schema'
import { ITicTacToeStae } from '../../shared/IParchisGameState'


export class TicTacToeState extends Schema implements ITicTacToeStae {

    @type(['number'])
    board: ArraySchema<number>


    @type('number')
    activePlayer: number

    constructor() {
        super()
        this.activePlayer = 0
        this.board = new ArraySchema(
            0, 0, 0,
            0, 0, 0,
            0, 0, 0
        )
    }
}