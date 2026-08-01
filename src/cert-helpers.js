import * as pkijs from 'pkijs';
import * as asn1js from 'asn1js';

const attributeTypeNames = {
  '2.5.4.3': 'CN',
  '2.5.4.4': 'SN',
  '2.5.4.5': 'serialNumber',
  '2.5.4.6': 'C',
  '2.5.4.7': 'L',
  '2.5.4.8': 'ST',
  '2.5.4.9': 'streetAddress',
  '2.5.4.10': 'O',
  '2.5.4.11': 'OU',
  '2.5.4.12': 'title',
  '2.5.4.17': 'postalCode',
  '2.5.4.42': 'GN',
  '2.5.4.43': 'initials',
  '2.5.4.46': 'dnQualifier',
  '2.5.4.65': 'pseudonym',
  '0.9.2342.19200300.100.1.25': 'DC',
  '1.2.840.113549.1.9.1': 'emailAddress',
  '1.2.840.113549.1.9.2': 'unstructuredName'
};

const signatureAlgorithmNames = {
  '1.2.840.113549.1.1.4': 'md5WithRSAEncryption',
  '1.2.840.113549.1.1.5': 'sha1WithRSAEncryption',
  '1.2.840.113549.1.1.11': 'sha256WithRSAEncryption',
  '1.2.840.113549.1.1.12': 'sha384WithRSAEncryption',
  '1.2.840.113549.1.1.13': 'sha512WithRSAEncryption',
  '1.2.840.113549.1.1.10': 'RSASSA-PSS',
  '1.2.840.10045.4.1': 'ecdsa-with-SHA1',
  '1.2.840.10045.4.3.1': 'ecdsa-with-SHA224',
  '1.2.840.10045.4.3.2': 'ecdsa-with-SHA256',
  '1.2.840.10045.4.3.3': 'ecdsa-with-SHA384',
  '1.2.840.10045.4.3.4': 'ecdsa-with-SHA512',
  '1.2.840.10040.4.3': 'dsa-with-sha1',
  '1.3.101.112': 'Ed25519',
  '1.3.101.113': 'Ed448'
};

const extKeyUsageNames = {
  '1.3.6.1.5.5.7.3.1': 'TLS Web Server Authentication',
  '1.3.6.1.5.5.7.3.2': 'TLS Web Client Authentication',
  '1.3.6.1.5.5.7.3.3': 'Code Signing',
  '1.3.6.1.5.5.7.3.4': 'Email Protection',
  '1.3.6.1.5.5.7.3.8': 'Time Stamping',
  '1.3.6.1.5.5.7.3.9': 'OCSP Signing'
};

const generalNameTypeNames = {
  0: 'Other Name',
  1: 'Email',
  2: 'DNS',
  3: 'X.400 Address',
  4: 'Directory Name',
  5: 'EDI Party Name',
  6: 'URI',
  7: 'IP Address',
  8: 'Registered ID'
};

const keyUsageBits = [
  'Digital Signature',
  'Non Repudiation',
  'Key Encipherment',
  'Data Encipherment',
  'Key Agreement',
  'Certificate Sign',
  'CRL Sign',
  'Encipher Only',
  'Decipher Only'
];

function oidName (oid, names) {
  return names[oid] || oid;
}

