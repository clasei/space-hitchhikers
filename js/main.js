// screens
const startScreenNode = document.querySelector("#start-screen")
const gameScreenNode = document.querySelector("#game-screen")
const endScreenNode = document.querySelector("#end-screen")

// buttons
const startBtnNode = document.querySelector("#start-btn")
const againBtnNode = document.querySelector("#play-again-btn")

// game-box
const gameBoxNode = document.querySelector("#game-box")


// **********************************************************************
// GLOBAL VARIABLES

let hitchhikerObj = null // hitchiker created and accesible

let spaceshipsArray = []
let spaceshipsFrequency = 840

let gameIntervalId = null
let spaceshipsIntervalId = null

let collisionCount = 0


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
  removeSkippedSpaceships()

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

      eachSpaceship.isCrashed = true;
      collisionCount += 1
      eachSpaceship.node.src = "../assets/explosion-0.png" // changes image to show

      setTimeout(() => {
        eachSpaceship.node.remove()
        spaceshipsArray.shift()
        console.log('spaceship removed after explosion')
      }, 300)

      // eachSpaceship.node.remove()
      // spaceshipsArray.splice(index, 1)
      // collisionCount += 1

      if (collisionCount >= 3) {
        setTimeout(() => {
          gameOver()
        }, 420)
        
      }
    }
  })
}


function removeSkippedSpaceships() {
  spaceshipsArray.forEach((eachSpaceship, index) => { // index used to remove each element of the array
    if (eachSpaceship.y > gameBoxNode.offsetHeight) {
      eachSpaceship.node.remove() // removes spaceship from the DOM
      spaceshipsArray.splice(index, 1) // removes spaceship from the array
      console.log('spaceship removed')
    }
  })
}


function gameOver() {
  clearInterval(gameIntervalId)
  clearInterval(spaceshipsIntervalId)

  gameScreenNode.style.display = "none"
  endScreenNode.style.display = "flex"
}

// function resetGame() {
//   spaceshipsArray.forEach((eachSpaceship) => {
//     eachSpaceship.node.remove()
//   })
//   spaceshipsArray = []
//   hitchhikerObj = null
// }


// **********************************************************************
// EVENT LISTENERS

// start button click
startBtnNode.addEventListener("click", startGame)

// againBtnNode.addEventListener("click", startGame)

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