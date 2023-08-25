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
const downloadBtn = document.querySelector('.download-btn');
const uploadBtn = document.querySelector('.upload-btn input');
const addSheetBtn = document.getElementById("add-sheet-btn");
const saveSheetBtn = document.getElementById("save-sheet-btn");
const deleteSheetBtn = document.getElementById("delete-sheet-btn");
const sheetHeading = document.querySelector(".sheet-heading");
const buttonContainer = document.querySelector(".button-container");

// Global varibles
let prevCellId;
let currCell;
let copiedData;
let lastPressedBtn;
let arrayOfMatrices;
let numOfSheets = 1;
let currSheet = 1;
let prevSheet;
let matricesArr = "mitricesArr";

// Creating empty 2D Array of objescts to store the cell data to use in Download button
let matrix = new Array(rows);
createMatrix();

// Adding 100 rows to each of 100 arrays
function createMatrix() {
    for (let row = 0; row < rows; row++) {
        matrix[row] = new Array(columns);
        for (let col = 0; col < columns; col++) {
            matrix[row][col] = {};
        }
    }
}



// Function to render existing styles
function renderMatrix() {
    matrix.forEach(row => {
        row.forEach(cellObj => {
            if (cellObj.id) {
                let currentCell = document.getElementById(cellObj.id);
                // currentCell is my html obj, cellObj is js object
                currentCell.innerText = cellObj.text;
                // I can pass cssText to style, internally it's handling
                currentCell.style = cellObj.style;
            }
        })
    })
}




// button creation of firstRender if anything already exists in local storage
if (localStorage.getItem(matricesArr)) {
    for (let i = 1; i < JSON.parse(localStorage.getItem(matricesArr)).length; i++) {
        addSheetBtnNow(true);
    }
}


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
            cell.addEventListener("focusout", updateObjInMatrix);
            cell.setAttribute("id", `${String.fromCharCode(col + 65)}${rowNumber}`)
            cell.addEventListener("focus", event => onFucusFunction(event.target));
        }
        tableRow.append(cell);
    }
}


function colGenForUploadedFile(typeofCell, tableRow, rowNumber, matrixArr) {
    // console.log(matrixArr);
    for (let col = 0; col < columns; col++) {
        const cell = document.createElement(typeofCell);
        cell.setAttribute("id", `${String.fromCharCode(col + 65)}${rowNumber}`);
        if (matrixArr[col].text) {
            cell.innerText = matrixArr[col].text;
        }
        if (matrixArr[col].style) {
            cell.style.cssText = matrixArr[col].style;
        }
        cell.setAttribute("contenteditable", true);
        cell.addEventListener("focusout", updateObjInMatrix);
        cell.addEventListener("focus", event => onFucusFunction(event.target));
        tableRow.append(cell);
    }
}



// Generating table here
colGen("th", theadRow, true);

function createNewTable(isUploaded, matrix) {
    tbody.innerHTML = '';
    if (!isUploaded) {
        for (let row = 1; row <= rows; row++) {
            const tr = document.createElement("tr");
            const th = document.createElement("th");
            th.setAttribute("id", row);
            th.innerText = row;
            tr.appendChild(th);

            // Generating cols for first time repload
            colGen("td", tr, false, row);

            tbody.appendChild(tr);
        }
    } else {
        let row2 = 0;
        for (let row = 1; row <= rows; row++) {
            const tr = document.createElement("tr");
            const th = document.createElement("th");
            th.setAttribute("id", row);
            th.innerText = row;
            tr.appendChild(th);

            // Generating cols for first time repload
            colGenForUploadedFile("td", tr, row, matrix[row2]);
            row2++;
            tbody.appendChild(tr);
        }
    }
}

createNewTable(false);
if (localStorage.getItem(matricesArr)) {
    matrix = JSON.parse(localStorage.getItem(matricesArr))[0];
    renderMatrix();
}

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

    let col = id[0].charCodeAt(0) - 65;
    let row = id.substring(1) - 1;


    matrix[row][col] = tempObj;
}


