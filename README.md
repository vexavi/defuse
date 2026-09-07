# ESL Defuse

A two-role ESL communication / bomb-defusal game for GitHub Pages.

## Roles

- **Defuser:** sees and controls the bomb.
- **Manual Reader:** uses the printed universal manual and gives instructions in English.

## 20-level campaign

The game now runs as a 20-level campaign.

- Level 1 begins with **1 module and 3:00**.
- Levels gradually require more module clears and tighter time limits.
- New module types are introduced over the first six levels.
- From mixed levels onward, module selection is random **with replacement**, so a module can appear again after it has already been cleared.
- A level must be cleared before the player can advance.
- Failing a level lets the player retry that same level.
- Level 20 is the final level.
- Progress is not saved. Refreshing the page resets the campaign to Level 1.
- The Calculator keypad is randomized once when a new campaign begins and keeps the same layout across level changes and retries.

## Level curve

| Level | Clears | Time | Available module types |
|---:|---:|---:|---|
| 1 | 1 | 3:00 | Color |
| 2 | 1 | 2:30 | Color, Animal |
| 3 | 2 | 4:00 | + Directions |
| 4 | 2 | 3:40 | + Wires |
| 5 | 2 | 3:20 | + Word Lookup |
| 6 | 3 | 5:00 | + Calculator |
| 7 | 3 | 4:30 | All |
| 8 | 3 | 4:00 | All |
| 9 | 4 | 5:30 | All |
| 10 | 4 | 5:00 | All |
| 11 | 4 | 4:30 | All |
| 12 | 5 | 6:30 | All |
| 13 | 5 | 6:00 | All |
| 14 | 5 | 5:30 | All |
| 15 | 6 | 7:00 | All |
| 16 | 6 | 6:30 | All |
| 17 | 6 | 6:00 | All |
| 18 | 7 | 7:00 | All |
| 19 | 7 | 6:30 | All |
| 20 | 8 | 7:00 | All |

## Universal manual

The same `manual.html` works for every bomb and every level.

## Current modules

1. Color Panel
2. Wires
3. Animal Numbers
4. Directions
5. Word Lookup
6. Calculator

## Files

- `index.html`
- `style.css`
- `game.js`
- `manual.html`
- `README.md`

Upload all five files to the root of the GitHub repository and enable GitHub Pages from `main` / `/ (root)`.

## Manual style

`manual.html` now uses a cute, playful, classroom-friendly visual style while keeping the universal rules unchanged.

## Important when updating GitHub Pages

For the campaign version, replace **all** of these files together:

- `index.html`
- `style.css`
- `game.js`
- `manual.html`
- `README.md`

If the page still shows **Difficulty** or **Modules** dropdowns, GitHub Pages is serving an older `index.html`.
Hard-refresh the page (`Ctrl+F5` on Windows) after the new files finish deploying.

The correct campaign home screen says **20 LEVEL CAMPAIGN · CAMPAIGN BUILD** and has one button: **Start Level 1**.


## Session resume behavior

Campaign progress is kept in JavaScript memory while the page stays open.

Example:
- Levels 1–7 are cleared.
- The team begins Level 8.
- They press **END TEST**.
- The home screen changes to **Resume Level 8**.
- Refreshing/reloading the webpage still resets the campaign to Level 1.

Failed levels now play a full-screen explosion animation before showing the Retry screen.

## Manual cover

The universal manual now includes a front title page that says **Manual**.


## Start-button fix

Campaign v4 fixes a startup ordering bug. The explosion overlay was previously
placed after `game.js`, causing the campaign DOM check to fail before the Start
button listener was attached.

`game.js` is now loaded at the very end of `index.html`, after all required UI.
The correct home screen footer says:

`Build: Campaign v4 · Start Fix · 20 levels`

## Calculator number display

The two operands at the top of the Calculator module are shown as English words
instead of digits. Example: `30` appears as `THIRTY`, while the keypad and answer
entry remain numeric.
