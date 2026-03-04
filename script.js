// Grab form elements
const goalEl = document.getElementById('goal');
const contextEl = document.getElementById('context');
const sourceEl = document.getElementById('source');
const expectationsEl = document.getElementById('expectations');
const previewEl = document.getElementById('previewText');
const copyBtn = document.getElementById('copyBtn');
const saveBtn = document.getElementById('saveBtn');
const examplesSelect = document.getElementById('examples');

// storage for user‑saved prompts loaded from backend
let savedPrompts = {};
const examples = {
    "summarize": {
        goal: "Summarize what happened during the meeting.",
        context: "I attended a one-hour meeting about the product roadmap with design and engineering teams.",
        source: "Use the meeting notes attached or the transcript below.",
        expectations: "Provide a concise paragraph highlighting decisions and actions, no more than 5 sentences."
    },
    "email": {
        goal: "Draft a professional email requesting a project update.",
        context: "Write from the perspective of a project manager emailing a developer team.",
        source: "Refer to the last status report and timeline.",
        expectations: "The tone should be polite and clear; include a subject line suggestion."
    },
    "brainstorm": {
        goal: "Brainstorm ideas for improving our onboarding documentation.",
        context: "We want new hires to ramp up faster.",
        source: "Use our current documentation structure as a reference.",
        expectations: "List at least 5 suggestions in bullet points."
    }
};

function updatePreview() {
    const parts = [];
    if (goalEl.value.trim()) parts.push(`${goalEl.value.trim()}`);
    if (contextEl.value.trim()) parts.push(`${contextEl.value.trim()}`);
    if (sourceEl.value.trim()) parts.push(`${sourceEl.value.trim()}`);
    if (expectationsEl.value.trim()) parts.push(`${expectationsEl.value.trim()}`);
    previewEl.textContent = parts.join(" ");
}

function applyParts(p) {
    goalEl.value = p.goal || '';
    contextEl.value = p.context || '';
    sourceEl.value = p.source || '';
    expectationsEl.value = p.expectations || '';
    updatePreview();
}

function renderExamples() {
    // clear existing options except the first placeholder
    examplesSelect.innerHTML = '<option value="" selected>-- choose example --</option>';
    // built-in examples
    Object.keys(examples).forEach(key => {
        const opt = document.createElement('option');
        opt.value = key;
        opt.textContent = key.charAt(0).toUpperCase() + key.slice(1);
        examplesSelect.appendChild(opt);
    });
    // saved prompts
    if (Object.keys(savedPrompts).length) {
        const sep = document.createElement('option');
        sep.disabled = true;
        sep.textContent = '--- Saved prompts ---';
        examplesSelect.appendChild(sep);
        Object.keys(savedPrompts).forEach(name => {
            const opt = document.createElement('option');
            opt.value = `custom:${name}`;
            opt.textContent = name;
            examplesSelect.appendChild(opt);
        });
    }
}

// fetch saved prompts from the Node.js server
async function loadSaved() {
    try {
        const res = await fetch('/api/prompts');
        if (res.ok) {
            savedPrompts = await res.json();
        } else {
            console.error('Failed to load prompts', res.status);
            savedPrompts = {};
        }
    } catch (e) {
        console.error('Error contacting server', e);
        savedPrompts = {};
    }
}

async function saveCurrentPrompt() {
    const name = prompt('Enter a name for this prompt:');
    if (!name) return;
    if (savedPrompts[name]) {
        const ok = confirm('A prompt with that name already exists. Overwrite?');
        if (!ok) return;
    }
    const promptData = {
        goal: goalEl.value.trim(),
        context: contextEl.value.trim(),
        source: sourceEl.value.trim(),
        expectations: expectationsEl.value.trim()
    };
    try {
        const res = await fetch('/api/prompts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, prompt: promptData })
        });
        if (res.ok) {
            savedPrompts = await res.json();
            renderExamples();
        } else {
            alert('Failed to save prompt');
        }
    } catch (e) {
        console.error('Error saving prompt', e);
    }
}

[goalEl, contextEl, sourceEl, expectationsEl].forEach(el => {
    el.addEventListener('input', updatePreview);
});

examplesSelect.addEventListener('change', () => {
    const val = examplesSelect.value;
    if (val.startsWith('custom:')) {
        const name = val.substring(7);
        const saved = savedPrompts[name];
        if (saved) applyParts(saved);
    } else if (examples[val]) {
        applyParts(examples[val]);
    }
});

saveBtn.addEventListener('click', saveCurrentPrompt);

copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(previewEl.textContent)
        .then(() => alert('Prompt copied to clipboard!'))
        .catch(err => console.error('Copy failed', err));
});

// Initialize
(async () => {
    await loadSaved();
    renderExamples();
    updatePreview();
})();