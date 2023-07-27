const friendsBox = document.querySelector("#friends-box");

usersInfo = JSON.parse(usersInfo);
quizzesInfo = JSON.parse(quizzesInfo);

console.log("usersInfo:", usersInfo);
console.log("quizzesInfo:", quizzesInfo);

// usersFriends = toArray(userFriends);
usersFriends = JSON.parse(usersFriends);
console.log(usersFriends);

let html = "";
if (usersFriends.length > 0){
    console.log(usersFriends[0], usersFriends[1]);
    usersFriends.forEach((element) => {
        usersInfo.forEach((e) => {
            if (e.username == element){
                html += `<a href='/user?username=${e.username}'><div class='card'>`;
                html += `<div class='name'>${e.name}</div>`;
                html += `<div class='username'>@${e.username}</div>`
                html += `</div></a>`;
            }
        })
        
    });
    
    friendsBox.innerHTML = html;
}


usersInfo = JSON.stringify(usersInfo);
quizzesInfo = JSON.stringify(quizzesInfo);