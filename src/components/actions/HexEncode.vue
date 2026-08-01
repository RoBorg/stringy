<template>
  <div>
    <NoteBlock warning v-if="text === ''">
      Nothing to encode
    </NoteBlock>
    <div class="card" v-else>
      <div class="card-header">
        <div class="card-title">Output</div>
      </div>

      <div class="card-content">
        <div class="field">
          <textarea v-model="outputString" readonly/>
        </div>
        <label class="checkbox">
          <input type="checkbox" v-model="format">
          Format output
        </label>
      </div>

      <div class="card-actions">
        <button type="button" class="btn btn-primary" @click="copy(outputString)">Copy</button>
      </div>
    </div>
  </div>
</template>

<script>
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
      outputString: {
        get () {
          let result = this.useFile
            ? [...new Uint8Array(this.inputFile.asArrayBuffer)]
            : [...new TextEncoder().encode(this.inputString)];

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
        },
        set () {
          // Do nothing
        }
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
