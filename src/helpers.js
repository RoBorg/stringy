export function copy (text) {
  const element = document.createElement('input');
  document.body.appendChild(element);
  element.value = text;
  element.select();
  document.execCommand('copy');
  element.remove();
}

export default {
  copy
};
