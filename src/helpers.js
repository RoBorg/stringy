export function copy (text) {
  const element = document.createElement('textarea');
  document.body.appendChild(element);
  element.value = text;
  element.select();
  document.execCommand('copy');
  element.remove();
};

export function isImage (text) {
  return new Promise(resolve => {
    const image = new Image();

    image.onload = () => resolve(true);
    image.onerror = () => resolve(false);
    image.src = text;
  });
};

export default {
  copy,
  isImage
};
