const logo = document.getElementById("logo");
const displayBox = document.getElementById("display-box");
const hiddenInput = document.querySelector("#hidden")
const friendButton = document.querySelector("#friend-button");

quizzes = JSON.parse(quizzes);
console.log(quizzes)

displayBox.style["grid-template-rows"] = `repeat(${quizzes.length}, 40px)`;

async function postJSON(data) {
    try {
      var response = await fetch("/user", {
        method: "POST", 
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
      .then(result => result.json())
      .then(data => {
          window.location.href = data.url;
       })
      
    //   var result = await response.json();
    //   console.log("Success:", result);
    } catch (e) {
      console.log("Error:", e.message);
    }
}

let html = "";
// quizzes.forEach((element, index) => {
//     html += `<div class="card" style="grid-row-start:${index + 1}"><a href="/quiz?quizCode=${element.quizcode}">${element.quizname}</a>
//     <button type="submit" >Delete</button>
//     </div>`;
// });
if (quizzes.length == 0){
  html += "You have not created any quizzes. Create one <a href='/create'>here</a>"
} else {
  quizzes.forEach((element, index) => {
      html += `<a href="/quiz?quizCode=${element.quizCode}"><div class="card" style="grid-row-start:${index + 1}">${element.quizName}</div></a>`;
  });
}

if (username != displayUsername){
    friendButton.addEventListener("click", (e) => {
        postJSON({friendButtonClicked: true});
    })
}

displayBox.innerHTML += html;