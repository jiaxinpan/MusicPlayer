var audio = document.getElementById("myAudio");
var controlPanel = document.getElementById("controlPanel");
var btnArea = document.getElementById("btnArea");
var info = document.getElementById("info");
var setVolValue = document.getElementById("setVolValue");
var volValue = document.getElementById("volValue");
var progress = document.getElementById("progress");
var music = document.getElementById("music");
var book = document.getElementById("book");

console.log(btnArea.children[6]);

let btnPlay = btnArea.children[0];
let btnMuted = btnArea.children[6];

function showBook() {
    book.className = book.className == "" ? "hide" : "";
}

var option;
for (var i = 0; i < book.children[0].children.length; i++) {
    book.children[0].children[i].draggable = "true";
    book.children[0].children[i].id = "song" + i;

    book.children[0].children[i].ondragstart = drag;

    option = document.createElement("option");

    option.value = book.children[0].children[i].title;
    option.innerText = book.children[0].children[i].innerText;
    music.appendChild(option);
}
changeMusic(0);

function updateMusic() {

    for (var i = music.children.length - 1; i >= 0; i--) {
        music.remove(i);
    }

    for (var i = 0; i < book.children[1].children.length; i++) {

        option = document.createElement("option");

        option.value = book.children[1].children[i].title;
        option.innerText = book.children[1].children[i].innerText;
        music.appendChild(option);
    }  
    changeMusic(0);
}

function allowDrop(ev) {
    ev.preventDefault(); 
}

function drag(ev) {
    ev.dataTransfer.setData("aaa", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("aaa");

    if (ev.target.id == "")
        ev.target.appendChild(document.getElementById(data));
    else
        ev.target.parentNode.appendChild(document.getElementById(data));
}

function setLoop() {
    info.children[2].innerText = info.children[2].innerText == "On Repeat" ? "Normal" : "On Repeat";
}

function setRandom() {
    info.children[2].innerText = info.children[2].innerText == "Shuffle Playlist" ? "Normal" : "Shuffle Playlist";
}

function setAllLoop() {
    info.children[2].innerText = info.children[2].innerText == "Loop Playlist" ? "Normal" : "Loop Playlist";
}

function changeMusic(i) {

    audio.children[0].src = music.options[music.selectedIndex + i].value;
    audio.children[0].title = music.options[music.selectedIndex + i].innerText;
    music.options[music.selectedIndex + i].selected = true;
    audio.load();

    if (btnPlay.innerText == "pause_circle")
        playAudio();
}

function setProgressBar() {
    audio.currentTime = progress.value;
}

var min = 0, sec = 0;
function getTimeFormat(timeSec) {

    min = parseInt(timeSec / 60);
    sec = parseInt(timeSec % 60);
    min = min < 10 ? "0" + min : min;
    sec = sec < 10 ? "0" + sec : sec;

    return min + ":" + sec;
}

var w = 0;
var r = 0; 
getDuration();
function getDuration() {
    info.children[1].innerText = getTimeFormat(audio.currentTime) + " / " + getTimeFormat(audio.duration);

    w = audio.currentTime / audio.duration * 100;
    console.log(w);
    progress.style.backgroundImage = "-webkit-linear-gradient(left,#ff74A4,#9f6ea3 " + w + "%, #ffffff " + w + "%, #ffffff)";
    progress.max = parseInt(audio.duration);
    progress.value = parseInt(audio.currentTime);

    if (audio.currentTime == audio.duration) {

        console.log(info.children[2].innerText == "On Repeat");
        if (info.children[2].innerText == "On Repeat")
            changeMusic(0);

        else if (info.children[2].innerText == "Shuffle Playlist") {
            
            r = Math.floor(Math.random() * music.options.length);
            console.log("r=" + r);
            r = r - music.selectedIndex;

            changeMusic(r);
        }
        
        else if (music.selectedIndex == music.options.length - 1) {
            if (info.children[2].innerText == "Loop Playlist")
                changeMusic(-music.selectedIndex);
            else
                stopAudio();
        }

        else
            changeMusic(1);
    }

    setTimeout(getDuration, 50);
}

function setVolume() {
    volValue.value = setVolValue.value;
    audio.volume = setVolValue.value / 100;
    setVolValue.style.backgroundImage = "-webkit-linear-gradient(left,#FF95CA,#F00078 " + setVolValue.value + "%, #c8c8c8 " + setVolValue.value + "% ,#ffffff)";
}

function btnSetVolume(vol) {
    setVolValue.value = parseInt(volValue.value) + vol;
    setVolume();
}

setVolume();
function setMuted() {
    audio.muted = !audio.muted;
    btnMuted.innerText = audio.muted ? "volume_off" : "volume_up";
}

function changeTime(sec) {
    audio.currentTime += sec;
}

function playAudio() {
    audio.play();
    btnPlay.innerText = "pause_circle";
    btnPlay.onclick = pauseAudio;
    info.children[0].innerText = "Now Playing ： " + audio.children[0].title;
}

function pauseAudio() {
    audio.pause();
    btnPlay.innerText = "play_circle";
    btnPlay.onclick = playAudio;
    info.children[0].innerText = "Pause Music";
}

function stopAudio() {
    pauseAudio();
    audio.currentTime = 0;
    info.children[0].innerText = "Stop Music";
}