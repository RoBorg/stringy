<template>
  <div>
    <table>
      <thead>
        <tr>
          <th>Element</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th>Date Time</th>
          <td>{{ date.toString() }}</td>
        </tr>
        <tr>
          <th>ISO Format</th>
          <td>{{ date.toISOString() }}</td>
        <tr>
          <th>SQL Format</th>
          <td>{{ date.toISOString() }}</td>
        </tr>
        <tr>
          <th>Difference From Now</th>
          <td></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
// TODO options

export default {
  name: 'UnixTimestamp',
  props: {
    inputString: {
      type: String,
      required: true
    }
  },
  computed: {
    outputString: function () {
      const url = this.url;

      return this.inputString;
    },
    date: function () {
      let timestamp = this.inputString.trim();

      if (timestamp.length === 10) {
        timestamp += '000';
      }

      console.log(timestamp)

      return new Date(parseInt(timestamp));
    }
  },
  canParse (str) {
    return /^(\d{10}|\d{13})$/.test(str);
  }
}
</script>
