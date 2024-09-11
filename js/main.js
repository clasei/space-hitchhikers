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
  // towel-counter
  const totalTowelsNode = document.querySelector("#total-towels")

  // life-bar
  const lifeBarNode = document.querySelector("#life-bar")

// **********************************************************************
// GLOBAL VARIABLES

let hitchhikerObj = null // hitchiker created and accesible

let spaceshipsArray = []
let spaceshipsFrequency = 1000
let spaceshipSpeed = 3

let towelArray = []
let towelFrequency = 1600
let towelSpeed = 6

let gameIntervalId = null
let spaceshipsIntervalId = null
let towelIntervalId = null
let increaseSpeedIntervalId = null

let collisionCount = 0
let towelCount = 0
let damageCount = 0

let timer = 0
let timerIntervalId = null
let winningTime = 260 // ==> 2' 40'

let totalCollisionsGameOver = 5


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

  towelIntervalId = setInterval(() => {
    throwTowel()
  }, towelFrequency)

  timerIntervalId = setInterval(() => {
    timer++
    // console.log(timer)
    checkTimer()
    updateTimeDisplay()
  }, 1000) // interval increases time after each 1" --> until it reaches 4' 20"

  increaseSpaceshipSpeed()

  towelCount = 0
  updateTowelCounter()
  totalTowelsNode.innerHTML = 0
}

function gameLoop() { // this happens each 60"
  // console.log('game loop starting')
  spaceshipsArray.forEach((eachSpaceship) => {
    eachSpaceship.moveDown()
  })

  towelArray.forEach((eachTowel) => {
    eachTowel.flyTowel()
  })

  hitchhikerObj.hitchhikerMovement()
  detectSpaceshipColision()
  updateTowelCounter()
  catchTowel()
  removeSkippedSpaceships()
  removeUsedTowels()
}

function convertTime(seconds) {
  let minutes = Math.floor(seconds / 60)
  let secondsLeft = seconds % 60
  // .padStart() method available as alternative to display time...
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
    if (hitchhikerObj.isAlive === false) return

    if (
      hitchhikerObj.x < eachSpaceship.x + eachSpaceship.w &&
      hitchhikerObj.x + hitchhikerObj.w > eachSpaceship.x &&
      hitchhikerObj.y < eachSpaceship.y + eachSpaceship.h &&
      hitchhikerObj.y + hitchhikerObj.h > eachSpaceship.y
    ) {
      // console.log('hitchhiker crashed!')

      let explosionEffect = new Audio("./assets/audio/explosion_002.wav")
      explosionEffect.volume = 0.05
      explosionEffect.play()
      eachSpaceship.node.src = "./assets/explosion-0.png" // changes image to show
      eachSpaceship.isCrashed = true // avoids multiple detection and stops de function in the loop

      if (eachSpaceship.isCrashed === true) {

        // // removes element from the screen after crash -->
        setTimeout(() => {
          eachSpaceship.node.remove()
          spaceshipsArray.splice(spaceshipsArray.indexOf(eachSpaceship), 1)
          // console.log('spaceship removed after explosion')
        }, 500)
      }

      collisionCount++
      console.log('spaceship crashed +1')

      hitchhikerDamaged()

      if (damageCount >= totalCollisionsGameOver) {

        if (hitchhikerObj.isAlive === false) return

        let lastExplosionEffect = new Audio("./assets/audio/last-explosion.wav")
        lastExplosionEffect.volume = 0.50
        lastExplosionEffect.play()
        

        hitchhikerObj.node.src = "./assets/explosion-0.png"
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

        hitchhikerObj.isAlive = false

        // if (hitchhikerObj.isAlive === false) return // avoids duplicated last explosion

        setTimeout(() => {
          // if (hitchhikerObj.isAlive === false) return // avoids duplicated last explosion
          console.log('GAME OVER')
          gameOver()
        }, 1000)
      }
    }
  })
}

function hitchhikerDamaged() {
  if (hitchhikerObj.isImmune) return

  damageCount++
  console.log(`total damage: ${damageCount}`)
  updateLifeBar()
}


function updateLifeBar() {
  // let maxCollisions = totalCollisionsGameOver
  // let lifePercentage = ((maxCollisions - collisionCount) / maxCollisions) * 100
  let lifePercentage = ((totalCollisionsGameOver - damageCount) / totalCollisionsGameOver) * 100

  lifeBarNode.style.width = `${lifePercentage}%`

}

function removeSkippedSpaceships() {
  spaceshipsArray.forEach((eachSpaceship, index) => { // index used to remove each element of the array

    if (eachSpaceship.isCrashed === true) return

    // if (eachSpaceship.isCrashed) return 

    if (eachSpaceship.y > gameBoxNode.offsetHeight) {
      eachSpaceship.node.remove() // removes spaceship from the DOM
      spaceshipsArray.shift() // removes spaceship from the array
      // console.log('spaceship removed')
    }
  })
}

function updateTowelCounter() {
  totalTowelsNode.innerText = towelCount;
}

