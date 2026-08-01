<template>
  <div>
    <NoteBlock warning v-if="text.trim() === ''">
      Nothing to decode
    </NoteBlock>
    <NoteBlock alert v-else-if="items.length === 0">
      No certificate or CSR found. Paste a PEM block starting with "-----BEGIN CERTIFICATE-----" or "-----BEGIN CERTIFICATE REQUEST-----".
    </NoteBlock>
    <template v-else>
      <div class="card" v-for="(item, index) in items" :key="index">
        <div class="card-header">
          <div class="card-title">
            <template v-if="item.label === 'CERTIFICATE'">Certificate</template>
            <template v-else-if="isCsrLabel(item.label)">Certificate Signing Request</template>
            <template v-else>{{ item.label }}</template>
            <template v-if="items.length > 1">#{{ index + 1 }}</template>
          </div>
        </div>

        <div class="card-content">
          <NoteBlock alert v-if="item.error">
            {{ item.error }}
          </NoteBlock>
          <NoteBlock warning v-else-if="!item.data">
            Unsupported PEM block type: {{ item.label }}
          </NoteBlock>
          <template v-else>
            <NoteBlock alert v-if="item.data.type === 'certificate' && item.data.isExpired">
              This certificate expired {{ formatDate(item.data.notAfter) }}
            </NoteBlock>
            <NoteBlock warning v-else-if="item.data.type === 'certificate' && item.data.isNotYetValid">
              This certificate is not valid until {{ formatDate(item.data.notBefore) }}
            </NoteBlock>
            <NoteBlock warning v-if="item.data.signatureValid === false">
              The signature is not valid
            </NoteBlock>

            <table class="data">
              <tbody>
                <tr>
                  <th>Subject</th>
                  <td>
                    <template v-for="(attr, i) in item.data.subject" :key="i"><template v-if="i > 0">, </template>{{ attr.name }}=<a v-if="attrHref(attr)" :href="attrHref(attr)" target="_blank" rel="noopener">{{ attr.value }}</a><template v-else>{{ attr.value }}</template></template>
                    <Copy :text="item.data.subjectString"/>
                  </td>
                </tr>
                <template v-if="item.data.type === 'certificate'">
                  <tr>
                    <th>Issuer</th>
                    <td>
                      <template v-for="(attr, i) in item.data.issuer" :key="i"><template v-if="i > 0">, </template>{{ attr.name }}=<a v-if="attrHref(attr)" :href="attrHref(attr)" target="_blank" rel="noopener">{{ attr.value }}</a><template v-else>{{ attr.value }}</template></template>
                      <Copy :text="item.data.issuerString"/>
                    </td>
                  </tr>
                  <tr>
                    <th>Self-Signed</th>
                    <td>{{ item.data.selfSigned ? 'Yes' : 'No' }}</td>
                  </tr>
                  <tr>
                    <th>Serial Number</th>
                    <td>
                      {{ item.data.serialNumber }}
                      <Copy :text="item.data.serialNumber"/>
                    </td>
                  </tr>
                  <tr>
                    <th>Version</th>
                    <td>{{ item.data.version }}</td>
                  </tr>
                  <tr>
                    <th>Not Before</th>
                    <td>{{ formatDate(item.data.notBefore) }}</td>
                  </tr>
                  <tr>
                    <th>Not After</th>
                    <td>{{ formatDate(item.data.notAfter) }}</td>
                  </tr>
                </template>
                <tr>
                  <th>Signature Algorithm</th>
                  <td>{{ item.data.signatureAlgorithm }}</td>
                </tr>
                <tr v-if="item.data.signatureValid !== null">
                  <th>Signature Valid</th>
                  <td>{{ item.data.signatureValid ? 'Yes' : 'No' }}</td>
                </tr>
                <tr>
                  <th>Public Key Algorithm</th>
                  <td>
                    {{ item.data.publicKeyAlgorithm }}
                    <template v-if="item.data.publicKeySize">({{ item.data.publicKeySize }} bits)</template>
                  </td>
                </tr>
                <tr v-if="item.data.extensions.subjectAltName">
                  <th>Subject Alternative Names</th>
                  <td>
                    <div v-for="(name, i) in item.data.extensions.subjectAltName" :key="i">
                      {{ name.type }}:
                      <a v-if="sanHref(name)" :href="sanHref(name)" target="_blank" rel="noopener">{{ name.value }}</a>
                      <template v-else>{{ name.value }}</template>
                    </div>
                  </td>
                </tr>
                <tr v-if="item.data.extensions.basicConstraints">
                  <th>Basic Constraints</th>
                  <td>
                    CA: {{ item.data.extensions.basicConstraints.cA ? 'Yes' : 'No' }}
                    <template v-if="item.data.extensions.basicConstraints.pathLenConstraint !== undefined">
                      , Path Length: {{ item.data.extensions.basicConstraints.pathLenConstraint }}
                    </template>
                  </td>
                </tr>
                <tr v-if="item.data.extensions.keyUsage">
                  <th>Key Usage</th>
                  <td>{{ item.data.extensions.keyUsage.join(', ') }}</td>
                </tr>
                <tr v-if="item.data.extensions.extKeyUsage">
                  <th>Extended Key Usage</th>
                  <td>{{ item.data.extensions.extKeyUsage.join(', ') }}</td>
                </tr>
                <template v-if="item.data.type === 'certificate'">
                  <tr>
                    <th>SHA-1 Fingerprint</th>
                    <td>
                      {{ item.data.sha1Fingerprint }}
                      <Copy :text="item.data.sha1Fingerprint"/>
                    </td>
                  </tr>
                  <tr>
                    <th>SHA-256 Fingerprint</th>
                    <td>
                      {{ item.data.sha256Fingerprint }}
                      <Copy :text="item.data.sha256Fingerprint"/>
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
          </template>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
  import moment from 'moment';
  import action from './action.mixin';
  import { pemBlocks, decodeCertificate, decodeCsr, domainHref } from '../../cert-helpers';

  const csrLabels = ['CERTIFICATE REQUEST', 'NEW CERTIFICATE REQUEST'];

  const isCsrLabel = (label) => csrLabels.includes(label);

  const findBlocks = (str) => pemBlocks(str).filter(block => block.label === 'CERTIFICATE' || isCsrLabel(block.label));

  export default {
    name: 'SslCertificateDecode',
    mixins: [action],
    data () {
      return {
        items: []
      };
    },
    methods: {
      isCsrLabel,
      formatDate (date) {
        return moment(date).format() + ' (' + moment(date).fromNow() + ')';
      },
      attrHref (attr) {
        return attr.name === 'CN' ? domainHref(attr.value) : null;
      },
      sanHref (name) {
        return name.type === 'DNS' ? domainHref(name.value) : null;
      }
    },
    watch: {
      text: {
        immediate: true,
        handler: async function (value) {
          const blocks = pemBlocks(value);

          this.items = await Promise.all(blocks.map(async (block) => {
            if (!block.der) {
              return { label: block.label, error: 'Unable to decode PEM data' };
            }

            try {
              if (block.label === 'CERTIFICATE') {
                return { label: block.label, data: await decodeCertificate(block.der) };
              }

              if (isCsrLabel(block.label)) {
                return { label: block.label, data: await decodeCsr(block.der) };
              }

              return { label: block.label };
            } catch (e) {
              return { label: block.label, error: e.message };
            }
          }));
        }
      }
    },
    canParse (str) {
      return findBlocks(str).length > 0;
    }
  }
</script>
