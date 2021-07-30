const remote = require('electron').remote
const {ipcRenderer} = require("electron");


// close the app functionality
document.getElementById("exit").addEventListener("click", function() {
    let window = remote.getCurrentWindow()
    window.close();
  })

  // close the app functionality
document.getElementById("reduce").addEventListener("click", function() {
    let window = remote.getCurrentWindow()
    window.minimize();
  })

// generate the lyrics and connect main to renderer
document.getElementById("generate").addEventListener("click", function() {
    ipcRenderer.send("song_name", document.getElementById("song").value);
    ipcRenderer.on("song_obj", async (event, data) => {
        let song = await data;
        let lyrics  = song.lyrics.split(",")
        let  array = song.title.split("by")

        if( array.length == 2) { 
            document.getElementById("title").innerHTML = array[0]+"<br>"+array[1].slice(1);
        }

        document.querySelector('.loader').classList.add('hidden');

        document.getElementById("lyrics-text").innerHTML = lyrics.join("<br/>");

        document.getElementById("song-img").src = song.image;

    })
});

function validYtbUrl(url) {
    const valid = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
    if (url.value.match(valid)) {
        urlInput.focus();
        return true;
    }
    else {
        urlInput.focus();
        return false;
    }
}

downloadbtn.addEventListener('click', () => {
    if (!validYtbUrl(urlInput)) {
        errMsg.classList.remove("hidden")
        btnsContainer.style.padding = '1.2em 0'
        return;
    } else {
        errMsg.classList.add("hidden")
        btnsContainer.style.padding = '1.8em 0'
        let url = document.getElementById("song").value;

        let video_id = url.split("v=")[1]
        
        let ampersandPosition = video_id.indexOf('&');

        if(ampersandPosition != -1) {
            video_id = video_id.substring(0, ampersandPosition);
        }
        console.log(video_id);
        ipcRenderer.send("song_id", video_id);
    }
})