import type RoomService from '../service/RoomService'
import { GameState } from '../../../shared/GameState.interface'
export type RoomChanges = RoomChangeGenericType | BoardChangeType | ActivePlayeChange | WinninglayerChange | GameStateChange
export type RoomChangeType = ReadonlyArray<RoomChanges>

export type RoomChangeGenericType = { field: '*', op: number, previousValue?: string[], value: string[] }
export type BoardChangeType = { field: 'board', op: number, previousValue?: number[], value: number[] }
export type ActivePlayeChange = { field: "activePlayer", op: number, previousValue?: number, value: number }
export type WinninglayerChange = { field: "winningPlayer", op: number, previousValue?: number, value: number }
export type GameStateChange = { field: 'gameState', op: number, previousValue?: GameState, value: GameState }

export interface IGameOverSceneData {
    winner: boolean
    onRestart?: () => void
}

export interface TicTacToeSceneData {
    onGameOver: (data: IGameOverSceneData) => void
    roomService: RoomService
}