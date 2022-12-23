const $ = (elem) => document.querySelector(elem);

$('#speed').addEventListener('input', e => {
  $('body').style.setProperty('--speed', e.target.value);
});
