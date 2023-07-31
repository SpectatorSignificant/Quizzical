const bcrypt = require("bcrypt");

const { createUser, createQuiz, updateUser, updateQuiz, findQuiz, findUser, displayQuizzes} = require(__dirname + "/mongoose.js");

async function encryptAndStore(username, password, name){
  
  try {
    var hashedPassword = await bcrypt.hash(password, 10);
    if ((await findUser(username)).length === 0){
      await createUser({
        username: username,
        password: hashedPassword,
        name: name
      });
  
      return "Success";
    }
    else {;
      return "Error"
    }
  } 
  catch {
    return 'Error';
  }
}

async function decryptAndCompare(username, password){
  var user = await findUser(username);
  if (user.length === 0) {
    return 'Error';
  }
  else{
    try {
      if (await bcrypt.compare(password, user[0].password)) {
        return 'Success';
      } else {
        return 'Error';
      }
    } catch {
      return 'Error';
    }
  }
}

module.exports = {
  encryptAndStore,
  decryptAndCompare
}
