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

const colors = ["#FFFFFF", "#90caf9", "#a5d6a7", "#eeeeee", "#a8c6deff"];

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

makePlayGround();

function makePlayGround() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawOfficeMap();
  drawTextOnCubicles();
  populateDropdown();
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
  Drawpath([6, 7, 12, 17, 22, 21]);
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
