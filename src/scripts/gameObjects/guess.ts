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
        this.html = document.createElement("div")
        this.html.textContent = this.letter;
    }
    changeState(updateState){
        this.state = updateState;
        switch(this.state){
        }
    }
    updateStyle() {
        let style = "letter";
        switch (this.state) {
            case GuessState.FRESH:
                style += " visible";
                break;
            case GuessState.GUESSED:
                style += " hidden";
                break;
            default:
                console.log("unknown tile state");
        }
        this.html.className = style;
        console.log("style is ", this.html.className);
    }
}
