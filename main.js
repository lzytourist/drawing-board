const canvas = document.getElementById('canvas');
const save = document.getElementById('save');
let ctx = canvas.getContext("2d");

let painting = false;
let pencil = 2;
let color = "black";
let prevDraws = [];
let idx = -1;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

ctx.fillStyle = "white";
ctx.fillRect(0, 0, canvas.width, canvas.width);

function start(e) {
    painting = true;
    ctx.beginPath();
    ctx.moveTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
    draw(e);

    e.preventDefault();
}

function draw(e) {
    if (painting) {
        ctx.lineTo(e.clientX - canvas.offsetLeft, e.clientY - canvas.offsetTop);
        ctx.strokeStyle = color;
        ctx.lineWidth = pencil;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.stroke();
    }
    e.preventDefault();
}

function stop(e) {
    if (painting) {
        ctx.stroke();
        ctx.closePath();
        painting = false;
    }

    if (e.type !== 'mouseout') {
        prevDraws.push(ctx.getImageData(0, 0, canvas.width, canvas.height))
        ++idx;
    }

    e.preventDefault();
}

function changeColor(el) {
    console.log(el.style)
    color = el.style.backgroundColor;
}

function clearBoard() {
    ctx.fillStyle = "white";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function undoBoard() {
    if (idx <= 0) {
        clearBoard();
    } else {
        prevDraws.pop();
        --idx;

        ctx.putImageData(prevDraws[idx], 0, 0);
    }
}

function saveBoard() {
    let date = new Date();
    let name = 'drawing-' + date.getDate() + '-' + date.getMonth() + 1 + '-' + date.getFullYear() + '.png';

    save.setAttribute('download', name);
    save.setAttribute('href', canvas.toDataURL('image/png').replace("image/png", "image/octet-stream"));
}

canvas.addEventListener("touchstart", start, false);
canvas.addEventListener("touchmove", draw, false);
canvas.addEventListener("mousedown", start, false);
canvas.addEventListener("mousemove", draw, false);

canvas.addEventListener("touchend", stop, false);
canvas.addEventListener("mouseout", stop, false);
canvas.addEventListener("mouseup", stop, false);

save.addEventListener('click', saveBoard);

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    if (idx >= 0) {
        ctx.putImageData(prevDraws[idx], 0, 0);
    }
});