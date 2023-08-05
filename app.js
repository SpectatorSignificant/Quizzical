const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const app = express();
const http = require('http').createServer(app);
const io = require("socket.io")(http);
const { createClient } = require('redis');
const { createAdapter } = require('socket.io-redis-adapter');

// MUST BE ADDED when deploying for redis to handle friend requests and leaderboards with socket.io
// try{ 
//     const pubClient = createClient({ legacyMode: true, host: 'localhost', port: 6379 });
//     const subClient = pubClient.duplicate();
//     pubClient.on("error", (e) => {
//         console.log("Error with pubClient:",e.message);
//     });
      
//     subClient.on("error", (e) => {
//       console.log("Error with subClient:", e.message);
//     });

//     io.adapter(createAdapter(pubClient, subClient));
// } catch (e){
//     console.log("Error with redis adapter:", e.message);
// }

const { createUser, createQuiz, updateUser, updateQuiz, findQuiz, findUser, displayQuizzes, searchUsers, searchQuizzes} = require(__dirname + "/mongoose.js");
const { upload, uploadFile, getFileStream, unlinkFile, deleteFile} = require(__dirname + "/s3.js");
const {encryptAndStore, decryptAndCompare} = require(__dirname + "/auth.js");

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static("public"));
app.set('view engine', 'ejs');

let usersName, usersFriends, userTags, imageKey, quizInfo, isPrivate, isFriend, isAllowed, friendRequests, friendRecommendations, showNotifications, newTags, quiz, quizCode, quizNames, userAnswers, pastScores, score, newQuiz, usersInfo, quizzesInfo, errorMessage;
let username = null;
let numberOfQuestions = '0';

async function initSearch(){
    quizzesInfo = await searchQuizzes();
    usersInfo = await searchUsers()
}
initSearch();

function checkAnswers(userAnswers, quiz){
    var score = 0;
    
    Object.keys(userAnswers).forEach((element) => {
        
        if (quiz[element][5] == userAnswers[element]){
            score++;
        }
    })
    
    return score;
}

async function getRecommendations(username){
    const friends  = (await findUser(username))[0].friends;
    const tags = (await findUser(username))[0].tags.split("");
    const recommendations = [];
    for (var i = 0; i < friends.length; i++){
        const secondFriends = (await findUser(friends[i]))[0].friends;
        
        recommendations.push(...secondFriends);
    }
    for (var i = 0; i < recommendations.length; i++){
        if (friends.includes(recommendations[i]) || recommendations[i] == username){
            recommendations.splice(i, 1);
        }
    }
    for (var i = 0; i < usersInfo.length; i++){
        const user = usersInfo[i];
        for (var i = 0; i < userTags.length; i++){
            if (user.username != username && !recommendations.includes(user.username) && tags.includes(userTags[i])){
                recommendations.push(user.username);
                break;
            }
        }
    }

    return recommendations;
}

async function updateLeaderboard(username, score, quizCode){
    const l = (await findQuiz(quizCode))[0].leaderboard;
    const quizLeaderboard = l.slice();
    let inserted = false;
    for (var i = 0; i < quizLeaderboard.length; i++){
        if (score >= quizLeaderboard[i].score){
            quizLeaderboard.splice(i, 0, { username, score});
            inserted = true;
            for (var j = 0; j < quizLeaderboard.length; j++){
                if (j != i){
                    if (quizLeaderboard[j].username == username){
                        quizLeaderboard.splice(j, 1);
                    }
                }
            }
            break;
        }
    }
    if (inserted == false){
        quizLeaderboard.push({ username, score});
        for (var j = 0; j < quizLeaderboard.length; j++){
            
            if (j != quizLeaderboard.length - 1){
                if (quizLeaderboard[j].username == username){
                    quizLeaderboard.splice(j, 1);
                }
            }
        }
    }
    
    quizLeaderboard.sort((a, b) => {
        if (a.score >= b.score) 1
        else -1
    })
    console.log(quizLeaderboard);
    await updateQuiz({quizCode}, {$set: {leaderboard: quizLeaderboard}});
}
// updateLeaderboard('user3', 7, "swllaptt");

