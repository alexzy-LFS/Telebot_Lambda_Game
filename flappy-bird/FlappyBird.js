window.onload = document.getElementById("r").innerHTML = localStorage.getItem("record");
var cvs = document.getElementById("canvas");
var ctx = cvs.getContext("2d");
var bird = new Image();
var bg = new Image();
var fg = new Image();
var pipeUp = new Image();
var pipeBottom = new Image();

bird.src = "bird.png";
bg.src = "bg.png";
fg.src = "fg.png";
pipeUp.src = "pU.png";
pipeBottom.src = "pB.png";
const TELE_TOKEN = "5306420982:AAEAfX7VuQh55xMb3JHz2JBP4wnS8SEaUqU"
const _URL = `https://api.telegram.org/bot${TELE_TOKEN}/`
var speed = 1;
var score = 0;
var gap = 110;
var xPos = 10;
var yPos = 150;
var grav = 1.7;
var num = 33;
function clg(content) {
	console.log(content);
	let parent = document.getElementById("m");
	let node = document.createTextNode(content);

	parent.appendChild(document.createElement("br"));
	parent.appendChild(document.createElement("br"));
	parent.appendChild(document.createTextNode(new Date().toLocaleString()));
	parent.appendChild(document.createElement("br"));
	parent.appendChild(node);
}
document.addEventListener("keydown", moveUp);
function moveUp() {
	grav--;
	yPos -= num;
	grav++;
}

var pipe = [];
pipe[0] = {
	x: cvs.width,
	y: 0
}
function draw() {
	ctx.drawImage(bg, 0, 0);
	for (var i = 0; i < pipe.length; i++) {
		ctx.drawImage(pipeUp, pipe[i].x, pipe[i].y);
		ctx.drawImage(pipeBottom, pipe[i].x, pipe[i].y + pipeUp.height + gap);
		pipe[i].x -= speed;

		if (pipe[i].x == 60) {
			pipe.push({
				x: cvs.width,
				y: Math.floor(Math.random() * pipeUp.height) - pipeUp.height
			});
		}

		if (xPos + bird.width >= pipe[i].x && xPos <= pipe[i].x + pipeUp.width && (yPos <= pipe[i].y + pipeUp.height || yPos + bird.height >= pipe[i].y + pipeUp.height + gap) || yPos + bird.height >= cvs.height - fg.height) {
			grav = 0;
			speed--;
			num = 0;
			let parent = document.getElementById("m");
			let restartBtn = document.getElementById("restart-btn");
			if (restartBtn.style != "visibility: visible;") { //first time 
				restartBtn.style = "visibility: visible;"
				restartBtn.onclick = function () { location.reload(); }
				let shareBtn = document.getElementById("share-btn");
				shareBtn.style = "visibility: visible;"
				shareBtn.style = "background-color: green;"
				shareBtn.onclick = function () {
					clg(score);
					TelegramGameProxy.shareScore(score);
					// TelegramGameProxy.postEvent('share_score', function (error) {
					// 	clg(error);
					// 	if (error) {
					// 		var shareScoreUrl = initParams.tgShareScoreUrl;
					// 		clg(shareScoreUrl);
					// 		if (shareScoreUrl) {
					// 			openProtoUrl(shareScoreUrl);
					// 		}
					// 	}
					// }, score); 5435186786
					let userid = 5435186786
					let chatid = 5435186786
					let msgId = 339
					let url = `${_URL}setGameScore?user_id=${userid}?score=${score}&chat_id=${chatid}&message_id=${msgId}&force=true`
					// axios.get(url).then(response => {
					// 	// const users = response.data;
					// 	clg(`response`, JSON.stringify(response));
					// }).catch(error => clg(JSON.stringify(error)));
					clg(url);
					fetch(url)
						.then(function (response) {
							// The API call was successful!
							return response.json();
						}).then(function (data) {
							// This is the JSON from our response
							clg(JSON.stringify(data))
						}).catch(function (err) {
							// There was an error
							clg("Something went wrong"+err)
							// console.warn('Something went wrong.', err);
						});
				}


			}
			// if (!parent.hasChildNodes()){}
			// var br = document.createElement("br");
			// parent.appendChild(br);
			// parent.appendChild(br);
			// parent.appendChild(br);
			// let btn1 = document.createElement("button");
			// btn1.innerHTML = "New Game";
			// btn1.onclick = function () {
			// 	location.reload();
			// };
			// parent.appendChild(btn1);
			// parent.appendChild(br);
			// parent.appendChild(br);
			// parent.appendChild(br);
			// let btn2 = document.createElement("button");
			// btn2.className = "share";
			// btn1.innerHTML = "Share Score";
			// btn2.onclick = function () {
			// 	TelegramGameProxy.shareScore();
			// };
			// parent.appendChild(btn2);

			if (Number(localStorage.getItem("record")) < score) {
				localStorage.setItem("record", String(score));
				document.getElementById("r").innerHTML = localStorage.getItem("record");
			}
		}
		if (pipe[i].x == 5) {
			score++;
		}
	}

	ctx.drawImage(fg, 0, cvs.height - fg.height);
	ctx.drawImage(bird, xPos, yPos);

	yPos += grav;

	ctx.fillStyle = "#000";
	ctx.font = "24px Verdana";
	ctx.fillText("Score: " + score, 10, cvs.height - 20);

	requestAnimationFrame(draw);
}

pipeBottom.onload = function () {
	clg(`start logging....${window.location.href}`)
	clg(`${window.location.hash}`)
	clg(`${window.location.search}`)
	clg(JSON.stringify(window.TelegramGameProxy.initParams))
	draw()
};