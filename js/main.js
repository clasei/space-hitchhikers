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





// **********************************************************************
// GLOBAL FUNCTIONS

// // initiate game; shows only start-screen at the beginning --> not needed, applied in CSS
// function initializeGame() {
//   startScreenNode.style.display = "flex"
//   gameScreenNode.style.display = "none"
//   endScreenNode.style.display = "none"
// }

// start game function
function startGame() {
  // console.log('start click')

  // change start to game screen
  startScreenNode.style.display = "none"
  gameScreenNode.style.display = "flex"

  hitchhikerObj = new Hitchhiker() 



}



// **********************************************************************
// EVENT LISTENERS

// start button click
startBtnNode.addEventListener("click", startGame)




// // **********************************************************************
// // INITIALIZE GAME --> not needed, applied in CSS

// initializeGame()