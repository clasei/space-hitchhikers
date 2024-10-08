// screens
const startScreenNode = document.querySelector("#start-screen")
const gameScreenNode = document.querySelector("#game-screen")
const endScreenNode = document.querySelector("#end-screen")
const winScreenNode = document.querySelector("#win-screen")

// buttons
const startBtnNode = document.querySelector("#start-btn")
const againBtnNode = document.querySelector("#play-again-btn")
const winBtnNode = document.querySelector("#play-again-btn-win")

const playerScoreDisplay = document.querySelector("#player-total-score")
const winnerScoreDisplay = document.querySelector("#winner-total-score")

// game-box
const gameBoxNode = document.querySelector("#game-box")
  // timer
  const timeDisplayNode = document.querySelector("#time-display")
  // crashed-spaceships-counter
  const totalTowelsNode = document.querySelector("#total-towels")
  // towel-counter
  const totalCollisionsNode = document.querySelector("#total-collisions")
  // life-bar
  const lifeBarNode = document.querySelector("#life-bar")
  // shoot-message
  const messageShoot = document.querySelector("#shoot-available-message")

// player
let playerNameInput = document.querySelector("#playerName")

// audio
let spaceThemeSong = new Audio("./assets/audio/space-hitchhiker-song.mp3")
    spaceThemeSong.volume = 0.02
let explosionEffect = new Audio("./assets/audio/explosion_002.wav")
    explosionEffect.volume = 0.0025
let lastExplosionEffect = new Audio("./assets/audio/last-explosion.wav")
    lastExplosionEffect.volume = 0.20
let bulletEffect = new Audio("./assets/audio/space-bullet.wav")
    bulletEffect.volume = 0.04
let towelEffect = new Audio("./assets/audio/catch-towel.wav")
    towelEffect.volume = 0.025
let immunityEffect = new Audio("./assets/audio/immunity-effect.mp3")
    immunityEffect.volume = 0.015
    immunityEffect.playbackRate = 0.60
let youWin = new Audio("./assets/audio/you-win.wav")
    youWin.volume = 0.20
    youWin.playbackRate = 0.45

const musicOffIcon = document.querySelector("#music-off")
musicOffIcon.src = "./assets/sound-off.svg"
musicOffIcon.style.filter = "invert(100%)"

const musicOnIcon = document.querySelector("#music-on")
musicOnIcon.src = "./assets/sound-on.svg"
musicOnIcon.style.filter = "invert(100%)"

// **********************************************************************
// GLOBAL VARIABLES

let hitchhikerObj = null // hitchiker created and accesible

// game
let isGameRunning = false
let isGameEnding = false
let playerTotalScore = 0

let gameIntervalId = null
let timerIntervalId = null
let spaceshipsIntervalId = null
let towelIntervalId = null
let increaseSpeedIntervalId = null

let isMusicPlaying = false

let collisionCount = 0
let towelCount = 0
let damageCount = 0

let timer = 0
let winningTime = 260 // ==> 4'20" == 260" seconds = winning time

let spaceshipsArray = []
let bulletsArray = []
let towelArray = []

let towelSpeed = 6
let spaceshipSpeed = 3
let bulletSpeed = 9

let spaceshipsFrequency = 1300
let towelFrequency = 2700

let totalCollisionsGameOver = 5
let towelShoot = 42

// player
let playerName = ""


// **********************************************************************
// GLOBAL FUNCTIONS

// start game function
function startGame() {

  isGameEnding = false
  isGameRunning = true
  playerTotalScore = 0

  spaceThemeSong.play()
  spaceThemeSong.loop = true

  playerName = playerNameInput.value

  clearAllIntervals()

  spaceshipsFrequency = 1300
  spaceshipSpeed = 3
  towelFrequency = 2700
  towelSpeed = 6 // added here in case it's increased in the future

  startScreenNode.style.display = "none"
  gameScreenNode.style.display = "flex"
  hitchhikerObj = new Hitchhiker() 
  messageShoot.style.display = "none"

  gameIntervalId = setInterval(() => {
    gameLoop()
  }, Math.round(1000/60))

  spaceshipsIntervalId = setInterval(() => {
    moveSpaceship()
  }, spaceshipsFrequency)

  towelIntervalId = setInterval(() => {
    throwTowel()
  }, towelFrequency)

  timerIntervalId = setInterval(() => {
    timer++
    checkTimer()
    updateTimeDisplay()
  }, 1000)

  towelCount = 0
  updateTowelCounter()
  totalTowelsNode.innerHTML = 0

  collisionCount = 0
  updateTotalCrashedSpaceshipsCounter()
  totalCollisionsNode.innerHTML = 0

  increaseSpaceshipSpeed()
}

