// Puzzles and whateverssss
// Heather Grove 
// Oct 9, 2020
//
// Extra for Experts:
// 

// Variable used to change between screens/gamestates, and locations
let state = "play";

//Level Arrays
let levelOne = [];
let levelTwo = [];

//Game setup Variables
let currentLevel;
const LEVELWIDTH = 40;
const LEVELHEIGHT = 20;
let cellSize;

let hasKey = false;
let levelCompleted = false;
let hit = false;
let levelCounter = 1;

//Setting Sprite Position Variables
let batsStanding, batsRight, batsLeft, batsJumping;
let batsXPos = 100;
let batsYPos = 200;

let wingsStanding, wingsRight, wingsLeft, wingsJumping;
let wingsXPos = 410;
let wingsYPos = 200;


//Setting Sprite Movement Variables
let batsIsMovingLeft = false;
let batsIsMovingRight = false; 
let batsIsJumping = false;
let batsYPositionOnGrid, batsXPositionOnGrid;

let wingsIsMovingLeft = false;
let wingsIsMovingRight = false;
let wingsIsJumping = false;
let wingsYPositionOnGrid, wingsXPositionOnGrid;

let batsInitialY, wingsInitialY;

let batsJumpHeight = 70;
let wingsJumpHeight = 100;

let jumpSpeed = 5;
let gravity = 5;
let movementSpeed = 7;

// Sprite managment (Scaling and collision)
let hitboxScale = 20;
let spriteScale = 1.4;

// Sprite Collision Variables
let batsIsGrounded = false;
let wallOnBatsRight = false;
let wallOnBatsLeft = false;
let ceilingAboveBats = false;

let wingsOnRight = false;
let wingsOnLeft = false;
let wingsBelow = false;
let wingsAbove = false;

let wingsIsGrounded = false;
let wallOnWingsRight = false;
let wallOnWingsLeft = false;
let ceilingAboveWings = false;

let batsOnRight = false;
let batsOnLeft = false;
let batsBelow = false;
let batsAbove = false;

