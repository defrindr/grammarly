const req = require('request-promise')

const uri = "https://orthographe.reverso.net/RISpellerWS/RestSpeller.svc/v1/CheckSpellingAsXml/language=eng?outputFormat=json&doReplacements=false&interfLang=en&dictionary=both&spellOrigin=interactive&includeSpellCheckUnits=true&includeExtraInfo=true&isStandaloneSpeller=true";
const headers = {
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

/**
 * Checking grammar from
 * https://www.reverso.net
 * 
 * @param {*} word 
 */
const grammarly = async (word) => {
    return new Promise(async (resolve, reject) => {
        /**
         * declare vars
         */
        let source = {};
        let result = {};
        let wordCorrections = {};
        let correctionWord = [];
        let correctTemp = [];
        let checkAlternative = [];
        let definition = [];

        try {
            source = await req.post({
                uri: uri,
                headers: headers,
                body: JSON.stringify(word)
            }).then(resp => JSON.parse(resp)).catch(e => reject(e))

            wordCorrections = source.Corrections.match(regErr);

            for (let i = 0; i < wordCorrections.length; i++) {
                correctTemp = wordCorrections[i].match(regDetailError).slice(1, 4);

                checkAlternative = correctTemp[2].match(regAlt);

                if (checkAlternative != null) {
                    definition = checkAlternative[1];
                } else {
                    definition = null;
                }

                correctionWord.push({
                    'type': correctTemp[0],
                    'word': correctTemp[1],
                    'definition': definition,
                });
            }

            result = {
                'original': source.OriginalText,
                'correctText': source.AutoCorrectedText,
                'correction': correctionWord
            };

            resolve(result);
        } catch (e) {
            reject(e);
        }
    })
}

module.exports = grammarly;