const friendsBox = document.querySelector("#friends-box");
const friendRequestsBox =document.querySelector("#friend-requests-box");

usersInfo = JSON.parse(usersInfo);
quizzesInfo = JSON.parse(quizzesInfo);

friendRequests = JSON.parse(friendRequests);
friendRecommendations = JSON.parse(friendRecommendations);

console.log("usersInfo:", usersInfo);
console.log("quizzesInfo:", quizzesInfo);

// usersFriends = toArray(userFriends);
usersFriends = JSON.parse(usersFriends);
console.log(usersFriends);

async function postJSON(url, data) {
    try {
      var response = await fetch(url, {
        method: "POST", 
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
      .then((result) => result.json())
      .then((data) => {
        // console.log("data:", data, typeof(data));
        // console.log("url:", data.url);
        window.location.href = data.url;
    })
    
    //   var result = await response.json();
    //   console.log("Success:", result);
    } catch (e) {
      console.log("Error:", e.message);
    }
}

let html = "";
if (friendRequests.length > 0){
    // console.log(usersFriends[0], usersFriends[1]);
    friendRequests.forEach((element) => {
        usersInfo.forEach((e) => {
            if (e.username == element){
                html += `<div class='card request'>`;
                html += `<div class='name'>${e.name}</div>`;
                html += `<div class='username'>@${e.username}</div>`;
                html += `<button class='answer accept' type="submit" name="${e.username}">Accept</button>`
                html += `<button class='answer decline' type="submit" name="${e.username}">Decline</button>`
                html += `</div>`;
            }
        })
        
    });
    friendRequestsBox.innerHTML = html;
}

html = "";
if (usersFriends.length > 0){
    console.log(usersFriends[0], usersFriends[1]);
    usersFriends.forEach((element) => {
        usersInfo.forEach((e) => {
            if (e.username == element){
                html += `<a href='/user?username=${e.username}'><div class='card friend'>`;
                html += `<div class='name'>${e.name}</div>`;
                html += `<div class='username'>@${e.username}</div>`
                html += `</div></a>`;
            }
        })
        
    });
    
    friendsBox.innerHTML = html;
}

html = "";
const recommendationsBox = document.querySelector("#recommendations-box")
if (friendRecommendations.length > 0){
    friendRecommendations.forEach((element) => {
        usersInfo.forEach((e) => {
            if (e.username == element){
                html += `<a href='/user?username=${e.username}'><div class='card friend'>`;
                html += `<div class='name'>${e.name}</div>`;
                html += `<div class='username'>@${e.username}</div>`
                html += `</div></a>`;
            }
        })
        
    });
    
    recommendationsBox.innerHTML = html;
}

const requestButtons = document.querySelectorAll("button.answer");

if (requestButtons.length > 0){
    requestButtons.forEach((button) => {
        button.addEventListener("click", (e) => {
            postJSON("/friends", {username: e.target.name, clicked: e.target.innerHTML});
        })
    })
}

usersInfo = JSON.stringify(usersInfo);
quizzesInfo = JSON.stringify(quizzesInfo);