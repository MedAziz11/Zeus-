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
