const select = (_, el = document) => el.querySelector(_);
const create = (_, el = document.body) => {
    var created = document.createElement(_);
    el.appendChild(created);
    return created;
};
const wait = (t) => new Promise((_) => setTimeout(_, t * 1000));
var fadingto = 1;
var isfading = false;

const fade = async (element, volume) => {
    // ChatGPT 3.5 Made it :d
    element.play();
    if (isfading) isfading = false;
    fadingto = volume;

    isfading = true;
    var direction = (volume >= element.volume) ? 1 : -1;
    var step = 0.02;

    do {
        if (element.volume + (step * direction) < 0 || (direction > 0 && element.volume + (step * direction) > fadingto)) {
            element.volume = fadingto;
            isfading = false;
        } else {
            element.volume += (step * direction);
        }
        
        await wait(0.01);
    } while (element.volume != fadingto && isfading)
    if (element.volume <= 0) element.pause();
}
const fetchaudio = async (link) => {
    if (link.includes("pilowcase.zip")) {
        let hash = link.split("/")[-1];
        return `https://api.pillowcase.zip/api/download/${hash}`;
    } else if (link.includes("krakenfiles.com")) {
        let request = await fetch(link);
        let soup = new DOMParser().parseFromString(
            await request.text(),
            "text/html"
        );

        let hash = link.split("/file.html")[0].split("view/")[1];
        let downloadlink = soup.querySelector("form").action;
        let date = soup.querySelector(
            "body > div > div > div.nk-content.nk-content-fluid > div > div > div > div.nk-block.invest-block > div > div.col-xl-4.col-lg-5.general-information > div.invest-field.card.card-bordered.ml-lg-4.ml-xl-0 > div > div:nth-child(1) > ul > li:nth-child(1) > div.lead-text"
        ).textContent;

        return `${downloadlink.split("/download")[0]}/uploads/${date.replaceAll(
            ".",
            "-"
        )}/${hash}/music.m4a`;
    }
    return link;
};
const downloadaudio = async (link) => {
    if (link.includes("pilowcase.zip")) {
        let hash = link.split("/")[-1];
        select('#download_helper').src = `https://api.pillowcase.zip/api/download/${hash}`;
    } else {
        select("#page_opener").href = link;
        select("#page_opener").click();
    }
}
var previousbutton;
var currentsong;
var audioplayer = select("audio");
const play_audio = async (link, button) => {
    audioplayer = select("audio");
    if (!!audioplayer.src && audioplayer.src != link) fade(audioplayer, 0);
    if (!!previousbutton) {
        previousbutton.textContent = "play_circle";
        previousbutton.parentElement.style["background-color"] = "";
    }
    await wait(0.5);
    if (audioplayer.src != link) audioplayer.src = link;
    fade(audioplayer, 1);
    button.textContent = "pause_circle";
    button.parentElement.style["background-color"] = "hsla(0, 0%, 100%, 0.1)";

    previousbutton = button;
    // Fixes weird bug where audio gets stuck very low
    fade(audioplayer, 1);
};

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
            var Holder = select(".EraCard_tracks__rI0Kj", Parent);
            const mainContainer = create("div", Holder);
            mainContainer.style = `
            margin-left: 1.5%;
            font-size: 26px;
            font-weight: 700;
            display: flex;
            align-items: center;`;
            const innerDiv1 = create("div", mainContainer);
            innerDiv1.textContent = "(" + amount + ") " + tokens.value;

            const Description = create("span", mainContainer);
            if (tokens.description != undefined) {
                //Description.classList.add('Track_length__yIb3d');
                Description.style =
                    "margin-right:auto;margin-left:auto;text-align:center;font-size: 18px;font-weight: 700;";
                Description.textContent = tokens.description;
            }
        }

        if (tokens.token == "Table") {
            var Parent = previousAlbum;

            var Holder = select(".EraCard_tracks__rI0Kj", Parent);

            var songs = tokens.value;
            var songsLength = Object.keys(songs).length;
            for (let i = 1; i < songsLength + 1; i++) {
                var song = songs[i];

                const mainContainer = create("div", Holder);
                mainContainer.classList.add(
                    "Tooltip_tooltip__q1OLA",
                    "Track_track__j1JOX"
                );

                const playButton = create("span", mainContainer);
                playButton.classList.add("material-symbols-outlined", "Track_play");
                if (!!song.link) playButton.textContent = "play_circle";

                var adjustedLink = song.link;
                mainContainer.setAttribute("link", adjustedLink);
                mainContainer.onclick = async function () {
                    let adjustedLink = mainContainer.getAttribute("link");

                    if (playButton.textContent == "pause_circle") {
                        playButton.textContent = "play_circle";
                        fade(audioplayer, 0);
                    } else {
                        if (previousbutton == playButton) {
                            playButton.textContent = "pause_circle";
                            fade(audioplayer, 1);
                        } else {
                            let audiolink = await fetchaudio(adjustedLink);
                            await play_audio(audiolink, playButton);
                        }
                    }
                };

                const innerDiv1 = create("div", mainContainer);
                const songname = create("span", innerDiv1);
                songname.classList.add("Track_name");
                songname.textContent = song.song;
                if (adjustedLink != undefined)
                    songname.style = "color:rgb(69, 188, 255);font-weight:700";

                if (song.quality != undefined) {
                    const QualityTag = create("span", innerDiv1);
                    QualityTag.classList.add("Track_tag__WTlmD");
                    var QualityColors = qualityColors[song.quality];
                    if (!!QualityColors) {
                        QualityTag.style.color = QualityColors.textcolor;
                        QualityTag.style.backgroundColor = QualityColors.background;
                        QualityTag.textContent = song.quality;
                    }
                }

                if (song.length != undefined) {
                    const LengthTag = create("span", innerDiv1);
                    LengthTag.classList.add("Track_tag__WTlmD");
                    var LengthColors = availableColors[song.length];
                    if (!!QualityColors) {
                        LengthTag.style.color = LengthColors.textcolor;
                        LengthTag.style.backgroundColor = LengthColors.background;
                        LengthTag.textContent = song.length;
                    }
                }

                if (song.features != undefined) {
                    const trackFeaturesDiv = create("div", innerDiv1);
                    trackFeaturesDiv.classList.add("Track_tag__WTlmD");
                    const featuresSpan = create("span", trackFeaturesDiv);
                    featuresSpan.style.color = "rgb(255, 255, 255)";
                    featuresSpan.textContent = "(ft. " + song.features + ")";
                }

                if (song.producer != undefined) {
                    const trackProducersDiv = create("div", innerDiv1);
                    trackProducersDiv.classList.add("Track_tag__WTlmD");
                    const producersSpan = create("span", trackProducersDiv);
                    producersSpan.style.color = "rgb(255, 255, 255)";
                    producersSpan.textContent = "(prod. " + song.producer + ")";
                }

                const songDescription = create("div", mainContainer);
                if (song.description != undefined) {
                    songDescription.classList.add(
                        "Track_description",
                        "Track_length__yIb3d"
                    );
                    songDescription.textContent = song.description;
                }

                const releaseDateDiv = create("div", mainContainer);
                if (song.date != undefined) {
                    releaseDateDiv.classList.add("Track_length__yIb3d", "Track_date");
                    releaseDateDiv.textContent = song.date;
                }

                const releasedDiv = create("span", mainContainer);
                releasedDiv.classList.add("Track_length__yIb3d", "Track_tag__WTlmD", "ReleasedTag");
                if (song.released != "No" && song.quality != "Lost") {
                    releasedDiv.style.color = "rgb(255, 255, 255)";
                    releasedDiv.style.backgroundColor = "rgb(76, 175, 80)";
                    releasedDiv.textContent = "Released";
                } else {
                    releasedDiv.textContent = "        ";
                }

                const downloadButton = create("span", mainContainer);
                downloadButton.classList.add("material-symbols-outlined");
                if (!!song.link) downloadButton.textContent = "download";
                downloadButton.onclick = async function (event) {
                    event.stopPropagation();
                    downloadaudio(mainContainer.getAttribute("link"));
                };
            }
        }
    }

    audioplayer = select("audio");
    audioplayer.addEventListener("ended", function(){
        audioplayer.currentTime = 0;
        if(!!previousbutton) previousbutton.textContent = "play_circle";
    });
}

window.onload = main;
