// const logo = document.querySelector("#logo");
const searchBar = document.querySelector("#search-bar");
const suggestionsList = document.querySelector("#suggestions-list");
const suggestionsBox = document.querySelector("#suggestions-box");
const searchInput = document.querySelector("#search-box")

quizzesInfo = JSON.parse(quizzesInfo);
usersInfo = JSON.parse(usersInfo);

console.log(quizzesInfo, usersInfo);

// let infoArray = ["user1", "user2", "quiz1", "quiz2"]
let nameSuggestionsArray = [];
let usernameSuggestionsArray = [];
let quizSuggestionsArray = [];
let html_search=``;
let clickedOutsideSearchBar;

let usersInfoObject = {
    username: [],
    name: []
};

let quizzesInfoArray = [];
let quizzesTagsArray = [];

usersInfo.forEach((element, index) => {
    // console.log(element);
    usersInfoObject.username.push(element.username);
    usersInfoObject.name.push(element.name)
})

quizzesInfo.forEach((element, index) => {
    quizzesInfoArray.push(element.quizName);
    quizzesTagsArray.push(...element.tags.split(" "));
})
console.log(quizzesTagsArray);
console.log(quizzesInfo);
// console.log(usersInfoObject);
// console.log(searchInput);

searchInput.addEventListener("keyup", (e) => {
    
    if (searchInput.value){
        suggestionsBox.classList.add("active");

        html_search = "";

        nameSuggestionsArray = usersInfoObject.name.filter((name) => {
            // console.log(name);
            return name.toLocaleLowerCase().startsWith(searchInput.value.toLocaleLowerCase());
        });
        
        nameSuggestionsArray.forEach((element) => {
            usersInfo.forEach((e, i) => {
                if (e.name == element && e.name != usersName){
                    html_search += `<li><a href="/user?username=${e.username}"><div>
                    <h4>${element}</h4>
                    <p>@${e.username}</p>
                    </div></a></li>`;
                }
            })
        })
        console.log(nameSuggestionsArray);
        usernameSuggestionsArray = usersInfoObject.username.filter((username) => {
            // console.log(username);
            return (username.toLocaleLowerCase().startsWith(searchInput.value.toLocaleLowerCase()))// && username in nameSuggestionsArray);
        });

        usernameSuggestionsArray.forEach((element) => {
            usersInfo.forEach((e, i) => {
                if (e.username == element && !(nameSuggestionsArray.includes(e.name)) && e.username != username){
                    // console.log(!(e.name in nameSuggestionsArray));
                    html_search += `<li><a href="/user?username=${element}"><div>
                    <h4>${e.name}</h4>
                    <p>@${element}</p>
                    </div></a></li>`;
                }
            })
        })

        quizSuggestionsArray = quizzesInfoArray.filter((quizName) => {
            // console.log(quizName);
            return quizName.toLocaleLowerCase().startsWith(searchInput.value.toLocaleLowerCase());
        });

        quizSuggestionsArray.forEach((element) => {
            quizzesInfo.forEach((e, i) => {
                if (e.quizName == element){
                    console.log(e);
                    html_search += `<li><a href="/quiz?quizCode=${e.quizCode}"><div>
                    <h4>Quiz: ${e.quizName}</h4>
                    </div></a></li>`;
                }
            })
        })

        tagsSuggestionsArray = quizzesTagsArray.filter((tag) => {
            // console.log(quizName);
            return tag.toLocaleLowerCase().startsWith(searchInput.value.toLocaleLowerCase());
        });

        tagsSuggestionsArray.forEach((element) => {
            quizzesInfo.forEach((e, i) => {
                if (e.tags.split(" ").includes(element)){
                    console.log(e);
                    html_search += `<li><a href="/quiz?quizCode=${e.quizCode}"><div>
                    <h4>Quiz: ${e.quizName}</h4>
                    </div></a></li>`;
                }
            })
        })

        // console.log(suggestionsArray);
        console.log(html_search);
        suggestionsList.innerHTML = html_search;
    }
    else{
        suggestionsBox.classList.remove("active");
    }
    
})

document.addEventListener('click', function(event) {
    clickedOutsideSearchBar = !searchBar.contains(event.target);
    
    if (clickedOutsideSearchBar){
        suggestionsBox.classList.remove("active");
        
    }
  });
  