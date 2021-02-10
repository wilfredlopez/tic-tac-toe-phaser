
export type RoomChangeType = RoomChangeGenericType | RoomDiceChangeType
export type RoomChangeGenericType = { field: string, op: number, previousValue?: {}, value: {} }[]
export type RoomDiceChangeType = { field: 'diceValue', op: number, previousValue?: {}, value: {} }[]
// export type MatchPosition = [blue: number, red: number, green: number, yellow: number]
// export type MatchPositionOfset = [blue: OFFSET, red: OFFSET, green: OFFSET, yellow: OFFSET]
// export type OFFSET = { x: number, y: number }