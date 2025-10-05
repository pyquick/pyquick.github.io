// 游戏状态
let snake = [];
let food = { x: 0, y: 0, type: 'normal' };
let direction = 'right';
let nextDirection = 'right';
let score = 0;
let gameLoop = null;
let isPaused = false;
let gridSize = 20;
let baseSpeed = 150;
let speed = baseSpeed;
let obstacles = [];
let specialFoodTimer = null;
let gameStarted = false;

// 食物类型
const FOOD_TYPES = {
    normal: { color: '#e74c3c', points: 10, duration: null },
    bonus: { color: '#f39c12', points: 30, duration: 5000 },
    speedUp: { color: '#3498db', points: 20, duration: 3000 },
    speedDown: { color: '#9b59b6', points: 15, duration: 3000 }
};

// 获取DOM元素
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('scoreValue');
const highScoreElement = document.getElementById('highScoreValue');
const speedElement = document.getElementById('speedValue');
const finalScoreElement = document.getElementById('finalScore');
const gameOverElement = document.getElementById('gameOver');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const endBtn = document.getElementById('endBtn');

// 难度选择
const difficultyButtons = document.querySelectorAll('.difficulty-btn');
let currentDifficulty = 'normal';

// 初始化游戏
function initGame() {
    // 初始化蛇的位置
    snake = [
        { x: 3, y: 1 },
        { x: 2, y: 1 },
        { x: 1, y: 1 }
    ];
    direction = 'right';
    nextDirection = 'right';
    score = 0;
    speed = baseSpeed;
    obstacles = [];
    scoreElement.textContent = score;
    updateSpeedDisplay();
    updateHighScore();
    generateFood();
    generateObstacles();
    gameOverElement.style.display = 'none';
    document.getElementById('endGameInfo').style.display = 'none';
    
    // 清除特殊食物计时器
    if (specialFoodTimer) {
        clearTimeout(specialFoodTimer);
        specialFoodTimer = null;
    }
}

// 更新速度显示
function updateSpeedDisplay() {
    const speedMultiplier = baseSpeed / speed;
    speedElement.textContent = speedMultiplier.toFixed(1) + 'x';
}

// 生成障碍物
function generateObstacles() {
    obstacles = [];
    const obstacleCount = Math.floor(score / 50) + 2; // 随分数增加障碍物数量
    
    for (let i = 0; i < obstacleCount; i++) {
        let obstacle;
        do {
            obstacle = {
                x: Math.floor(Math.random() * (canvas.width / gridSize)),
                y: Math.floor(Math.random() * (canvas.height / gridSize))
            };
        } while (
            snake.some(segment => segment.x === obstacle.x && segment.y === obstacle.y) ||
            (obstacle.x === food.x && obstacle.y === food.y) ||
            obstacles.some(obs => obs.x === obstacle.x && obs.y === obstacle.y)
        );
        obstacles.push(obstacle);
    }
}

// 生成食物
function generateFood() {
    let newFood;
    do {
        newFood = {
            x: Math.floor(Math.random() * (canvas.width / gridSize)),
            y: Math.floor(Math.random() * (canvas.height / gridSize)),
            type: getRandomFoodType()
        };
    } while (
        snake.some(segment => segment.x === newFood.x && segment.y === newFood.y) ||
        obstacles.some(obs => obs.x === newFood.x && obs.y === newFood.y)
    );
    
    food = newFood;
    
    // 如果是特殊食物，设置定时器
    if (food.type !== 'normal' && FOOD_TYPES[food.type].duration) {
        if (specialFoodTimer) {
            clearTimeout(specialFoodTimer);
        }
        specialFoodTimer = setTimeout(() => {
            if (food.type !== 'normal') {
                food.type = 'normal';
            }
        }, FOOD_TYPES[food.type].duration);
    }
}

// 获取随机食物类型
function getRandomFoodType() {
    const rand = Math.random();
    if (rand < 0.7) return 'normal'; // 70% 普通食物
    if (rand < 0.85) return 'bonus';  // 15% 奖励食物
    if (rand < 0.95) return 'speedUp'; // 10% 加速食物
    return 'speedDown'; // 5% 减速食物
}

