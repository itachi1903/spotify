let left = document.querySelector(".left");

document.querySelector(".open-btn").addEventListener("click",()=>{
    left.style.left="0";
});
document.querySelector(".close-btn").addEventListener("click" , ()=>{
    left.style.left="-100%";
})
document.getElementById("fullscreen").addEventListener("click" , ()=>{
    document.getElementById("fullscreen").style.display = "none";
    document.getElementById("closesreen").style.display = "block";
    document.querySelector(".playlistimg-can").style.display ="block";
})
document.getElementById("closesreen").addEventListener("click" , ()=>{
    document.getElementById("fullscreen").style.display = "block";
    document.getElementById("closesreen").style.display = "none";
    document.querySelector(".playlistimg-can").style.display ="none";
})

let percent = document.querySelector(".percent");
navigator.getBattery().then(battery =>{
    percent.innerHTML = Math.floor((battery.level)*100)+"%";
})