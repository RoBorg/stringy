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
