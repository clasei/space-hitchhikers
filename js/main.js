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





// **********************************************************************
// GLOBAL FUNCTIONS

// start game function
function startGame() {
  console.log('start click')

  startScreenNode.style.display = "none"
  gameScreenNode.style.display = "flex"
}



// **********************************************************************
// EVENT LISTENERS

// start button click
startBtnNode.addEventListener("click", startGame)




