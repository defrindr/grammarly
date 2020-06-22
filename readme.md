# Gramarly

Simple grammarly package.

## Installation

```
npm install @defrindr/grammarly --save
```
Or
```
npm install grammarly --save
```

## Example

```javascript
const grammarly = require('grammarly');

(async function() {
    let correction = await grammarly('i wont to be slep').catch(e => e);
    console.log(correction);
})();
```
Response : 
```javascript
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