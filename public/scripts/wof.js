var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// src/scripts/words.json
var require_words = __commonJS({
  "src/scripts/words.json"(exports2, module2) {
    module2.exports = {
      words: [
        "Large Language Models",
        "Prompt Engineering",
        "Data Leaking",
        "Hallucination"
      ]
    };
  }
});

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
  id;
  height;
  width;
  row;
  column;
  letter;
  state;
  html;
  constructor(id, height, width, row, column, letter, state) {
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
  GuessState2[GuessState2["UNUSED"] = 3] = "UNUSED";
  return GuessState2;
})(GuessState || {});
var guessState_default = GuessState;

// src/scripts/gameObjects/guess.ts
var Guess = class {
  id;
  letter;
  state;
  html;
  constructor(id, letter, state) {
    this.id = id;
    this.letter = letter;
    this.state = state;
    this.html = document.createElement("div");
    this.html.dataset.guess = id === null ? "blank" : id.toString();
    this.html.textContent = this.letter;
  }
  changeState(updateState) {
    this.state = updateState;
    this.updateStyle();
  }
  updateStyle() {
    let style = "guess";
    switch (this.state) {
      case guessState_default.FRESH:
        style += " fresh";
        break;
      case guessState_default.GUESSED:
        style += " guessed";
        break;
      case guessState_default.UNUSED:
        style += " fresh";
        break;
      default:
        console.log("unknown tile state");
    }
    this.html.className = style;
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
  state;
  tiles;
  guesses;
  paddedGuesses;
  allowedTries;
  currentGuesses;
  autoGuessCounter;
  interval;
  constructor(state, tiles, guesses, paddedGuesses, allowedTries) {
    this.state = state;
    this.tiles = tiles;
    this.guesses = guesses;
    this.paddedGuesses = paddedGuesses;
    this.allowedTries = allowedTries;
    this.currentGuesses = 0;
    this.autoGuessCounter = 0;
    this.interval = {};
  }
  updateGameState() {
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
    if (this.state === gameState_default.FRESH) {
      this.state = gameState_default.IN_PLAY;
    }
    if (this.state === gameState_default.IN_PLAY) {
      if (this.guesses[guessId].state !== guessState_default.UNUSED) {
        this.guesses[guessId].changeState(guessState_default.GUESSED);
      }
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
  autoGuess(t) {
    document.getElementById("fast")?.addEventListener("click", function() {
      for (let i = 0; i < t.guesses.length; i++) {
        console.log("end round was clicked");
        t.guesses[i].changeState(guessState_default.GUESSED);
        t.makeGuess(i);
      }
    });
    console.log("what is t? ", t);
    console.log("Auto Guess", t.guesses[t.autoGuessCounter]);
    console.log("t guess", t.guesses);
    if (t.autoGuessCounter < t.guesses.length) {
      t.makeGuess(t.autoGuessCounter);
      t.autoGuessCounter++;
    } else {
      t.stopAutoGuesser();
    }
  }
  autoGuesser() {
    this.interval = setInterval(this.autoGuess, 2e3, this);
  }
  stopAutoGuesser() {
    clearInterval(this.interval);
  }
};

// src/scripts/wof.ts
var json = require_words();
var game;
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
var initializeLetterFromPhraseGuesses = (phrase2) => {
  phrase2 = phrase2.toUpperCase();
  const unique = findUnique(phrase2);
  let guesses = [];
  let paddedGuesses = [];
  for (let u = 0; u < unique.length; u++) {
    let aGuess = new Guess(u, unique[u], guessState_default.FRESH);
    guesses.push(aGuess);
  }
  guesses = shuffle(guesses);
  paddedGuesses = padGuesses(guesses);
  return [guesses, paddedGuesses];
};
var padGuesses = (guesses) => {
  const padded = [];
  const alphabetList = alphabet();
  const alpha = document.getElementById("alpha");
  const wrap = document.createElement("div");
  wrap.setAttribute("id", "alphawrap");
  const firstRow = document.createElement("div");
  firstRow.classList.add("alphabet-row");
  const secondRow = document.createElement("div");
  secondRow.classList.add("alphabet-row");
  alpha.className = "alphabet-container hidden";
  let find;
  for (let a = 0; a < alphabetList.length; a++) {
    find = guesses.find((f) => f.letter === alphabetList[a]);
    if (!find) {
      find = new Guess(null, alphabetList[a], guessState_default.UNUSED);
    }
    find.updateStyle();
    padded.push(find);
    if (a < 13) {
      firstRow.appendChild(find.html);
    } else {
      secondRow.appendChild(find.html);
    }
    wrap.appendChild(firstRow);
    wrap.appendChild(secondRow);
  }
  alpha?.appendChild(wrap);
  return padded;
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
  console.log(boardElement);
  const boardWrap = document.createElement("div");
  boardWrap.setAttribute("id", "boardWrap");
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
    boardWrap.appendChild(aDiv);
  }
  boardElement?.appendChild(boardWrap);
  return tiles;
};
var alphabet = () => {
  const alpha = Array.from(Array(26)).map((e, i) => i + 65);
  return alpha.map((x) => String.fromCharCode(x));
};
var buildGame = (phrase2, onlyPhraseLetters, allowedTries) => {
  let words = phrase2.toUpperCase().split(" ");
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
  if (onlyPhraseLetters) {
    [guesses, paddedGuesses] = initializeLetterFromPhraseGuesses(phrase2);
    return new Game(gameState_default.FRESH, tiles, guesses, paddedGuesses, allowedTries);
  } else {
    guesses = initializeAllGuesses();
    return new Game(gameState_default.FRESH, tiles, guesses, [], allowedTries);
  }
};
var introScreen = () => {
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
  startContainer.addEventListener("click", () => {
    intro.classList.add("hidden");
    const mainContainer = document.getElementsByClassName("container hidden")[0];
    mainContainer.classList.remove("hidden");
  });
};
var resetRound = () => {
  const getNext = document.querySelector("#next");
  getNext?.addEventListener("click", () => {
    if (round < phrase.length - 1) {
      const getBoardWrap = document.getElementById("boardWrap");
      const getAlpha = document.getElementById("alphawrap");
      while (getBoardWrap?.hasChildNodes()) {
        getBoardWrap.removeChild(getBoardWrap.firstChild);
      }
      while (getAlpha?.hasChildNodes()) {
        getAlpha.removeChild(getAlpha.firstChild);
      }
      while (getAlpha?.hasChildNodes()) {
        getAlpha.removeChild(getAlpha.firstChild);
      }
      document.getElementById("boardWrap")?.remove();
      document.getElementById("alphawrap")?.remove();
      round++;
      console.log(round, " check round");
      game = buildGame(phrase[round], true, 200);
      const alpha = document.getElementsByClassName("alphabet-container hidden")[0];
      alpha.classList.remove("hidden");
    } else {
      const cont = document.getElementsByClassName("container")[0];
      cont.classList.add("hidden");
      showEnd();
    }
  });
};
var endScreen = () => {
  const outro = document.createElement("div");
  outro.className = "outroScreen hidden";
  document.body.appendChild(outro);
  const outroContainer = document.createElement("div");
  outroContainer.className = "outro-container";
  outro.appendChild(outroContainer);
};
function showEnd() {
  const getEnd = document.getElementsByClassName("outroScreen hidden")[0];
  var myDiv = document.getElementsByClassName("outro-container")[0];
  var h1 = document.createElement("h1");
  h1.textContent = "Thank you for playing";
  getEnd.appendChild(myDiv);
  myDiv.appendChild(h1);
  getEnd.classList.remove("hidden");
}
var startbttn = () => {
  const gameButtons = document.createElement("div");
  gameButtons.className = "game-buttons";
  const getContainer = document.querySelector("#controls");
  getContainer?.appendChild(gameButtons);
  const getGameButton = document.querySelector(".game-buttons");
  const round2 = document.createElement("button");
  round2.type = "button";
  round2.textContent = "START ROUND";
  round2.id = "start-round";
  getGameButton?.append(round2);
  document.getElementById("start-round")?.addEventListener("click", () => {
    game.autoGuesser();
  });
};
var nextRound = () => {
  const nxtround = document.createElement("button");
  nxtround.type = "button";
  nxtround.id = "next";
  nxtround.textContent = "NEXT ROUND";
  const getGameButtons = document.querySelector(".game-buttons");
  getGameButtons?.appendChild(nxtround);
};
var fastRound = () => {
  const fast = document.createElement("button");
  fast.type = "button";
  fast.id = "fast";
  fast.textContent = "finish";
  const getGameButtons = document.querySelector(".game-buttons");
  getGameButtons?.appendChild(fast);
};
var phrase = json.words;
var round = 0;
document.addEventListener("DOMContentLoaded", (event) => {
  game = buildGame(phrase[round], true, 200);
  const alpha = document.getElementsByClassName("alphabet-container hidden")[0];
  alpha.classList.remove("hidden");
  introScreen();
  endScreen();
  document.querySelector(".btn-start")?.addEventListener("click", function() {
    startbttn();
    nextRound();
    resetRound();
    fastRound();
  });
});
