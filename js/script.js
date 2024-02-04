console.log("hello  world ");
let currentsong  =  new Audio();
let songs;
let currFolder;

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder){
    currFolder = folder;
    let  a = await fetch(`http://127.0.0.1:5500/${folder}/`);
    let response  = await a.text();
    // console.log(response);
    let div  =  document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    // console.log(as)
    songs  = [];
    for (let i = 0; i < as.length; i++) {
        const element = as[i];
        if(element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1]);
        }
        
    }
    let SongUl = document.querySelector(".songlist").getElementsByTagName("ul")[0];
    SongUl.innerHTML = ""
    for (const song of songs) {
        SongUl.innerHTML  = SongUl.innerHTML + `<li><img class="invert"  src= "../img/music.svg" alt="">
        <div class="info">
            <div>${song.replaceAll("%20" , " ")}</div>
            <div>Aadiix</div>
        </div>
        <div class="playnow">
            <span>Play Now</span>
            <img class="invert" src="../img/play.svg" alt="">
        </div> </li>`;
    }

     // attaching an  eventlistener to each song in your library
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click" , element=> {
            console.log(e.querySelector(".info").firstElementChild.innerHTML)   
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    })

    return songs;
} 

const playMusic  = (track , pause = false)=> {
    // let audio =  new Audio("/songs/" + track)
    currentsong.src = `/${currFolder}/` + track
    if(!pause) {
        currentsong.play()
        play.src= "../img/pause.svg"

    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML =" 00:00 / 00 : 00"
}

async function displayAlbums(){
    let  a = await fetch(`http://127.0.0.1:5500/songs/`);
    let response  = await a.text();
    let div  =  document.createElement("div")
    div.innerHTML = response;
    let anchors  = div.getElementsByTagName("a")
    let cardContainer = document.querySelector(".cardContainer")
    let array = Array.from(anchors)   
        for (let index = 0; index < array.length; index++) {
            const e = array[index];   
        if(e.href.includes("/songs/")){
            let folder = e.href.split("/").slice(-1)[0]
            //get the metadata of the folder 
            let  a = await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`);
            let response  = await a.json();
            // console.log(response)
            cardContainer.innerHTML  = cardContainer.innerHTML + `  <div data-folder="${folder}" class="card">
            <div class="play">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z"
                        stroke="#141B34" stroke-width="1.5" stroke-linejoin="round"/>
                </svg>
            </div>
            <img src="/songs/${folder}/cover.jpg" alt="">
            <h2>${response.title}</h2>
            <p>${response.description}</p>
        </div>`


        }
    }

     //loading the playlist whenever card is clicked 
     Array.from(document.getElementsByClassName("card")).forEach(e=>{
        e.addEventListener("click", async item=>{
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
            playMusic(songs[0])
        })
    })
   
    
}




async function main() {
    
    //getting the list of the all the songs
    await getSongs("songs/ncs");
    playMusic(songs[0], true)


    // console.log(songs);
    /// display all the albums on the page 
    // await displayAlbums()
    /// display all the albums on the page 
    await displayAlbums();



    //attaching an  eventlistener to play , previous and next buttons
    play.addEventListener("click" , ()=>{
        if(currentsong.paused) {
            currentsong.play();
            play.src= "../img/pause.svg"
        }
        else {
            currentsong.pause()
            play.src= "../img/play.svg"

        }
    })

    ///listen for time update events 
    currentsong.addEventListener("timeupdate" , ()=>{
        // console.log(currentsong.currentTime , currentsong.duration)
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentsong.currentTime)} - ${secondsToMinutesSeconds(currentsong.duration)}`
        document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%"

    })

    //add an eventlistener to  a seekbar 
    document.querySelector(".seekbar").addEventListener("click" , e=> {
        let percent = (e.offsetX/e.target  .getBoundingClientRect().width)* 100;
        document.querySelector(".circle").style.left =  percent + "%"
        currentsong.currentTime =  ((currentsong.duration)* percent)/100
        
    })

    //adding eventlistener to a  hamburger
    document.querySelector(".hamburger").addEventListener("click" , ()=>{
        document.querySelector(".left").style.left = "0"
    })
    //adding eventlistener to a  close button
    document.querySelector(".close").addEventListener("click" , ()=>{
        document.querySelector(".left").style.left = "-120%"
    })

    // adding a  eventlistener to the previous button
    previous.addEventListener("click", ()=> {
        currentsong.pause();

        let index  =  songs.indexOf(currentsong.src.split("/").slice(-1) [0])
        if(index-1>= 0) {
            playMusic(songs[index - 1])
        }
    })
    // adding a  eventlistener to the next button
    next.addEventListener("click", ()=> {
        currentsong.pause();
        let index  =  songs.indexOf(currentsong.src.split("/").slice(-1) [0])
        if(index+1 < songs.length) {
            playMusic(songs[index + 1])
        }
    })

    //addinmg an  a event to a volume 
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change" ,(e)=> { 
           currentsong.volume = parseInt(e.target.value)/100
    })

    //addding eventlistener to mute track volume button
    document.querySelector(".volume>img").addEventListener("click" , e=>{
        if(e.target.src.includes("volume.svg")){
            e.target.src = e.target.src.replace("volume.svg", "mute.svg")
            currentsong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;

        }
        else {
            e.target.src = e.target.src.replace("mute.svg" ,"volume.svg")
            currentsong.volume = .10;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
        }
    })

   
}


main();
