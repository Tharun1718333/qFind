function makePlayGround() {
  const canvas = document.getElementById("PlayGround");
  const ctx = canvas.getContext("2d");

  const rows = 12;
  const cols = 5;
  const blockSize = 32;

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

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Colors for each type
  const colors = ["#FFFFFF", "#90caf9", "#a5d6a7", "#eeeeee", "#a8c6deff"];

  let cubicleCount = 1;
  const printableMap = new Map();
  // Populate the hash map with some values
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

  // Draw the office map
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const type = office[r][c];
      let x = c * blockSize + 1;
      let y = r * blockSize + 1;

      // Draw cell background
      ctx.fillStyle = colors[type];
      ctx.fillRect(x, y, blockSize, blockSize);
    }
  }
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const type = office[r][c];
      let x = c * blockSize + blockSize / 3;
      let y = r * blockSize + 1;

      if (type === 4) {
        ctx.font = "12px Arial";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "black";
        const temp = printableMap.get(5 * r + c);
        if (temp.textOrientation === "TR") {
          x -= blockSize;
          y += blockSize;
        }
        if (temp.textOrientation === "BR") {
          x -= blockSize;
        }
        if (temp.textOrientation === "TL") {
          y += blockSize;
        }
        ctx.fillText(`${temp.name}`, Math.floor(x), Math.floor(y));
      }
    }
  }
}

class Printable {
  constructor(name, textOrientation) {
    this.name = name;
    this.textOrientation = textOrientation;
  }
}