let characters ='abcdefghijklmnopqrstuvwxyz';
function generateCode(length) {
    var charactersLength = characters.length;
    var result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

app.get("/", (req, res) => {
    
    res.redirect("/auth");
})

app.get("/auth", (req, res) => {
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

// app.get("/search", (req, res) => {
//     res.render("search.ejs", {usersInfo, quizzesInfo, username, usersName});
// })

app.get("/user", async (req, res) => {
    if (username === null){
        res.redirect("/");
    }
    else{
        initSearch();
        try{
            displayUsername = req.query.username;
            quizzes = (await findUser(displayUsername))[0].quizzes;
            console.log({quizzes})
            displayUsersName = (await findUser(displayUsername))[0].name;
            imageKey = (await findUser(displayUsername))[0].key;
            isFriend = (await findUser(displayUsername))[0].friends.includes(username);
            userTags = (await findUser(displayUsername))[0].tags;

            res.render("profile.ejs", {key: imageKey, quizzes, usersInfo, userTags, quizzesInfo, isFriend, username, usersName, displayUsername, displayUsersName});
        }
        catch (e){
            console.log("Error at /user:", e.message);
            res.redirect(`/`);
        }
    }
})

app.get("/images", (req, res) => {
    const key = req.query.key;
    const readStream = getFileStream(key);

    readStream.pipe(res);
})

app.get("/friends", async (req, res) => {
    if (username === null){
        res.redirect("/");
    }
    initSearch();
    friendRecommendations =  (await getRecommendations(username));
    displayUsername = req.query.username;
    if (!displayUsername){
        displayUsername = username;
        res.redirect(`/friends?username=${username}`);
    } else {
        usersFriends = (await findUser(displayUsername))[0].friends;
        if (displayUsername == username){
            friendRequests = (await findUser(username))[0].friendRequests;
        } else {
            friendRequests = [];
        }
        
        res.render("friends.ejs", {key: imageKey, usersFriends, friendRequests, friendRecommendations, usersInfo, quizzesInfo, username, usersName, displayUsername, displayUsersName}); 
    } 
    
})

app.get("/quiz", async (req, res) => {
    if (username === null){
        res.redirect("/");
    }
    else{
        initSearch();
        try{
            quizCode = req.query.quizCode;
            quizInfo = (await findQuiz(quizCode));
            if (quizInfo[0].author == username){
                errorMessage = "You cannot take a quiz you authored";
                res.render("error.ejs", { errorMessage, username, usersName, usersInfo, quizzesInfo });
            } else {
                if (quizInfo[0].private == true){
                    if ((await findUser(username))[0].friends.includes(quizInfo[0].author)){
                        isAllowed = true;
                    } else{
                        isAllowed = false;
                    }
                } else {
                    isAllowed = true;
                }

                if (isAllowed == false){
                    errorMessage = `This is a private quiz. Try sending @${(await findUser(quizInfo[0].author))[0].username} a friend request`;
                    res.render("error.ejs", { errorMessage, username, usersName, usersInfo, quizzesInfo });
                }
                else {
                    quiz = quizInfo[0].entries;
                    
                    res.render("quiz.ejs", {quizInfo, quiz, usersInfo, quizzesInfo, username, usersName});
                }
            }
        }
        catch{
            res.redirect(`/`);
        }
    }

})

app.get("/leaderboard", async (req, res) => {
    if (username === null){
        res.redirect("/");
    }
    quizCode = req.query.quizCode;
    quizName = (await findQuiz(quizCode))[0].quizName;
    quizLeaderboard = (await findQuiz(quizCode))[0].leaderboard;
    res.render("leaderboard.ejs", {username, quizCode, quizName, usersInfo, quizzesInfo, quizLeaderboard})
})

app.get("/scores", async (req, res) => {
    if (username === null){
        res.redirect("/");
    }
    else{
        initSearch();
        pastScores = (await findUser(username))[0].scores;
        quizInfo = (await displayQuizzes());
    
        res.render("scores.ejs", {quizInfo, pastScores,usersInfo, quizzesInfo, username, usersName});
    }
})

app.get("/create", (req, res) => {
    if (username === null){
        res.redirect("/");
    }
    else{
        initSearch();
        res.render("create.ejs", { numberOfQuestions, usersInfo, quizzesInfo, username, usersName});
    }
})

app.get("*", (req, res) => {
    res.redirect("/");
})

app.post("/", (req, res) => {

})

app.post("/auth", async (req, res) => {
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
    if (req.body.password == req.body.repeat){
        
        if(await encryptAndStore(req.body.username, req.body.password, req.body.name) == 'Success'){
            username = req.body.username;
            usersName = req.body.name;
            
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

app.post("/request", (req, res) => {
    res.json({message: "Success"});

})

app.post("/user/tags", async (req, res) => {
    await updateUser(username, {$set: {tags: req.body.tags}});
    res.json({url: `/user?username=${username}`})
})

app.post("/user", async (req, res) => {
    if (req.body.friendButtonClicked == true){
        if (!(await findUser(displayUsername))[0].friends.includes(username) && !(await findUser(displayUsername))[0].friendRequests.includes(username)){
            await updateUser(displayUsername, {$push: {friendRequests: username}});
            try{
                io.to(displayUsername).emit("newRequest", {friendRequests: username});
            } catch (e) {
                console.log("Error sending message to room:", e.message);
            }
        } else if ((await findUser(displayUsername))[0].friends.includes(username)){
            await updateUser(displayUsername, {$pull: {friends: username}});
            await updateUser(username, {$pull: {friends: displayUsername}});
            await updateUser(displayUsername, {$pull: {friendRequests: username}});
        }
        
        res.json({url: `/user?username=${username}`});
        
    }
})

app.post("/friends", async (req, res) => {
    if (req.body.clicked == "Accept"){
        await updateUser(username, {$pull: {friendRequests: req.body.username}});
        await updateUser(username, {$push: {friends: req.body.username}});
        await updateUser(req.body.username, {$push: {friends: username}});
    } else if (req.body.clicked == "Decline"){
        await updateUser(username, {$pull: {friendRequests: req.body.username}});
    }

    res.send({url: `/friends?username=${username}`});
})

app.post("/images", upload.single("pfp"), async (req, res) => {
    if (req.query.delete == 'true') {
        deleteFile(req.query.key);
        await updateUser(username, {$set: {key: "null"}});
    } else {
        const file = req.file;
        const result = await uploadFile(file);
        await unlinkFile(file.path);
        await updateUser(username, {$set: {key: file.filename}});
    }
    
    res.redirect(`/user?username=${username}`);
})

app.post("/quiz", async (req, res) => {
    userAnswers = (req.body);
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
        
        await updateUser(username, { $set: { scores: scores}});
        await updateLeaderboard(username, score, quizCode);
        quizLeaderboard = (await findQuiz(quizCode))[0].leaderboard;
        io.to(`leaderboard/${quizCode}`).emit("reloadPage", {state: "reload", leaderboard: JSON.stringify(quizLeaderboard)});
        console.log("Page reload sent");

    } catch (e){
        console.log("Error saving score:", e.message);
    }
    res.render("submitted.ejs", {quiz, quizInfo, userAnswers, score, usersInfo, quizzesInfo, username, usersName});//, correctAnswers, score});
})

app.post("/create", (req, res) => {
    quizName = req.body.quizname;
    numberOfQuestions = req.body.numberofquestions;
    res.render("create2.ejs", {quizName, numberOfQuestions, usersInfo, quizzesInfo, username, usersName});
})

app.post("/created", async (req, res) => {
    if (req.body.private == "on"){
        isPrivate = true;
    } else {
        isPrivate = false;
    }
    newQuiz = req.body;
    newTags = req.body.tags
    delete newQuiz.private;
    delete newQuiz.tags;

    while (true){
        quizCode = generateCode(8);
        
        if ((await findQuiz(quizCode)).length == 0) {
            await createQuiz({
                quizCode: quizCode,
                quizName: quizName,
                author: username,
                entries: newQuiz,
                tags: newTags,
                private: isPrivate
            })
            await updateUser(username, {$push: {quizzes: {quizCode: quizCode, quizName: quizName}}});
            break;
        }
    }
    setTimeout(initSearch, 300);
    
    setTimeout(() => {return}, 300);
    res.redirect("/");
})

io.on('connection', (socket) => {
    console.log("Socket connection detected");
    console.log(socket.id);

    socket.on("initClient", async (message) => {
        console.log("message received from client:", message);
        
        socket.join(message.username);
        
        socket.emit('serverMessage', {message: "Hello from server-side"});
        
        console.log("Message emitted from backend");
    })

    socket.on("leaderboard", (message) => {
        console.log("Leaderboard is displayed", message.quizCode);
        socket.join(`leaderboard/${quizCode}`);
    })

    socket.on("clientMessage", (message) => {
        console.log("message received from client:", message);

        socket.emit('serverMessage', {message: "Hello from backend"});
        
        console.log("Message emitted from backend");
        
    })
  
    socket.on('disconnect', () => {
        console.log("Socket disconnected");
    });
});
  
const PORT = process.env.PORT || 3001;
http.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});