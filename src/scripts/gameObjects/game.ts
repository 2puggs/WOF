import GameState from "./states/gameState";
import Tile from "./tile";
import TileState from "./states/tileState";
import Guess from "./guess";
import GuessState from "./states/guessState";
import {Howl, Howler} from 'howler';
const gameConfig = require("../words.json");

const loseSoundmp3 = require("../../sounds/buzzer.mp3");
const correctSoundmp3 = require("../../sounds/correctGuess.mp3");
const revealSoundmp3 = require("../../sounds/letterReveal.mp3");
let flag = false;
// Import all sounds here


export default class Game {
    state: GameState
    tiles: Tile[][]
    guesses: Guess[]
    paddedGuesses: Guess[]
    allowedTries: number
    currentGuesses: number
    autoGuessCounter: number
    interval: any
    loseSound: Howl
    guessCorrect: Howl
    revealedSound: Howl

    constructor(state:GameState, tiles:Tile[][], guesses: Guess[], paddedGuesses: Guess[], allowedTries:number) {
        this.state = state;
        this.tiles = tiles;
        this.guesses = guesses;
        this.paddedGuesses = paddedGuesses;
        this.allowedTries = allowedTries;
        this.currentGuesses = 0;
        this.autoGuessCounter = 0;
        this.interval = {};
        this.loseSound = new Howl({
            src: [loseSoundmp3],
            format: ['mp3']
        });
        this.guessCorrect = new Howl({
            src: [correctSoundmp3],
            format: ['mp3']
        });
        this.revealedSound = new Howl({
            src: [revealSoundmp3],
            format: ['mp3']
        });
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
            if (flag === false) {
                console.log("Didn't guess before time ran out");
                this.stopAutoGuesser();
                this.loseSound.play(); //the buzz noise
            } else {

            }
        }else{
            //console.log("Check for lose"); 
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
                        this.revealedSound.play();
                    }
                }
            }
            this.currentGuesses++;
            this.updateGameState();
        }

    }

    autoGuess(t: this) {
        document.getElementById('fast')?.addEventListener("click", function() {
            for (let i =0; i< t.guesses.length; i++ ) {
                flag = true;
                //console.log("gussed correctly"); //go through all unique guesses and change their states and html respectively 
                t.guesses[i].changeState(GuessState.GUESSED);
                t.makeGuess(i);
                //this.guessCorrect.play();
            } 
        });  
       //play the reveal letter sound 
       // console.log("what is t? ", t);
        //console.log("Auto Guess", t.guesses[t.autoGuessCounter]);
        //console.log("t guess" , t.guesses); // this has all info about the states
        if(t.autoGuessCounter < t.guesses.length){
            t.makeGuess(t.autoGuessCounter);
            t.autoGuessCounter++;
        }else{
            t.stopAutoGuesser();
        }
    } //close autoGuess
    autoGuesser(){
        this.interval = setInterval(this.autoGuess, gameConfig.timing, this);
    }
    stopAutoGuesser(){
        clearInterval(this.interval)
    }

    
}
