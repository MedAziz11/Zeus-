const { app, BrowserWindow, ipcMain } = require("electron");

const lyricsFinder = require("lyrics-finder");
const song = require("@allvaa/get-lyrics");

let mainWindow;

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 970,
    height: 800,
    resizable:false,
    frame:false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule:true,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile("src/index.html");

  // Emitted when the window is closed.
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}


app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", function () {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", function () {
  if (mainWindow === null) {
    createWindow();
  }
});

//get lyrics functionality
async function getLyrics(artist, title) {
  let lyrics = await lyricsFinder(artist, title) || "Not Found!";
  return lyrics;
};

async function searchSong (title)  {
  let result = await song(title) ;

  if (result.lyrics == ""){
      result["lyrics"] = await getLyrics("", title);
  }

  return result
}

//the connection between the main process and renderer process
ipcMain.on("song_name",async (event, data) => {
    let song = await searchSong(data);

    event.sender.send("song_obj", song)
    //taking shape jaden bojsen
  
}); 

