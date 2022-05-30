const canvas = document.getElementById("drawingSpace");
const ctx = canvas.getContext("2d");
ctx.strokeStyle = '#000000';
ctx.lineWidth = 5;
let prevX;
let prevY;
let mode = "line";
//line
//rectFill
//rectStroke
//region cursor preview
let cursor = document.getElementById("cursor");
document.body.addEventListener("mousemove", function (e) {
    cursor.style.left = e.clientX + "px";
    cursor.style.top = e.clientY + "px";
});
//endregion
console.log(canvas.offsetLeft);
console.log(canvas.offsetTop);
function getMousePos(canvas, evt) {
    let rect = canvas.getBoundingClientRect(), // abs. size of element
    scaleX = canvas.width / rect.width, // relationship bitmap vs. element for x
    scaleY = canvas.height / rect.height; // relationship bitmap vs. element for y
    return {
        x: (evt.clientX - rect.left) * scaleX,
        y: (evt.clientY - rect.top) * scaleY // been adjusted to be relative to element
    };
}
canvas.addEventListener("mousedown", (e) => {
    let pos = getMousePos(canvas, e);
    prevX = pos.x;
    prevY = pos.y;
    if (mode == "line") {
        canvas.addEventListener("mousemove", draw);
    }
    // else if(mode.startsWith("rect")) just set the prevX and prevY to the corner of the rectangle
});
canvas.addEventListener("mouseup", (e) => {
    if (mode == "line") {
        canvas.removeEventListener("mousemove", draw);
    }
    else if (mode.startsWith("rect")) {
        let pos = getMousePos(canvas, e);
        let x = pos.x;
        let y = pos.y;
        ctx.beginPath();
        ctx.rect(prevX, prevY, x - prevX, y - prevY);
        ctx.closePath();
        if (mode.endsWith("Fill")) {
            ctx.fill();
        }
        else if (mode.endsWith("Stroke")) {
            ctx.stroke();
        }
    }
});
function draw(e) {
    let pos = getMousePos(canvas, e);
    let x = pos.x;
    let y = pos.y;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(prevX, prevY);
    ctx.closePath();
    ctx.stroke();
    prevX = x;
    prevY = y;
}
//# sourceMappingURL=canvas.js.map
//# sourceMappingURL=canvas.js.map