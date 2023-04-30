// ---- Classes ----

//the Vector2 class holding 2 values based on x and y I.E. positional coordinates, sizing, rotation...
class Vector2 {
	constructor(x, y)
	{
		this.x = x;
		this.y = y;
	}

    //This returns a normalized version of this vector with a magnitude (length) of 1
    normalize()
    {
        let magnitude = Math.sqrt((this.x * this.x) + (this.y * this.y));
        return new Vector2(this.x / magnitude, this.y / magnitude)
    }

    //This returns the magnitude (length) of the vector
    magnitude()
    {
        return Math.sqrt((this.x * this.x) + (this.y * this.y));
    }
}

//The transform base class holds positional and size information
class Transform {
	constructor(position, scale)
	{
		this.position = position;
		this.scale = scale;
	}
}

//The pawn class extends the transform class and add a element velocity and direction variable for handling the movement of the pawn
class Pawn extends Transform {
  constructor(element)
  {
    let objectRect = element.getBoundingClientRect();
  	super(new Vector2(objectRect.x, objectRect.y), new Vector2(objectRect.width, objectRect.height));
  	this.element = element;
  	this.velocity = 0.2;
    this.direction = new Vector2(Math.random() * 2 - 1, Math.random() * 2 - 1);
    this.direction = this.direction.normalize();
    this.SetAnimationPoint();
  }

  //This function is for setting the animation of the for the element 
  SetAnimationPoint()
  {
    //Determins the magnitude (length) of the intersection of the vector on the x and y axis
    let xMagnitude = (this.direction.x < 0) ? this.position.x / (this.direction.x * -1) : (boundingBox.x - this.position.x - this.scale.x) / this.direction.x;
    let yMagnitude = (this.direction.y < 0) ? this.position.y / (this.direction.y * -1) : (boundingBox.y - this.position.y - this.scale.y) / this.direction.y;
    let magnitude;
    let intersectionPoint;

    //Based on which intersection happens first (which magnitude is shorter) set the intersection point based on the magnitude
    if(xMagnitude < yMagnitude)
    {
        intersectionPoint = new Vector2(this.direction.x * xMagnitude, this.direction.y * xMagnitude);
        this.direction.x *= -1
        magnitude = xMagnitude;
    } else {
        intersectionPoint = new Vector2(this.direction.x * yMagnitude, this.direction.y * yMagnitude);
        this.direction.y *= -1
        magnitude = yMagnitude;
    }

    //If the magnitude is negative i.e. the window has been resized the reset the position of the pawn and recaclate the intersection point
    if (magnitude / this.velocity < 0)
    {
        this.ResetPosition();
        this.SetAnimationPoint();
        return;
    }

    //update the position to the new point
    this.position.x = this.position.x + intersectionPoint.x;
    this.position.y = this.position.y + intersectionPoint.y;

    //Set the animation
    let animationPositions = [
        { transform: "translate(" + (this.position.x + (this.scale.x * 0.5) - (boundingBox.x * 0.5)) + "px, " + (this.position.y + (this.scale.y * 0.5) - (boundingBox.y * 0.5)) + "px)" }
      ];

    //Set the time fo the animation based on the magnitude of the vector
    let animationTime = {
        duration: magnitude / this.velocity,
        iterations: 1,
        fill: "forwards",
    };

    //Apply the animation to the element and set the onfinsh event to run this function again to find the next point
    let animation = this.element.animate(animationPositions, animationTime);
    animation.onfinish = (event) => this.SetAnimationPoint()
  }

  //Resets the position of the pawn i.e. in the case that the window has been resized
  ResetPosition()
  {
    this.position.x = boundingBox.x * 0.5;
    this.position.y = boundingBox.y * 0.5;
  }
}

// ---- Variables ----

let images = [];
let canvas = document.getElementById("app");
let boundingBox;

// ---- Events ----

window.onload = function() {
    boundingBox = new Vector2(window.innerWidth, window.innerHeight);
    Setup();
}

addEventListener("resize", (event) => {
    boundingBox = new Vector2(window.innerWidth, window.innerHeight);
});


// ---- Functions ----

//Sets up the images
function Setup() {
	while(images.length < 500) {
		images.push(CreateNewImagePawn())
	}
}

//Used to create a new pawn object with and img element
function CreateNewImagePawn() {
    let NewElement = document.createElement("img");
    NewElement.src = "/Clocktower_compressed.png";
    NewElement.classList.add("moving-image")
    canvas.appendChild(NewElement);
    return new Pawn(NewElement);
}