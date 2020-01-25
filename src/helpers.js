import { Base64 } from 'js-base64';

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
  return new Promise(resolve => {
    const image = new Image();
    const result = {
      isImage: false,
      image: null,
      width: null,
      height: null
    };

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

export function getFileInfo (intArray) {
  return new Promise(resolve => {
    const reader = new FileReader();
    const response = {
      isHtml: false,
      isImage: false,
      isText: true,
      asDataSrc: '',
      asText: '',
      imageWidth: 0,
      imageHeight: 0
    };

    for (let i = 0; i < intArray.length; i++) {
      if (intArray[i] <= 8) {
        response.isText = false; // TODO: better test for valid UTF-8 (or 16?)
      }
    }

    reader.onloadend = async () => {
      response.asDataSrc = reader.result;

      const imageInfoResult = await imageInfo(response.asDataSrc);
      response.isImage = imageInfoResult.isImage;
      response.imageWidth = imageInfoResult.width;
      response.imageHeight = imageInfoResult.height;

      if (!response.isImage && response.isText) {
        response.asText = Base64.decode(response.asDataSrc.replace(/^.+?,/, ''));
        response.isHtml = /<(html|head|title|body|div|span|a|p)/i.test(response.asText); // TODO better test?
      }

      resolve(response);
    };

    // Doesn't matter if the image isn't actually a jpeg
    reader.readAsDataURL(new Blob([intArray], {type: 'image/jpeg'}));
  });
}

export async function getIp (hostname) {
  const regEx = /^((?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?))$/;

  if (regEx.test(hostname)) {
    return hostname;
  }

  const response = await fetch(`https://dns.google/resolve?name=${hostname}`);
  const json = await response.json();

  const statuses = [
    {
      code: 'NOERROR',
      description: 'DNS Query completed successfully'
    },
    {
      code: 'FORMERR',
      description: 'DNS Query Format Error'
    },
    {
      code: 'SERVFAIL',
      description: 'Server failed to complete the DNS request'
    },
    {
      code: 'NXDOMAIN',
      description: 'Domain name does not exist'
    },
    {
      code: 'NOTIMP',
      description: 'Function not implemented'
    },
    {
      code: 'REFUSED',
      description: 'The server refused to answer for the query'
    },
    {
      code: 'YXDOMAIN',
      description: 'Name that should not exist, does exist'
    },
    {
      code: 'XRRSET',
      description: 'RRset that should not exist, does exist'
    },
    {
      code: 'NOTAUTH',
      description: 'Server not authoritative for the zone'
    },
    {
      code: 'NOTZONE',
      description: 'Name not in zone'
    }
  ];

  if (json.Answer) {
      return json.Answer[json.Answer.length - 1].data
  }

  if (json.Status && statuses[json.Status]) {
    throw new Error(`${statuses[json.Status].code}: ${statuses[json.Status].description}`);
  }

  throw new Error('Error resolving hostname');
}

export async function getIpInfo(ip) {
  const response = await fetch(`http://extreme-ip-lookup.com/json/${ip}`);
  const result = await response.json();

  return result;
}

export default {
  copy,
  imageInfo,
  getIp,
  getIpInfo
};
