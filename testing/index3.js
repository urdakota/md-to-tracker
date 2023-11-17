const select = (_, el = document) => el.querySelector(_);
const create = (_, el = document.body) => {
    var created = document.createElement(_);
    el.appendChild(created);
    return created;
};
const wait   = (t) => new Promise(_ => setTimeout(_, t*1000));

// List of all properties
const table = [
    "song",
    "features",
    "producer",
    "description",
    "date",
    "length",
    "quality",
    "released",
    "link",
];

const availableColors = {
    Snippet: {
        background: "rgb(230, 145, 56)",
        textcolor: "rgb(0, 0, 0)",
    },
    Full: {
        background: "rgb(69, 129, 142)",
        textcolor: "rgb(255, 255, 237)",
    },
    Original: {
        background: "rgb(230, 145, 56)",
        textcolor: "rgb(255, 255, 255)",
    },
};

const qualityColors = {
    Lost: {
        background: "rgb(153, 153, 153)",
        textcolor: "rgb(0, 0, 0)",
    },
    Recording: {
        background: "rgb(0, 0, 0)",
        textcolor: "rgb(243, 243, 243)",
    },
    LQ: {
        background: "rgb(255, 0, 0)",
        textcolor: "rgb(255, 255, 255)",
    },
    HB: {
        background: "rgb(251, 188, 4)",
        textcolor: "color:rgb(0, 0, 0)",
    },
    HQ: {
        background: "rgb(232, 175, 13)",
        textcolor: "color:rgb(0, 0, 0)",
    },
    CDQ: {
        background: "rgb(76, 175, 80)",
        textcolor: "rgb(255, 255, 255)",
    },
    Lossless: {
        background: "rgb(69, 188, 255)",
        textcolor: "rgb(255, 255, 255)",
    },
};

