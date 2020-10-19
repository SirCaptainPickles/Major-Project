// Puzzles and whateverssss
// Heather Grove 
// Oct 9, 2020
//
// Extra for Experts:
// 

let cellSize;
let hit = false;

// Counters used to change between sprites, screens/gamestates, and locations
let spriteTimer = 0;
let state = "start";
let areaCounter = 0; // Does nothing in this version

let currentLevel = [];
const LEVELWIDTH = 40;
const LEVELHEIGHT = 20;

let batsStanding, batsRight, batsLeft, batsJumping;
let batsXPos = 400;
let batsYPos = 200;

let isMovingLeft, isMovingRight, isJumping;
let batsYPositionOnGrid, batsXPositionOnGrid;


// Player managment
let hitboxScale = 20;
let spriteScale = 0;

// Movement
let isGrounded = false;
let wallOnRight = false;
let wallOnLeft = false;
let ceilingAbove = false;

let initialY;
let batsJumpHeight = 70;
let jumpSpeed = 5;
let gravity = 5;
let movementSpeed = 7;


// Loads all Images
function preload() {
  batsStanding = loadImage("assets/characters/bats-standing.png");
  batsRight = loadImage("assets/characters/bats-running-right.png");
  batsLeft = loadImage("assets/characters/bats-running-left.png");
  batsJumping = loadImage("assets/characters/bats-jumping.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  if (height > width) {
    cellSize = windowWidth / LEVELWIDTH;
  }
  else {
    cellSize = windowHeight / LEVELHEIGHT;
  }

  imageMode(CENTER);
  frameRate(30);
  isMovingLeft = false;
  isMovingRight = false;
  isJumping = false;

  currentLevel = loadStrings("assets/level1.txt");

  // convert currentLevel into 2d array
  for (let i=0; i<currentLevel.length; i++) {
    currentLevel[i] = currentLevel[i].split(",");
  }

}

function draw() {
  background(220);
  whereTheSpritesAre();
  displayLevel();
  displaySpriteBats();
  handleMovement();
  applyGravity();
}

function displaySpriteBats() {
  imageMode(CENTER);

  if (isJumping) {
    image(batsJumping, batsXPos, batsYPos, batsJumping.width, batsJumping.height);
  }
  else if (isMovingLeft) {
    image(batsLeft, batsXPos, batsYPos, batsLeft.width, batsLeft.height);
  }
  else if (isMovingRight) {
    image(batsRight, batsXPos, batsYPos, batsRight.width, batsRight.height);
  }
  else {
    image(batsStanding, batsXPos, batsYPos, batsStanding.width, batsStanding.height);
  }
}

function whereTheSpritesAre() {
  batsYPositionOnGrid = round(batsYPos / cellSize);
  batsXPositionOnGrid = round(batsXPos / cellSize);
  console.log(batsXPositionOnGrid, batsYPositionOnGrid);
}

function keyPressed() {

  if (key === "a") {
    isMovingLeft = true;
  }
  if (key === "d") {
    isMovingRight = true;
  }
  if (key === "w" && isGrounded) {
    initialY = batsYPos;
    isJumping = true;
  }
}

function keyReleased() {
  if (key === "a") {
    isMovingLeft = false;
  }
  if (key === "d") {
    isMovingRight = false;
  }
  if (keyCode === "w") {
    isJumping = false;
  }
}

function handleMovement() {

  collisionDetection();

  if (ceilingAbove) {
    batsJumpHeight = 30;
  }
  else {
    batsJumpHeight = 70;
  }

  if (isMovingLeft && !wallOnLeft) {
    batsXPos -= movementSpeed;
  }

  if (isMovingRight && !wallOnRight) {
    batsXPos += movementSpeed;
  }

  if (isJumping) {
    if (batsYPos >= initialY - batsJumpHeight) {
      batsYPos -= jumpSpeed;
    }
    else {
      isJumping = false;
    }
  }

  if (currentLevel[batsYPositionOnGrid][batsXPositionOnGrid] === "!") {
    levelFailedScreen();
  }

}

function applyGravity() {
  // Ground Detection
  let tempBatsYPosOnGrid = round((batsYPos + 5) / cellSize);
  let tempBatsXPosOnGrid = floor(batsXPos / cellSize);

  if (currentLevel[tempBatsYPosOnGrid][tempBatsXPosOnGrid] === "+") {
    isGrounded = true;
  }
  else {
    isGrounded = false;
  }
  
  if (!isGrounded && !isJumping) {
    batsYPos += gravity;
  }
}

function collisionDetection() {
  if (currentLevel[batsYPositionOnGrid][batsXPositionOnGrid - 1] === "+") {
    wallOnLeft = true;
  }
  else {
    wallOnLeft = false;
  }

  if (currentLevel[batsYPositionOnGrid][batsXPositionOnGrid] === "+") {
    wallOnRight = true;
  }
  else {
    wallOnRight = false;
  }

  if (currentLevel[batsYPositionOnGrid - 1][batsXPositionOnGrid] === "+") {
    ceilingAbove = true;
  }
  else {
    ceilingAbove = false;
  }
}

function levelFailedScreen() {

}

function displayLevel() {
  for (let y=0; y < LEVELHEIGHT; y++) {
    for (let x=0; x < LEVELWIDTH; x++) {
    
      if (currentLevel[y][x] !== "0") {

        if (currentLevel[y][x] === "+") {
          //Walls / Floor
          fill("black");
          rect(x * cellSize, y * cellSize, cellSize, cellSize);
        }

        if (currentLevel[y][x] === "?") {
          //Door
          fill("Blue");
          rect(x * cellSize, y * cellSize, cellSize, cellSize);
        }
       
        if (currentLevel[y][x] === "!") {
          //Danger
          fill("red");
          rect(x * cellSize, y * cellSize, cellSize, cellSize);
        }

      }
    }
  }   
}

// function deathScreen() {
//   clear();
//   background(0);
//   fill(255);
//     textSize(35);
//     text("Whoopsie, looks like you slipped up", width / 2, height / 2, width/4, height/2);
// }