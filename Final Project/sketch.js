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
let batsXPos, batsYPos;

let isMovingLeft, isMovingRight, isJumping;

// Player managment
let hitboxScale = 9;
let spriteScale = 9;

// Movement
let isGrounded = false;
let initialY;
let jumpHeight = 70;
let jumpSpeed = 8;
let gravity = 5;
let movementSpeed = 7;


// Loads all Images
function preload() {
  batsStanding = loadImage('assets/characters/bats-standing.png');
  batsRight = loadImage('assets/characters/bats-running-right.png');
  batsLeft = loadImage('assets/characters/bats-running-left.png');
  batsJumping = loadImage('assets/characters/bats-jumping.png');
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

// Makes a death screen. This should never show as I have not added a way to die.
function deathScreen() {
  clear();
  background(0);
  fill(255);
  textSize(35);
  text("Whoopsie, looks like you slipped up", width / 2, height / 2, width/4, height/2);
}

// Draws Sprite depending on which way you are moving or if you are standing still.
function displaySpriteBats() {
  push();
  imageMode(CORNER);
  if (isMovingLeft) {
    if (spriteTimer <= 15) {
      image(knightLeft1, spriteX, spriteY, height/spriteScale, height/spriteScale);
      spriteTimer++;
    }
    else {
      image(knightLeft2, spriteX, spriteY, height/spriteScale, height/spriteScale);
      spriteTimer++;
      if (spriteTimer === 30) {
        spriteTimer = 0;
      }
    }
  }
  else if (isMovingRight) {
    if (spriteTimer <= 15) {
      image(knightRight1, spriteX, spriteY, height/spriteScale, height/spriteScale);
      spriteTimer++;
    }
    else {
      image(knightRight2, spriteX, spriteY, height/spriteScale, height/spriteScale);
      spriteTimer++;
      if (spriteTimer === 30) {
        spriteTimer = 0;
      }
    }
  }
  else {
    image(knightStill, spriteX, spriteY, height/spriteScale, height/spriteScale);
  }
  pop();
}

// Checks if sprite should be moving and then moves the sprite
function handleMovement() {

  if (isMovingLeft) {
    spriteX -= movementSpeed;
  }
  if (isMovingRight) {
    spriteX += movementSpeed;
  }
  if (isJumping) {
    if (spriteY >= initialY - jumpHeight) {
      spriteY -= jumpSpeed;
    }
    else {
      isJumping = false;
    }
  }
}

// Sets movement variables to true based on key presses. The handleMovement function then uses these vairables for movement
function keyPressed() {
  if (key === "a") {
    isMovingLeft = true;
  }
  if (key === "d") {
    isMovingRight = true;
  }
  if (keyCode === 32 && isGrounded) {
    initialY = spriteY;
    isJumping = true;
  }
}

// Sets movement variables to false based on key release. The handleMovement function then uses these vairables for movement
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

// Applies gravity and checks if you are on the ground
function applyGravity() {
  // Ground Detection
  isGrounded = collideLineRect(0 - 30, height * 0.63, width + 30, height * 0.63, spriteX, spriteY, height/hitboxScale, height/hitboxScale);
  
  if (!isGrounded && !isJumping) {
    spriteY += gravity;
  }

}