function catchTowel() {

  towelArray.forEach((eachTowel, index) => {

    // if (eachTowel.isCatched) return
    // if (hitchhikerObj.isImmune) return
    if (hitchhikerObj.isAlive === false) return
    if (damageCount >= totalCollisionsGameOver) return


    if (
      hitchhikerObj.x < eachTowel.x + eachTowel.w &&
      hitchhikerObj.x + hitchhikerObj.w > eachTowel.x &&
      hitchhikerObj.y < eachTowel.y + eachTowel.h &&
      hitchhikerObj.y + hitchhikerObj.h > eachTowel.y
    ) {

      if (eachTowel.isCatched) return

      eachTowel.isCatched = true // avoids multiple detection

      let towelEffect = new Audio("./assets/audio/catch-towel.wav")
      towelEffect.volume = 0.05
      towelEffect.play()

      // changes image size in JS
      eachTowel.w = 50
      eachTowel.h = 50
      // changes image size in DOM
      eachTowel.node.style.width = `${eachTowel.w}px`
      eachTowel.node.style.height = `${eachTowel.h}px`
      eachTowel.node.src = "./assets/power-up.png" 

      
      towelCount += 1
      updateTowelCounter()
      console.log(`total towels = ${towelCount}`)
    
      if (hitchhikerObj.isImmune) return

      hitchhikerObj.node.style.transition = "width 0.5s ease, height 0.5s ease"

      hitchhikerObj.isImmune = true
      console.log('immunity activated!')
      let immunityEffect = new Audio("./assets/audio/immunity-effect.wav")
      immunityEffect.volume = 0.07
      immunityEffect.playbackRate = 0.42
      immunityEffect.play()

      hitchhikerObj.node.src = "./assets/hitchhiker-power-up.png"

      hitchhikerObj.w = 26
      hitchhikerObj.h = 64
      hitchhikerObj.node.style.width = `${hitchhikerObj.w}px`
      hitchhikerObj.node.style.height = `${hitchhikerObj.h}px`


      setTimeout(() => { // activates immunity

        hitchhikerObj.isImmune = false
        hitchhikerObj.w = 20
        hitchhikerObj.h = 50
        hitchhikerObj.node.src = "./assets/hitchhiker.png"
        hitchhikerObj.node.style.width = `${hitchhikerObj.w}px`
        hitchhikerObj.node.style.height = `${hitchhikerObj.h}px`
      }, 4750)
    }
  })
}

function removeUsedTowels() {

  towelArray.forEach((eachTowel, index) => { // index used to remove each element of the array

    // if (eachTowel.isCatched) return

    if (eachTowel.y > gameBoxNode.offsetHeight) {
      eachTowel.node.remove() // removes towel from the DOM
      towelArray.splice(index, 1) // removes towel from the array
      // console.log('towel removed')
    }
  })
}

function increaseSpaceshipSpeed() { // increases speed and frequency

  increaseSpeedIntervalId = setInterval(() => {
    if (spaceshipSpeed >= 7) return
    if (spaceshipsFrequency <= 300) return

    spaceshipSpeed += 0.5
    spaceshipsFrequency -= 150

    clearInterval(spaceshipsIntervalId) // clears interval and applies new speed & frequency
    spaceshipsIntervalId = setInterval(() => {
      moveSpaceship()
    }, spaceshipsFrequency)

    console.log(`speed = ${spaceshipSpeed} frequency = ${spaceshipsFrequency}`)
  }, 20000)
}

function checkTimer() {
  if (timer > winningTime) {
    winGame()
  }
}

function clearAllIntervals() {
  
  clearInterval(gameIntervalId)
  clearInterval(spaceshipsIntervalId)
  clearInterval(increaseSpeedIntervalId)
  clearInterval(towelIntervalId)
  clearInterval(timerIntervalId)
}

function gameOver() {

  clearAllIntervals()

  gameScreenNode.style.display = "none"
  endScreenNode.style.display = "flex"
}

function winGame() {
  clearAllIntervals()

  gameScreenNode.style.display = "none"
  winScreenNode.style.display = "flex"
}

function resetGame() {

  clearAllIntervals()

  startScreenNode.style.display = "flex"
  gameScreenNode.style.display = "none"
  endScreenNode.style.display = "none"
  winScreenNode.style.display = "none"

  spaceshipsArray.forEach((eachSpaceship) => {
    eachSpaceship.node.remove(); // removes each spaceship's node
  });
  spaceshipsArray = []
  spaceshipsFrequency = 1000

  towelArray.forEach((eachTowel) => {
    eachTowel.node.remove();
  });
  towelArray = []
  towelFrequency = 1500

  hitchhikerObj.node.remove()
  // console.log('hitchhiker removed')
  hitchhikerObj = null
 
  gameIntervalId = null
  spaceshipsIntervalId = null
  towelIntervalId = null
  // increaseSpeedIntervalId = null // executed in increaseSpaceshipSpeed()

  collisionCount = 0
  updateLifeBar()

  towelCount = 0
  updateTowelCounter()
  totalTowelsNode.innerHTML = 0

  timer = 0
  // updates timer to 00:00
  checkTimer()
  updateTimeDisplay()
  timerIntervalId = null

  damageCount = 0
  updateLifeBar()
}


// **********************************************************************
// EVENT LISTENERS

// start button click
startBtnNode.addEventListener("click", startGame)

againBtnNode.addEventListener("click", resetGame)

winBtnNode.addEventListener("click", resetGame)

window.addEventListener("keydown", (event) => {

  if (event.key === "w") {
    hitchhikerObj.keys.up = true;
  } else if (event.key === "s") {
    hitchhikerObj.keys.down = true;
  } else if (event.key === "d") {
    hitchhikerObj.keys.right = true;
  } else if (event.key === "a") {
    hitchhikerObj.keys.left = true;
  }
})
  
window.addEventListener("keyup", (event) => {

  if (event.key === "w") {
    hitchhikerObj.keys.up = false;
  } else if (event.key === "s") {
    hitchhikerObj.keys.down = false;
  } else if (event.key === "a") {
    hitchhikerObj.keys.left = false;
  } else if (event.key === "d") {
    hitchhikerObj.keys.right = false;
  }
})