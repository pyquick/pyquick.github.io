// 游戏状态
let snake = [];
let food = { x: 0, y: 0 };
let direction = 'right';
let score = 0;
let gameLoop = null;
let isPaused = false;
let gridSize = 20;
let speed = 150;

// 获取Canvas上下文
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('scoreValue');
const highScoreElement = document.getElementById('highScoreValue'); // 新增
const finalScoreElement = document.getElementById('finalScore');
const gameOverElement = document.getElementById('gameOver');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');

// 初始化游戏
function initGame() {
    // 初始化蛇的位置
    snake = [
        { x: 3, y: 1 },
        { x: 2, y: 1 },
        { x: 1, y: 1 }
    ];
    direction = 'right';
    score = 0;
    scoreElement.textContent = score;
    updateHighScore(); // 新增
    generateFood();
    gameOverElement.style.display = 'none';
}

// 生成食物
function generateFood() {
    food.x = Math.floor(Math.random() * (canvas.width / gridSize));
    food.y = Math.floor(Math.random() * (canvas.height / gridSize));
    
    // 确保食物不会生成在蛇身上
    while (snake.some(segment => segment.x === food.x && segment.y === food.y)) {
        food.x = Math.floor(Math.random() * (canvas.width / gridSize));
        food.y = Math.floor(Math.random() * (canvas.height / gridSize));
    }
}

// 绘制游戏
function draw() {
    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // 绘制蛇
    snake.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? '#2ecc71' : '#27ae60';
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
    });
    
    // 绘制食物
    ctx.fillStyle = '#e74c3c';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
}

// 移动蛇
function moveSnake() {
    const head = { ...snake[0] };
    
    switch (direction) {
        case 'up': head.y--; break;
        case 'down': head.y++; break;
        case 'left': head.x--; break;
        case 'right': head.x++; break;
    }
    
    // 检查是否吃到食物
    if (head.x === food.x && head.y === food.y) {
        score += 10;
        scoreElement.textContent = score;
        generateFood();
        // 增加速度
        if (speed > 50) {
            speed -= 5;
            clearInterval(gameLoop);
            gameLoop = setInterval(gameStep, speed);
        }
    } else {
        snake.pop();
    }
    
    // 检查是否撞墙或撞到自己
    if (isCollision(head)) {
        gameOver();
        return;
    }
    
    snake.unshift(head);
}

// 碰撞检测
function isCollision(head) {
    // 检查是否撞墙
    if (head.x < 0 || head.x >= canvas.width / gridSize ||
        head.y < 0 || head.y >= canvas.height / gridSize) {
        return true;
    }
    
    // 检查是否撞到自己
    return snake.some(segment => segment.x === head.x && segment.y === head.y);
}

// 游戏结束
function gameOver() {
    clearInterval(gameLoop);
    gameLoop = null;
    finalScoreElement.textContent = score;
    
    // 更新最高分
    const highScore = getHighScore();
    if (score > highScore) {
        document.cookie = `highScore=${score}; path=/`;
        highScoreElement.textContent = score;
    }
    
    // 确保游戏结束界面正确渲染
    gameOverElement.style.display = 'block';
    // 强制重绘以确保渲染正确
    setTimeout(() => {
        gameOverElement.style.opacity = '0';
        setTimeout(() => {
            gameOverElement.style.opacity = '1';
        }, 10);
    }, 0);
}

// 获取最高分
function getHighScore() {
    const cookies = document.cookie.split('; ');
    for (const cookie of cookies) {
        const [name, value] = cookie.split('=');
        if (name === 'highScore') {
            return parseInt(value);
        }
    }
    return 0;
}

// 更新最高分显示
function updateHighScore() {
    const highScore = getHighScore();
    highScoreElement.textContent = highScore;
}

// 游戏步骤
function gameStep() {
    if (!isPaused) {
        moveSnake();
        draw();
    }
}

// 重启游戏
function restartGame() {
    initGame();
    if (gameLoop) clearInterval(gameLoop);
    gameLoop = setInterval(gameStep, speed);
    isPaused = false;
    pauseBtn.textContent = '暂停';
    
    // 隐藏游戏结束信息
    document.getElementById('gameOver').style.display = 'none';
    document.getElementById('endGameInfo').style.display = 'none';
}

// 新增：结束游戏
function endGame() {
    if (gameLoop) {
        clearInterval(gameLoop);
        gameLoop = null;
    }
    
    // 显示得分信息
    const endGameInfo = document.getElementById('endGameInfo');
    const endGameScore = document.getElementById('endGameScore');
    const highScoreMessage = document.getElementById('highScoreMessage');
    
    endGameScore.textContent = score;
    
    // 检查是否突破最高分并记录
    const highScore = getHighScore();
    if (score > highScore) {
        document.cookie = `highScore=${score}; path=/`;
        updateHighScore();
        
        if (highScore > 0) {
            highScoreMessage.style.display = 'block';
        }
    } else {
        highScoreMessage.style.display = 'none';
    }
    
    endGameInfo.style.display = 'block';
    
    // 强制重绘以确保渲染正确
    setTimeout(() => {
        endGameInfo.style.opacity = '0';
        setTimeout(() => {
            endGameInfo.style.opacity = '1';
        }, 10);
    }, 0);
}

// 事件监听
document.addEventListener('keydown', (event) => {
    if (gameLoop) {
        switch (event.key) {
            case 'ArrowUp':
                if (direction !== 'down') direction = 'up';
                break;
            case 'ArrowDown':
                if (direction !== 'up') direction = 'down';
                break;
            case 'ArrowLeft':
                if (direction !== 'right') direction = 'left';
                break;
            case 'ArrowRight':
                if (direction !== 'left') direction = 'right';
                break;
        }
    }
});

startBtn.addEventListener('click', () => {
    if (!gameLoop) {
        restartGame();
    }
});

pauseBtn.addEventListener('click', () => {
    isPaused = !isPaused;
    pauseBtn.textContent = isPaused ? '继续' : '暂停';
});

// 新增：结束游戏按钮点击事件
document.getElementById('endBtn').addEventListener('click', () => {
    endGame();
});

// 初始化游戏
initGame();
draw();