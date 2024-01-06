import { lexer } from '../../dependancies/lexer.js';
import { select, create } from '../../dependancies/utils.js';
import { fade, fetchaudio, downloadaudio, play_audio, audioplayer, previousbutton } from '../../dependancies/audio.js';

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

// ty ChatGPT
const currentDate = new Date();

const convertToDate = (dateStr) => {
    const [day, month, year] = dateStr.split('/').map(Number);

    return new Date(`20${year}/${month}/${day}`);
};

function sortByDate(inputObject) {
    // Convert the input object to an array
    const dataArray = Object.values(inputObject);
    // Sort the array based on the "date" property
    dataArray.sort((a, b) => {
        const dateA = convertToDate(a.date);
        const dateB = convertToDate(b.date);

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
// Main
async function main() {
    const md = await fetch("./index.md").then((response) => {return response.text()});
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
    var currentAlbum = {
        name: "",
        color: "",
        background: ""
    }
    
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
            currentAlbum = {
                name: tokens.value,
                color: tokens.textcolor,
                background: tokens.background
            }

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
            Holder.innerHTML += `
            <div style="color: var(--light-primary); gap: 8px; padding: 8px; border-radius: 4px; font-size: 16px; display: flex; align-items: center; cursor: pointer; -webkit-user-select: none; -moz-user-select: none; user-select: none;">
                <div style="width: 300px;margin-left: 3.5%;overflow: shown;white-space: pre;">Song</div>
                <div class="Track_length__yIb3d" style="width: 300px; overflow: shown;margin-right:-15%">Leak Date</div>
                <div class="Track_length__yIb3d" style="margin-right:5%">Recording Date</div>
            </div>
            `

            var songs = tokens.value;
            var songsLength = Object.keys(songs).length;

            // Sort by leak date
            songs = sortByDate(songs);
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
                    console.log(adjustedLink)
                    if (playButton.textContent == "pause_circle") {
                        playButton.textContent = "play_circle";
                        fade(audioplayer, 0);
                    } else {
                        if (previousbutton == playButton) {
                            playButton.textContent = "pause_circle";
                            fade(audioplayer, 1);
                        } else {
                            await play_audio(adjustedLink, playButton);
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
                        if (song.length == "Original") {
                            QualityTag.style.color = "rgb(255, 255, 255)";
                            QualityTag.style.backgroundColor = "rgb(65, 240, 92)";
                            QualityTag.textContent = "OG File";
                        }
                    }
                }

                if (song.length != undefined && song.length != "Original") {
                    const LengthTag = create("span", innerDiv1);
                    LengthTag.classList.add("Track_tag__WTlmD");
                    var LengthColors = availableColors[song.length];
                    if (!!LengthColors) {
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

                mainContainer.setAttribute("data-content", !!song.description ? song.description : "")

                const releaseDateDiv = create("div", mainContainer);
                if (song.date != undefined) {
                    releaseDateDiv.classList.add("Track_length__yIb3d", "Track_date");
                    releaseDateDiv.textContent = song.date;
                }
                
                const leakDateDiv = create("div", mainContainer);
                leakDateDiv.classList.add("Track_date");
                leakDateDiv.textContent = song.recordingdate;

                const downloadButton = create("span", mainContainer);
                downloadButton.classList.add("material-symbols-outlined","downloadbtn");
                if (!!song.link) downloadButton.textContent = "download";
                downloadButton.onclick = async function (event) {
                    event.stopPropagation();
                    downloadaudio(mainContainer.getAttribute("link"));
                };

                if (song.date != undefined && song.length != "Snippet") {
                    const entryDate = convertToDate(song.date);
                    const oneWeekAgo = new Date(currentDate);
                    oneWeekAgo.setDate(currentDate.getDate() - 7);
            
                    if (entryDate >= oneWeekAgo && entryDate <= currentDate) {
                        const cloned = mainContainer.cloneNode(true);
                        const playButton = select("span", cloned);
                        const clonedplayButton = playButton.cloneNode(true);
                        //playButton.insertAdjacentElement('afterend', clonedplayButton)
                        
                        playButton.classList.remove("material-symbols-outlined", "Track_play");
                        playButton.classList.add("albumname");
                        playButton.textContent = currentAlbum.name;
                        playButton.style.color = currentAlbum.color;
                        playButton.style.background = currentAlbum.background;

                        cloned.onclick = async function () {
                            let adjustedLink = cloned.getAttribute("link");
                            let playButton = select("span", cloned);
                            console.log(adjustedLink)
                            if (previousbutton == playButton && !!playButton) {
                                if (!audioplayer.paused) {
                                    await fade(audioplayer, 0);
                                    audioplayer.pause();
                                } else {
                                    fade(audioplayer, 1);
                                }
                            } else {
                                await play_audio(adjustedLink, playButton);
                            }
                        };

                        select(".downloadbtn", cloned).onclick = async function (event) {
                            event.stopPropagation();
                            downloadaudio(cloned.getAttribute("link"));
                        };
        
                        select("body > div > div.unreleased_container__IqK0q > details.EraGroup_era__D2P9b > div").appendChild(cloned)
                    }
                }
            }
        }
    }

    console.log("Loaded all songs, cleaning duplicates")
    // Cleanup
    const albums = document.querySelectorAll(".EraCard_tracks__rI0Kj");
    
    const samenamestuff = {}
    albums.forEach(album => {

        const samenametracks = {};
        // Access the children of each album
        const albumChildren = album.children;
    
        // Loop through each child of the album
        for (let i = 0; i < albumChildren.length; i++) {
            const child = albumChildren[i];

            if (child.classList.contains("Track_track__j1JOX")) {
                let txt = select(".Track_name", child).textContent.trim()
                samenametracks[txt] = (samenametracks[txt] || 0) + 1;
            }
        }

        Object.entries(samenametracks).forEach(([trackName, count]) => {
            if (count > 1) {
                console.log(trackName,count)
                // Create a details element for track names with 2 or more occurrences
                const detailsElement = document.createElement("details");
                const summaryElement = document.createElement("summary");
                summaryElement.textContent = `${trackName} (${count})`;
                detailsElement.appendChild(summaryElement);
    
                // Append the corresponding children to the details element
                for (let i = 0; i < albumChildren.length; i++) {
                    const child = albumChildren[i];
                    const trackNameElement = child.querySelector(".Track_name");
    
                    if (trackNameElement && trackNameElement.textContent.trim() === trackName) {
                        const clonedChild = child.cloneNode(true);

                        // Copy over the onclick attribute to the cloned element
                        if (child.onclick) {
                            clonedChild.onclick = async function () {
                                let adjustedLink = clonedChild.getAttribute("link");
                                var playButton = select("span", clonedChild)
                                if (playButton.textContent == "pause_circle") {
                                    playButton.textContent = "play_circle";
                                    fade(audioplayer, 0);
                                } else {
                                    if (previousbutton == playButton) {
                                        playButton.textContent = "pause_circle";
                                        fade(audioplayer, 1);
                                    } else {
                                        await play_audio(adjustedLink, playButton);
                                    }
                                }
                            };
                            clonedChild.setAttribute("link", child.getAttribute("link"))
                        }

                        detailsElement.appendChild(clonedChild);

                        child.remove();
                        i--;
                    }
                }
    
                // Add the details element to the map
                samenamestuff[trackName] = detailsElement;
                
                album.parentElement.appendChild(detailsElement);
            }
        });

    });

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
