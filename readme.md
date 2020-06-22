# Gramarly
Simple grammarly package.

## Example

```javascript
const grammarly = require('./main.js');

(async function() {
    let correction = await grammarly('i wont to be slep').catch(e => e);
    console.log(correction);
})();
```
Response : 
```json
{
  original: '"i wont to be slep"',
  correctText: '"I want to be sleeping"',
  correction: [
    {
      type: 'spell',
      word: 'I',
      definition: 'refers to the speaker or writer'
    },
    { type: 'spell', word: 'want', definition: null },
    { type: 'grammar', word: 'sleeping', definition: null }
  ]
}
```

## TODOs
- [x] Change response to json

## License
This project under [MIT LICENSE](license.md)