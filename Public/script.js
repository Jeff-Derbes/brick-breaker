const rulesBtn = document.querySelector('#rules-btn')
const closeBtn = document.querySelector('#close-btn')
const rules = document.querySelector('.rules')
const canvas = document.querySelector('#canvas')
const ctx = canvas.getContext('2d')

let score = 0

const brickRowCount = 9;
const brickColumnCount = 5;


//Ball properties

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: 10,
    speed: 2,
    dx: 4,
    dy: -4,
}


//Paddle properties

const paddle = {
    x: canvas.width / 2 - 40,
    y: canvas.height - 20,
    w: 80,
    h: 10,
    speed: 8,
    dx: 0
}

//Brick Properties
const brickInfo = {
    w: 70,
    h: 20,
    padding: 10,
    offsetX: 45,
    offsetY: 60,
    visible: true
}

//Create bricks
const bricks = []

for (let i = 0; i < brickRowCount; i++) {
    bricks[i] = []
    for (let j = 0; j < brickColumnCount; j++) {
        const x = i * (brickInfo.w + brickInfo.padding) + brickInfo.offsetX;
        const y = j * (brickInfo.h + brickInfo.padding) + brickInfo.offsetY;
        bricks[i][j] = { x, y, ...brickInfo }
    }
}
console.log(bricks)

//Draw paddle onto canvas

const drawPaddle = () => {
    ctx.beginPath()
    ctx.rect(paddle.x, paddle.y, paddle.w, paddle.h)
    ctx.fillStyle = '#0095dd'
    ctx.fill()
    ctx.closePath()
}

//Draw ball onto the canvas

const drawball = () => {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
    ctx.fillStyle = '#0095dd'
    ctx.fill()
    ctx.closePath();
}

// Draw score on canvas 
const drawScore = () => {
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, canvas.width - 100, 30);
}

// Draw bricks onto canvas
const drawBricks = () => {
    bricks.forEach(column => {
        column.forEach(brick => {
            ctx.beginPath();
            ctx.rect(brick.x, brick.y, brick.w, brick.h);
            ctx.fillStyle = brick.visible ? '#0095dd' : 'transparent';
            ctx.fill();
            ctx.closePath();
        })
    })
}

// Move the paddle on canvas
const movePaddle = () => {
    paddle.x += paddle.dx;


    //Wall boundries
    if (paddle.x + paddle.w > canvas.width) {
        paddle.x = canvas.width - paddle.w;
    }

    if (paddle.x < 0) {
        paddle.x = 0;
    }
}

//Move Ball on canvas
const moveBall = () => {
    ball.x += ball.dx;
    ball.y += ball.dy;


    // Wall collision detection (x axis)
    if (ball.x + ball.size > canvas.width || ball.x - ball.size < 0) {
        ball.dx *= -1;
    }

    // Wall collision (y axis)
    if (ball.y + ball.size > canvas.height || ball.y - ball.size < 0) {
        ball.dy *= -1;
    }

    // Paddle collision
    if (ball.x - ball.size > paddle.x && ball.x + ball.size < paddle.x + paddle.w && ball.y + ball.size > paddle.y) {
        ball.dy = -ball.speed
    }

    // Brick collision
    bricks.forEach(column => {
        column.forEach(brick => {
            if (brick.visible) {
                if (ball.x - ball.size > brick.x &&
                    ball.x + ball.size < brick.x + brick.w &&
                    ball.y + ball.size > brick.y &&
                    ball.y - ball.size < brick.y + brick.h) {
                    ball.dy *= -1;
                    brick.visible = false

                    increaseScore();
                }
            }
        })
    })


    // Hit bottom wall means you lose

    if (ball.y + ball.size > canvas.height) {
        showAllBricks();
        score = 0;
    }
}

// Increase Score
function increaseScore() {
    score++;

    if (score % (brickRowCount * brickRowCount) === 0) {
        showAllBricks()
    }
}

// Make all bricks appear
function showAllBricks() {
    bricks.forEach(column => {
        column.forEach(brick => brick.visible = true)
    })
}

const draw = () => {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    drawball();
    drawPaddle();
    drawScore();
    drawBricks();
}


//Update canvas drawing and animation
const update = () => {
    movePaddle();
    moveBall();

    //Draw everything
    draw();
    requestAnimationFrame(update);
}

update()

//Keydown event functions
const keyDown = (e) => {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        paddle.dx = paddle.speed;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
        paddle.dx = -paddle.speed
    }
}

const keyUp = (e) => {
    if (e.key === 'Right' || e.key === 'ArrowRight' || e.key === 'Left' || e.key === 'ArrowLeft') {
        paddle.dx = 0
    }
}

//Keyboard event handlers
document.addEventListener('keydown', keyDown)
document.addEventListener('keyup', keyUp)


//Event handlers for rules

rulesBtn.addEventListener('click', () => rules.classList.add('show'))

closeBtn.addEventListener('click', () => rules.classList.remove('show'))

