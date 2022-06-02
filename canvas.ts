const canvas = <HTMLCanvasElement>document.getElementById("drawingSpace");
const ctx = canvas.getContext("2d");
ctx.strokeStyle = '#000000';
ctx.lineWidth = 5;

enum modes {
    line,
    erase,
    rectFill,
    rectStroke,
    circleFill,
    circleStroke
}

let mode = modes.line;

let prevX;
let prevY;

//region cursor preview
let cursor = document.getElementById("cursor");
document.body.addEventListener("mousemove", function (e) {
    cursor.style.left = e.clientX + "px";
    cursor.style.top = e.clientY + "px";
});
//endregion

function getMousePos(canvasElement : HTMLElement, evt) {
    let rect = canvasElement.getBoundingClientRect(), // abs. size of element
        scaleX = canvasElement.offsetWidth / rect.width,    // relationship bitmap vs. element for x
        scaleY = canvasElement.offsetHeight / rect.height;  // relationship bitmap vs. element for y

    return {
        x: (evt.clientX - rect.left) * scaleX,   // scale mouse coordinates after they have
        y: (evt.clientY - rect.top) * scaleY     // been adjusted to be relative to element
    }
}

canvas.addEventListener("mousedown", (e) => {
    let pos = getMousePos(canvas, e);
    prevX = pos.x;
    prevY = pos.y;
    if (mode == modes.line) {
        canvas.addEventListener("mousemove", function () {
            let pos = getMousePos(canvas, e);
            drawLine(pos.x, pos.y);
        });
    }
    else if(mode == modes.erase) {
        canvas.addEventListener("mousemove", function () {
            let pos = getMousePos(canvas, e);
            eraseLine(pos.x, pos.y)
        });
    }
    // else if(mode.startsWith("rect")) just set the prevX and prevY to the corner of the rectangle
    // else if(mode.startsWith("circle")) just set the prevX and prevY to the corner of the rectangle
});

canvas.addEventListener("mouseup", (e) => {
    let pos = getMousePos(canvas, e);
    let x = pos.x;
    let y = pos.y;
    switch (mode) {
        case modes.line:
            canvas.removeEventListener("mousemove", function () {
                let pos = getMousePos(canvas, e);
                drawLine(pos.x, pos.y);
            });
            break;
        case modes.erase:
            canvas.removeEventListener("mousemove", function () {
                let pos = getMousePos(canvas, e);
                eraseLine(pos.x, pos.y)
            });
            break;
        case modes.rectFill:
            drawRectFilled(x, y);
            break;
        case modes.rectStroke:
            drawRectStroked(x, y);
            break;
        case modes.circleFill:
            drawCircleFilled(x, y);
            break;
        case modes.circleStroke:
            drawCircleStroked(x, y);
            break;
    }
});

//region drawFunctions
function drawLine(x,y) {

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(prevX, prevY);
    ctx.closePath();
    ctx.stroke();
    prevX = x;
    prevY = y;
}

function eraseLine(x,y){

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.clearRect(prevX, prevY, ctx.lineWidth, ctx.lineWidth);
    ctx.closePath();
    ctx.stroke();
    prevX = x;
    prevY = y;
}

function drawRectFilled(x,y){

    ctx.beginPath();
    ctx.rect(prevX, prevY, x - prevX, y - prevY);
    ctx.closePath();
    ctx.fill();
}

function drawRectStroked(x,y){

    ctx.beginPath();
    ctx.rect(prevX, prevY, x - prevX - ctx.lineWidth, y - prevY - ctx.lineWidth);
    ctx.closePath();
    ctx.stroke();
}

function drawCircleFilled(x,y){

    ctx.beginPath();
    ctx.arc(prevX, prevY, Math.floor((x - prevX)*Math.sqrt(2))-ctx.lineWidth, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fill();
}

function drawCircleStroked(x,y){

    ctx.beginPath();
    ctx.arc(prevX, prevY, Math.floor((x - prevX)*Math.sqrt(2))-ctx.lineWidth, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.stroke();
}
//endregion

//region buttons
const modeButton = document.getElementById("modeButton");
modeButton.onclick = function () {
    if (mode == modes.line) {
        mode = modes.erase;
        modeButton.innerText = "Erase";
    }
    else if (mode == modes.erase) {
        mode = modes.rectFill;
        modeButton.innerText = "Rectangle Fill";
    }
    else if (mode == modes.rectFill) {
        mode = modes.rectStroke;
        modeButton.innerText = "Rectangle Stroke";
    }
    else if (mode == modes.rectStroke) {
        mode = modes.circleFill;
        modeButton.innerText = "Circle Fill";
    }
    else if (mode == modes.circleFill) {
        mode = modes.circleStroke;
        modeButton.innerText = "Circle Stroke";
    }
    else if (mode == modes.circleStroke) {
        {
            mode = modes.line;
            modeButton.innerText = "Line";
        }
    }
}

const downloadButton = document.getElementById("downloadButton");
downloadButton.onclick = function(){
    let link = document.createElement('a');
    link.download = 'filename.png';
    link.href = canvas.toDataURL()
    link.click();
};

const clearButton = document.getElementById("clearButton");
clearButton.onclick = function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

const colorButton = document.getElementById("colorButton");
colorButton.addEventListener("click", function (e){
    let rect = colorButton.getBoundingClientRect();
    let x = e.clientX - rect.left; //x position within the element.
    let y = e.clientY - rect.top;  //y position within the element.
    let xy = Math.sqrt(x^2 * y^2); //new value
    let maxValue = Math.sqrt(colorButton.offsetWidth^2 * colorButton.offsetHeight^2); //max xy
    let color = '#'+Math.floor(xy/maxValue*16777215).toString(16); //xy to color
    colorButton.style.backgroundColor = color;
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
})

const lineWidthButton = document.getElementById("widthButton");
lineWidthButton.addEventListener("click", function (e){
    let rect = lineWidthButton.getBoundingClientRect();
    let x = e.clientX - rect.left; //x position within the element.
    let maxValue = lineWidthButton.offsetWidth; //max x
    ctx.lineWidth = Math.floor(x/maxValue*10);
    lineWidthButton.innerText = String(ctx.lineWidth);
    cursor.style.width = Math.ceil(ctx.lineWidth * 2.5) + "px";
    cursor.style.height = Math.ceil(ctx.lineWidth * 2.5) + "px";
});
//endregion
//# sourceMappingURL=canvas.js.map