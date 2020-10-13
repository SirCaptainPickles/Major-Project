// Puzzles and whateverssss
// Heather Grove 
// Oct 9, 2020
//
// Extra for Experts:
// 

let cellSize;

let currentLevel = [];
const LEVELSIZE = 10;

function setup() {
  createCanvas(windowWidth, windowHeight);

  cellSize = windowWidth / LEVELSIZE;
  currentLevel = loadStrings("assets/level1.txt");

  // convert currentLevel into 2d array
  for (let i=0; i<currentLevel.length; i++) {
    currentLevel[i] = currentLevel[i].split(",");
  }

}

function draw() {
  background(220);
  displayLevel();
}

function displayLevel() {
  for (let y=0; y<LEVELSIZE; y++) {
    for (let x=0; x<LEVELSIZE; x++) {
      strokeWeight(1);
      fill("white");
      rect(x*cellSize, y*cellSize, cellSize, cellSize);

      if (currentLevel[y][x] !== "0") {
        //show number

        if (currentLevel[y][x] === "+") {
          //one of the given numbers
          fill("black");
          rect(currentLevel[y][x], x* cellSize + y * cellSize, cellSize + cellSize);
        }

       
      }
    }
  }   
}