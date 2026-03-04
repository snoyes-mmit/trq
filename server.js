const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, 'prompts.json');
const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// serve static assets (html/css/js) from this folder
app.use(express.static(__dirname));

// helper to read prompts from disk
function readPrompts() {
    try {
        if (!fs.existsSync(DATA_FILE)) return {};
        const raw = fs.readFileSync(DATA_FILE, 'utf8');
        return JSON.parse(raw || '{}');
    } catch (e) {
        console.error('Error reading prompts file', e);
        return {};
    }
}

// helper to write prompts to disk
function writePrompts(prompts) {
    try {
        fs.writeFileSync(DATA_FILE, JSON.stringify(prompts, null, 2), 'utf8');
    } catch (e) {
        console.error('Error writing prompts file', e);
    }
}

// endpoint to retrieve all saved prompts
app.get('/api/prompts', (req, res) => {
    const prompts = readPrompts();
    res.json(prompts);
});

// endpoint to save/update a prompt
app.post('/api/prompts', (req, res) => {
    const { name, prompt } = req.body;
    if (!name || !prompt) {
        return res.status(400).json({ error: 'name and prompt are required' });
    }
    const prompts = readPrompts();
    prompts[name] = prompt;
    writePrompts(prompts);
    res.json(prompts);
});

app.listen(port, () => {
    console.log(`Prompt Coach server listening at http://localhost:${port}`);
});
