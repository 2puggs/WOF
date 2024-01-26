TILE_DIMENSION = 100; // Square

const TileStates = {
    GUESSED: 1,
    GUESSABLE: 2,
    BORDER: 3,
}

class Tile {
    constructor(id, height, width, column, row, letter, state){
        this.id = id;
        this.height = height;
        this.width = width;
        this.column = column;
        this.row = row;
        this.letter = letter;
        this.state = state;
        this.html = document.createElement("div");
        this.html.className = TileStateToCSS(state); //replacing class name with the updated state call
        this.html.dataset.tile = this.id;
        this.html.textContent = this.letter;
    }
    changeState(updateState){
        this.state = updateState;
        switch (this.state) {

        }
        /*console.log("in update state of the tile"); this will get u the letters in each div
        let temp = document.querySelectorAll('.tile');
        temp.forEach((cur) => {
            console.log(this.tile.textContent);
        })
        */
        let tempArry = [];
        const temp = document.querySelectorAll('.tile');
        temp.forEach((tile) => {
            if (this.html.dataset.tile == this.id) { //this wont change bc dataset.tile is a string but this.id is an integer so fix that
                this.html.className = ''; //remove class name from the temp array but not from the actual html div
                this.html.className = TileStateToCSS(this.state);
            }//close if
            //const tileVal = tile.dataset.tile;
            //tempArry.push(tileVal);
        }); //close change state
        //console.log(tempArry);

       /* for (let p=0; p<tempArry.length; p++) {
            if (this.html.dataset.tile == this.id) { //this wont change bc dataset.tile is a string but this.id is an integer so fix that
                this.html.className = ''; //remove class name from the temp array but not from the actual html div
                tethis.html.className = TileStateToCSS(this.state);
            }

        }*/ // close for
    }//close change state


}//close tile class
        /*temp.forEach((cur) => {
            //let ele =
            //const tempTileVal = temp.dataset.tile
            if (this.html.dataset.tile === this.id) {
                temp.className= ''; //remove current class
                //temp.classList.remove('revealed','', 'edge');
                temp.className = TileStateToCSS(this.state);
            }
        });
        */
        /*let var = contains div of tile id;
        for each divs in div {
            when div val of this.tile id:
                let element = div val
                remove current class
                add the div class back -> stateToCSS
        }
        */   //iterate over DOM to match calls the check
            // do stuff such as animation etc.



    //make a constructor that makes each tile into html

const GameStates = {
    FRESH: 1,
    IN_PLAY:2,
    LOST: 3,
    WON: 4
}

class Board {

    constructor(state, tiles, guessTokens, allowedTries) {
        this.state = state;
        this.tiles = tiles;
        this.guessTokens = guessTokens;
        this.allowedTries = allowedTries;
        this.currentGuesses = 0;

    }

    updateGameState(){
        console.log("*** Checking if word revealed ***");
        let allDone = true;

        for(let t=0; t<this.tiles.length; t++) {
            for (let l = 0; l < this.tiles[t].length; l++) {
                if(this.tiles[t][l].state === TileStates.GUESSABLE){
                    allDone = false;
                   break;
                }
            }
        }
        if(allDone){
            this.state = GameStates.WON;
            console.log("You win");
        }else{
            //console.log("Check for lose");
            if(this.currentGuesses >= this.allowedTries){
                console.log("Sorry you lose.");
                this.state = GameStates.LOST;
            }
        }
    }

    makeGuess(guessId){
        console.log("makeGuess function");
        console.log(guessId);
        if(this.state === GameStates.FRESH){
            this.state = GameStates.IN_PLAY;
        }
        if(this.state === GameStates.IN_PLAY){
            this.guessTokens[guessId].changeState(GuessTokenStates.GUESSED);
            for(let t=0; t<this.tiles.length; t++) {
                for (let l = 0; l < this.tiles[t].length; l++) {
                    if (this.tiles[t][l].letter === this.guessTokens[guessId].letter) {
                        this.tiles[t][l].changeState(TileStates.GUESSED);
                    }
                }
            }
            this.currentGuesses++;
            this.updateGameState();
        }

    }

