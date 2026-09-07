(() => {
  // All required DOM is now loaded before this file executes.
  // Keep this script at the end of index.html.
  const screens = {
    home: document.getElementById("home"),
    game: document.getElementById("game"),
    result: document.getElementById("result"),
  };

  const startBtn = document.getElementById("startGame");
  const playAgainBtn = document.getElementById("playAgain");
  const abortBtn = document.getElementById("abortGame");
  const timerEl = document.getElementById("timer");
  const strikeCountEl = document.getElementById("strikeCount");
  const moduleProgressEl = document.getElementById("moduleProgress");
  const moduleTitleEl = document.getElementById("moduleTitle");
  const bombModuleEl = document.getElementById("bombModule");
  const feedbackEl = document.getElementById("feedback");
  const progressFill = document.getElementById("progressFill");
  const strikeLights = [
    document.getElementById("strikeLight1"),
    document.getElementById("strikeLight2"),
    document.getElementById("strikeLight3"),
  ];
  const bombStatusEl = document.getElementById("bombStatus");
  const moduleLampEl = document.getElementById("moduleLamp");
  const serialNumberEl = document.getElementById("serialNumber");
  const levelLabelEl = document.getElementById("levelLabel");
  const campaignHomeTitleEl = document.getElementById("campaignHomeTitle");
  const homeLevelLabelEl = document.getElementById("homeLevelLabel");
  const homeLevelDetailsEl = document.getElementById("homeLevelDetails");
  const campaignProgressNoteEl = document.getElementById("campaignProgressNote");
  const explosionOverlayEl = document.getElementById("explosionOverlay");
  const bombConsoleEl = document.querySelector(".bomb-console");

  let state = null;
  let campaign = null;
  let resultAction = "start";
  let timerId = null;

  const colorWordList = [
    "APPLE", "OCEAN", "GRASS", "BANANA", "GRAPE", "SUN",
    "SNOW", "LEMON", "TREE", "NIGHT", "ROSE", "CLOUD"
  ];
  const colorList = ["red", "blue", "green", "yellow", "purple"];

  const animalNumbers = {
    CAT: [2, 4, 1, 7],
    DOG: [5, 1, 8, 3],
    RABBIT: [7, 3, 2, 9],
    BIRD: [3, 8, 6, 1],
    FISH: [8, 2, 5, 4],
    BEAR: [4, 6, 9, 2],
    HORSE: [1, 9, 3, 7],
    MONKEY: [6, 5, 2, 8],
    TIGER: [9, 7, 4, 1],
    ELEPHANT: [2, 9, 6, 5],
    PANDA: [5, 8, 1, 4],
    FROG: [7, 1, 3, 6],
  };

  const animalEmoji = {
    CAT: "🐱",
    DOG: "🐶",
    RABBIT: "🐰",
    BIRD: "🐦",
    FISH: "🐟",
    BEAR: "🐻",
    HORSE: "🐴",
    MONKEY: "🐵",
    TIGER: "🐯",
    ELEPHANT: "🐘",
    PANDA: "🐼",
    FROG: "🐸",
  };

  const directionRules = {
    SCHOOL: ["up", "right", "up"],
    PARK: ["left", "up", "left"],
    LIBRARY: ["down", "right", "right"],
    STATION: ["right", "down", "left"],
    HOSPITAL: ["up", "up", "left"],
    SUPERMARKET: ["right", "right", "up"],
    RESTAURANT: ["down", "left", "up"],
    POST_OFFICE: ["left", "down", "right"],
    MUSEUM: ["up", "left", "down"],
  };

  const wordBank = [
    "APPLE", "DOG", "SCHOOL", "RED",
    "TENNIS", "BOOK", "CAR", "RAIN",
    "PIZZA", "CAT", "PARK", "BLUE",
    "SOCCER", "PENCIL", "TRAIN", "SUN"
  ];

  const fixedWordMap = {
    APPLE: "DOG",
    DOG: "SCHOOL",
    SCHOOL: "RED",
    RED: "TENNIS",
    TENNIS: "BOOK",
    BOOK: "CAR",
    CAR: "RAIN",
    RAIN: "PIZZA",
    PIZZA: "CAT",
    CAT: "PARK",
    PARK: "BLUE",
    BLUE: "SOCCER",
    SOCCER: "PENCIL",
    PENCIL: "TRAIN",
    TRAIN: "SUN",
    SUN: "APPLE",
  };


  const calculatorOperations = {
    add: { light: "red", symbol: "+", label: "ADD" },
    subtract: { light: "blue", symbol: "−", label: "SUBTRACT" },
    multiply: { light: "green", symbol: "×", label: "MULTIPLY" },
    divide: { light: "yellow", symbol: "÷", label: "DIVIDE" },
  };

  function showScreen(name) {
    Object.values(screens).forEach((s) => s.classList.remove("active"));
    screens[name].classList.add("active");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function choice(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function shuffle(arr) {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  function sample(arr, n) {
    return shuffle(arr).slice(0, n);
  }


  const LEVELS = [
    { level: 1,  clears: 1, seconds: 180, pool: ["color"] },
    { level: 2,  clears: 1, seconds: 150, pool: ["color", "animals"] },
    { level: 3,  clears: 2, seconds: 240, pool: ["color", "animals", "directions"] },
    { level: 4,  clears: 2, seconds: 220, pool: ["color", "animals", "directions", "wires"] },
    { level: 5,  clears: 2, seconds: 200, pool: ["color", "animals", "directions", "wires", "category"] },
    { level: 6,  clears: 3, seconds: 300, pool: ["color", "animals", "directions", "wires", "category", "calculator"] },
    { level: 7,  clears: 3, seconds: 270, pool: ["color", "animals", "directions", "wires", "category", "calculator"] },
    { level: 8,  clears: 3, seconds: 240, pool: ["color", "animals", "directions", "wires", "category", "calculator"] },
    { level: 9,  clears: 4, seconds: 330, pool: ["color", "animals", "directions", "wires", "category", "calculator"] },
    { level: 10, clears: 4, seconds: 300, pool: ["color", "animals", "directions", "wires", "category", "calculator"] },
    { level: 11, clears: 4, seconds: 270, pool: ["color", "animals", "directions", "wires", "category", "calculator"] },
    { level: 12, clears: 5, seconds: 390, pool: ["color", "animals", "directions", "wires", "category", "calculator"] },
    { level: 13, clears: 5, seconds: 360, pool: ["color", "animals", "directions", "wires", "category", "calculator"] },
    { level: 14, clears: 5, seconds: 330, pool: ["color", "animals", "directions", "wires", "category", "calculator"] },
    { level: 15, clears: 6, seconds: 420, pool: ["color", "animals", "directions", "wires", "category", "calculator"] },
    { level: 16, clears: 6, seconds: 390, pool: ["color", "animals", "directions", "wires", "category", "calculator"] },
    { level: 17, clears: 6, seconds: 360, pool: ["color", "animals", "directions", "wires", "category", "calculator"] },
    { level: 18, clears: 7, seconds: 420, pool: ["color", "animals", "directions", "wires", "category", "calculator"] },
    { level: 19, clears: 7, seconds: 390, pool: ["color", "animals", "directions", "wires", "category", "calculator"] },
    { level: 20, clears: 8, seconds: 420, pool: ["color", "animals", "directions", "wires", "category", "calculator"] },
  ];

  const fixedColorMap = {
    APPLE: "purple",
    OCEAN: "yellow",
    GRASS: "blue",
    BANANA: "red",
    GRAPE: "green",
    SUN: "blue",
    SNOW: "red",
    LEMON: "purple",
    TREE: "yellow",
    NIGHT: "green",
    ROSE: "blue",
    CLOUD: "purple",
  };

  const fixedRules = {
    colorMap: fixedColorMap,
    wordMap: fixedWordMap,
  };

  function numberToWords(number) {
    const ones = [
      "ZERO", "ONE", "TWO", "THREE", "FOUR",
      "FIVE", "SIX", "SEVEN", "EIGHT", "NINE",
      "TEN", "ELEVEN", "TWELVE", "THIRTEEN", "FOURTEEN",
      "FIFTEEN", "SIXTEEN", "SEVENTEEN", "EIGHTEEN", "NINETEEN"
    ];

    const tens = [
      "", "", "TWENTY", "THIRTY", "FORTY",
      "FIFTY", "SIXTY", "SEVENTY", "EIGHTY", "NINETY"
    ];

    const n = Math.max(0, Math.floor(Number(number)));

    if (n < 20) return ones[n];

    if (n < 100) {
      const ten = Math.floor(n / 10);
      const one = n % 10;
      return one === 0 ? tens[ten] : `${tens[ten]}-${ones[one]}`;
    }

    if (n < 1000) {
      const hundred = Math.floor(n / 100);
      const rest = n % 100;
      return rest === 0
        ? `${ones[hundred]} HUNDRED`
        : `${ones[hundred]} HUNDRED ${numberToWords(rest)}`;
    }

    return String(n);
  }

  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function makeCalculatorRound(previousOperation = null) {
    const operationNames = Object.keys(calculatorOperations);
    let available = operationNames;

    if (previousOperation && operationNames.length > 1) {
      available = operationNames.filter(name => name !== previousOperation);
    }

    const operation = choice(available);
    let first;
    let second;
    let answer;

    if (operation === "add") {
      first = randomInt(10, 99);
      second = randomInt(10, 99);
      answer = first + second;
    }

    if (operation === "subtract") {
      first = randomInt(20, 99);
      second = randomInt(10, first);
      answer = first - second;
    }

    if (operation === "multiply") {
      first = randomInt(2, 25);
      second = randomInt(2, 25);
      answer = first * second;
    }

    if (operation === "divide") {
      // Division always produces a whole-number answer.
      second = randomInt(2, 12);
      const quotient = randomInt(2, 12);
      first = second * quotient;
      answer = quotient;
    }

    return {
      operation,
      first,
      second,
      answer,
      light: calculatorOperations[operation].light,
    };
  }

  function refreshCalculatorRound(module) {
    const next = makeCalculatorRound(module.operation);
    module.operation = next.operation;
    module.first = next.first;
    module.second = next.second;
    module.answer = next.answer;
    module.light = next.light;
    module.entered = "";
  }

  function formatTime(seconds) {
    const s = Math.max(0, seconds);
    const m = Math.floor(s / 60);
    const rem = s % 60;
    return `${String(m).padStart(2, "0")}:${String(rem).padStart(2, "0")}`;
  }


  function makeSerial() {
    const letters = "ABCDEFGHJKLMNPQRSTUVWXYZ";
    const a = letters[Math.floor(Math.random() * letters.length)];
    const b = letters[Math.floor(Math.random() * letters.length)];
    const num = String(Math.floor(Math.random() * 9000) + 1000);
    return `${a}${b}-${num}`;
  }


  function pluralizeModules(count) {
    return `${count} module${count === 1 ? "" : "s"}`;
  }

  function updateCampaignHome() {
    const resumeLevel = campaign ? campaign.highestUnlockedLevel : 1;
    const config = LEVELS[resumeLevel - 1] || LEVELS[0];
    const lastCleared = campaign ? campaign.lastClearedLevel : 0;

    if (campaignHomeTitleEl) {
      campaignHomeTitleEl.textContent =
        resumeLevel === 1 && lastCleared === 0
          ? "💣 Start at Level 1"
          : `💣 Continue at Level ${resumeLevel}`;
    }

    if (homeLevelLabelEl) {
      homeLevelLabelEl.textContent = `LEVEL ${resumeLevel}`;
    }

    if (homeLevelDetailsEl) {
      homeLevelDetailsEl.textContent =
        `${pluralizeModules(config.clears)} · ${formatTime(config.seconds)}`;
    }

    if (startBtn) {
      startBtn.textContent =
        resumeLevel === 1 && lastCleared === 0
          ? "Start Level 1"
          : `Resume Level ${resumeLevel}`;
    }

    if (campaignProgressNoteEl) {
      if (lastCleared > 0) {
        campaignProgressNoteEl.textContent =
          `Session progress: Level ${lastCleared} cleared. Refreshing the page resets to Level 1.`;
      } else {
        campaignProgressNoteEl.textContent =
          "No progress is saved. Refreshing the page starts again from Level 1.";
      }
    }
  }

  function showHome() {
    updateCampaignHome();
    showScreen("home");
  }

  function playExplosion(onDone) {
    if (!explosionOverlayEl) {
      onDone();
      return;
    }

    if (bombConsoleEl) {
      bombConsoleEl.classList.remove("exploding");
      void bombConsoleEl.offsetWidth;
      bombConsoleEl.classList.add("exploding");
    }

    explosionOverlayEl.classList.remove("active");
    void explosionOverlayEl.offsetWidth;
    explosionOverlayEl.classList.add("active");
    explosionOverlayEl.setAttribute("aria-hidden", "false");

    const reducedMotion =
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const delay = reducedMotion ? 650 : 1250;

    window.setTimeout(() => {
  // All required DOM is now loaded before this file executes.
  // Keep this script at the end of index.html.
      explosionOverlayEl.classList.remove("active");
      explosionOverlayEl.setAttribute("aria-hidden", "true");
      if (bombConsoleEl) bombConsoleEl.classList.remove("exploding");
      onDone();
    }, delay);
  }

  function assertCampaignDOM() {
    const required = [
      ["startGame", startBtn],
      ["game", screens.game],
      ["result", screens.result],
      ["timer", timerEl],
      ["moduleProgress", moduleProgressEl],
      ["bombModule", bombModuleEl],
      ["levelLabel", levelLabelEl],
      ["campaignHomeTitle", campaignHomeTitleEl],
      ["homeLevelLabel", homeLevelLabelEl],
      ["homeLevelDetails", homeLevelDetailsEl],
      ["campaignProgressNote", campaignProgressNoteEl],
      ["explosionOverlay", explosionOverlayEl],
    ];

    const missing = required.filter(([, node]) => !node).map(([name]) => name);
    if (missing.length) {
      throw new Error(`Campaign UI mismatch. Missing: ${missing.join(", ")}`);
    }
  }

  function startCampaign() {
    campaign = {
      currentLevel: 1,
      highestUnlockedLevel: 1,
      lastClearedLevel: 0,
      calculatorKeypad: shuffle([0,1,2,3,4,5,6,7,8,9]),
    };
    startLevel(1);
  }

  function buildLevelModules(config) {
    // Choose WITH replacement so the same module type can return later in a level.
    return Array.from({ length: config.clears }, () => {
      const type = choice(config.pool);
      return makeModule(type, fixedRules, campaign.calculatorKeypad);
    });
  }

  function startLevel(levelNumber) {
    clearInterval(timerId);

    const config = LEVELS[levelNumber - 1];
    if (!config) return;

    campaign.currentLevel = levelNumber;
    campaign.highestUnlockedLevel = Math.max(
      campaign.highestUnlockedLevel || 1,
      levelNumber
    );

    state = {
      levelNumber,
      levelConfig: config,
      totalTime: config.seconds,
      timeLeft: config.seconds,
      strikes: 0,
      maxStrikes: 3,
      moduleIndex: 0,
      rules: fixedRules,
      calculatorKeypad: campaign.calculatorKeypad,
      modules: buildLevelModules(config),
      ended: false,
      serial: makeSerial(),
    };

    showScreen("game");
    updateHeader();
    renderCurrentModule();

    timerId = setInterval(() => {
  // All required DOM is now loaded before this file executes.
  // Keep this script at the end of index.html.
      if (!state || state.ended) return;
      state.timeLeft -= 1;
      timerEl.textContent = formatTime(state.timeLeft);
      timerEl.classList.toggle("timer-critical", state.timeLeft <= 30);

      if (state.timeLeft <= 0) {
        failLevel("Time ran out.");
      }
    }, 1000);
  }

  function makeModule(type, rules, calculatorKeypad) {
    if (type === "color") {
      const word = choice(colorWordList);
      const correct = rules.colorMap[word];
      const buttons = shuffle(colorList);
      return { type, word, correct, buttons, solved: false };
    }

    if (type === "wires") {
      const count = choice([4, 5, 6]);
      let wires = [];
      let correctIndex = 0;

      if (count === 4) {
        const hasRed = Math.random() < 0.7;
        wires = Array.from({ length: 4 }, () => choice(["blue", "green", "yellow", "black"]));
        if (hasRed) wires[Math.floor(Math.random() * 4)] = "red";
        correctIndex = wires.includes("red") ? wires.indexOf("red") : 3;
      }

      if (count === 5) {
        const useYellowRule = Math.random() < 0.6;
        if (useYellowRule) {
          wires = ["yellow", "yellow", choice(["red", "green", "blue"]), choice(["red", "green", "black"]), choice(["blue", "green", "red"])];
          wires = shuffle(wires);
          const yellowIndices = wires.map((w, i) => w === "yellow" ? i : -1).filter(i => i >= 0);
          correctIndex = yellowIndices[1];
        } else {
          wires = Array.from({ length: 5 }, () => choice(["red", "green", "black", "purple"]));
          wires[Math.floor(Math.random() * 5)] = "blue";
          correctIndex = wires.indexOf("blue");
        }
      }

      if (count === 6) {
        const hasBlack = Math.random() < 0.7;
        wires = Array.from({ length: 6 }, () => choice(["red", "blue", "green", "yellow", "purple"]));
        if (hasBlack) wires[Math.floor(Math.random() * 6)] = "black";
        correctIndex = wires.includes("black") ? wires.indexOf("black") : 2;
      }

      return { type, wires, correctIndex, solved: false, cut: [] };
    }

    if (type === "animals") {
      const animal = choice(Object.keys(animalNumbers));
      return {
        type,
        animal,
        correct: animalNumbers[animal],
        entered: [],
        solved: false
      };
    }

    if (type === "directions") {
      const place = choice(Object.keys(directionRules));
      return { type, place, correct: directionRules[place], entered: [], solved: false };
    }

    if (type === "calculator") {
      const round = makeCalculatorRound();
      return {
        type,
        operation: round.operation,
        first: round.first,
        second: round.second,
        answer: round.answer,
        light: round.light,
        keypad: [...calculatorKeypad],
        entered: "",
        correctRounds: 0,
        roundsToClear: 2,
        solved: false,
      };
    }

    const displayWord = choice(wordBank);
    const correctWord = rules.wordMap[displayWord];
    const wrongWords = sample(
      wordBank.filter(w => w !== correctWord && w !== displayWord),
      5
    );
    return {
      type: "category",
      displayWord,
      correctWord,
      words: shuffle([correctWord, ...wrongWords]),
      correctRounds: 0,
      roundsToClear: 3,
      solved: false,
    };
  }

  function updateHeader() {
    if (!state) return;
    timerEl.textContent = formatTime(state.timeLeft);
    strikeCountEl.textContent = state.strikes;
    moduleProgressEl.textContent = `${state.moduleIndex + 1}/${state.modules.length}`;
    if (levelLabelEl) levelLabelEl.textContent = `${state.levelNumber} / ${LEVELS.length}`;
    progressFill.style.width = `${(state.moduleIndex / state.modules.length) * 100}%`;

    strikeLights.forEach((light, index) => {
      if (!light) return;
      light.classList.toggle("on", index < state.strikes);
    });

    if (serialNumberEl) serialNumberEl.textContent = state.serial || "ESL-0000";
    if (bombStatusEl && !state.ended) bombStatusEl.textContent = "ARMED";
    if (moduleLampEl) moduleLampEl.classList.toggle("on", !state.ended);
    timerEl.classList.toggle("timer-critical", state.timeLeft <= 30 && !state.ended);
  }

  function setFeedback(text, kind = "") {
    feedbackEl.textContent = text;
    feedbackEl.className = `feedback ${kind}`.trim();
  }

  function strike(message) {
    if (!state || state.ended) return;
    state.strikes += 1;
    updateHeader();
    setFeedback(`Strike! ${message}`, "bad");
    bombModuleEl.classList.remove("shake");
    void bombModuleEl.offsetWidth;
    bombModuleEl.classList.add("shake");

    if (state.strikes >= state.maxStrikes) {
      setTimeout(() => failLevel("Three strikes."), 450);
    }
  }

  function solveModule() {
    const module = state.modules[state.moduleIndex];
    module.solved = true;
    setFeedback("Correct! Module cleared.", "good");
    progressFill.style.width = `${((state.moduleIndex + 1) / state.modules.length) * 100}%`;

    setTimeout(() => {
  // All required DOM is now loaded before this file executes.
  // Keep this script at the end of index.html.
      if (!state || state.ended) return;
      if (state.moduleIndex >= state.modules.length - 1) {
        completeLevel();
      } else {
        state.moduleIndex += 1;
        updateHeader();
        renderCurrentModule();
      }
    }, 650);
  }

  function renderCurrentModule() {
    const module = state.modules[state.moduleIndex];
    updateHeader();
    setFeedback("Describe what you see. Do not look at the manual.");
    bombModuleEl.innerHTML = "";

    const names = {
      color: "Color Panel",
      wires: "Wires",
      animals: "Animal Numbers",
      directions: "Directions",
      category: "Word Lookup",
      calculator: "Calculator",
    };
    moduleTitleEl.textContent = names[module.type];

    if (module.type === "color") renderColor(module);
    if (module.type === "wires") renderWires(module);
    if (module.type === "animals") renderAnimals(module);
    if (module.type === "directions") renderDirections(module);
    if (module.type === "category") renderCategory(module);
    if (module.type === "calculator") renderCalculator(module);
  }

  function addInstruction(text) {
    const p = document.createElement("p");
    p.className = "module-instruction";
    p.textContent = text;
    bombModuleEl.appendChild(p);
  }

  function addDisplay(text) {
    const div = document.createElement("div");
    div.className = "display";
    div.textContent = text;
    bombModuleEl.appendChild(div);
  }

  function renderColor(module) {
    addInstruction("Tell your partner the word on the display.");
    addDisplay(module.word);

    const grid = document.createElement("div");
    grid.className = "button-grid";
    module.buttons.forEach(color => {
      const btn = document.createElement("button");
      btn.className = `game-button ${color}`;
      btn.type = "button";
      btn.textContent = color.toUpperCase();
      btn.addEventListener("click", () => {
        if (color === module.correct) solveModule();
        else strike("That color is wrong.");
      });
      grid.appendChild(btn);
    });
    bombModuleEl.appendChild(grid);
  }

  function renderWires(module) {
    addInstruction("Tell your partner how many wires there are and their colors, from top to bottom.");

    const wrap = document.createElement("div");
    wrap.className = "wires";

    module.wires.forEach((color, index) => {
      const row = document.createElement("div");
      row.className = "wire";

      const label = document.createElement("strong");
      label.textContent = `${index + 1}. ${color.toUpperCase()}`;

      const line = document.createElement("div");
      line.className = "wire-line";
      line.style.background = wireColor(color);

      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = module.cut.includes(index) ? "CUT" : "Cut";
      btn.disabled = module.cut.includes(index);

      btn.addEventListener("click", () => {
        if (module.cut.includes(index)) return;
        module.cut.push(index);
        btn.disabled = true;
        btn.textContent = "CUT";
        line.style.opacity = ".25";

        if (index === module.correctIndex) solveModule();
        else strike("Wrong wire.");
      });

      row.append(label, line, btn);
      wrap.appendChild(row);
    });

    bombModuleEl.appendChild(wrap);
  }

  function wireColor(color) {
    const map = {
      red: "#c7434d",
      blue: "#3576c2",
      green: "#3b8a63",
      yellow: "#b8951c",
      black: "#090a0b",
      purple: "#7958aa",
    };
    return map[color] || "#777";
  }

  function renderAnimals(module) {
    addInstruction("Tell your partner which animal you see. Press the four numbers in order.");

    const animal = document.createElement("div");
    animal.className = "animal";
    animal.setAttribute("aria-label", module.animal);
    animal.textContent = animalEmoji[module.animal];
    bombModuleEl.appendChild(animal);

    const grid = document.createElement("div");
    grid.className = "number-grid";

    const readout = document.createElement("div");
    readout.className = "sequence-readout";

    [1,2,3,4,5,6,7,8,9].forEach(num => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = num;
      btn.addEventListener("click", () => {
        const expected = module.correct[module.entered.length];

        if (num === expected) {
          module.entered.push(num);
          readout.textContent = module.entered.join("  ");

          if (module.entered.length === module.correct.length) {
            solveModule();
          }
        } else {
          module.entered = [];
          readout.textContent = "";
          strike("Wrong number. Start the four-number sequence again.");
        }
      });
      grid.appendChild(btn);
    });

    bombModuleEl.append(grid, readout);
  }

  function renderDirections(module) {
    addInstruction("Tell your partner the place on the display. Press the arrows in the order they give you.");
    addDisplay(module.place);

    const grid = document.createElement("div");
    grid.className = "arrow-grid";

    const arrows = { up: "↑", left: "←", down: "↓", right: "→" };
    Object.entries(arrows).forEach(([dir, symbol]) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.dataset.dir = dir;
      btn.textContent = symbol;
      btn.setAttribute("aria-label", dir);
      btn.addEventListener("click", () => {
        const expected = module.correct[module.entered.length];
        if (dir === expected) {
          module.entered.push(dir);
          readout.textContent = module.entered.map(d => arrows[d]).join("  ");
          if (module.entered.length === module.correct.length) solveModule();
        } else {
          module.entered = [];
          readout.textContent = "";
          strike("Wrong direction. Start the sequence again.");
        }
      });
      grid.appendChild(btn);
    });

    const readout = document.createElement("div");
    readout.className = "sequence-readout";

    bombModuleEl.append(grid, readout);
  }

  function refreshWordLookupRound(module) {
    let nextDisplay = choice(wordBank);

    // Try to avoid showing the exact same display word twice in a row.
    if (wordBank.length > 1) {
      let guard = 0;
      while (nextDisplay === module.displayWord && guard < 20) {
        nextDisplay = choice(wordBank);
        guard += 1;
      }
    }

    module.displayWord = nextDisplay;
    module.correctWord = state.rules.wordMap[nextDisplay];
    const wrongWords = sample(
      wordBank.filter(w => w !== module.correctWord && w !== module.displayWord),
      5
    );
    module.words = shuffle([module.correctWord, ...wrongWords]);
  }

  function renderCategory(module) {
    bombModuleEl.innerHTML = "";

    addInstruction(
      `Tell your partner the display word and the six choices. Correct answers: ${module.correctRounds}/${module.roundsToClear}`
    );
    addDisplay(module.displayWord);

    const progress = document.createElement("div");
    progress.className = "sequence-readout";
    progress.textContent = `Correct: ${module.correctRounds} / ${module.roundsToClear}`;
    bombModuleEl.appendChild(progress);

    const grid = document.createElement("div");
    grid.className = "word-grid six-choices";

    module.words.forEach(word => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = word;

      btn.addEventListener("click", () => {
        if (!state || state.ended || module.solved) return;

        if (word === module.correctWord) {
          module.correctRounds += 1;

          if (module.correctRounds >= module.roundsToClear) {
            solveModule();
            return;
          }

          setFeedback(
            `Correct! ${module.correctRounds}/${module.roundsToClear}. New word.`,
            "good"
          );

          refreshWordLookupRound(module);
          setTimeout(() => {
  // All required DOM is now loaded before this file executes.
  // Keep this script at the end of index.html.
            if (!state || state.ended || module.solved) return;
            renderCategory(module);
          }, 350);
        } else {
          strike("Wrong word. New word.");

          if (!state || state.ended || module.solved) return;

          refreshWordLookupRound(module);
          setTimeout(() => {
  // All required DOM is now loaded before this file executes.
  // Keep this script at the end of index.html.
            if (!state || state.ended || module.solved) return;
            renderCategory(module);
          }, 350);
        }
      });

      grid.appendChild(btn);
    });

    bombModuleEl.appendChild(grid);
  }

  function renderCalculator(module) {
    bombModuleEl.innerHTML = "";

    addInstruction(
      `Describe both numbers and the light color. Correct answers: ${module.correctRounds}/${module.roundsToClear}`
    );

    const calc = document.createElement("div");
    calc.className = "calculator-module";

    const equation = document.createElement("div");
    equation.className = "calculator-equation";

    const first = document.createElement("div");
    first.className = "calculator-number calculator-number-words";
    first.textContent = numberToWords(module.first);

    const lightBox = document.createElement("div");
    lightBox.className = "calculator-light-box";

    const lightLabel = document.createElement("span");
    lightLabel.textContent = "OPERATION";

    const light = document.createElement("div");
    light.className = `calculator-light ${module.light}`;
    light.setAttribute("aria-label", `${module.light} operation light`);

    lightBox.append(lightLabel, light);

    const second = document.createElement("div");
    second.className = "calculator-number calculator-number-words";
    second.textContent = numberToWords(module.second);

    equation.append(first, lightBox, second);

    const progress = document.createElement("div");
    progress.className = "calculator-progress";
    progress.textContent = `Correct: ${module.correctRounds} / ${module.roundsToClear}`;

    const answerDisplay = document.createElement("div");
    answerDisplay.className = "calculator-answer";
    answerDisplay.textContent = module.entered || "—";

    const pad = document.createElement("div");
    pad.className = "calculator-keypad";

    const updateAnswerDisplay = () => {
      answerDisplay.textContent = module.entered || "—";
    };

    module.keypad.forEach(num => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "calculator-key";
      btn.textContent = num;

      btn.addEventListener("click", () => {
        if (!state || state.ended || module.solved) return;
        if (module.entered.length >= 5) return;
        module.entered += String(num);
        updateAnswerDisplay();
      });

      pad.appendChild(btn);
    });

    const controls = document.createElement("div");
    controls.className = "calculator-controls";

    const back = document.createElement("button");
    back.type = "button";
    back.className = "secondary calculator-control";
    back.textContent = "⌫";
    back.setAttribute("aria-label", "Backspace");
    back.addEventListener("click", () => {
      module.entered = module.entered.slice(0, -1);
      updateAnswerDisplay();
    });

    const clear = document.createElement("button");
    clear.type = "button";
    clear.className = "secondary calculator-control";
    clear.textContent = "CLEAR";
    clear.addEventListener("click", () => {
      module.entered = "";
      updateAnswerDisplay();
    });

    const enter = document.createElement("button");
    enter.type = "button";
    enter.className = "primary calculator-enter";
    enter.textContent = "ENTER";

    enter.addEventListener("click", () => {
      if (!state || state.ended || module.solved) return;
      if (module.entered === "") {
        setFeedback("Enter an answer first.", "bad");
        return;
      }

      const submitted = Number(module.entered);

      if (submitted === module.answer) {
        module.correctRounds += 1;

        if (module.correctRounds >= module.roundsToClear) {
          solveModule();
          return;
        }

        setFeedback(
          `Correct! ${module.correctRounds}/${module.roundsToClear}. New calculation.`,
          "good"
        );

        refreshCalculatorRound(module);

        setTimeout(() => {
  // All required DOM is now loaded before this file executes.
  // Keep this script at the end of index.html.
          if (!state || state.ended || module.solved) return;
          renderCalculator(module);
        }, 350);
      } else {
        strike("Wrong calculation. New calculation.");

        if (!state || state.ended || module.solved) return;

        refreshCalculatorRound(module);

        setTimeout(() => {
  // All required DOM is now loaded before this file executes.
  // Keep this script at the end of index.html.
          if (!state || state.ended || module.solved) return;
          renderCalculator(module);
        }, 350);
      }
    });

    controls.append(back, clear, enter);
    calc.append(equation, progress, answerDisplay, pad, controls);
    bombModuleEl.appendChild(calc);
  }

  function completeLevel() {
    if (!state || state.ended) return;

    state.ended = true;
    clearInterval(timerId);

    if (bombStatusEl) bombStatusEl.textContent = "SAFE";
    if (moduleLampEl) moduleLampEl.classList.remove("on");

    const finalLevel = state.levelNumber >= LEVELS.length;

    campaign.lastClearedLevel = Math.max(
      campaign.lastClearedLevel || 0,
      state.levelNumber
    );

    if (!finalLevel) {
      campaign.highestUnlockedLevel = Math.max(
        campaign.highestUnlockedLevel || 1,
        state.levelNumber + 1
      );
    }

    document.getElementById("resultIcon").textContent = finalLevel ? "🏆" : "✅";
    document.getElementById("resultTitle").textContent =
      finalLevel ? "Campaign Complete!" : `Level ${state.levelNumber} Cleared!`;

    document.getElementById("resultText").textContent = finalLevel
      ? `You cleared all ${LEVELS.length} levels. Final level finished with ${formatTime(state.timeLeft)} left.`
      : `You cleared ${state.modules.length} module${state.modules.length === 1 ? "" : "s"} with ${state.strikes} strike${state.strikes === 1 ? "" : "s"} and ${formatTime(state.timeLeft)} left.`;

    playAgainBtn.textContent = finalLevel
      ? "Play Again from Level 1"
      : `Start Level ${state.levelNumber + 1}`;

    resultAction = finalLevel ? "restart" : "next";
    showScreen("result");
  }

  function failLevel(reason) {
    if (!state || state.ended) return;

    state.ended = true;
    clearInterval(timerId);

    if (bombStatusEl) bombStatusEl.textContent = "FAILED";
    if (moduleLampEl) moduleLampEl.classList.remove("on");

    const failedLevel = state.levelNumber;

    playExplosion(() => {
  // All required DOM is now loaded before this file executes.
  // Keep this script at the end of index.html.
      document.getElementById("resultIcon").textContent = "💥";
      document.getElementById("resultTitle").textContent = `Level ${failedLevel} Failed`;
      document.getElementById("resultText").textContent =
        `${reason} You must clear Level ${failedLevel} before advancing.`;

      playAgainBtn.textContent = `Retry Level ${failedLevel}`;
      resultAction = "retry";
      showScreen("result");
    });
  }

  assertCampaignDOM();
  updateCampaignHome();

  startBtn.addEventListener("click", () => {
    if (!campaign) {
      startCampaign();
      return;
    }

    startLevel(campaign.highestUnlockedLevel || 1);
  });

  playAgainBtn.addEventListener("click", () => {
    if (resultAction === "next") {
      startLevel(campaign.currentLevel + 1);
      return;
    }

    if (resultAction === "retry") {
      startLevel(campaign.currentLevel);
      return;
    }

    startCampaign();
  });

  abortBtn.addEventListener("click", () => {
    clearInterval(timerId);

    if (state) {
      state.ended = true;
    }

    state = null;
    resultAction = "start";
    playAgainBtn.textContent = "Play Again";

    // Keep campaign in memory for this browser session.
    // Refreshing the page still resets everything to Level 1.
    showHome();
  });




})();