function gameLoop() {
  spaceshipsArray.forEach((eachSpaceship) => {
    eachSpaceship.moveDown()
  })

  towelArray.forEach((eachTowel) => {
    eachTowel.flyTowel()
  })

  hitchhikerObj.hitchhikerMovement()
  detectSpaceshipColision()
  updateTotalCrashedSpaceshipsCounter()
  updateTowelCounter()
  catchTowel()
  detectBulletCollision()
  updateBullets()
  removeSkippedSpaceships()
  removeUsedTowels()
}

function convertTime(seconds) {
  let minutes = Math.floor(seconds / 60)
  let secondsLeft = seconds % 60
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
}

function throwTowel() {
  let randomPositionTowel = Math.random() * (gameBoxNode.offsetWidth - 24)
  let newTowel = new Towel(randomPositionTowel, towelSpeed) // towels created
  towelArray.push(newTowel)
}

function showShootAvailableMessage() {

  messageShoot.style.display = "flex";
  setTimeout(() => {
    messageShoot.style.display = "none"
  }, 3000);
}

function hitchhikerShoots() {
  if (towelCount < towelShoot) return

  let bullet = new Bullet(hitchhikerObj.x + hitchhikerObj.w / 2 - 2.5, hitchhikerObj.y - 10, 5) // bullet position
  bulletsArray.push(bullet)
  bulletEffect.play()
}

function updateBullets() {
  bulletsArray.forEach((bullet) => {
    bullet.move();
    detectBulletCollision()
  });
}

function detectBulletCollision() {
  bulletsArray.forEach((eachBullet, bulletIndex) => {
    // spaceshipsArray.forEach((eachSpaceship, spaceshipIndex) => {
      spaceshipsArray.forEach((eachSpaceship) => {
      if (
        eachBullet.x < eachSpaceship.x + eachSpaceship.w &&
        eachBullet.x + eachBullet.width > eachSpaceship.x &&
        eachBullet.y < eachSpaceship.y + eachSpaceship.h &&
        eachBullet.y + eachBullet.height > eachSpaceship.y
      ) {

        if (eachSpaceship.isCrashed) return

        eachBullet.remove()
        bulletsArray.splice(bulletIndex, 1)

        explosionEffect.play()
        eachSpaceship.node.src = "./assets/explosion-0.png"
        eachSpaceship.isCrashed = true

        // removes target from the screen after bullet -->
        setTimeout(() => {
          eachSpaceship.node.remove()
          spaceshipsArray.splice(spaceshipsArray.indexOf(eachSpaceship), 1)
        }, 500)

        collisionCount++
      }
    });
  });
}

