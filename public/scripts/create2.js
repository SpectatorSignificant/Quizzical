const logo = document.getElementById("logo");
const displayBox = document.getElementById("display-box");
const inputsBox = document.getElementById("inputs");
const inputForm = document.querySelector("#quiz-form");

// console.log(noOfQuestions);

// async function postJSON(data) {
//     try {
//       var response = await fetch("/buffer", {
//         method: "POST", // or 'PUT'
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: data,
//       });
      
//     //   var result = await response.json();
//     //   console.log("Success:", result);
//     } catch (error) {
//       console.error("Error:", error);
//     }
// }

let html = "";

html += `<div class='block-input'>Make quiz private: <input type="checkbox" name="private" id="private"></div>`;

html += `<div class='block-input'>Add tags (each separated by a space): <input type="text" name="tags"></div>`

for (var i = 0; i < numberOfQuestions; i++){
    html += `<div class="card">
    <h2>Question ${i + 1}: <input class="option" type="text" name="${i}" required></h2>
    <h2>A) <input class="option" type="text" name="${i}" required ></h2>
    <h2>B) <input class="option" type="text" name="${i}" required ></h2>
    <h2>C) <input class="option" type="text" name="${i}" required ></h2>
    <h2>D) <input class="option" type="text" name="${i}" required ></h2>
    <p>Correct Answer:</p>
    <input type="radio" name="${i}" value="0" required >A</input>
    <input type="radio" name="${i}" value="1" >B</input>
    <input type="radio" name="${i}" value="2" >C</input>
    <input type="radio" name="${i}" value="3" >D</input>
    </div>`;
    
}

inputsBox.innerHTML = inputsBox.innerHTML + html;

const inputNumberOfQuestions = document.querySelectorAll(".number-of-questions");
const submitButton = document.querySelector("button");

console.log(numberOfQuestions);
console.log(inputNumberOfQuestions[0]);

// inputNumberOfQuestions.forEach((element) => {
//     element.addEventListener("input", (e) => {
//         console.log("clicked");
//         submitButton.click();
//     });
// });

inputNumberOfQuestions.forEach((element) => {
    element.addEventListener("click", (e) => {
        console.log(e.target.innerText);
        numberOfQuestions = e.target.innerText;
        // location.reload();
        // inputForm.method = '';
        // postJSON({noOfQuestions: `${e.target.value}`});
        // submitButton.click();
    });
});

document.addEventListener("submit", (e) => {
  alert("Quiz successfully created!")
})
// const data = { username: "example" };
// const data = "hello";
// postJSON(data);

// submitButton.addEventListener("click", (e) => {
//     form.action = "/create";
// })

