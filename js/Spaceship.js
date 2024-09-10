class Spaceship {

  constructor(positionX, spaceshipSpeed) {

    this.x = positionX;
    this.y = -10; // forces the spaceships to start outside the canvas
    this.w = 37;
    this.h = 37;
    this.speed = spaceshipSpeed;
    // this.isCrashed = false; // propierty created to avoid multiple detection in detectSpaceshipColision()

    this.node = document.createElement("img")
    this.node.src = "../assets/spaceship.png"

    gameBoxNode.append(this.node)

    this.node.style.width = `${this.w}px`
    this.node.style.height = `${this.h}px`
    this.node.style.position = "absolute" // allows to adjust from top Y and left X inside the parent element (gameBoxNode)
    this.node.style.top = `${this.y}px`
    this.node.style.left = `${this.x}px`
  }

  moveDown() {
    this.y += this.speed
    this.node.style.top = `${this.y}px`
  }
}