(() => {
  const screens = {
    home: document.getElementById("home"),
    manual: document.getElementById("manual"),
    game: document.getElementById("game"),
    result: document.getElementById("result"),
  };

  const startBtn = document.getElementById("startGame");
  const manualBtn = document.getElementById("openManual");
  const playAgainBtn = document.getElementById("playAgain");
  const abortBtn = document.getElementById("abortGame");
  const difficultyEl = document.getElementById("difficulty");
  const moduleCountEl = document.getElementById("moduleCount");
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

  let state = null;
  let timerId = null;

  const colorWords = {
    APPLE: "red",
    OCEAN: "blue",
    GRASS: "green",
    BANANA: "yellow",
    GRAPE: "purple",
  };

  const animalNumbers = {
    CAT: 2,
    DOG: 5,
    RABBIT: 7,
    BIRD: 3,
    FISH: 8,
  };

  const animalEmoji = {
    CAT: "🐱",
    DOG: "🐶",
    RABBIT: "🐰",
    BIRD: "🐦",
    FISH: "🐟",
  };

  const directionRules = {
    SCHOOL: ["up", "right", "up"],
    PARK: ["left", "up", "left"],
    LIBRARY: ["down", "right", "right"],
    STATION: ["right", "down", "left"],
    HOSPITAL: ["up", "up", "left"],
  };

  const categoryPools = {
    FOOD: ["APPLE", "BREAD", "RICE", "BANANA"],
    ANIMAL: ["CAT", "DOG", "BIRD", "FISH"],
    PLACE: ["SCHOOL", "PARK", "STATION", "LIBRARY"],
    COLOR: ["RED", "BLUE", "GREEN", "YELLOW"],
    SPORT: ["TENNIS", "SOCCER", "BASEBALL", "SWIMMING"],
  };

  const allCategoryWords = Object.values(categoryPools).flat();

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

  function formatTime(seconds) {
    const s = Math.max(0, seconds);
    const m = Math.floor(s / 60);
    const rem = s % 60;
    return `${String(m).padStart(2, "0")}:${String(rem).padStart(2, "0")}`;
  }

  function difficultySeconds(diff) {
    if (diff === "hard") return 150;
    if (diff === "normal") return 210;
    return 300;
  }

  function makeSerial() {
    const letters = "ABCDEFGHJKLMNPQRSTUVWXYZ";
    const a = letters[Math.floor(Math.random() * letters.length)];
    const b = letters[Math.floor(Math.random() * letters.length)];
    const num = String(Math.floor(Math.random() * 9000) + 1000);
    return `${a}${b}-${num}`;
  }

  function startGame() {
    clearInterval(timerId);

    const count = Number(moduleCountEl.value);
    const moduleTypes = sample(["color", "wires", "animals", "directions", "category"], count);

    state = {
      difficulty: difficultyEl.value,
      totalTime: difficultySeconds(difficultyEl.value),
      timeLeft: difficultySeconds(difficultyEl.value),
      strikes: 0,
      maxStrikes: 3,
      moduleIndex: 0,
      modules: moduleTypes.map(makeModule),
      ended: false,
      serial: makeSerial(),
    };

    showScreen("game");
    updateHeader();
    renderCurrentModule();

    timerId = setInterval(() => {
      if (!state || state.ended) return;
      state.timeLeft -= 1;
      timerEl.textContent = formatTime(state.timeLeft);
      timerEl.classList.toggle("timer-critical", state.timeLeft <= 30);
      if (state.timeLeft <= 0) loseGame("Time ran out.");
    }, 1000);
  }

  function makeModule(type) {
    if (type === "color") {
      const word = choice(Object.keys(colorWords));
      const correct = colorWords[word];
      const buttons = shuffle(["red", "blue", "green", "yellow", "purple"]);
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
      return { type, animal, correct: animalNumbers[animal], solved: false };
    }

    if (type === "directions") {
      const place = choice(Object.keys(directionRules));
      return { type, place, correct: directionRules[place], entered: [], solved: false };
    }

    const category = choice(Object.keys(categoryPools));
    const correctWord = choice(categoryPools[category]);
    const wrongWords = sample(allCategoryWords.filter(w => !categoryPools[category].includes(w)), 3);
    return {
      type: "category",
      category,
      correctWord,
      words: shuffle([correctWord, ...wrongWords]),
      solved: false,
    };
  }

  function updateHeader() {
    if (!state) return;
    timerEl.textContent = formatTime(state.timeLeft);
    strikeCountEl.textContent = state.strikes;
    moduleProgressEl.textContent = `${state.moduleIndex + 1}/${state.modules.length}`;
    progressFill.style.width = `${(state.moduleIndex / state.modules.length) * 100}%`;

    strikeLights.forEach((light, index) => {
      if (!light) return;
      light.classList.toggle("on", index < state.strikes);
    });

    if (serialNumberEl) serialNumberEl.textContent = state.serial || "ESL-0000";
    if (bombStatusEl) bombStatusEl.textContent = state.ended ? "SAFE" : "ARMED";
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
      setTimeout(() => loseGame("Three strikes."), 450);
    }
  }

  function solveModule() {
    const module = state.modules[state.moduleIndex];
    module.solved = true;
    setFeedback("Correct! Module cleared.", "good");
    progressFill.style.width = `${((state.moduleIndex + 1) / state.modules.length) * 100}%`;

    setTimeout(() => {
      if (!state || state.ended) return;
      if (state.moduleIndex >= state.modules.length - 1) {
        winGame();
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
      category: "Category Words",
    };
    moduleTitleEl.textContent = names[module.type];

    if (module.type === "color") renderColor(module);
    if (module.type === "wires") renderWires(module);
    if (module.type === "animals") renderAnimals(module);
    if (module.type === "directions") renderDirections(module);
    if (module.type === "category") renderCategory(module);
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
    addInstruction("Tell your partner which animal you see.");

    const animal = document.createElement("div");
    animal.className = "animal";
    animal.setAttribute("aria-label", module.animal);
    animal.textContent = animalEmoji[module.animal];
    bombModuleEl.appendChild(animal);

    const grid = document.createElement("div");
    grid.className = "number-grid";
    [1,2,3,4,5,6,7,8,9].forEach(num => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = num;
      btn.addEventListener("click", () => {
        if (num === module.correct) solveModule();
        else strike("Wrong number.");
      });
      grid.appendChild(btn);
    });
    bombModuleEl.appendChild(grid);
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

  function renderCategory(module) {
    addInstruction("Tell your partner the display word and the four buttons.");
    addDisplay(module.category);

    const grid = document.createElement("div");
    grid.className = "word-grid";
    module.words.forEach(word => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = word;
      btn.addEventListener("click", () => {
        if (word === module.correctWord) solveModule();
        else strike("Wrong word.");
      });
      grid.appendChild(btn);
    });
    bombModuleEl.appendChild(grid);
  }

  function winGame() {
    if (!state || state.ended) return;
    state.ended = true;
    clearInterval(timerId);
    if (bombStatusEl) bombStatusEl.textContent = "SAFE";
    if (moduleLampEl) moduleLampEl.classList.remove("on");
    document.getElementById("resultIcon").textContent = "✅";
    document.getElementById("resultTitle").textContent = "Bomb Defused!";
    document.getElementById("resultText").textContent =
      `You cleared ${state.modules.length} modules with ${state.strikes} strike${state.strikes === 1 ? "" : "s"} and ${formatTime(state.timeLeft)} left.`;
    showScreen("result");
  }

  function loseGame(reason) {
    if (!state || state.ended) return;
    state.ended = true;
    clearInterval(timerId);
    if (bombStatusEl) bombStatusEl.textContent = "FAILED";
    if (moduleLampEl) moduleLampEl.classList.remove("on");
    document.getElementById("resultIcon").textContent = "💥";
    document.getElementById("resultTitle").textContent = "Bomb Exploded";
    document.getElementById("resultText").textContent = reason;
    showScreen("result");
  }

  startBtn.addEventListener("click", startGame);
  manualBtn.addEventListener("click", () => showScreen("manual"));
  playAgainBtn.addEventListener("click", () => showScreen("home"));
  abortBtn.addEventListener("click", () => {
    clearInterval(timerId);
    if (state) state.ended = true;
    showScreen("home");
  });

  document.querySelectorAll("[data-home]").forEach(btn => {
    btn.addEventListener("click", () => showScreen("home"));
  });
})();
