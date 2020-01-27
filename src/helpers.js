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

// From https://codereview.stackexchange.com/questions/59428/validating-utf-8-byte-array
export function isValidUtf8 (intArray) {
  const arrayLength = intArray.length;
  let expectedLen;

  for (let i = 0; i < arrayLength; i++) {
    // Lead byte analysis
    if ((intArray[i] & 0b10000000) === 0b00000000) {
      continue;
    } else if ((intArray[i] & 0b11100000) === 0b11000000) {
      expectedLen = 2;
    } else if ((intArray[i] & 0b11110000) === 0b11100000) {
      expectedLen = 3;
    } else if ((intArray[i] & 0b11111000) === 0b11110000) {
      expectedLen = 4;
    } else if ((intArray[i] & 0b11111100) === 0b11111000) {
      expectedLen = 5;
    } else if ((intArray[i] & 0b11111110) === 0b11111100) {
      expectedLen = 6;
    } else {
      return false;
    }

    // Count trailing bytes
    while (--expectedLen > 0) {
      if (++i >= arrayLength) {
        return false;
      }

      if ((intArray[i] & 0b11000000) !== 0b10000000) {
        return false;
      }
    }
  }

  return true;
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

    response.isText = isValidUtf8(intArray);

    reader.onloadend = async () => {
      response.asDataSrc = reader.result;

      const imageInfoResult = await imageInfo(response.asDataSrc);
      response.isImage = imageInfoResult.isImage;
      response.imageWidth = imageInfoResult.width;
      response.imageHeight = imageInfoResult.height;

      if (response.isImage) {
        response.isText = false;
      }

      if (response.isText) {
        response.asText = Base64.decode(response.asDataSrc.replace(/^.+?,/, ''));

        // See if we have any low-value characters, in which case our string might
        // be valid UTF-8 but is probably binary anyway
        for (let i = 0; i < response.asText.length; i++) {
          if (response.asText.charCodeAt(i) <= 8) {
            response.isText = false;
            response.asText = '';
            break;
          }
        }
      }

      if (response.isText) {
        response.isHtml = /<(!doctype|html|head|title|body|div|span|a|p)/i.test(response.asText);
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

export function urlEncodedToUint8Array(str) {
  try {
    return Uint8Array.from(decodeURIComponent(str), c => c.charCodeAt(0));
  } catch (e) {
    const bytes = [];
    let hexChar = 0;

    for (let i = 0; i < str.length; i++) {
      const char = str[i];

      if (hexChar && !/[0-9a-f]/i.test(char)) {
        throw new Error('Invalid data: ' + char);
      }

      if (char === '%') {
        hexChar = 1;
      } else if (hexChar === 1) {
        hexChar++;
      } else if (hexChar === 2) {
        hexChar = 0;
        bytes.push(parseInt(str[i - 1] + str[i], 16));
      } else {
        bytes.push(char.charCodeAt(0));
      }
    }

    return Uint8Array.from(bytes);
  }
};

export default {
  copy,
  imageInfo,
  getIp,
  getIpInfo,
  urlEncodedToUint8Array
};
