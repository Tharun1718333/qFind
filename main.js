const canvas = document.getElementById("PlayGround");
const ctx = canvas.getContext("2d");

const rows = 12;
const cols = 5;
const blockSize = 32;
class Printable {
  constructor(name, textOrientation) {
    this.name = name;
    this.textOrientation = textOrientation;
  }
}

const office = [
  [1, 1, 2, 1, 1],
  [1, 4, 2, 4, 1],
  [1, 1, 2, 1, 1],
  [1, 4, 2, 4, 1],
  [1, 4, 2, 4, 1],
  [1, 1, 2, 1, 1],
  [1, 4, 2, 4, 1],
  [1, 1, 2, 1, 1],
  [1, 4, 2, 4, 1],
  [1, 1, 2, 1, 1],
  [2, 2, 2, 2, 2],
  [3, 3, 3, 3, 3],
];

var printableMap = new Map();
printableMap.set(6, new Printable("1501A1", "BR"));
printableMap.set(8, new Printable("1501A2", "BL"));
printableMap.set(16, new Printable("1501A3", "BR"));
printableMap.set(18, new Printable("1501A4", "BL"));
printableMap.set(21, new Printable("1501A5", "TR"));
printableMap.set(23, new Printable("1501A6", "TL"));
printableMap.set(31, new Printable("1501A7", "TR"));
printableMap.set(33, new Printable("1501A8", "TL"));
printableMap.set(41, new Printable("1501A9", "TR"));
printableMap.set(43, new Printable("1501A10", "TL"));

const colors = ["#FFFFFF", "#90caf9", "#a5d6a7", "#eeeeee", "#a8c6deff"];

makePlayGround();
populateDropdown();
function makePlayGround() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawOfficeMap();
  drawTextOnCubicles();
}

function drawOfficeMap() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const type = office[r][c];
      const x = c * blockSize + 1;
      const y = r * blockSize + 1;

      // Draw cell background
      ctx.fillStyle = colors[type];
      ctx.fillRect(x, y, blockSize, blockSize);
    }
  }
}

function drawTextOnCubicles() {
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const type = office[r][c];
      if (type === 4) {
        const x = c * blockSize + blockSize / 3;
        const y = r * blockSize + 1;

        ctx.font = "12px Arial";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "black";
        const temp = printableMap.get(5 * r + c);
        if (temp) {
          let adjustedX = x;
          let adjustedY = y;

          if (temp.textOrientation === "TR") {
            adjustedX -= blockSize;
            adjustedY += blockSize;
          }
          if (temp.textOrientation === "BR") {
            adjustedX -= blockSize;
          }
          if (temp.textOrientation === "TL") {
            adjustedY += blockSize;
          }

          ctx.fillText(
            `${temp.name}`,
            Math.floor(adjustedX),
            Math.floor(adjustedY)
          );
        }
      }
    }
  }
}

function FindPath() {
  const startDropdown = document.getElementById("startPoint");
  const endDropdown = document.getElementById("endPoint");

  const startKey = parseInt(startDropdown.value, 10);
  const endKey = parseInt(endDropdown.value, 10);

  const path = implement_a_star(startKey, endKey);
  currentPath = path;
  makePlayGround();
  Drawpath(path);
}

function ClearOutPath() {
  currentPath.forEach((element) => {
    const x = (element % cols) * blockSize + 1;
    const y = Math.floor(element / cols) * blockSize + 1;

    // Clear the circle by redrawing the cell background
    const type = office[Math.floor(element / cols)][element % cols];
    ctx.fillStyle = colors[type];
    ctx.fillRect(x, y, blockSize, blockSize);
  });

  // Clear the currentPath array
  currentPath = [];
}

function Drawpath(path) {
  path.forEach((element) => {
    const x = (element % cols) * blockSize + blockSize / 2;
    const y = Math.floor(element / cols) * blockSize + blockSize / 2;
    ctx.beginPath();
    ctx.arc(x, y, blockSize / 4, 0, 2 * Math.PI);
    ctx.fillStyle = "orange";
    ctx.fill();
    ctx.closePath();
  });
}

function populateDropdown() {
  const startDropdown = document.getElementById("startPoint");
  const endDropdown = document.getElementById("endPoint");

  printableMap.forEach((value, key) => {
    const optionStart = document.createElement("option");
    optionStart.value = key;
    optionStart.textContent = value.name;
    startDropdown.appendChild(optionStart);

    const optionEnd = document.createElement("option");
    optionEnd.value = key;
    optionEnd.textContent = value.name;
    endDropdown.appendChild(optionEnd);
  });
}

function implement_a_star(startKey, endKey) {
  const start_x = startKey % cols;
  const start_y = Math.floor(startKey / cols);
  const end_x = endKey % cols;
  const end_y = Math.floor(endKey / cols);

  // Temporarily set start and end points to 2
  const originalStart = office[start_y][start_x];
  const originalEnd = office[end_y][end_x];
  office[start_y][start_x] = 2;
  office[end_y][end_x] = 2;

  const openSet = [];
  const closedSet = new Set();
  const gScore = Array.from({ length: rows }, () => Array(cols).fill(Infinity));
  const fScore = Array.from({ length: rows }, () => Array(cols).fill(Infinity));
  const cameFrom = Array.from({ length: rows }, () => Array(cols).fill(null));

  gScore[start_y][start_x] = 0;
  fScore[start_y][start_x] = heuristic(start_x, start_y, end_x, end_y);
  openSet.push({ x: start_x, y: start_y, f: fScore[start_y][start_x] });

  while (openSet.length > 0) {
    openSet.sort((a, b) => a.f - b.f);
    const current = openSet.shift();
    const { x, y } = current;

    if (x === end_x && y === end_y) {
      // Revert start and end points to their original values
      office[start_y][start_x] = originalStart;
      office[end_y][end_x] = originalEnd;
      return reconstructPath(cameFrom, end_x, end_y);
    }

    closedSet.add(`${x},${y}`);

    for (const [dx, dy] of [
      [0, 1],
      [1, 0],
      [0, -1],
      [-1, 0],
    ]) {
      const neighborX = x + dx;
      const neighborY = y + dy;

      if (
        neighborX < 0 ||
        neighborX >= cols ||
        neighborY < 0 ||
        neighborY >= rows ||
        closedSet.has(`${neighborX},${neighborY}`) ||
        office[neighborY][neighborX] !== 2
      ) {
        continue;
      }

      const tentativeGScore = gScore[y][x] + 1;

      if (tentativeGScore < gScore[neighborY][neighborX]) {
        cameFrom[neighborY][neighborX] = { x, y };
        gScore[neighborY][neighborX] = tentativeGScore;
        fScore[neighborY][neighborX] =
          tentativeGScore + heuristic(neighborX, neighborY, end_x, end_y);

        if (
          !openSet.some((node) => node.x === neighborX && node.y === neighborY)
        ) {
          openSet.push({
            x: neighborX,
            y: neighborY,
            f: fScore[neighborY][neighborX],
          });
        }
      }
    }
  }

  // Revert start and end points to their original values
  office[start_y][start_x] = originalStart;
  office[end_y][end_x] = originalEnd;

  return []; // No path found
}

function heuristic(x1, y1, x2, y2) {
  return Math.abs(x1 - x2) + Math.abs(y1 - y2); // Manhattan distance
}

function reconstructPath(cameFrom, end_x, end_y) {
  const path = [];
  let current = { x: end_x, y: end_y };

  while (current) {
    path.push(current.y * cols + current.x);
    current = cameFrom[current.y][current.x];
  }

  return path.reverse();
}
