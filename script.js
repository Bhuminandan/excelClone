// Table Diamentions
const rows = 100;
const columns = 26;


// Getting DOM elements
const alignLeft = document.querySelector(".align-left");
const alignMiddle = document.querySelector(".align-middle");
const alignRight = document.querySelector(".align-right");
const table = document.querySelector("#table");
const thead = document.querySelector("#thead");
const theadRow = document.querySelector("#head-tr");
const tbody = document.querySelector("#tbody");
const emptyCell = document.querySelector(".current-cell");
const boldBtn = document.querySelector(".bold-text");
const italicBtn = document.querySelector(".italic-text");
const underlineBtn = document.querySelector(".underline-text");
const cutBtn = document.querySelector(".cut");
const copyBtn = document.querySelector(".copy");
const formatBtn = document.querySelector(".format");
const pasteBtn = document.querySelector(".paste-icon-div");
const fontSelection = document.getElementById('select');
const fontSizeSelection = document.getElementById('select-font-size');
const fontColorSelection = document.getElementById('hexcolorInput');
const fontColorSelectionForBg = document.getElementById('hexcolorInputBg');


// Global varibles
let prevCellId;
let currCell;
let copiedData;
let lastPressedBtn;



// Creating empty 2D Array of objescts to store the cell data to use in Download button

let matrix = new Array(rows);

for (let row = 0; row < rows; row++) {
    matrix[row] = new Array(columns);

    for (let col = 0; col < columns; col++) {
        matrix[row][col] = {};
    }
}

// console.log(matrix);

// Colgeneration to Avoid Repetation


// Text Styling Handler Funcion 
// Util function for handling click events
function buttonClickHandler(currCell, styleProperty, styleToAdd, styleRemoverWord) {
    if (currCell === undefined) return;
    if (currCell.style[styleProperty] === styleToAdd) {
        currCell.style[styleProperty] = styleRemoverWord;
        renderExistingStyles(currCell);
    } else {
        currCell.style[styleProperty] = styleToAdd;
        renderExistingStyles(currCell);
    }
    updateObjInMatrix();
}




// Util function for cols
function colGen(typeofCell, tableRow, isInnerText, rowNumber) {
    for (let col = 0; col < columns; col++) {
        const cell = document.createElement(typeofCell);
        if (isInnerText) {
            cell.innerText = String.fromCharCode(col + 65);
            cell.setAttribute("id", `${String.fromCharCode(col + 65)}`);
        } else {
            cell.setAttribute("contenteditable", true);
            cell.addEventListener("focusout", updateObjInMatrix);
            cell.setAttribute("id", `${String.fromCharCode(col + 65)}${rowNumber}`)
            cell.addEventListener("focus", event => onFucusFunction(event.target));
        }
        tableRow.append(cell);
    }
}


// Text Styling Functionality


function renderExistingStyles(currCell) {
    if (currCell.style.fontWeight === 'bold') {
        boldBtn.style.backgroundColor = "rgba(214, 214, 214, 0.946)";
    } else {
        boldBtn.style.backgroundColor = "#F7F7F7";
    }

    if (currCell.style.fontStyle === "italic") {
        italicBtn.style.backgroundColor = "rgba(214, 214, 214, 0.946)";
    } else {
        italicBtn.style.backgroundColor = "#F7F7F7";
    }

    if (currCell.style.textDecoration === "underline") {
        underlineBtn.style.backgroundColor = "rgba(214, 214, 214, 0.946)";
    } else {
        underlineBtn.style.backgroundColor = "#F7F7F7";
    }
    updateObjInMatrix();
}



// Generating table here
colGen("th", theadRow, true);
for (let row = 1; row <= rows; row++) {
    const tr = document.createElement("tr");
    const th = document.createElement("th");
    th.setAttribute("id", row);
    th.innerText = row;
    tr.appendChild(th);

    // Generating cols
    colGen("td", tr, false, row);

    tbody.appendChild(tr);
}




