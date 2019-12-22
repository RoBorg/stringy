<template>
  <div>
    <textarea class="output" v-model="outputString" readonly/>
  </div>
</template>

<script>
// TODO options, binary decode

export default {
  name: 'SqlFormat',
  props: {
    inputString: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      isImage: false,
      isText: true,
      dataSrc: '',
      asText: ''
    };
  },
  watch: {
    inputString: {
      immediate: true,
      handler: function (value) {
        const reader = new FileReader();
        const image = new Image();

        this.isImage = false;
        this.dataSrc = '';
        this.asText = '';

        reader.onloadend = () => {
          this.dataSrc = reader.result;

          image.onload = () => this.isImage = true;
          image.onerror = () => {
            this.asText = Base64.decode(reader.result.replace(/^.+?,/, ''));
          };
          image.src = this.dataSrc;
        };

        reader.readAsDataURL(this.toBinary(value));
      }
    }
  },
  methods: {
    toBinary (str) {
      const hexBytes = str.match(/[A-Fa-f0-9]{1,2}/g);
      const arrayBuffer = new ArrayBuffer(hexBytes.length);
      const intArray = new Uint8Array(arrayBuffer);

      this.isText = true;

      for (let i = 0; i < hexBytes.length; i++) {
        const byte = parseInt(hexBytes[i], 16);
        intArray[i] = byte;

        if (byte < 32) {
          this.isText = false;
        }
      }

      // Doesn't matter if the image isn't actually a jpeg
      return new Blob([intArray], {type: "image/jpeg"});
    },
    // https://developer.mozilla.org/en-US/docs/Web/API/WindowBase64/Base64_encoding_and_decoding
    // btoaUTF16 (sString) {
    //   const aUTF16CodeUnits = new Uint16Array(sString.length);

    //   Array.prototype.forEach.call(aUTF16CodeUnits, function (el, idx, arr) {
    //     arr[idx] = sString.charCodeAt(idx);
    //   });

    //   return btoa(String.fromCharCode.apply(null, new Uint8Array(aUTF16CodeUnits.buffer)));

    // },
    // atobUTF16 (sBase64) {
    //   const sBinaryString = atob(sBase64);
    //   const aBinaryView = new Uint8Array(sBinaryString.length);

    //   Array.prototype.forEach.call(aBinaryView, function (el, idx, arr) {
    //     arr[idx] = sBinaryString.charCodeAt(idx);
    //   });

    //   return String.fromCharCode.apply(null, new Uint16Array(aBinaryView.buffer));
    // }
  },
  canParse (str) {
    return /^[A-Fa-f0-9+/\s]+$/.test(str)
      && !/^\d+$/.test(str);
  }
}
</script>
