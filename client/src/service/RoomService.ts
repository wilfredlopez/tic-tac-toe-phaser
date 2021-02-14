import * as Colyseus from 'colyseus.js'
import { ITicTacToeStae } from '../../../shared/IParchisGameState'
import { SERVER_URL } from '../constants'
import { RoomChangeType } from '../interfaces/tictactoe.interface'
import { ClientMessage } from '../../../shared/Messages'


enum RoomServerEvents {
    onChange = 'onChange',
}

export default class RoomService {
    client: Colyseus.Client
    room: Colyseus.Room<ITicTacToeStae>
    serverEvents: Phaser.Events.EventEmitter
    sessionId: string
    constructor() {
        this.client = new Colyseus.Client(SERVER_URL)
        this.serverEvents = new Phaser.Events.EventEmitter()
    }

    // leave(consented?: boolean) {
    //     this.room.leave(consented)
    // }
    async createRoom(): Promise<Colyseus.Room<ITicTacToeStae>> {
        try {
            if (!this.room) {
                this.room = await this.client.joinOrCreate<ITicTacToeStae>('tictactoe')
                this.sessionId = this.room.sessionId
                this.room.state.onChange = this.handleOnChange.bind(this)
                return this.room
            }
        } catch (error) {
            console.error(error)
        }
        return this.room

    }
    private handleOnChange(changes: RoomChangeType) {
        this.serverEvents.emit(RoomServerEvents.onChange, changes)
    }
    onChange(cb: (changes: RoomChangeType) => void, context?: object) {
        this.serverEvents.on(RoomServerEvents.onChange, cb, context)
    }
    onChangeOnce(cb: (changes: RoomChangeType) => void, context?: object) {
        this.serverEvents.once(RoomServerEvents.onChange, cb, context)
    }

    makeSelection(index: number) {
        this.room.send(ClientMessage.PLAYER_SELECTION, { index })
        return this
    }

    onBoardChanged(cb: (item: number, key: number) => void, context?: object) {
        this.room.state.board.onChange = cb.bind(context)
    }
    // onStateChange(cb: (state: ITicTacToeStae) => void, context?: object) {
    //     this.room.onStateChange(cb.bind(context))
    // }
    onStateChangeOnce(cb: (state: ITicTacToeStae) => void, context?: object) {
        this.room.onStateChange.once(cb.bind(context))
    }
}