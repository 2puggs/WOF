import TileState from "./states/tileState";

export default class Tile {
    id: number
    height: number
    width: number
    row: number
    column: number
    letter: string
    state: TileState
    html: HTMLElement;
    constructor(id:number, height: number, width: number, row: number, column: number, letter: string, state: TileState){
        this.id = id;
        this.height = height;
        this.width = width;
        this.row = row;
        this.column = column;
        this.letter = letter;
        this.state = state;
    }
    changeState(updateState){
        this.state = updateState;
    }
}
