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

const alignMe = (totalColumns: number, columnsToCenter: number): number[] =>{
    let pad = totalColumns/2-columnsToCenter/2;
    let tailPad = pad;
    if(pad%2 !== 0){
        let remainder = pad - Math.floor(totalColumns/2-columnsToCenter/2);
        pad =  Math.floor(totalColumns/2-columnsToCenter/2);
        remainder += tailPad - Math.floor(totalColumns/2-columnsToCenter/2);
        tailPad = Math.floor(totalColumns/2-columnsToCenter/2) + remainder;
    }
    return [pad, columnsToCenter, tailPad];
}

const generateBorders = ( padCount: number): string => {
    let padded: string = "";
    let index = padCount;
    while (index>0){
        padded +="~";
        index--;
    }
    return padded;
}


const padWords = (words: string[], padCount: number): string[] =>{
    let paddedWords: string[] = [];
    const borderRow = generateBorders(padCount);
    for(let i=0; i<words.length; i++){
        if(i===0){
            paddedWords.push(borderRow);
        }
        let padPlan = alignMe(padCount, words[i].length);
        paddedWords.push(generateBorders(padPlan[0]) + words[i] + generateBorders(padPlan[2]));
        if(i==words.length-1){
            paddedWords.push(borderRow);
        }
    }
    return paddedWords;
}

const makeTiles = (words: string[]) => {
    let id = 0;
    const tiles = [];
    const boardElement = document.getElementById("board");
    for(let w =0; w<words.length; w++){
        let aDiv = document.createElement("div");
        aDiv.className = "tile-row";
        tiles[w]=[];
        for(let l=0; l<words[w].length; l++){
            let aTile: Tile;
            if(words[w][l] !== "~"){
                aTile = new Tile(id, TILE_DIMENSION, TILE_DIMENSION, l+1, w+1, words[w][l], TileState.GUESSABLE);
            }else{
                aTile = new Tile(id, TILE_DIMENSION, TILE_DIMENSION, l+1, w+1, " ", TileState.BORDER);
            }
            aTile.updateStyle();
            tiles[w].push(aTile);
            aDiv.appendChild(aTile.html);
            id++;
        }
        boardElement.appendChild(aDiv);
    }
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
    words.reduce((accumulator,currentValue) => {
        if(currentValue.length > longest_word_length){
            longest_word_length = currentValue.length;
            longest_word = currentValue;
        }
    }, longest_word);
    words = padWords(words, longest_word_length+2);
    let tiles = makeTiles(words);
    const guesses = onlyPhraseLetters ? initializeLetterFromPhraseGuesses(phrase) : initializeAllGuesses();
    return new Game(GameState.FRESH, tiles, guesses, allowedTries);
}
document.addEventListener("DOMContentLoaded", (event) => {
    let game:Game = buildGame("Large Language Models", true, 200);
    game.autoGuesser();
    bttnStart();
    displayAlphabet();
});
//
const bttnStart = () => { //do i need to separate into classes since i'm creating div, start button, and switching screens? 
    //append introScreen 
    const intro= document.createElement('div');
    intro.className = 'introScreen ';
    document.body.appendChild(intro);

    //create a container for the button to be placed
    const startContainer= document.createElement('div');
    startContainer.className = 'start-container';
    intro.appendChild(startContainer); //append to intro screen 
    //create the start button inside the start container 
    const newInp = document.createElement('button');
    newInp.type = "button";
    newInp.className = "btn-start";
    newInp.textContent = "START";
    startContainer.appendChild(newInp);
    
    const alpha = document.getElementsByClassName('alphabet-container hidden');
   /* const gameScreen = document.createElement('div');
    gameScreen.className = 'gameScreen hidden';
    document.body.appendChild(gameScreen);

    const mainContainer = document.createElement('div');    
    mainContainer.className = 'container hidden'; 
    gameScreen.appendChild(mainContainer);

    const boardContainer = document.createElement('div');
    boardContainer.id = 'board';
    gameScreen.appendChild(boardContainer)
    */
//trying to add the functionality here when the button is clicked then the main game will be revealed
    
startContainer.addEventListener('click', () => {
        intro.classList.add('hidden');
        const mainContainer = document.getElementsByClassName('container hidden')[0];
        mainContainer.classList.remove('hidden');

        const alpha = document.getElementsByClassName('alphabet-container hidden')[0];
        alpha.classList.remove('hidden');        

        //gameScreen.classList.remove('hidden');
       
        //startContainer.classList.add('hidden');
    });

        //check if button clicked 
  //  newInp.onclick = function() {
      //  alert("button was clicked");
    //}
   // console.log("button clicked");
  }; //end start game 
//
const displayAlphabet = () => {
    let symbols = alphabet();
    const container = document.createElement('div');
    container.className = 'alphabet-container hidden';

    const firstHalf = symbols.slice(0,13);
    const secondHalf = symbols.slice(13);

    //create first row in html 
    const firstRow = document.createElement('div');
    firstRow.classList.add('alphabet-row');
    firstHalf.forEach((letter) => {
        const div = document.createElement('div');
        div.textContent = letter;
        firstRow.appendChild(div);
    });
    
    const secondRow = document.createElement('div');
    secondRow.classList.add('alphabet-row');
    secondHalf.forEach((letter) => {
        const div = document.createElement('div');
        div.textContent = letter;
        secondRow.appendChild(div);
    });
    console.log(firstRow);

    container.appendChild(firstRow);
    container.appendChild(secondRow);

    document.body.appendChild(container);

    
}; //close displayAlphabet


