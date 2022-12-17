document.getElementById("rl").innerHTML = timeToString();

var input = document.getElementById("inputText");
input.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        //event.preventDefault();
        document.getElementById("myBtn").click();
    }
});

function checkAmPm(hour, minute){
    if(hour >= 0 && hour < 12 ){
        return "AM";
    }
    else if(hour === 12 && minute === 0){
        return "AM";
    }
    else
        return "PM";
}

function timeToString(){
    var dateTime = new Date();
    var hour = dateTime.getHours() < 10 ? ("0" + dateTime.getHours()) : dateTime.getHours();
    var minute = dateTime.getMinutes();
    var time = `${hour}:${minute} ${checkAmPm(parseInt(hour), minute)}`;
    return time;
}

function pushUserMess(mess){
    //create div new userMessage
    var userMessage = document.createElement("div");
    var userMessage_child = document.createElement("div");
    var userMessage_text = document.createElement("div");

    userMessage.className = "userMessage";
    userMessage_child.className = "userMessage_child";
    userMessage_text.className = "userMessage_child--text";
    
    //create p and append p
    var para = document.createElement("p");
    para.innerHTML = mess;
    userMessage_text.appendChild(para);

    //create small append small, userMessage_child
    var small = document.createElement("small");
    small.innerHTML = timeToString();
    userMessage_child.appendChild(small);
    userMessage_child.appendChild(userMessage_text);

    //append userMessage_child
    userMessage.appendChild(userMessage_child);
    document.getElementById("cbMain").appendChild(userMessage);
}

function pushBotMess(mess){
    //create div new botMessage
    var botMessage = document.createElement("div");
    var botMessage_child = document.createElement("div");
    var botMessage_text = document.createElement("div");
    
    botMessage.className = "botMessage";
    botMessage_child.className = "botMessage_child";
    botMessage_text.className = "botMessage_child--text";

    //create and append p (message bot)
    var para = document.createElement("p");
    para.innerHTML = mess;
    botMessage_text.appendChild(para);

    //create small and append small, botMessage_text
    var small = document.createElement("small");
    small.innerHTML = timeToString();
    botMessage_child.appendChild(small);
    botMessage_child.appendChild(botMessage_text);
    
    //create img and append img, botMessage_child
    var ava = document.createElement("img");
    ava.src = "../static/image/ava-3.png"
    botMessage.appendChild(ava);
    botMessage.appendChild(botMessage_child);
    document.getElementById("cbMain").appendChild(botMessage);
}

function myFunction(){
    var mess = document.getElementById("inputText").value;
    document.getElementById("inputText").value = '';
    pushUserMess(mess);
    
    const request = new XMLHttpRequest()
    request.open('POST', `/alo/${mess}`)
    request.onload = () =>{
        const flaskMessage = request.responseText;
        setTimeout(pushBotMess(flaskMessage), 5000);
        document.getElementById("cbMain").scrollTop = 10000;
    }
    request.send()
}