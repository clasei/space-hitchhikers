class Hitchhiker {
  
  constructor() {

  this.x = 50;
  this.y = 50;
  this.h = 50;
  this.w = 20;

  this.node = document.createElement("img")
  this.node.src = "../assets/hitchhiker.png"
  gameBoxNode.append(this.node) // adds hitchhiker to game-box

  this.node.style.width = `${this.w}px`
  this.node.style.height = `${this.h}px`
  this.node.style.position = "absolute" // allows to adjust from top Y and left X inside the parent element (gameBoxNode)
  this.node.style.top = `${this.y}px`
  this.node.style.left = `${this.x}px`


  }
}