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

function deleteCanvasElement() {
  if (canvasElement) {   
    canvasElement.parentNode.removeChild(canvasElement);
    canvasElement.removeEventListener('mousedown', startDrawing);
    canvasElement.removeEventListener('mousemove', draw);
    canvasElement.removeEventListener('mouseup', stopDrawing);
    canvasElement.removeEventListener('mouseout', stopDrawing);
    canvasElement = null;
    canvasContext = null;
    drawingRecords = [];
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

  canvasElement.addEventListener('mousedown', startDrawing);
  canvasElement.addEventListener('mousemove', draw);
  canvasElement.addEventListener('mouseup', stopDrawing);
  canvasElement.addEventListener('mouseout', stopDrawing);

  loadDrawings();
}

function startDrawing(e) {
  if (activeTool !== 'pen') return;
  isDrawingActive = true;
  startX = e.clientX;
  startY = e.clientY;
  currentPath = [{ x: startX, y: startY }];
}

function draw(e) {
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
  currentPath.push({ x: startX, y: startY });
}

function stopDrawing() {
  if (!isDrawingActive) return;
  isDrawingActive = false;
  if (currentPath.length > 1) {
    drawingRecords.push({ tool: activeTool, color: selectedColor, path: currentPath });
  }
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
      } else if (drawing.tool === 'text-highlighter') {
        canvasContext.fillStyle = drawing.color;
        canvasContext.fillRect(drawing.rect.left, drawing.rect.top, drawing.rect.width, drawing.rect.height);
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
    span.id = 'highlight-' + new Date().getTime();
    span.appendChild(range.extractContents());
    range.insertNode(span);

    selection.removeAllRanges();

    drawingRecords.push({ tool: 'text-highlighter', html: span.outerHTML, parentXPath: getXPath(span.parentNode), id: span.id });
  }
}

function getXPath(element) {
  if (element.id !== '') return 'id("' + element.id + '")';
  if (element === document.body) return element.tagName;
  let index = 0;
  const siblings = element.parentNode.childNodes;
  for (let i = 0; i < siblings.length; i++) {
    const sibling = siblings[i];
    if (sibling === element) return getXPath(element.parentNode) + '/' + element.tagName + '[' + (index + 1) + ']';
    if (sibling.nodeType === 1 && sibling.tagName === element.tagName) index++;
  }
}

function undoLastAction() {
  if (drawingRecords.length > 0) {
    const lastDrawing = drawingRecords.pop();
    undoHistory.push(lastDrawing);
    redrawCanvas();
    if (lastDrawing.tool === 'text-highlighter') {
      const parent = document.evaluate(lastDrawing.parentXPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      if (parent) {
        const spans = parent.querySelectorAll(`span[id="${lastDrawing.id}"]`);
        spans.forEach(span => {
          const text = document.createTextNode(span.textContent);
          span.parentNode.replaceChild(text, span);
        });
      }
    }
  }
}