// Main
async function main() {
    const audio = select("audio")
    const md = await fetch("./testing.md").then((response) => {
        return response.text();
    });

    // Read the entire md file & format into readable object
    var lex = md.split("\n");
    var lexed = {};
    for (let i = 0; i < lex.length; i++) {
        var length = Object.keys(lexed).length;
        var previousDictionary = lexed[length];
        var tokens = lex[i];

        var cleaned = tokens.replace(tokens.split(" ")[0], "").trim();
        var type = "Text";

        if (tokens.startsWith("# ")) {
            (type = "Album"),
                (lexed[length + 1] = {
                    token: "Album",
                    value: cleaned,
                    description: "",
                    image: "",
                    background: "",
                    textcolor: "",
                });
        }
        if (tokens.startsWith("## ")) {
            (type = "Group"),
                (lexed[length + 1] = {
                    token: "Group",
                    value: cleaned,
                    description: "",
                });
        }
        if (tokens.startsWith("| ")) type = "Table";

        if (type == "Table") {
            var previousDictionary = lexed[length];
            var previousDictionaryValueLength = 0;

            if (!!previousDictionary && previousDictionary.token !== "Table")
                lexed[length + 1] = {
                    token: "Table",
                    index: 0,
                    value: {},
                };
            if (!!previousDictionary && previousDictionary.token == "Table") {
                previousDictionary.index++;
                lexed[length] = previousDictionary;
            }

            var tbl = tokens.split("|");
            if (previousDictionary) {
                previousDictionaryValueLength = Object.keys(
                    previousDictionary.value
                ).length;
                if (previousDictionary.index >= 2)
                    previousDictionary.value[previousDictionaryValueLength + 1] = {};
            }

            for (let key = 0; key < tbl.length; key++) {
                var value = tbl[key].trim();

                if (value !== "" && previousDictionary.index >= 2) {
                    if (value == "-") value = "";

                    previousDictionary.value[previousDictionaryValueLength + 1][
                        table[key - 1]
                    ] = value;
                }
            }
        }

        if (type == "Text" && tokens !== "") {
            if (!previousDictionary) {
                lexed[length + 1] = {
                    token: "Title",
                    value: tokens.trim(),
                    image: "",
                };
            } else {
                switch (previousDictionary.token) {
                    case "Title":
                        if (previousDictionary.image == "") {
                            previousDictionary.image = tokens.trim();
                        }
                        break;
                    case "Album":
                        if (previousDictionary.description == "") {
                            previousDictionary.description = tokens.trim();
                        } else {
                            if (previousDictionary.image == "") {
                                previousDictionary.image = tokens.trim();
                            } else if (previousDictionary.background == "") {
                                previousDictionary.background = tokens.trim();
                            } else if (previousDictionary.textcolor == "") {
                                previousDictionary.textcolor = tokens.trim();
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
    var length = Object.keys(lexed).length;
    // Tracker Title
    var Title = select(".Header_title__CHLQo");
    var container = select(".unreleased_container__IqK0q");

    // Tracker Title
    select("span", Title).innerText = lexed[1].value; // Title
    select("img", Title).src = lexed[1].image; // Image

    // Create Albums
    var Albums = {};
    for (let i = 1; i < length + 1; i++) {
        var tokens = lexed[i];
        var AlbumsLength = Object.keys(Albums).length;
        var previousAlbum = Albums[AlbumsLength];

        console.log(i, tokens);

        if (tokens.token == "Album") {
            const detailsElement = create("details", container);
            detailsElement.classList.add("EraCard_era__5_ZGH");
            detailsElement.id = tokens.value;

            Albums[AlbumsLength + 1] = detailsElement;

            const summaryElement = create("summary", detailsElement);
            summaryElement.style.backgroundColor = tokens.background;

            const imageElement = create("img", summaryElement);
            imageElement.alt = tokens.value + " cover";
            imageElement.src = tokens.image;
            imageElement.width = 136;
            imageElement.height = 136;
            imageElement.decoding = "async";
            imageElement.dataset.nimg = "1";
            imageElement.className = "EraCard_cover__6ANFI";
            imageElement.loading = "lazy";
            imageElement.style.color = "transparent";

            const textDiv = create("div", summaryElement);

            const titleDiv = create("div", textDiv);
            titleDiv.className = "EraCard_title__Xknl9";

            const titleSpan = create("span", titleDiv);
            titleSpan.style.color = tokens.textcolor;
            titleSpan.textContent = tokens.value;

            const descDiv = create("div", textDiv);
            descDiv.className = "EraCard_description__3MKFd";

            const descSpan = create("span", descDiv);
            descSpan.style.color = tokens.textcolor;
            descSpan.textContent = tokens.description;

            const tracksDiv = create("div", detailsElement);
            tracksDiv.className = "EraCard_tracks__rI0Kj";
        }

        if (tokens.token == "Group") {
            var Parent = previousAlbum;
            var amount = Object.keys(lexed[i + 1].value).length;
            var Holder = select(".EraCard_tracks__rI0Kj", Parent)
            const mainContainer = create('div', Holder);
            mainContainer.style = `
            margin-left: 1.5%;
            font-size: 26px;
            font-weight: 700;
            display: flex;
            align-items: center;`
            const innerDiv1 = create('div', mainContainer);
            innerDiv1.textContent = "(" + amount + ") " + tokens.value;

            const Description = create('span', mainContainer);
            if (tokens.description != "N/A") {
                //Description.classList.add('Track_length__yIb3d');
                Description.style = "margin-right:auto;margin-left:auto;text-align:center;font-size: 18px;font-weight: 700;"
                Description.textContent = tokens.description;
            }

        }

        if (tokens.token == "Table") {

            var Parent = previousAlbum;
            
            var Holder = select(".EraCard_tracks__rI0Kj", Parent)
            
            var songs = tokens.value;
            var songsLength = Object.keys(songs).length;
            for (let i = 1; i < songsLength + 1; i++) {
                var song = songs[i];

                const mainContainer = create('div', Holder);
                mainContainer.classList.add('Tooltip_tooltip__q1OLA', 'Track_track__j1JOX');

                var adjustedLink = song.link;
                mainContainer.setAttribute("link", adjustedLink);
                mainContainer.onclick = async function () {
                    let adjustedLink = mainContainer.getAttribute("link");
                    console.log(adjustedLink)
                    if (adjustedLink.includes("pilowcase.zip")){
                        let hash = adjustedLink.split("/")[-1]
                        let request = await fetch("https://api.pillowcase.zip/api/download/" + hash);
                    } else if (adjustedLink.includes("krakenfiles.com")) {
                        console.log("KRAKEN")
                        let request = await fetch(adjustedLink);
                        let soup = new DOMParser().parseFromString(await request.text(), "text/html");

                        let hash = adjustedLink.split("/file.html")[0].split("view/")[1]
                        let link = soup.querySelector('form').action;
                        let date = soup.querySelector("body > div > div > div.nk-content.nk-content-fluid > div > div > div > div.nk-block.invest-block > div > div.col-xl-4.col-lg-5.general-information > div.invest-field.card.card-bordered.ml-lg-4.ml-xl-0 > div > div:nth-child(1) > ul > li:nth-child(1) > div.lead-text").textContent

                        console.log(hash, link, date)
                        let leadlink = link.split("/download")[0];
                        let fulllink = leadlink + "/uploads/" + date.replaceAll(".", "-") + "/" + hash + "/music.m4a"

                        let audio = select("audio")
                        audio.src = fulllink
                        audio.play()
                    } else {
                        if(adjustedLink != "N/A") window.open(adjustedLink, '_blank');
                    }
                }

                const innerDiv1 = create('div', mainContainer);
                const songname = create("span", innerDiv1)
                songname.textContent = song.song;
                if (adjustedLink != "N/A") songname.style = "color:rgb(69, 188, 255);font-weight:700"

                if (song.quality != "N/A") {
                    const QualityTag = create('span', innerDiv1);
                    QualityTag.classList.add('Track_tag__WTlmD');
                    var QualityColors = qualityColors[song.quality]
                    if (!!QualityColors) {
                        QualityTag.style.color = QualityColors.textcolor;
                        QualityTag.style.backgroundColor = QualityColors.background;
                        QualityTag.textContent = song.quality;
                    }
                }
                
                if (song.features != "N/A") {
                    const trackFeaturesDiv = create('div', innerDiv1);
                    trackFeaturesDiv.classList.add('Track_tag__WTlmD');
                    const featuresSpan = create('span', trackFeaturesDiv);
                    featuresSpan.style.color = 'rgb(255, 255, 255)';
                    featuresSpan.textContent = '(ft. ' + song.features + ')';
                }
                
                if (song.producer != "N/A") {
                    const trackProducersDiv = create('div', innerDiv1);
                    trackProducersDiv.classList.add('Track_tag__WTlmD');
                    const producersSpan = create('span', trackProducersDiv);
                    producersSpan.style.color = 'rgb(255, 255, 255)';
                    producersSpan.textContent = '(prod. ' + song.producer + ')';
                }

                const songDescription = create('div', mainContainer);
                if (song.description != "N/A") {
                    songDescription.classList.add('Track_length__yIb3d');
                    songDescription.textContent = song.description;
                }

                const releaseDateDiv = create('div', mainContainer);
                if (song.date != "N/A") {
                    releaseDateDiv.classList.add('Track_length__yIb3d');
                    releaseDateDiv.textContent = song.date;
                }

                if (song.length != "N/A") {
                    const LengthTag = create('span', mainContainer);
                    LengthTag.classList.add('Track_tag__WTlmD');
                    var LengthColors = availableColors[song.length]
                    if (!!QualityColors) {
                        LengthTag.style.color = LengthColors.textcolor;
                        LengthTag.style.backgroundColor = LengthColors.background;
                        LengthTag.textContent = song.length;
                    }
                }

                const releasedDiv = create('span', mainContainer);
                releasedDiv.classList.add('Track_length__yIb3d', 'Track_tag__WTlmD');
                if (song.released != "No" && song.quality != "Lost") {
                    releasedDiv.style.color = 'rgb(255, 255, 255)';
                    releasedDiv.style.backgroundColor = 'rgb(76, 175, 80)';
                    releasedDiv.textContent = 'Released';
                } else {
                    releasedDiv.textContent = '        ';
                }
            }

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
