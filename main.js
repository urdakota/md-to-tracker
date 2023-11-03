// Just some functions
const select = (_, el=document) => el.querySelector(_);

// constants
const table = ["song", "features", "producer", "description", "date", "length", "type", "quality", "released", "link"];
const filetype = {
    
}
const quality = {
    Lost: { background: "rgb(153, 153, 153)", textcolor: "rgb(0, 0, 0)" },
    NA: { background: "rgb(243, 243, 243)", textcolor: "rgb(0, 0, 0)" },
    LQ: { background: "rgb(255, 0, 0)", textcolor: "rgb(255, 255, 255)" },
    HB: { background: "rgb(251, 188, 4)", textcolor: "color:rgb(0, 0, 0)" },
    HQ: { background: "rgb(232, 175, 13)", textcolor: "color:rgb(0, 0, 0)" },
    CDQ: { background: "rgb(76, 175, 80)", textcolor: "rgb(255, 255, 255)" },
    Lossless: { background: "rgb(69, 188, 255)", textcolor: "rgb(255, 255, 255)" }
}
    
// Main
async function main() {
    const md = await fetch("https://urdakota.github.io/md-to-tracker/example.md").then(response => { return response.text() });

    // Read the entire md file & format into readable object
    var lex = md.split('\n');
    var lexed = {}
    for (let i = 0; i < lex.length; i++) {
        var length = Object.keys(lexed).length;
        var previousDictionary = lexed[length];
        var tokens = lex[i];

        var cleaned = tokens.replace(tokens.split(" ")[0], "").trim();
        var type = "Text";

        if (tokens.startsWith("# ")) { type = "Album", lexed[length + 1] = { token: "Album", value: cleaned, description: "", image: "", background: "", textcolor: "" } };
        if (tokens.startsWith("## ")) { type = "Group", lexed[length + 1] = { token: "Group", value: cleaned, description: "" } };
        if (tokens.startsWith("| "))  type = "Table";

        if (type == "Table") {
            var previousDictionary = lexed[length];
            var previousDictionaryValueLength = 0;

            if (!!previousDictionary && previousDictionary.token !== "Table") lexed[length + 1] = { token: "Table", index: 0, value: {} };
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
                    if(value == "-") value = "";

                    previousDictionary.value[previousDictionaryValueLength + 1][buh[key-1]] = value;
                }
            }
        }

        if (type == "Text" && tokens !== "") {
            if(!previousDictionary){
                lexed[length + 1] = { token: "Title", value: tokens.trim(), image: ""};
            } else {
                switch(previousDictionary.token){
                    case "Title": 
                        if (previousDictionary.image == "") { previousDictionary.image = tokens.trim() }
                        break;
                    case "Album":
                        if(previousDictionary.description == ""){
                            previousDictionary.description = tokens.trim();
                        } else {
                            if (previousDictionary.image == "") { previousDictionary.image = tokens.trim() }
                            else if (previousDictionary.background == "") { previousDictionary.background = tokens.trim() }
                            else if (previousDictionary.textcolor == "") { previousDictionary.textcolor = tokens.trim() }
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
    var Title = select(".Header_title__CHLQo");
    var container = select(".unreleased_container__IqK0q")
    var length = Object.keys(lexed).length;

    // Tracker Title
    select("span", Title).innerText = lexed[1].value; // Title
    select("img", Title).src = lexed[1].image; // Image

    // Create Albums
    for (let i = 1; i < length+1; i++) {
        var previousDictionary = lexed[length];
        var tokens = lexed[i];
        console.log(i, tokens);

        if (tokens.token == "Album") {
            const detailsElement = document.createElement("details");
            detailsElement.classList.add("EraCard_era__5_ZGH");
            detailsElement.id = tokens.value
            container.appendChild(detailsElement);

            const summaryElement = document.createElement("summary");
            summaryElement.style.backgroundColor = tokens.background;
            detailsElement.appendChild(summaryElement);

            const imageElement = document.createElement("img");
            imageElement.alt = tokens.value + " cover";
            imageElement.src = tokens.image;
            imageElement.width = 136;
            imageElement.height = 136;
            imageElement.decoding = "async";
            imageElement.dataset.nimg = "1";
            imageElement.className = "EraCard_cover__6ANFI";
            imageElement.loading = "lazy";
            imageElement.style.color = "transparent";
            summaryElement.appendChild(imageElement);

            const TextDiv = document.createElement("div");
            summaryElement.appendChild(TextDiv);

            const titleDiv = document.createElement("div");
            titleDiv.className = "EraCard_title__Xknl9";
            TextDiv.appendChild(titleDiv);

            const titleSpan = document.createElement("span");
            titleSpan.style.color = tokens.textcolor;
            titleSpan.textContent = tokens.value;
            titleDiv.appendChild(titleSpan);

            const descDiv = document.createElement("div");
            descDiv.className = "EraCard_description__3MKFd";
            TextDiv.appendChild(descDiv);

            const descSpan = document.createElement("span");
            descSpan.style.color = tokens.textcolor;
            descSpan.textContent = tokens.description;
            descDiv.appendChild(descSpan);
            
            const tracksDiv = document.createElement("div");
            tracksDiv.className = "EraCard_tracks__rI0Kj";
            detailsElement.appendChild(tracksDiv);


            const innerDiv = document.createElement("div");
            innerDiv.id = "b46fee5b199307af84ee2bc370d94488";
            innerDiv.setAttribute("tag", "div");
            innerDiv.className = "Tooltip_tooltip__q1OLA Track_track__j1JOX";
            innerDiv.setAttribute("content", "No description available.");
            innerDiv.setAttribute("data-content", "No description available.");

            // Create the first nested div
            const firstNestedDiv = document.createElement("div");

            // Create a text node for "Hohner Melodica #1" and append it to the first nested div
            const trackNameText = document.createTextNode("Hohner Melodica #1");
            firstNestedDiv.appendChild(trackNameText);

            // Create a span element with class "Track_tag__WTlmD" for the "Lossless" tag
            const tagSpan = document.createElement("span");
            tagSpan.className = "Track_tag__WTlmD";
            tagSpan.style.color = "rgb(255, 255, 255)";
            tagSpan.style.backgroundColor = "rgb(69, 188, 255)";
            tagSpan.textContent = "Lossless";

            // Append the tag span to the first nested div
            firstNestedDiv.appendChild(tagSpan);

            // Append the first nested div to the inner div
            innerDiv.appendChild(firstNestedDiv);

            // Create the second nested div for the track length
            const secondNestedDiv = document.createElement("div");
            secondNestedDiv.className = "Track_length__yIb3d";
            secondNestedDiv.textContent = "0:02";

            // Append the second nested div to the inner div
            innerDiv.appendChild(secondNestedDiv);

            // Append the inner div to the outer tracks div
            tracksDiv.appendChild(innerDiv);
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
