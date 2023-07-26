const express = require("express");
const ejs = require("ejs");
const https = require("https");
const bodyParser = require("body-parser");
const app = express();

const { createUser, createQuiz, updateUser, updateQuiz, findQuiz, findUser, displayQuizzes, searchUsers, searchQuizzes} = require(__dirname + "/mongoose.js");
const {runQuery} = require(__dirname + "/database.js");
const {encryptAndStore, decryptAndCompare} = require(__dirname + "/auth.js");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static("public"));
app.set('view engine', 'ejs');

let usersName, quizInfo, quiz, quizCode, quizNames, userAnswers, pastScores, score, newQuiz, usersInfo, quizzesInfo, errorMessage;
let username = null;
let numberOfQuestions = '0';

async function initSearch(){
    quizzesInfo = await searchQuizzes();
    usersInfo = await searchUsers();
    // quizzesInfo = await runQuery(`SELECT quizcode, quizname FROM quizzes`);
    // usersInfo = await runQuery(`SELECT username, name FROM users`);
    // console.log("initSearch", quizzesInfo);
}
initSearch();

function checkAnswers(userAnswers, quiz){
    console.log("userAnswers:", userAnswers);
    var score = 0;
    // for (var index = 0; index < quiz.length; index++){
    //         if (quiz[index].correctAnswer == userAnswers[index]) {
    //             score++;
    //         }
    // }
    Object.keys(userAnswers).forEach((element) => {
        console.log(quiz[element], userAnswers[element]);
        if (quiz[element][5] == userAnswers[element]){
            score++;
        }
    })
    console.log(score);
    return score;
}

let characters ='abcdefghijklmnopqrstuvwxyz';
function generateCode(length) {
    var charactersLength = characters.length;
    var result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}


// async function createQuiz(newQuiz){
//     while (true){
//         try{
//             quizCode = generateCode(8);
//             console.log("length: ", quizCode);
//             // await 
//             await runQuery(`INSERT INTO quizzes VALUES('${quizCode}', '${quizName}', '${username}', '${Object.keys(newQuiz).length}')`);
//             await runQuery(`CREATE TABLE ${quizCode} (question varchar(255), A varchar(255), B varchar(255), C varchar(255), D varchar(255), correct_answer varchar(255))`);
//             break;
//         }
//         catch{

//         }
//     }
//     for (var i = 1; i < Object.keys(newQuiz).length + 1; i++){
//         console.log(newQuiz[i]);
//         await runQuery(`INSERT INTO ${quizCode} VALUES('${newQuiz[i][0]}', '${newQuiz[i][1]}', '${newQuiz[i][2]}', '${newQuiz[i][3]}', '${newQuiz[i][4]}', '${newQuiz[i][5]}')`);
//     }
// }


app.get("/", (req, res) => {
    
    res.redirect("/auth");
})

app.get("/auth", (req, res) => {
    // console.log(req.statu);
    if (req.query.state == 'logout'){
        username = null;
    }
    if (username === null){
        if (req.query.state == 'signup'){
            res.render("auth_signup.ejs");
        } 
        else{
            res.render('auth_signin.ejs');
        }
    }
    else{
        res.redirect(`/user?username=${username}`)
    }
})

app.get("/search", (req, res) => {
    res.render("search.ejs", {usersInfo, quizzesInfo, username, usersName});
})

app.get("/user", async (req, res) => {
    if (username === null){
        res.redirect("/");
    }
    else{
        try{
            displayUsername = req.query.username;
            // console.log((await findUser(displayUsername))[0].quizzes);
            quizzes = (await findUser(displayUsername))[0].quizzes;
            console.log(req.body);
            displayUsersName = (await findUser(displayUsername))[0].name;
            res.render("profile.ejs", {quizzes, usersInfo, quizzesInfo, username, usersName, displayUsername, displayUsersName});
        }
        catch (e){
            console.log("Error:", e.message);
            res.redirect(`/`);
        }
    }
})

app.get("/quiz", async (req, res) => {
    if (username === null){
        res.redirect("/");
    }
    else{
        try{
            quizCode = req.query.quizCode;
            console.log(req.query);
            quizInfo = (await findQuiz(quizCode));
            // console.log(quizInfo);
            quiz = quizInfo[0].entries;
            console.log("quiz:", quiz);
            // quiz = await runQuery(`SELECT * FROM ${quizCode}`);
            
            res.render("quiz.ejs", {quizInfo, quiz, usersInfo, quizzesInfo, username, usersName});
        }
        catch{
            res.redirect(`/`);
        }
    }

})

