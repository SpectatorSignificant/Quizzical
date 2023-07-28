const usernameInput = document.querySelector("#username");

let characters = 'abcdefghijklmnopqrstuvwxyz0123456789._';

usernameInput.addEventListener("input", (e) => {
    e.target.value.split("").forEach((char) => {
        if (!characters.includes(char)){
            alert("Username can contain only lowercase letters, numbers, dots (.), and underscores (_)");
            location.reload();
        } 
    })
})