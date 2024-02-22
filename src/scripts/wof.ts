import {TILE_DIMENSION} from "./constants/displayConstants";
import Tile from "./gameObjects/tile";
import TileState from "./gameObjects/states/tileState";
import Guess from "./gameObjects/guess";
import GuessState from "./gameObjects/states/guessState";
import Game from "./gameObjects/game";
import GameState from "./gameObjects/states/gameState";
const json = require("./words.json");

let game: Game

const initializeAllGuesses = () => {
    const guesses = [];
    const alphabetList = alphabet();
    for (let a = 0; a < alphabetList.length; a++) {
        let aGuess = new Guess(a, alphabetList[a], GuessState.FRESH);
        guesses.push(aGuess);
    }
    return guesses;
}

const findUnique = (str) => {
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


const initializeLetterFromPhraseGuesses = (phrase) => {
    phrase = phrase.toUpperCase();
    const unique = findUnique(phrase);
    let guesses = [];
    let paddedGuesses = [];
    for (let u = 0; u < unique.length; u++) {
        let aGuess = new Guess(u, unique[u], GuessState.FRESH);
        guesses.push(aGuess);
    }
    guesses = shuffle(guesses);
    paddedGuesses = padGuesses(guesses);
    return [guesses, paddedGuesses];
}


const padGuesses = (guesses: Guess[]):Guess[] =>{
    const padded: Guess []= [];
    const alphabetList = alphabet();
    const alpha = document.getElementById("alpha");
    const wrap = document.createElement('div');
    wrap.setAttribute("id", "alphawrap");
    const firstRow = document.createElement('div');
    firstRow.classList.add('alphabet-row');
    const secondRow = document.createElement('div');
    secondRow.classList.add('alphabet-row');
    alpha.className = 'alphabet-container hidden';
    let find: Guess;
    for (let a = 0; a < alphabetList.length; a++) {
        find = guesses.find(f=> f.letter === alphabetList[a]);
        if(!find){
            find= new Guess(null, alphabetList[a], GuessState.UNUSED);
        }
        find.updateStyle();
        padded.push(find);
        if(a<13){
            firstRow.appendChild(find.html)
        }else{
            secondRow.appendChild(find.html)
        }
        wrap.appendChild(firstRow);
        wrap.appendChild(secondRow);
    }
    alpha?.appendChild(wrap);
    return padded;
}


const alignMe = (totalColumns: number, columnsToCenter: number): number[] => {
    let pad = totalColumns / 2 - columnsToCenter / 2;
    let tailPad = pad;
    if (pad % 2 !== 0) {
        let remainder = pad - Math.floor(totalColumns / 2 - columnsToCenter / 2);
        pad = Math.floor(totalColumns / 2 - columnsToCenter / 2);
        remainder += tailPad - Math.floor(totalColumns / 2 - columnsToCenter / 2);
        tailPad = Math.floor(totalColumns / 2 - columnsToCenter / 2) + remainder;
    }
    return [pad, columnsToCenter, tailPad];
}

const generateBorders = (padCount: number): string => {
    let padded: string = "";
    let index = padCount;
    while (index > 0) {
        padded += "~";
        index--;
    }
    return padded;
}

const padWords = (words: string[], padCount: number): string[] => {
    let paddedWords: string[] = [];
    const borderRow = generateBorders(padCount);
    for (let i = 0; i < words.length; i++) {
        if (i === 0) {
            paddedWords.push(borderRow);
        }
        let padPlan = alignMe(padCount, words[i].length);
        paddedWords.push(generateBorders(padPlan[0]) + words[i] + generateBorders(padPlan[2]));
        if (i == words.length - 1) {
            paddedWords.push(borderRow);
        }
    }
    return paddedWords;
}

const makeTiles = (words: string[]) => {
    let id = 0;
    const tiles = [];
    const boardElement = document.getElementById("board");
    console.log(boardElement);
    const boardWrap = document.createElement("div");
    boardWrap.setAttribute("id", "boardWrap");
    for (let w = 0; w < words.length; w++) {
        let aDiv = document.createElement("div");
        aDiv.className = "tile-row";
        tiles[w] = [];
        for (let l = 0; l < words[w].length; l++) {
            let aTile: Tile;
            if (words[w][l] !== "~") {
                aTile = new Tile(id, TILE_DIMENSION, TILE_DIMENSION, l + 1, w + 1, words[w][l], TileState.GUESSABLE);
            } else {
                aTile = new Tile(id, TILE_DIMENSION, TILE_DIMENSION, l + 1, w + 1, " ", TileState.BORDER);
            }
            aTile.updateStyle();
            tiles[w].push(aTile);
            aDiv.appendChild(aTile.html);
            id++;
        }
        boardWrap.appendChild(aDiv);
    }
    boardElement?.appendChild(boardWrap);
    return tiles;
}

const alphabet = () => {
    const alpha = Array.from(Array(26)).map((e, i) => i + 65);
    return alpha.map((x) => String.fromCharCode(x));
}

const buildGame = (phrase, onlyPhraseLetters, allowedTries) => {
    let words = phrase.toUpperCase().split(" ");
    let longest_word_length = 0;
    let longest_word = "";
    words.reduce((accumulator, currentValue) => {
        if (currentValue.length > longest_word_length) {
            longest_word_length = currentValue.length;
            longest_word = currentValue;
        }
    }, longest_word);
    words = padWords(words, longest_word_length + 2);
    let tiles = makeTiles(words);
    let guesses;
    let paddedGuesses;
    if(onlyPhraseLetters){
        [guesses, paddedGuesses] = initializeLetterFromPhraseGuesses(phrase);
        return new Game(GameState.FRESH, tiles, guesses, paddedGuesses, allowedTries);
    }else{
        guesses = initializeAllGuesses();
        return new Game(GameState.FRESH, tiles, guesses, [], allowedTries);
    }
}

const introScreen = () => { //start the whole game with the intro screen
    const intro = document.createElement('div');
    intro.className = 'introScreen ';
    document.body.appendChild(intro);
    //create a container for the button to be placed
    const startContainer = document.createElement('div');
    startContainer.className = 'start-container';
    intro.appendChild(startContainer); //append to intro screen
    //create the start button inside the start container
    const newInp = document.createElement('button');
    newInp.type = "button";
    newInp.className = "btn-start";
    newInp.textContent = "START";
    startContainer.appendChild(newInp);
    startContainer.addEventListener('click', () => {
        intro.classList.add('hidden');
        const mainContainer = document.getElementsByClassName('container hidden')[0];
        mainContainer.classList.remove('hidden');
    //
    });
};

const resetRound = () => {
    const getNext = document.querySelector('#next'); //get the next button
    getNext?.addEventListener('click', () => {
       // toggleActiveClass('next');
        if (round < phrase.length - 1) { // noted
           // prompt("next button pushed");
            const getBoardWrap:any = document.getElementById("boardWrap");
            const getAlpha:any = document.getElementById("alphawrap");
            while (getBoardWrap?.hasChildNodes()) { //remove old board
                getBoardWrap.removeChild(getBoardWrap.firstChild);
            }
            while (getAlpha?.hasChildNodes()) { //remove old board
                getAlpha.removeChild(getAlpha.firstChild);
            }
            while (getAlpha?.hasChildNodes()) { //remove old board
                getAlpha.removeChild(getAlpha.firstChild);
            }
            document.getElementById("boardWrap")?.remove();
            document.getElementById("alphawrap")?.remove();
            round ++;
            console.log(round, " check round");
            game = buildGame(phrase[round], true, 200);
            const alpha = document.getElementsByClassName('alphabet-container hidden')[0];
            alpha.classList.remove('hidden');
        } else { //call end screen function
            //hide main container
            const cont = document.getElementsByClassName('container')[0];
            cont.classList.add('hidden');
            showEnd(); //call the end screen prompt
        }
    });
} //end reset round
const endScreen = () => { //creating the outro screen to look redwoody
    //add a div to the container with class
    const outro = document.createElement('div');
    outro.className = 'outroScreen hidden';
    document.body.appendChild(outro);
    //create a container for the button to be placed
    const outroContainer = document.createElement('div');
    outroContainer.className = 'outro-container';
    outro.appendChild(outroContainer);
}

function showEnd() { //function to show the outroscreen
    const getEnd = document.getElementsByClassName('outroScreen hidden')[0];
    var myDiv = document.getElementsByClassName('outro-container')[0];
    var h1 = document.createElement('h1');
    h1.textContent = "Thank you for playing";
    getEnd.appendChild(myDiv); //append to intro screen
    myDiv.appendChild(h1);
    getEnd.classList.remove('hidden');
}

/*const playStartMusic = () => {
    var music = new Audio('guessing letters.mp3');
    music.play();
  }
  */
const startbttn = () => { //build the start round button trigger this before nextRound() which builds the nextround button
    const gameButtons = document.createElement('div');
    gameButtons.className = 'game-buttons';
    const getContainer = document.querySelector('#controls');
    getContainer?.appendChild(gameButtons);
    const getGameButton = document.querySelector('.game-buttons');
    const round = document.createElement('button');
    round.type = "button";
    round.textContent = "START ROUND";
    round.id = "start-round"
    getGameButton?.append(round);

    document.getElementById('start-round')?.addEventListener('click', () => {
        //toggleActiveClass('start-round');
        //call the music
        //playStartMusic();
        game.autoGuesser();

    }); //end eventListner
}

const nextRound = () => { //build the next round button
    const nxtround = document.createElement('button');
    nxtround.type = "button";
    nxtround.id = "next";
    nxtround.textContent = "NEXT ROUND";
    const getGameButtons = document.querySelector('.game-buttons');
    getGameButtons?.appendChild(nxtround);
};

const fastRound = () => {
    //make button that is an icon button 
    const fast = document.createElement('button');
    fast.type = "button";
    fast.id = "fast";
    fast.className = ".oj-fwk-icon-checkbox-mixed:before";
   // fast.textContent = "finish"; //no text i want to show an icon instead 
    const getGameButtons = document.querySelector('.game-buttons');
    getGameButtons?.appendChild(fast);
}


//const phrase = ["Large Language Models","Prompt Engineering", "Data Leaking", "Hallucination"];
const phrase = json.words;
let round = 0;
//const phrase = allWords;



document.addEventListener("DOMContentLoaded", (event) => {

    game = buildGame(phrase[round], true, 200); // playing the first round
    const alpha = document.getElementsByClassName('alphabet-container hidden')[0];
    alpha.classList.remove('hidden');
    introScreen(); //1st is intro screen
    endScreen();
    document.querySelector('.btn-start')?.addEventListener('click', function() {
        startbttn(); //load start round button
        nextRound(); //load the next round button
        resetRound();
        fastRound(); //load the quick round button 
        //finishRound();
    });
});
