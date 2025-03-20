function GameBoard() {
    const row = 3;
    const col = 3;
    const arr = [];

    const getBoard = (row, col) => arr[row][col];

    const setBoard = (row, col, symbol) => arr[row][col] = symbol;

    const resetArr = () =>{
        for (i = 0; i < row; i++) {
            arr[i] = [];
            for (j = 0; j < col; j++) {
                arr[i][j] = Math.random();
            }
        }
    }

    
    resetArr();

    return { getBoard, setBoard, resetArr};
}

function Game() {
    let playerTurn = true; //true for p1, false for p2
    let numOfTurns = 0;
    const board = GameBoard();

    const getPlayerSymbol = () => playerTurnSymbol = playerTurn == true ? "X" : "O" //p1 will be X

    const updatePlayerTurn = () => {
        playerTurn = !playerTurn
    }

    const checkWin = () => {

        for (i = 0; i < 3; i++) {
            //check rows
            if (board.getBoard(i, 0) === board.getBoard(i, 1) && board.getBoard(i, 0) === board.getBoard(i, 2) && board.getBoard(i, 1) === board.getBoard(i, 2)) return true;

            //check cols
            if (board.getBoard(0, i) === board.getBoard(1, i) && board.getBoard(0, i) === board.getBoard(2, i) && board.getBoard(1, i) === board.getBoard(2, i)) return true;
        }

        //check top left diagonal to bottom right
        if (board.getBoard(0, 0) === board.getBoard(1, 1) && board.getBoard(0, 0) === board.getBoard(2, 2) && board.getBoard(1, 1) === board.getBoard(2, 2)) return true;

        //check bot left diagonal to top right
        if (board.getBoard(2, 0) === board.getBoard(1, 1) && board.getBoard(2, 0) === board.getBoard(0, 2) && board.getBoard(1, 1) === board.getBoard(0, 2)) return true;
    }

    const checkValidTurn = (row,col) =>{
        return typeof(board.getBoard(row,col)) == "number"
    }

    const restartGame = () =>{
        DisplayController().clearBoard();
        board.resetArr();
        numOfTurns = 0;
        playerTurn = true;
        DisplayController().updatePlayerTurnText(getPlayerSymbol());
    }

    const playTurn = (row, col)=>{
        if(checkValidTurn(row,col))
        {
            numOfTurns++;
            board.setBoard(row,col,getPlayerSymbol());
            DisplayController().updateHTMLUI(row,col,getPlayerSymbol());
            if(checkWin()){
                console.log(`${getPlayerSymbol()} WINS`);
                DisplayController().handleEndGame("WIN",getPlayerSymbol());
            }
            if(numOfTurns >= 9){
                console.log("DRAW");
                DisplayController().handleEndGame("DRAW","");
            }
            updatePlayerTurn();
            DisplayController().updatePlayerTurnText(getPlayerSymbol());
        }
        else{
            DisplayController().logInvalidMove();
        }
    }

    return {updatePlayerTurn, playTurn, restartGame};
}


function DisplayController() {
    const cells = document.querySelectorAll(".cell");
    const resetBtn = document.getElementById("resetBoard")
    const playerTurnText = document.getElementById("playersTurnText");
    const logText = document.getElementById("logText");
    const modal = document.getElementById("game-over-container");
    const endText = document.getElementById("endText");
    const restartGame = document.getElementById("restartEndBtn");
    const game = Game();


    const start = () => {
        resetBtn.addEventListener("click", (e) => {
            game.restartGame();
        })

        cells.forEach(cell => {
            cell.addEventListener("click", (e) => {
                logText.innerText = "";
                game.playTurn(Number.parseInt(e.target.dataset.row), Number.parseInt(e.target.dataset.col));
            })
        })

    };

    const clearBoard = ()=>{
        for(i=0;i<cells.length;i++){
            cells[i].innerText = "";
        }
    }

    const updateHTMLUI = (row,col, symbol)=>{
        document.querySelector(`div[data-row="${row}"][data-col="${col}"]`).innerText = symbol;
    }

    const updatePlayerTurnText = (symbol) =>{
        playerTurnText.innerText = `Player ${symbol} Turn`
    }

    const logInvalidMove = () => {
        logText.innerText = "Not a valid move. Try again!"
    }

    const handleEndGame = (status, symbol) =>{
        let text = status == "WIN" ? `Player ${symbol} is the winner!!`:"DRAW!";

        modal.showModal();
        endText.innerText = text;
    }

    restartGame.addEventListener("click", ()=>{
        game.restartGame();
        modal.close();
    })


    return { start, updateHTMLUI, updatePlayerTurnText, logInvalidMove, handleEndGame, clearBoard};
}


DisplayController().start();

