import { select, create } from "../dependancies/utils.js";

// Get Ken JSON
const filepath = "Ken.json";
const albumicons = {
  "More Chaos":
    "https://images.genius.com/ddebc30f117a1d77fc3eeb39323c5993.1000x1000x1.jpg",
  "A Great Chaos":
    "https://images.genius.com/7691b69f0717dacd9c678521d722160a.1000x1000x1.png",
  "Lost ?":
    "https://images.genius.com/b2c460bf426b9df10f6073d8f15175a4.1000x1000x1.png",
  X: "https://images.genius.com/de650f4d0ca39dbf04a5d6b51d8a84a8.1000x1000x1.png",
  "X-23":
    "https://images.genius.com/0ad831c7dff193912d48b18ecbfc6b3b.252x252x1.jpg",
  "Lost Files 3":
    "https://images.genius.com/3750b1d6541912c482aa06a5a5fc426b.500x500x1.jpg",
  "X Man": "https://images.genius.com/78d4c56ae31f8eb1d0496e1616a1ff0a.1000x1000x1.jpg",
  "Project Xtended": "https://i.redd.it/oeyyp91f2te71.png",
  "Project X":
    "https://images.genius.com/d3a0f08457e58a24e5c4cf357f23b987.1000x1000x1.png",
  "Lost Files 2":
    "https://images.genius.com/f67f38cfc7583d6e46363d7e22b23ff9.500x500x1.jpg",
  "Lost Files":
    "https://images.genius.com/da09dc883513130cddd7d8a86f355f43.500x500x1.jpg",
  "Teen X: Relapsed":
    "https://images.genius.com/331746ea75acdeb77e04167b01e07bd8.1000x1000x1.png",
  "Teen X":
    "https://images.genius.com/b29cb9082c5b354d09b3c23f3a7402ec.1000x1000x1.png",
  "Boy Barbie":
    "https://images.genius.com/1ef69452d04b5a151fe7738c0b633171.1000x1000x1.jpg",
  "Boy Barbie OG":
    "https://images.genius.com/4db345894c3b0cfdaf9fe68d4a487b18.899x899x1.jpg"
};

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
  const albums_wrapper = select("#albums > .wrapper");
  var recentsongs = {};
  for (const key in jsonData) {
    let album = key;

    let albumelement = create("div");
    albumelement.style.display = "inline-block";
    albumelement.classList.add("album-element");
    albums_wrapper.insertBefore(albumelement, albums_wrapper.firstChild);

    let albumart = create("img", albumelement);
    albumart.src = albumicons[album];
    albumart.classList.add("noselect");
    albumart.height = "200";
    albumart.width = "200";
    albumart.style.margin = "6px";
    albumart.style["margin-bottom"] = "0px";
    albumart.style["border-radius"] = "6px";

    var songname = create("div", albumelement);
    songname.classList.add("song-name");
    songname.style.margin = "6px";
    songname.style["margin-top"] = "0px";
    songname.style["margin-bottom"] = "0px";
    songname.style.padding = "0px";
    songname.textContent = album;

    let songartist = create("div", albumelement);
    songartist.classList.add("song-artist");
    songartist.style.margin = "6px";
    songartist.style["margin-top"] = "0px";
    songartist.style["margin-bottom"] = "0px";
    songartist.style.padding = "0px";
    let betterdate = "";
    if (jsonData[album]["leak date"] != "Unknown")
      betterdate = `${formatDate(jsonData[album]["leak date"])}`;
    songartist.textContent = `${betterdate}`;

    let albumthing = create("div");
    albumthing.id = album;
    albumthing.classList.add("album-thing");

    let albumheader = create("div", albumthing);
    albumheader.classList.add("Page_Header");

    let backbtn = create("div", albumheader);
    backbtn.id = "Back-button";
    backbtn.style.cursor = "pointer";
    backbtn.style["border-radius"] = "50%";
    backbtn.style.background = "var(--dark-primary)";
    backbtn.style.height = "32px";
    backbtn.style.width = "32px";
    backbtn.style["margin-left"] = "15px";
    backbtn.style["margin-top"] = "10px";

    backbtn.innerHTML += '<i class="fa-solid fa-chevron-left" style="margin-left:8px;margin-top:6px;font-size:20px"></i>'

    let artistthing = create("div", albumthing);
    artistthing.classList.add("Artist", "noselect");

    let artistimg = create("img", artistthing);
    artistimg.src = albumicons[album];
    artistimg.width = "1";
    artistimg.height = "40";

    let artistheader = create("h1", artistthing);
    artistheader.style["align-items"] = "center";
    artistheader.style["justify-content"] = "center";
    artistheader.style.display = "flex";
    artistheader.style.width = "100%";

    let albumname = create("span", artistheader);
    albumname.style["text-align"] = "center";
    albumname.style["font-size"] = "5vw";
    albumname.style.bottom = "50px";
    albumname.style.position = "absolute";
    albumname.textContent = album;
    create("br", albumname);
    let artistname = create("span", albumname);
    artistname.style["text-weight"] = "500";
    artistname.style["font-size"] = "5vw";
    artistname.textContent = "Ken Carson";
    create("br", albumname);
    let releasedate = create("span", albumname);
    releasedate.style["text-weight"] = "500";
    releasedate.style["font-size"] = "5vw";
    releasedate.style.color = "gray";
    let bolded = create("strong", releasedate);
    bolded.textContent = jsonData[album]["leak date"];

    let albumdescription = create("span", artistheader);
    albumdescription.style["text-align"] = "center";
    albumdescription.style["font-size"] = "2.2vw";
    albumdescription.style.width = "100%"
    albumdescription.style.opacity = ".85"
    albumdescription.style.background = "var(--dark-secondary)";
    albumdescription.style.bottom = "0px";
    albumdescription.style.position = "absolute";
    albumdescription.textContent = jsonData[album].History;

    let songlist = create("div", albumthing);
    songlist.classList.add("song-list");

    albumelement.addEventListener("click", function () {
      albumthing.classList.add("open");
    });

    backbtn.addEventListener("click", function () {
      albumthing.classList.remove("open");
    });

    let i = 1;
    for (const key in jsonData[album]) {
      if (
        jsonData[album].hasOwnProperty(key) &&
        Array.isArray(jsonData[album][key])
      ) {
        let albumname2 = create("p", songlist);
        albumname2.classList.add("album-info");
        albumname2.textContent = key;

        jsonData[album][key].forEach((item) => {
          if(typeof item === "object"){
            item["album"] = album;
            item["disc"] = key;
            if (item.quality != "Not Available" && item.portion != "Snippet")
              recentsongs[item.title] = item;

            let songelement = create("div", songlist);
            songelement.classList.add("song");
            if (item.link) songelement.setAttribute("song-url", item.link);
            if (!item.link) songelement.style.opacity = ".5"

            songelement.setAttribute("track-num", i);
            songelement.setAttribute("album", item["album"]);
            songelement.setAttribute("producer", item.producer);
            songelement.setAttribute("leakdate", item["leak date"]);
            songelement.setAttribute("recording", item["recording date"]);
            songelement.setAttribute("songtype", item["song type"]);
            songelement.setAttribute("portion", item.portion);
            songelement.setAttribute("quality", item.quality);
            songelement.setAttribute("ogfilename", item["OG File"]);
            songelement.setAttribute("history", item.History);

            let tracknum = create("span", songelement);
            tracknum.classList.add("track-num");
            tracknum.textContent = i;

            let songinfo = create("div", songelement);
            songinfo.classList.add("song-info");

            let songname2 = create("div", songinfo);
            songname2.classList.add("song-name");
            songname2.textContent = item.title;

            let songinfo2 = create("span", songname2);
            songinfo2.style["font-size"] = "small";
            songinfo2.style.color = "lightgray";
            songinfo2.textContent = item.info;

            if (item.portion == "Snippet") {
              var snippettag = create("span", songname2);
              snippettag.classList.add("tag", "snippet");
              snippettag.textContent = "Snippet";
            }
            i++
          }
        });

        var albuminfo = create("p", songlist);
        albuminfo.classList.add("album-info");
        var infotext = jsonData[album][key].slice(-1)[0]
        albuminfo.innerHTML += typeof infotext !== "object" ? infotext.replaceAll("\n","<br>") : "";
      }
    }
    
    songlist.querySelectorAll(".song")
    .forEach(function (songElement) {
      songElement.addEventListener("click", function () {
        playSong(songElement.getAttribute("track-num"), songElement);
      });
    });
  }
  // recent songs
  recentsongs = sortByDate(recentsongs);
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
    if (songdata.link) songelement.setAttribute("song-url", songdata.link);

    songelement.setAttribute("track-num", i);
    songelement.setAttribute("producer", songdata.producer);
    songelement.setAttribute("leakdate", songdata["leak date"]);
    songelement.setAttribute("recording", songdata["recording date"]);
    songelement.setAttribute("songtype", songdata["song type"]);
    songelement.setAttribute("portion", songdata.portion);
    songelement.setAttribute("quality", songdata.quality);
    songelement.setAttribute("ogfilename", songdata["OG File"]);
    songelement.setAttribute("history", songdata.History);

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

  select(".new-songs")
    .querySelectorAll(".song")
    .forEach(function (songElement) {
      songElement.addEventListener("click", function () {
        playSong(songElement.getAttribute("track-num"), songElement);
      });
    });
}

window.onload = requestdata;