// 绘制游戏
function draw() {
    // 清空画布
    ctx.fillStyle = '#2c3e50';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 绘制网格背景
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 0.5;
    for (let x = 0; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
    
    // 绘制障碍物
    ctx.fillStyle = 'rgba(149, 165, 166, 0.8)';
    obstacles.forEach(obstacle => {
        ctx.fillRect(obstacle.x * gridSize, obstacle.y * gridSize, gridSize - 1, gridSize - 1);
        // 添加障碍物纹理
        ctx.strokeStyle = 'rgba(52, 73, 94, 0.6)';
        ctx.lineWidth = 1;
        ctx.strokeRect(obstacle.x * gridSize + 2, obstacle.y * gridSize + 2, gridSize - 5, gridSize - 5);
    });
    
    // 绘制蛇
    snake.forEach((segment, index) => {
        if (index === 0) {
            // 蛇头
            ctx.fillStyle = '#27ae60';
            ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 1, gridSize - 1);
            
            // 蛇头眼睛
            ctx.fillStyle = '#2c3e50';
            const eyeSize = gridSize / 5;
            const eyeOffset = gridSize / 3;
            
            if (direction === 'right') {
                ctx.fillRect(segment.x * gridSize + gridSize - eyeOffset, segment.y * gridSize + eyeOffset, eyeSize, eyeSize);
                ctx.fillRect(segment.x * gridSize + gridSize - eyeOffset, segment.y * gridSize + gridSize - eyeOffset - eyeSize, eyeSize, eyeSize);
            } else if (direction === 'left') {
                ctx.fillRect(segment.x * gridSize + eyeOffset - eyeSize, segment.y * gridSize + eyeOffset, eyeSize, eyeSize);
                ctx.fillRect(segment.x * gridSize + eyeOffset - eyeSize, segment.y * gridSize + gridSize - eyeOffset - eyeSize, eyeSize, eyeSize);
            } else if (direction === 'up') {
                ctx.fillRect(segment.x * gridSize + eyeOffset, segment.y * gridSize + eyeOffset - eyeSize, eyeSize, eyeSize);
                ctx.fillRect(segment.x * gridSize + gridSize - eyeOffset - eyeSize, segment.y * gridSize + eyeOffset - eyeSize, eyeSize, eyeSize);
            } else if (direction === 'down') {
                ctx.fillRect(segment.x * gridSize + eyeOffset, segment.y * gridSize + gridSize - eyeOffset, eyeSize, eyeSize);
                ctx.fillRect(segment.x * gridSize + gridSize - eyeOffset - eyeSize, segment.y * gridSize + gridSize - eyeOffset, eyeSize, eyeSize);
            }
        } else {
            // 蛇身
            ctx.fillStyle = index % 2 === 0 ? '#2ecc71' : '#27ae60';
            ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 1, gridSize - 1);
            
            // 蛇身纹理
            ctx.fillStyle = 'rgba(46, 204, 113, 0.3)';
            ctx.fillRect(segment.x * gridSize + 2, segment.y * gridSize + 2, gridSize - 5, gridSize - 5);
        }
    });
    
    // 绘制食物
    const foodType = FOOD_TYPES[food.type];
    ctx.fillStyle = foodType.color;
    
    // 特殊食物添加闪烁效果
    if (food.type !== 'normal') {
        const pulse = Math.sin(Date.now() / 200) * 0.3 + 0.7;
        ctx.globalAlpha = pulse;
    }
    
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 1, gridSize - 1);
    
    // 食物中心效果
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    const centerSize = gridSize / 3;
    ctx.fillRect(
        food.x * gridSize + (gridSize - centerSize) / 2,
        food.y * gridSize + (gridSize - centerSize) / 2,
        centerSize,
        centerSize
    );
    
    ctx.globalAlpha = 1.0;
}

