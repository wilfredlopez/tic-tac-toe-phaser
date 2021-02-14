import { Client, Room } from 'colyseus'
import { ClientMessage, ServerMessage, CellType } from '../../shared'
import { TicTacToeState } from '../schema/TicTacToeState'
export class TicTacToeRoom extends Room<TicTacToeState> {
    onCreate(_options?: any) {
        this.setState(new TicTacToeState())
        this.onMessage(ClientMessage.PLAYER_SELECTION, (client, message: { index: number }) => {
            //something
            const clientIndex = this.clients.findIndex(c => c.id === client.id)
            const cell = clientIndex === 0 ? CellType.X : CellType.O
            this.state.board[message.index] = cell
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
    }
    onLeave(client: Client, _consented: boolean) {
        //todo


    }

    onDispose() { }
}