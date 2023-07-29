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

// async function postJSON(url, data) {
//     try {
//       var response = await fetch(url, {
//         method: "POST", 
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(data),
//       })
//     //   .then(result => result.json())
//       .then(data => {
//           console.log(data);
//        })
      
//     //   var result = await response.json();
//     //   console.log("Success:", result);
//     } catch (e) {
//       console.log("Error:", e.message);
//     }
// }

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