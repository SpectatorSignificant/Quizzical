const closeButton = document.querySelector("#notifications i");
const notificationBox = document.querySelector("div#notifications");

const socket = io();

sendMessage({username});

socket.on("serverMessage", (message) => {
  console.log("Message received from backend:", message);
});

socket.on("newRequest", (message) => {
  console.log("New request received:", message);
  notificationBox.hidden = false;
  console.log(notificationBox);
  console.log(notificationBox.hidden);
})

function sendMessage(data) {
    socket.emit('initClient', data);
}

let clickedOnCloseButton;

notificationBox.addEventListener("click", (e) => {
    clickedOnCloseButton = closeButton.contains(e.target);

    if (clickedOnCloseButton){
        console.log("clicked on close button");
        notificationBox.hidden = 'true';
        // sendMessage({username, id: socket.id, notification: "close"});
    } else {
        console.log("clicked outside close button");
        sendMessage({notification: "open"});
        window.location.href = `/friends?username=${username}`;
    }
})