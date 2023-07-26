const logo = document.getElementById("logo");
const displayBox = document.getElementById("display-box");
const hiddenInput = document.querySelector("#hidden")
quizzes = JSON.parse(quizzes);
console.log(quizzes)

displayBox.style["grid-template-rows"] = `repeat(${quizzes.length}, 40px)`;

let html = "";
// quizzes.forEach((element, index) => {
//     html += `<div class="card" style="grid-row-start:${index + 1}"><a href="/quiz?quizCode=${element.quizcode}">${element.quizname}</a>
//     <button type="submit" >Delete</button>
//     </div>`;
// });
quizzes.forEach((element, index) => {
    html += `<a href="/quiz?quizCode=${element.quizCode}"><div class="card" style="grid-row-start:${index + 1}">${element.quizName}</div></a>`;
});

// document.addEventListener("submit", {
//     hiddenInput.value = 
// })

displayBox.innerHTML += html;