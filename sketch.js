var w;

function setup() {
	w = new Walker();

	createCanvas(windowWidth, windowHeight);
	background(51)
}

function draw() {
	w.update();
	w.draw();
}

function Walker() {
	this.x = windowWidth * .5;
	this.y = windowHeight * .5;
	this.size = random(max(windowWidth, windowHeight) * .001, max(windowWidth, windowHeight) * .01);

	this.update = function () {
		this.step();
	}

	this.draw = function () {
		stroke('white');
		//point(this.x, this.y)
		ellipse(this.x, this.y, this.size, this.size);
	}

	this.step = function () {
		var stepX = random(-1, 1);
		var stepY = random(-1, 1);

		this.x += stepX * this.size;
		this.y += stepY * this.size;
	}
}