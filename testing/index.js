// Just some functions
const select = (_, el = document) => el.querySelector(_);
const create = (_, el = document.body) => {
  var created = document.createElement(_);
  el.appendChild(created)
  return created;
}

// constants
const table = ["song", "features", "producer", "description", "date", "length", "type", "quality", "released", "link"];
const lengthcolors = {

}
const qualitycolors = {
  Lost: {
    background: "rgb(153, 153, 153)",
    textcolor: "rgb(0, 0, 0)"
  },
  NA: {
    background: "rgb(243, 243, 243)",
    textcolor: "rgb(0, 0, 0)"
  },
  LQ: {
    background: "rgb(255, 0, 0)",
    textcolor: "rgb(255, 255, 255)"
  },
  HB: {
    background: "rgb(251, 188, 4)",
    textcolor: "color:rgb(0, 0, 0)"
  },
  HQ: {
    background: "rgb(232, 175, 13)",
    textcolor: "color:rgb(0, 0, 0)"
  },
  CDQ: {
    background: "rgb(76, 175, 80)",
    textcolor: "rgb(255, 255, 255)"
  },
  Lossless: {
    background: "rgb(69, 188, 255)",
    textcolor: "rgb(255, 255, 255)"
  }
}

// Main
async function main() {
  const md = await fetch("https://urdakota.github.io/md-to-tracker/example.md").then(response => {
    return response.text()
  });

  // Read the entire md file & format into readable object
  var lex = md.split('\n');
  var lexed = {}
  for (let i = 0; i < lex.length; i++) {
    var length = Object.keys(lexed).length;
    var previousDictionary = lexed[length];
    var tokens = lex[i];

    var cleaned = tokens.replace(tokens.split(" ")[0], "").trim();
    var type = "Text";

    if (tokens.startsWith("# ")) {
      type = "Album", lexed[length + 1] = {
        token: "Album",
        value: cleaned,
        description: "",
        image: "",
        background: "",
        textcolor: ""
      }
    };
    if (tokens.startsWith("## ")) {
      type = "Group", lexed[length + 1] = {
        token: "Group",
        value: cleaned,
        description: ""
      }
    };
    if (tokens.startsWith("| ")) type = "Table";

    if (type == "Table") {
      var previousDictionary = lexed[length];
      var previousDictionaryValueLength = 0;

      if (!!previousDictionary && previousDictionary.token !== "Table") lexed[length + 1] = {
        token: "Table",
        index: 0,
        value: {}
      };
      if (!!previousDictionary && previousDictionary.token == "Table") {
        previousDictionary.index++;
        lexed[length] = previousDictionary;
      }

      var tbl = tokens.split("|");
      if (previousDictionary) {
        previousDictionaryValueLength = Object.keys(previousDictionary.value).length;
        if (previousDictionary.index >= 2) previousDictionary.value[previousDictionaryValueLength + 1] = {}
      }

      for (let key = 0; key < tbl.length; key++) {
        var value = tbl[key].trim();

        if (value !== "" && previousDictionary.index >= 2) {
          if (value == "-") value = "";

          previousDictionary.value[previousDictionaryValueLength + 1][table[key - 1]] = value;
        }
      }
    }

    if (type == "Text" && tokens !== "") {
      if (!previousDictionary) {
        lexed[length + 1] = {
          token: "Title",
          value: tokens.trim(),
          image: ""
        };
      } else {
        switch (previousDictionary.token) {
          case "Title":
            if (previousDictionary.image == "") {
              previousDictionary.image = tokens.trim()
            }
            break;
          case "Album":
            if (previousDictionary.description == "") {
              previousDictionary.description = tokens.trim();
            } else {
              if (previousDictionary.image == "") {
                previousDictionary.image = tokens.trim()
              } else if (previousDictionary.background == "") {
                previousDictionary.background = tokens.trim()
              } else if (previousDictionary.textcolor == "") {
                previousDictionary.textcolor = tokens.trim()
              }
            }
            break;
          case "Group":
            previousDictionary.description = tokens.trim();
            break;
          default:
            alert(`Error in code!
                            ${previousDictionary.token} is not [Title, Album, Group]!
                            type: Text, tokens: ${tokens}
                        `);
            break;
        }
        // Update Previous
        lexed[length] = previousDictionary;
      }
    }

    // More later
  }

  console.log("Loaded Tracker & Formatted");

  // Update Website
  //var Title = select(".Header_title__CHLQo");
  //var container = select(".unreleased_container__IqK0q")
  var length = Object.keys(lexed).length;

  console.log(`[${lexed[1].value}] ${length}`);
  // Tracker Title
  //select("span", Title).innerText = lexed[1].value; // Title
  //select("img", Title).src = lexed[1].image; // Image

  // Create Albums
  var Albums = {}
  for (let i = 1; i < length + 1; i++) {
    var previousDictionary = lexed[length];
    var tokens = lexed[i];
    var AlbumsLength = Object.keys(Albums).length;
		var previousAlbum = Albums[AlbumsLength];
    var previousAlbumGroupLength;
    if (!!previousAlbum) previousAlbumGroupLength = Object.keys(previousAlbum.groups).length;
    
    if (tokens.token == "Album"){
    
      const Holder = create("div");
      Holder.classList.add("Album");
      Holder.id = tokens.value

      Albums[AlbumsLength + 1] = {
        object: Holder,
        groups: {},
        songs: {}
      };

      // Decorate

      const TextHolder = create("div", Holder);
      TextHolder.classList.add("Album_Text");

      const AlbumImage = create("img", TextHolder);
      AlbumImage.classList.add("Album_Image");
      AlbumImage.src = tokens.image;

      const AlbumTitle = create("div", TextHolder);
      AlbumTitle.classList.add("Album_Title");

      const AlbumTitleText = create("Span", AlbumTitle);
      AlbumTitleText.textContent = tokens.value;

      const AlbumDescription = create("div", TextHolder);
      AlbumDescription.classList.add("Album_Description");

      const AlbumDescriptionText = create("Span", AlbumDescription);
      AlbumDescriptionText.textContent = tokens.description;

			const Songs = create("div", Holder);
      Songs.classList.add("Songs");
      
      console.log("Created " + tokens.value);
    }
		if (tokens.token == "Group") {
    	
      const Holder = create("div", Albums[AlbumsLength].object);
      Holder.classList.add("Group");
      Holder.id = tokens.value

      previousAlbum.groups[previousAlbumGroupLength+1] = {
        object: Holder,
        songs: {}
      };

      // Decorate

      const TextHolder = create("div", Holder);
      TextHolder.classList.add("Group_Text");

      const AlbumTitle = create("div", TextHolder);
      AlbumTitle.classList.add("Group_Title");

      const AlbumTitleText = create("Span", AlbumTitle);
      AlbumTitleText.textContent = tokens.value;
    	
			const Songs = create("div", Holder);
      Songs.classList.add("Songs");
      
      console.log("Created " + tokens.value);
    }
  	if (tokens.token == "Table") {
    	
      var Parent = previousAlbum.songs;
      if(previousAlbumGroupLength > 0) Parent = previousAlbum.groups[previousAlbumGroupLength].songs;
      
      var songs = tokens.value;
    	var songsLength = Object.keys(songs).length;
  		for (let i = 1; i < songsLength + 1; i++) {
      		var song = songs[i];
        
          const TextHolder = create("div", Parent);
          TextHolder.classList.add("Song");

          const SongName = create("div", TextHolder);
          SongName.classList.add("Song_Name");

          const SongNameText = create("Span", SongName);
          SongNameText.textContent = song.song;
      
          const SongDescription = create("div", TextHolder);
          SongDescription.classList.add("Song_Description");

          const SongDescriptionText = create("Span", SongDescription);
          SongDescriptionText.textContent = song.description;

          console.log("Created " + song.song);
      }
      // Decorate
			/*
    	*/
    }
  
  }

  // Add the class attribute

  // Append the details element to the document or another container element

  /*
  <details class="EraCard_era__5_ZGH">
      <div class="EraCard_tracks__rI0Kj">
          <div id="b46fee5b199307af84ee2bc370d94488" tag="div" class="Tooltip_tooltip__q1OLA Track_track__j1JOX" content="No description available." data-content="No description available.">
          <div>
              <div>Hohner Melodica #1
              <!-- -->
              <span class="Track_tag__WTlmD" style="color:rgb(255, 255, 255);background-color:rgb(69, 188, 255)">Lossless</span>
              </div>
          </div>
          <div class="Track_length__yIb3d">0:02</div>
          </div>
      </div>
  </details>
  */
}

main();

// Begin Modifying Website
