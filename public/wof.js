(() => {
  var __defProp = Object.defineProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => {
    __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
    return value;
  };

  // src/scripts/constants/displayConstants.ts
  var TILE_DIMENSION = 100;

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
      this.id = id;
      this.height = height;
      this.width = width;
      this.row = row;
      this.column = column;
      this.letter = letter;
      this.state = state;
    }
    changeState(updateState) {
      this.state = updateState;
    }
  };

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

  // src/scripts/gameObjects/guess.ts
  var Guess = class {
    constructor(id, letter, state) {
      __publicField(this, "id");
      __publicField(this, "letter");
      __publicField(this, "state");
      this.id = id;
      this.letter = letter;
      this.state = state;
    }
    changeState(updateState) {
      this.state = updateState;
      switch (this.state) {
      }
    }
  };

  // src/scripts/gameObjects/states/guessState.ts
  var GuessState = /* @__PURE__ */ ((GuessState2) => {
    GuessState2[GuessState2["FRESH"] = 1] = "FRESH";
    GuessState2[GuessState2["GUESSED"] = 2] = "GUESSED";
    return GuessState2;
  })(GuessState || {});
  var guessState_default = GuessState;

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
    constructor(state, tiles, guesses, allowedTries) {
      __publicField(this, "state");
      __publicField(this, "tiles");
      __publicField(this, "guesses");
      __publicField(this, "allowedTries");
      __publicField(this, "currentGuesses");
      __publicField(this, "autoGuessCounter");
      this.state = state;
      this.tiles = tiles;
      this.guesses = guesses;
      this.allowedTries = allowedTries;
      this.currentGuesses = 0;
      this.autoGuessCounter = 0;
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
      } else {
        console.log("Check for lose");
        if (this.currentGuesses >= this.allowedTries) {
          console.log("Sorry you lose.");
          this.state = gameState_default.LOST;
        }
      }
    }
    makeGuess(guessId) {
      if (this.state === gameState_default.FRESH) {
        this.state = gameState_default.IN_PLAY;
      }
      if (this.state === gameState_default.IN_PLAY) {
        this.guesses[guessId].changeState(guessState_default.GUESSED);
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
    logBoard() {
      let aRow = "";
      for (let r = 0; r < this.tiles.length; r++) {
        aRow += "===";
        for (let c = 0; c < this.tiles[r].length; c++) {
          switch (this.tiles[r][c].state) {
            case tileState_default.GUESSABLE:
              aRow += "[-]";
              break;
            case tileState_default.GUESSED:
              aRow += "[" + this.tiles[r][c].letter + "]";
              break;
            default:
              aRow += "[X]";
          }
        }
        aRow += "===\n";
      }
      console.log(aRow);
      console.log("Guesses:");
      let aGuess = "";
      for (let g = 0; g < this.guesses.length; g++) {
        switch (this.guesses[g].state) {
          case guessState_default.FRESH:
            aGuess += "[" + this.guesses[g].letter + "]";
            break;
          default:
            aGuess += "X" + this.guesses[g].letter + "X";
        }
      }
      console.log(aGuess);
    }
    autoGuess() {
      if (this.autoGuessCounter < this.guesses.length) {
        this.makeGuess(this.autoGuessCounter);
        this.autoGuessCounter++;
      }
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
  console.log(tileState_default.ANIMATING);
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
  var makeTiles = (words, columns) => {
    let id = 0;
    const tiles = [];
    for (let w = 0; w < words.length; w++) {
      tiles[w] = [];
      for (let l = 0; l < words[w].length; l++) {
        let aTile = new Tile(id, TILE_DIMENSION, TILE_DIMENSION, l, w, words[w][l], tileState_default.GUESSABLE);
        tiles[w].push(aTile);
        id++;
      }
    }
    return tiles;
  };
  var alphabet = () => {
    const alpha = Array.from(Array(26)).map((e, i) => i + 65);
    return alpha.map((x) => String.fromCharCode(x));
  };
  var buildGame = (phrase, onlyPhraseLetters, allowedTries) => {
    const words = phrase.toUpperCase().split(" ");
    let longest_word_length = 0;
    let longest_word = "";
    words.reduce((accumulator, currentValue) => {
      if (currentValue.length > longest_word_length) {
        longest_word_length = currentValue.length;
        longest_word = currentValue;
      }
    }, longest_word);
    let tiles = makeTiles(words, longest_word_length);
    const guesses = onlyPhraseLetters ? initializeLetterFromPhraseGuesses(phrase) : initializeAllGuesses();
    return new Game(gameState_default.FRESH, tiles, guesses, allowedTries);
  };
  var game = buildGame("Artificial Intelligence is not General yet", true, 5);
})();
