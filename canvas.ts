const canvas = <HTMLCanvasElement>document.getElementById("drawingSpace");
const ctx = canvas.getContext("2d");
ctx.strokeStyle = '#000000';
ctx.lineWidth = 5;

const modeButton = document.getElementById("modeButton");
let mode = "line";
//erase
//line
//rectFill
//rectStroke
//circleFill
//circleStroke

modeButton.onclick = function () {
    if (mode === "line") {
        mode = "erase";
        modeButton.innerText = "Erase";
    } else if (mode === "erase")
    {
        mode = "rectFill";
        modeButton.innerText = "Rectangle Fill";
    }
    else if (mode === "rectFill")
    {
        mode = "rectStroke";
        modeButton.innerText = "Rectangle Stroke";
    }
    else if (mode === "rectStroke")
    {
        mode = "circleFill";
        modeButton.innerText = "Circle Fill";
    }
    else if (mode === "circleFill")
    {
        mode = "circleStroke";
        modeButton.innerText = "Circle Stroke";
    }
    else if (mode === "circleStroke")
    {
        mode = "line";
        modeButton.innerText = "Line";
    }
};

let prevX;
let prevY;

//region cursor preview
let cursor = document.getElementById("cursor");
document.body.addEventListener("mousemove", function (e) {
    cursor.style.left = e.clientX + "px";
    cursor.style.top = e.clientY + "px";
});
//endregion

function getMousePos(canvas, evt) {
    let rect = canvas.getBoundingClientRect(), // abs. size of element
        scaleX = canvas.width / rect.width,    // relationship bitmap vs. element for x
        scaleY = canvas.height / rect.height;  // relationship bitmap vs. element for y

    return {
        x: (evt.clientX - rect.left) * scaleX,   // scale mouse coordinates after they have
        y: (evt.clientY - rect.top) * scaleY     // been adjusted to be relative to element
    }
}

canvas.addEventListener("mousedown", (e) => {
    let pos = getMousePos(canvas, e);
    prevX = pos.x;
    prevY = pos.y;
    if (mode == "line") {
        canvas.addEventListener("mousemove", drawLine);
    }
    else if(mode == "erase")
    {
        canvas.addEventListener("mousemove", eraseLine);
    }
    // else if(mode.startsWith("rect")) just set the prevX and prevY to the corner of the rectangle
    // else if(mode.startsWith("circle")) just set the prevX and prevY to the corner of the rectangle
});

canvas.addEventListener("mouseup", (e) => {
    if (mode == "line") {
        canvas.removeEventListener("mousemove", drawLine);
        return;
    }
    else if(mode == "erase") {
        canvas.removeEventListener("mousemove", eraseLine);
        return;
    }
    
    let pos = getMousePos(canvas, e);
    let x = pos.x;
    let y = pos.y;
    ctx.beginPath();
    if (mode.startsWith("rect")) {
        
        if (mode.endsWith("Fill")) {
            ctx.rect(prevX, prevY, x - prevX, y - prevY);
            ctx.closePath();
            ctx.fill();
        } else if (mode.endsWith("Stroke")) {
            ctx.rect(prevX, prevY, x - prevX - ctx.lineWidth, y - prevY - ctx.lineWidth);
            ctx.closePath();
            ctx.stroke();
        }
    } 
    else if (mode.startsWith("circle")) {
        ctx.arc(prevX, prevY, Math.floor((x - prevX)*Math.sqrt(2))-ctx.lineWidth, 0, 2 * Math.PI);
        ctx.closePath();
        if (mode.endsWith("Fill")) {
            ctx.fill();
        } else if (mode.endsWith("Stroke")) {
            ctx.stroke();
        }
    }
});

function drawLine(e) {
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

function eraseLine(e){
    let pos = getMousePos(canvas, e);
    let x = pos.x;
    let y = pos.y;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.clearRect(prevX, prevY, ctx.lineWidth, ctx.lineWidth);
    ctx.closePath();
    ctx.stroke();
    prevX = x;
    prevY = y;
}

let download = function(){
    let link = document.createElement('a');
    link.download = 'filename.png';
    link.href = canvas.toDataURL()
    link.click();
}

document.getElementById("downloadButton").onclick = download;
document.getElementById("clearButton").onclick = function() {
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
//# sourceMappingURL=canvas.js.map