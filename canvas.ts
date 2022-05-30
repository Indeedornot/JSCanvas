const canvas = <HTMLCanvasElement>document.getElementById("drawingSpace");
const ctx = canvas.getContext('2d');
ctx.strokeStyle = '#000000';
ctx.lineWidth = 5;

let prevX;
let prevY;
canvas.addEventListener("mousedown", (e) => {
    prevX = Math.floor(e.offsetX /4.5)
    prevY = Math.floor(e.offsetY /4.5);
    canvas.addEventListener("mousemove", draw);
});

canvas.addEventListener("mouseup", (e) => {
    canvas.removeEventListener("mousemove", draw);
});

function draw(e : MouseEvent){
    let x = Math.floor(e.offsetX /4.5)
    let y = Math.floor(e.offsetY /4.5);
    ctx.beginPath();
    ctx.moveTo(x,y);
    ctx.lineTo(prevX, prevY);
    ctx.closePath();
    ctx.stroke();
    prevX = Math.floor(e.offsetX /4.5)
    prevY = Math.floor(e.offsetY /4.5);
}