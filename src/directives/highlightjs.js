import hljs from 'highlight.js';

function apply (el, binding) {
  const code = el.querySelector('code') || el;
  const language = (code.className || 'plaintext').trim();
  const { value } = hljs.highlight(binding.value || '', { language, ignoreIllegals: true });

  code.innerHTML = value;
}

export default {
  beforeMount: apply,
  updated: apply
};
