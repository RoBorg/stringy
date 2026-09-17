import { describe, it, expect } from 'vitest';
import SqlFormat from '../SqlFormat.vue';
import { mountAction } from '../../../../test/helpers/mountAction';

describe('SqlFormat', () => {
  describe('canParse', () => {
    it('accepts SQL statements', () => {
      expect(SqlFormat.canParse('select * from users')).toBe(true);
      expect(SqlFormat.canParse('  UPDATE users SET a = 1')).toBe(true);
    });

    it('ignores leading comments when checking the statement type', () => {
      expect(SqlFormat.canParse('/* comment */ select 1')).toBe(true);
    });

    it('rejects non-SQL text', () => {
      expect(SqlFormat.canParse('hello world')).toBe(false);
    });
  });

  describe('output', () => {
    it('formats a SQL statement onto multiple indented lines', () => {
      const wrapper = mountAction(SqlFormat, { inputString: 'select a,b from t where a=1' });

      expect(wrapper.vm.outputString).toBe('select\n    a,\n    b\nfrom\n    t\nwhere\n    a = 1');
    });

    it('formats with tabs when selected', async () => {
      const wrapper = mountAction(SqlFormat, { inputString: 'select a, b from t' });

      await wrapper.setData({ indentType: 'tabs' });

      expect(wrapper.vm.outputString).toContain('\t');
    });
  });
});
