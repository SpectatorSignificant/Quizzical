const mongoose = require("mongoose");

const url = `mongodb://${process.env.MONGODB_PORT || '127.0.0.1'}/quizzical`;

mongoose.connect(url);

const userSchema = new mongoose.Schema({
    username: String,
    name: String,
    password: String,
    key: {
        type: String,
        default: "null"
    },
    tags: {
        type: String,
        default: ""
    },
    friends: {
        type: [String],
        default: []
    },
    friendRequests: {
        type: [String],
        default: []
    },
    scores: {
        type: [
            {
                quizCode: String,
                score: Number,
                maxScore: Number
            }
        ],
        default: []
    },
    quizzes: {
        type: [{
            quizCode: String,
            quizName: String
        }],
        default: []
    }
});

const User = mongoose.model("User", userSchema);

const quizSchema = new mongoose.Schema({
    quizCode: String,
    quizName: String,
    author: String,
    entries: Object,
    leaderboard: {
        type: [
            {
                username: String,
                score: Number
            }
        ],
        default: []
    },
    tags: {
        type: String,
        default: ""
    },
    private: {
        type: Boolean,
        default: false
    }

})

const Quiz = mongoose.model("Quiz", quizSchema);

let userObject = {
    username: "user1", 
    password: "pass1", 
    name: "User Onee", 
    scores: [
        { 
            quizCode: "aaaaaaaa", 
            score: 5
        }
    ]
};

let quizObject = {
    quizCode: "bbbbbbbb",
    quizName: "Fruits quiz",
    author: "64c0ff371d2b86df97c06448",
    entries: [
        {
            question: "Name the fruit",
            A: "Apple",
            B: "Banana",
            C: "Kiwi",
            D: "NOTA",
            correctAnswer: 2,
        }
    ]
}

async function createUser(userObject){
    try{
        const user  = await User.create(userObject);
        await user.save();
    } catch (e){
        console.log("Error creating user:", e.message);
    }
}

async function createQuiz(quizObject){
    try{
        const quiz = await Quiz.create(quizObject);
        await quiz.save();
    } catch (e){
        console.log("Error creating quiz", e.message);
    }
}

async function updateUser(username, update){
    try{
        const user = await User.findOneAndUpdate({username: username}, update, {
            new: true
        });
        
        await user.save();
        return user;
    }
    catch (e){
        console.log("Error:", e.message);
    }
}

async function updateQuiz(filter, update){
    const quiz = await Quiz.findOneAndUpdate(filter, update, {
        new: true
    });
    
    await quiz.save();
    return quiz._id;
}

async function findQuiz(quizCode){
    try{
        const quiz = await Quiz.where("quizCode").equals(quizCode);
        
        return quiz;
    }
    catch (e){
        console.log("Error:", e.message);
    }
}
async function displayQuizzes(){
    try{
        const quizzes = await Quiz.find({});
        
        return quizzes;
    }
    catch (e){
        console.log("Error:", e.message);
    }
}
async function findUser(username){
    try{
        const user = await User.where("username").equals(username);
        
        return user;
    }
    catch (e){
        console.log("Error:", e.message);
    }
}

async function searchUsers(){
    try{
        const users = await User.find({}, {username: 1, name: 1, tags: 1});
        
        return users;
    }
    catch (e){
        console.log("Error:", e.message);
    }
}

async function searchQuizzes(){
    try{
        const quizzes = await Quiz.find({}, {quizCode: 1, quizName: 1, tags: 1});
        
        return quizzes;
    }
    catch (e){
        console.log("Error:", e.message);
    }
}

module.exports = { createUser, createQuiz, updateUser, updateQuiz, findQuiz, findUser, displayQuizzes, searchUsers, searchQuizzes};