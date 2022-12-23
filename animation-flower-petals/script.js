const $ = (el) => document.querySelector(el);
const doc = document.documentElement;
const setCssVar = (prop, value) => doc.style.setProperty(prop, value);
const getCSSVar = (prop) => getComputedStyle(doc).getPropertyValue(prop).trim();

const initialSettings = {};
const props = ['speed', 'rotation', 'origin-x', 'origin-y'];

props.forEach(prop => {
  const input = $(`#${prop}`);
  initialSettings[prop] = { 
    value: input.value, 
    unit: input.dataset.unit 
  }
  $(`#${prop}`).addEventListener('input', (e) => {
    setCssVar(`--${prop}`, e.target.value + input.dataset.unit);
  });
});

$('#reset').addEventListener('click', (e) => {
  props.forEach(prop => {
    const { value, unit } = initialSettings[prop];
    setCssVar('--' + prop, value + unit);
    $(`#${prop}`).value = value;
  });
});

$('#play').addEventListener('click', (e) => {
  const running = getCSSVar('--play-state') === 'running';
  const toggledState = running ? 'paused' : 'running';
  setCssVar('--play-state', toggledState);
  e.target.textContent = running ? 'Play' : 'Pause';
});