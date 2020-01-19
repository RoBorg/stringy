<template>
  <div>
    <NoteBlock warning v-if="inputString === ''">
      Nothing to encode
    </NoteBlock>
    <template v-else>
      <md-card>
        <md-card-header>
          <div class="md-title">Output</div>
        </md-card-header>

        <md-card-content>
          <pre>{{ outputString }}</pre>
        </md-card-content>

        <md-card-actions>
          <md-button class="md-primary md-raised" @click="copy(outputString)">Copy</md-button>
        </md-card-actions>
      </md-card>
    </template>
  </div>
</template>

<script>
  import { copy } from '../../helpers';

  export default {
    name: 'UrlDecode',
    props: {
      inputString: {
        type: String,
        required: true
      }
    },
    computed: {
      outputString: function () {
        try {
          return decodeURIComponent(this.inputString);
        } catch (e) {
          return 'Invalid data';
        }
      },
    },
    methods: {
      copy
    },
    canParse (str) {
      if (!/%/.test(str)) {
        return false;
      }

      try {
          decodeURIComponent(this.inputString);

          return true;
        } catch (e) {
          return false;
        }
    }
  }
</script>
