const logo = document.getElementById("logo");
const displayBox = document.getElementById("display-box");

quiz = JSON.parse(quiz);
console.log(quiz);
quizInfo = JSON.parse(quizInfo)[0];
console.log(quizInfo.quizName);

let quizObject = [];
Object.keys(quiz).forEach((element, index) => {
    quizObject.push({
        question: quiz[element][0],
        options: [quiz[element][1], quiz[element][2], quiz[element][3], quiz[element][4]]
    });
})

let html = "";
html += `<form class='options' method='post' action='/quiz'>`;
quizObject.forEach((element, index) => {

    html += `<div class='question'>`;
    html += `<h2>${index + 1}) ${element.question}</h2>`;
    html += `<div style='display:flex; flex-direction: column'>`;
    html += `<input type='radio' name="${index}" value='0' id='1'  >${element.options[0]}</input>`;
    html += `<input type='radio' name="${index}" value='1' id='2'  >${element.options[1]}</input>`;
    html += `<input type='radio' name="${index}" value='2' id='3'  >${element.options[2]}</input>`;
    html += `<input type='radio' name="${index}" value='3' id='4'  >${element.options[3]}</input>`;
    html += `</div>`;
    html += `</div>`;
    // html += `<div class="card" style="grid-row-start:${index + 1}">hi there</div>`;
});
html += `<button class='submit-quiz' type='submit'>Submit Quiz</button>`;
html += `</form>`;

displayBox.innerHTML = html;