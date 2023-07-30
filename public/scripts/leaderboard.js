socket.emit("leaderboard", {quizCode});

socket.on("reloadPage", (message) => {
    if (message.state == "reload"){
        window.location.href = `/leaderboard?quizCode=${quizCode}`;
    }
})

const leaderboardBox = document.querySelector("#leaderboard");

quizLeaderboard = JSON.parse(quizLeaderboard);
usersInfo = JSON.parse(usersInfo);

let html = "";
for (var i = 0; i < 10 && i < quizLeaderboard.length; i++){
    // console.log(usersFriends[0], usersFriends[1]);
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

usersInfo = JSON.stringify(usersInfo);