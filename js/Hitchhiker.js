class Hitchhiker {
  
  constructor() {

  this.x = 300;
  this.y = 342; // puts hitchhiker at the bottom of the game-box
  this.h = 50;
  this.w = 20;
  this.speed = 10;

  this.node = document.createElement("img")
  this.node.src = "../assets/hitchhiker.png"
  
  gameBoxNode.append(this.node) // adds hitchhiker to game-box

  this.node.style.width = `${this.w}px`
  this.node.style.height = `${this.h}px`
  this.node.style.position = "absolute" // allows to adjust from top Y and left X inside the parent element (gameBoxNode)
  this.node.style.top = `${this.y}px`
  this.node.style.left = `${this.x}px`

  }

  moveX(direction) {
    if (direction === 'right') {
      this.x += this.speed
      // this.node.style.left = `${this.x}px`
    } else if (direction === 'left') {
      this.x -= this.speed
      // this.node.style.left = `${this.x}px`
    }

    if (this.x < 0) this.x = 0;
    if (this.x + this.w > gameBoxNode.offsetWidth) {
      this.x = gameBoxNode.offsetWidth - this.w;
    }

    this.node.style.left = `${this.x}px`;
  }

}