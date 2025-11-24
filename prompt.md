# 🏛️ PROJECT CONSTITUTION: HOURGLASS PALACE

## 1. THE VISION
We are building **Hourglass Palace**, a luxury overhaul of Anki (Spaced Repetition Software).
It is not a flashcard app; it is a **Sanctuary of Knowledge**.
- **Aesthetics:** "Sacred Sci-Fi". Deep Dark Mode (#0F172A), Divine Gold (#F59E0B), Cosmic Teal (#0D9488). Heavy use of **Glassmorphism** and **Cinematic Lighting**.
- **Philosophy:** Mastery feels sacred. We highlight the math (FSRS). Failure is a physics event (Shattering), not a shame.
- **Architecture:** Headless Host (Python/Anki) + React/Three.js Client.

## 2. TECHNICAL ARCHITECTURE (STRICT RULES)
- **Repo Structure:**
  - `aqt/`: Python Backend (Anki 23.12.1 Source). **DO NOT TOUCH `ts/` OR `cargo/`.**
  - `palace-ui/`: React Frontend (Vite + TS + Tailwind). **ALL UI WORK HAPPENS HERE.**
- **Environment:**
  - Run commands via `.\pyenv\Scripts\python.exe`.
  - Use `npm` (not yarn).
  - Tailwind version is locked to **3.4.17** (avoid v4 alpha).

## 3. THE DATA BRIDGE (ACTIVE)
The bridge is currently functional.
- **Python -> React:** `window.hourglass.loadCard(json_string)`
  - Payload: `{ id, content, state, deckName, retention, stability, next_times[] }`
- **React -> Python:** `window.pycmd(command)`
  - Commands: `ans` (Show Answer), `ease:1` (Again), `ease:2` (Hard), `ease:3` (Good), `ease:4` (Easy), `undo`.

---

## 🏁 IMMEDIATE MISSION: THE "GLASS & GOLD" UI

**Current State:** The engine works. Data is flowing. The UI is a raw placeholder.
**Objective:** Implement the High-Fidelity Design System.

### STEP 1: THE GLASS CONTAINER (`GlassCard.tsx`)
Create a reusable card container to replace the raw text div.
- **Style:**
  - Background: `bg-lapis-night/70` with `backdrop-blur-2xl`.
  - Border: Thin, glowing `border-divine-gold/20`.
  - Shadow: Deep, soft ambient shadow.
  - Typography: Use `@tailwindcss/typography` (`prose prose-invert`) to style the injected HTML content automatically.

### STEP 2: THE HUD (The Math)
Create a `HUD.tsx` component fixed at the top of the screen.
- **Left:** `deckName` (Font: Cinzel, Uppercase, Tracking-wide, Gold).
- **Right:** FSRS Stats (Font: JetBrains Mono/Terminal style).
  - Display `retention` (e.g., "R: 84%") and `stability` (e.g., "S: 12d").
  - Color Code: Green if R > 90%, Yellow > 80%, Red < 80%.

### STEP 3: THE ACTION BAR (Interaction)
Create `ActionBar.tsx` fixed at the bottom.
- **Visibility:** Hidden during `QUESTION` state. Slides up (Framer Motion) during `ANSWER` state.
- **Buttons:** 4 Glass Pills floating above the bottom edge.
  - Again (Red): Label "SHATTER".
  - Hard (Orange): Label "REFINE".
  - Good (Teal): Label "SOLIDIFY".
  - Easy (Blue): Label "TRANSCEND".
- **Action:** Clicking a button must call `window.pycmd('ease:X')` AND visually transition the UI back to Idle/Question.

### STEP 4: THE SHATTERING (Future Prep)
Prepare the `GlassCard` to accept a `isShattering` prop.
- When `isShattering` is true (User pressed Again), apply a CSS animation or Framer Motion variant that scales the card down and fades opacity to 0, simulating destruction.

---

## 🧪 VERIFICATION PROTOCOL
Since we cannot run unit tests on the bridge:
1. **Build:** `cd palace-ui && npm run build`
2. **Run:** `cd .. && .\pyenv\Scripts\python.exe run.py`
3. **Observe:** Visual confirmation inside the Anki window.