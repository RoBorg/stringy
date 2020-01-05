<template>
  <div>
    <pre>{{ outputString }}</pre>
    <Copy :text="outputString"/>
  </div>
</template>

<script>
// import { OpenSSL } from 'openssl.js';

(async function() {
  const { fileURLToPath } = await import('url');
  console.log(['---', fileURLToPath])
})()

//console.log(OpenSSL);



// TODO options

export default {
  name: 'SslCertificate',
  props: {
    inputString: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      certInfo: []
    };
  },
  computed: {
    outputString: function () {
      return this.certInfo.join('\n');
    },
  },
  watch: {
    inputString: {
      immediate: true,
      handler: function (value) {
      }
    }
  },
  canParse (str) {
    return /^-----BEGIN CERTIFICATE-----/.test(str);
  }
}
</script>

<style scoped lang="css">

</style>