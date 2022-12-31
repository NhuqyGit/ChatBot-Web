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
    document.getElementById("cbMain").scrollTop = 10000;
}

function pushBotMess(mess, task){
    //create div new botMessage
    var botMessage = document.createElement("div");
    var botMessage_child = document.createElement("div");
    var botMessage_text = document.createElement("div");
    
    botMessage.className = "botMessage";
    botMessage_child.className = "botMessage_child";
    botMessage_text.className = "botMessage_child--text";

    //create and append p (message bot)
    if(task === "sing"){
        var audio = document.createElement("AUDIO");
        audio.setAttribute("src","../static/image/"+ mess);
        audio.setAttribute("controls", "controls");
        botMessage_text.appendChild(audio);
    }
    else{
        var para = document.createElement("p")
        para.innerHTML = mess;
        botMessage_text.appendChild(para);
    }

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
    document.getElementById("cbMain").scrollTop = 10000;
}

function handleData(data){
    let city = data['name'];
    let temp = Math.round(data['main'].temp - 273.15);
    return `Weather in ${city}<br>Temparature: ${temp}oC`;
}

function myFunction(){
    var mess = document.getElementById("inputText").value;
    document.getElementById("inputText").value = '';
    pushUserMess(mess);
    
    const request = new XMLHttpRequest()
    request.open('POST', `/alo/${mess}`)
    request.onload = () =>{
        const flaskMessage = request.responseText;
        console.log(flaskMessage);
        if(mess.includes("weather")){
            setTimeout(pushBotMess, 1000, flaskMessage, "text");
            const endpoint = `https://api.openweathermap.org/data/2.5/weather?q=Ho Chi Minh&appid=4fc232c1cf9c734431b578af2dce0126`;
            fetch(endpoint)
            .then((response)=> response.json())
            .then((data) => setTimeout(pushBotMess, 2000, handleData(data), "text"));
        }
        else if(mess.includes("search")){
            var query = mess.split('search')
            setTimeout(pushBotMess, 500, flaskMessage, "text");
            setTimeout(pushBotMess, 1500, "Done", "text");
            setTimeout(()=>{window.open(`https://www.google.com/search?q=${query[query.length - 1]}`);}, 2500);
        }
        else if(mess.includes("sing")){
            setTimeout(pushBotMess, 1500, flaskMessage, "sing");
        }
        else{
            setTimeout(pushBotMess, 1500, flaskMessage, "text");
        }
    }
    request.send()
}