interface ParchisStateConfig {
    onEnter?: () => void
    onUpdate?: (dt: number) => void
    onExit?: () => void
    name?: string
}

let idCounter = 0

export default class StateMachine {
    private states = new Map<string, ParchisStateConfig>()
    private currentState?: ParchisStateConfig
    private isSwichingState = false
    private stateQueue: string[] = []
    private _previousState?: string
    get previousState() {
        return this._previousState
    }
    getCurrentStateName() {
        return this.currentState?.name
    }
    constructor(private context?: any, private id?: string) {
        this.id = id || 'psm' + idCounter
        idCounter++
    }
    addState(name: string, config: ParchisStateConfig = {}) {
        this.states.set(name, {
            onEnter: config?.onEnter?.bind(this.context),
            onExit: config?.onExit?.bind(this.context),
            onUpdate: config?.onUpdate?.bind(this.context),
            name: name
        })
        return this
    }


    isCurrentState(name: string) {
        if (!this.currentState) {
            return false
        }

        return this.currentState?.name === name
    }

    setState(name: string) {
        if (!this.states.has(name)) {
            console.warn(`Tried to change state to unknown name ${name}`)
            return
        }
        if (this.isCurrentState(name)) {
            return
        }
        if (this.isSwichingState) {
            this.stateQueue.push(name)
            return
        }
        this.isSwichingState = true
        console.log(`ParchisStateMachine (${this.id}) change from ${this.currentState?.name} to ${name}`)
        if (this.currentState && this.currentState.onExit) {
            this.currentState.onExit()
        }
        this._previousState = this.currentState?.name
        this.currentState = this.states.get(name)
        if (this.currentState.onEnter) {
            this.currentState.onEnter()
        }
        this.isSwichingState = false
        return this
    }

    update(dt: number) {
        //while there is a state queue
        if (this.stateQueue.length) {
            const name = this.stateQueue.shift()
            if (name) {
                this.setState(name)
            }
        }
        if (!this.currentState) {
            return
        }
        if (this.currentState.onUpdate) {
            this.currentState.onUpdate(dt)
        }
        return this
    }
}