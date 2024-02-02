(() => {
  var __defProp = Object.defineProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => {
    __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
    return value;
  };

  // src/scripts/constants/displayConstants.ts
  var TILE_DIMENSION = 100;

  // src/scripts/gameObjects/states/tileState.ts
  var TileState = /* @__PURE__ */ ((TileState2) => {
    TileState2[TileState2["GUESSED"] = 1] = "GUESSED";
    TileState2[TileState2["GUESSABLE"] = 2] = "GUESSABLE";
    TileState2[TileState2["BORDER"] = 3] = "BORDER";
    TileState2[TileState2["ANIMATING"] = 4] = "ANIMATING";
    TileState2[TileState2["BLANK"] = 5] = "BLANK";
    return TileState2;
  })(TileState || {});
  var tileState_default = TileState;

  // src/scripts/gameObjects/tile.ts
  var Tile = class {
    constructor(id, height, width, row, column, letter, state) {
      __publicField(this, "id");
      __publicField(this, "height");
      __publicField(this, "width");
      __publicField(this, "row");
      __publicField(this, "column");
      __publicField(this, "letter");
      __publicField(this, "state");
      __publicField(this, "html");
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
        case tileState_default.GUESSED:
          style += " revealed";
          break;
        case tileState_default.GUESSABLE:
          style += " back";
          break;
        case tileState_default.BORDER:
          style += " edge";
          break;
        case tileState_default.BLANK:
          style += " blank";
          break;
        default:
          console.log("unknown tile state");
      }
      this.html.className = style;
    }
  };

  // src/scripts/gameObjects/states/guessState.ts
  var GuessState = /* @__PURE__ */ ((GuessState2) => {
    GuessState2[GuessState2["FRESH"] = 1] = "FRESH";
    GuessState2[GuessState2["GUESSED"] = 2] = "GUESSED";
    return GuessState2;
  })(GuessState || {});
  var guessState_default = GuessState;

  // src/scripts/gameObjects/guess.ts
  var Guess = class {
    constructor(id, letter, state) {
      __publicField(this, "id");
      __publicField(this, "letter");
      __publicField(this, "state");
      __publicField(this, "html");
      this.id = id;
      this.letter = letter;
      this.state = state;
      this.html = document.createElement("div");
      this.html.textContent = this.letter;
    }
    changeState(updateState) {
      this.state = updateState;
      switch (this.state) {
      }
    }
    updateStyle() {
      let style = "letter";
      switch (this.state) {
        case guessState_default.FRESH:
          style += " visible";
          break;
        case guessState_default.GUESSED:
          style += " hidden";
          break;
        default:
          console.log("unknown tile state");
      }
      this.html.className = style;
      console.log("style is ", this.html.className);
    }
  };

  // src/scripts/gameObjects/states/gameState.ts
  var GameState = /* @__PURE__ */ ((GameState2) => {
    GameState2[GameState2["FRESH"] = 1] = "FRESH";
    GameState2[GameState2["IN_PLAY"] = 2] = "IN_PLAY";
    GameState2[GameState2["LOST"] = 3] = "LOST";
    GameState2[GameState2["WON"] = 4] = "WON";
    return GameState2;
  })(GameState || {});
  var gameState_default = GameState;

  // src/scripts/gameObjects/game.ts
  var Game = class {
    constructor(state, tiles, guesses, allowedTries, wordbankLetter) {
      __publicField(this, "state");
      __publicField(this, "tiles");
      __publicField(this, "guesses");
      __publicField(this, "allowedTries");
      __publicField(this, "currentGuesses");
      __publicField(this, "autoGuessCounter");
      __publicField(this, "interval");
      __publicField(this, "wordbankLetter");
      this.state = state;
      this.tiles = tiles;
      this.guesses = guesses;
      this.allowedTries = allowedTries;
      this.currentGuesses = 0;
      this.autoGuessCounter = 0;
      this.interval = {};
      this.wordbankLetter = wordbankLetter;
    }
    updateGameState() {
      console.log("Check for win");
      let allDone = true;
      for (let t = 0; t < this.tiles.length; t++) {
        for (let l = 0; l < this.tiles[t].length; l++) {
          if (this.tiles[t][l].state === tileState_default.GUESSABLE) {
            allDone = false;
            break;
          }
        }
      }
      if (allDone) {
        this.state = gameState_default.WON;
        console.log("You win");
        this.stopAutoGuesser();
      } else {
        console.log("Check for lose");
        if (this.currentGuesses >= this.allowedTries) {
          console.log("Sorry you lose.");
          this.state = gameState_default.LOST;
          this.stopAutoGuesser();
        }
      }
    }
    makeGuess(guessId) {
      console.log("makeGuess ", guessId);
      if (this.state === gameState_default.FRESH) {
        this.state = gameState_default.IN_PLAY;
      }
      if (this.state === gameState_default.IN_PLAY) {
        this.guesses[guessId].changeState(guessState_default.GUESSED);
        this.guesses[guessId].updateStyle();
        for (let t = 0; t < this.tiles.length; t++) {
          for (let l = 0; l < this.tiles[t].length; l++) {
            if (this.tiles[t][l].letter === this.guesses[guessId].letter) {
              this.tiles[t][l].changeState(tileState_default.GUESSED);
            }
          }
        }
        this.currentGuesses++;
        this.updateGameState();
      }
    }
    /*
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
        */
    autoGuess(t) {
      console.log("what is t? ", t);
      console.log("Auto Guess", t.guesses[t.autoGuessCounter]);
      let guessedLetterPass = t.guesses[t.autoGuessCounter].letter;
      console.log("Guessed Letter is ", t.guesses[t.autoGuessCounter].letter);
      if (t.autoGuessCounter < t.guesses.length) {
        t.makeGuess(t.autoGuessCounter);
        t.autoGuessCounter++;
        return guessedLetterPass;
      } else {
        t.stopAutoGuesser();
      }
    }
    autoGuesser() {
      this.interval = setInterval(this.autoGuess, 1500, this);
    }
    stopAutoGuesser() {
      clearInterval(this.interval);
    }
  };

  // src/scripts/wof.ts
  var initializeAllGuesses = () => {
    const guesses = [];
    const alphabetList = alphabet();
    for (let a = 0; a < alphabetList.length; a++) {
      let aGuess = new Guess(a, alphabetList[a], guessState_default.FRESH);
      guesses.push(aGuess);
    }
    return guesses;
  };
  var findUnique = (str) => {
    let uniq = "";
    for (let i = 0; i < str.length; i++) {
      if (uniq.includes(str[i]) === false && str[i] !== " ") {
        uniq += str[i];
      }
    }
    return uniq;
  };
  var shuffle = (array) => {
    let currentIndex = array.length;
    let temporaryValue, randomIndex;
    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  };
  var initializeLetterFromPhraseGuesses = (phrase) => {
    phrase = phrase.toUpperCase();
    const unique = findUnique(phrase);
    let guesses = [];
    for (let u = 0; u < unique.length; u++) {
      let aGuess = new Guess(u, unique[u], guessState_default.FRESH);
      guesses.push(aGuess);
    }
    guesses = shuffle(guesses);
    return guesses;
  };
  var alignMe = (totalColumns, columnsToCenter) => {
    let pad = totalColumns / 2 - columnsToCenter / 2;
    let tailPad = pad;
    if (pad % 2 !== 0) {
      let remainder = pad - Math.floor(totalColumns / 2 - columnsToCenter / 2);
      pad = Math.floor(totalColumns / 2 - columnsToCenter / 2);
      remainder += tailPad - Math.floor(totalColumns / 2 - columnsToCenter / 2);
      tailPad = Math.floor(totalColumns / 2 - columnsToCenter / 2) + remainder;
    }
    return [pad, columnsToCenter, tailPad];
  };
  var generateBorders = (padCount) => {
    let padded = "";
    let index = padCount;
    while (index > 0) {
      padded += "~";
      index--;
    }
    return padded;
  };
  var padWords = (words, padCount) => {
    let paddedWords = [];
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
  };
  var makeTiles = (words) => {
    let id = 0;
    const tiles = [];
    const boardElement = document.getElementById("board");
    for (let w = 0; w < words.length; w++) {
      let aDiv = document.createElement("div");
      aDiv.className = "tile-row";
      tiles[w] = [];
      for (let l = 0; l < words[w].length; l++) {
        let aTile;
        if (words[w][l] !== "~") {
          aTile = new Tile(id, TILE_DIMENSION, TILE_DIMENSION, l + 1, w + 1, words[w][l], tileState_default.GUESSABLE);
        } else {
          aTile = new Tile(id, TILE_DIMENSION, TILE_DIMENSION, l + 1, w + 1, " ", tileState_default.BORDER);
        }
        aTile.updateStyle();
        tiles[w].push(aTile);
        aDiv.appendChild(aTile.html);
        id++;
      }
      boardElement.appendChild(aDiv);
    }
    return tiles;
  };
  var alphabet = () => {
    const alpha = Array.from(Array(26)).map((e, i) => i + 65);
    return alpha.map((x) => String.fromCharCode(x));
  };
  var buildGame = (phrase, onlyPhraseLetters, allowedTries) => {
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
    const guesses = onlyPhraseLetters ? initializeLetterFromPhraseGuesses(phrase) : initializeAllGuesses();
    return new Game(gameState_default.FRESH, tiles, guesses, allowedTries);
  };
  document.addEventListener("DOMContentLoaded", (event) => {
    let game = buildGame("Large Language Models", true, 200);
    game.autoGuesser();
    bttnStart();
    displayAlphabet();
  });
  var bttnStart = () => {
    const intro = document.createElement("div");
    intro.className = "introScreen ";
    document.body.appendChild(intro);
    const startContainer = document.createElement("div");
    startContainer.className = "start-container";
    intro.appendChild(startContainer);
    const newInp = document.createElement("button");
    newInp.type = "button";
    newInp.className = "btn-start";
    newInp.textContent = "START";
    startContainer.appendChild(newInp);
    const alpha = document.getElementsByClassName("alphabet-container hidden");
    startContainer.addEventListener("click", () => {
      intro.classList.add("hidden");
      const mainContainer = document.getElementsByClassName("container hidden")[0];
      mainContainer.classList.remove("hidden");
      const alpha2 = document.getElementsByClassName("alphabet-container hidden")[0];
      alpha2.classList.remove("hidden");
    });
  };
  var displayAlphabet = () => {
    let symbols = alphabet();
    console.log("symbols are ", symbols);
    const container = document.createElement("div");
    container.className = "alphabet-container hidden";
    const firstHalf = symbols.slice(0, 13);
    const secondHalf = symbols.slice(13);
    const firstRow = document.createElement("div");
    firstRow.classList.add("alphabet-row");
    firstHalf.forEach((letter) => {
      const div = document.createElement("div");
      div.className = "letter";
      div.textContent = letter;
      firstRow.appendChild(div);
    });
    const secondRow = document.createElement("div");
    secondRow.classList.add("alphabet-row");
    secondHalf.forEach((letter) => {
      const div = document.createElement("div");
      div.textContent = letter;
      secondRow.appendChild(div);
    });
    console.log(firstRow);
    container.appendChild(firstRow);
    container.appendChild(secondRow);
    document.body.appendChild(container);
  };
})();