const domainRegEx = /^(\*\.)?(?=.{1,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/i;

export function domainHref (value) {
  if (typeof value !== 'string' || !domainRegEx.test(value)) {
    return null;
  }

  return `https://${value.replace(/^\*\./, '')}`;
}

function toColonHex (bytes) {
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join(':');
}

function bytesToIp (bytes) {
  if (bytes.length === 4) {
    return Array.from(bytes).join('.');
  }

  if (bytes.length === 16) {
    const groups = [];

    for (let i = 0; i < 16; i += 2) {
      groups.push(((bytes[i] << 8) | bytes[i + 1]).toString(16));
    }

    return groups.join(':');
  }

  return toColonHex(bytes);
}

function formatDn (typesAndValues) {
  return typesAndValues.map(tv => ({
    name: oidName(tv.type, attributeTypeNames),
    oid: tv.type,
    value: tv.value.valueBlock.value
  }));
}

function dnToString (dn) {
  return dn.map(attr => `${attr.name}=${attr.value}`).join(', ');
}

function getPublicKeyInfo (spki) {
  const algOid = spki.algorithm.algorithmId;
  const rawBytes = spki.subjectPublicKey.valueBlock.valueHexView;

  try {
    if (algOid === '1.2.840.113549.1.1.1') {
      const parsed = spki.parsedKey;
      const modulusBytes = parsed.modulus.valueBlock.valueHexView;
      const len = (modulusBytes[0] === 0) ? modulusBytes.length - 1 : modulusBytes.length;

      return { algorithm: 'RSA', size: len * 8 };
    }

    if (algOid === '1.2.840.10045.2.1') {
      const parsed = spki.parsedKey;
      const curveSizes = { 'P-256': 256, 'P-384': 384, 'P-521': 521 };

      return { algorithm: `EC (${parsed.namedCurve})`, size: curveSizes[parsed.namedCurve] || null };
    }
  } catch (e) {
    return { algorithm: oidName(algOid, signatureAlgorithmNames), size: null };
  }

  if (algOid === '1.3.101.112') {
    return { algorithm: 'Ed25519', size: 256 };
  }

  if (algOid === '1.3.101.113') {
    return { algorithm: 'Ed448', size: 456 };
  }

  if (algOid === '1.2.840.10040.4.1') {
    return { algorithm: 'DSA', size: rawBytes.length * 8 };
  }

  return { algorithm: algOid, size: null };
}

function parseKeyUsage (extension) {
  const bytes = extension.extnValue.valueBlock.valueHexView;
  const asn1 = asn1js.fromBER(bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength));
  const valueBytes = asn1.result.valueBlock.valueHexView;
  const unusedBits = asn1.result.valueBlock.unusedBits;
  const totalBits = (valueBytes.length * 8) - unusedBits;
  const flags = [];

  for (let i = 0; i < totalBits; i++) {
    const byte = valueBytes[Math.floor(i / 8)];
    const bit = (byte >> (7 - (i % 8))) & 1;

    if (bit && keyUsageBits[i]) {
      flags.push(keyUsageBits[i]);
    }
  }

  return flags;
}

function findExtension (extensions, oid) {
  return (extensions || []).find(e => e.extnID === oid);
}

function parseExtensions (extensions) {
  const result = {
    subjectAltName: null,
    basicConstraints: null,
    keyUsage: null,
    extKeyUsage: null
  };

  const san = findExtension(extensions, '2.5.29.17');

  if (san) {
    result.subjectAltName = san.parsedValue.altNames.map(name => {
      if (name.type === 7) {
        const ipBytes = name.value.valueBlock.valueHexView;

        return { type: generalNameTypeNames[name.type], value: bytesToIp(ipBytes) };
      }

      if (typeof name.value === 'string') {
        return { type: generalNameTypeNames[name.type] || `Type ${name.type}`, value: name.value };
      }

      return { type: generalNameTypeNames[name.type] || `Type ${name.type}`, value: '(unsupported value)' };
    });
  }

  const bc = findExtension(extensions, '2.5.29.19');

  if (bc) {
    result.basicConstraints = {
      cA: !!bc.parsedValue.cA,
      pathLenConstraint: bc.parsedValue.pathLenConstraint
    };
  }

  const ku = findExtension(extensions, '2.5.29.15');

  if (ku) {
    result.keyUsage = parseKeyUsage(ku);
  }

  const eku = findExtension(extensions, '2.5.29.37');

  if (eku) {
    result.extKeyUsage = eku.parsedValue.keyPurposes.map(oid => oidName(oid, extKeyUsageNames));
  }

  return result;
}

export function pemBlocks (text) {
  const regEx = /-----BEGIN ([A-Z0-9 ]+)-----\r?\n([\s\S]+?)-----END \1-----/g;
  const blocks = [];
  let match;

  while ((match = regEx.exec(text)) !== null) {
    const label = match[1].trim();
    const base64 = match[2].replace(/\s+/g, '');

    let der;

    try {
      const binary = atob(base64);
      der = Uint8Array.from(binary, c => c.charCodeAt(0)).buffer;
    } catch (e) {
      der = null;
    }

    blocks.push({ label, pem: match[0], der });
  }

  return blocks;
}

export async function decodeCertificate (der) {
  const asn1 = asn1js.fromBER(der);

  if (asn1.result.error) {
    throw new Error(asn1.result.error);
  }

  const cert = new pkijs.Certificate({ schema: asn1.result });

  const subject = formatDn(cert.subject.typesAndValues);
  const issuer = formatDn(cert.issuer.typesAndValues);
  const selfSigned = dnToString(subject) === dnToString(issuer);

  const serialBytes = cert.serialNumber.valueBlock.valueHexView;
  const publicKeyInfo = getPublicKeyInfo(cert.subjectPublicKeyInfo);

  const sha1 = await crypto.subtle.digest('SHA-1', der);
  const sha256 = await crypto.subtle.digest('SHA-256', der);

  let signatureValid = null;

  if (selfSigned) {
    try {
      signatureValid = await cert.verify();
    } catch (e) {
      signatureValid = null;
    }
  }

  const now = new Date();

  return {
    type: 'certificate',
    subject,
    subjectString: dnToString(subject),
    issuer,
    issuerString: dnToString(issuer),
    selfSigned,
    signatureValid,
    serialNumber: toColonHex(serialBytes),
    version: cert.version + 1,
    notBefore: cert.notBefore.value,
    notAfter: cert.notAfter.value,
    isExpired: now > cert.notAfter.value,
    isNotYetValid: now < cert.notBefore.value,
    signatureAlgorithm: oidName(cert.signatureAlgorithm.algorithmId, signatureAlgorithmNames),
    publicKeyAlgorithm: publicKeyInfo.algorithm,
    publicKeySize: publicKeyInfo.size,
    extensions: parseExtensions(cert.extensions),
    sha1Fingerprint: toColonHex(new Uint8Array(sha1)),
    sha256Fingerprint: toColonHex(new Uint8Array(sha256))
  };
}

export async function decodeCsr (der) {
  const asn1 = asn1js.fromBER(der);

  if (asn1.result.error) {
    throw new Error(asn1.result.error);
  }

  const csr = new pkijs.CertificationRequest({ schema: asn1.result });

  const subject = formatDn(csr.subject.typesAndValues);
  const publicKeyInfo = getPublicKeyInfo(csr.subjectPublicKeyInfo);

  let extensions = { subjectAltName: null, basicConstraints: null, keyUsage: null, extKeyUsage: null };

  const extensionRequest = (csr.attributes || []).find(a => a.type === '1.2.840.113549.1.9.14');

  if (extensionRequest) {
    const requested = new pkijs.Extensions({ schema: extensionRequest.values[0] });

    extensions = parseExtensions(requested.extensions);
  }

  let signatureValid = null;

  try {
    signatureValid = await csr.verify();
  } catch (e) {
    signatureValid = null;
  }

  return {
    type: 'csr',
    subject,
    subjectString: dnToString(subject),
    signatureValid,
    signatureAlgorithm: oidName(csr.signatureAlgorithm.algorithmId, signatureAlgorithmNames),
    publicKeyAlgorithm: publicKeyInfo.algorithm,
    publicKeySize: publicKeyInfo.size,
    extensions
  };
}

