import { lexer } from '../dependancies/lexer.js';
import { select, create } from '../dependancies/utils.js';
import { fade, fetchaudio, downloadaudio, play_audio, audioplayer, previousbutton } from '../dependancies/audio.js';

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
    Tagged: {
        background: "rgb(179, 96, 6)",
        textcolor: "color:rgb(255, 255, 0)",
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
    const md = await fetch("./testing.md").then((response) => {return response.text()});
    // Read the entire md file & format into readable object
    var splitmd = md.split("\n");
    var lexed = await lexer(splitmd);

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
            Holder.innerHTML += "<pre>          Song                                                 Recording Date                     Leak Date   </pre>"

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
                if (adjustedLink == undefined)
                    songname.style = "color:var(--light-secondary);";

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

                if (song.info != undefined) {
                    const infoDiv = create("div", innerDiv1);
                    infoDiv.classList.add("Track_aliases__Cctz8");
                    const infoSpan = create("span", infoDiv);
                    infoSpan.textContent = song.info;
                }

                mainContainer.setAttribute("data-content", song.description)

                const releaseDateDiv = create("div", mainContainer);
                if (song.date != undefined) {
                    releaseDateDiv.classList.add("Track_length__yIb3d", "Track_date");
                    releaseDateDiv.textContent = song.date;
                }
                
                const leakDateDiv = create("div", mainContainer);
                if (song.recordingdate != undefined) {
                    leakDateDiv.classList.add("Track_length__yIb3d", "Track_date");
                    leakDateDiv.textContent = song.recordingdate;
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
}

window.onload = main;

function findTooltipElement(element) {
    while (element && !element.classList.contains('Tooltip_tooltip__q1OLA')) {
        return findTooltipElement(element.parentElement);
    }
    return element;
}

document.addEventListener('mousemove', function (event) {
    // Get the current element the mouse is over
    var currentElement = findTooltipElement(event.target);
    
    if (!!currentElement && currentElement.getAttribute("data-content")) {
        currentElement.style.setProperty('--mouse-x', event.clientX + 'px');
        currentElement.style.setProperty('--mouse-y', event.clientY + 'px');
    }
});
