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
  // timer
  const timeDisplayNode = document.querySelector("#time-display")
  // life-bar
  const lifeBarNode = document.querySelector("#life-bar")

// **********************************************************************
// GLOBAL VARIABLES

let hitchhikerObj = null // hitchiker created and accesible

let spaceshipsArray = []
let spaceshipsFrequency = 700 // Math.random() * 2400
let spaceshipSpeed = 3

let towelArray = []
let towelFrequency = 700
let towelSpeed = 7

let gameIntervalId = null
let spaceshipsIntervalId = null
let towelIntervalId = null
let increaseSpeedIntervalId = null

let collisionCount = 0
let towelCount = 0

let timer = 0
let timerIntervalId = null
let winningTime = 260 // ==> 2' 40'

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
    // detectSpaceshipColision() // kept in game loop
    // removeSkippedSpaceships() // kept in game loop
  }, spaceshipsFrequency)

  towelIntervalId = setInterval(() => {
    throwTowel()
  }, towelFrequency)

  timerIntervalId = setInterval(() => {
    timer++
    console.log(timer)
    checkTimer()
    updateTimeDisplay()
  }, 1000) // increases timer after 1"

  increaseSpaceshipSpeed()
}


function convertTime(seconds) {
  let minutes = Math.floor(seconds / 60)
  let secondsLeft = seconds % 60
  // .padStart() method available as alternative to display time fine...
  if (minutes < 10) {
    minutes = '0' + minutes;
  }
  if (secondsLeft < 10) {
    secondsLeft = '0' + secondsLeft;
  }
  return `${minutes}:${secondsLeft}`;
}

function updateTimeDisplay() {
  timeDisplayNode.innerHTML = convertTime(timer)
}


function gameLoop() { // this happens each 60"
  // console.log('game loop starting')
  spaceshipsArray.forEach((eachSpaceship) => {
    eachSpaceship.moveDown()
  })

  towelArray.forEach((eachTowel) => {
    eachTowel.flyTowel()
  })

  detectSpaceshipColision()
  catchTowel()
  removeSkippedSpaceships()
  removeUsedTowels()
}


function moveSpaceship() { // moves spaceship randomly in X axis
  let randomPositionX = Math.random() * (gameBoxNode.offsetWidth - 37)

  let newSpaceship = new Spaceship(randomPositionX, spaceshipSpeed) // spaceships created
  spaceshipsArray.push(newSpaceship)
  // console.log('NEW SPACESHIP')
}

function throwTowel() {
  let randomPositionTowel = Math.random() * (gameBoxNode.offsetWidth - 24)

  let newTowel = new Towel(randomPositionTowel, towelSpeed) // towels created
  towelArray.push(newTowel)
  // console.log('NEW TOWEL')
}

