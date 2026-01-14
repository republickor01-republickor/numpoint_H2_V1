/////////디버그 패널//////////
///////// 디버그 패널 (GLOBAL 전용) /////////
globalThis.createDebugPanel = function() {
  if (document.getElementById("debugPanel")) return;

  const panel = document.createElement("div");
  panel.id = "debugPanel";

  Object.assign(panel.style, {
    position: "absolute",
    top: "10px",
    left: "10px",
    width: "220px",
    background: "#111",
    color: "#0f0",
    fontFamily: "monospace",
    fontSize: "12px",
    border: "1px solid #444",
    zIndex: 9999,
    userSelect: "none",
    pointerEvents: "none"
  });

  // 🔹 헤더 (잡는 부분)
  const header = document.createElement("div");
  header.textContent = "DEBUG PANEL";
  Object.assign(header.style, {
    padding: "6px",
    background: "#222",
    cursor: "move",
    fontWeight: "bold",
    borderBottom: "1px solid #444",
    pointerEvents: "auto"
  });

  // 🔹 내용 영역
  const body = document.createElement("pre");
  body.id = "debugPanelBody";
  body.style.margin = "0";
  body.style.padding = "8px";

  panel.appendChild(header);
  panel.appendChild(body);
  document.body.appendChild(panel);

  // ✅ 헤더 드래그 연결 (이 줄이 핵심)
  enablePanelDrag(panel, header);
}


//////////////////////////////
globalThis.updateDebugPanel = function() {
  const body = document.getElementById("debugPanelBody");
  if (!body) return;

  const g = GLOBAL;

  body.textContent = `
[GAME]
currentValue : ${g.game.currentValue}
targetValue  : ${g.game.targetValue}
result       : ${g.game.result ?? "null"}

[POINTER - WINDOW]
x : ${g.pointer.winX !== null ? g.pointer.winX.toFixed(1) : "-"}
y : ${g.pointer.winY !== null ? g.pointer.winY.toFixed(1) : "-"}

[POINTER - CANVAS]
x : ${g.pointer.canvasX !== null ? g.pointer.canvasX.toFixed(1) : "-"}
y : ${g.pointer.canvasY !== null ? g.pointer.canvasY.toFixed(1) : "-"}

[CANVAS]
width  : ${g.canvas.width}
height : ${g.canvas.height}

[APP]
mode : ${g.app.mode}

[DEBUG - BOARD]
hitBoard : ${g.debug.hitBoard}
boardResults: ${JSON.stringify(g.debug.boardResults, null, 2)}
`;
}

globalThis.enablePanelDrag = function(panel, handle) {
  let dragging = false;
  let offsetX = 0;
  let offsetY = 0;

  handle.addEventListener("mousedown", (e) => {
    dragging = true;
    const rect = panel.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
  });

  document.addEventListener("mousemove", (e) => {
    if (!dragging) return;
    panel.style.left = e.clientX - offsetX + "px";
    panel.style.top = e.clientY - offsetY + "px";
  });

  document.addEventListener("mouseup", () => {
    dragging = false;
  });
}
/*
function updatePointer(e, canvas) {
  const rect = canvas.getBoundingClientRect();

  Pointer.winX = e.clientX;
  Pointer.winY = e.clientY;

  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;

  Pointer.canvasX = (e.clientX - rect.left) * scaleX;
  Pointer.canvasY = (e.clientY - rect.top) * scaleY;
}
*/


/////////////디버그패널 완료