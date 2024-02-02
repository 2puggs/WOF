import GuessState from "./states/guessState";

export default class Guess {
    id: number
    letter: string
    state: GuessState
    html: HTMLElement;

    constructor(id:number, letter:string, state:GuessState) {
        this.id = id;
        this.letter = letter;
        this.state = state;
        this.html = document.createElement("div");
        this.html.dataset.guess = id === null ? "blank" : id.toString();
        this.html.textContent = this.letter;
    }
    changeState(updateState) {
        this.state = updateState;
        this.updateStyle();
    }
    updateStyle() {
        let style = "guess";
        switch (this.state) {
            case GuessState.FRESH:
                style += " fresh";
                break;
            case GuessState.GUESSED:
                style += " guessed";
                break;
            case GuessState.UNUSED:
                style += " fresh";
                break;
            default:
                console.log("unknown tile state");
        }
        this.html.className = style;
    }
}
