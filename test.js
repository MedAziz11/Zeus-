const YoutubeMp3Downloader = require("youtube-mp3-downloader");
const ffmpegPath  = require('ffmpeg-static-binaries-electron');

console.log(ffmpegPath);// The path of ffmpeg binaries

let YD = new YoutubeMp3Downloader({
    "ffmpegPath": ffmpegPath,        // FFmpeg binary location
    "outputPath": ".",    // Output file location (default: the home directory)
    "youtubeVideoQuality": "highestaudio",  // Desired video quality (default: highestaudio)
    "queueParallelism": 2,                  // Download parallelism (default: 1)
    "progressTimeout": 2000,                // Interval in ms for the progress reports (default: 1000)
    "allowWebm": false                      // Enable download from WebM sources (default: false)
});

YD.download("0M8AYU_hPas", "nest.mp3");

YD.on("finished", function(err, data) {
    console.log(JSON.stringify(data));
});

YD.on("error", function(error) {
    console.log(error);
});

YD.on("progress", function(progress) {
    console.log(JSON.stringify(progress));
});