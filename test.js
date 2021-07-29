//npm i @allvaa/get-lyrics 

const song = require("@allvaa/get-lyrics");

const lyricsFinder = require("lyrics-finder");

async function getLyrics(artist, title) {
    let lyrics = await lyricsFinder(artist, title) || "Not Found!";
    return lyrics;
  };

(async (title) => {
    const result = await song(title) || "Not Found!!";
    
    if (result.lyrics == ""){
        result.lyrics = await getLyrics("", title);
    }
    console.log(result);
})("Amr Diab - Shawakna Aktar");