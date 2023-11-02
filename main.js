var md = `
# Tundra Boy Lonely
2014-2016 Era
## Gorgeous Records
Tracks released by Gorgeous Records
| Song                             | Description                                          | Leak Date (d/m/y) | Length | Quality | Released | Link |
| -------------------------------- | ---------------------------------------------------- | ----------------- | ------ | ------- | -------- | ---- |
| Hunnit Band Lone \*Extreme Trap* | Song released on May 19th, 2016 Title may be wrong   | 19/5/2016         | N/A    | N/A     | Lost     | N/A  |
| CITGLO! [VERY RARE] [NEW]        | (prod. HELLASKETCHY) Song Released on May 23rd, 2016 | 23/5/2016         | N/A    | N/A     | Lost     | N/A  | 
## Loosies
Songs released in this era that dont fit a particular group
| Song         | Description                                  | Leak Date (d/m/y) | Length | Quality | Released   | Link |
| ------------ | -------------------------------------------- | ----------------- | ------ | ------- | ---------- | ---- |
| Then I'm Off | (prod. Meltycanon) Lone was 14 when Released | 1/6/2016          | N/A    | N/A     | Soundcloud | N/A  |
`

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
        var buh = ["song", "description", "date", "length", "quality", "released", "link"];
        if (previousDictionary) {
            previousDictionaryValueLength = Object.keys(previousDictionary.value).length;
            if (previousDictionary.index >= 2) previousDictionary.value[previousDictionaryValueLength + 1] = {}
        }

        for (let key = 0; key < tbl.length; key++) {
            var value = tbl[key].trimStart().trimEnd();

            if (value !== "" && previousDictionary.index >= 2) {
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
