const NORMAL = 1;
const FLAGGED =  2;
const REVEALED = 3;
var COLUMNS = 20;
var ROWS = 20;
var TOTALMINES = 0;
var FIRSTCLICK = true;

function checkCoord (x,y){
    if (x >= 0 && x < ROWS && y >= 0 && y < COLUMNS)
        return true;
    else
        return false
}

function revealNext (x,y){
    if (checkCoord(x, y))
        {
            if (board.cells[x][y].number === 0 && 
                board.cells[x][y].state !== REVEALED)
                board.reveal(x,y);
            else if (board.cells[x][y].number < 9){
                board.cells[x][y].state = REVEALED;
                return;
            }
        }
}
var board = {
    cells: [],
    createBoard: function (length, width) {
        this.cells = [];
        for (var i = 0; i < length; i++)
        {
            var table = document.querySelector("table");
            var tWidth = 25*COLUMNS;
            table.style.width = tWidth.toString()+"px";
            var temp = [];
            for (var j = 0; j < width; j++)
            {
                temp.push({
                    mine: false,
                    state: NORMAL,
                    number: 0,
                });
            };
            this.cells.push(temp);
        }
    },
    makeMines: function (clickedCellRow, clickedCellCol) {
        var totalMines = 0;
        for (var i = 0; i < ROWS; i++)
        {
            for (var j = 0; j < COLUMNS; j++)
            {
                if (Math.random() <= .15 &&( i < clickedCellRow - 1 || i > clickedCellRow + 1
                                         || j < clickedCellCol - 1 || j > clickedCellCol + 1))
                {
                    this.cells[i][j].mine = true;
                    this.cells[i][j].number = 10;
                    totalMines++;
                    if (checkCoord(i - 1, j - 1))
                        board.cells[i - 1][j - 1].number++;
                    if (checkCoord(i - 1, j))
                        board.cells[i - 1][j].number++;
                    if (checkCoord(i - 1, j + 1))
                        board.cells[i - 1][j + 1].number++;
                    if (checkCoord(i, j - 1))
                        board.cells[i][j - 1].number++;
                    if (checkCoord(i, j + 1))
                        board.cells[i][j + 1].number++;
                    if (checkCoord(i + 1, j - 1))
                        board.cells[i + 1][j - 1].number++;
                    if (checkCoord(i + 1, j ))
                        board.cells[i + 1][j].number++;
                    if (checkCoord(i + 1, j + 1))
                        board.cells[i + 1][j + 1].number++;
                }
            }
        }
        return totalMines;
    },
    setFlag: function (row,col) {
        if (this.cells[row][col].state === NORMAL)
            this.cells[row][col].state = FLAGGED;
        else if (this.cells[row][col].state === FLAGGED)
            this.cells[row][col].state = NORMAL;
    },
    reveal: function (row,col) {
        this.cells[row][col].state = REVEALED;

        if(this.cells[row][col].number === 0)
        {
            revealNext(row - 1, col - 1);
            revealNext(row - 1, col);
            revealNext(row - 1, col + 1);
            revealNext(row, col - 1);
            revealNext(row, col + 1);
            revealNext(row + 1, col - 1);
            revealNext(row + 1, col);
            revealNext(row + 1, col + 1);
        }
    },
    revealAll: function () {
        for (var i = 0; i < ROWS; i++)
        {
            for (var j = 0; j < COLUMNS; j++)
            {
                this.cells[i][j].state = REVEALED;
            }
        }
    },
    checkWin: function () {
        var revealedCells = 0;
        for (var i = 0; i < ROWS; i++)
        {
            for (var j = 0; j < COLUMNS; j++)
            {
                if (this.cells[i][j].state === REVEALED)
                    revealedCells++;
            }
        }
        if (revealedCells === ROWS*COLUMNS-TOTALMINES)
            return true;
        else
            return false;
    }
};

var handlers = {
    rowChange: function () {
        if(event.keyCode === 13)
        {
            newRows = document.getElementById("newRows");
            ROWS = newRows.valueAsNumber;
            this.restart();
            newRows.value = '';
        }
    },
    colChange: function () {
        if(event.keyCode === 13)
        {
            newCols = document.getElementById("newCols");
            COLUMNS = newCols.valueAsNumber;
            this.restart();
            newCols.value = '';
        }
    }, 
    restart: function () {
        FIRSTCLICK = true;
        TOTALMINES = 0;
        board.createBoard(ROWS,COLUMNS);
        view.displayBoard();
        var face = document.querySelector("img");
        face.setAttribute("src", "face.jpg");
    }
};

