let currScor = document.querySelector("#score");
let border = document.querySelector("#border");
let next = document.querySelector("#nextTetro");
let	pause = document.querySelector("#pause");
let	play = document.querySelector("#play");
let	resume = document.querySelector("#resume");
let contain = document.querySelector("#contain");
let bestscoreid = document.querySelector("#bestscore");
let gameoverid = document.querySelector("#gameover");
let audioid = document.querySelector("#audioid");
let audiogameover = document.querySelector("#audiogameover");

let board = [];
let row = 20;
let col = 10;
const squareColor = "white";
let timeset;
let nextTetro;
let nextCol;
let bestScore = 0;
let yourscore = 0;

function createBoard() {
	for(let r = 0; r < row; r++) {
		board[r] = [];
		for(let c = 0; c < col; c++) {
			board[r][c] = squareColor;
		}
	}
}
function drawBoard() {
	for(let r = 0; r < row; r++) {
		for(let c = 0; c < col; c++) {
			drawSquare(c,r,board[r][c]);
		}
	}
}
function drawSquare(x,y,color) {
	let cur  = document.getElementById(`${y}-${x}`);
	if(cur) {
		cur.remove();
	}
	const el = 25;
	let square = document.createElement("div");
	border.appendChild(square);
	square.setAttribute("id",`${y}-${x}`);
	square.style.width = `${el}px`;
	square.style.height = `${el}px`;
	square.style.marginLeft = `${x*el}px`;
	square.style.marginTop = `${y*el}px`;
	square.style.background = color;
	square.style.position = "absolute";
	square.style.border = ".1px dotted ";
	square.style.borderColor = "grey";
}
createBoard();
drawBoard();

const Z = [[1,1,0],
		   [0,1,1],
		   [0,0,0]];

const S = [[0,1,1],
		   [1,1,0],
		   [0,0,0]];

const J = [[0,1,0],
		   [0,1,0],
		   [1,1,0]];

const T = [[1,1,1],
		   [0,1,0],
		   [0,0,0]];

const L = [[0,1,0],
		   [0,1,0],
		   [0,1,1]];

const I = [[0,0,1,0],
		   [0,0,1,0],
		   [0,0,1,0],
		   [0,0,1,0]];

const O = [[1,1],
		   [1,1]];

const Tetros = [Z,S,J,T,L,I,O];
const colors = ["blue","black","green","purple","orange","brown","red"];

let color;
let currentTetro;
let currState ;
let score = 0;
let x = 3;
let y = -2;
let probel = false;
audioid.muted = true;
audiogameover.muted = true;

