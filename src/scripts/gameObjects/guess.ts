import GuessState from "./states/guessState";

export default class Guess {
    id: number
    letter: string
    state: GuessState

    constructor(id:number, letter:string, state:GuessState) {
        this.id = id;
        this.letter = letter;
        this.state = state;
    }
    changeState(updateState){
        this.state = updateState;
        switch(this.state){
        }
    }
}
