socket.emit("leaderboard", {quizCode});

socket.on("reloadPage", (message) => {
    if (message.state == "reload"){
        quizLeaderboard = JSON.parse(message.leaderboard);
        renderLeaderboard();
    }
})

const leaderboardBox = document.querySelector("#leaderboard");

quizLeaderboard = JSON.parse(quizLeaderboard);
usersInfo = JSON.parse(usersInfo);

let html;

function renderLeaderboard(){
    html = "";
    for (var i = 0; i < 10 && i < quizLeaderboard.length; i++){
        const element = quizLeaderboard[i];
    
        usersInfo.forEach((e) => {
            if (e.username == element.username){
                html += `<div class='card friend'><a href='/user?username=${e.username}'>`;
                html += `<div class='name'>#${i + 1} ${e.name}</div>`;
                html += `<div class='score'>Score: ${element.score}</div>`
                html += `</a></div>`;
            }
        })
        
        leaderboardBox.innerHTML = html;
    }
}

renderLeaderboard();

usersInfo = JSON.stringify(usersInfo);