// Loads all Images and first level
function preload() {
  levelOne = loadStrings("assets/level1.txt");
  levelTwo = loadStrings("assets/level2.txt");

  //Sprite Bats images
  batsStanding = loadImage("assets/characters/bats-standing.png");
  batsRight = loadImage("assets/characters/bats-running-right.png");
  batsLeft = loadImage("assets/characters/bats-running-left.png");
  batsJumping = loadImage("assets/characters/bats-jumping.png");

  //Sprite Wings images
  wingsStanding = loadImage("assets/characters/wings-standing.png");
  wingsRight = loadImage("assets/characters/wings-running-right.png");
  wingsLeft = loadImage("assets/characters/wings-running-left.png");
  wingsJumping = loadImage("assets/characters/wings-jumping.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(30);

  currentLevel = levelOne;

  if (height > width) {
    cellSize = windowWidth / LEVELWIDTH;
  }
  else {
    cellSize = windowHeight / LEVELHEIGHT;
  }

  // convert currentLevel into 2d array
  for (let i=0; i<currentLevel.length; i++) {
    currentLevel[i] = currentLevel[i].split(" ");
  }

}

function draw() {
  
  if (state === "play") {
    background(225);
    whereTheSpritesAre();
    displayLevel();

    displaySpriteBats();
    displaySpriteWings();

    handleMovement();
    applyGravity();
  }

  if (state === "level Passed") {
    background(0);
    levelPassedScreen();
  }

  if (state === "level Failed") {
    background(0);
    levelFailedScreen();
  }
}

function mousePressed() { //REMOVE AFTER DEBUGGING
  console.log(currentLevel);
}

function displaySpriteBats() {
  imageMode(CENTER);

  if (batsIsJumping) {
    image(batsJumping, batsXPos, batsYPos, batsJumping.width, batsJumping.height);
  }
  else if (batsIsMovingLeft) {
    image(batsLeft, batsXPos, batsYPos, batsLeft.width, batsLeft.height);
  }
  else if (batsIsMovingRight) {
    image(batsRight, batsXPos, batsYPos, batsRight.width, batsRight.height);
  }
  else {
    image(batsStanding, batsXPos, batsYPos, batsStanding.width, batsStanding.height);
  }
}

function displaySpriteWings() {
  imageMode(CENTER);

  if (wingsIsJumping) {
    image(wingsJumping, wingsXPos, wingsYPos, wingsJumping.width * spriteScale, wingsJumping.height * spriteScale);
  }
  else if (wingsIsMovingLeft) {
    image(wingsLeft, wingsXPos, wingsYPos, wingsLeft.width * spriteScale, wingsLeft.height * spriteScale);
  }
  else if (wingsIsMovingRight) {
    image(wingsRight, wingsXPos, wingsYPos, wingsRight.width * spriteScale, wingsRight.height * spriteScale);
  }
  else {
    image(wingsStanding, wingsXPos, wingsYPos, wingsStanding.width * spriteScale, wingsStanding.height * spriteScale);
  }
}

function whereTheSpritesAre() {
  batsYPositionOnGrid = round(batsYPos / cellSize);
  batsXPositionOnGrid = round(batsXPos / cellSize);

  wingsYPositionOnGrid = round(wingsYPos / cellSize);
  wingsXPositionOnGrid = round(wingsXPos / cellSize);
}

function keyPressed() {

  if (key === "a") {
    batsIsMovingLeft = true;
  }
  if (key === "d") {
    batsIsMovingRight = true;
  }
  if (key === "w" && batsIsGrounded) {
    batsInitialY = batsYPos;
    batsIsJumping = true;
  }

  if (keyCode === LEFT_ARROW) {
    wingsIsMovingLeft = true;
  }
  if (keyCode === RIGHT_ARROW) {
    wingsIsMovingRight = true;
  }
  if (keyCode === UP_ARROW && wingsIsGrounded) {
    wingsInitialY = wingsYPos;
    wingsIsJumping = true;
  }
}

function keyReleased() {
  if (key === "a") {
    batsIsMovingLeft = false;
  }
  if (key === "d") {
    batsIsMovingRight = false;
  }
  if (key === "w") {
    batsIsJumping = false;
  }

  if (keyCode === LEFT_ARROW) {
    wingsIsMovingLeft = false;
  }
  if (keyCode === RIGHT_ARROW) {
    wingsIsMovingRight = false;
  }
  if (keyCode === UP_ARROW) {
    wingsIsJumping = false;
  }
}

function handleMovement() {
  //Check for Collision before Moving
  collisionDetection();
  characterCollision();

  if (state === "play") {
    //Sprite Bats movement
    if (ceilingAboveBats) {
      batsJumpHeight = 30;
    }
    else {
      batsJumpHeight = 70;
    }

    if (batsIsMovingLeft && !wallOnBatsLeft && !wingsOnLeft) {
      batsXPos -= movementSpeed;
    }

    if (batsIsMovingRight && !wallOnBatsRight && !wingsOnRight) {
      batsXPos += movementSpeed;
    }

    if (batsIsJumping) {
      if (batsYPos >= batsInitialY - batsJumpHeight) {
        batsYPos -= jumpSpeed;
      }
      else {
        batsIsJumping = false;
      }
    }

    //Sprite Wings Movement
    if (ceilingAboveWings) {
      wingsJumpHeight = 30;
    }
    else {
      wingsJumpHeight = 100;
    }

    if (wingsIsMovingLeft && !wallOnWingsLeft) {
      wingsXPos -= movementSpeed;
    }

    if (wingsIsMovingRight && !wallOnWingsRight) {
      wingsXPos += movementSpeed;
    }

    if (wingsIsJumping) {
      if (wingsYPos >= wingsInitialY - wingsJumpHeight) {
        wingsYPos -= jumpSpeed;
      }
      else {
        wingsIsJumping = false;
      }
    }
  }
}

function applyGravity() {
  if (state === "play") {
    //Setting temporary variables to help with floor collision
    let tempBatsYPosOnGrid = round((batsYPos + 5) / cellSize);
    let tempBatsXPosOnGrid = floor(batsXPos / cellSize);
    let tempWingsYPosOnGrid = round((wingsYPos + 5) / cellSize);
    let tempWingsXPosOnGrid = floor(wingsXPos / cellSize);

    // Ground Detection for Sprite Bats
    if (currentLevel[tempBatsYPosOnGrid][tempBatsXPosOnGrid] === "+" || wingsBelow) {
      batsIsGrounded = true;
    }
    else {
      batsIsGrounded = false;
    }
    
    //Apply gravity to Sprite Bats
    if (!batsIsGrounded && !batsIsJumping) {
      batsYPos += gravity;
    }
    
    //Ground Detection for Sprite Wings
    if (currentLevel[tempWingsYPosOnGrid][tempWingsXPosOnGrid] === "+" || batsBelow) {
      wingsIsGrounded = true;
    }
    else {
      wingsIsGrounded = false;
    }
    
    //Apply Gravity to Sprite Wings
    if (!wingsIsGrounded && !wingsIsJumping) {
      wingsYPos += gravity;
    }
  }
}

function collisionDetection() {
  if (currentLevel[batsYPositionOnGrid][batsXPositionOnGrid] === "!" || currentLevel[batsYPositionOnGrid][batsXPositionOnGrid - 1] === "!") {
    state = "level Failed";
  }
  if (currentLevel[wingsYPositionOnGrid][wingsXPositionOnGrid] === "!" || currentLevel[wingsYPositionOnGrid][wingsXPositionOnGrid - 1] === "!") {
    state = "level Failed";
  }

  //Wall and ceilling check

  //Bats Sprite Collision
  if (currentLevel[batsYPositionOnGrid][batsXPositionOnGrid - 1] === "+") {
    wallOnBatsLeft = true;
  }
  else {
    wallOnBatsLeft = false;
  }

  if (currentLevel[batsYPositionOnGrid][batsXPositionOnGrid] === "+") {
    wallOnBatsRight = true;
  }
  else {
    wallOnBatsRight = false;
  }

  if (currentLevel[batsYPositionOnGrid - 1][batsXPositionOnGrid] === "+") {
    ceilingAboveBats = true;
  }
  else {
    ceilingAboveBats = false;
  }

  //Wings Sprite Collision
  if (currentLevel[wingsYPositionOnGrid][wingsXPositionOnGrid - 1] === "+") {
    wallOnWingsLeft = true;
  }
  else {
    wallOnWingsLeft = false;
  }

  if (currentLevel[wingsYPositionOnGrid][wingsXPositionOnGrid] === "+") {
    wallOnWingsRight = true;
  }
  else {
    wallOnWingsRight = false;
  }

  if (currentLevel[wingsYPositionOnGrid - 1][wingsXPositionOnGrid] === "+") {
    ceilingAboveWings = true;
  }
  else {
    ceilingAboveWings = false;
  }

  //Key and door check

  //Bats Sprite Collision
  if (currentLevel[batsYPositionOnGrid][batsXPositionOnGrid] === "*") {
    console.log("Key collected");
    hasKey = true;
    currentLevel[batsYPositionOnGrid][batsXPositionOnGrid] = "0";
  }

  if (currentLevel[batsYPositionOnGrid][batsXPositionOnGrid] === "?" && hasKey) {
    state = "level Passed";
    loadNextLevel();
  }

  //Wings Sprite Collision
  if (currentLevel[wingsYPositionOnGrid][wingsXPositionOnGrid] === "*") {
    console.log("Key collected");
    hasKey = true;
    currentLevel[wingsYPositionOnGrid][wingsXPositionOnGrid] = "0";
  }

  if (currentLevel[wingsYPositionOnGrid][wingsXPositionOnGrid] === "?" && hasKey) {
    state = "level Passed";
    loadNextLevel();
  }
}

function characterCollision() {
  let halfOfWingsWidth = wingsStanding.width * spriteScale / 2;
  let halfOfWingsHeight = wingsStanding.height * spriteScale / 2;

  let halfOfBatsWidth = batsStanding.width /2;
  let halfOfBatsHeight = batsStanding.height /2;

  // //Sprite Bats running into Sprite Wings
  // if (batsXPos >= wingsXPos - wingsXAndWidth && batsXPos < wingsXPos + wingsXAndWidth && 
  //   batsYPos <= wingsYPos + wingsXAndHeight && batsYPos >= wingsYPos - wingsXAndHeight) {

  //   wingsOnRight = true;
  // }
  // else {
  //   wingsOnRight = false;
  // }

  // if (batsXPos <= wingsXPos + wingsXAndWidth && batsXPos > wingsXPos + wingsXAndWidth && 
  //   batsYPos <= wingsYPos + wingsXAndHeight && batsYPos >= wingsYPos - wingsXAndHeight) {

  //   wingsOnLeft = true;
  // }
  // else {
  //   wingsOnLeft = false;
  // }

  if (batsYPos <= wingsYPos + halfOfWingsHeight && batsYPos > wingsYPos - 50 && batsXPos >= wingsXPos -halfOfWingsWidth && batsXPos <= wingsXPos + halfOfWingsWidth) {
    wingsBelow = true;
  }

  else {
    wingsBelow = false;
  }

  if (wingsYPos <= batsYPos + halfOfBatsHeight && wingsYPos > batsYPos - 50 && wingsXPos >= batsXPos -halfOfBatsWidth && wingsXPos <= batsXPos + halfOfBatsWidth) {
    batsBelow = true;
  }

  else {
    batsBelow = false;
  }

}

function loadNextLevel() {
  levelCounter++;

  if (levelCounter === 2) {
    batsXPos = 100;
    batsYPos = 100;
    wingsXPos = 300;
    wingsYPos = 300;

    currentLevel = levelTwo;
  }

  else {
    endGame();
  }

  // convert currentLevel into 2d array
  for (let i=0; i<currentLevel.length; i++) {
    currentLevel[i] = currentLevel[i].split(" ");
  }
}

function levelPassedScreen() {
  textAlign(CENTER, CENTER);
  textSize(60);
  fill("white");
  text("Congrats!", width / 2, height / 4);
  text("Level " + levelCounter + " Passed!", width /2, height / 3);

  textSize(50);
  textAlign(LEFT, TOP);
  text("Play Next Level", width * 0.6, height * 0.7);
  if (mouseX > width * 0.6 && mouseX < width * 0.8 && mouseY > height * 0.7 && mouseY < height * 0.8 && mouseIsPressed){
    state = "play";
  }
}

function levelFailedScreen() {
  fill(255);
  textSize(60);
  textAlign(CENTER, CENTER);
  text("Whoopsie, looks like you slipped up", width / 2, height / 4);

  if (currentLevel === levelOne) {
    wingsXPos = 410;
    wingsYPos = 200;
    batsXPos = 100;
    batsYPos = 200;
  }

  textSize(50);
  textAlign(LEFT, TOP);
  text("Try Again", width * 0.6, height * 0.7);
  if (mouseX > width * 0.6 && mouseX < width * 0.8 && mouseY > height * 0.7 && mouseY < height * 0.8 && mouseIsPressed){
    console.log("State is now play");
    state = "play";
  }
}

function endGame() {
  state = "game Ended";

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

        if (currentLevel[y][x] === "*") {
          //Key
          fill("yellow");
          rect(x * cellSize, y * cellSize, cellSize, cellSize);
        }

      }
    }
  }   
}