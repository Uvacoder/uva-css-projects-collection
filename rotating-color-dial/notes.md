
### change colour of pointer

```css

input[type="radio"]#pos-1:checked ~ .pointer > .end {
  border-bottom: solid var(--pointer-width) purple;
  transition: all 1s ease;
}

input[type="radio"]#pos-1:not(:checked) ~ .pointer > .end {
  border-bottom: solid var(--pointer-width) green;
  transition: all 1s ease;
}
```
