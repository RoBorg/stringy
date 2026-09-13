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
          <td>{{ formatDateIso(date) }}</td>
        </tr>
        <tr>
          <th>ISO8601 Format</th>
          <td>
            {{ date.toISOString() }}
            <Copy :text="date.toISOString()"/>
          </td>
        </tr>
        <tr>
          <th>SQL Format</th>
          <td>
            {{ formatDateSql(date) }}
            <Copy :text="formatDateSql(date)"/>
          </td>
        </tr>
        <tr>
          <th>Difference From Now</th>
          <td>{{ fromNow(date, now) }}</td>
        </tr>
        <tr>
          <th>Difference From Now</th>
          <td>
            <template v-if="isInFuture">in</template>
            <span v-for="item in duration" style="display: inline-block; margin-right: 0.7em" :key="item.unit">
              {{ item.timeInUnit }}
              {{ item.unit }}

            </span>
            <template v-if="!isInFuture">ago</template>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  import action from './action.mixin';
  import { formatDateIso, formatDateSql, fromNow, durationParts } from '../../date-helpers';

  export default {
    name: 'UnixTimestamp',
    mixins: [action],
    data() {
      return {
        date: null,
        now: new Date(),
      }
    },
    created () {
      setInterval(() => this.now = new Date(), 1000);
    },
    computed: {
      isInFuture () {
        return this.date ? this.date.getTime() > Date.now() : null;
      },
      duration () {
        if (!this.date) {
          return null;
        }

        const parts = durationParts(this.date.getTime() - this.now.getTime());
        const units = ['years', 'months', 'days', 'hours', 'minutes', 'seconds'];
        const result = [];

        for (const unit of units) {
          const timeInUnit = parts[unit];

          if (timeInUnit > 0)
            result.push({
              timeInUnit,
              unit
            });
        }

        return result;
      }
    },
    methods: {
      formatDateIso,
      formatDateSql,
      fromNow
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
          this.date = new Date(parseInt(timestamp));

          if (isNaN(this.date.getTime())) {
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
