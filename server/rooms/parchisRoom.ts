import { Client, Room } from 'colyseus'
import { ClientMessage, ServerMessage } from '../../shared/Enums'
import { TicTacToeState } from '../schema/TicTacToeState'
export class TicTacToeRoom extends Room<TicTacToeState> {
    onCreate(_options?: any) {
        this.setState(new TicTacToeState())
        this.onMessage(ClientMessage.DiceRoll, (client) => {
            //something
        })

        this.onMessage(ClientMessage.NextTurn, (client) => {
            //do work

        })
        this.onMessage(ClientMessage.PieceMove, (client, message: { index: number, value: number, side: string }) => {
            //change piece position of player

            //do work
            this.broadcast(ServerMessage.PieceMove, {
                index: message.index,
                value: message.value,
                playerId: client.sessionId,
                side: message.side || 'center'
            }, { except: client })
        })

    }
    onJoin(client: Client, _options?: any) {
        //do work
    }
    onLeave(client: Client, _consented: boolean) {
        //todo


    }

    onDispose() { }
}