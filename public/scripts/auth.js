const usernameInput = document.querySelector("input[name='username']");

let characters = 'abcdefghijklmnopqrstuvwxyz0123456789._';

document.addEventListener("input", (e) => {
    e.target.value.split("").forEach((char) => {
        if (!characters.includes(char)){
            alert("Username can contain only lowercase letter, dots (.), and underscores (_)");
            location.reload();
        } 
    })
})