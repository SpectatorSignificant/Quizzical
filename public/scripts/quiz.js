const logo = document.getElementById("logo");
const displayBox = document.getElementById("display-box");

quiz = JSON.parse(quiz);
console.log(quiz);
quizInfo = JSON.parse(quizInfo)[0];
console.log(quizInfo);

let quizObject = [];
quiz.forEach((element, index) => {
    quizObject.push({
        question: element.question,
        options: [element.A, element.B, element.C, element.D]
    });
})

let html = "";
html += `<form class='options' method='post' action='/quiz'>`;
quizObject.forEach((element, index) => {

    html += `<div class='question'>`;
    html += `<h2>${index + 1}) ${element.question}</h2>`;
    html += `<div style='display:flex; flex-direction: column'>`;
    html += `<input type='radio' name="${index}" value='0' id='1' required >${element.options[0]}</input>`;
    html += `<input type='radio' name="${index}" value='1' id='2' required >${element.options[1]}</input>`;
    html += `<input type='radio' name="${index}" value='2' id='3' required >${element.options[2]}</input>`;
    html += `<input type='radio' name="${index}" value='3' id='4' required >${element.options[3]}</input>`;
    html += `</div>`;
    html += `</div>`;
    // html += `<div class="card" style="grid-row-start:${index + 1}">hi there</div>`;
});
html += `<button class='submit-quiz' type='submit'>Submit Quiz</button>`;
html += `</form>`;

displayBox.innerHTML = html;