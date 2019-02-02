const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 900;
canvas.height = 900;

canvas.addEventListener("mousedown", mouseDown);
canvas.addEventListener("mouseup", mouseUp);

setup(10);

function setup(size) {
    window.gridSize = size;
    window.squareSize = Math.floor(canvas.width / gridSize);
    window.grid = makeGrid(gridSize);

    draw();
}

function draw() {
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            let num = grid[y][x] - 1;
            let row = Math.floor(num / gridSize);
            let col = num - row * gridSize;
            ctx.fillStyle = 'rgb(' + Math.floor(255 - (255 / gridSize) * row) + ', ' +
                Math.floor(255 - (255 / gridSize) * col) + ', 0)';
            ctx.fillRect(x * squareSize, y * squareSize, squareSize, squareSize);
            ctx.font = squareSize / 1.3 + "px Arial";
            ctx.textAlign = "center";
            ctx.fillStyle = "#000";
            ctx.fillText(grid[y][x], x * squareSize + squareSize / 2, y * squareSize + squareSize / 1.3);
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

function mouseDown() {
    window.downxpos = event.clientX;
    window.downypos = event.clientY;
}

function mouseUp() {
    window.upxpos = event.clientX;
    window.upypos = event.clientY;
    mouseDistance();
}

function mouseDistance() {
    let mdx = Math.floor(downxpos / squareSize);
    let mux = Math.floor(upxpos / squareSize);
    let mdy = Math.floor(downypos / squareSize);
    let muy = Math.floor(upypos / squareSize);
    let dir;
    if (Math.abs(downxpos - upxpos) > Math.abs(downypos - upypos)) {
        if (downxpos > upxpos) {
            dir = "left";
        } else {
            dir = "right";
        }
        let times = Math.abs(mdx - mux);
        for (let i = 0; i < times; i++) {
            shift(mdy, dir);
        }
    } else {
        if (downypos > upypos) {
            dir = "up";
        } else {
            dir = "down";
        }
        let times = Math.abs(mdy - muy);
        for (let i = 0; i < times; i++) {
            shift(mdx, dir);
        }
    }
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