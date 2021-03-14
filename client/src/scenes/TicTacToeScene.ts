import { STATES } from '../constants'
import { SCENE_KEYS } from '../constants/constants'
import RoomService from '../service/RoomService'
import StateMachine from '../state/StateMachine'

import { CellType } from '../../../shared/CellType'
import { TicTacToeSceneData, IGameOverSceneData } from '../interfaces/tictactoe.interface'
import { GameState } from '../../../shared/GameState.interface'

const Colors = {
    BLUE: 0x0000ff,
    RED: 0xff0000,
    WHITE: 0xffffff
}

class TicTacToeScene extends Phaser.Scene {
    stateMachine: StateMachine
    roomService: RoomService
    room: RoomService['room']
    turnText?: Phaser.GameObjects.Text

    onGameOver?: (data: IGameOverSceneData) => void
    private cells: { display: Phaser.GameObjects.Rectangle, value: number }[] = []
    private gameText?: Phaser.GameObjects.Text
    /* ------------------------------------ */
    constructor() {
        super({ key: SCENE_KEYS.TicTacToeScene })
    }


    public async init() {
        this.stateMachine = new StateMachine(this, 'game')
        this.cells = []
    }


    public async create(data: TicTacToeSceneData) {
        // this.roomService = new RoomService()
        this.roomService = data.roomService
        this.onGameOver = data.onGameOver
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

        this.roomService.onActivePlayerChange((value) => {
            this.onPlayerChanged(value)
        })

    }

    private handleWiningPlayer(winningPlayerIndex: number) {
        if (winningPlayerIndex === -1) {
            return
        }

        this.time.delayedCall(100, () => {
            if (winningPlayerIndex === -1) {
                return
            }
            this.onGameOver({
                winner: this.roomService.playerIndex === winningPlayerIndex,
            })
        })

        // if (this.roomService.playerIndex === winningPlayerIndex) {
        //     console.log("YOU WIN")
        //     this.scene.launch(SCENE_KEYS.GameOver, { result: "YOU WIN!", winner: true, })
        // } else {
        //     console.log("YOU LOOSE")
        //     this.scene.launch(SCENE_KEYS.GameOver, { result: "YOU LOST!", winner: false, })
        // }
    }

    private onPlayerChanged(playerIndex: number) {
        console.log("ACTIVE PLAYER", { playerIndex })
    }

    private createBoard() {
        const { cx, cy } = this.getCenter()
        const SIZE = 128
        const GAP = 5
        let x = cx - SIZE
        let y = cy - SIZE
        this.roomService.onStateChangeOnce((state) => {
            state.board.forEach((cellState, index) => {
                const Cell = this.add.rectangle(x, y, SIZE, SIZE, Colors.WHITE)
                    .setInteractive()
                    .on(Phaser.Input.Events.GAMEOBJECT_POINTER_UP, () => {
                        // console.log(`clicked on ${index}`)
                        this.roomService?.makeSelection(index)
                    })

                this.setStarOrCircle(cellState, Cell)

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
            if (this.roomService.gameState === GameState.waitingForPlayers) {
                this.gameText = this.add.text(cx, 50, 'Waiting for opponent...').setOrigin(0.5)
            }
        })


        this.roomService.onBoardChanged((item, key) => {
            this.handleBoardChange(item, key)
        })

        this.roomService.onWinningPlayerChanged((value) => {
            this.handleWiningPlayer(value)
        })
        this.roomService.onGameStateChange((value) => {
            this.handleGameStateChange(value)
        })
    }

    private handleGameStateChange(value: number) {
        // const { cx } = this.getCenter()
        // if (value === GameState.waitingForPlayers) {
        //     this.gameText = this.add.text(cx, 50, 'Waiting for opponent...').setOrigin(0.5)
        // }
        if (value === GameState.Playing && this.gameText) {
            this.gameText?.destroy()
            this.gameText = undefined
        }
    }

    private setStarOrCircle(cellState: number, Cell: Phaser.GameObjects.Rectangle) {
        switch (cellState) {
            case CellType.X:
                {
                    this.add.star(Cell.x, Cell.y, 4, 4, 60, Colors.RED)
                        .setAngle(45)
                    break
                }
            case CellType.O:
                {
                    this.add.circle(Cell.x, Cell.y, 50, Colors.BLUE)
                    break
                }
        }
    }

    get playerCellType() {
        return this.roomService.playerIndex === 0 ? CellType.X : CellType.O
    }

    private handleBoardChange(newvalue: number, idx: number) {
        const cell = this.cells[idx] || null
        if (cell === null) {
            return
        }
        if (cell.value !== newvalue) {
            this.setStarOrCircle(newvalue, cell.display)
            cell.value = newvalue

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







    private handleTurnText() {
        const cell = this.playerCellType === CellType.X ? "X" : "O"
        const prefix = `${cell}:`
        let text = `${prefix} WAITING`
        if (this.room && this.roomService) {
            if (this.room.state.activePlayer === this.roomService.playerIndex) {
                text = `${prefix} YOUR TURN`
            }
            if (this.roomService.gameState !== GameState.Playing) {
                text = ''
            }

        }
        if (!this.turnText) {
            this.turnText = this.add.text(this.scale.width * 0.5, 100, text).setOrigin(0.5)
        } else {
            // this.turnText.setText(text)
            this.turnText.destroy()
            this.turnText = this.add.text(this.scale.width * 0.5, 100, text).setOrigin(0.5)
        }
    }


    update(_time?: number, delta?: number) {
        if (this.stateMachine) {
            this.stateMachine.update(delta)
        }
        this.handleTurnText()
    }
}

export default TicTacToeScene