import { ArraySchema, Schema, type } from '@colyseus/schema'
import { GameState, ITicTacToeStae } from '../../shared'


export class TicTacToeState extends Schema implements ITicTacToeStae {

    @type(['number'])
    board: ArraySchema<number>

    @type('number')
    gameState: GameState = GameState.waitingForPlayers
    @type('number')
    activePlayer: number


    @type("number")
    winningPlayer: number

    constructor() {
        super()
        this.activePlayer = 0
        this.winningPlayer = -1
        this.board = new ArraySchema(
            0, 0, 0,
            0, 0, 0,
            0, 0, 0
        )
    }
}