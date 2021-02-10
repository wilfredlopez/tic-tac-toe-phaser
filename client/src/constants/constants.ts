
export const SERVER_URL = 'ws://localhost:2567'

export const DICES = {
    dices: "dices",
    dice01: "dice01",
    dice02: "dice02",
    dice03: "dice03",
    dice04: "dice04",
    dice05: "dice05",
    dice06: "dice06",
}

export const BOARD = {
    board: "board",
    red: "red",
    blue: "blue",
    green: "green",
    yellow: "yellow",
}

export const OBJECTS = {
    BOARD,
    DICES
}

export const STATES = {
    IDLE: 'idle',
    DICE_ROLL: 'dice-roll',
    DASH_ROLL_FINISH: 'dash-roll-finish',
    WAIT_DASH_ROLL: 'wait-for-dash-roll-finish',
    SELECT_FROM_YARD: "select-from-yard",
    SELECT_FROM_YARD_OR_BOARD: "select-from-yard-or-board",
    SELECT_FROM_BOARD: "select-from-board",
    TURN_COMPLETE: 'turn-complete',
    COUNT_DOWN_END: 'COUNT-DOWN-END'
}


export const SCENE_KEYS = {
    ParchisScene: "ParchisScene",
    LoaderScene: "LoaderScene",
}