function detectSpaceshipColision() {

  spaceshipsArray.forEach((eachSpaceship) => {

    if (isGameEnding) return /// NEW TO AVOID ISSUES WITH LOCAL STORAGE
    if (eachSpaceship.isCrashed) return
    if (hitchhikerObj.isAlive === false) return

    if (
      hitchhikerObj.x < eachSpaceship.x + eachSpaceship.w &&
      hitchhikerObj.x + hitchhikerObj.w > eachSpaceship.x &&
      hitchhikerObj.y < eachSpaceship.y + eachSpaceship.h &&
      hitchhikerObj.y + hitchhikerObj.h > eachSpaceship.y
    ) {

      explosionEffect.volume = 0.02
      explosionEffect.play()
      eachSpaceship.node.src = "./assets/explosion-0.png" // changes image to show
      eachSpaceship.isCrashed = true // avoids multiple detection and stops de function in the loop
      if (eachSpaceship.isCrashed === true) {

        // // removes element from the screen after crash -->
        setTimeout(() => {
          eachSpaceship.node.remove()
          spaceshipsArray.splice(spaceshipsArray.indexOf(eachSpaceship), 1)
        }, 500)
      }

      collisionCount++
      hitchhikerDamaged()
      if (damageCount >= totalCollisionsGameOver) {

        isGameEnding = true // avoids issues with localStorage.js
        if (hitchhikerObj.isAlive === false) return

        lastExplosionEffect.play()
        hitchhikerObj.node.style.transition = "width 0.7s ease, height 0.7s ease"
        hitchhikerObj.node.src = "./assets/explosion-0.png"
        hitchhikerObj.w = 100
        hitchhikerObj.h = 100
        hitchhikerObj.node.style.width = `${hitchhikerObj.w}px`
        hitchhikerObj.node.style.height = `${hitchhikerObj.h}px`

        eachSpaceship.node.style.transition = "width 0.7s ease, height 0.7s ease"
        eachSpaceship.w = 100
        eachSpaceship.h = 100
        eachSpaceship.node.style.width = `${eachSpaceship.w}px`
        eachSpaceship.node.style.height = `${eachSpaceship.h}px`

        hitchhikerObj.isAlive = false

        setTimeout(() => {
          gameOver()
        }, 1000)
      }
    }
  })
}

function hitchhikerDamaged() {
  if (hitchhikerObj.isImmune) return
  damageCount++
  updateLifeBar()
}

function updateLifeBar() {
  let lifePercentage = ((totalCollisionsGameOver - damageCount) / totalCollisionsGameOver) * 100
  lifeBarNode.style.width = `${lifePercentage}%`
}

function removeSkippedSpaceships() {
  spaceshipsArray.forEach((eachSpaceship) => { // index used to remove each element of the array

    if (eachSpaceship.isCrashed === true) return

    // if (eachSpaceship.isCrashed) return 

    if (eachSpaceship.y > gameBoxNode.offsetHeight) {
      eachSpaceship.node.remove() // removes spaceship from the DOM
      spaceshipsArray.splice(spaceshipsArray.indexOf(eachSpaceship), 1)
    }
  })
}

function updateTowelCounter() {
  totalTowelsNode.innerText = towelCount
}

function updateTotalCrashedSpaceshipsCounter() {
  totalCollisionsNode.innerText = collisionCount
}

function catchTowel() {

  towelArray.forEach((eachTowel) => {

    if (eachTowel.isCatched) return
    // if (hitchhikerObj.isImmune) return
    if (hitchhikerObj.isAlive === false) return
    if (damageCount >= totalCollisionsGameOver) return


    if (
      hitchhikerObj.x < eachTowel.x + eachTowel.w &&
      hitchhikerObj.x + hitchhikerObj.w > eachTowel.x &&
      hitchhikerObj.y < eachTowel.y + eachTowel.h &&
      hitchhikerObj.y + hitchhikerObj.h > eachTowel.y
    ) {

      eachTowel.isCatched = true // avoids multiple detection
      towelEffect.play()

      eachTowel.w = 50
      eachTowel.h = 50
      eachTowel.node.style.width = `${eachTowel.w}px`
      eachTowel.node.style.height = `${eachTowel.h}px`
      eachTowel.node.src = "./assets/power-up.png" 

      
      towelCount += 1
      updateTowelCounter()
      if (towelCount === towelShoot) {
        showShootAvailableMessage()
      }
    
      if (hitchhikerObj.isImmune) return
      immunityEffect.play()
      hitchhikerObj.isImmune = true
      
      hitchhikerObj.node.style.transition = "width 0.7s ease, height 0.7s ease"
      hitchhikerObj.node.src = "./assets/hitchhiker-power-up.png"
      hitchhikerObj.w = 26
      hitchhikerObj.h = 64
      hitchhikerObj.node.style.width = `${hitchhikerObj.w}px`
      hitchhikerObj.node.style.height = `${hitchhikerObj.h}px`

      if (isGameEnding) return

      setTimeout(() => { // activates immunity

        hitchhikerObj.isImmune = false
        hitchhikerObj.w = 20
        hitchhikerObj.h = 50
        hitchhikerObj.node.src = "./assets/hitchhiker.png"
        hitchhikerObj.node.style.width = `${hitchhikerObj.w}px`
        hitchhikerObj.node.style.height = `${hitchhikerObj.h}px`
      }, 3000)
    }
  })
}

