import { select, wait } from '../dependancies/utils.js';

export const autoplay = true;
export var previousbutton;
export var audioplayer;
var fadingto = 1;
var isfading = false;

export const fade = async (element, volume) => {
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

export const fetchaudio = async (link) => {
    if (link.includes("/music.m4a")) return link;
    if (link.includes("pillowcase.zip")) {
        let hash = link.split("/");
        return `https://api.pillowcase.zip/api/get/${hash[hash.length-1]}`;
    } else if (link.includes("pixeldrain.com")) {
        let hash = link.split("/");
        return `https://pixeldrain.com/api/file/${hash[hash.length-1]}`;
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

export const downloadaudio = async (link) => {
    if (link.includes("pilowcase.zip")) {
        let hash = link.split("/")[-1];
        select('#download_helper').src = `https://api.pillowcase.zip/api/download/${hash}`;
    } else {
        select("#page_opener").href = link;
        select("#page_opener").click();
    }
}

export const play_audio = async (link, button) => {
    audioplayer = select("audio");
    link = await fetchaudio(link);
    if (!!previousbutton) {
        if (!!button && button.classList.contains("Track_play")) previousbutton.textContent = "play_circle";
        previousbutton.parentElement.style["background-color"] = "";
    }
    if (audioplayer.src != link) audioplayer.src = link;
    audioplayer.currentTime = 0;
    fade(audioplayer, 1);
    if (!!button && button.classList.contains("Track_play")) button.textContent = "pause_circle";
    button.parentElement.style["background-color"] = "hsla(0, 0%, 100%, 0.1)";

    previousbutton = button;
    // Fixes weird bug where audio gets stuck very low
    fade(audioplayer, 1);
};

document.addEventListener('DOMContentLoaded', function () {
    audioplayer = select("audio");
    audioplayer.addEventListener("ended", async function () {
        if (!!previousbutton && previousbutton.textContent != "play_circle"){ // fixes weird skipping bug when paused for too long
            if (!!previousbutton) previousbutton.textContent = "play_circle";
            if (autoplay) {
                if (this.currentTime >= this.duration - 1) {
                    var song = previousbutton.parentElement;
                    var songs = Array.from(song.parentElement.childNodes)
                    var nextsong = songs.indexOf(song) + 1;
                    if (!!songs[nextsong]) {
                        let nextelement = songs[nextsong];
                        let audiolink = await fetchaudio(nextelement.getAttribute("link"));
                        await play_audio(audiolink, select(".Track_play", nextelement));
                    } else {
                        if (song.parentElement.parentElement.tagName.toLowerCase() === "details") {
                            var songs = Array.from(song.parentElement.parentElement.childNodes)
                            var nextsong = songs.indexOf(song.parentElement) + 1;
                            if (!!songs[nextsong]) {
                                let nextelement = songs[nextsong];
                                if (nextelement.tagName.toLowerCase() === "details") {
                                    let audiolink = await fetchaudio(nextelement.children[1].getAttribute("link"));
                                    await play_audio(audiolink, select(".Track_play", nextelement));
                                }
                            }
                        }
                    }
                }
            }
        }
    });
});
