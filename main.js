// Just some functions
const select = (_, el=document) => el.querySelector(_);

// Load md file
const md = await fetch("/md-to-tracker/example.md").then(response => { return response.text() });


var lex = md.split('\n');
var lexed = {}
for (let i = 0; i < lex.length; i++) {
    var length = Object.keys(lexed).length;
    var previousDictionary = lexed[length];

    var cleaned = tokens.replace(tokens.split(" ")[0], "").trim();
    var tokens = lex[i];
    var type = "Text";

    if (tokens.startsWith("# ")) { type = "Album", lexed[length + 1] = { token: "Album", value: cleaned, description: "", image: "" } };
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
        var buh = ["song", "features", "producer", "description", "date", "length", "quality", "released", "link"];
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
            lexed[length + 1] = { token: "Title", value: cleaned, image: ""};
        } else {
            switch(previousDictionary.token){
                case "Title": 
                    previousDictionary.image = tokens.trim();
                    break;
                case "Album":
                    if(previousDictionary.description == ""){
                        previousDictionary.description = tokens.trim();
                    } else {
                        previousDictionary.image = tokens.trim();
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
};

console.log("Loaded Tracker & Formatted");
alert(lexed);

// Begin Modifying Website

var Title = select("Header_title__CHLQo");

Title.innerText = lexed[1].value; // Title
select("img",Title).src = lexed[1].image; // Image
