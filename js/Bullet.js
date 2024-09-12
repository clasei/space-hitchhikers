class Bullet {

  constructor(x, y, speed) {
    this.x = x;
    this.y = y;
    this.width = 7;
    this.height = 7;
    this.speed = bulletSpeed;

    this.node = document.createElement("img")
    this.node.src = "./assets/bullet-fire.png"

    gameBoxNode.append(this.node)

    this.node.style.width = `${this.width}px`
    this.node.style.height = `${this.height}px`
    this.node.style.backgroundColor = "red"

    this.node.style.position = "absolute" // allows to adjust from top Y and left X inside the parent element (gameBoxNode)

    this.updatePosition();
  }

  updatePosition() {
    this.node.style.left = `${this.x}px`;
    this.node.style.top = `${this.y}px`;
  }

  move() {
    this.y -= this.speed;
    this.updatePosition();
    if (this.y < 0) {
      this.remove(); // removes bullets after reaching game-box top limit
    }
  }

  remove() {
    this.node.remove();
  }
}