function handleDownload() {
    const matrixString = JSON.stringify(matrix);
    //Creating memory with this matrixString

    const blob = new Blob([matrixString], { type: "application/json" });

    const link = document.createElement("a");
    //converting blob to downloadable / Url
    link.href = URL.createObjectURL(blob);
    link.download = "table.json";
    // so far we have done Matrix -> Stringihy -> blob -> link (URL)

    link.click();
}


// function to update the uploaded data to the UI
function updateUploadedData(matrix) {
    tbody.innerHTML = '';
    colGen("th", theadRow, true);
    createNewTable(true, matrix);
}


function handleUpload(event) {
    // console.log(event.target.files[0]);
    const uploadedFile = event.target.files[0]

    if (uploadedFile) {
        const reader = new FileReader();

        // reader is inbuilt instance of FileReader class
        reader.readAsText(uploadedFile);

        // Overriding the onload function
        reader.onload = function (event) {
            const fileContent = JSON.parse(event.target.result);
            // console.log(fileContent);
            updateUploadedData(fileContent);
        }
    }
}


// Adding a new Btn to access the sheet
function addSheetBtnNow(isFirstReload) {
    const btn = document.createElement("button");
    numOfSheets++;
    if (!isFirstReload) {
        prevSheet = currSheet;
        currSheet = numOfSheets;
    }
    btn.classList.add("btn");
    btn.classList.add("sheet-btns");
    btn.setAttribute("id", `S${numOfSheets}`);
    btn.setAttribute("onclick", `viewSheet(event)`);
    btn.innerText = `Sheet ${numOfSheets}`;
    buttonContainer.appendChild(btn);
}


// ViewSheet Function to Switch betweeen sheets
function viewSheet(event) {
    prevSheet = currSheet;
    currSheet = event.target.id.slice(1);
    let matrixArr = JSON.parse(localStorage.getItem(matricesArr));

    // Updating the currSheet in the local storage before switching
    matrixArr[prevSheet - 1] = matrix;
    localStorage.setItem(matricesArr, JSON.stringify(matrixArr));

    // Creating new Matix
    matrix = matrixArr[currSheet - 1];
    createNewTable(true, matrix);
    sheetHeading.innerText = `Sheet ${currSheet}`;
}


// Saving my mitrics in arr in localStorage
function saveMatrices() {
    if (localStorage.getItem(matricesArr)) {
        let tempMatrixArr = JSON.parse(localStorage.getItem(matricesArr));
        let newMatrix = matrix;
        tempMatrixArr.push(newMatrix);
        localStorage.setItem(matricesArr, JSON.stringify(tempMatrixArr));
    } else {
        let tempArrMatrix = [matrix];
        localStorage.setItem(matricesArr, JSON.stringify(tempArrMatrix));
    }
}


function handleAddSheet() {
    // Adding a new Btn
    addSheetBtnNow();

    // Changing the heading
    sheetHeading.innerText = `Sheet ${currSheet}`;

    // Storing the mitrices in Local Storage
    saveMatrices();

    tbody.innerHTML = '';

    // Using create table function for both cleanUP and Creating new table
    createMatrix();
    createNewTable(false);
}


function handleSaveSheet() {
    let matrixArr = JSON.parse(localStorage.getItem(matricesArr));
    matrixArr[currSheet - 1] = matrix;
    localStorage.setItem(matricesArr, JSON.stringify(matrixArr));
}


function handleDeleteSheet() {
    console.log(numOfSheets);
    if (numOfSheets <= 1) {
        alert("You can't delete all the sheets!");
        return;
    }

    if (localStorage.getItem(matricesArr)) {
        let matrixArr = JSON.parse(localStorage.getItem(matricesArr));
        matrixArr.splice(currSheet - 1, 1);
        localStorage.setItem(matricesArr, JSON.stringify(matrixArr));
    }
    numOfSheets--;
    location.reload();
    alert(`Sheet Number ${currSheet} deleted!`);
}


// Adding functionalities to buttons with click listener
downloadBtn.addEventListener("click", handleDownload);
uploadBtn.addEventListener("input", handleUpload);
addSheetBtn.addEventListener("click", () => handleAddSheet());
saveSheetBtn.addEventListener("click", () => handleSaveSheet());
deleteSheetBtn.addEventListener("click", () => handleDeleteSheet());
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