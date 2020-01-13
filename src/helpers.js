export function copy (text) {
  const element = document.createElement('textarea');
  document.body.appendChild(element);
  element.value = text;
  element.select();
  document.execCommand('copy');
  element.remove();
}

export async function paste () {
  const text = await navigator.clipboard.readText();

  return text;
}

export function imageInfo (text) {
  const result = {
    isImage: false,
    image: null,
    width: null,
    height: null
  };

  return new Promise(resolve => {
    const image = new Image();

    image.onload = () => {
      result.isImage = true;
      result.image = image;
      result.width = image.width;
      result.height = image.height;
      resolve(result);
    };
    image.onerror = () => resolve(result);
    image.src = text;
  });
}

export default {
  copy,
  imageInfo
};
