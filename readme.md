# Gramarly
Simple grammar

## Example

```javascript
const grammarly = require('./../main.js');

(async function() {
    let correction = await grammarly('i wont to be slep');
    console.log(correction);
})();
```
Response : 
```
Original : "i wont to be slep"
Correction : "I want to be sleeping"
===========
[  spell    ]   I -> refers to the speaker or writer
[  spell    ]   want
[  grammar  ]   sleeping
```

## TODOs
- [ ] Change response to json

## License
This project under [MIT LICENSE](license.md)