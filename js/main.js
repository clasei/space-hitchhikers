// screens
const startScreenNode = document.querySelector("#start-screen")
const gameScreenNode = document.querySelector("#game-screen")
const endScreenNode = document.querySelector("#end-screen")
const winScreenNode = document.querySelector("#win-screen")

// buttons
const startBtnNode = document.querySelector("#start-btn")
const againBtnNode = document.querySelector("#play-again-btn")
const winBtnNode = document.querySelector("#play-again-btn-win")

// game-box
const gameBoxNode = document.querySelector("#game-box")


// **********************************************************************
// GLOBAL VARIABLES

let hitchhikerObj = null // hitchiker created and accesible

let spaceshipsArray = []
let spaceshipsFrequency = 420

let gameIntervalId = null
let spaceshipsIntervalId = null

let collisionCount = 0

let timer = 0
let timerIntervalId = null
let winningTime = 24 // ==> 2' 40'

// **********************************************************************
// GLOBAL FUNCTIONS


// start game function
function startGame() {
  // console.log('start click')
  // change start to game screen
  startScreenNode.style.display = "none"
  gameScreenNode.style.display = "flex"
  hitchhikerObj = new Hitchhiker() 
  // spaceshipObj = new Spaceship() // not needed, array created in moveSpaceship()

  // GAME-INTERVAL CREATED BELOW
  gameIntervalId = setInterval(() => {
    // console.log('interval running')
    gameLoop() // this function will be executed each 60"
  }, Math.round(1000/60))

  spaceshipsIntervalId = setInterval(() => {
    moveSpaceship()
  }, spaceshipsFrequency)

  timerIntervalId = setInterval(() => {
    timer++
    console.log(timer)
    checkTimer()
  }, 1000) // increases timer after 1"
}


function gameLoop() {
  // console.log('game loop starting')
  spaceshipsArray.forEach((eachSpaceship) => {
    eachSpaceship.moveDown()
  })

  detectSpaceshipColision()
  removeSkippedSpaceships()
  // checkTimer() // moved to startGame -> timeIntervalId to be executed each 1"

}


function moveSpaceship() {
  let randomPositionX = Math.random() * (gameBoxNode.offsetWidth - 37)

  let newSpaceship = new Spaceship(randomPositionX)
  spaceshipsArray.push(newSpaceship)
  // console.log(spaceshipsArray)

}

function detectSpaceshipColision() {

  spaceshipsArray.forEach((eachSpaceship, index) => { // index added to remove each spaceship after collision

    if (eachSpaceship.isCrashed) return;

    if (
      hitchhikerObj.x < eachSpaceship.x + eachSpaceship.w &&
      hitchhikerObj.x + hitchhikerObj.w > eachSpaceship.x &&
      hitchhikerObj.y < eachSpaceship.y + eachSpaceship.h &&
      hitchhikerObj.y + hitchhikerObj.h > eachSpaceship.y
    ) {
      console.log('hitchhiker crashed!')

      let explosionEffect = new Audio("../assets/audio/explosion_002.wav")
      explosionEffect.volume = 0.25
      explosionEffect.play()

      eachSpaceship.isCrashed = true;
      collisionCount += 1
      eachSpaceship.node.src = "../assets/explosion-0.png" // changes image to show

      setTimeout(() => {
        eachSpaceship.node.remove()
        spaceshipsArray.splice(index, 0) // splice instead of shift?
        console.log('spaceship removed after explosion')
      }, 500)

      // eachSpaceship.node.remove()
      // spaceshipsArray.splice(index, 1)
      // collisionCount += 1

      if (collisionCount >= 3) {
        setTimeout(() => {
          gameOver()
        }, 500)
        
      }
    }
  })
}


function removeSkippedSpaceships() {
  spaceshipsArray.forEach((eachSpaceship, index) => { // index used to remove each element of the array
    if (eachSpaceship.y > gameBoxNode.offsetHeight) {
      eachSpaceship.node.remove() // removes spaceship from the DOM
      spaceshipsArray.splice(index, 1) // removes spaceship from the array
      // console.log('spaceship removed')
    }
  })
}

function checkTimer() {
  if (timer > winningTime) {
    winGame()
  }
}


function gameOver() {
  clearInterval(gameIntervalId)
  clearInterval(spaceshipsIntervalId)
  clearInterval(timerIntervalId)

  gameScreenNode.style.display = "none"
  endScreenNode.style.display = "flex"
}

function winGame() {
  clearInterval(gameIntervalId)
  clearInterval(spaceshipsIntervalId)
  clearInterval(timerIntervalId)

  gameScreenNode.style.display = "none"
  winScreenNode.style.display = "flex"
}


function resetGame() {
  clearInterval(gameIntervalId)
  clearInterval(spaceshipsIntervalId)
  clearInterval(timerIntervalId)

  startScreenNode.style.display = "flex"
  gameScreenNode.style.display = "none"
  endScreenNode.style.display = "none"
  winScreenNode.style.display = "none"

  spaceshipsArray.forEach((eachSpaceship) => {
    eachSpaceship.node.remove(); // Ensure each spaceship's node is removed
  });
  spaceshipsArray = []
  spaceshipsFrequency = 1000

  hitchhikerObj.node.remove()
  // console.log('hitchhiker removed')
  // if (hitchhikerObj) {
  //   hitchhikerObj.node.remove(); // hitchhiker's node removed
  // }
  hitchhikerObj = null
 
  gameIntervalId = null
  spaceshipsIntervalId = null

  collisionCount = 0

  timer = 0
  timerIntervalId = null
}


// **********************************************************************
// EVENT LISTENERS

// start button click
startBtnNode.addEventListener("click", startGame)

againBtnNode.addEventListener("click", resetGame)

winBtnNode.addEventListener("click", resetGame)

document.addEventListener("keydown", (event) => {
  // console.log('pressing key')

  if (event.key === "ArrowRight") {
    hitchhikerObj.moveX("right")
    // console.log('moving right')
  } else if (event.key === "ArrowLeft") {
    hitchhikerObj.moveX("left")
    // console.log('moving left')
  } else if (event.key === "ArrowDown") {
    hitchhikerObj.moveY("down")
    // console.log('moving down')
  } else if (event.key === "ArrowUp") {
    hitchhikerObj.moveY("up")
    // console.log('moving up')
  }
})