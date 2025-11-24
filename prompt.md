# 🏛️ PROJECT CONSTITUTION: HOURGLASS PALACE

## 1. THE VISION
We are building **Hourglass Palace**, a luxury overhaul of Anki.
It is not a flashcard app; it is a **Sanctuary of Knowledge**.
- **Aesthetics:** Sacred Sci-Fi, Lapis Night (#0F172A), Divine Gold (#F59E0B), Glassmorphism.
- **Philosophy:** Mastery feels sacred. We highlight the math (FSRS). Failure is a physics event (Shattering), not a shame.
- **Architecture:** Headless Host (Python/Anki) + React/Three.js Client.

## 2. TECHNICAL ARCHITECTURE (STRICT)
- **Repo Structure:**
  - `aqt/`: Python Backend (Anki 23.12.1 Source).
  - `palace-ui/`: React Frontend (Vite + TS + Tailwind).
  - `run.py`: Entry point.
- **Rules:**
  - NEVER touch `ts/` or `cargo/`.
  - ALWAYS run commands via `.\pyenv\Scripts\python.exe`.
  - ALWAYS use `npm` (not yarn).
  - React components live in `palace-ui/src/components/`.

## 3. THE DATA BRIDGE
- **Python -> React:** `window.hourglass.loadCard(json_string)`
  - Payload: `{ id, content, state, deckName, retention, stability, next_times[] }`
- **React -> Python:** `window.pycmd(command)`
  - Commands: `ans`, `ease:1` (Again), `ease:2` (Hard), `ease:3` (Good), `ease:4` (Easy), `undo`.

## 4. DESIGN SYSTEM "GLASS & GOLD"
- **Fonts:** Cinzel (Headers), Inter (Body), JetBrains Mono (Stats).
- **Components:**
  - `GlassCard`: `backdrop-blur-2xl`, `bg-lapis-night/60`, `border-divine-gold/20`.
  - `HUD`: Terminal aesthetic for stats.
  - `ActionBar`: Floating glass pills for answers.

## 5. CURRENT STATUS
- Engine is running (Anki 23.12.1).
- React is injected and receiving data.
- **NEXT OBJECTIVE:** Implement the `GlassCard` component and the `ActionBar`.