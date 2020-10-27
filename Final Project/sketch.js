// Puzzles and whateverssss
// Heather Grove 
// Oct 9, 2020

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
let hitbox = 30;
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

  //Setting cellSize based on window size
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

  if (state === "game Ended") {
    background(0);
    gameEndedScreen();
  }
}

function displaySpriteBats() {
  imageMode(CENTER);

  //Display jumping image if jumping
  if (batsIsJumping) {
    image(batsJumping, batsXPos, batsYPos, batsJumping.width, batsJumping.height);
  }
  //Display moving left if moving left
  else if (batsIsMovingLeft) {
    image(batsLeft, batsXPos, batsYPos, batsLeft.width, batsLeft.height);
  }
  //Display moving right if moving Right
  else if (batsIsMovingRight) {
    image(batsRight, batsXPos, batsYPos, batsRight.width, batsRight.height);
  }
  //Else display standing
  else {
    image(batsStanding, batsXPos, batsYPos, batsStanding.width, batsStanding.height);
  }
}

function displaySpriteWings() {
  imageMode(CENTER);
  //Display jumping image if jumping
  if (wingsIsJumping) {
    image(wingsJumping, wingsXPos, wingsYPos, wingsJumping.width * spriteScale, wingsJumping.height * spriteScale);
  }
  //Display moving left if moving left
  else if (wingsIsMovingLeft) {
    image(wingsLeft, wingsXPos, wingsYPos, wingsLeft.width * spriteScale, wingsLeft.height * spriteScale);
  }
  //Display moving right if moving Right
  else if (wingsIsMovingRight) {
    image(wingsRight, wingsXPos, wingsYPos, wingsRight.width * spriteScale, wingsRight.height * spriteScale);
  }
  //Else display standing
  else {
    image(wingsStanding, wingsXPos, wingsYPos, wingsStanding.width * spriteScale, wingsStanding.height * spriteScale);
  }
}

function whereTheSpritesAre() {
  //Find Sprite bats' position on the grid
  batsYPositionOnGrid = round(batsYPos / cellSize);
  batsXPositionOnGrid = round(batsXPos / cellSize);

  //Find Sprite wings' position on the grid
  wingsYPositionOnGrid = round(wingsYPos / cellSize);
  wingsXPositionOnGrid = round(wingsXPos / cellSize);
}

