<template>
  <div>
    <TestData/>
    <div v-if="file">
      {{ file.name }}
      <md-button class="md-raised" style="vertical-align: middle;" @click="removeFile">Clear</md-button>
    </div>
    <template v-else>
      <md-field>
        <md-textarea v-model="inputString" placeholder="Enter your text here"/>
      </md-field>

      <div class="input-info">
        <span class="amount">{{ characterCount }}</span> character<template v-if="characterCount != 1">s</template>,
        <span class="amount">{{ wordCount }}</span> word<template v-if="wordCount != 1">s</template>,
        <span class="amount">{{ lineCount }}</span> line<template v-if="lineCount != 1">s</template>
      </div>
    </template>
    <select v-model="selectedAction" class="select-function">
      <option :value="null">
        Auto ({{ autoFunction.name }})
      </option>
      <option v-for="option in actionOptions" :key="option.value" :value="option.value">
        {{ option.text }}
      </option>
    </select>
    <component v-bind:is="currentComponent" :inputString="inputString"/>
  </div>
</template>

<script>
import Copy from './Copy';
import TestData from './TestData';
import Unknown from './actions/Unknown';
import actions from '../actions';
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
      inputString: 'aGVsbG8gd29ybGQ=', // TODO
      stringType: null,
      selectedAction: null,
      actions
    };
  },
  computed: {
    ...mapState(['file']),
    outputString: function () {
      return this.inputString;
    },
    currentComponent: function () {
      if (this.selectedAction) {
        return actions[this.selectedAction].component;
      }

      return this.autoFunction.component;
    },
    autoFunction: function () {
     const str = this.inputString.trim();

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
      return this.inputString.length;
    },
    wordCount: function () {
      return this.inputString.split(/\s+/).length;
    },
    lineCount: function () {
      return (this.inputString.match(/\r\n|\r|\n/g) || []).length + 1;
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
  methods: mapMutations(['removeFile'])
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

::v-deep .output {
  width: 100%;
  height: 200px;
}

</style>
