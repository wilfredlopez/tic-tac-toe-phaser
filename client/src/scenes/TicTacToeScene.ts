import { STATES } from '../constants'
import { SCENE_KEYS } from '../constants/constants'
import RoomService from '../service/RoomService'
import StateMachine from '../state/StateMachine'



class TicTacToeScene extends Phaser.Scene {
    stateMachine: StateMachine
    roomService: RoomService
    room: RoomService['room']
    /* ------------------------------------ */
    constructor() {
        super({ key: SCENE_KEYS.ParchisScene })
        this.stateMachine = new StateMachine(this, 'game')
    }


    // public async init() {

    // }


    public async create() {
        this.roomService = new RoomService()
        this.room = await this.roomService.createRoom()
        this.setRoomListeners()
        this.initializeStateMachine()

        this.createBoard()
    }

    private initializeStateMachine() {
        //add states
        this.stateMachine
            .addState(STATES.IDLE)
            .addState(STATES.DICE_ROLL, {
                // onEnter: this.handleDiceRollEnter,
                // onUpdate: this.handleDiceRollUpdate
            })


        //initial state
        this.stateMachine.setState(STATES.IDLE)
    }

    private setRoomListeners() {
        //listen for all state changes
        this.roomService.onStateChange((state) => {
            // console.log(`State Change`, { state })
        })

        //listen for remove player
        // this.room.state.players.onRemove = (player) => {
        //     //
        // }

        //listen for turn change
        this.roomService.onChange((changes) => {
            changes.forEach(change => {
                if (change.field === 'currentTurn') {
                    //do work
                }
            })
        })

    }

    private createBoard() {
        const { cx, cy } = this.getCenter()
        const SIZE = 128
        const GAP = 5
        let x = cx - SIZE
        let y = cy - SIZE
        this.roomService.onStateChangeOnce((state) => {
            state.board.forEach((cell, index) => {
                console.log({ cell })
                this.add.rectangle(x, y, SIZE, SIZE, 0xffffff)
                x += SIZE + GAP
                if ((index + 1) % 3 === 0) {
                    x = cx - SIZE
                    y += SIZE + GAP
                }
            })

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
        if (this.stateMachine) {
            this.stateMachine.update(delta)
        }
    }
}

export default TicTacToeScene