var board;
const computer='X';
const human='O';
var ishard=-1;
const winning_combination=[
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [6,4,2]
]
const cells=document.querySelectorAll('.cell');
startGame();
//Reseting the Board
function startGame() {
    document.querySelector(".endgame").style.display = "none";
    board = Array.from(Array(9).keys());
    ishard=-1;
    document.querySelector(".easy").innerHTML="Make Hard";
    document.querySelector(".easy").style.backgroundColor="rgb(81 157 187)";
    for (var i = 0; i < cells.length; i++) {
        cells[i].innerText = '';
        cells[i].style.removeProperty('background-color');
        cells[i].addEventListener('click', turnClick, false);
    }
}

function changeDifficulty(){
    if(ishard==-1) ishard=1;
    document.querySelector(".easy").innerHTML="Make Easy";
    document.querySelector(".easy").style.backgroundColor="red";
}

// Starts Turns Based on Human Click
function turnClick(square) {
    if (typeof board[square.target.id] == 'number') {
        var ch=turn(square.target.id,human)
        if (!checkTie() && ch==0) {
			setTimeout(function() {
			  	turn(bestSpot(), computer);
			},100);
        }
    }
}
// Executes Turn
function turn(squareId, player) {
    board[squareId] = player;
    document.getElementById(squareId).innerText = player;
    let win = checkWinner(board, player);
    if (win) {
        gameOver(win);
        return 1;
    }
    return 0;
}

// Checks for a Winner
function checkWinner(mimic_board, player) {
    let winner = null;
    let plays = [];
    for (let i = 0; i < mimic_board.length; i++) {
        if (mimic_board[i] === player) {
            plays.push(i);
        }
    }
    for (let i = 0; i < winning_combination.length; i++) {
        if (plays.includes(winning_combination[i][0]) && plays.includes(winning_combination[i][1]) &&
            plays.includes(winning_combination[i][2])) {
            winner = { i, player };
            break;
        }
    }
    return winner;
}

// Stops the game and outputs result
function gameOver(winner) {
    for (let i of winning_combination[winner.i]) {
        document.getElementById(i).style.backgroundColor
         = winner.player == human ? "blue" : "red";
    }
    for (var i = 0; i < cells.length; i++) {
        cells[i].removeEventListener('click', turnClick, false);
    }
    declareWinner(winner.player == human ? "You Win!" : "You Lose :(");
}

// Outputs Result
function declareWinner(who) {
	document.querySelector(".endgame").style.display = "block";
    document.querySelector(".endgame").style.opacity = "0.4";
	document.querySelector(".endgame .text").innerText = who;
}

// Computer uses minimax algorithm to find the best spot
function bestSpot() {
   if(ishard==1)	return minimax(board, computer).index;
   return minimax2(board,computer);
}

// Checking for any tie
function checkTie() {
    var ct=0;
    for(var i=0;i<9;i++){
        if(typeof board[i] =='number') ct++;
    }
    var ch=checkWinner(board,human);
	if (ct==0 && ch==null) {
		for (var i = 0; i < cells.length; i++) {
			cells[i].style.backgroundColor = "green";
			cells[i].removeEventListener('click', turnClick, false);
		}
		declareWinner("Tie Game!")
		return true;
	}
	return false;
}

//It will give the return the other player
function otherplayer(player){
    return ('O'+'X').replace(player,"");
}

// Minimax Algorithm
function minimax(mimic_board, player) {
    var ct=0;
    for(var i=0;i<9;i++){
        if(typeof mimic_board[i] =='number') ct++;
    }
	if (checkWinner(mimic_board, human)) {
		return {score: -10};
	} else if (checkWinner(mimic_board,computer)) {
		return {score: 10};
	} else if (ct==0) {
		return {score: 0};
	}
	let best_move =-1;
    let best_score=Infinity;
    if(player==computer) best_score=-Infinity;
	for (let i = 0; i <9; i++) {
        if(typeof mimic_board[i]!='number') continue;
		let move=mimic_board[i];
		mimic_board[i] = player;
        let temp= minimax(mimic_board,otherplayer(player));
        if(temp.score>best_score && player==computer){
              best_score=temp.score;
              best_move=move;
        }
        if(temp.score<best_score && player==human){
            best_score=temp.score;
            best_move=move;
        }
		mimic_board[i] = move;
	}
	return {index:best_move,score:best_score};
}

function emptySquares() {
	return board.filter(s => typeof s == 'number');
}

function minimax2(mimic_board, player) {
   let openspot=emptySquares();
   let len=openspot.length;
   Math.floor(Math.random()*len);
   return openspot[Math.floor(Math.random()*len)];
}