var view = {
    displayBoard: function () {
        var tBody = document.querySelector("tbody");
        tBody.innerHTML = '';
        for (i = 0; i < ROWS; i++)
        {
            var tableTr = document.createElement("tr");
            tBody.appendChild(tableTr);
            for (j = 0; j < COLUMNS; j++)
            {
                var tableTd = document.createElement("td");
                tableTd.setAttribute("class","cell");
                tableTd.setAttribute("data-row", i);
                tableTd.setAttribute("data-col", j);
                tableTd.id = ROWS*i + j;
                tableTr.appendChild(tableTd);
                switch (board.cells[i][j].state)
                {
                    case NORMAL: break;
                    case FLAGGED:
                        var flagImg = document.createElement("img");
                        flagImg.setAttribute("src", "flag.jpg");
                        flagImg.setAttribute("width", "100%");
                        flagImg.setAttribute("height", "auto");
                        flagImg.setAttribute("style","block");
                        flagImg.setAttribute("class","flag");
                        tableTd.appendChild(flagImg);
                        break;
                    case REVEALED:
                        if (board.cells[i][j].mine)
                        {
                            var mineImg = document.createElement("img");
                            mineImg.setAttribute("src", "mine.jpg");
                            mineImg.setAttribute("width", "100%");
                            mineImg.setAttribute("height", "auto");
                            mineImg.setAttribute("style","block");
                            tableTd.setAttribute("class","clickedCell");
                            tableTd.appendChild(mineImg);
                        }
                        else
                        {
                            if (board.cells[i][j].number !== 0)               
                                tableTd.innerHTML = board.cells[i][j].number;
                            tableTd.setAttribute("class","clickedCell");
                            switch(board.cells[i][j].number)
                            {
                                case 1:
                                    tableTd.setAttribute("style","color: blue");
                                    break;
                                case 2:
                                    tableTd.setAttribute("style","color: green");
                                    break;
                                case 3:
                                    tableTd.setAttribute("style","color: red");
                                    break;
                                case 4:
                                    tableTd.setAttribute("style","color: purple");
                                    break;
                                case 5:
                                    tableTd.setAttribute("style","color: darkred");
                                    break;
                            }
                        }
                        break;
                }
            }
        }
    
    },
    setEventListener: function () {
        var tBody = document.querySelector("tbody");
        tBody.addEventListener("click", function (event){
            var elementClicked = event.target;
            if (elementClicked.className === "cell")
            {
                var clickedRow = elementClicked.getAttribute("data-row");
                var clickedCol = elementClicked.getAttribute("data-col");
                if (!FIRSTCLICK)
                    board.reveal(parseInt(clickedRow),parseInt(clickedCol));
                if (board.cells[clickedRow][clickedCol].mine)
                {
                    board.revealAll();
                    var face = document.querySelector("img");
                    face.setAttribute("src", "xface.jpg");
                    view.displayBoard();
                }
                else if (FIRSTCLICK)
                {
                    TOTALMINES = board.makeMines(parseInt(clickedRow), parseInt(clickedCol));
                    FIRSTCLICK = false;
                    board.reveal(parseInt(clickedRow),parseInt(clickedCol));
                    view.displayBoard();
                }
                if (board.checkWin())
                {
                    board.revealAll();
                    var face = document.querySelector("img");
                    face.setAttribute("src", "sunface.jpg");
                    view.displayBoard();
                }
                else view.displayBoard();
            }
        });
        tBody.addEventListener("contextmenu", function(event) {
            event.preventDefault();
            var elementClicked = event.target;
            console.log(elementClicked); 
            if (elementClicked.className === "flag")
                    elementClicked = elementClicked.parentNode;
            if (elementClicked.className === "cell")
            {
                var clickedRow = elementClicked.getAttribute("data-row");
                var clickedCol = elementClicked.getAttribute("data-col");
                board.setFlag(clickedRow, clickedCol);
                view.displayBoard();
            }
        });
    }
}

board.createBoard(ROWS,COLUMNS);
view.displayBoard();
view.setEventListener();