function randomColor() {
	
	return colors[Math.floor(Math.random()*colors.length)];
}
function randomTetro() { 

	return Tetros[Math.floor(Math.random()*Tetros.length)]; 
}
function draw(piece) {
	let tetromino = piece;
	for(let r = 0; r < tetromino.length; r++) {
		for(let c = 0; c < tetromino[r].length; c++) {
			if( tetromino[r][c] ) {
				drawSquare(x+c,y+r,color);
			}
		}
	}
	currScor.innerText = `Score: ${score}`; 
}
function rotateLeft(piece) {
	let arr = JSON.parse(JSON.stringify( piece ));
		
	for(let i = 0; i < arr.length; i++) {
		for(let j = 0; j < arr[i].length/2; j++ ) {
			[ arr[i][j] , arr[i][arr.length-1-j] ] = [ arr[i][arr.length-1-j] , arr[i][j]];
		}
	}
	for(let i = 0; i < arr.length; i++) {
		for(let j = i; j < arr[i].length; j++ ) {
			[ arr[i][j] , arr[j][i] ] = [ arr[j][i] , arr[i][j] ];
		}
	}
	let kick = 0;

	if(collision(0,0,arr)) {
		if(x > col/2) {
			kick = -1;
		}
		else {
			x===-2 ? kick=2 : kick=1;
		}
	}
	if(!collision(kick,0,arr)) {
		undraw(piece);
		x += kick;
		currState = arr;
		draw(currState);
	}
}
function rotateRight(piece) {
	let arr = JSON.parse(JSON.stringify( piece ));
	arr.reverse();
	for(let i = 0; i < arr.length; i++) {
		for(let j = i; j < arr[i].length; j++ ) {
			[ arr[i][j] , arr[j][i] ] = [ arr[j][i] , arr[i][j] ];
		}
	}
	let kick = 0;
	
	if(collision(0,0,arr)) {
		if(x > col/2) {
			kick = -1;
		}
		else {
			x===-2 ? kick=2 : kick=1;	
		}
	}
	if(!collision(kick,0,arr)) {
		undraw(piece);
		x += kick;
		currState = arr;
		draw(currState);
	}
}
function undraw(piece) {
	let tetromino = piece;
	for(let r = 0; r < tetromino.length; r++) {
		for(let c = 0; c < tetromino[r].length; c++) {
			if( tetromino[r][c] ) {
				drawSquare(x + c, y + r, squareColor);
			}
		}
	}
}
function moveLeft(piece) {
	if(!collision(-1,0,currState)) {
		undraw(piece);
		x--;
		draw(piece);
	}
}
function moveRight(piece) {
	if(!collision(1,0,currState)) {
		undraw(piece);
		x++;
		draw(piece);
	}	
}
function moveDown(piece) {
	if(!collision(0,1,currState)) {
		undraw(piece);
		y++;
		draw(piece);
	}
	else {

		if(lock() === "END") {
			return;
		}
		probel = false;
		newGame();
	}
}
function newGame() {
	document.addEventListener("keydown",CONTROL);
	if(!currentTetro && !color) {
		currentTetro = randomTetro();
		currState = currentTetro;
		color = randomColor();
	}
	clearInterval(timeset);
	x=3,y=0;
	let arx = nextTetromino();
	if(nextTetro && nextCol) {
		currState = nextTetro;
		color = nextCol;
	}
	nextTetro = arx[0];
	nextCol = arx[1];

	if (next.hasChildNodes()) {//clear tetro to show next tetro in mini map 
  		next.removeChild(next.childNodes[0]);
	}

	drawNextTetro();//draw next tetro 

	let timeinterval = 500-score/3;//more score faster game 
	if(timeinterval <= 100) { timeinterval = 100; }
	draw(currState);
	timeset = setInterval(function(){
		moveDown(currState);
	},timeinterval);
}
function collision(x1,y1,cur) {
	for(let r = 0; r < cur.length; r++) {
		for(let c = 0; c < cur[r].length; c++) {
			if( !cur[r][c] ) {
				continue;
			}
			if(y + r === row-1) {
				return true;
			}
			let newX = x + c + x1;
			let newY = y + r + y1;

			if(newX < 0 || newX >= col || newY >= row) {
				return true;
			}
			if(newY < 0) {
				continue;
			}
			
			if(board[newY][newX] != squareColor) {
				return true;
			}
 		}
	}
	return false;
}
function lock() {
	for(let r = 0; r < currState.length; r++) {
		for(let c = 0; c < currState[r].length; c++) {
			if(!currState[r][c]) { 
				continue;
			}
			if(y <= 0 && collision(0,1,currState)) {
				clearInterval(timeset);
				return gameOver();
			}
			board[y+r][x+c] = color;
		}
	}
	for(let r = 0; r < row; r++) {
		let isRowFull = true;
		for(let c = 0; c < col; c++) { 
			isRowFull = (board[r][c] != squareColor) && isRowFull;			
		}
		if(isRowFull) {
			for(let y = r; y > 1; y--) { 
				for(let c = 0; c < col; c++) { 
					board[y][c] = board[y-1][c];
				}
			}
			for(let c = 0; c < col; c++) { 
				board[0][c] = squareColor;
			}
			score += 10;
			if(score > bestScore) {
				bestScore = score;
			}
		}
	}
	drawBoard();
}