// On Focus Function
function onFucusFunction(cell) {
    currCell = cell;
    renderExistingStyles(currCell);
    // console.log(currCell)
    const currentCellId = cell.id;
    emptyCell.innerHTML = currentCellId;

    if (prevCellId) {
        setCellHeadColor(prevCellId[0], prevCellId.substring(1), 'transparent');
    }

    setCellHeadColor(cell.id[0], cell.id.substring(1), '#EFFBFB');
    prevCellId = cell.id;

}


// Function to make the highLight the bachground color of the focused cell row and col head
function setCellHeadColor(colId, rowId, color) {
    const colHead = document.getElementById(colId);
    const rowHead = document.getElementById(rowId);
    colHead.style.backgroundColor = color;
    rowHead.style.backgroundColor = color;
    updateObjInMatrix();
}


// Copy Pasting button workings 

// cut Btn
cutBtn.addEventListener("click", () => {
    lastPressedBtn = 'cut';
    copiedData = {
        text: currCell.innerText,
        style: currCell.style.cssText,
    }
    currCell.innerText = '';
    currCell.style.cssText = '';
    updateObjInMatrix();
})


// Copy Btn
copyBtn.addEventListener("click", () => {
    lastPressedBtn = 'copy';
    copiedData = {
        text: currCell.innerText,
        style: currCell.style.cssText,
    }
})

// Paste Btn
pasteBtn.addEventListener("click", () => {

    if (copiedData === undefined) {
        return;
    }

    currCell.innerText = copiedData.text;
    currCell.style = copiedData.style;

    if (lastPressedBtn === 'cut') {
        copiedData = undefined;
    };
    updateObjInMatrix();
})



// format Btn
formatBtn.addEventListener("click", () => {
    boldBtn.style.backgroundColor = "#f7f7f7";
    italicBtn.style.backgroundColor = "#f7f7f7";
    underlineBtn.style.backgroundColor = "#f7f7f7";
    currCell.style.fontWeight = "normal";
    currCell.style.fontStyle = "normal";
    currCell.style.textDecoration = "none";
    currCell.style.color = '#000';
    currCell.style.fontSize = '16px';
    updateObjInMatrix();
})



// Update Cell in matrix function

function updateObjInMatrix() {
    let id = currCell.id;
    let tempObj = {
        id: id,
        text: currCell.innerText,
        style: currCell.style.cssText,
    }

    console.log(tempObj);

    let col = id[0].charCodeAt(0) - 65;
    let row = id.substring(1) - 1;

    // console.log(col)
    // console.log(row)

    matrix[row][col] = tempObj;
    // console.log(matrix);
}



// Adding functionalities to buttons with click listener
boldBtn.addEventListener("click", () => buttonClickHandler(currCell, "fontWeight", "bold", "normal"));
italicBtn.addEventListener("click", () => buttonClickHandler(currCell, "fontStyle", "italic", "normal"));
underlineBtn.addEventListener("click", () => buttonClickHandler(currCell, "textDecoration", "underline", "none"));
alignLeft.addEventListener("click", () => buttonClickHandler(currCell, "textAlign", "left", "left"));
alignMiddle.addEventListener("click", () => buttonClickHandler(currCell, "textAlign", "center", "center"));
alignRight.addEventListener("click", () => buttonClickHandler(currCell, "textAlign", "right", "right"));
fontSelection.addEventListener("change", (event) => buttonClickHandler(currCell, "fontFamily", event.target.value, "Arimo"));
fontSizeSelection.addEventListener("change", (event) => buttonClickHandler(currCell, "fontSize", `${event.target.value}px`, "14"));
fontColorSelection.addEventListener("change", (event) => buttonClickHandler(currCell, "color", event.target.value, "#000"));
fontColorSelectionForBg.addEventListener("change", (event) => buttonClickHandler(currCell, "backgroundColor", event.target.value, "transperent"));