### Dividing circle into segments

https://stackoverflow.com/questions/56036195/create-svg-circle-using-path-with-6-segments/56039943

The circle can be divided into 6 segments using the attribute stroke-dasharray

**1**: The full circumference with a radius r = "100px" is equal to 2 x 3.14159 x 100 = 628.318px
The length of one sector 628.318 / 6 = 104.72px
Parameters for attribute stroke-dasharray = "100 4.72"

**2**: The full circumference with a radius r = "150px" is equal to 2 x 3.14159 x 150 = 942.477px
The length of one sector 942.477 / 6 = 157.1px
Parameters for attribute stroke-dasharray = "150 7.1"

**3**: The full circumference with a radius r = "150px" is equal to 2 x 3.14159 x 150 = 942.477px
The length of one sector 942.477 / 12 = 78.53975px
Parameters for attribute stroke-dasharray = "75 3.54"


### Reference
- https://css-tricks.com/snippets/css/keyframe-animation-syntax/
- next, place numbers on circle path with sgv: http://thenewcode.com/482/Placing-Text-on-a-Circle-with-SVG
- https://codepen.io/rdfriedl/pen/rOegaP
- https://oreillymedia.github.io/Using_SVG/extras/ch07-textpaths.html
- https://stackoverflow.com/questions/56036195/create-svg-circle-using-path-with-6-segments/56039943
- https://davidwalsh.name/css-variables-javascript
- https://javascript.info/css-animations

### Circle path text

```html
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" height="300px" width="300px">
	<path id="myTextPath" d="M 64,0 A 64,64 0 0 1 -64,0 A 64,64 0 0 1 64,0" transform="translate(200,200)" fill="none" stroke="darkblue" stroke-width="25"/>
    
	<text style="stroke: #000000;" fill="white" stroke-width="0" letter-spacing="2px">
      <textPath xlink:href="#myTextPath"><tspan dy="5">Text along a curved path...</tspan></textPath>
    </text>
</svg>
```