import Base64Encode from './components/actions/Base64Encode';
import Base64Decode from './components/actions/Base64Decode';
import CssColour from './components/actions/CssColour';
import DataUriDecode from './components/actions/DataUriDecode';
import HexEncode from './components/actions/HexEncode';
import HexDecode from './components/actions/HexDecode';
import IpAddress from './components/actions/IpAddress';
import JsonDecode from './components/actions/JsonDecode';
import SqlFormat from './components/actions/SqlFormat';
import SslCertificate from './components/actions/SslCertificate';
import UnixTimestamp from './components/actions/UnixTimestamp';
import Unknown from './components/actions/Unknown';
import Url from './components/actions/Url';
import UrlDecode from './components/actions/UrlDecode';
import UrlEncode from './components/actions/UrlEncode';
import XmlFormat from './components/actions/XmlFormat';

/*
TODO
https://codebeautify.org/string-functions

Data URI
Base64
Base64 image
URL
XML format/validator/decode
(S)CSS
SQL
HTML format
html en/decode
hex (md5? sha? colour?)
ssh key (format conversion, public from private)
ssl cert https://www.npmjs.com/package/openssl.js
*/

// Actions, in order of most specific first
// E.g. Base 64 Decode will match a unix timestamp, so make sure
// Unix Timestamp comes before it
export default [
  {
    name: 'SSL Certificate',
    component: SslCertificate
  },
  {
    name: 'CSS Colour',
    component: CssColour
  },
  {
    name: 'Data URI Decode',
    component: DataUriDecode
  },
  {
    name: 'Unix Timestamp',
    component: UnixTimestamp
  },
  {
    name: 'IP Address',
    component: IpAddress
  },
  {
    name: 'Hex Decode',
    component: HexDecode
  },
  {
    name: 'Hex Encode',
    component: HexEncode
  },
  {
    name: 'Base 64 Decode',
    component: Base64Decode
  },
  {
    name: 'Base 64 Encode',
    component: Base64Encode
  },
  {
    name: 'JSON Decode',
    component: JsonDecode
  },
  {
    name: 'SQL Format',
    component: SqlFormat
  },
  {
    name: 'URL Information',
    component: Url
  },
  {
    name: 'URL Decode',
    component: UrlDecode
  },
  {
    name: 'URL Encode',
    component: UrlEncode
  },
  {
    name: 'XML Format',
    component: XmlFormat
  },
  {
    name: 'Unknown',
    component: Unknown
  }
];
