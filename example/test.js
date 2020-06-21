const grammarly = require('./../main.js');

(async function() {
    let correction = await grammarly('i wont to be slep');
    console.log(correction);
})();