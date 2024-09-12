function saveScoreToLocalStorage() {

  let highScores = JSON.parse(localStorage.getItem("highScores")) || [] // GET existing scores

  const newScore = { // CREATES new object including name + score
    name: playerName,
    score: playerTotalScore
  }

  highScores.unshift(newScore); // ADDS to array in the 1st position
  highScores.sort((a, b) => b.score - a.score)
  highScores = highScores.slice(0, 5)

  localStorage.setItem("highScores", JSON.stringify(highScores))

  console.log("saved highscores ", highScores)
}

function displayHighScores(selector) {
  let highScores = JSON.parse(localStorage.getItem("highScores")) || []

  console.log("showing highscores ", highScores)

  const highScoresDisplayNode = document.querySelector(selector) // uses selector to allow display in both screens
  highScoresDisplayNode.innerHTML = ""

  highScores.forEach(score => {
    const scoreElement = document.createElement("li")
    scoreElement.innerText = `${score.name} — ${score.score}`
    highScoresDisplayNode.appendChild(scoreElement)
  })
}