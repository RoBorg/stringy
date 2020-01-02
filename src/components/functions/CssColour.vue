<template>
  <div>
    <table class="data">
      <tbody>
        <tr>
          <th>Colour</th>
          <td>
            <div class="swatch" :style="`background-color: ${asHex}`"/>
          </td>
        </tr>
        <tr>
          <th>Hex</th>
          <td>
            {{ asHex }}
            <Copy :text="asHex"/>
          </td>
        </tr>
        <tr>
          <th>RGB</th>
          <td>
            {{ asRgb }}
            <Copy :text="asRgb"/>
          </td>
        </tr>
      </tbody>
    </table>

  </div>
</template>

<script>
// import xmlFormatter from 'xml-formatter';

// TODO options

export default {
  name: 'CssColour',
  props: {
    inputString: {
      type: String,
      required: true
    }
  },
  computed: {
    asHex: function () {
      return this.isHex() ? this.inputString : this.rgbToHex(this.inputString);
    },
    asRgb: function () {
      if (!this.isHex()) {
        return this.inputString;
      }

      const rgb = this.hexToRgb(this.inputString);

      return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
    }
  },
  methods: {
    isHex () {
      return /^#([0-9a-f]{3}){1,2}$/i.test(this.inputString);
    },
    // https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
    hexToRgb (hex) {
      // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
      const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
      hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
      });

      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : null;
    },
    componentToHex (c) {
      const hex = parseInt(c).toString(16);

      return hex.length == 1 ? '0' + hex : hex;
    },
    rgbToHex (str) {
      const result = /rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*/gi.exec(str);

      return '#'
        + this.componentToHex(result[1])
        + this.componentToHex(result[2])
        + this.componentToHex(result[3]);
    }
  },
  canParse (str) {
    return /^(#([0-9a-f]{3}){1,2}$|rgba?\()/i.test(str);
  },
}
</script>

<style scoped lang="css">
.swatch {
  width: 100px;
  height: 100px;
  border: 1px solid #000000;
}
</style>