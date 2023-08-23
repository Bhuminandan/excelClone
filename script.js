// Table Diamentions
const rows = 100;
const columns = 26;


// Global varibles
let prevCellId;
let currCell;
let copiedText;

// Getting DOM elements
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

// Colgeneration to Avoid Repetation
// Util function for cols
function colGen(typeofCell, tableRow, isInnerText, rowNumber) {
    for (let col = 0; col < columns; col++) {
        const cell = document.createElement(typeofCell);
        if (isInnerText) {
            cell.innerText = String.fromCharCode(col + 65);
            cell.setAttribute("id", `${String.fromCharCode(col + 65)}`);
        } else {
            cell.setAttribute("contenteditable", true);
            cell.setAttribute("id", `${String.fromCharCode(col + 65)}${rowNumber}`)
            cell.addEventListener("focus", event => onFucusFunction(event.target));
        }
        tableRow.append(cell);
    }
}
colGen("th", theadRow, true);

function onFucusFunction(cell) {
    currCell = cell;
    renderExistingStyles(currCell);
    // console.log(currCell)
    const currentCellId = cell.id;
    emptyCell.innerHTML = currentCellId;

    if (prevCellId) {
        setCellColor(prevCellId[0], prevCellId.substring(1), 'transparent');
    }

    setCellColor(cell.id[0], cell.id.substring(1), '#EFFBFB');
    prevCellId = cell.id;
}

function setCellColor(colId, rowId, color) {
    const colHead = document.getElementById(colId);
    const rowHead = document.getElementById(rowId);
    colHead.style.backgroundColor = color;
    rowHead.style.backgroundColor = color;
}

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
}


// Styling 

// Copy Btn
copyBtn.addEventListener("click", () => {
    copiedText = currCell.innerText;
    renderExistingStyles(currCell);
})

// cut Btn
cutBtn.addEventListener("click", () => {
    copiedText = currCell.innerText;
    currCell.innerText = '';
    renderExistingStyles(currCell);
})

// Paste Btn
pasteBtn.addEventListener("click", () => {
    if (copiedText) {
        currCell.innerText = copiedText;
    }
    renderExistingStyles(currCell);
})


// Text Styling


function buttonClickHandler(currCell, styleProperty, styleToAdd, styleRemoverWord) {
    if (currCell === undefined) return;
    if (currCell.style[styleProperty] === styleToAdd) {
        currCell.style[styleProperty] = styleRemoverWord;
        renderExistingStyles(currCell);
    } else {
        currCell.style[styleProperty] = styleToAdd;
        renderExistingStyles(currCell);
    }
}


boldBtn.addEventListener("click", () => buttonClickHandler(currCell, "fontWeight", "bold", "normal"));
italicBtn.addEventListener("click", () => buttonClickHandler(currCell, "fontStyle", "italic", "normal"));
underlineBtn.addEventListener("click", () => buttonClickHandler(currCell, "textDecoration", "underline", "none"));
fontSelection.addEventListener("change", (event) => buttonClickHandler(currCell, "fontFamily", event.target.value, "Arimo"));
fontSizeSelection.addEventListener("change", (event) => buttonClickHandler(currCell, "fontSize", `${event.target.value}px`, "14"));
fontColorSelection.addEventListener("change", (event) => buttonClickHandler(currCell, "color", event.target.value, "#000"));



