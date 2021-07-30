const { app, BrowserWindow, ipcMain } = require("electron");

const lyricsFinder = require("lyrics-finder");
const song = require("@allvaa/get-lyrics");

const fs = require("fs-extra"),
  youtube = require("ytdl-core"),
  ffmpeg = require("fluent-ffmpeg"),
  ID3 = require("node-id3")

let mainWindow;

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 970,
    height: 800,
    // resizable: false,
    minHeight: 783,
    minWidth: 807,
    maxHeight: 900,
    maxWidth: 1316,
    frame: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
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
  let lyrics = (await lyricsFinder(artist, title)) || "Not Found!";
  return lyrics;
}

async function searchSong(title) {
  let failed = {
    title: "",
    image: "",
    lyrics: "Not Found !! ",
  };
  let result = await song(title);

  if (result == undefined) return failed;

  if (result.lyrics == "") {
    result["lyrics"] = await getLyrics("", result.title);
  }
  {
    result["lyrics"] = result.lyrics.replace(/\n/g, "<br>");
  }

  return result;
}

//the connection between the main process and renderer process
ipcMain.on("song_name", async (event, data) => {
  let song = await searchSong(data);
  event.sender.send("song_obj", song);
});

ipcMain.on("song_id", async (event, data) => {
  console.log(data);  
})