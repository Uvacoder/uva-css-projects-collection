- https://css-tricks.com/updating-a-css-variable-with-javascript/
- Use regex to extract numbers from mixed string: https://stackoverflow.com/questions/42532450/extract-number-from-string-javascript

```js
const extractNum = (str) => {
  return (str.match(/\d+/g) || []).map(n => parseInt(n)).shift();
}
```
