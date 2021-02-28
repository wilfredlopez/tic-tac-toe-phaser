export declare const SWITCH_TO_STRUCTURE = 255
export declare const TYPE_ID = 213
/**
 * Encoding Schema field operations.
 */
export declare enum OPERATION {
    ADD = 128,
    REPLACE = 0,
    DELETE = 64,
    DELETE_AND_ADD = 192,
    TOUCH = 1,
    CLEAR = 10
}

export interface DataChange<T = any> {
    op: OPERATION
    field: string
    dynamicIndex?: number | string
    value: T
    previousValue: T
}

export declare abstract class Schema {
    static _typeid: number
    // static _context: Context;
    // static _definition: SchemaDefinition;
    // static is(type: DefinitionType): boolean;
    // protected $changes: ChangeTree;
    static onError(e: any): void
    // protected $listeners: {
    //     [field: string]: EventEmitter<(a: any, b: any) => void>;
    // };
    onChange?(changes: DataChange[]): any
    onRemove?(): any
    constructor(...args: any[])
    // assign(props: {
    //     [prop in NonFunctionPropNames<this>]?: this[prop];
    // }): this;
    // protected get _definition(): SchemaDefinition;
    // listen<K extends NonFunctionPropNames<this>>(attr: K, callback: (value: this[K], previousValue: this[K]) => void): () => void;
    // decode(bytes: number[], it?: decode.Iterator, ref?: Ref, allChanges?: Map<number, DataChange[]>): Map<number, DataChange<any>[]>;
    encode(encodeAll?: boolean, bytes?: number[], useFilters?: boolean): number[]
    // applyFilters(client: Client, encodeAll?: boolean): number[];
    encodeAll(useFilters?: boolean): number[]
    clone(): this
    triggerAll(): void
    toJSON(): {}
    discardAllChanges(): void
    protected getByIndex(index: number): any
    protected deleteByIndex(index: number): void
    private tryEncodeTypeId
    private getSchemaType
    private createTypeInstance
    private _triggerAllFillChanges
    private _triggerChanges
}

export interface SchemaDecoderCallbacks {
    onAdd?: (item: any, key: any) => void
    onRemove?: (item: any, key: any) => void
    onChange?: (item: any, key: any) => void
    clone(decoding?: boolean): SchemaDecoderCallbacks
    clear(decoding?: boolean): any
}

export interface ArraySchema<V> extends Array<V>, SchemaDecoderCallbacks {
    [n: number]: V | undefined
    onAdd?: (item: V, key: number) => void
    onRemove?: (item: V, key: number) => void
    onChange?: (item: V, key: number) => void
}
export interface ITicTacToeStae {
    board: ArraySchema<number>
    activePlayer: number
    onChange?: any
    winningPlayer: number
}

