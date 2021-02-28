import { Client, Room } from 'colyseus'
import { ClientMessage, ServerMessage, CellType } from '../../shared'
import { TicTacToeState } from '../schema/TicTacToeState'


const winningMoves: [Cell[], Cell[], Cell[], Cell[], Cell[], Cell[], Cell[], Cell[]] = [
    [{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 2 }],
    [{ row: 1, col: 0 }, { row: 1, col: 1 }, { row: 1, col: 2 }],
    [{ row: 2, col: 0 }, { row: 2, col: 1 }, { row: 2, col: 2 }],

    [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }],
    [{ row: 0, col: 1 }, { row: 1, col: 1 }, { row: 2, col: 1 }],
    [{ row: 0, col: 2 }, { row: 1, col: 2 }, { row: 2, col: 2 }],
    //diagonal
    [{ row: 0, col: 0 }, { row: 1, col: 1 }, { row: 2, col: 2 }],
    [{ row: 0, col: 2 }, { row: 1, col: 1 }, { row: 2, col: 0 }],
]


interface Cell {
    row: number
    col: number
}

function getValueAtCell(board: number[], { col, row }: Cell) {
    //0 0 0 <- row
    //0 0 0
    //0 0 0
    //^- column

    const index = (row * 3) + col
    return board[index]
}


export class TicTacToeRoom extends Room<TicTacToeState> {
    constructor() {
        super()
        //only allow 2 players
        this.maxClients = 2
    }
    private determineWin() {

        for (let i = 0; i < winningMoves.length; i++) {
            const win = winningMoves[i]
            //if all cells have same value and are not empty we have a winner.
            let allSameValue = true
            for (let j = 1; j < win.length; j++) {
                const prevCell = win[j - 1]
                const cell = win[j]
                const prev = getValueAtCell(this.state.board, prevCell)
                const current = getValueAtCell(this.state.board, cell)

                //check that have same value as prev and not empty
                if (prev !== current || prev === CellType.EMPTY) {
                    //no win
                    allSameValue = false
                    break
                }
            }
            if (allSameValue) {
                return true
            }
        }

        return false
    }
    private setNextPlayer() {

        const activePlayer = this.state.activePlayer

        if (activePlayer === 0) {
            this.state.activePlayer = 1
        } else {
            this.state.activePlayer = 0
        }
    }
    private handlePlayerSelection() {
        const win = this.determineWin()
        if (win) {
            console.log("WIN")
            // set active player the winning player on state
            this.state.winningPlayer = this.state.activePlayer
        } else {
            console.log('setting player')
            this.setNextPlayer()
        }
    }
    onCreate(_options?: any) {
        this.setState(new TicTacToeState())
        this.onMessage(ClientMessage.PLAYER_SELECTION, (client, message: { index: number }) => {
            const clientIndex = this.clients.findIndex(c => c.id === client.id)

            if (clientIndex !== this.state.activePlayer) {
                return
            }
            const cell = clientIndex === 0 ? CellType.X : CellType.O
            this.state.board[message.index] = cell

            //sets next player turn or sets winning player
            this.handlePlayerSelection()

        })
        // this.onMessage(ClientMessage.PieceMove, (client, message: { index: number, value: number, side: string }) => {
        //     //change piece position of player

        //     //do work
        //     this.broadcast(ServerMessage.PieceMove, {
        //         index: message.index,
        //         value: message.value,
        //         playerId: client.sessionId,
        //         side: message.side || 'center'
        //     }, { except: client })
        // })

    }

    onJoin(client: Client, _options?: any) {
        //do work
        const playerIndex = this.clients.findIndex(c => c.sessionId === client.sessionId)
        client.send(ServerMessage.PLAYER_INDEX, playerIndex)
    }
    onLeave(client: Client, _consented: boolean) {
        //todo


    }

    onDispose() { }
}