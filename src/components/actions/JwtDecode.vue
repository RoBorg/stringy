<template>
  <div>
    <NoteBlock warning v-if="text.trim() === ''">
      Nothing to decode
    </NoteBlock>
    <NoteBlock alert v-else-if="error">
      {{ error }}
    </NoteBlock>
    <template v-else>
      <NoteBlock alert v-if="isExpired">
        This token expired {{ formatClaimDate(payload.exp) }}
      </NoteBlock>
      <NoteBlock warning v-else-if="isNotYetValid">
        This token is not valid until {{ formatClaimDate(payload.nbf) }}
      </NoteBlock>

      <div class="card">
        <div class="card-header">
          <div class="card-title">Header</div>
        </div>

        <div class="card-content">
          <pre v-highlightjs="headerString"><code class="json"></code></pre>
        </div>

        <div class="card-actions">
          <button type="button" class="btn btn-primary" @click="copy(headerString)">Copy</button>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <div class="card-title">Payload</div>
        </div>

        <div class="card-content">
          <pre v-highlightjs="payloadString"><code class="json"></code></pre>

          <table class="data" v-if="claims.length">
            <thead>
              <tr>
                <th>Claim</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="claim in claims" :key="claim.name">
                <th>{{ claim.label }}</th>
                <td>{{ claim.value }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="card-actions">
          <button type="button" class="btn btn-primary" @click="copy(payloadString)">Copy</button>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <div class="card-title">Signature</div>
        </div>

        <div class="card-content">
          <NoteBlock warning v-if="!signatureHex">
            No signature present (alg: {{ header.alg }})
          </NoteBlock>
          <template v-else>
            Algorithm: {{ header.alg }}<br>
            {{ signatureHex }}
            <Copy :text="signatureHex"/>
          </template>

          <NoteBlock tip>
            The signature is not verified. Use a JWT library with the relevant secret or public key to check authenticity.
          </NoteBlock>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
  import { Base64 } from 'js-base64';
  import action from './action.mixin';
  import { copy } from '../../helpers';
  import { formatDateIso, fromNow } from '../../date-helpers';

  const jwtRegEx = /^([A-Za-z0-9_-]+)\.([A-Za-z0-9_-]+)\.([A-Za-z0-9_-]*)$/;

  const claimLabels = {
    iss: 'Issuer',
    sub: 'Subject',
    aud: 'Audience',
    exp: 'Expires',
    nbf: 'Not Before',
    iat: 'Issued At',
    jti: 'JWT ID'
  };

  const dateClaims = ['exp', 'nbf', 'iat'];

  function decodePart (part) {
    return JSON.parse(Base64.decode(part));
  }

  function toHex (bytes) {
    return Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
  }

  export default {
    name: 'JwtDecode',
    mixins: [action],
    data () {
      return {
        error: '',
        header: null,
        payload: null,
        signatureHex: ''
      };
    },
    computed: {
      headerString () {
        return this.header ? JSON.stringify(this.header, null, 2) : '';
      },
      payloadString () {
        return this.payload ? JSON.stringify(this.payload, null, 2) : '';
      },
      isExpired () {
        return this.hasDateClaim('exp') && this.payload.exp * 1000 < Date.now();
      },
      isNotYetValid () {
        return this.hasDateClaim('nbf') && this.payload.nbf * 1000 > Date.now();
      },
      claims () {
        if (!this.payload) {
          return [];
        }

        return Object.keys(this.payload).map(name => ({
          name,
          label: claimLabels[name] || name,
          value: this.formatClaimValue(name, this.payload[name])
        }));
      }
    },
    methods: {
      copy,
      hasDateClaim (name) {
        return typeof this.payload?.[name] === 'number';
      },
      formatClaimDate (timestamp) {
        const date = new Date(timestamp * 1000);

        return `${formatDateIso(date)} (${fromNow(date)})`;
      },
      formatClaimValue (name, value) {
        if (dateClaims.includes(name) && typeof value === 'number') {
          return this.formatClaimDate(value);
        }

        return Array.isArray(value) ? value.join(', ') : String(value);
      }
    },
    watch: {
      text: {
        immediate: true,
        handler (value) {
          this.error = '';
          this.header = null;
          this.payload = null;
          this.signatureHex = '';

          const trimmed = value.trim();

          if (trimmed === '') {
            return;
          }

          const match = jwtRegEx.exec(trimmed);

          if (!match) {
            this.error = 'Not a valid JWT. Expected three dot-separated Base64URL segments.';
            return;
          }

          try {
            this.header = decodePart(match[1]);
            this.payload = decodePart(match[2]);
          } catch (e) {
            this.error = 'Unable to decode token: ' + e.message;
            return;
          }

          if (match[3]) {
            this.signatureHex = toHex(Base64.toUint8Array(match[3]));
          }
        }
      }
    },
    canParse (str) {
      const match = jwtRegEx.exec(str.trim());

      if (!match) {
        return false;
      }

      try {
        const header = decodePart(match[1]);
        decodePart(match[2]);

        return typeof header === 'object' && header !== null && typeof header.alg === 'string';
      } catch {
        return false;
      }
    }
  }
</script>
