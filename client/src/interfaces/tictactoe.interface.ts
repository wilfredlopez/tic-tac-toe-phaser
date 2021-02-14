
export type RoomChanges = RoomChangeGenericType | BoardChangeType | ActivePlayeChange
export type RoomChangeType = ReadonlyArray<RoomChanges>

export type RoomChangeGenericType = { field: '*', op: number, previousValue?: string[], value: string[] }
export type BoardChangeType = { field: 'board', op: number, previousValue?: number[], value: number[] }
export type ActivePlayeChange = { field: "activePlayer", op: number, previousValue?: number, value: number }