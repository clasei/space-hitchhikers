// screens
const startScreenNode = document.querySelector("#start-screen")
const gameScreenNode = document.querySelector("#game-screen")
const endScreenNode = document.querySelector("#end-screen")

// buttons
const startBtnNode = document.querySelector("#start-btn")

// game-box
const gameBoxNode = document.querySelector("#game-box")


// **********************************************************************
// GLOBAL VARIABLES

let hitchhikerObj = null; // hitchiker created and accesible

let spaceshipsArray = []
let spaceshipsFrequency = 700

let gameIntervalId = null;


// **********************************************************************
// GLOBAL FUNCTIONS

// start game function
function startGame() {
  // console.log('start click')

  // change start to game screen
  startScreenNode.style.display = "none"
  gameScreenNode.style.display = "flex"

  hitchhikerObj = new Hitchhiker() 
  // spaceshipObj = new Spaceship() // not needed, array created

  // GAME-INTERVAL CREATED BELOW
  gameIntervalId = setInterval(() => {
    // console.log('interval running')
    gameLoop() // this function will be executed each 60"
  }, Math.round(1000/60))

  spaceshipsIntervalId = setInterval(() => {
    moveSpaceship()
  }, spaceshipsFrequency)


}

function gameLoop() {
  // console.log('game loop starting')

  spaceshipsArray.forEach((eachSpaceship) => {
    eachSpaceship.moveDown()
  })

  detectSpaceshipColision()

}

function moveSpaceship() {

  let randomPositionX = Math.random() * (gameBoxNode.offsetWidth - 37)

  let newSpaceship = new Spaceship(randomPositionX)
  spaceshipsArray.push(newSpaceship)
  // console.log(spaceshipsArray)

}

function detectSpaceshipColision() {

  spaceshipsArray.forEach((eachSpaceship) => {

    if (
      hitchhikerObj.x < eachSpaceship.x + eachSpaceship.w &&
      hitchhikerObj.x + hitchhikerObj.w > eachSpaceship.x &&
      hitchhikerObj.y < eachSpaceship.y + eachSpaceship.h &&
      hitchhikerObj.y + hitchhikerObj.h > eachSpaceship.y
    ) {
      console.log('hitchhiker crashed!')
      gameOver()
    }
  })
}

function gameOver() {

  clearInterval(gameIntervalId)
  clearInterval(spaceshipsIntervalId)

  gameScreenNode.style.display = "none"
  endScreenNode.style.display = "flex"
}



// **********************************************************************
// EVENT LISTENERS

// start button click
startBtnNode.addEventListener("click", startGame)

document.addEventListener("keydown", (event) => {
  // console.log('pressing key')

  if (event.key === "ArrowRight") {
    hitchhikerObj.moveX("right")
    // console.log('moving right')
  } else if (event.key === "ArrowLeft") {
    hitchhikerObj.moveX("left")
    // console.log('moving left')
  }
})