const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.height = window.innerHeight;
canvas.width = canvas.height;

canvas.addEventListener("mousedown", mouseDown);
canvas.addEventListener("mouseup", mouseUp);
canvas.onmousemove = function(){
    window.currentXPos = Math.floor(event.clientX / squareSize);
    window.currentYPos = Math.floor(event.clientY / squareSize);
};

setup(6);

function setup(size) {
    window.gridSize = size;
    window.squareSize = Math.floor(canvas.width / gridSize);
    window.grid = makeGrid(gridSize);
    window.mouseDown = false;

    draw();
    update();
}

function update() {
    if (mouseDown) {
        checkForMove();
    }
    requestAnimationFrame(update);
}

function draw() {
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            let num = grid[y][x] - 1;
            let row = Math.floor(num / gridSize);
            let col = num - row * gridSize;
            ctx.fillStyle = 'rgb(' + Math.floor(255 - (255 / gridSize) * row) + ', ' +
                Math.floor(255 - (255 / gridSize) * col) + ', ' + 255 / (gridSize * gridSize) * row * col + ')';
            ctx.fillRect(x * squareSize, y * squareSize, squareSize, squareSize);
            ctx.font = squareSize / 1.3 + "px Arial";
            ctx.textAlign = "center";
            ctx.fillStyle = "#000";
            ctx.fillText(grid[y][x], x * squareSize + squareSize / 2, y * squareSize + squareSize / 1.3, squareSize - 10);
        }
    }
}

function makeGrid(gridSize) {
    let grid = [];
    for (let y = 0; y < gridSize; y++) {
        grid[y] = [];
        for (let x = 0; x < gridSize; x++) {
            grid[y][x] = y * gridSize + x + 1;
        }
    }
    return grid;
}

function shift(rowcol, dir) {
    let edgeNum;
    switch (dir) {
        case "right":
            edgeNum = grid[rowcol][gridSize - 1];
            for (let i = gridSize - 1; i > 0; i--) {
                grid[rowcol][i] = grid[rowcol][i - 1];
            }
            grid[rowcol][0] = edgeNum;
            break;
        case "left":
            edgeNum = grid[rowcol][0];
            for (let i = 0; i < gridSize - 1; i++) {
                grid[rowcol][i] = grid[rowcol][i + 1];
            }
            grid[rowcol][gridSize - 1] = edgeNum;
            break;
        case "up":
            edgeNum = grid[0][rowcol];
            for (let i = 0; i < gridSize - 1; i++) {
                grid[i][rowcol] = grid[i + 1][rowcol];
            }
            grid[gridSize - 1][rowcol] = edgeNum;
            break;
        case "down":
            edgeNum = grid[gridSize - 1][rowcol];
            for (let i = gridSize - 1; i > 0; i--) {
                grid[i][rowcol] = grid[i - 1][rowcol];
            }
            grid[0][rowcol] = edgeNum;
            break;
    }
    draw();
}

function shuffle() {
    for (let i = 0; i < 50; i++) {
        let rowcol = Math.floor(Math.random() * gridSize);
        let dirNum = Math.floor(Math.random() * 4);
        let dir;

        switch (dirNum) {
            case 0:
                dir = "up";
                break;
            case 1:
                dir = "right";
                break;
            case 2:
                dir = "down";
                break;
            case 3:
                dir = "left";
                break;
        }

        let times = Math.floor(Math.random() * (gridSize - 1));

        for (let i = 0; i < times; i++) {
            shift(rowcol, dir);
        }
    }
}

function mouseDown() {
    mouseDown = true;
    window.prevXPos = Math.floor(event.clientX / squareSize);
    window.prevYPos = Math.floor(event.clientY / squareSize);
}

function mouseUp() {
    mouseDown = false;
}

function checkForMove() {
    if (currentXPos !== prevXPos) {
        if(currentXPos > prevXPos){
            shift(currentYPos, "right");
            prevXPos++;
        } else{
            shift(currentYPos, "left");
            prevXPos--;
        }
    }
    if (currentYPos !== prevYPos) {
        if(currentYPos > prevYPos){
            shift(currentXPos, "down");
            prevYPos++;
        }else{
            shift(currentXPos, "up");
            prevYPos--;
        }
    }
}