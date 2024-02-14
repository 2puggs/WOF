import GameState from "./states/gameState";
import Tile from "./tile";
import TileState from "./states/tileState";
import Guess from "./guess";
import GuessState from "./states/guessState";

export default class Game {
    state: GameState
    tiles: Tile[][]
    guesses: Guess[]
    paddedGuesses: Guess[]
    allowedTries: number
    currentGuesses: number
    autoGuessCounter: number
    interval: any

    constructor(state:GameState, tiles:Tile[][], guesses: Guess[], paddedGuesses: Guess[], allowedTries:number) {
        this.state = state;
        this.tiles = tiles;
        this.guesses = guesses;
        this.paddedGuesses = paddedGuesses;
        this.allowedTries = allowedTries;
        this.currentGuesses = 0;
        this.autoGuessCounter = 0;
        this.interval = {};
    }

    updateGameState(){
        let allDone = true;
        for(let t=0; t<this.tiles.length; t++) {
            for (let l = 0; l < this.tiles[t].length; l++) {
                if(this.tiles[t][l].state === TileState.GUESSABLE){
                    allDone = false;
                   break;
                }
            }
        }
        if(allDone){
            this.state = GameState.WON;
            console.log("You win");
            this.stopAutoGuesser();
        }else{
            console.log("Check for lose");
            if(this.currentGuesses >= this.allowedTries){
                console.log("Sorry you lose.");
                this.state = GameState.LOST;
                this.stopAutoGuesser();
            }
        }
    }

    makeGuess(guessId){
        if(this.state === GameState.FRESH){
            this.state = GameState.IN_PLAY;
        }
        if(this.state === GameState.IN_PLAY){
            if( this.guesses[guessId].state !== GuessState.UNUSED){
                this.guesses[guessId].changeState(GuessState.GUESSED);
            }
            for(let t=0; t<this.tiles.length; t++) {
                for (let l = 0; l < this.tiles[t].length; l++) {
                    if (this.tiles[t][l].letter === this.guesses[guessId].letter) {
                        this.tiles[t][l].changeState(TileState.GUESSED);
                    }
                }
            }
            this.currentGuesses++;
            this.updateGameState();
        }

    }

    logBoard(){
        let aRow = "";
        for(let r=0; r<this.tiles.length; r++){
            aRow += "===";
            for(let c=0; c<this.tiles[r].length; c++){
                switch (this.tiles[r][c].state){
                    case TileState.GUESSABLE:
                        aRow += "[-]";
                        break;
                    case TileState.GUESSED:
                        aRow += "[" + this.tiles[r][c].letter + "]";
                        break;
                    default:
                        aRow +="[X]";
                }
            }
            aRow +="===\n";
        }
        console.log(aRow);
        console.log("Guesses:");
        let aGuess="";
        for(let g=0; g<this.guesses.length; g++){
            switch (this.guesses[g].state){
                case GuessState.FRESH:
                    aGuess += "["+this.guesses[g].letter+"]";
                    break;
                default:
                    aGuess += "X"+this.guesses[g].letter+"X";
            }
        }
        console.log(aGuess);
    }
    autoGuess(t: this){
        console.log("what is t? ", t);
        console.log("Auto Guess", t.guesses[t.autoGuessCounter]);
        console.log("t guess" , t.guesses);
        if(t.autoGuessCounter < t.guesses.length){
            t.makeGuess(t.autoGuessCounter)
            t.autoGuessCounter++;
        }else{
            t.stopAutoGuesser();
        }
    }
    autoGuesser(){
        this.interval = setInterval(this.autoGuess, 2000, this);
    }
    stopAutoGuesser(){
        clearInterval(this.interval)
    }
}
