// Puzzles and whateverssss
// Heather Grove 
// Oct 9, 2020
//
// Extra for Experts:
// 

let cellSize;

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

// Player managment
let hitboxScale = 9;
let spriteScale = 9;

// Movement
let isGrounded = false;
let initialY;
let jumpHeight = 70;
let jumpSpeed = 8;
let gravity = 1;
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
  displayLevel();
  displaySpriteBats();
  handleMovement();
  applyGravity();
}

function displaySpriteBats() {

  imageMode(CENTER);
  image(batsStanding, batsXPos, batsYPos, height/spriteScale, height/spriteScale);

}

function keyPressed() {
  if (key === "a") {
    isMovingLeft = true;
  }
  if (key === "d") {
    isMovingRight = true;
  }
  if (keyCode === 32 && isGrounded) {
    initialY = batsYPos;
    isJumping = true;
  }
}

function handleMovement() {
  
  if (isMovingLeft) {
    batsXPos -= movementSpeed;
  }
  if (isMovingRight) {
    batsXPos += movementSpeed;
  }
  if (isJumping) {
    if (batsYPos >= initialY - jumpHeight) {
      batsYPos -= jumpSpeed;
    }
    else {
      isJumping = false;
    }
  }
}

function keyReleased() {
  if (key === "a") {
    isMovingLeft = false;
  }
  if (key === "d") {
    isMovingRight = false;
  }
  if (keyCode === 32) {
    isJumping = false;
  }
}

function applyGravity() {
  // Ground Detection
  let batsYPositionOnGrid, batsXPositionOnGrid;

  batsYPositionOnGrid = floor(batsYPos / cellSize);
  batsXPositionOnGrid = floor(batsXPos / cellSize);

  if (currentLevel[batsYPositionOnGrid + 1][batsXPositionOnGrid] === "+") {
    isGrounded = true;
  }
  else {
    isGrounded = false;
  }
  
  if (!isGrounded && !isJumping) {
    batsYPos += gravity;
  }

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