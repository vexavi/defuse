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

## Manual cover update

The cover page now shows only **English Only**, the bomb icon, and **Manual**.

## Wires page update

The Wires page now removes the 'USE ENGLISH' box and shows only **How many wires?** above the rules.


## Directions expansion

Directions now has 14 locations total. Sequences vary from 3 to 6 arrows.

New locations:
- Airport
- Hotel
- Bank
- Zoo
- City Hall

## Calculator manual update

The Calculator page now removes the **How to Defuse** box and shows an equation visual above the color table.

## Manual cover art

The title page now includes `cover-illustration.png`, a cute defusing illustration placed on the cover.

## Calculator equation layout

The color-choice box in the Calculator manual equation has been condensed into a more compact single-row layout.

## PDF number centering fix

Adjusted the Animal Numbers circle styling to improve vertical centering in the generated PDF.

## PDF shape fix

Adjusted the print CSS so:
- Animal Numbers digit badges keep a fixed 35×35 circle shape and cannot shrink into ovals.
- Wires page left count panels keep their fixed width more reliably in the PDF.

## PDF Wires centering fix

Adjusted the Wires page left number panels so the 4 / 5 / 6 labels are more reliably centered in the generated PDF.

## Calculator color marker fix

Adjusted the Calculator equation color markers to use sturdier mini swatches so they render cleanly in the PDF.

## PDF cover centering fix

Adjusted the title page layout so the cover card is more strictly centered in the PDF.
The title-page page number is also centered explicitly.

## Word Lookup arrow visibility

The arrows on the Word Lookup page were updated to be easier to read:
- larger arrow symbol
- clearer right-pointing shape
- small highlighted badge behind the arrow

## Directions clarity update

The Directions page now uses individual arrow badges for each step so the path is easier to read in both the manual and PDF.

## Directions readability update

The Directions page now uses larger chips that show both:
- the arrow symbol
- the English direction word

Example: `↑ UP`, `↓ DOWN`, `← LEFT`, `→ RIGHT`

## Directions arrow-only row update

The Directions page now uses arrow-only badges (no words), styled similar to the Word Lookup arrows.
Each direction sequence stays on a single row.

## Directions arrow tip visibility

The Directions page now uses heavier arrow symbols with more obvious arrowheads:
- ⬆
- ⬇
- ⬅
- ➡
