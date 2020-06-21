const req = require('request-promise')

const uri = "https://orthographe.reverso.net/RISpellerWS/RestSpeller.svc/v1/CheckSpellingAsXml/language=eng?outputFormat=json&doReplacements=false&interfLang=en&dictionary=both&spellOrigin=interactive&includeSpellCheckUnits=true&includeExtraInfo=true&isStandaloneSpeller=true";

let headers = {
    "created": "01/01/0001 00:00:00",
    "accept": "application/json, text/javascript, */*; q=0.01",
    "accept-encoding": "gzip, deflate, br",
    "accept-language": "en-GB,en-US;q=0.9,en;q=0.8,id;q=0.7",
    "cache-control": "no-cache",
    "Content-Type": "application/x-www-form-urlencoded",
    "origin": "https://www.reverso.net",
    "referer": "https://www.reverso.net/spell-checker/english-spelling-grammar/",
    "user-agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.122 Safari/537.36",
    "username": "OnlineSpellerWS",
};


const regErr = /\<error\s[\w].+?>\<[\/]?error\>/gim;
const regDetailError = /<error id="\d+"\stype="(\w+)"\s\w+="([\w\s\,\?\&\^\%\#\@\!\+\=\/\\\.\>\<\(\)]+)".+?>(.+?)<\/error>/i;
const regAlt = /<alternative\sid="0"\sdefinition="([\w\s\,\?\&\^\%\#\@\!\+\=\/\\\.\>\<\(\)]+?)"+?>([\w\s\,\?\&\^\%\#\@\!\+\=\/\\\.\>\<\(\)]+?)<\/alternative>/i;



const grammarly = async(body) => {
    let source = await req.post({
        uri: uri,
        headers: headers,
        body: JSON.stringify(body)
    }).then(resp => JSON.parse(resp))

    let wordCorrections = source.Corrections.match(regErr);

    arr = [];

    for (let i = 0; i < wordCorrections.length; i++) {
        arr.push(wordCorrections[i].match(regDetailError).slice(1, 4));
    }

    for (let i = 0; i < wordCorrections.length; i++) {
        let checker = arr[i][2].match(regAlt);
        if (checker != null) {
            arr[i][2] = checker.splice(1, 3);
        } else {
            arr[i][2] = null;
        }
    }

    correctionWord = "";

    for (let i = 0; i < arr.length; i++) {
        let cnt = arr[i][0].length
        if (cnt < 7) {
            let spaceCnt = 7 - cnt;
            let spacing = " ";
            arr[i][0] += spacing.repeat(spaceCnt);
        }
        correctionWord += `[  ${arr[i][0]}  ]\t${arr[i][1]}`;
        if (arr[i][2] != null) {
            correctionWord += ` -> ${arr[i][2][0]}`
        }
        correctionWord += `\n`;
    }

    text = `Original : ${source.OriginalText}\nCorrection : ${source.AutoCorrectedText}\n===========\n${correctionWord}`;


    return text;
}

module.exports = grammarly;