function removeUsedTowels() {

  towelArray.forEach((eachTowel, index) => { // index used to remove each element of the array
    if (eachTowel.y > gameBoxNode.offsetHeight) {
      eachTowel.node.remove() // removes towel from the DOM
      towelArray.splice(index, 1) // removes towel from the array
    }
  })
}

function increaseSpaceshipSpeed() { // increases speed and frequency

  increaseSpeedIntervalId = setInterval(() => {
    if (spaceshipSpeed >= 7) return
    if (spaceshipsFrequency <= 300) return

    spaceshipSpeed += 0.10
    spaceshipsFrequency -= 40

    clearInterval(spaceshipsIntervalId) // clears interval and applies new speed & frequency
    spaceshipsIntervalId = setInterval(() => {
      moveSpaceship()
    }, spaceshipsFrequency)
  }, 5000)
}

function checkTimer() {
  if (timer > winningTime) {
    isGameEnding = true
    winGame()
  }
}

function totalScore() {
  return ((towelCount * 2 + 1) * (collisionCount * 1 + 1) + ((timer * 2 + 2) * (totalCollisionsGameOver - damageCount + 42)))
}

function stopAudio() {
  if (!spaceThemeSong.paused)
  spaceThemeSong.pause()
  spaceThemeSong.currentTime = 0
}

function clearAllIntervals() {
  
  clearInterval(gameIntervalId)
  clearInterval(spaceshipsIntervalId)
  clearInterval(increaseSpeedIntervalId)
  clearInterval(towelIntervalId)
  clearInterval(timerIntervalId)
}

function gameOver() {

  isGameRunning = false
  stopAudio()
  playerTotalScore = totalScore()
  playerScoreDisplay.innerHTML = playerTotalScore

  saveScoreToLocalStorage();
  displayHighScores("#high-scores-list")
  clearAllIntervals()

  gameScreenNode.style.display = "none"
  endScreenNode.style.display = "flex"
}

function winGame() {

  isGameRunning = false
  stopAudio()
  youWin.play()
  playerTotalScore = totalScore()
  winnerScoreDisplay.innerHTML = playerTotalScore
  saveScoreToLocalStorage()
  displayHighScores("#high-scores-list-win")
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
    eachSpaceship.node.remove()
  });
  spaceshipsArray = []

  towelArray.forEach((eachTowel) => {
    eachTowel.node.remove();
  });
  towelArray = []

  hitchhikerObj.node.remove()
  hitchhikerObj = null
 
  gameIntervalId = null
  spaceshipsIntervalId = null
  towelIntervalId = null

  towelCount = 0
  updateTowelCounter()
  totalTowelsNode.innerHTML = 0

  collisionCount = 0
  updateTotalCrashedSpaceshipsCounter()
  totalCollisionsNode.innerHTML = 0

  timer = 0
  checkTimer()
  updateTimeDisplay()
  timerIntervalId = null

  damageCount = 0
  updateLifeBar()

  spaceshipsFrequency = 1300
  spaceshipSpeed = 3
  towelFrequency = 2700
  towelSpeed = 6

  if (playerNameInput || playerName) {
    playerNameInput.value = ""
    playerName = ""
  }

  playerTotalScore = 0
  playerScoreDisplay.innerHTML = 0
}


// **********************************************************************
// EVENT LISTENERS

// start button click
startBtnNode.addEventListener("click", startGame)

againBtnNode.addEventListener("click", resetGame)

winBtnNode.addEventListener("click", resetGame)

window.addEventListener("keydown", (event) => {

  if (isGameRunning === false) return

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

  if (isGameRunning === false) return

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

document.addEventListener("keydown", (event) => {
  if (isGameRunning === false) return;
  if (event.key === "k") {
    hitchhikerShoots()
  }
})

musicOffIcon.addEventListener('click', () => {
  musicOffIcon.style.display = 'none'
  musicOnIcon.style.display = 'block'
  spaceThemeSong.pause()
})

musicOnIcon.addEventListener('click', () => {
  musicOnIcon.style.display = 'none'
  musicOffIcon.style.display = 'block'
  spaceThemeSong.play()
})