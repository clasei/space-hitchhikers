class Hitchhiker {
  
  constructor() {

  this.x = 300;
  this.y = 342; // puts hitchhiker at the bottom of the game-box
  this.w = 20;
  this.h = 50;
  this.speed = 10;
  this.isImmune = false;
  this.isAlive = true;

  this.keys = { // propierty added for smoother movement with hitchhikerMovement()
    up: false,
    down: false,
    left: false,
    right: false
  }

  this.node = document.createElement("img")
  this.node.src = "./assets/hitchhiker.png"
  
  gameBoxNode.append(this.node) // adds hitchhiker to game-box

  this.node.style.width = `${this.w}px`
  this.node.style.height = `${this.h}px`
  this.node.style.position = "absolute" // allows to adjust from top Y and left X inside the parent element (gameBoxNode)
  this.node.style.top = `${this.y}px`
  this.node.style.left = `${this.x}px`
  }

  hitchhikerMovement() {
    if (this.keys.up && this.y >= 0) {
      this.y -= this.speed;
    }
    if (this.keys.down && this.y <= (gameBoxNode.offsetHeight - this.h)) {
      this.y += this.speed;
    }
    if (this.keys.left && this.x >= 0) {
      this.x -= this.speed;
    }
    if (this.keys.right && this.x <= (gameBoxNode.offsetWidth - this.w)) {
      this.x += this.speed;
    }
    
    this.node.style.left = `${this.x}px`;
    this.node.style.top = `${this.y}px`; 
  }
}