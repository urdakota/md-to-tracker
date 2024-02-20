const link = "./test.tracker";
const tracker = await fetch(link).then((response) => {
  return response.text();
});

var splitted = tracker.split("\n");
var jsonexport = { Albums: {} };
var lastalb;
var lastdsc;
for (let i = 0; i < splitted.length; i++) {
  let token = splitted[i];

  // Define Artist
  if (i == 0) jsonexport["Artist"] = (token);
  // Get Image
  if (!jsonexport["ArtistImage"] && token.startsWith("- img") && !lastalb)
    jsonexport["ArtistImage"] = clean(token.split("- img: ")[1]);

  // Begin Albums
  if (token.startsWith("# ")) {
    let AlbumName = clean(token.split("# ")[1]);
    jsonexport["Albums"][AlbumName] = { discs: {}, info: "" };
    lastalb = AlbumName;
  }

  // Define Album Info
  if (!!lastalb) {
    if (
      token.startsWith("- ") &&
      !!jsonexport["Albums"][lastalb]["img"] &&
      !!jsonexport["Albums"][lastalb]["date"]
    )
      jsonexport["Albums"][lastalb]["info"] = clean(token.split("- ")[1]);
    if (token.startsWith("- img: "))
      jsonexport["Albums"][lastalb]["img"] = clean(token.split("- img: ")[1]);
    if (token.startsWith("- date: "))
      jsonexport["Albums"][lastalb]["date"] = clean(token.split("- date: ")[1]);
  }

  // Begin Discs
  if (token.startsWith("## ")) {
    let DiscName = clean(token.split("## ")[1]);
    jsonexport["Albums"][lastalb][DiscName] = {};
    lastdsc = DiscName;
  }

  if (!!lastalb && !!lastdsc && token.includes(" | ")) {
    let length = Object.keys(jsonexport["Albums"][lastalb][lastdsc]).length;
    let songinfo = token.split(" | ");
    let song = {};
    song["name"] = songinfo[0];
    song["info"] = songinfo[1];
    song["prod"] = songinfo[2];
    song["leak"] = songinfo[3];
    song["recd"] = songinfo[4];
    song["type"] = songinfo[5];
    song["length"] = songinfo[6];
    song["quality"] = songinfo[7];
    song["OG File"] = songinfo[8];
    song["link"] = songinfo[9];
    song["History"] = songinfo[10];
    jsonexport["Albums"][lastalb][lastdsc][length + 1] = song;
  }
}

document.body.innerHTML += `<h1>${jsonexport.Artist}</h1><img width=50 height=50 src="${jsonexport.ArtistImage}">`;

function clean(text) {
  return text.replace(text.split(" ")[0], "").trim();
}
