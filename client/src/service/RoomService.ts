import * as Colyseus from 'colyseus.js'
import { ITicTacToeStae } from '../../../shared/IParchisGameState'
import { SERVER_URL } from '../constants'
import { RoomChangeType } from '../interfaces/tictactoe.interface'
import { ClientMessage, ServerMessage } from '../../../shared/Messages'
import { GameState } from '../../../shared/GameState.interface'

enum RoomServerEvents {
    onChange = 'onChange',
}




export default class RoomService {
    client: Colyseus.Client
    room: Colyseus.Room<ITicTacToeStae>
    serverEvents: Phaser.Events.EventEmitter
    // callBacks: Record<string, Function[]> = {}
    callBacks: WeakMap<RoomService, Record<string, Function[]>>
    private _playerIndex = -1
    get playerIndex() {
        return this._playerIndex
    }
    sessionId: string
    get gameState() {
        if (!this.room) {
            return GameState.waitingForPlayers
        }
        return this.room.state.gameState
    }
    constructor() {
        this.client = new Colyseus.Client(SERVER_URL)
        this.serverEvents = new Phaser.Events.EventEmitter()
        this.callBacks = new WeakMap<RoomService, Record<string, Function[]>>()
    }

    leave(consented?: boolean) {
        this._playerIndex = -1
        this.callBacks.set(this, {})
        // this.callBacks = {}
        if (this.room) {
            this.room.leave(consented)
        }
        this.serverEvents.removeAllListeners()
        this.room = undefined


    }
    async createRoom(): Promise<Colyseus.Room<ITicTacToeStae>> {
        try {
            if (!this.room) {
                this.room = await this.client.joinOrCreate<ITicTacToeStae>('tictactoe')
                this.sessionId = this.room.sessionId
                this.room.onMessage(ServerMessage.PLAYER_INDEX, (index: number) => {
                    this._playerIndex = index
                })
                this.room.state.onChange = this.handleOnChange.bind(this)
                this.handleEvents()
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
        if (!this.room) {
            return this
        }
        if (this.gameState !== GameState.Playing) {
            console.warn("Game State is not Playing")
            return
        }
        if (this.room.state.activePlayer !== this.playerIndex) {
            console.warn(`Not this player's turn.`)
            return this
        }
        this.room.send(ClientMessage.PLAYER_SELECTION, { index })
        return this
    }

    onBoardChanged(cb: (item: number, key: number) => void, context?: object) {
        this.room.state.board.onChange = cb.bind(context)
    }


    private handleEvents() {
        this.serverEvents.on(RoomServerEvents.onChange, (changes: RoomChangeType) => {
            changes.forEach(change => {
                const records = this.callBacks.get(this) || {}
                const cbs = records[change.field] || []
                // const cbs = this.callBacks[change.field] || []
                for (let cb of cbs) {
                    cb(change.value)
                }
            })
        })
    }

    private onChangeOf<T extends RoomChangeType[0]['field']>(key: T, cb: (value: RoomChangeType[0]['value']) => void, context?: object) {
        const records = this.callBacks.get(this) || {}
        records[key] = records[key] || []
        records[key].push(cb.bind(context))
        this.callBacks.set(this, records)
        // this.callBacks[key] = this.callBacks[key] || []
        // this.callBacks[key].push(cb.bind(context))
    }

    onGameStateChange(cb: (value: number) => void, context?: object) {
        this.onChangeOf('gameState', cb, context)
    }

    onActivePlayerChange(cb: (value: number) => void, context?: object) {
        this.onChangeOf('activePlayer', cb, context)
        // this.serverEvents.on(RoomServerEvents.onChange, (changes: RoomChangeType) => {
        //     changes.forEach(change => {
        //         if (change.field === 'activePlayer') {
        //             cb.call(context, change.value)
        //         }
        //     })
        // })
    }
    onWinningPlayerChanged(cb: (winningPlayerIndex: number) => void, context?: object) {
        this.onChangeOf('winningPlayer', cb, context)
        // this.serverEvents.on(RoomServerEvents.onChange, (changes: RoomChangeType) => {
        //     changes.forEach(change => {
        //         if (change.field === 'winningPlayer') {
        //             cb.call(context, change.value)
        //         }
        //     })
        // })
    }
    // onStateChange(cb: (state: ITicTacToeStae) => void, context?: object) {
    //     this.room.onStateChange(cb.bind(context))
    // }
    onStateChangeOnce(cb: (state: ITicTacToeStae) => void, context?: object) {
        this.room.onStateChange.once(cb.bind(context))
    }
}