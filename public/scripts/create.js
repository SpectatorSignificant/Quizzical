const logo = document.getElementById("logo");
const displayBox = document.getElementById("display-box");
const inputsBox = document.getElementById("inputs");
const inputForm = document.querySelector("#quiz-form");

// console.log(noOfQuestions);

async function postJSON(data) {
    try {
      var response = await fetch("/buffer", {
        method: "POST", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
        },
        body: data,
      });
      
    //   var result = await response.json();
    //   console.log("Success:", result);
    } catch (error) {
      console.error("Error:", error);
    }
}

// let html = "";
// for (var i = 0; i < numberOfQuestions; i++){
//     html += `<h2 class="card">Question: <input type="text" name="question"></h2>`
    
// }

// inputsBox.innerHTML = inputsBox.innerHTML + html;

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
        submitButton.click();
    });
});
  
// const data = { username: "example" };
const data = "hello";
// postJSON(data);

// submitButton.addEventListener("click", (e) => {
//     form.action = "/create";
// })