app.get("/scores", async (req, res) => {
    if (username === null){
        res.redirect("/");
    }
    else{
        console.log(username);
        pastScores = (await findUser(username))[0].scores;
        // for (var i = 0; )
        // pastScores = await runQuery(`SELECT * FROM ${username}_quizzes`);
        console.log(pastScores);
        quizInfo = (await displayQuizzes());
        // quizInfo = await runQuery(`SELECT * FROM quizzes`);
    
        res.render("scores.ejs", {quizInfo, pastScores,usersInfo, quizzesInfo, username, usersName});
    }
})

app.get("/create", (req, res) => {
    if (username === null){
        res.redirect("/");
    }
    else{

    // numberOfQuestions = req.query.numberOfQuestions;
    res.render("create.ejs", {quizzes, numberOfQuestions, usersInfo, quizzesInfo, username, usersName});
    }
})

app.post("/", (req, res) => {
    console.log(req.body);
})

app.post("/auth", async (req, res) => {
    console.log("/auth", req.body);
    if (JSON.stringify(req.body) === '{}'){
        res.redirect("/auth?state=signup")
    }
    else{
        if (await decryptAndCompare(req.body.username, req.body.password) == 'Success'){
            username = req.body.username;
            usersName = (await findUser(username))[0].name;
            res.redirect(`/user?username=${req.body.username}`);
        }
        else{
            errorMessage = 'Invalid username or password. Try again.';
            res.render("auth_error.ejs", {errorMessage});
        }
    }
})

app.post("/signup", async (req, res) => {
    console.log("/signup", req.body);
    if (req.body.password == req.body.repeat){
        if(await encryptAndStore(req.body.username, req.body.password, req.body.name) == 'Success'){
            username = req.body.username;
            usersName = req.body.name;
            // await runQuery(`CREATE TABLE ${username}_quizzes (quizcode varchar(255) PRIMARY KEY, score varchar(255));`);
            res.redirect(`/user?username=${username}`);
        }
        else{
            errorMessage = 'Username already taken. Try again.';
            res.render("auth_error.ejs", {errorMessage});
        }
    }
    else{
        errorMessage = 'Passwords did not match. Try again.';
        res.render("auth_error.ejs", {errorMessage});
    }
})

app.post("/user", (req, res) => {
    console.log(req.body);
})

app.post("/quiz", async (req, res) => {
    userAnswers = (req.body);
    console.log("quiz:", quiz);
    score = checkAnswers(userAnswers, quiz);

    try{
        scores = (await findUser(username))[0].scores;

        for (var i = 0; i < scores.length; i++){
            if (scores[i].quizCode == quizCode){
                scores.splice(i, 1);
            }
        }

        scores.push({
            quizCode: quizCode,
            score: score,
            maxScore: quiz.length
        });
        console.log("scores:", scores);
        await updateUser(username, { $set: { scores: scores}});

        // await runQuery(`INSERT INTO ${username}_quizzes VALUES('${quizCode}', '${score}')`);
    } catch (e){
        console.log("Error saving score:", e.message);
        // await runQuery(`DELETE FROM ${username}_quizzes WHERE quizcode = '${quizCode}'`);
        // await runQuery(`INSERT INTO ${username}_quizzes VALUES('${quizCode}', '${score}')`);
    }
    console.log("score:", score);
    console.log("quizInfo:", quizInfo);
    res.render("submitted.ejs", {quiz, quizInfo, userAnswers, score, usersInfo, quizzesInfo, username, usersName});//, correctAnswers, score});
})

app.post("/create", (req, res) => {
    console.log("/create");
    console.log(req.body);
    quizName = req.body.quizname;
    numberOfQuestions = req.body.numberofquestions;
    res.render("create2.ejs", {quizName, numberOfQuestions, usersInfo, quizzesInfo, username, usersName});
})

app.post("/created", async (req, res) => {
    console.log("/created");
    console.log(req.body);
    newQuiz = req.body;
    while (true){
        quizCode = generateCode(8);
        
        if ((await findQuiz(quizCode)).length == 0) {
            await createQuiz({
                quizCode: quizCode,
                quizName: quizName,
                author: username,
                entries: newQuiz
            })
            await updateUser(username, {$push: {quizzes: {quizCode: quizCode, quizName: quizName}}});
            // console.log("created mongo quiz");
            break
        }
    }
    setTimeout(initSearch, 300);
    // initSearch();
    console.log("/created", quizzesInfo);
    // quizName = req.body.quizname;
    // numberOfQuestions = req.body.numberofquestions;
    setTimeout(() => {return}, 300);
    res.redirect("/");
    // res.render("create2.ejs", {quizName, numberOfQuestions});
})

// let PORT = process.env.PORT;
// if (PORT === null || PORT == "") {
//   PORT = 3000;
// }

app.listen(process.env.PORT || 3000, () => {
    console.log("Server started on PORT 3000");
})