function CONTROL(event) {
	if(event.keyCode === 37) {
		border.focus();
		moveLeft(currState);
	}else if(event.keyCode === 38) {
		border.focus();
		rotateLeft(currState);
	}else if(event.keyCode === 39) {
		border.focus();
		moveRight(currState);
	}else if(event.keyCode === 40) {
		border.focus();
		rotateRight(currState);
	}else if(event.keyCode === 32) {//probel
		pause.blur(); 
		border.focus();
		if(!probel) {//control probel 
			probel = true;
			clearInterval(timeset);
			timeset = setInterval(function(){
				moveDown(currState);
			},50);
		}
	}
	else if(event.keyCode === 13) {//enter , new game 
		pause.blur(); 
		border.focus();
		newGameCreate();		
	}
}
function nextTetromino() {

	let nextTetro = randomTetro();
	let nextColor = randomColor();
	return [nextTetro,nextColor];
}
function drawNextTetro() {
	let table = document.createElement("TABLE");
	next.appendChild(table);	

	for(let i = 0; i < nextTetro.length; i++) {
		let tr = document.createElement("TR");
		table.appendChild(tr);
		for(let j = 0; j < nextTetro[i].length; j++) {
			let td =  document.createElement("TD");
			tr.appendChild(td);
			if(nextTetro[i][j]) {
				td.style.background = nextCol;
			}
		}
	}	
}
function gameOver() {
	audioid.pause();
	audioid.currentTime = 0;
	audiogameover.play();
	audiogameover.currentTime = 0;
	document.removeEventListener("keydown",CONTROL);
	resume.style.display = "none";
	gameoverid.style.display = "block";
	pause.style.display = "none";
	contain.style.display = "flex";
	bestscoreid.innerText = `Best Score \n ${bestScore}`;
	return "END";
}

pause.addEventListener("click",pauseGame);
resume.addEventListener("click",resumeGame);
play.addEventListener("click",newGameCreate);

function newGameCreate() {//when click enter or	pause button
	
	audiogameover.pause();
	audiogameover.currentTime = 0;
	audioid.play();
	audioid.currentTime = 0;

	resume.style.display = "block";
	gameoverid.style.display = "none";
	pause.style.display = "block";
	contain.style.display = "none";
	probel = false;
	currentTetro = 0;
	color = 0;
	nextTetro = 0;
	nextCol = 0;
	score = 0;
	newGame();
	createBoard();
	drawBoard();
}
function pauseGame() {
	audioid.pause();
	bestscoreid.innerText = `Best Score \n ${bestScore}`;
	gameoverid.style.display = "none";
	pause.style.display = "none";
	contain.style.display = "flex";
	clearInterval(timeset);
}
function resumeGame() {
	audioid.play();
	pause.style.display = "inline-block";
	contain.style.display = "none";
	let timeinterval = 500-score/3;//more score faster game 
	if(timeinterval <= 100 ) { timeinterval = 100; }
	timeset = setInterval(function(){
		moveDown(currState);
	},timeinterval);
}

newGame();

document.getElementById('togglebgm').addEventListener('click', function (e)
{
	e = e || window.event;
	if(audioid.currentTime!=0) {
		audioid.currentTime=0;
	}
	if(audiogameover.currentTime!=0) {
		audioid.currentTime=0;
	}
	audioid.muted = !audioid.muted;
	audiogameover.muted = !audiogameover.muted;
	if(audioid.muted || audiogameover.muted) {
		document.getElementById("muteidimg").style.display = "block";
		document.getElementById("unmuteidimg").style.display = "none";
	}
	else{
		document.getElementById("muteidimg").style.display = "none";
		document.getElementById("unmuteidimg").style.display = "block";
	}
	e.preventDefault();
});


let defboard = document.getElementById("defaultboard");
let bigboard = document.getElementById("bigboard");

bigboard.addEventListener("change",selectboard);
defboard.addEventListener("change",selectboard);
function selectboard() {
	if(bigboard.checked) {
		row = 25;
		col = 15;
		border.style.width = "375px";
		border.style.height = "625px";
		clearBorder();
		createBoard();
		drawBoard();
		newGameCreate();
	}
	else if(defboard.checked){
		row = 20;
		col = 10;
		border.style.width = "250px";
		border.style.height = "500px";
		clearBorder();
		createBoard();
		drawBoard();
		newGameCreate();
	}
}

function clearBorder() {
	for(let i=border.childNodes.length-1;i>=0;i--) {
  		border.removeChild(border.childNodes[i]); 
	}
}