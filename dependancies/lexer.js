
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

export async function lexer(lex) {
    let lexed = {};
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
    }
    return lexed;
}