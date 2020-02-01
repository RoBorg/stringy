<template>
  <div>
    <NoteBlock warning v-if="text === ''">
      Nothing to encode
    </NoteBlock>
    <md-card v-else>
      <md-card-header>
        <div class="md-title">Output</div>
      </md-card-header>

      <md-card-content>
        <md-field>
          <md-textarea v-model="outputString" readonly/>
        </md-field>
        <md-checkbox v-model="format">Format output</md-checkbox>
      </md-card-content>

      <md-card-actions>
        <md-button class="md-primary md-raised" @click="copy(outputString)">Copy</md-button>
      </md-card-actions>
    </md-card>
  </div>
</template>

<script>
  import { Base64 } from 'js-base64';
  import { copy } from '../../helpers';
  import action from './action.mixin';

  export default {
    name: 'HexEncode',
    mixins: [action],
    data() {
      return {
        format: false
      };
    },
    computed: {
      outputString: function () {
        let result;

        if (this.inputArrayBuffer) {
          result = [...new Uint8Array(this.inputArrayBuffer)];
        } else {
          result = [...new TextEncoder().encode(this.inputString)];
        }

        result = result.map(b => b.toString(16).padStart(2, '0'));

        if (this.format) {
          return result.reduce((accumulator, currentValue, index) => {
            const newLine = index % 16 ? '' : '\n';
            const space = index % 2 ? '' : ' ';
            const divider = newLine ? newLine : space;

            return accumulator + divider + currentValue;
          });
        }

        return result.join('');
      }
    },
    methods: {
      copy
    },
    canParse () {
      return false;
    }
  }
</script>
