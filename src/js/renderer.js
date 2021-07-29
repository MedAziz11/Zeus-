// close the app functionality
document.getElementById("exit").addEventListener("click", function() {
    const remote = require('electron').remote
    let window = remote.getCurrentWindow()
    window.close()
  })

// generate the lyrics and connect main to renderer
document.getElementById("generate").addEventListener("click", function() {
    const {ipcRenderer} = require("electron");
    ipcRenderer.send("song_name", document.getElementById("song").value);
    ipcRenderer.on("lyrics", async (event, data) => {
        document.getElementById("lyrics-text").innerHTML =await data;
    })
});
