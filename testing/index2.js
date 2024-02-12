import { select, create } from "../dependancies/utils.js";

// Get Ken JSON

const filepath = "Ken.json";
const albumicons = {
  "More Chaos":
    "https://i1.sndcdn.com/artworks-jI4WOMsX3U0sZQ1r-MFz42w-t500x500.jpg",
  "A Great Chaos":
    "https://upload.wikimedia.org/wikipedia/en/f/f5/Ken_Carson_-_A_Great_Chaos.jpg",
  X: "https://upload.wikimedia.org/wikipedia/en/f/f8/X_Ken_Carson.jpeg",
  "Project X":
    "https://upload.wikimedia.org/wikipedia/en/5/5b/Ken_Carson_Project_X_cover.jpeg",
  "Lost Files 2": 
    "https://t2.genius.com/unsafe/863x0/https%3A%2F%2Fimages.genius.com%2Ff67f38cfc7583d6e46363d7e22b23ff9.500x500x1.jpg",
  "Lost Files":
    "https://t2.genius.com/unsafe/863x0/https%3A%2F%2Fimages.genius.com%2Fda09dc883513130cddd7d8a86f355f43.500x500x1.jpg",
  "Teen X: Relapsed": 
    "https://t2.genius.com/unsafe/863x0/https%3A%2F%2Fimages.genius.com%2F331746ea75acdeb77e04167b01e07bd8.1000x1000x1.png",
  "Teen X":
    "https://lastfm.freetls.fastly.net/i/u/300x300/236f34a8d5d1387de307af874add4bd6.jpg",
  "Boy Barbie":
    "https://lastfm.freetls.fastly.net/i/u/300x300/1e222749fe03a52f76a7c1e8b643115f.jpg",
};
const currentDate = new Date();

const convertToDate = (dateStr) => {
  var [month, day, year] = dateStr.split("/").map(Number);
  if (isNaN(month)) month = 1;
  if (isNaN(day)) day = 1;
  return new Date(`20${year}/${month}/${day}`);
};

function formatDate(inputDate) {
  // Split the input date string into components
  const [month, day, year] = inputDate.split("/");

  // Check if month and day are provided
  if (month !== "?" && day !== "?") {
    // Create a Date object with the parsed components
    const date = new Date(`${month}/${day}/20${year}`);

    // Define an array of month names
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    // Get the month, day, and year from the Date object
    const formattedMonth = monthNames[date.getMonth()];
    const formattedDay = date.getDate();
    const formattedYear = date.getFullYear();

    // Construct the formatted date string
    const formattedDate = `${formattedMonth} ${formattedDay}, ${formattedYear}`;

    return formattedDate;
  } else if (month === "?" && day === "?") {
    // Only year provided
    return `20${year}`;
  } else if (month !== "?" && day === "?") {
    // Only month and year provided
    // No day specified, output just the month and year
    // Here, you might want to decide if you want the month to be abbreviated or spelled out fully
    // For example, "Jan" or "January"
    return `${month} ${year}`;
  } else {
    // Only day provided, it's an invalid format
    return "Invalid date format";
  }
}
function sortByDate(inputObject) {
  // Convert the input object to an array
  const dataArray = Object.values(inputObject);
  // Sort the array based on the "date" property
  dataArray.sort((a, b) => {
    const dateA = convertToDate(a["leak date"]);
    const dateB = convertToDate(b["leak date"]);

    if (dateA.getTime() === dateB.getTime()) {
      return dataArray.indexOf(b) - dataArray.indexOf(a);
    }
    return dateB - dateA;
  });

  // If you want the result as an object with numerical keys
  const sortedObject = dataArray.reduce((acc, curr, index) => {
    acc[index + 1] = curr;
    return acc;
  }, {});

  return sortedObject;
}

function requestdata() {
  fetch(`./${filepath}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to fetch ${filePath}`);
      }
      return response.json();
    })
    .then((jsonData) => {
      loadcontent(jsonData);
    })
    .catch((error) => {
      console.error(`Error: ${error.message}`);
    });
}
function loadcontent(jsonData) {
  var recentsongs = {};
  for (const key in jsonData) {
    var album = key;
    for (const key in jsonData[album]) {
      if (
        jsonData[album].hasOwnProperty(key) &&
        Array.isArray(jsonData[album][key])
      ) {
        jsonData[album][key].forEach((item) => {
          item["album"] = album;
          item["disc"] = key;
          if (item.quality != "Not Available" && item.portion != "Snippet") recentsongs[item.title] = item;
        });
      }
    }
  }
  recentsongs = sortByDate(recentsongs);
  console.log(recentsongs)
  const songrow1 = select("#row1");
  const songrow2 = select("#row2");
  var new8songs = Object.entries(recentsongs).slice(0, 8);
  let i = 1;
  for (const song in new8songs) {
    var songdata = new8songs[song][1];
    var songparent = songrow1;
    if (i > 4) songparent = songrow2;
    var songelement = create("div", songparent);
    songelement.classList.add("song");
    if(songdata.link) songelement.setAttribute("song-url", songdata.link)
    
    songelement.setAttribute("track-num", i)
    songelement.setAttribute("producer", songdata.producer)
    songelement.setAttribute("leakdate", songdata["leak date"])
    songelement.setAttribute("recording", songdata["recording date"])
    songelement.setAttribute("songtype", songdata["song type"])
    songelement.setAttribute("portion", songdata.portion)
    songelement.setAttribute("quality", songdata.quality)
    songelement.setAttribute("ogfilename", songdata["OG File"])
    songelement.setAttribute("history", songdata.History)

    var albumart = create("img", songelement);
    albumart.src = albumicons[songdata.album];
    albumart.classList.add("song-img", "noselect");

    var songinfo = create("div", songelement);
    songinfo.classList.add("song-info");

    var songname = create("div", songinfo);
    songname.classList.add("song-name");
    songname.textContent = songdata.title;

    var songartist = create("div", songinfo);
    songartist.classList.add("song-artist");
    var betterdate = "";
    if (songdata["leak date"] != "Unknown")
      betterdate = `· ${formatDate(songdata["leak date"])}`;
    songartist.textContent = `${songdata.album} ${betterdate}`;

    if (songdata.portion == "Snippet") {
      var snippettag = create("span", songname);
      snippettag.classList.add("tag", "snippet");
      snippettag.textContent = "Snippet";
    }

    i++;
  }

  select(".new-songs").querySelectorAll(".song").forEach(function (songElement) {
    songElement.addEventListener("click", function () {
      playSong(songElement.getAttribute("track-num"), songElement);
    });
  });
}

window.onload = requestdata;