function keyPressed() {
  //Bats movement
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

  //Wings movement
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
  //Bats movement
  if (key === "a") {
    batsIsMovingLeft = false;
  }
  if (key === "d") {
    batsIsMovingRight = false;
  }
  if (key === "w") {
    batsIsJumping = false;
  }

  //wings movement
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
    //Reduce jump height to prevent jumping through ceiling
    if (ceilingAboveBats) {
      batsJumpHeight = 30;
    }
    else {
      batsJumpHeight = 70;
    }

    //Move left
    if (batsIsMovingLeft && !wallOnBatsLeft && !wingsOnLeft) {
      batsXPos -= movementSpeed;
    }

    //Move right
    if (batsIsMovingRight && !wallOnBatsRight && !wingsOnRight) {
      batsXPos += movementSpeed;
    }

    //Jump
    if (batsIsJumping && !wingsAbove) {
      if (batsYPos >= batsInitialY - batsJumpHeight) {
        batsYPos -= jumpSpeed;
      }
      else {
        batsIsJumping = false;
      }
    }

    //Sprite Wings Movement
    //Reduce jump height to prevent jumping through ceiling
    if (ceilingAboveWings) {
      wingsJumpHeight = 30;
    }
    else {
      wingsJumpHeight = 100;
    }

    //Move left
    if (wingsIsMovingLeft && !wallOnWingsLeft && !batsOnLeft) {
      wingsXPos -= movementSpeed;
    }

    //Move Right
    if (wingsIsMovingRight && !wallOnWingsRight && !batsOnRight) {
      wingsXPos += movementSpeed;
    }

    //Jump
    if (wingsIsJumping && !batsAbove) {
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
  //Collision with danger check
  if (currentLevel[batsYPositionOnGrid][batsXPositionOnGrid] === "!" || currentLevel[batsYPositionOnGrid][batsXPositionOnGrid - 1] === "!") {
    state = "level Failed";
  }
  if (currentLevel[wingsYPositionOnGrid][wingsXPositionOnGrid] === "!" || currentLevel[wingsYPositionOnGrid][wingsXPositionOnGrid - 1] === "!") {
    state = "level Failed";
  }

  //Wall and ceilling check

  //Bats Sprite Collision
  //Wall on left
  if (currentLevel[batsYPositionOnGrid][batsXPositionOnGrid - 1] === "+") {
    wallOnBatsLeft = true;
  }
  else {
    wallOnBatsLeft = false;
  }

  //wall on right
  if (currentLevel[batsYPositionOnGrid][batsXPositionOnGrid] === "+") {
    wallOnBatsRight = true;
  }
  else {
    wallOnBatsRight = false;
  }

  //Ceiling above
  if (currentLevel[batsYPositionOnGrid - 1][batsXPositionOnGrid] === "+") {
    ceilingAboveBats = true;
  }
  else {
    ceilingAboveBats = false;
  }

  //Wings Sprite Collision
  //Wall on left
  if (currentLevel[wingsYPositionOnGrid][wingsXPositionOnGrid - 1] === "+") {
    wallOnWingsLeft = true;
  }
  else {
    wallOnWingsLeft = false;
  }

  //Wall on right
  if (currentLevel[wingsYPositionOnGrid][wingsXPositionOnGrid] === "+") {
    wallOnWingsRight = true;
  }
  else {
    wallOnWingsRight = false;
  }

  //Ceiling above
  if (currentLevel[wingsYPositionOnGrid - 1][wingsXPositionOnGrid] === "+") {
    ceilingAboveWings = true;
  }
  else {
    ceilingAboveWings = false;
  }

  //Key and door check

  //Bats Sprite Collision
  //Key check
  if (currentLevel[batsYPositionOnGrid][batsXPositionOnGrid] === "*") {
    console.log("Key collected");
    hasKey = true;
    currentLevel[batsYPositionOnGrid][batsXPositionOnGrid] = "0";
  }

  //Door check
  if (currentLevel[batsYPositionOnGrid][batsXPositionOnGrid] === "?" && hasKey) {
    state = "level Passed";
    loadNextLevel();
  }

  //Wings Sprite Collision
  //Key check
  if (currentLevel[wingsYPositionOnGrid][wingsXPositionOnGrid] === "*") {
    console.log("Key collected");
    hasKey = true;
    currentLevel[wingsYPositionOnGrid][wingsXPositionOnGrid] = "0";
  }

  //Door check
  if (currentLevel[wingsYPositionOnGrid][wingsXPositionOnGrid] === "?" && hasKey) {
    state = "level Passed";
    loadNextLevel();
  }
}

function characterCollision() {
  //Setting alternate hitboxes
  let halfOfWingsWidth = wingsStanding.width * spriteScale / 2;
  let halfOfWingsHeight = wingsStanding.height * spriteScale / 2;

  let halfOfBatsWidth = batsStanding.width /2;
  let halfOfBatsHeight = batsStanding.height /2;

  //Sprite Bats running into Sprite Wings
  //Sprite wings is on right side
  if (batsXPos >= wingsXPos - hitbox && batsXPos < wingsXPos + halfOfWingsWidth && 
    batsYPos <= wingsYPos + halfOfWingsHeight && batsYPos >= wingsYPos - halfOfWingsHeight) {

    wingsOnRight = true;
  }
  else {
    wingsOnRight = false;
  }

  //Sprite wings is on left side
  if (batsXPos <= wingsXPos + hitbox && batsXPos > wingsXPos + halfOfWingsWidth && 
     batsYPos <= wingsYPos + halfOfWingsHeight && batsYPos >= wingsYPos - halfOfWingsHeight) {

    wingsOnLeft = true;
  }
  else {
    wingsOnLeft = false;
  }

  //Sprite wings is below
  if (batsYPos <= wingsYPos + halfOfWingsHeight && batsYPos > wingsYPos - 50 && batsXPos >= wingsXPos -halfOfWingsWidth && batsXPos <= wingsXPos + halfOfWingsWidth) {
    wingsBelow = true;
    batsAbove = true;
  }

  else {
    wingsBelow = false;
    batsAbove = false;
  }

  //Sprite Wings running into Sprite Bats
  //Sprite Bats is on right side
  if (wingsXPos >= batsXPos - hitbox && wingsXPos < batsXPos + halfOfBatsWidth && 
    wingsYPos <= batsYPos + halfOfBatsHeight && wingsYPos >= batsYPos - halfOfBatsHeight) {

    batsOnRight = true;
  }
  else {
    batsOnRight = false;
  }

  //Sprite Bats is on left side
  if (wingsXPos <= batsXPos + hitbox && wingsXPos > batsXPos + halfOfBatsWidth && 
    wingsYPos <= batsYPos + halfOfBatsHeight && wingsYPos >= batsYPos - halfOfBatsHeight) {

    batsOnLeft = true;
  }
  else {
    batsOnLeft = false;
  }

  //Sprite Bats is Below
  if (wingsYPos <= batsYPos + halfOfBatsHeight && wingsYPos > batsYPos - 50 && wingsXPos >= batsXPos -halfOfBatsWidth && wingsXPos <= batsXPos + halfOfBatsWidth) {
    batsBelow = true;
    wingsAbove = true;
  }
  else {
    batsBelow = false;
    wingsAbove = false;
  }

}

function loadNextLevel() {
  levelCounter++;

  //Load level two
  if (levelCounter === 2) {
    batsXPos = 100;
    batsYPos = 700;
    wingsXPos = 150;
    wingsYPos = 700;

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
  //Congrats text
  textAlign(CENTER, CENTER);
  textSize(60);
  fill("white");
  text("Congrats!", width / 2, height / 4);
  text("Level " + levelCounter + " Passed!", width /2, height / 3);

  //Next level text (Button)
  textSize(50);
  textAlign(LEFT, TOP);
  text("Play Next Level", width * 0.6, height * 0.7);
  if (mouseX > width * 0.6 && mouseX < width * 0.8 && mouseY > height * 0.7 && mouseY < height * 0.8 && mouseIsPressed){
    state = "play";
  }
}

function levelFailedScreen() {
  //Whoopsies text
  fill(255);
  textSize(60);
  textAlign(CENTER, CENTER);
  text("Whoopsie, looks like you slipped up", width / 2, height / 4);

  //resetting levels
  if (currentLevel === levelOne) {
    wingsXPos = 410;
    wingsYPos = 200;
    batsXPos = 100;
    batsYPos = 200;

    currentLevel = levelOne;
  }

  if (currentLevel === levelTwo) {
    batsXPos = 100;
    batsYPos = 700;
    wingsXPos = 150;
    wingsYPos = 700;

    currentLevel = levelTwo;
  }

  //Try again text
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

function gameEndedScreen() {
  textSize(50);
  textAlign(LEFT, TOP);
  fill("white");
  text("Thanks for playing!", width * 0.6, height * 0.7);
  noLoop();
}

function displayLevel() {
  //Displaying Grid
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