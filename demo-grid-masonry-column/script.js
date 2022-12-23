const toggle = (el) => {
  const ul = el.parentNode.querySelector('ul');
  ul.classList.toggle('closed');
  ul.classList.toggle('open');
}