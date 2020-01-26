import Base64Encode from './components/actions/Base64Encode';
import Base64Decode from './components/actions/Base64Decode';
import CssColour from './components/actions/CssColour';
import DataUriDecode from './components/actions/DataUriDecode';
import HexEncode from './components/actions/HexEncode';
import HexDecode from './components/actions/HexDecode';
import IpAddress from './components/actions/IpAddress';
import JsonFormat from './components/actions/JsonFormat';
import SqlFormat from './components/actions/SqlFormat';
import UnixTimestamp from './components/actions/UnixTimestamp';
import Url from './components/actions/Url';
import UrlDecode from './components/actions/UrlDecode';
import UrlEncode from './components/actions/UrlEncode';

// Actions, in order of most specific first
// E.g. Base 64 Decode will match a unix timestamp, so make sure
// Unix Timestamp comes before it
export default [
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
    name: 'JSON Format',
    component: JsonFormat
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
  }
];
