const { app, BrowserWindow, ipcMain } = require("electron");

const lyricsFinder = require("lyrics-finder");
const song = require("@allvaa/get-lyrics");

const YoutubeMp3Downloader = require("youtube-mp3-downloader");
const ffmpegPath = require("ffmpeg-static-binaries-electron");

let mainWindow;

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 970,
    height: 800,
    // resizable: false,
    minHeight: 700,
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
  mainWindow.loadURL(`file://${__dirname}/src/index.html`);

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
  //Youtube downloader

  let YD = new YoutubeMp3Downloader({
    ffmpegPath: ffmpegPath, // FFmpeg binary location
    outputPath: data.location, // Output file location (default: the home directory)
    youtubeVideoQuality: "highestaudio", // Desired video quality (default: highestaudio)
    queueParallelism: 2, // Download parallelism (default: 1)
    progressTimeout: 2000, // Interval in ms for the progress reports (default: 1000)
    allowWebm: false, // Enable download from WebM sources (default: false)
  });

  YD.download(data.video_id);

  YD.on("progress", async (progress) => {
    event.sender.send("progress", progress);
  });

  YD.on("error", async function (error) {
    event.sender.send("error", error);
  });

  YD.on("finished", async function (err, data) {
    event.sender.send("finished", JSON.stringify(data));
  });
});