    logBoard(){
        let aRow = "";
        let max = 0;
        console.log("in logBoard function");
        // i wnt to make a row the same length as the longest word in the board?
        const borderLen = this.tiles.reduce((max,subArray) => Math.max(max, subArray.length), 0);
        const border = "++ ".repeat(borderLen).trim();
        aRow+= border + "\n";

        for(let r=0; r<this.tiles.length; r++){

            aRow += "===";
            for(let c=0; c<this.tiles[r].length; c++){
               // console.log(this.tiles[r]);
                switch (this.tiles[r][c].state){

                    case TileStates.GUESSABLE:
                        aRow += "[-]";
                        break;
                    case TileStates.GUESSED:
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
       /*const containerElement = document.querySelector('.container');
        const wordBankDiv = document.createElement('div');
        wordBankDiv.className = "word-bank";
        containerElement.appendChild(wordBankDiv);
        */
        let guessArray="";
        for(let g=0; g<this.guessTokens.length; g++){
            switch (this.guessTokens[g].state){
                case GuessTokenStates.FRESH:
                    guessArray += "["+this.guessTokens[g].letter+"]";
                    break;
                default:
                    guessArray += " X ";
            }
        }
        console.log(guessArray);
    }
} //close board

const GuessTokenStates = {
    FRESH: 1,
    GUESSED: 2
}

class Guess {
    constructor(id, letter, state) {
        this.id = id; // id could be like <div class="guess guess-state" data-guessId="1"></>
        this.letter = letter;
        this.state = state;
    }
    changeState(updateState){
        this.state = updateState;
        switch(this.state){
            // do stuff such as animation etc. show this flip tile
        }
    }
}

function initializeAllGuesses(){
    const guesses = [];
    const alphabetList = alphabet();
    for(let a=0; a<alphabetList.length; a++){
        let guessArray = new Guess(a, alphabetList[a], GuessTokenStates.FRESH);
        guesses.push(guessArray);
    }
    console.log("initializing board");
    return guesses;
}

function findUnique(str) {
    let uniq = "";
    for (let i = 0; i < str.length; i++) {
        if (str[i] !== " ") {
            if (uniq.includes(str[i]) === false) {
                uniq += str[i]
            }
        }
    }
    return uniq;
}
 /*
function pickUniq(word) {
    const myPick = findUnique(word);
    const letterToNumberMapping = {
        "A": 0,
        "B": 1,
        "C":2,
        "D": 3,
        "E": 4,
        "F": 5,
        "G":6 ,
        "H":7,
        "I":8 ,
        "J": 9,
        "K": 10,
        "L": 11,
        "M": 12,
        "N": 13,
        "O": 14,
        "P": 15,
        "Q": 16,
        "R": 17,
        "S": 18,
        "T": 19,
        "U": 20,
        "V": 21,
        "W": 22,
        "X": 23,
        "Y": 24,
        "Z ": 25,

    }
    //console.log("my shuffled word is " + myPick);
    for (let s = 0; s <myPick.length;s++) {
        if (myPick[s] in letterToNumberMapping) {
           console.log(letterToNumberMapping[myPick[s]]);
        }
            //need to map back the leters to the alphabet
        //game.makeGuess(myPick[s]);
        //game.logBoard();
        //console.log(game.myPick[mapped letter to number]);
    }
    //console.log("GAME WON");
   // return myPick
}
let won;
function isDone() {
    if (won) {
    won = setInterval(pickUniq, 5000);
    }
}
implement this
function timedFlip(wrd) { //function to reveal the word every 8 seconds
    delay = setInterval(flashText, 1000);
    const unique = findUnique(phrase);

}
*/
function initializeLetterFromPhraseGuesses(phrase){
    //const unique = findUnique(phrase);
    const wordFlip = pickUniq(phrase);
    const guesses = [];
    const alphabetList = alphabet();
    for(let a=0; a<alphabetList.length; a++){
        let guessArray = new Guess(a, alphabetList[a], GuessTokenStates.FRESH);
        guesses.push(guessArray);
    }
    return guesses;
    /*for(let u=0; u<unique.length; u++){
        let guessArray = new Guess(u, unique[u], GuessTokenStates.FRESH);
        guesses.push(guessArray);
    }
    return guesses;
    */
}

function makeTiles(words, columns){
    let id = 0;
    const tiles = [];
    const tileId = this.id;
    //console.log("getting id- " + tileId);
    //let element = document.getElementById("board");
    const boardElement = document.getElementById("board");
    for(let w =0; w<words.length; w++){
        tiles[w]=[];
        for(let l=0; l<words[w].length; l++){
            if (words[w][l] === " "){
                console.log("BLANK");
            }
            let aTile = new Tile(id, TILE_DIMENSION, TILE_DIMENSION, l, w, words[w][l], TileStates.GUESSABLE);
            tiles[w].push(aTile);
            //console.log(aTile);
            //console.log(this.divElement); this doesn't work
            boardElement.appendChild(aTile.html);
            id++; // id could be like <div class="tile tile-state" data-tileId="1"></>
        }
    }

   // console.log(tiles[0][0].state);
    return tiles;
}

function alphabet(){
    const alpha = Array.from(Array(26)).map((e, i) => i + 65);
    return alpha.map((x) => String.fromCharCode(x));
}

function buildGame(phrase, onlyPhraseLetters, allowedTries){
    const words = phrase.toUpperCase().split(" ");
    let longest_word_length = 0;
    let longest_word = "";
    words.reduce((accumulator,currentValue) => {
        if(currentValue.length > longest_word_length){
            longest_word_length = currentValue.length;
            longest_word = currentValue;
        }
    }, longest_word);
    let tiles = makeTiles(words, longest_word_length);
    const guesses = onlyPhraseLetters ? initializeLetterFromPhraseGuesses(phrase) : initializeAllGuesses();
    return new Board(GameStates.FRESH, tiles, guesses);
}
let sentence= "CHAT GPT";
let game = buildGame(sentence, false, 5); //false = onlyPhraseLetters
//const delay = (ms) => new Promise( resolve => setTimeout(resolve,ms));
const letterToNumberMapping = {
    "A": 0,
    "B": 1,
    "C":2,
    "D": 3,
    "E": 4,
    "F": 5,
    "G":6 ,
    "H":7,
    "I":8 ,
    "J": 9,
    "K": 10,
    "L": 11,
    "M": 12,
    "N": 13,
    "O": 14,
    "P": 15,
    "Q": 16,
    "R": 17,
    "S": 18,
    "T": 19,
    "U": 20,
    "V": 21,
    "W": 22,
    "X": 23,
    "Y": 24,
    "Z ": 25,
    " " : 26
}
let index = 0;
const IntervalId = setInterval(() => {
    let uniq = "";
    for (let i = 0; i < sentence.length; i++) {
        if (sentence[i] !== " ") {
            if (uniq.includes(sentence[i]) === false) {
                uniq += sentence[i]
            } else {
                console.log("BLANKET");
            }
        }

    } //end for

    //iterate through the unique characters to populate the board
    if (index < uniq.length) {

        game.makeGuess(letterToNumberMapping[uniq[index]]);
        console.log("-------------------------- ");
        console.log("Flipped word is: " + uniq[index] );
        console.log("-------------------------- ");
        game.logBoard();
        index++;
    } else {
        clearInterval(IntervalId);
    }
},3500);
game.logBoard(); // returns empty board

document.addEventListener('DOMContentLoaded', doSomething, false);

function doSomething () {
    console.log("i'm ALIVe");
    const wordBankDiv = document.createElement('div');
    wordBankDiv.className = "word-bank";
    const containerElement = document.querySelector('.container');
    const containerBoard = document.querySelector('.word-bank');
    containerElement.appendChild(wordBankDiv);
   // const wordBank = document.querySelector('.word-bank');
    //const wordBankDiv = document.createElement('div');
    for (const l in letterToNumberMapping) {
        if (letterToNumberMapping.hasOwnProperty(l)) {
            const squares = document.createElement('div');
            squares.className = "squares";
            squares.textContent = l;
            containerBoard.appendChild(squares);
        }
    }
}

function TileStateToCSS(state) { //make the switch func here
    let style = "tile";
    switch (state) {
        case TileStates.GUESSED:
            style += " revealed";
            break;
        case TileStates.GUESSABLE:
            style += " back";
            break;
        case TileStates.BORDER: // we don't have this assignment yet
            style += " edge";
            break;
        default:
            console.log("unknown tile state");
    }
    return style
}