// 移动蛇
function moveSnake() {
    // 应用下一个方向
    direction = nextDirection;
    
    const head = { ...snake[0] };
    
    switch (direction) {
        case 'up': head.y -= 1; break;
        case 'down': head.y += 1; break;
        case 'left': head.x -= 1; break;
        case 'right': head.x += 1; break;
    }
    
    // 检查是否吃到食物
    if (head.x === food.x && head.y === food.y) {
        const foodType = FOOD_TYPES[food.type];
        score += foodType.points;
        scoreElement.textContent = score;
        
        // 处理特殊食物效果
        handleFoodEffect(food.type);
        
        generateFood();
        
        // 每得50分增加障碍物
        if (score % 50 === 0) {
            generateObstacles();
        }
        
        // 每得30分增加速度
        if (score % 30 === 0 && speed > 50) {
            speed = Math.max(50, speed - 10);
            updateSpeedDisplay();
        }
    } else {
        // 如果没有吃到食物，移除蛇尾
        snake.pop();
    }
    
    // 检查是否撞墙或撞到自己
    if (isCollision(head)) {
        gameOver();
        return;
    }
    
    // 添加新的蛇头
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
    if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        return true;
    }
    
    // 检查是否撞到障碍物
    if (obstacles.some(obs => obs.x === head.x && obs.y === head.y)) {
        return true;
    }
    
    return false;
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
            case 'w':
            case 'W':
                if (direction !== 'down') nextDirection = 'up';
                break;
            case 'ArrowDown':
            case 's':
            case 'S':
                if (direction !== 'up') nextDirection = 'down';
                break;
            case 'ArrowLeft':
            case 'a':
            case 'A':
                if (direction !== 'right') nextDirection = 'left';
                break;
            case 'ArrowRight':
            case 'd':
            case 'D':
                if (direction !== 'left') nextDirection = 'right';
                break;
            case ' ':
                // 空格键暂停/继续游戏
                isPaused = !isPaused;
                if (isPaused) {
                    clearInterval(gameLoop);
                    gameLoop = null;
                    pauseBtn.innerHTML = '<i class="fas fa-play"></i> 继续';
                } else {
                    gameLoop = setInterval(gameStep, speed);
                    pauseBtn.innerHTML = '<i class="fas fa-pause"></i> 暂停';
                }
                break;
        }
    }
});

startBtn.addEventListener('click', () => {
    if (!gameLoop) {
        restartGame();
        startBtn.innerHTML = '<i class="fas fa-play"></i> 游戏中';
        pauseBtn.innerHTML = '<i class="fas fa-pause"></i> 暂停';
        endBtn.disabled = false;
    }
});

pauseBtn.addEventListener('click', () => {
    isPaused = !isPaused;
    if (isPaused) {
        clearInterval(gameLoop);
        gameLoop = null;
        pauseBtn.innerHTML = '<i class="fas fa-play"></i> 继续';
    } else {
        gameLoop = setInterval(gameStep, speed);
        pauseBtn.innerHTML = '<i class="fas fa-pause"></i> 暂停';
    }
});

// 处理食物效果
function handleFoodEffect(foodType) {
    switch (foodType) {
        case 'speedUp':
            speed = Math.max(30, speed - 20);
            updateSpeedDisplay();
            setTimeout(() => {
                speed = Math.min(baseSpeed, speed + 20);
                updateSpeedDisplay();
            }, 3000);
            break;
        case 'speedDown':
            speed = Math.min(300, speed + 30);
            updateSpeedDisplay();
            setTimeout(() => {
                speed = Math.max(baseSpeed, speed - 30);
                updateSpeedDisplay();
            }, 3000);
            break;
    }
}

// 设置难度
function setDifficulty(difficulty) {
    currentDifficulty = difficulty;
    
    // 更新按钮状态
    difficultyButtons.forEach(btn => {
        if (btn.dataset.difficulty === difficulty) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // 根据难度设置基础速度
    switch (difficulty) {
        case 'easy':
            baseSpeed = 200;
            break;
        case 'normal':
            baseSpeed = 150;
            break;
        case 'hard':
            baseSpeed = 100;
            break;
        case 'expert':
            baseSpeed = 70;
            break;
    }
    
    // 如果游戏正在进行，更新速度
    if (gameLoop) {
        speed = baseSpeed;
        clearInterval(gameLoop);
        gameLoop = setInterval(gameStep, speed);
        updateSpeedDisplay();
    }
}

// 初始化难度选择
function initDifficultySelection() {
    difficultyButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            setDifficulty(btn.dataset.difficulty);
        });
    });
    
    // 设置默认难度
    setDifficulty('normal');
}

// 新增：结束游戏按钮点击事件
document.getElementById('endBtn').addEventListener('click', () => {
    endGame();
});

// 初始化游戏
initDifficultySelection();
initGame();
draw();