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

    constructor(id: number, height: number, width: number, row: number, column: number, letter: string, state: TileState) {
        this.id = id;
        this.height = height;
        this.width = width;
        this.row = row;
        this.column = column;
        this.letter = letter;
        this.state = state;
        this.html = document.createElement("div");
        this.html.dataset.tile = id === null ? "blank" : id.toString();
        this.html.textContent = this.letter;
    }
    changeState(updateState) {
        this.state = updateState;
        this.updateStyle();
    }
    updateStyle() {
        let style = "tile";
        switch (this.state) {
            case TileState.GUESSED:
                style += " revealed";
                break;
            case TileState.GUESSABLE:
                style += " back";
                break;
            case TileState.BORDER:
                style += " edge";
                break;
            case TileState.BLANK:
                style += " blank";
                break;
            default:
                console.log("unknown tile state");
        }
        this.html.className = style;
    }
}
