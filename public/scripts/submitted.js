const logo = document.getElementById("logo");
const displayBox = document.getElementById("display-box");
const scoreBox = document.getElementById("score");

quiz = JSON.parse(quiz);
console.log(quiz);

quizInfo = JSON.parse(quizInfo)[0];
console.log(quizInfo);

userAnswers = JSON.parse(userAnswers);
// correctAnswers = JSON.parse(correctAnswers);
console.log(userAnswers);

// let quizObject = [];
// quiz.forEach((element, index) => {
//     quizObject.push({
//         question: element.question,
//         options: [element.A, element.B, element.C, element.D]
//     });
// })

let quizObject = [];
Object.keys(quiz).forEach((element, index) => {
    quizObject.push({
        question: quiz[element][0],
        options: [quiz[element][1], quiz[element][2], quiz[element][3], quiz[element][4]]
    });
})

let html = "";

html += `<div class='options'>`;
quizObject.forEach((element, index) => {

    html += `<div class='question'>`;
    html += `<h2>Q. ${element.question}</h2>`;
    html += `<div style='display:flex; flex-direction: column'>`;
    for (var i = 0; i < 4; i++){
        if (quiz[index][5] == i){
            html += `<div class='option correct'>${element.options[i]}</div>`;
        } else if (userAnswers[index] == i){
            html += `<div class='option wrong'>${element.options[i]}</div>`
        } else{
            html += `<div class='option'>${element.options[i]}</div>`
        } 
    
    }
    html += `</div>`;
    html += `</div>`;
    
});
html += `</div>`;

scoreBox.innerHTML = `Score: ${score} / ${Object.keys(quizInfo.entries).length} points`;

displayBox.innerHTML = html;