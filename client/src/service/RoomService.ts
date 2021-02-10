import * as Colyseus from 'colyseus.js'
import { ITicTacToeStae } from '../../../shared/IParchisGameState'
import { SERVER_URL } from '../constants'
import { RoomChangeType } from '../interfaces/tictactoe.interface'


export default class RoomService {
    client: Colyseus.Client
    room: Colyseus.Room<ITicTacToeStae>
    serverEvents: Phaser.Events.EventEmitter
    sessionId: string
    constructor() {
        this.client = new Colyseus.Client(SERVER_URL)
        this.serverEvents = new Phaser.Events.EventEmitter()
    }

    leave(consented?: boolean) {
        this.room.leave(consented)
    }
    async createRoom(): Promise<Colyseus.Room<ITicTacToeStae>> {
        try {
            if (!this.room) {
                this.room = await this.client.joinOrCreate<ITicTacToeStae>('tictactoe')
                this.sessionId = this.room.sessionId
                this.room.state.onChange = (changes: RoomChangeType) => {
                    this.serverEvents.emit('onChange', changes)
                }
                return this.room
            }
        } catch (error) {


            console.error(error)
        }
        return this.room

    }




    onStateChange(cb: (state: ITicTacToeStae) => void, context?: object) {
        this.room.onStateChange(cb.bind(context))
    }
    onStateChangeOnce(cb: (state: ITicTacToeStae) => void, context?: object) {
        this.room.onStateChange.once(cb.bind(context))
    }



    onChange(cb: (changes: RoomChangeType) => void, context?: object) {
        this.serverEvents.on('onChange', cb, context)
    }
    onChangeOnce(cb: (changes: RoomChangeType) => void, context?: object) {
        this.serverEvents.once('onChange', cb, context)
    }

}