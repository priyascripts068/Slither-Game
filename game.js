let inputdir={x:0 , y:0};
let eatsound=new Audio("eat.wav");
let gameoversound=new Audio("gameover.mp3");
let speed=7;
let lastpainttime=0;
let snakearr= [{x:13 , y:15}]; //array of snake
let playarea=document.querySelector(".playarea");
let food={x: 6, y:9};
let score=0;
let isGameRunning = false;
let gamePaused = false;
let currentPlayer = "";
let nameError=document.getElementById("nameError");

function getLeaderboard() {
      const data = localStorage.getItem("leaderboard");
      return data ? JSON.parse(data) : [];
}

function getPlayerHighScore(playerName) {
    const leaderboard = getLeaderboard();
    const player = leaderboard.find(entry => entry.name === playerName);
    return player ? player.score : 0;
}

function displayLeaderboard() {
    const leaderboard = getLeaderboard();
    const leaderboardList = document.getElementById("leaderboardList");
    leaderboardList.innerHTML = "";
    leaderboard.forEach((entry, i) => {
      const li = document.createElement("li");
      li.textContent = `${i + 1}. ${entry.name} - ${entry.score}`;
      leaderboardList.appendChild(li);
    });
}

function saveToLeaderboard(name, score) {
    let leaderboard = getLeaderboard();
    leaderboard = leaderboard.filter(entry => entry.name !== name);
    leaderboard.push({ name, score });
    leaderboard.sort((a, b) => b.score - a.score);
    leaderboard = leaderboard.slice(0, 3);
    localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
    displayLeaderboard();
}

document.getElementById("startGameBtn").addEventListener("click", () => {
    const name = document.getElementById("playerInput").value.trim();
    const difficulty = document.querySelector('input[name="difficulty"]:checked').value;

    if (!name) {
        nameError.textContent = "⚠️ Please enter your name!";
        nameError.style.display="block";
        return;
    }
    currentPlayer = name;
    nameError.style.display="none";
    
    switch (difficulty) {
        case "easy":
            speed = 4;
            break;
        case "medium":
            speed = 7;
            break;
        case "hard":
            speed = 10;
            break;
    }
    highscoreval = getPlayerHighScore(currentPlayer);
    document.getElementById("startScreen").style.display = "none";
    document.getElementById("container").style.display = "block";
    window.requestAnimationFrame(main);
});

 displayLeaderboard();

function main(currtime){
    if (!isGameRunning || gamePaused) return;
    window.requestAnimationFrame(main);
    if((currtime-lastpainttime)/1000< 1/speed){
        return;
    }
        lastpainttime=currtime;
        gameEngine();
}

function collide(snake){
    for(let i=1;i<snakearr.length;i++){
       if(snake[i].x===snake[0].x && snake[i].y===snake[0].y){ //snake body and head collides
         return true;
       }
    }
    if(snake[0].x>=18 || snake[0].x<=0 || snake[0].y>=18 || snake[0].y<=0){
        return true;
    }
    return false;
}

function gameEngine(){
    if(collide(snakearr)){
        gameoversound.play();
        inputdir={x:0 , y:0};
        saveToLeaderboard(currentPlayer, score);
        document.getElementById("finalScoreText").textContent = `Score: ${score}`;
        document.getElementById("gameOverScreen").style.display = "block";  // ⬅️ Show Game Over screen
        document.getElementById("container").style.display = "none";   
        snakearr= [{x:13 , y:15}];
        score=0;
        scorebox.innerHTML = "Score : 0";
        isGameRunning = false;
        gamePaused = false;
    }
    if(snakearr[0].x===food.x && snakearr[0].y===food.y){
        eatsound.play();
        score++;
        if(score>highscoreval){
            highscoreval=score;
            localStorage.setItem("highscore",JSON.stringify(highscoreval));
            highscorebox.innerHTML= "Highscore : "+ highscoreval;
        }
        scorebox.innerHTML="Score : "+score;
        snakearr.unshift({ x : inputdir.x + snakearr[0].x ,y : inputdir.y + snakearr[0].y}); 
        let a=2;
        let b=16;
        food= { x: Math.round(a+ (b-a)*Math.random()) , y: Math.round(a+ (b-a)*Math.random())};
    }

    for( let i=snakearr.length-2 ; i>=0 ; i--){ 
        snakearr[i+1]={...snakearr[i]};
    }
       snakearr[0].x += inputdir.x;
       snakearr[0].y += inputdir.y;
 
    playarea.innerHTML="";
    snakearr.forEach((e,index)=>{
    snakeElement=document.createElement("div");
    snakeElement.style.gridRowStart=e.y;
    snakeElement.style.gridColumnStart=e.x;
    if(index===0){
         snakeElement.classList.add("head");
        }
     else{
        snakeElement.classList.add("snake");
     }   
    playarea.appendChild(snakeElement);

   })
   foodElement=document.createElement("div");
   foodElement.style.gridRowStart=food.y;
   foodElement.style.gridColumnStart=food.x;
   foodElement.classList.add("food");
   foodElement.textContent="🍎";
   playarea.appendChild(foodElement); 
}

let highscoreval = 0;
let highscore = localStorage.getItem("highscore");

if (highscore === null) {
    highscoreval = 0;
    localStorage.setItem("highscore", JSON.stringify(highscoreval));
} else {
    highscoreval = JSON.parse(highscore);
    highscorebox.innerHTML = "Highscore : " + highscoreval;
}


window.requestAnimationFrame(main); 
window.addEventListener("keydown",(e)=>{
    if (!isGameRunning && !gamePaused) {
        isGameRunning = true;
        window.requestAnimationFrame(main);
    }
    switch(e.key){
        case "ArrowUp":
        inputdir.x= 0;
        inputdir.y= -1 ;
        break;
        case "ArrowDown":
        inputdir.x= 0;
        inputdir.y= 1; 
        break;
        case "ArrowLeft":
        inputdir.x= -1;
        inputdir.y= 0;   
        break;
        case "ArrowRight":
        inputdir.x= 1;
        inputdir.y= 0;
        break;
        default:
        break;
    }
})

document.getElementById("startBtn").addEventListener("click", () => {
    if (!isGameRunning) {
        isGameRunning = true;
        gamePaused = false;
        window.requestAnimationFrame(main);
    } else if (gamePaused) {
        gamePaused = false;
        window.requestAnimationFrame(main);
    }
});

document.getElementById("pauseBtn").addEventListener("click", () => {
    if (isGameRunning) {
        gamePaused = true;
    }
});
document.getElementById("restartBtn").addEventListener("click", () => {
    document.getElementById("gameOverScreen").style.display = "none";
    document.getElementById("container").style.display = "block";
    snakearr = [{ x: 13, y: 15 }];
    inputdir = { x: 0, y: 0 };
    score = 0;
    scorebox.innerHTML = "Score : 0";

    isGameRunning = true;
    gamePaused = false;
    window.requestAnimationFrame(main);
});

document.getElementById("menuBtn").addEventListener("click", () => {
    document.getElementById("gameOverScreen").style.display = "none";
    document.getElementById("startScreen").style.display = "block";
});
