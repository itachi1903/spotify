var currentSong = new Audio();
var currentFolder;
var songul;
let songs;
var spotifyPlaylist = document.querySelector(".spotifyPlaylist");
async function getdata(folder) {
    currentFolder = folder;
    let data = await fetch(`https://itachi1903.github.io/spotify/${folder}/`);
    let response = await data.text()
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    songs = [];

    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }
    songul = document.querySelector(".libary");
    songul.innerHTML = "";
    for (const song of songs) {
        songul.innerHTML = songul.innerHTML + `<li>
       <div>
           <img src="images/music.svg" alt="music" class="invert">
           <div class="Songname">
               <h6>${song}</h6>
               <h6>song Artist</h6>
           </div>
       </div>
       <div>
           <img src="images/play.svg" alt="play" class="invert icon">
       </div>
   </li>`
    }
    Array.from(document.querySelector(".libary").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", () => {
            PlaySong(e.querySelector(".Songname").querySelector("h6").innerHTML.trim());
            document.getElementById("play").src = "images/pause.svg";
        })
    })
    return songs;
}
function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return '00:00'; // Handle invalid input
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}
function PlaySong(track, pause = false) {
    currentSong.src = `${currentFolder}/` + track;
    if (!pause) {
        currentSong.play();
    }
    document.querySelector(".trankName").innerHTML = decodeURI(track);
}

async function displayAlbum() {
    let data = await fetch("/songs/");
    let response = await data.text()
    let div = document.createElement("div");
    div.innerHTML = response;
    let AlbumsSrc = div.getElementsByTagName("a");
    let album = [];
    let albumli = Array.from(AlbumsSrc)
    for (let index = 0; index < albumli.length; index++) {
        const e = albumli[index];

        if (e.href.includes("/songs")) {
            let folderName = e.href.split("/").slice(-2)[0]
            let data = await fetch(`https://itachi1903.github.io/spotify/${folderName}/info.json`);
            let response = await data.json();
            spotifyPlaylist.innerHTML = spotifyPlaylist.innerHTML + `<div data-folder="${folderName}" class="playlist rounded">
            <img src="images/play-button.png" alt="spotify" class="play">
            <div class="thumbmail-can">
                <img src="songs/${folderName}/${response.cover}"
                    alt="thumbmail" class="rounded border playlistthumbmail">
                <img src="images/spotify.png" alt="spotify" class="spotify">
            </div>
            <div>
                <h1 class="playlist-name">${response.title}</h1>
                <h2 class="playlist-des">${response.description}</h2>
            </div>
        </div>`
        }
        
    }

    Array.from(document.getElementsByClassName("playlist")).forEach(e => {
        e.addEventListener("click", async item => {
            songs = await getdata(`songs/${item.currentTarget.dataset.folder}`);
            PlaySong(songs[0]);
        })
    })
}

(async function main() {

    await getdata(`songs/normal`);
    PlaySong(songs[0], true);

    displayAlbum();

    document.getElementById("play").addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            document.getElementById("play").src = "images/pause.svg";
        } else {
            currentSong.pause();
            document.getElementById("play").src = "images/play.svg";
        }
    })

    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".timeReamin").innerHTML = `${formatTime(currentSong.currentTime)} / ${formatTime(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })
    document.querySelector(".progressBar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%"
        currentSong.currentTime = (currentSong.duration * percent) / 100;
        
    });
    document.getElementById("perv").addEventListener("click", () => {
        let index = songs.indexOf(currentSong.src.split('/').slice(-1)[0])
        if ((index - 1) >= 0) {
            PlaySong(songs[index - 1]);
            document.getElementById("play").src = "images/pause.svg";
        }
    })
    document.getElementById("next").addEventListener("click", () => {
        let index = songs.indexOf(currentSong.src.split('/').slice(-1)[0]);
        if ((index + 1) <= songs.length - 1) {
            PlaySong(songs[index + 1]);
            document.getElementById("play").src = "images/pause.svg";
        }
    })
    document.getElementById("range").addEventListener("change", e => {

        currentSong.volume = parseInt(e.target.value) / 100;
        if (currentSong.volume > 0) {
            document.querySelector(".volume").src = document.querySelector(".volume").src.replace("volumeoff.svg" , "volume.svg");
        }
    })
    document.querySelector(".volume").addEventListener("click", e=>{
        if (e.target.src.includes("volume.svg")) {
            e.target.src = e.target.src.replace("volume.svg" , "volumeoff.svg")
            currentSong.volume = 0;
            document.getElementById("range").value = 0
        }else {
            e.target.src = e.target.src.replace("volumeoff.svg" , "volume.svg")
            currentSong.volume = 0.5;
            document.getElementById("range").value = 50;
        }
    })




})()
