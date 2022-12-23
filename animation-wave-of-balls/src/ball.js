const $ = (elem) => document.querySelector(elem);
const $$ = (elem) => document.querySelectorAll(elem);

const totalBalls = 10;
const ballSize = 10;

let movement = Number($('#movement').value);
let duration = Number($('#duration').value);
let count = 0;
let inc;
const balls = [];

class Ball {
  constructor(index, ballSize, movement, duration) {
    this.index = index;
    this.ballSize = ballSize;
    this.movement = movement;
    this.duration = duration;
    this.elem = document.createElement('div');
    const inc = index * movement / 250;
    const options = {
      id: `ball-${index}`,
      className: 'ball',
      style: `
        width: ${ballSize}px;
        height: ${ballSize * 1.25}px;
        animation-delay: ${inc}s;
        animation-duration: ${duration}s;
      `
    }
    Object.assign(this.elem, options);
    document.querySelector('.container').appendChild(this.elem);
  }
  updateAnimation() {
    const inc = (this.index) * this.movement / 250;
    this.elem.style.animationDelay = `${inc}s`;
    this.elem.style.animationDuration = `${this.duration}s`;
  };
}

const addBall = () => {
  const ball = new Ball(++count, ballSize, movement, duration);
  balls.push(ball);
}

const removeBall = () => {
  balls.pop();
  document.querySelector(`#ball-${count}`).remove();
  count--;
}

while (count < totalBalls) {
  addBall();
}

$('#add').addEventListener('click', e => {
  addBall();
});

$('#remove').addEventListener('click', e => {
  removeBall();
});
