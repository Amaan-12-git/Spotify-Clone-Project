let currentSong = new Audio();
let songs2 = [];
let folder_array = [];
let prev_volume;
const displayAlbum = async () => {
  let data = await fetch("http://127.0.0.1:5500/Albums");
  let response = await data.text();
  let div = document.createElement("div"); 
  div.innerHTML = response;
  let anchors = div.getElementsByTagName("a");
  anchors = Array.from(anchors);
  folder_array = [];
  for (let index = 0; index < anchors.length; index++) {
    const e = anchors[index];
    if (e.href.includes("/Albums/")) {
      let folder = e.href.split("/Albums/")[1];
      folder_array.push(folder);
      let json_file = await fetch(
        `http://127.0.0.1:5500/Albums/${folder}/text.json`
      );
      let result_json = await json_file.json();
      let cardcontainer = document.querySelector(".cardcontainer");
      cardcontainer.innerHTML =
        cardcontainer.innerHTML +
        `<div class="card">
        <img src="http://127.0.0.1:5500/Albums/${folder}/cover.jpg" alt="Cover" width="180" height="190">
        <div class="play-icon">
            <img src="svgs/play.svg" alt="play">
        </div>
        <h3>${result_json.title}</h3>
        <p>${result_json.desc}</p>
    </div>`;
    }
  }
  let index = 0;
  let card = Array.from(document.getElementsByClassName("card"));
  card.forEach((e) => {
    
    e.addEventListener("click", async () => {
      displaysongs(e);
    });
    index++;
  });
};
const displaysongs = async (e) => {
  let div = document.createElement("div");
  div.innerHTML = e;
  let arr = e.getElementsByTagName("img")[0].src.split("/");
  let card_name;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] == "Albums") {
      card_name = arr[i + 1];
      break;
    }
  }
  let songsUL = await fetch(`http://127.0.0.1:5500/Albums/${card_name}`);
  let songs_text = await songsUL.text();
  let songs_div = document.createElement("div");
  songs_div.innerHTML = songs_text;
  let songcontainer = document.querySelector(".songcontainer");
  songcontainer.innerHTML = "";
  let anchors = Array.from(songs_div.getElementsByTagName("a"));
  songs2 = [];
  for (let index = 0; index < anchors.length; index++) {
    const e = anchors[index];
    if (e.href.endsWith(".mp3")) {
        songs2.push(e.href.split(`${card_name}/`)[1]);
      let songs_name = e.href.split(`${card_name}/`)[1];
      songcontainer.innerHTML =
        songcontainer.innerHTML +
        `<div class="songs flex">
            <img style="filter: invert(1);" src="svgs/music.svg" alt="music" width="24" height="60">
            <p id="text">${decodeURIComponent(songs_name)}</p>
            <p>Play Now</p><img style="filter: invert(1);" src="svgs/playsongs.svg" alt="play" width="24" height="24">
        </div>`;
    }
  }
  let songs = Array.from(document.getElementsByClassName("songs"));
  let song_ul =
    `http://127.0.0.1:5500/Albums/${card_name}/` +
    songs[0].getElementsByTagName("p")[0].innerHTML;
  currentSong.src = song_ul;
  document.querySelector(".songname").innerHTML = decodeURIComponent(songs[0].getElementsByTagName("p")[0].innerHTML);
  playAudio();
  songs.forEach((e) => {
    e.addEventListener("click", async () => {
      song_ul =
        `http://127.0.0.1:5500/Albums/${card_name}/` +
        e.getElementsByTagName("p")[0].innerHTML;
      currentSong.src = song_ul;
      document.querySelector(".songname").innerHTML = decodeURIComponent(e.getElementsByTagName("p")[0].innerHTML);
      playAudio();
    });
  });
};
const playAudio = async (pause = false) => {
  let img = document.querySelector(".button");
  if (pause) {
    currentSong.pause();
    img.getElementsByTagName("img")[1].src = "svgs/playsongs.svg";
  } else {
    currentSong.play();
    img.getElementsByTagName("img")[1].src = "svgs/pause.svg";
  }
};
const sec_to_min = (time)=>{
    if (isNaN(time) || time < 0) {
        return "00:00";
    }
    time = Number.parseInt(time);
    let sec = time%60;
    let min = time/60;
    min = Math.floor(min);
    if(sec<10)
    sec = "0" + sec;
    if(min<10)
    min = "0" + min;
    return min+":"+sec; 
}
const display_folder =  async (card_name) =>{
  let songsUL = await fetch(`http://127.0.0.1:5500/Albums/${card_name}`);
  let songs_text = await songsUL.text();
  let songs_div = document.createElement("div");
  songs_div.innerHTML = songs_text;
  let songcontainer = document.querySelector(".songcontainer");
  songcontainer.innerHTML = "";
  let anchors = Array.from(songs_div.getElementsByTagName("a"));
  songs2 = [];
  for (let index = 0; index < anchors.length; index++) {
    const e = anchors[index];
    if (e.href.endsWith(".mp3")) {
        songs2.push(e.href.split(`${card_name}/`)[1]);
      let songs_name = e.href.split(`${card_name}/`)[1];
      songcontainer.innerHTML =
        songcontainer.innerHTML +
        `<div class="songs flex">
            <img style="filter: invert(1);" src="svgs/music.svg" alt="music" width="24" height="60">
            <p id="text">${decodeURIComponent(songs_name)}</p>
            <p>Play Now</p><img style="filter: invert(1);" src="svgs/playsongs.svg" alt="play" width="24" height="24">
        </div>`;
    }
  }
  let songs = Array.from(document.getElementsByClassName("songs"));
  let song_ul =
    `http://127.0.0.1:5500/Albums/${card_name}/` +
    songs[0].getElementsByTagName("p")[0].innerHTML;
  currentSong.src = song_ul;
  document.querySelector(".songname").innerHTML = decodeURIComponent(songs[0].getElementsByTagName("p")[0].innerHTML);
  playAudio();
  songs.forEach((e) => {
    e.addEventListener("click", async () => {
      song_ul =
        `http://127.0.0.1:5500/Albums/${card_name}/` +
        e.getElementsByTagName("p")[0].innerHTML;
      currentSong.src = song_ul;
      document.querySelector(".songname").innerHTML = decodeURIComponent(e.getElementsByTagName("p")[0].innerHTML);
      playAudio();
    });
  });
}
const main = async () => {
  await displayAlbum();
  console.log(folder_array)
  document.querySelector(".button").getElementsByTagName("img")[1].addEventListener("click", () => {
      if (currentSong.paused) playAudio();
      else playAudio(true);
    });
    currentSong.addEventListener("timeupdate", ()=>{
        document.querySelector(".time").innerHTML = `${sec_to_min(currentSong.currentTime)}/${sec_to_min(currentSong.duration)}`;
        if(currentSong.currentTime == currentSong.duration)
        {
          let index = songs2.indexOf(currentSong.src.split("/").slice(-1)[0]);
        if(index+1<songs2.length)
        {
            currentSong.src = currentSong.src.replace(songs2[index],songs2[index+1]);
            document.querySelector(".songname").innerHTML = decodeURIComponent(songs2[index+1]);
            playAudio();
        }
        else
        {
          let folder_index = folder_array.indexOf(currentSong.src.split("/").slice(-2)[0]);
          if(folder_index+1<folder_array.length){
          let folder_name = folder_array[folder_index+1];
          display_folder(folder_name);
          }
          else{
            playAudio(true);
          }
        }
        }
        document.getElementsByClassName("circle")[0].style.left = (currentSong.currentTime/currentSong.duration)*100+ "%";
    })
    document.getElementsByClassName("seekbar")[0].addEventListener("click",(e)=>{
        let percent = (e.offsetX/e.target.getBoundingClientRect().width)*100;
        currentSong.currentTime = (percent*currentSong.duration)/100;
        document.getElementsByClassName("circle")[0].style.left = percent + "%";
    })
    document.querySelector(".button").getElementsByTagName("img")[2].addEventListener("click", ()=>{
        let index = songs2.indexOf(currentSong.src.split("/").slice(-1)[0]);
        if(index+1<songs2.length)
        {
            currentSong.src = currentSong.src.replace(songs2[index],songs2[index+1]);
            document.querySelector(".songname").innerHTML = decodeURIComponent(songs2[index+1]);
            playAudio();
        }
    })
    document.querySelector(".button").getElementsByTagName("img")[0].addEventListener("click", ()=>{
        let index = songs2.indexOf(currentSong.src.split("/").slice(-1)[0]);
        if(index-1>=0)
        {
            currentSong.src = currentSong.src.replace(songs2[index],songs2[index-1]);
            document.querySelector(".songname").innerHTML = decodeURIComponent(songs2[index-1]);
            playAudio();
        }
    })
    document.querySelector(".volumeseekbar").getElementsByTagName("input")[0].value = 30;
    currentSong.volume = 0.3;
    document.querySelector(".volumeseekbar").getElementsByTagName("input")[0].addEventListener("click",(e)=>{
        currentSong.volume = (e.target.value)/100;
        if(e.target.value==0)
        {
            document.querySelector(".volumeseekbar").getElementsByTagName("img")[0].src = "svgs/mute.svg";
        }
        else{
            document.querySelector(".volumeseekbar").getElementsByTagName("img")[0].src = "svgs/volume.svg";
        }
    })
    document.querySelector(".volumeseekbar").getElementsByTagName("img")[0].addEventListener("click",(e)=>{
        if(currentSong.volume>0)
        {
            prev_volume = currentSong.volume;
            currentSong.volume = 0;
            document.querySelector(".volumeseekbar").getElementsByTagName("img")[0].src = "svgs/mute.svg";
            document.querySelector(".volumeseekbar").getElementsByTagName("input")[0].value = 0;
        }
        else{
            currentSong.volume = prev_volume;
            document.querySelector(".volumeseekbar").getElementsByTagName("img")[0].src = "svgs/volume.svg";
            document.querySelector(".volumeseekbar").getElementsByTagName("input")[0].value = prev_volume*100;
        }
    })
    document.querySelector(".hamburger").addEventListener("click",()=>{
      document.querySelector(".left").style.left = 0+"%";
    })
    document.querySelector(".cross").addEventListener("click",()=>{
      document.querySelector(".left").style.left = -130+"%";
    })
    document.querySelector(".less").addEventListener("click", ()=>{
      let folder_index = folder_array.indexOf(currentSong.src.split("/").slice(-2)[0]);
      if(folder_index-1>=0){
      let folder_name = folder_array[folder_index-1];
      display_folder(folder_name);
    }
    })
    document.querySelector(".greater").addEventListener("click", ()=>{
      let folder_index = folder_array.indexOf(currentSong.src.split("/").slice(-2)[0]);
      if(folder_index+1<folder_array.length){
      let folder_name = folder_array[folder_index+1];
      display_folder(folder_name);
    }
    })
};
main();
