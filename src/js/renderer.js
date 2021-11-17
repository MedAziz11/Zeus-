const remote = require("electron").remote;
const { ipcRenderer } = require("electron");

const { dialog } = require("electron").remote;

const downloadContainer = document.querySelector(".download-container");

const confirmDownload = document.querySelector(".test-btn");
const first = document.querySelector(".down-img");
const second = document.querySelector(".tick-img");

let pending = false;

// close the app functionality
document.getElementById("exit").addEventListener("click", function () {
  let window = remote.getCurrentWindow();
  window.close();
});

// close the app functionality
document.getElementById("reduce").addEventListener("click", function () {
  let window = remote.getCurrentWindow();
  window.minimize();
});

// generate the lyrics and connect main to renderer
document.getElementById("generate").addEventListener("click", function () {
  ipcRenderer.send("song_name", document.getElementById("song").value);

  document.querySelector(".no-result").classList.add("hidden");
  document.querySelector(".no-result-msg").classList.add("hidden");

  ipcRenderer.on("song_obj", async (event, data) => {
    let song = await data;
    let lyrics = song.lyrics.split(",");
    let array = song.title.split("by");

    if (array.length == 2) {
      document.getElementById("title").innerHTML =
        array[0] + "<br>" + array[1].slice(1);
      document.getElementById("lyrics-text").innerHTML = lyrics.join("<br/>");
    } else {
      document.querySelector(".no-result").classList.remove("hidden");
      document.querySelector(".no-result-msg").classList.remove("hidden");
    }

    document.querySelector(".loader").classList.add("hidden");
    document.getElementById("song-img").src = song.image;
  });
});

// Function to check the Youtube URL validity
function validYtbUrl(url) {
  const valid =
    /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
  if (url.value.match(valid)) {
    urlInput.focus();
    return true;
  } else {
    urlInput.focus();
    return false;
  }
}

//download functionality
downloadbtn.addEventListener("click", () => {
  if (!validYtbUrl(urlInput)) {
    errMsg.classList.remove("hidden");
    btnsContainer.style.padding = "1.2em 0";
    return;
  }

  document.getElementById("file-ready").classList.add("hidden");
  document.getElementById("confirm").classList.add("hidden");

  //Link valid, proceed to download
  mainContainer.style.transform = "translate(0 , -15%) scale(0.75)";
  downloadContainer.style.visibility = "visible";
  downloadContainer.style.opacity = 1;
  isClickedDown = 1;
  document.getElementById("song").blur();

  errMsg.classList.add("hidden");

  btnsContainer.style.padding = "1.8em 0";

  first.classList.add("hidden");
  second.classList.add("hidden");

  document.getElementById("generate").classList.add("hidden");

  let url = document.getElementById("song").value;

  let video_id = url.split("v=")[1];

  let ampersandPosition = video_id.indexOf("&");

  if (ampersandPosition != -1) {
    video_id = video_id.substring(0, ampersandPosition);
  }

  ipcRenderer.send("get-info", video_id);
  ipcRenderer.on("infos", (event, data) => {
    document.querySelector(".loader-url").classList.add("hidden");

    document.getElementById("url-title").innerHTML = data.title;
    document.getElementById("url-duration").innerHTML = data.duration;

    document.getElementById("file-ready").classList.remove("hidden");
    document.getElementById("confirm").classList.remove("hidden");
  });
});

//proceed DnD functionality
confirmDownload.addEventListener("click", () => {
  let url = document.getElementById("song").value;

  let video_id = url.split("v=")[1];

  let ampersandPosition = video_id.indexOf("&");

  if (ampersandPosition != -1) {
    video_id = video_id.substring(0, ampersandPosition);
  }

  let path = dialog.showOpenDialog({
    properties: ["openDirectory"],
  });
  path
    .then((result) => {
      if (!result.canceled) {
        let location = result.filePaths[0];

        first.classList.remove("hidden");
        ipcRenderer.send("song_id", { video_id, location });
        pending = true;

        document.getElementById("song").disabled = pending;
        confirmDownload.disabled = true;

        ipcRenderer.on("finished", (event, data) => {
          console.log(data);
          first.classList.add("hidden");
          second.classList.remove("hidden");
          pending = false;
          confirmDownload.disabled = false;
          document.getElementById("song").disabled = pending;
        });

        // ipcRenderer.on("progress", async (event, data) => {
        //   console.log(data);
        // });

        ipcRenderer.on("error", (event, data) => {
          console.log(data);
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
});
