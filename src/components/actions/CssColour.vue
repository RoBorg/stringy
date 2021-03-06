<template>
  <div>
    <NoteBlock warning v-if="text === ''">
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
            <input type="color" v-model="chosenColour" @change="colour = chosenColour">
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
  import pureColor from 'pure-color';
  import action from './action.mixin';

  const isValid = (str) => {
    try {
      return pureColor.parse(str) !== undefined;
    } catch (e) {
      return false;
    }
  };

  export default {
    name: 'CssColour',
    mixins: [action],
    data () {
      return {
        colour: '',
        chosenColour: '#000000'
      };
    },
    computed: {
      error () {
        return !isValid(this.colour);
      },
      rgbColour () {
        try {
          return pureColor.parse(this.colour);
        } catch (e) {
          // Do nothing
        }

        return undefined;
      },
      asHex () {
        return this.error ? '' : pureColor.convert.rgb.hex(this.rgbColour);
      },
      asHsl () {
        if (this.error) {
          return '';
        }

        const hsl = pureColor.convert.rgb.hsl(this.rgbColour);

        if (this.rgbColour.length === 4) {
          hsl[3] = this.rgbColour[3];
        }

        return this.error ? '' : pureColor.convert.hsl.string(hsl).replace(/,/g, ', ');
      },
      asRgb () {
        return this.error ? '' : pureColor.convert.rgb.string(this.rgbColour).replace(/,/g, ', ');
      }
    },
    methods: {
      isValid
    },
    watch: {
      text: {
        handler (value) {
          this.colour = isValid(value) ? pureColor.convert.rgb.hex(pureColor.parse(value)) : '#000000';
          this.chosenColour = this.colour.substr(0, 7);
        },
        immediate: true
      }
    },
    canParse (str) {
      return isValid(str);
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
