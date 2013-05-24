var canvas, ctx, w, h;
var game = true;
var ball, platforma, blocks;
var bg = new Image();
var rowHeight, row, col;
var toLeft = true, toRight = true;
var score = 0;
var colors;
var color =["orange","orange","orange","lightblue","violet","red"];
var row_len = 6;
var col_len = 20;
var start = new Audio("Music/start.wav");
var end  = new Audio("Music/end.wav");
var block_sound = new Audio("Music/block.wav");
var platforma_sound = new Audio("Music/platforma.wav");
var bounes;
var bounceChangeWidthPlatforma = 1;
var win = false;
var win_sound  = new Audio("Music/win.wav");
var soundDetector = true;
var gamePause = false;
var ballImg = new Image();

var BALL = function(x,y,img){
	this.x = x;
	this.y = y;
	this.img = img;
	
	this.color = "red";
	this.radius = 5;
	//this.saveRadius = 5;
	this.vx = 3;
	this.vy = -4;
	
	this.ay = 0;
}
var PLATFORMA = function(x,y){
	this.x = x;
	this.y = y;
	
	this.color = "white";
	this.width = 140;
	this.saveWidth = 140; // збереження оригінального розміру
	this.height = 10;
	this.vx = 10;
}

var BLOCKS = function(width, height, rows, cols){
	this.rows = rows;
	this.cols = cols;
	this.width = width;
	this.padding = 2;
	this.height = height;
	
	this.obj;
	this.lifes = [];
}

window.onload = opacityButton;

function opacityButton(){
	background();
	document.getElementById("btn3").style.display = "none";
	document.getElementById("btn5").style.display = "none";
	document.getElementById("btn6").style.display = "none";
}

document.addEventListener('mousemove', function(event){
	var x = event.offsetX;
	platforma.x = x-platforma.width/2; 
});


function init(){
	gamePause = false;
	score = 0;
	game = true;
	document.getElementById("btn1").style.display = "none";
	document.getElementById("btn2").style.display = "none";
	document.getElementById("btn3").style.display = "none";
	document.getElementById("btn4").style.display = "none";
	document.getElementById("btn5").style.display = "none";
	document.getElementById("btn6").style.display = "none";
	
	start.volume = 0.7;
	start.play();
	canvas = document.getElementById("canvas");
	w = canvas.width;
	h = canvas.height;
	ctx = canvas.getContext('2d');
	ctx.font = "30px Arial";
	Images();
	ball = new BALL(w/2,h/2+50,ballImg);
	platforma = new PLATFORMA(w/2,h-20);
	platforma.x -= platforma.width/2;
	
	blocks = new BLOCKS((w/20)-2,20,row_len,col_len);
	
	//ctx.drawImage(ball.img, ball.x, ball.y);
	
//	fewBalls = [];
	blocks.obj = [];
	colors = [];
	bounes = []
	for (var i = 0; i<blocks.rows; ++i){
		blocks.obj[i] = [];
		colors[i] = [];
		bounes[i] = [];
		blocks.lifes[i] = [];
		for (var j = 0;j<blocks.cols; ++j){
			blocks.obj[i][j] = 1;
			var r = parseInt(Math.random()*255);
			var g = parseInt(Math.random()*255);
			var b = parseInt(Math.random()*255);
			colors[i][j] = color[i];//"rgb("+r+","+g+","+b+")";
			bounes[i][j] = parseInt(Math.random()*5); // 0 or 1
		}
	}
	
	for(var j = 0;j<blocks.cols;++j){
		blocks.lifes[blocks.rows-1][j] = 2;
	}
	
	//document.addEventListener("keypress", function(event){

//}, false);
	$(window).keydown(function(event){
	if(event.keyCode == 37){
		toLeft = true;
		toRight = false;
	} 
	else if (event.keyCode == 39){
		toLeft = false;
		toRight = true;
	}
	else if (event.keyCode == 40){
		toLeft = false;
		toRight = false;
	}
	else if (event.keyCode == 27){
		pause();
	}
});

	$(window).keyup(function(event){
	if(event.keyCode == 37){
		toLeft = false;
		toRight = false;
	} 
	else if (event.keyCode == 39){
		toLeft = false;
		toRight = false;
	}
	else if (event.keyCode == 40){
		toLeft = false;
		toRight = false;
	}
	else if (event.keyCode == 27){
		pause();
	}
});
	
	beginGame();
	
}

