# Prompt Coach

This is a small web application that helps coworkers build better AI prompts by guiding them through
`Goal -> Context -> Source -> Expectations` and providing tips. Users can also save their own prompt
templates, which are stored on the server using Node.js.

## Setup

1. **Install Node.js (version 14+)** if you haven't already.
2. Open a terminal and change to the `prompt-coach` directory:
   ```bash
   cd "c:\Users\snoyes\OneDrive - Norstella\Desktop\The-Right-Question\prompt-coach"
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the server:
   ```bash
   npm start
   ```

The server will listen on port 3000 by default. Open your browser to `http://localhost:3000` to use
the app.

## How it works

- **Front end**: plain HTML/CSS/JS (`index.html`, `style.css`, `script.js`). Forms build and preview
  prompts. A dropdown lists built-in examples and any saved prompts.
- **Back end**: `server.js` is an Express server that serves static files and exposes two API
  endpoints:
  - `GET /api/prompts` returns an object mapping names to prompt sections.
  - `POST /api/prompts` accepts `{ name, prompt }` and persists the updated map to
    `prompts.json`.
- Prompts are stored server-side in the `prompts.json` file in the same directory.

## Extending

You can add more example prompts by editing `script.js` or enhance server storage with a database.

---

Created March 2026.