let activeTool = null;
let selectedColor = 'red';
let drawingRecords = [];
let undoHistory = [];
let isDrawingActive = false;
let startX, startY;
let canvasElement, canvasContext;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "pen") {
    activatePen();
  } else if (message.action === "highlight-btn") {
    selectedColor = message.color || 'yellow';
    activateHighlighter();
  } else if (message.action === "undo-btn") {
    undoLastAction();
  } else if (message.action === "save-btn") {
    console.log("Saving drawings");
    saveDrawings();
  }
});

function activatePen() {
  activeTool = 'pen';
  if (!canvasElement) {
    createCanvasElement();
  }
}

function activateHighlighter() {
  deleteCanvasElement();
  activeTool = 'text-highlighter';
  document.addEventListener('mouseup', applyHighlight);
}

function createCanvasElement() {
  canvasElement = document.createElement('canvas');
  canvasElement.style.position = 'absolute';
  canvasElement.style.top = '0';
  canvasElement.style.left = '0';
  canvasElement.width = window.innerWidth;
  canvasElement.height = window.innerHeight;
  document.body.appendChild(canvasElement);
  canvasContext = canvasElement.getContext('2d');

  canvasElement.addEventListener('mousedown', initiateDrawing);
  canvasElement.addEventListener('mousemove', drawOnCanvas);
  canvasElement.addEventListener('mouseup', endDrawing);
  canvasElement.addEventListener('mouseout', endDrawing);

  loadDrawings();
}

function initiateDrawing(e) {
  if (activeTool !== 'pen') return;
  isDrawingActive = true;
  startX = e.clientX;
  startY = e.clientY;
}

function drawOnCanvas(e) {
  if (!isDrawingActive) return;

  canvasContext.strokeStyle = selectedColor;
  canvasContext.lineWidth = 2;
  canvasContext.lineCap = 'round';
  canvasContext.globalAlpha = 1.0;

  canvasContext.beginPath();
  canvasContext.moveTo(startX, startY);
  canvasContext.lineTo(e.clientX, e.clientY);
  canvasContext.stroke();

  drawingRecords.push({ tool: 'pen', color: selectedColor, startX, startY, endX: e.clientX, endY: e.clientY });

  startX = e.clientX;
  startY = e.clientY;
}

function endDrawing() {
  if (!isDrawingActive) return;
  isDrawingActive = false;
}

function saveDrawings() {
  chrome.storage.local.set({ drawingRecords: drawingRecords }, () => {
    if (chrome.runtime.lastError) {
      console.error("Error saving drawings:", chrome.runtime.lastError);
    } else {
      console.log("Drawings saved successfully");
    }
  });
}

function loadDrawings() {
  chrome.storage.local.get('drawingRecords', (data) => {
    if (chrome.runtime.lastError) {
      console.error("Error loading drawings:", chrome.runtime.lastError);
    } else {
      drawingRecords = data.drawingRecords || [];
      redrawCanvas();
    }
  });
}

function redrawCanvas() {
  if (canvasContext) {
    canvasContext.clearRect(0, 0, canvasElement.width, canvasElement.height);
    drawingRecords.forEach(drawing => {
      if (drawing.tool === 'pen') {
        canvasContext.strokeStyle = drawing.color;
        canvasContext.lineWidth = 2;
        canvasContext.globalAlpha = 1.0;
        canvasContext.beginPath();
        canvasContext.moveTo(drawing.startX, drawing.startY);
        canvasContext.lineTo(drawing.endX, drawing.endY);
        canvasContext.stroke();
      }
    });
  }
}

function applyHighlight() {
  if (activeTool !== 'text-highlighter') return;
  const selection = window.getSelection();
  if (!selection.isCollapsed) {
    const range = selection.getRangeAt(0);
    const span = document.createElement('span');
    span.style.backgroundColor = selectedColor;
    span.appendChild(range.extractContents());
    range.insertNode(span);

    selection.removeAllRanges();

    drawingRecords.push({ tool: 'text-highlighter', html: span.outerHTML });
  }
}

function undoLastAction() {
  if (drawingRecords.length > 0) {
    drawingRecords.pop();
    redrawCanvas();
  }
}