function beginGame(){
	if(game){
		if (!gamePause){
			ctx.clearRect(0,0,w,h);
			background();
			ctx.drawImage(ball.img, ball.x, ball.y);
			if (ball.ay == 0){
			ball.x += ball.vx;
			ball.y += ball.vy;
			}
			else if (ball.ay == 1){
			ball.x += ball.vx;
			ball.y += ball.vy * 2.5;
			}
			
			var tmpScore = "Score: " +score;
			ctx.strokeStyle = "red";
			ctx.strokeText(tmpScore,20,h/2);

			
			if ((ball.x+ball.radius)+ball.vx>w || (ball.x-ball.radius)+ball.vx<0){
				ball.vx = -ball.vx;
			}
			if ((ball.y-ball.radius)+ball.vy<0){
				ball.vy = -ball.vy
			} else if ((ball.y+ball.radius+ball.vy)>=(h-platforma.height-10) && (ball.y+ball.radius)+ball.vy<h){
				if(ball.x+ball.radius>=platforma.x && ball.x+ball.radius<=(platforma.x+platforma.width)){
	//				platforma_sound.volume = 0.3;
					platforma_sound.play();
					ball.vy = -ball.vy;
					ball.vx = 10*((ball.x-(platforma.x+platforma.width/2)))/platforma.width; // фізика при відбитті під крутим кутом
				}
				else
				{
					game = false;
				}
			}
			
			if (toRight && platforma.x + platforma.width<w){
				platforma.x += platforma.vx;
			}
			if (toLeft && platforma.x>0){
				platforma.x -= platforma.vx;
			}
			
			rowHeight = blocks.height+blocks.padding;
			row = Math.floor(ball.y/(rowHeight));
			col = Math.floor(ball.x/(blocks.width+blocks.padding));
			
			var example = ball.y - ball.radius;
			
			if (ball.y < blocks.rows*rowHeight && row>=0 && col>=0 && blocks.obj[row][col] == 1){
				if (blocks.lifes[row][col]>1){
					blocks.lifes[row][col] -=1;
					colors[row][col] = "darkred";
				}
				else
				{
					blocks.obj[row][col] = 0;
					score++;

				if (bounes[row][col] == 4 && bounceChangeWidthPlatforma>0){
					bounes[row][col] = 0;
					platforma.width = platforma.width/2;
					bounceChangeWidthPlatforma--;
					setTimeout(function(){
						platforma.width = platforma.saveWidth;
						bounceChangeWidthPlatforma = 1;
					}, 5000);////////////////////////////////////////////////////////
				}
				if (bounes[row][col] == 2){
					ball.ay = 1;
					bounes[row][col] = 0;
					setTimeout(function(){
						ball.ay = 0;
					}, 10000);
					}
				}
				//blocks.obj[row][col] = 0;
				ball.vy = -ball.vy;
				//score++;
		//		block_sound.volume = 0.3;
				block_sound.play();
				
				if (score == row_len*col_len){
					game = false;
					win = true;
				} 
				else
				{
						win = false;
				}
			}
				
		/*	ctx.fillStyle = ball.color;
			ctx.beginPath();
			ctx.arc(ball.x,ball.y,ball.radius,0,2*Math.PI,true);
			ctx.closePath();
			ctx.fill();*/

			ctx.fillStyle = platforma.color;
			ctx.beginPath();
			ctx.fillRect(platforma.x,platforma.y,platforma.width,platforma.height);
			ctx.closePath();
			
			//ctx.fillStyle = "orange";
			ctx.strokeStyle = "red";
			
			for (var i = 0; i<blocks.rows; ++i){	
			//	ctx.fillStyle = color[i];
			//	ctx.fillStyle = colors[i][i];
				for (var j = 0;j<blocks.cols; ++j){	
					ctx.fillStyle = colors[i][j];
					blocks.obj[1][1] = 0;
					if (blocks.obj[i][j] == 1){
		//				ctx.fillStyle = colors[i][j];
						ctx.beginPath();
						ctx.rect(j*(blocks.width+blocks.padding),i*(blocks.height+blocks.padding), blocks.width, blocks.height);
	//					ctx.strokeRect(j*(blocks.width+blocks.padding),i*(blocks.height+blocks.padding), blocks.width, blocks.height);
						ctx.closePath();
						ctx.fill();
						ctx.stroke();
					}
				}
			}
			
			//window.webkitRequestAnimationFrame(beginGame);
			//if (!gamePause){
				requestAnimationFrame(beginGame);
		//	}
		}
		//window.oRequestAnimationFrame(beginGame);
	}
	else if (!win)	
	{
		gameover();
	}
	else if (win) {
		gamewin();
	}
}

