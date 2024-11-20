let history = [];
let redoStack = [];
let currentTextElement = null;

const canvas = document.getElementById('canvas');
const addTextButton = document.getElementById('addText');
const fontSelect = document.getElementById('fontSelect');
const fontSizeInput = document.getElementById('fontSize');
const undoButton = document.getElementById('undo');
const redoButton = document.getElementById('redo');

addTextButton.addEventListener('click', () => {
    const textElement = document.createElement('span');
    textElement.contentEditable = true;
    textElement.innerText = 'Editable Text';
    textElement.style.position = 'absolute';
    textElement.style.left = '50%';
    textElement.style.top = '50%';
    textElement.style.transform = 'translate(-50%, -50%)';
    textElement.style.fontSize = `${fontSizeInput.value}px`;
    textElement.style.fontFamily = fontSelect.value;

    textElement.addEventListener('mousedown', (e) => {
        currentTextElement = textElement;
        const offsetX = e.clientX - textElement.getBoundingClientRect().left;
        const offsetY = e.clientY - textElement.getBoundingClientRect().top;

        const mouseMoveHandler = (e) => {
            textElement.style.left = `${e.clientX - offsetX}px`;
            textElement.style.top = `${e.clientY - offsetY}px`;
        };

        const mouseUpHandler = () => {
            document.removeEventListener('mousemove', mouseMoveHandler);
            document.removeEventListener('mouseup', mouseUpHandler);
            saveState();
        };

        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
    });

    canvas.appendChild(textElement);
    saveState();
});

fontSelect.addEventListener('change', () => {
    if (currentTextElement) {
        currentTextElement.style.fontFamily = fontSelect.value;
        saveState();
    }
});

fontSizeInput.addEventListener('input', () => {
    if (currentTextElement) {
        currentTextElement.style.fontSize = `${fontSizeInput.value}px`;
        saveState();
    }
});

document.getElementById('bold').addEventListener('click', () => {
    if (currentTextElement) {
        currentTextElement.style.fontWeight = currentTextElement.style.fontWeight === 'bold' ? 'normal' : 'bold';
        saveState();
    }
});

document.getElementById('italic').addEventListener('click', () => {
    if (currentTextElement) {
        currentTextElement.style.fontStyle = currentTextElement.style.fontStyle === 'italic' ? 'normal' : 'italic';
        saveState();
    }
});

document.getElementById('underline').addEventListener('click', () => {
    if (currentTextElement) {
        currentTextElement.style.textDecoration = currentTextElement.style.textDecoration === 'underline' ? 'none' : 'underline';
        saveState();
    }
});

undoButton.addEventListener('click', undo);
redoButton.addEventListener('click', redo);

function saveState() {
    history.push(canvas.innerHTML);
    redoStack = []; // Clear redo stack on new action
}

function undo() {
    if (history.length > 1) {
        redoStack.push(history.pop());
        canvas.innerHTML = history[history.length - 1];
    }
}

function redo() {
    if (redoStack.length > 0) {
        const state = redoStack.pop();
        history.push(state);
        canvas.innerHTML = state;
    }
}
