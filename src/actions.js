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
import HtmlDecode from './components/actions/HtmlDecode';
import HtmlEncode from './components/actions/HtmlEncode';

export const types = {
  decoder: 'Decoders',
  encoder: 'Encoders',
  formatter: 'Formatters',
  other: 'Other'
};

// Actions, in order of most specific first
// E.g. Base 64 Decode will match a unix timestamp, so make sure
// Unix Timestamp comes before it
export const actions = [
  {
    name: 'CSS Colour',
    component: CssColour,
    type: 'other',
  },
  {
    name: 'Data URI Decode',
    component: DataUriDecode,
    type: 'decoder'
  },
  {
    name: 'Unix Timestamp',
    component: UnixTimestamp,
    type: 'other'
  },
  {
    name: 'IP Address',
    component: IpAddress,
    type: 'other'
  },
  {
    name: 'Hex Decode',
    component: HexDecode,
    type: 'decoder'
  },
  {
    name: 'Hex Encode',
    component: HexEncode,
    type: 'encoder'
  },
  {
    name: 'Base 64 Decode',
    component: Base64Decode,
    type: 'decoder'
  },
  {
    name: 'Base 64 Encode',
    component: Base64Encode,
    type: 'encoder'
  },
  {
    name: 'JSON Format',
    component: JsonFormat,
    type: 'formatter'
  },
  {
    name: 'SQL Format',
    component: SqlFormat,
    type: 'formatter'
  },
  {
    name: 'URL Information',
    component: Url,
    type: 'other'
  },
  {
    name: 'URL Decode',
    component: UrlDecode,
    type: 'decoder'
  },
  {
    name: 'URL Encode',
    component: UrlEncode,
    type: 'encoder'
  },
  {
    name: 'HTML Decode',
    component: HtmlDecode,
    type: 'decoder'
  },
  {
    name: 'HTML Encode',
    component: HtmlEncode,
    type: 'encoder'
  }
];
