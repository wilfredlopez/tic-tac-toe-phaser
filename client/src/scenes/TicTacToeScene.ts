import { STATES } from '../constants'
import { SCENE_KEYS } from '../constants/constants'
import RoomService from '../service/RoomService'
import StateMachine from '../state/StateMachine'

import { CellType } from '../../../shared/CellType'

class TicTacToeScene extends Phaser.Scene {
    stateMachine: StateMachine
    roomService: RoomService
    room: RoomService['room']
    private cells: { display: Phaser.GameObjects.Rectangle, value: number }[] = []
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
        this.initializeStateMachine()
        this.createBoard()
        this.setRoomListeners()

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

        //listen for remove player
        // this.room.state.players.onRemove = (player) => {
        //     //
        // }

        //listen for turn change
        // this.roomService.onChange((changes) => {
        //     changes.forEach(change => {
        //         if (change.field === 'board') {
        //             // change.value
        //         }
        //     })
        // })

    }

    private createBoard() {
        const { cx, cy } = this.getCenter()
        const SIZE = 128
        const GAP = 5
        let x = cx - SIZE
        let y = cy - SIZE
        this.roomService.onStateChangeOnce((state) => {
            state.board.forEach((cellState, index) => {
                const Cell = this.add.rectangle(x, y, SIZE, SIZE, 0xffffff)
                    .setInteractive()
                    .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
                        console.log(`clicked on ${index}`)
                        this.roomService?.makeSelection(index)
                    })

                this.cells.push({
                    display: Cell,
                    value: cellState
                })
                x += SIZE + GAP
                if ((index + 1) % 3 === 0) {
                    x = cx - SIZE
                    y += SIZE + GAP
                }
            })

        })
        this.roomService.onBoardChanged((item, key) => {
            this.handleBoardChange(item, key)
        })

    }


    private handleBoardChange(item: number, key: number) {
        const cell = this.cells[key] || null
        if (cell === null) {
            return
        }
        if (cell.value !== item) {
            this.add.star(cell.display.x, cell.display.y, 4, 4, 60, 0xff0000)
                .setAngle(45)
            cell.value = item
        }
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