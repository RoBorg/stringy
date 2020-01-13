<template>
  <div>
    <NoteBlock warning v-if="inputString === ''">
      Nothing to parse
    </NoteBlock>
    <NoteBlock alert v-else-if="error">
      Invalid CSS colour
    </NoteBlock>
    <table class="data" v-else>
      <tbody>
        <tr>
          <th>Colour</th>
          <td>
            <input type="color" v-model="colour">
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
        <tr>
          <th>HSL</th>
          <td>
            {{ asHsl }}
            <Copy :text="asHsl"/>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  // TODO HSL
  export default {
    name: 'CssColour',
    props: {
      inputString: {
        type: String,
        required: true
      }
    },
    data () {
      return {
        colour: '',
        error: false
      };
    },
    computed: {
      asHex: function () {
        return this.colour;
      },
      asHsl: function () {
        if (!this.colour) {
          return ''
        }

        return 'TODO'; // TODO
      },
      asRgb: function () {
        if (!this.colour) {
          return ''
        }

        const rgb = this.hexToRgb(this.colour);

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

        return {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        };
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
    watch: {
      inputString: {
        handler () {
          this.colour = '';
          this.error = false;

          try {
            this.colour = this.isHex() ? this.inputString : this.rgbToHex(this.inputString);
          } catch (e) {
            this.error = true;
          }
        },
        immediate: true
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
