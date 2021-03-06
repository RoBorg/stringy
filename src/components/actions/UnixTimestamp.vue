<template>
  <div>
    <NoteBlock warning v-if="text === ''">
      No timestamp given
    </NoteBlock>
    <NoteBlock alert v-else-if="error">
      {{ error }}
    </NoteBlock>
    <table class="data" v-else>
      <thead>
        <tr>
          <th>Element</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th>Date Time</th>
          <td>{{ date.format() }}</td>
        </tr>
        <tr>
          <th>ISO8601 Format</th>
          <td>
            {{ date.toISOString() }}
            <Copy :text="date.toISOString()"/>
          </td>
        <tr>
          <th>SQL Format</th>
          <td>
            {{ date.format('Y-MM-DD HH:mm:ss') }}
            <Copy :text="date.format('Y-MM-DD HH:mm:ss')"/>
          </td>
        </tr>
        <tr>
          <th>Difference From Now</th>
          <td>{{ date.fromNow() }}</td>
        </tr>
        <tr>
          <th>Difference From Now</th>
          <td>
            <template v-if="isInFuture">in</template>
            <template v-for="item in duration">
              {{ item.timeInUnit }}
              {{ item.unit }}
            </template>
            <template v-if="!isInFuture">ago</template>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  import moment from 'moment';
  import action from './action.mixin';

  export default {
    name: 'UnixTimestamp',
    mixins: [action],
    data() {
      return {
        date: null,
        now: moment(),
      }
    },
    created () {
      setInterval(() => this.now = moment(), 1000);
    },
    computed: {
      isInFuture () {
        return this.date ? this.date.diff(moment()) > 0 : null;
      },
      duration () {
        if (!this.date) {
          return null;
        }

        const duration = moment.duration(this.date.diff(this.now));
        const parts = [];
        const units = ['years', 'months', 'days', 'hours', 'minutes', 'seconds'];

        for (let i in units) {
          const unit = units[i]
          const timeInUnit = Math.abs(duration[unit]());

          if (timeInUnit > 0)
            parts.push({
              timeInUnit,
              unit
            });
        }

        return parts;
      }
    },
    watch: {
      text: {
        immediate: true,
        handler (value) {
          let timestamp = value.trim();

          if (timestamp.length === 10) {
            timestamp += '000';
          }

          this.error = '';
          this.date = moment(parseInt(timestamp));

          if (!this.date.isValid()) {
            this.error = 'Invalid timestamp';
          }
        }
      }
    },
    canParse (str) {
      return /^(\d{10}|\d{13})$/.test(str);
    }
  }
</script>
