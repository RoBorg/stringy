<template>
  <div>
    <TestData v-if="showTestData"/>
    <div v-if="file">
      {{ file.name }}
      <button type="button" class="btn" style="vertical-align: middle;" @click="removeFile">Clear</button>
    </div>
    <template v-else>
      <div class="field">
        <textarea v-model="inputString" ref="input" placeholder="Enter your text here"/>
      </div>

      <div class="input-info">
        <span class="amount">{{ characterCount }}</span> character<template v-if="characterCount != 1">s</template>,
        <span class="amount">{{ wordCount }}</span> word<template v-if="wordCount != 1">s</template>,
        <span class="amount">{{ lineCount }}</span> line<template v-if="lineCount != 1">s</template>
      </div>
    </template>
    <hr class="divider">
    <div class="tabs">
      <button type="button" class="tab" :class="{ active: actionsFilter === 'all' }" @click="filterActions('all')">All</button>
      <button type="button" class="tab" v-for="(label, type) in types" :key="type" :class="{ active: actionsFilter === type }" @click="filterActions(type)">{{ label }}</button>
    </div>
    <label class="radio">
      <input type="radio" v-model="selectedAction" value="auto">
      <strong>Auto ({{ autoFunction.name }})</strong>
    </label>
    <label class="radio" v-for="option in actionOptions" :key="option.value">
      <input type="radio" v-model="selectedAction" :value="option.value">
      {{ option.text }}
    </label>
    <hr class="divider">
    <component v-bind:is="currentComponent" :inputString="text" :inputFile="inputFile" :useFile="useFile"/>
  </div>
</template>

<script>
  import Copy from './Copy';
  import TestData from './TestData';
  import Unknown from './actions/Unknown';
  import { actions, types } from '../actions';
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
        actions,
        types,
        inputString: '',
        stringType: null,
        selectedAction: 'auto',
        actionsFilter: 'all'
      };
    },
    computed: {
      ...mapState(['file', 'fileContentsAsText', 'fileContentsAsArrayBuffer', 'fileContentsAsDataUrl', 'text', 'useFile']),
      showTestData () {
        return window.location.hash.match(/test/);
      },
      inputFile () {
        return {
          file: this.file,
          asArrayBuffer: this.fileContentsAsArrayBuffer,
          asDataUrl: this.fileContentsAsDataUrl,
          asText: this.fileContentsAsText,
        };
      },
      currentComponent () {
        if (this.selectedAction !== 'auto') {
          return actions[this.selectedAction].component;
        }

        return this.autoFunction.component;
      },
      autoFunction () {
        const str = (this.useFile ? this.fileContentsAsText : this.text).trim();

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
      characterCount () {
        return this.text.length;
      },
      wordCount () {
        return this.text.split(/\s+/).length;
      },
      lineCount () {
        return (this.text.match(/\r\n|\r|\n/g) || []).length + 1;
      },
      actionOptions () {
        const options = [];

        for (const i in this.actions) {
          if (
            (this.actionsFilter === 'all')
            || (this.actions[i].type === this.actionsFilter)
          ) {
            options.push({
              value: i,
              text: this.actions[i].name
            });
          }
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
      },
      filterActions (type) {
        this.actionsFilter = type;
      }
    },
    watch: {
      inputString () {
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
