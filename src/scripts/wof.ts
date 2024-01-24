import {TILE_DIMENSION} from "./constants/displayConstants";
import Tile from "./gameObjects/tile";
import TileState from "./gameObjects/states/tileState";
import Guess from "./gameObjects/guess";
import GuessState from "./gameObjects/states/guessState";
import Game from "./gameObjects/game";
import GameState from "./gameObjects/states/gameState";


const initializeAllGuesses = () => {
    const guesses = [];
    const alphabetList = alphabet();
    for(let a=0; a<alphabetList.length; a++){
        let aGuess = new Guess(a, alphabetList[a], GuessState.FRESH);
        guesses.push(aGuess);
    }
    return guesses;
}

const findUnique = (str)=> {
    let uniq = "";
    for (let i = 0; i < str.length; i++) {
        if (uniq.includes(str[i]) === false && str[i] !== ' ') {
            uniq += str[i]
        }
    }
    return uniq;
}

const shuffle = (array: Array<any>) => {
    let currentIndex: number = array.length;
    let temporaryValue: any, randomIndex: number;
    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}


const initializeLetterFromPhraseGuesses =(phrase) => {
    phrase = phrase.toUpperCase();
    const unique = findUnique(phrase);
    let guesses = [];
    for(let u=0; u<unique.length; u++){
        let aGuess = new Guess(u, unique[u], GuessState.FRESH);
        guesses.push(aGuess);
    }
    guesses = shuffle(guesses);
    return guesses;
}

const fillerUp = (numTiles: number, word: string ):Tile[] => {
    const tileGroup: Tile[] = [];
    return tileGroup;

}

const makeTiles = (words) => {
    let id = 0;
    const tiles = [];
    const boardElement = document.getElementById("board");
    for(let w =0; w<words.length; w++){
        // switch (w) {
        //     case 0:
        //     add a full row of blanks
        //     case w === words[w].length - 1:
        //     add a full row of blanks on last row
        //     default:
        //      fillerUp
        // }
        let aDiv = document.createElement("div");
        aDiv.className = "tile-row";
        tiles[w]=[];
        for(let l=0; l<words[w].length; l++){
            let aTile = new Tile(id, TILE_DIMENSION, TILE_DIMENSION, l, w, words[w][l], TileState.GUESSABLE);
            aTile.updateStyle();
            tiles[w].push(aTile);
            aDiv.appendChild(aTile.html);
            id++;
        }
        boardElement.appendChild(aDiv);
    }
    return tiles;
}

const alphabet =()=>{
    const alpha = Array.from(Array(26)).map((e, i) => i + 65);
    return alpha.map((x) => String.fromCharCode(x));
}

const buildGame = (phrase, onlyPhraseLetters, allowedTries) => {
    const words = phrase.toUpperCase().split(" ");
    let longest_word_length = 0;
    let longest_word = "";
    words.reduce((accumulator,currentValue) => {
        if(currentValue.length > longest_word_length){
            longest_word_length = currentValue.length;
            longest_word = currentValue;
        }
    }, longest_word);

    let tiles = makeTiles(words);

    const guesses = onlyPhraseLetters ? initializeLetterFromPhraseGuesses(phrase) : initializeAllGuesses();
    return new Game(GameState.FRESH, tiles, guesses, allowedTries);
}


document.addEventListener("DOMContentLoaded", (event) => {
    let game:Game = buildGame("Artificial Intelligence is not General yet", true, 200);
    game.autoGuesser();
});