function detectSpaceshipColision() {

  spaceshipsArray.forEach((eachSpaceship, index) => { // index added to remove each spaceship after collision

    if (eachSpaceship.isCrashed) return

    if (
      hitchhikerObj.x < eachSpaceship.x + eachSpaceship.w &&
      hitchhikerObj.x + hitchhikerObj.w > eachSpaceship.x &&
      hitchhikerObj.y < eachSpaceship.y + eachSpaceship.h &&
      hitchhikerObj.y + hitchhikerObj.h > eachSpaceship.y
    ) {
      // console.log('hitchhiker crashed!')

      let explosionEffect = new Audio("../assets/audio/explosion_002.wav")
      explosionEffect.volume = 0.05
      explosionEffect.play()

      eachSpaceship.isCrashed = true // avoids multiple detection and stop de function in the loop

      eachSpaceship.node.src = "../assets/explosion-0.png" // changes image to show

      

      


      // // removes element from the screen after crash -->
      setTimeout(() => {
        eachSpaceship.node.remove()
        spaceshipsArray.splice(index, 0) // splice instead of shift()? why 0 works?
        // spaceshipsArray.splice(spaceshipsArray.indexOf(eachSpaceship), 1)

      // console.log('spaceship removed after explosion')
      }, 750)

      // eachSpaceship.node.remove()
      // spaceshipsArray.splice(index, 1)
      // collisionCount += 1

      if (hitchhikerObj.isImmune === true) return


      collisionCount += 1
      console.log('spaceship crashed +1')

      if (collisionCount >= 3) {

      let lastExplosionEffect = new Audio("../assets/audio/last-explosion.wav")
      lastExplosionEffect.volume = 0.50
      lastExplosionEffect.play()

        hitchhikerObj.node.src = "../assets/explosion-0.png"
        hitchhikerObj.w = 100
        hitchhikerObj.h = 100
        hitchhikerObj.node.style.width = `${hitchhikerObj.w}px`
        hitchhikerObj.node.style.height = `${hitchhikerObj.h}px`

        // changes image size in JS
        eachSpaceship.w = 100
        eachSpaceship.h = 100
        // changes image size in DOM
        eachSpaceship.node.style.width = `${eachSpaceship.w}px`
        eachSpaceship.node.style.height = `${eachSpaceship.h}px`

        setTimeout(() => {
          gameOver()
        }, 1000)
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

function catchTowel() {

  towelArray.forEach((eachTowel, index) => {

    if (eachTowel.isCatched) return;

    if (
      hitchhikerObj.x < eachTowel.x + eachTowel.w &&
      hitchhikerObj.x + hitchhikerObj.w > eachTowel.x &&
      hitchhikerObj.y < eachTowel.y + eachTowel.h &&
      hitchhikerObj.y + hitchhikerObj.h > eachTowel.y
    ) {
      // console.log('towel catched!')

      // let towelEffect = new Audio("../assets/audio/...")
      // towelEffect.volume = 0.05
      // towelEffect.play()

      eachTowel.isCatched = true // avoids multiple detection
      towelCount += 1
      console.log('towel catched')


      hitchhikerObj.isImmune = true
      console.log('immunity activated!')

      // eachTowel.node.src = "../assets/..." 

      // NEW NEW NEW NEW
      // changes image size in JS
      eachTowel.w = 100
      eachTowel.h = 100
      // changes image size in DOM
      eachTowel.node.style.width = `${eachTowel.w}px`
      eachTowel.node.style.height = `${eachTowel.h}px`

      hitchhikerObj.w = 40
      hitchhikerObj.h = 100
      // hitchhikerObj.node.src = "../assets/..."
      hitchhikerObj.node.style.width = `${hitchhikerObj.w}px`
      hitchhikerObj.node.style.height = `${hitchhikerObj.h}px`
      // NEW NEW NEW NEW

      if (towelCount++) {
        // // removes element from the screen after crash -->
        setTimeout(() => {
          eachTowel.node.remove()
          towelArray.splice(index, 0) // splice instead of shift()? why 0 works?
          // towelArray.splice(towelArray.indexOf(eachTowel), 1)

        // console.log('towel removed after catch!')

        hitchhikerObj.isImmune = false
        hitchhikerObj.w = 20
        hitchhikerObj.h = 50
        // hitchhikerObj.node.src = "../assets/..."
        hitchhikerObj.node.style.width = `${hitchhikerObj.w}px`
        hitchhikerObj.node.style.height = `${hitchhikerObj.h}px`

        }, 5000)
      }
    
      // if (collisionCount >= 3) {

        

      //   setTimeout(() => {
      //     gameOver()
      //   }, 750)
        
      // }
    }
  })

}

function removeUsedTowels() {
  towelArray.forEach((eachTowel, index) => { // index used to remove each element of the array
    if (eachTowel.y > gameBoxNode.offsetHeight) {
      eachTowel.node.remove() // removes towel from the DOM
      towelArray.splice(index, 1) // removes towel from the array
      // console.log('towel removed')
    }
  })
}

function increaseSpaceshipSpeed() {

  increaseSpeedIntervalId = setInterval(() => {
    if (spaceshipSpeed >= 9) {
      return
    }

    spaceshipSpeed += 0.5
    console.log(`spaceship speed increased, speed = ${spaceshipSpeed}`)
  }, 10000)
  
}

function checkTimer() {
  if (timer > winningTime) {
    winGame()
  }
}


function gameOver() {
  clearInterval(gameIntervalId)
  clearInterval(spaceshipsIntervalId)
  clearInterval(increaseSpeedIntervalId)
  clearInterval(towelIntervalId)
  clearInterval(timerIntervalId)

  gameScreenNode.style.display = "none"
  endScreenNode.style.display = "flex"
}

function winGame() {
  clearInterval(gameIntervalId)
  clearInterval(spaceshipsIntervalId)
  clearInterval(increaseSpeedIntervalId)
  clearInterval(towelIntervalId)
  clearInterval(timerIntervalId)

  gameScreenNode.style.display = "none"
  winScreenNode.style.display = "flex"
}


function resetGame() {
  clearInterval(gameIntervalId)
  clearInterval(spaceshipsIntervalId)
  clearInterval(increaseSpeedIntervalId)
  clearInterval(towelIntervalId)
  clearInterval(timerIntervalId)

  startScreenNode.style.display = "flex"
  gameScreenNode.style.display = "none"
  endScreenNode.style.display = "none"
  winScreenNode.style.display = "none"

  spaceshipsArray.forEach((eachSpaceship) => {
    eachSpaceship.node.remove(); // removes each spaceship's node
  });
  spaceshipsArray = []
  spaceshipsFrequency = 700

  towelArray.forEach((eachTowel) => {
    eachTowel.node.remove();
  });
  towelArray = []
  towelFrequency = 700

  hitchhikerObj.node.remove()
  // console.log('hitchhiker removed')
  hitchhikerObj = null
 
  gameIntervalId = null
  spaceshipsIntervalId = null
  towelIntervalId = null
  // increaseSpeedIntervalId = null // executed in increaseSpaceshipSpeed()

  collisionCount = 0

  timer = 0
  // updates timer to 00:00
  checkTimer()
  updateTimeDisplay()
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

  if (event.key === "d") {
    hitchhikerObj.moveX("right")
    // console.log('moving right')
  } else if (event.key === "a") {
    hitchhikerObj.moveX("left")
    // console.log('moving left')
  } else if (event.key === "s") {
    hitchhikerObj.moveY("down")
    // console.log('moving down')
  } else if (event.key === "w") {
    hitchhikerObj.moveY("up")
    // console.log('moving up')
  }
})

// SMOOTH MOVEMENT ALTERNATIVE OPTION -> LOWER hitchhiker.speed to 5

// let keysPressed = {}

// document.addEventListener("keydown", (event) => { // add keys as object player properties + add movement to loop
//   keysPressed[event.key] = true;
// });

// document.addEventListener("keyup", (event) => {
//   keysPressed[event.key] = false;
// });

// function updateMovement() {
//   if (keysPressed["d"]) {
//     hitchhikerObj.moveX("right");
//   }
//   if (keysPressed["a"]) {
//     hitchhikerObj.moveX("left");
//   }
//   if (keysPressed["w"]) {
//     hitchhikerObj.moveY("up");
//   }
//   if (keysPressed["s"]) {
//     hitchhikerObj.moveY("down");
//   }
// }

// setInterval(updateMovement, 16);