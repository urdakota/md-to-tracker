var md = await fetch("/md-to-tracker/example.md").then(response => { return response.text() });
// md file

var lex = md.split('\n');
var lexed = {}
for (let i = 0; i < lex.length; i++) {
    var length = Object.keys(lexed).length;
    var tokens = lex[i];
    var cleaned = tokens.replace(tokens.split(" ")[0], "").trim();
    var token = "Text";

    if (tokens.startsWith("# ")) { token = "Album", lexed[length + 1] = { token: "Album", value: cleaned, description: "" } };
    if (tokens.startsWith("## ")) { token = "Group", lexed[length + 1] = { token: "Group", value: cleaned, description: "" } };
    if (tokens.startsWith("| "))  token = "Table";

    if (token == "Table") {
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

    if (token == "Text" && tokens !== "") {
        lexed[length].description = tokens.trim();
        lexed[length] = lexed[length];
    }

    //for (const tokens of md.split(' ')) {
        
    //};
};

console.log(lexed);
