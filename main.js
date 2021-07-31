const { app, BrowserWindow, ipcMain, Notification } = require("electron");
const path = require("path");

const lyricsFinder = require("lyrics-finder");
const song = require("@allvaa/get-lyrics");

const YoutubeMp3Downloader = require("youtube-mp3-downloader");
const ffmpegPath = require("ffmpeg-static-binaries-electron");7

const ytdl = require('ytdl-core');

let mainWindow;

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    title: "Zeus ⚡",
    icon: path.join(__dirname, "src/images/icon.png"),
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
  mainWindow.loadURL(path.join(__dirname, "src/index.html"));

  // Emitted when the window is closed.
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

function showNotification(title, body) {
  new Notification({
    title,
    body,
  }).show();
}

app.setAppUserModelId("Zeus ⚡");

app.whenReady().then(createWindow);

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

app.on("before-quit", () => {
  clearInterval(progressInterval);
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

  const INCREMENT = 0.1;
  const INTERVAL_DELAY = 1; // ms


  let isCompleted = false;
  let c = 0;
  progressInterval = setInterval(() => {
    
    mainWindow.setProgressBar(c);
    
      c += INCREMENT;
      if (isCompleted) c=-1;
    
  }, INTERVAL_DELAY);

  
  if (isCompleted){
    clearInterval(progressInterval);
  }

  YD.on("progress", async (progress) => {
    event.sender.send("progress", progress);
  });

  YD.on("error", async function (error) {
    event.sender.send("error", error);
  });

  YD.on("finished", async function (err, data) {
    event.sender.send("finished", JSON.stringify(data));
    isCompleted = true;
    const NOTIFICATION_TITLE = "Download Done Successfully !! ";
    const NOTIFICATION_BODY = ` ${data.videoTitle} downloaded`;

    showNotification(NOTIFICATION_TITLE, NOTIFICATION_BODY);
  });
});

function format(value) {
  const sec = parseInt(value, 10); // convert value to number if it's string
  let hours   = Math.floor(sec / 3600); // get hours
  let minutes = Math.floor((sec - (hours * 3600)) / 60); // get minutes
  let seconds = sec - (hours * 3600) - (minutes * 60); //  get seconds
  // add 0 if value < 10; Example: 2 => 02
  if (hours   < 10) {hours   = "0"+hours;}
  if (minutes < 10) {minutes = "0"+minutes;}
  if (seconds < 10) {seconds = "0"+seconds;}
  return minutes+':'+seconds; // Return is HH : MM : SS
}

//geting the youtube video infos

ipcMain.on("get-info", async (event, data) => {

  let info = await ytdl.getInfo(data);

  
  let duration = format(info.videoDetails.lengthSeconds);

  event.sender.send("infos", {"title": info.videoDetails.title, "duration": `Duration : ${duration}`});
})