function gamewin(){
	win_sound.volume = 0.7;
	win_sound.play();
	var text = "Game Win!";
	var text2 = "Score: "+score;
	ctx.clearRect(0,0,w,h);
	background();
	ctx.fillStyle = "white";
	var text_length = ctx.measureText(text).width;
	var text2_length = ctx.measureText(text2).width;
	ctx.fillText(text,w/2-text_length/2,h/2-50);
	ctx.fillText(text2,w/2-text2_length/2,h/2-10);
	
	document.getElementById("btn4").style.display = "block";
	document.getElementById("btn1").style.display = "block";
}

function gameover(){
//	end.volume = 0.7;
	end.play();
	var text = "Game Over";
	var text2 = "Score: "+score;
	ctx.clearRect(0,0,w,h);
	background();
	ctx.fillStyle = "white";
	var text_length = ctx.measureText(text).width;
	var text2_length = ctx.measureText(text2).width;
	ctx.fillText(text,w/2-text_length/2,h/2-50);
	ctx.fillText(text2,w/2-text2_length/2,h/2-10);
	document.getElementById("btn6").style.display = "block"; 
}
function Images(){
    ballImg.src = 'Pictures/ball.png';
	
}
function background(value){
	canvas = document.getElementById("canvas");
	w = canvas.width;
	h = canvas.height;
	ctx = canvas.getContext('2d');
	switch (value){
		case 1:
		bg.src = "bg3.jpg";
		ctx.drawImage(bg,0,0,w,h);
		break;
		case 2:
		bg.src = "bg4.jpg";
		ctx.drawImage(bg,0,0,w,h);
		default:
		break;
	}
	bg.src = "Pictures/bg.jpg";
	ctx.drawImage(bg,0,0,w,h);
}

window.requestAnimationFrame = (function() {
    return window.requestAnimationFrame ||  
    window.webkitRequestAnimationFrame || 
    window.mozRequestAnimationFrame || 
    window.oRequestAnimationFrame || 
    window.msRequestAnimationFrame || 


    function(callback, element) { 
        window.setTimeout(callback, 1);
    }

})();

function VolumeGame(){
	if (soundDetector){
		start.volume = 0;
		end.volume = 0;
		block_sound.volume = 0;
		platforma_sound.volume = 0;
		win_sound.volume = 0;
		soundDetector = false;
	} 
	else
	{
		start.volume = 0.3;
		end.volume = 0.3;
		block_sound.volume = 0.3;
		platforma_sound.volume = 0.3;
		win_sound.volume = 0.3;
		soundDetector = true;
	}
}

function pause(){
	if (!gamePause){
		gamePause = true;
		ctx.clearRect(0,0,w,h);
		background();
		document.getElementById("btn1").style.display = "block";
		document.getElementById("btn2").style.display = "block";
		document.getElementById("btn3").style.display = "none";
		document.getElementById("btn4").style.display = "block";
		document.getElementById("btn5").style.display = "block";
		document.getElementById("btn6").style.display = "none";
		
	}
} 
function gameContinue()
{
		gamePause = false;
		requestAnimationFrame(beginGame);
		document.getElementById("btn1").style.display = "none";
		document.getElementById("btn2").style.display = "none";
		document.getElementById("btn4").style.display = "none";
		document.getElementById("btn5").style.display = "none";
	
	
}
