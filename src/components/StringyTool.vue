<template>
  <div>
    <TestData v-if="showTestData"/>
    <div v-if="file">
      {{ file.name }}
      <md-button class="md-raised" style="vertical-align: middle;" @click="removeFile">Clear</md-button>
    </div>
    <template v-else>
      <md-field>
        <md-textarea v-model="inputString" ref="input" placeholder="Enter your text here"/>
      </md-field>

      <div class="input-info">
        <span class="amount">{{ characterCount }}</span> character<template v-if="characterCount != 1">s</template>,
        <span class="amount">{{ wordCount }}</span> word<template v-if="wordCount != 1">s</template>,
        <span class="amount">{{ lineCount }}</span> line<template v-if="lineCount != 1">s</template>
      </div>
    </template>
    <br>
    <md-divider/>
    <br>
    <md-radio v-model="selectedAction" value="auto">
        <strong>Auto ({{ autoFunction.name }})</strong>
    </md-radio>
    <md-radio v-model="selectedAction" v-for="option in actionOptions" :key="option.value" :value="option.value">
      {{ option.text }}
    </md-radio>
    <br>
    <md-divider/>
    <br>
    <component v-bind:is="currentComponent" :inputString="text" :inputFile="inputFile" :useFile="useFile"/>
  </div>
</template>

<script>
  import Copy from './Copy';
  import TestData from './TestData';
  import Unknown from './actions/Unknown';
  import actions from '../actions';
  import { paste as getClipboardContents } from '../helpers';
  import { mapMutations, mapState } from 'vuex';

  const unknown = {
    name: 'Unknown',
    component: Unknown
  };

  const components = {
    Copy: Copy,
    TestData: TestData
  };

  actions.map((action) => components[action.component.name] = action.component);

  export default {
    name: 'StringyTool',
    components,
    data() {
      return {
        inputString: '',
        stringType: null,
        selectedAction: 'auto',
        actions
      };
    },
    computed: {
      ...mapState(['file', 'fileContentsAsText', 'fileContentsAsArrayBuffer', 'fileContentsAsDataUrl', 'text', 'useFile']),
      showTestData () {
        return window.location.hash.match(/test/);
      },
      inputFile: function () {
        return {
          file: this.file,
          asArrayBuffer: this.fileContentsAsArrayBuffer,
          asDataUrl: this.fileContentsAsDataUrl,
          asText: this.fileContentsAsText,
        };
      },
      currentComponent: function () {
        if (this.selectedAction !== 'auto') {
          return actions[this.selectedAction].component;
        }

        return this.autoFunction.component;
      },
      autoFunction: function () {
        // TODO use file
        const str = this.text.trim();

        if (str === '') {
          return unknown;
        }

        for (const i in actions) {
          if (actions[i].component.canParse(str)) {
            return actions[i];
          }
        }

        return unknown;
      },
      characterCount: function () {
        return this.text.length;
      },
      wordCount: function () {
        return this.text.split(/\s+/).length;
      },
      lineCount: function () {
        return (this.text.match(/\r\n|\r|\n/g) || []).length + 1;
      },
      actionOptions: function () {
        const options = [];

        for (const i in this.actions) {
          options.push({
            value: i,
            text: this.actions[i].name
          });
        }

        options.sort((a, b) => a.text.localeCompare(b.text));

        return options;
      }
    },
    methods: {
      ...mapMutations(['removeFile', 'setText']),
      getClipboardContents,
      async paste () {
        this.inputString = await this.getClipboardContents();
      }
    },
    watch: {
      inputString: function () {
        this.setText(this.inputString);
      }
    }
  }
</script>

<style scoped lang="css">
  .input {
    width: 100%;
    height: 200px;
  }

  .input-info {
    background-color: #fefefe;
  }

  .input-info .amount {
    font-weight: bold;
  }

  .select-function {
    border: 1px solid red;
  }
</style>
